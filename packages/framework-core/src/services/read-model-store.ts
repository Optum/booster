/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BoosterConfig,
  EntityInterface,
  OptimisticConcurrencyUnexpectedVersionError,
  ProjectionGlobalError,
  EntitySnapshotEnvelope,
  BoosterMetadata,
  ProjectionInfo,
  ProjectionInfoReason,
  ProjectionMetadata,
  ReadModelAction,
  ReadModelInterface,
  SequenceKey,
  UUID,
} from '@boostercloud/framework-types'
import { createInstance, getLogger, Promises, retryIfError } from '@boostercloud/framework-common-helpers'
import { BoosterGlobalErrorDispatcher } from '../booster-global-error-dispatcher'
import { ReadModelSchemaMigrator } from '../read-model-schema-migrator'

export class ReadModelStore {
  public constructor(readonly config: BoosterConfig) {}

  public async project(entitySnapshotEnvelope: EntitySnapshotEnvelope, deleteEvent = false): Promise<void> {
    const logger = getLogger(this.config, 'ReadModelStore#project')
    const projections = this.getProjections(deleteEvent, entitySnapshotEnvelope)
    if (!projections) {
      logger.debug(
        `[ReadModelStore#project] No projections found for entity ${entitySnapshotEnvelope.entityTypeName}. Skipping...`
      )
      return
    }
    const entityMetadata = this.config.entities[entitySnapshotEnvelope.entityTypeName]
    await Promises.allSettledAndFulfilled(
      projections.flatMap((projectionMetadata: ProjectionMetadata<EntityInterface>) => {
        const readModelName = projectionMetadata.class.name
        const entityInstance = createInstance(entityMetadata.class, entitySnapshotEnvelope.value)
        const readModelIDList = this.joinKeyForProjection(entityInstance, projectionMetadata)
        const sequenceKey = this.sequenceKeyForProjection(entityInstance, projectionMetadata)
        if (!readModelIDList) {
          logger.warn(
            `Couldn't find the joinKey named ${projectionMetadata.joinKey} in entity snapshot of ${entityMetadata.class.name}. Skipping...`
          )
          return
        }

        return readModelIDList.map((readModelID: UUID) => {
          logger.debug(
            '[ReadModelStore#project] Projecting entity snapshot ',
            entitySnapshotEnvelope,
            ` to build new state of read model ${readModelName} with ID ${readModelID}`,
            sequenceKey ? ` sequencing by ${sequenceKey.name} with value ${sequenceKey.value}` : '',
            ` with deleteEvent: ${deleteEvent}`
          )

          return retryIfError(
            () =>
              this.applyProjectionToReadModel(
                entityInstance,
                projectionMetadata,
                readModelName,
                readModelID,
                deleteEvent,
                sequenceKey,
                entitySnapshotEnvelope
              ),
            OptimisticConcurrencyUnexpectedVersionError,
            logger
          )
        })
      })
    )
  }

  private getProjections(
    deletedProjection: boolean,
    entitySnapshotEnvelope: EntitySnapshotEnvelope
  ): Array<ProjectionMetadata<EntityInterface>> {
    if (deletedProjection) {
      const unProjections: Array<ProjectionMetadata<EntityInterface>> = this.entityUnProjections(entitySnapshotEnvelope)
      const projections: Array<ProjectionMetadata<EntityInterface>> = this.entityProjections(entitySnapshotEnvelope)
      if (projections?.length > 0) {
        if (!unProjections) {
          throw new Error(`Missing UnProjections for entity ${entitySnapshotEnvelope.entityTypeName}`)
        }
        const missingProjection = this.findFirstMissingProjection(projections, unProjections)
        if (missingProjection) {
          throw new Error(
            `Missing UnProjection for ReadModel ${missingProjection.class.name} with joinKey ${missingProjection.joinKey} for entity ${entitySnapshotEnvelope.entityTypeName}`
          )
        }
      }
      return unProjections
    }
    return this.entityProjections(entitySnapshotEnvelope)
  }

  private entityProjections(
    entitySnapshotEnvelope: EntitySnapshotEnvelope
  ): Array<ProjectionMetadata<EntityInterface>> {
    return this.config.projections[entitySnapshotEnvelope.entityTypeName]
  }

  private entityUnProjections(
    entitySnapshotEnvelope: EntitySnapshotEnvelope
  ): Array<ProjectionMetadata<EntityInterface>> {
    return this.config.unProjections[entitySnapshotEnvelope.entityTypeName]
  }

  private findFirstMissingProjection(
    sources: Array<ProjectionMetadata<EntityInterface>>,
    to: Array<ProjectionMetadata<EntityInterface>>
  ): ProjectionMetadata<EntityInterface> | undefined {
    return sources.find((source: ProjectionMetadata<EntityInterface>) => !this.someProjection(to, source))
  }

  private someProjection(
    sources: Array<ProjectionMetadata<EntityInterface>>,
    to: ProjectionMetadata<EntityInterface>
  ): boolean {
    const contains = (source: ProjectionMetadata<EntityInterface>) =>
      source.class.name === to.class.name && source.joinKey.toString() === to.joinKey.toString()
    return sources.some(contains)
  }

  private joinKeyForProjection(
    entity: EntityInterface,
    projectionMetadata: ProjectionMetadata<EntityInterface>
  ): Array<UUID> | undefined {
    const joinKey = (entity as any)[projectionMetadata.joinKey]
    if (!joinKey) {
      return undefined
    }
    return Array.isArray(joinKey) ? joinKey : [joinKey]
  }

  private sequenceKeyForProjection(
    entity: EntityInterface,
    projectionMetadata: ProjectionMetadata<EntityInterface>
  ): SequenceKey | undefined {
    const sequenceKeyName = this.config.readModelSequenceKeys[projectionMetadata.class.name]
    const sequenceKeyValue = (entity as any)[sequenceKeyName]
    if (sequenceKeyName && sequenceKeyValue) {
      return { name: sequenceKeyName, value: sequenceKeyValue }
    }
    return undefined
  }

  private async applyProjectionToReadModel(
    entity: EntityInterface,
    projectionMetadata: ProjectionMetadata<EntityInterface>,
    readModelName: string,
    readModelID: UUID,
    deleteEvent: boolean,
    sequenceKey?: SequenceKey,
    lastProjectedEntity?: EntitySnapshotEnvelope
  ): Promise<unknown> {
    const logger = getLogger(this.config, 'ReadModelStore#applyProjectionToReadModel')
    const readModel = await this.fetchReadModel(readModelName, readModelID, sequenceKey)
    let migratedReadModel: ReadModelInterface | undefined
    if (readModel) {
      migratedReadModel = await new ReadModelSchemaMigrator(this.config).migrate(readModel, readModelName)
    }
    const currentReadModelVersion: number = migratedReadModel?.boosterMetadata?.version ?? 0

    let newReadModel: any
    const projectionInfo: ProjectionInfo = {
      reason: deleteEvent ? ProjectionInfoReason.ENTITY_DELETED : ProjectionInfoReason.ENTITY_PROJECTED,
    }
    try {
      newReadModel = Array.isArray(entity[projectionMetadata.joinKey])
        ? this.projectionFunction(projectionMetadata)(entity, readModelID, migratedReadModel || null, projectionInfo)
        : this.projectionFunction(projectionMetadata)(entity, migratedReadModel || null, projectionInfo)
    } catch (e) {
      const globalErrorDispatcher = new BoosterGlobalErrorDispatcher(this.config)
      const error = await globalErrorDispatcher.dispatch(new ProjectionGlobalError(entity, migratedReadModel, e))
      if (error) throw error
    }

    if (newReadModel === ReadModelAction.Delete) {
      logger.debug(`Deleting read model ${readModelName} with ID ${readModelID}:`, migratedReadModel)
      return this.config.provider.readModels.delete(this.config, readModelName, migratedReadModel)
    } else if (newReadModel === ReadModelAction.Nothing) {
      logger.debug(
        `[ReadModelStore#project] Skipping actions for ${readModelName} with ID ${readModelID}:`,
        newReadModel
      )
      return
    }
    const schemaVersion: number =
      migratedReadModel?.boosterMetadata?.schemaVersion ?? this.config.currentVersionFor(readModelName)
    // Increment the read model version in 1 before storing
    newReadModel.boosterMetadata = {
      ...migratedReadModel?.boosterMetadata,
      version: currentReadModelVersion + 1,
      schemaVersion: schemaVersion,
      lastUpdateAt: new Date().toISOString(),
      lastProjectionInfo: {
        entityId: entity.id,
        entityName: lastProjectedEntity?.entityTypeName,
        entityUpdatedAt: lastProjectedEntity?.createdAt,
        projectionMethod: `${projectionMetadata.class.name}.${projectionMetadata.methodName}`,
      },
    } as BoosterMetadata
    logger.debug(
      `[ReadModelStore#project] Storing new version of read model ${readModelName} with ID ${readModelID}:`,
      newReadModel
    )

    return this.config.provider.readModels.store(this.config, readModelName, newReadModel, currentReadModelVersion)
  }

  /**
   * Gets a specific read model instance referencing it by ID when it's a regular read model
   * or by ID + sequenceKey when it's a sequenced read model
   */
  public async fetchReadModel(
    readModelName: string,
    readModelID: UUID,
    sequenceKey?: SequenceKey
  ): Promise<ReadModelInterface | undefined> {
    const logger = getLogger(this.config, 'ReadModelStore#fetchReadModel')
    logger.debug(
      `[ReadModelStore#fetchReadModel] Looking for existing version of read model ${readModelName} with ID = ${readModelID}` +
        (sequenceKey ? ` and sequence key ${sequenceKey.name} = ${sequenceKey.value}` : '')
    )
    const rawReadModels = await this.config.provider.readModels.fetch(
      this.config,
      readModelName,
      readModelID,
      sequenceKey
    )
    if (rawReadModels?.length) {
      if (rawReadModels.length > 1) {
        throw 'Got multiple objects for a request by Id. If this is a sequenced read model you should also specify the sequenceKey field.'
      } else if (rawReadModels.length === 1 && rawReadModels[0]) {
        const readModelMetadata = this.config.readModels[readModelName]
        return createInstance(readModelMetadata.class, rawReadModels[0])
      }
    }
    return undefined
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  public projectionFunction(projectionMetadata: ProjectionMetadata<EntityInterface>): Function {
    try {
      return (projectionMetadata.class as any)[projectionMetadata.methodName]
    } catch {
      throw new Error(`Couldn't load the ReadModel class ${projectionMetadata.class.name}`)
    }
  }
}
