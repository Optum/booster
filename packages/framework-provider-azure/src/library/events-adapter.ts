import { CosmosClient, SqlQuerySpec } from '@azure/cosmos'
import {
  BoosterConfig,
  EntitySnapshotEnvelope,
  EventEnvelope,
  NonPersistedEntitySnapshotEnvelope,
  NonPersistedEventEnvelope,
  UUID,
} from '@boostercloud/framework-types'
import { getLogger } from '@boostercloud/framework-common-helpers'
import { eventsStoreAttributes } from '../constants'
import { partitionKeyForEvent, partitionKeyForSnapshot } from './partition-keys'
import { Context } from '@azure/functions'

// eslint-disable-next-line @typescript-eslint/no-magic-numbers
const originOfTime = new Date(0).toISOString()

export function rawEventsToEnvelopes(context: Context): Array<EventEnvelope> {
  return context.bindings.rawEvent as Array<EventEnvelope>
}

export async function readEntityEventsSince(
  cosmosDb: CosmosClient,
  config: BoosterConfig,
  entityTypeName: string,
  entityID: UUID,
  since?: string
): Promise<Array<EventEnvelope>> {
  const fromTime = since ? since : originOfTime
  const querySpec: SqlQuerySpec = {
    query:
      `SELECT * FROM c WHERE c["${eventsStoreAttributes.partitionKey}"] = @partitionKey ` +
      `AND c["${eventsStoreAttributes.sortKey}"] > @fromTime ORDER BY c["${eventsStoreAttributes.sortKey}"] ASC`,
    parameters: [
      {
        name: '@partitionKey',
        value: partitionKeyForEvent(entityTypeName, entityID),
      },
      {
        name: '@fromTime',
        value: fromTime,
      },
    ],
  }
  const { resources } = await cosmosDb
    .database(config.resourceNames.applicationStack)
    .container(config.resourceNames.eventsStore)
    .items.query(querySpec)
    .fetchAll()
  return resources as Array<EventEnvelope>
}

export async function readEntityLatestSnapshot(
  cosmosDb: CosmosClient,
  config: BoosterConfig,
  entityTypeName: string,
  entityID: UUID
): Promise<EntitySnapshotEnvelope | undefined> {
  const logger = getLogger(config, 'events-adapter#readEntityLatestSnapshot')
  const { resources } = await cosmosDb
    .database(config.resourceNames.applicationStack)
    .container(config.resourceNames.eventsStore)
    .items.query({
      query:
        `SELECT * FROM c WHERE c["${eventsStoreAttributes.partitionKey}"] = @partitionKey ` +
        `ORDER BY c["${eventsStoreAttributes.sortKey}"] DESC OFFSET 0 LIMIT 1`,
      parameters: [
        {
          name: '@partitionKey',
          value: partitionKeyForSnapshot(entityTypeName, entityID),
        },
      ],
    })
    .fetchAll()

  const snapshot = resources[0]
  if (snapshot) {
    logger.debug(
      `[EventsAdapter#readEntityLatestSnapshot] Snapshot found for entity ${entityTypeName} with ID ${entityID}:`,
      snapshot
    )
    return snapshot as EntitySnapshotEnvelope
  } else {
    logger.debug(
      `[EventsAdapter#readEntityLatestSnapshot] No snapshot found for entity ${entityTypeName} with ID ${entityID}.`
    )
    return undefined
  }
}

export async function storeEvents(
  cosmosDb: CosmosClient,
  eventEnvelopes: Array<NonPersistedEventEnvelope>,
  config: BoosterConfig
): Promise<Array<EventEnvelope>> {
  const logger = getLogger(config, 'events-adapter#storeEvents')
  logger.debug('[EventsAdapter#storeEvents] Storing EventEnvelopes with eventEnvelopes:', eventEnvelopes)
  const persistableEvents = []
  for (const eventEnvelope of eventEnvelopes) {
    const persistableEvent: EventEnvelope = {
      ...eventEnvelope,
      createdAt: new Date().toISOString(),
    }
    await cosmosDb
      .database(config.resourceNames.applicationStack)
      .container(config.resourceNames.eventsStore)
      .items.create({
        ...persistableEvent,
        [eventsStoreAttributes.partitionKey]: partitionKeyForEvent(
          eventEnvelope.entityTypeName,
          eventEnvelope.entityID
        ),
        [eventsStoreAttributes.sortKey]: persistableEvent.createdAt,
      })
    persistableEvents.push(persistableEvent)
  }
  logger.debug('[EventsAdapter#storeEvents] EventEnvelope stored')
  return persistableEvents
}

export async function storeSnapshot(
  cosmosDb: CosmosClient,
  snapshotEnvelope: NonPersistedEntitySnapshotEnvelope,
  config: BoosterConfig
): Promise<EntitySnapshotEnvelope> {
  const logger = getLogger(config, 'events-adapter#storeSnapshot')
  logger.debug('[EventsAdapter#storeSnapshot] Storing snapshot with snapshotEnvelope:', snapshotEnvelope)

  const partitionKey = partitionKeyForSnapshot(snapshotEnvelope.entityTypeName, snapshotEnvelope.entityID)
  /**
   * The sort key of the snapshot matches the sort key of the last event that generated it.
   * Entity snapshots can be potentially created by competing processes, and this way
   * of storing the data makes snapshot creation an idempotent operation, allowing us to
   * aggressively cache snapshots. If the snapshot already exists, it will be silently overwritten.
   */
  const sortKey = snapshotEnvelope.snapshottedEventCreatedAt

  const container = cosmosDb.database(config.resourceNames.applicationStack).container(config.resourceNames.eventsStore)

  /* TODO: As the sortKey is not part of an unique key in the table by default, there's no easy way to
   * ensure that a snapshot is created only once, so we need to check if it exists first.
   * This is not ideal, but conditional writes doesn't seem to have a simple solution in CosmosDB at
   * the moment. We should revisit this in the future.
   *
   * Notice that while this implementation can potentially fail to prevent an extra snapshot to be created,
   * the existence of such extra snapshot has no impact on the way Booster works. This check is here
   * because we want to avoid snapshots to be created out of control in scenarios where a big number
   * of event handlers are requesting the latest state of the same entity.
   */
  const { resources } = await container.items
    .query({
      query: 'SELECT * FROM c WHERE c.partitionKey = @partitionKey AND c.sortKey = @sortKey',
      parameters: [
        {
          name: '@partitionKey',
          value: partitionKey,
        },
        {
          name: '@sortKey',
          value: sortKey,
        },
      ],
    })
    .fetchAll()

  if (resources.length > 0) {
    throw new Error('Snapshot already exists. skipping...')
  }

  const persistableEntitySnapshot: EntitySnapshotEnvelope = {
    ...snapshotEnvelope,
    createdAt: snapshotEnvelope.snapshottedEventCreatedAt,
    persistedAt: new Date().toISOString(),
  }
  await container.items.create({
    ...persistableEntitySnapshot,
    [eventsStoreAttributes.partitionKey]: partitionKey,
    [eventsStoreAttributes.sortKey]: sortKey,
  })
  logger.debug('Snapshot stored', snapshotEnvelope)
  return persistableEntitySnapshot
}

export async function storeProcessedEvents(
  cosmosDb: CosmosClient,
  eventEnvelopes: Array<EventEnvelope>,
  config: BoosterConfig
): Promise<Array<{ id: string }>> {
  const logger = getLogger(config, 'events-adapter#storeProcessedEvents')
  logger.debug('[EventsAdapter#storeProcessedEvents] Storing EventEnvelope with eventEnvelopes:', eventEnvelopes)
  const processedEvents = []
  for (const eventEnvelope of eventEnvelopes) {
    const processedEvent: { id: string } = {
      id: eventEnvelope.id as string,
    }
    await cosmosDb
      .database(config.resourceNames.applicationStack)
      .container(config.resourceNames.processedEventsStore)
      .items.create({
        processedEvent,
      })
    processedEvents.push(processedEvent)
  }
  return processedEvents
}

export async function fetchProcessedEvents(
  cosmosDb: CosmosClient,
  eventEnvelope: EventEnvelope,
  config: BoosterConfig
): Promise<Array<{ id: string }>> {
  const logger = getLogger(config, 'events-adapter#fetchProcessedEvents')
  logger.debug('[EventsAdapter#fetchProcessedEvents] Searching processed events for ID:', eventEnvelope.id)
  const querySpec: SqlQuerySpec = {
    query: 'SELECT * FROM c WHERE c["id"] = @eventId ',
    parameters: [
      {
        name: '@eventId',
        value: eventEnvelope.id as string,
      },
    ],
  }
  const { resources } = await cosmosDb
    .database(config.resourceNames.applicationStack)
    .container(config.resourceNames.processedEventsStore)
    .items.query(querySpec)
    .fetchAll()
  return resources
}
