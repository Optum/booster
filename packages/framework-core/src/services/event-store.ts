import {
  BOOSTER_SUPER_KIND,
  BoosterConfig,
  EntitySnapshotEnvelope,
  EventEnvelope,
  InvalidParameterError,
  NonPersistedEntitySnapshotEnvelope,
  ReducerGlobalError,
  ReducerMetadata,
  UUID,
} from '@boostercloud/framework-types'
import { createInstance, getLogger } from '@boostercloud/framework-common-helpers'
import { BoosterGlobalErrorDispatcher } from '../booster-global-error-dispatcher'
import { SchemaMigrator } from '../schema-migrator'
import { BoosterEntityMigrated } from '../core-concepts/data-migration/events/booster-entity-migrated'

const originOfTime = new Date(0).toISOString() // Unix epoch

export class EventStore {
  public constructor(readonly config: BoosterConfig) {}

  /**
   * Will fetch the latest snapshot for an entity by applying a reduction
   * since the time of creation of the last snapshot or from the origin of time
   * if no snapshot is found.
   *
   * Also, in order to make next calls faster, this method caches the newly calculated
   * snapshot storing it at the end of the process.
   */
  public async fetchEntitySnapshot(entityName: string, entityID: UUID): Promise<EntitySnapshotEnvelope | undefined> {
    const logger = getLogger(this.config, 'EventStore#fetchEntitySnapshot')
    logger.debug(`Fetching snapshot for entity ${entityName} with ID ${entityID}`)
    const latestSnapshotEnvelope = await this.loadLatestSnapshot(entityName, entityID)

    const lastVisitedTime = latestSnapshotEnvelope?.snapshottedEventCreatedAt ?? originOfTime
    const pendingEvents = await this.loadEventStreamSince(entityName, entityID, lastVisitedTime)

    if (pendingEvents.length <= 0) {
      return latestSnapshotEnvelope
    } else {
      logger.debug(`Looking for the reducer for entity ${entityName} with ID ${entityID}`)
      // In this assignment we discard the `createdAt` field because it's not needed in the reduction process
      let newEntitySnapshot: NonPersistedEntitySnapshotEnvelope | undefined = latestSnapshotEnvelope
      for (const pendingEvent of pendingEvents) {
        // We double check that what we are reducing is an event
        if (pendingEvent.kind === 'event') {
          newEntitySnapshot = await this.entityReducer(pendingEvent, newEntitySnapshot)
        }
      }

      if (!newEntitySnapshot) {
        logger.debug('No snapshot was found or reduced, returning')

        return newEntitySnapshot
      }

      if (newEntitySnapshot.entityID !== entityID) {
        logger.debug(
          `Migrated entity ${entityName} with previous ID ${entityID} to ${newEntitySnapshot?.typeName} with the new ID ${newEntitySnapshot?.entityID}`,
          newEntitySnapshot
        )
      } else {
        logger.debug(`Reduced new snapshot for entity ${entityName} with ID ${entityID}: `, newEntitySnapshot)
      }

      return await this.storeSnapshot(newEntitySnapshot)
    }
  }

  private async storeSnapshot(
    snapshot: NonPersistedEntitySnapshotEnvelope
  ): Promise<EntitySnapshotEnvelope | undefined> {
    const logger = getLogger(this.config, 'EventStore#storeSnapshot')
    try {
      logger.debug('Storing snapshot in the event store:', snapshot)
      return await this.config.provider.events.storeSnapshot(snapshot, this.config)
    } catch (e) {
      logger.error(
        `The snapshot for entity ${snapshot.typeName} with ID ${
          snapshot.entityID
        } couldn't be stored (Tried on ${new Date()})`,
        snapshot,
        '\nError:',
        e
      )
      return
    }
  }

  private async loadLatestSnapshot(entityName: string, entityID: UUID): Promise<EntitySnapshotEnvelope | undefined> {
    const logger = getLogger(this.config, 'EventStore#loadLatestSnapshot')
    logger.debug(`Loading latest snapshot for entity ${entityName} and ID ${entityID}`)
    const latestSnapshot = await this.config.provider.events.latestEntitySnapshot(this.config, entityName, entityID)
    if (latestSnapshot) {
      return new SchemaMigrator(this.config).migrate(latestSnapshot)
    }
    return undefined
  }

  private loadEventStreamSince(entityTypeName: string, entityID: UUID, timestamp: string): Promise<EventEnvelope[]> {
    const logger = getLogger(this.config, 'EventStore#loadEventStreamSince')
    logger.debug(`Loading list of pending events for entity ${entityTypeName} with ID ${entityID} since ${timestamp}`)
    return this.config.provider.events.forEntitySince(this.config, entityTypeName, entityID, timestamp)
  }

  private async entityReducer(
    eventEnvelope: EventEnvelope,
    latestSnapshot?: NonPersistedEntitySnapshotEnvelope
  ): Promise<NonPersistedEntitySnapshotEnvelope> {
    const logger = getLogger(this.config, 'EventStore#entityReducer')
    try {
      if (eventEnvelope.superKind && eventEnvelope.superKind === BOOSTER_SUPER_KIND) {
        if (eventEnvelope.typeName === BoosterEntityMigrated.name) {
          return this.toBoosterEntityMigratedSnapshot(eventEnvelope)
        }
      }

      logger.debug('Calling reducer with event: ', eventEnvelope, ' and entity snapshot ', latestSnapshot)
      const eventMetadata = this.config.events[eventEnvelope.typeName]
      const migratedEventEnvelope = await new SchemaMigrator(this.config).migrate(eventEnvelope)
      const eventInstance = createInstance(eventMetadata.class, migratedEventEnvelope.value)
      const entityMetadata = this.config.entities[migratedEventEnvelope.entityTypeName]
      const snapshotInstance = latestSnapshot ? createInstance(entityMetadata.class, latestSnapshot.value) : null
      const reducerMetadata = this.config.reducers[migratedEventEnvelope.typeName]
      try {
        const newEntity = this.reducerForEvent(reducerMetadata, migratedEventEnvelope.typeName)(
          eventInstance,
          snapshotInstance
        )

        const newSnapshot: NonPersistedEntitySnapshotEnvelope = {
          version: this.config.currentVersionFor(eventEnvelope.entityTypeName),
          kind: 'snapshot',
          superKind: migratedEventEnvelope.superKind,
          requestID: migratedEventEnvelope.requestID,
          entityID: migratedEventEnvelope.entityID,
          entityTypeName: migratedEventEnvelope.entityTypeName,
          typeName: migratedEventEnvelope.entityTypeName,
          value: newEntity,
          snapshottedEventCreatedAt: migratedEventEnvelope.createdAt,
        }
        logger.debug('Reducer result: ', newSnapshot)
        return newSnapshot
      } catch (e) {
        const globalErrorDispatcher = new BoosterGlobalErrorDispatcher(this.config)
        throw await globalErrorDispatcher.dispatch(
          new ReducerGlobalError(migratedEventEnvelope, eventInstance, snapshotInstance, reducerMetadata, e)
        )
      }
    } catch (e) {
      logger.error('Error when calling reducer', e)
      throw e
    }
  }

  private toBoosterEntityMigratedSnapshot(eventEnvelope: EventEnvelope): NonPersistedEntitySnapshotEnvelope {
    const logger = getLogger(this.config, 'EventStore#toBoosterEntityMigratedSnapshot')
    const value = eventEnvelope.value as BoosterEntityMigrated
    const entity = value.newEntity
    const className = value.newEntityName
    const boosterMigratedSnapshot: NonPersistedEntitySnapshotEnvelope = {
      version: this.config.currentVersionFor(className),
      kind: 'snapshot',
      superKind: eventEnvelope.superKind,
      requestID: eventEnvelope.requestID,
      entityID: entity.id,
      entityTypeName: className,
      typeName: className,
      value: entity,
      snapshottedEventCreatedAt: eventEnvelope.createdAt,
    }
    logger.debug('BoosterEntityMigrated result: ', boosterMigratedSnapshot)
    return boosterMigratedSnapshot
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  private reducerForEvent(reducerMetadata: ReducerMetadata, eventName: string): Function {
    const logger = getLogger(this.config, 'EventStore#reducerForEvent')
    if (!reducerMetadata) {
      throw new InvalidParameterError(`No reducer registered for event ${eventName}`)
    } else {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const methodName = reducerMetadata.methodName
        const reducer = (reducerMetadata.class as any)[methodName]
        logger.debug(`Found reducer for event ${eventName}: "${reducerMetadata.class.name}.${methodName}"`)
        return reducer
      } catch {
        throw new Error(`Couldn't load the Entity class ${reducerMetadata.class.name}`)
      }
    }
  }
}
