/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BoosterConfig,
  BoosterMetadata,
  EntityInterface,
  EntityMetadata,
  EntitySnapshotEnvelope,
  FilterFor,
  OptimisticConcurrencyUnexpectedVersionError,
  ProjectionGlobalError,
  ProjectionMetadata,
  ProjectionResult,
  ReadModelAction,
  ReadModelInterface,
  ReadModelJoinKeyFunction,
  SequenceKey,
  UUID,
} from '@boostercloud/framework-types'
import { createInstance, getLogger, Promises, retryIfError } from '@boostercloud/framework-common-helpers'
import { readModelSearcher } from './read-model-searcher'
import { ReadModelSchemaMigrator } from '../read-model-schema-migrator'
import { BoosterGlobalErrorDispatcher } from '../booster-global-error-dispatcher'

export class ReadModelStore {
  public constructor(readonly config: BoosterConfig) {}

  public async project(entitySnapshotEnvelope: EntitySnapshotEnvelope): Promise<void> {
    const logger = getLogger(this.config, 'ReadModelStore#projectEntities')
    const projections = this.config.projections[entitySnapshotEnvelope.entityTypeName]
    if (!projections) {
      logger.debug(`No projections found for entity ${entitySnapshotEnvelope.entityTypeName}. Skipping...`)
      return
    }
    logger.debug(
      `Projections found for entity ${entitySnapshotEnvelope.entityTypeName}: ${JSON.stringify(projections)}`
    )
    const entityMetadata = this.config.entities[entitySnapshotEnvelope.entityTypeName]
    const entityInstance = createInstance(entityMetadata.class, entitySnapshotEnvelope.value)
    const projectReadModelPromises = projections.flatMap(
      (projectionMetadata: ProjectionMetadata<EntityInterface, ReadModelInterface>) => {
        logger.debug(
          `Projecting entity snapshot ${entitySnapshotEnvelope} to build new state of read model with projectionMetadata ${JSON.stringify(
            projectionMetadata
          )}`
        )
        const readModelName = projectionMetadata.class.name
        const sequenceKey = this.sequenceKeyForProjection(entityInstance, projectionMetadata)
        return this.projectEntity(
          entityInstance,
          projectionMetadata,
          entityMetadata,
          entitySnapshotEnvelope,
          readModelName,
          sequenceKey
        )
      }
    )
    await Promises.allSettledAndFulfilled(projectReadModelPromises)
  }

  private sequenceKeyForProjection(
    entity: EntityInterface,
    projectionMetadata: ProjectionMetadata<EntityInterface, ReadModelInterface>
  ): SequenceKey | undefined {
    const sequenceKeyName = this.config.readModelSequenceKeys[projectionMetadata.class.name]
    const sequenceKeyValue = (entity as any)[sequenceKeyName]
    if (sequenceKeyName && sequenceKeyValue) {
      return { name: sequenceKeyName, value: sequenceKeyValue }
    }
    return undefined
  }

  private async projectEntity(
    entityInstance: EntityInterface,
    projectionMetadata: ProjectionMetadata<EntityInterface, ReadModelInterface>,
    entityMetadata: EntityMetadata,
    entitySnapshotEnvelope: EntitySnapshotEnvelope,
    readModelName: string,
    sequenceKey?: SequenceKey
  ): Promise<Array<PromiseSettledResult<unknown>> | undefined> {
    const currentReadModels: Array<ReadModelInterface> = await this.getReadModels(
      entityInstance,
      projectionMetadata,
      entityMetadata
    )
    if (currentReadModels && currentReadModels.length > 0) {
      const existingReadModelsProjections: Array<Promise<unknown>> = []
      for (const currentReadModel of currentReadModels) {
        const newProjections: Array<Promise<unknown>> = await this.projectionsForReadModels(
          entitySnapshotEnvelope,
          readModelName,
          sequenceKey,
          projectionMetadata,
          entityInstance,
          entityMetadata,
          currentReadModel
        )
        existingReadModelsProjections.push(...newProjections)
      }
      return Promises.allSettledAndFulfilled(existingReadModelsProjections)
    }
    const newProjections: Array<Promise<unknown>> = await this.projectionsForReadModels(
      entitySnapshotEnvelope,
      readModelName,
      sequenceKey,
      projectionMetadata,
      entityInstance,
      entityMetadata
    )
    return Promises.allSettledAndFulfilled(newProjections)
  }

  private async projectionsForReadModels(
    entitySnapshotEnvelope: EntitySnapshotEnvelope,
    readModelName: string,
    sequenceKey: any,
    projectionMetadata: ProjectionMetadata<EntityInterface, ReadModelInterface>,
    entityInstance: EntityInterface,
    entityMetadata: EntityMetadata,
    currentReadModel?: ReadModelInterface
  ): Promise<Array<Promise<unknown>>> {
    const projections: Array<Promise<unknown>> = []
    const logger = getLogger(this.config, 'ReadModelStore#projectionsForReadModels')
    if (this.isJoinKeyByEntity(projectionMetadata.joinKey)) {
      const entityJoinKey = (entityInstance as any)[projectionMetadata.joinKey]
      if (!entityJoinKey) {
        logger.warn(
          `Couldn't find the joinKey named ${projectionMetadata} in entity snapshot of ${entityMetadata.class.name}. Skipping...`
        )
        return []
      }
      const entitiesJoinKeys: Array<UUID> = Array.isArray(entityJoinKey) ? entityJoinKey : [entityJoinKey]
      // A new Read Model with JoinKey by entity needs to be projected using a JoinKey with an entity query. We don't have a previous read model, but we have the new id from the entity
      for (const readModelId of entitiesJoinKeys) {
        const readModel = currentReadModel?.id === readModelId ? currentReadModel : undefined
        projections.push(
          this.projectAndStoreReadModelWithRetry(
            entitySnapshotEnvelope,
            readModelName,
            sequenceKey,
            entityInstance,
            projectionMetadata,
            readModelId,
            readModel
          )
        )
      }
    } else {
      // A new Read Model with JoinKey by ReadModel needs to be projected using a JoinKey with a read model query. We don't have a previous read model nor the new id as we don't have an entity field
      projections.push(
        this.projectAndStoreReadModelWithRetry(
          entitySnapshotEnvelope,
          readModelName,
          sequenceKey,
          entityInstance,
          projectionMetadata,
          currentReadModel?.id,
          currentReadModel
        )
      )
    }
    return projections
  }

  private async projectAndStoreReadModelWithRetry(
    entitySnapshotEnvelope: EntitySnapshotEnvelope,
    readModelName: string,
    sequenceKey: SequenceKey | undefined,
    entityInstance: EntityInterface,
    projectionMetadata: ProjectionMetadata<EntityInterface, ReadModelInterface>,
    readModelId?: UUID,
    currentReadModel?: ReadModelInterface
  ): Promise<unknown> {
    const logger = getLogger(this.config, 'ReadModelStore#projectAndStoreReadModelWithRetry')
    logger.debug(
      'Projecting entity snapshot ',
      entitySnapshotEnvelope,
      ` to build new state of read model ${readModelName} with ID ${currentReadModel?.id || readModelId}`,
      sequenceKey ? ` sequencing by ${sequenceKey.name} with value ${sequenceKey.value}` : ''
    )

    return retryIfError(
      (tryNumber?: number) =>
        this.applyProjectionToReadModel(
          entityInstance,
          projectionMetadata,
          currentReadModel,
          entitySnapshotEnvelope,
          readModelId,
          sequenceKey,
          tryNumber
        ),
      OptimisticConcurrencyUnexpectedVersionError,
      logger
    )
  }

  public async getReadModels(
    entityInstance: EntityInterface,
    projectionMetadata: ProjectionMetadata<EntityInterface, ReadModelInterface>,
    entityMetadata: EntityMetadata
  ): Promise<Array<ReadModelInterface>> {
    const logger = getLogger(this.config, 'ReadModelStore#getReadModels')
    logger.debug(
      `Looking for ReadModels for entity ${JSON.stringify(entityInstance)} using Filter ${projectionMetadata.joinKey}`
    )
    const readModelName = projectionMetadata.class.name
    const readModelMetadata = this.config.readModels[readModelName]
    const filter = this.filterForProjection(entityInstance, projectionMetadata, entityMetadata)
    if (!filter) {
      return []
    }
    logger.debug(
      `Calling ReadModelSearcher searching for ReadModels for entity ${readModelMetadata.class.name} using Filter ${filter}`
    )
    const rawReadModels = (await readModelSearcher<ReadModelInterface>(this.config, readModelMetadata.class)
      .filter(filter)
      .paginatedVersion(false)
      .search()) as Array<ReadModelInterface>
    return this.instanceReadModels(readModelName, rawReadModels)
  }

  instanceReadModels(
    readModelName: string,
    rawReadModels: Array<ReadModelInterface> | undefined
  ): Array<ReadModelInterface> {
    if (!rawReadModels?.length) {
      return []
    }
    const readModelMetadata = this.config.readModels[readModelName]
    return rawReadModels.map((rawReadModel) => createInstance(readModelMetadata.class, rawReadModel))
  }

  private async applyProjectionToReadModel(
    entity: EntityInterface,
    projectionMetadata: ProjectionMetadata<EntityInterface, ReadModelInterface>,
    currentReadModel?: ReadModelInterface,
    lastProjectedEntity?: EntitySnapshotEnvelope,
    currentReadModelID?: UUID,
    sequenceKey?: SequenceKey,
    tryNumber?: number
  ): Promise<unknown> {
    const logger = getLogger(this.config, 'ReadModelStore#applyProjectionToReadModel')
    const readModelName = projectionMetadata.class.name
    const readModelID = currentReadModelID ?? currentReadModel?.id

    if (tryNumber && tryNumber > 1) {
      // In case of optimistic concurrency error, we need to fetch the current read model version and retry
      logger.debug(
        `OptimisticConcurrencyUnexpectedVersionError (version=${
          currentReadModel?.boosterMetadata?.version
        } and expectedDatabaseVersion=${
          currentReadModel?.boosterMetadata?.version ?? 0
        }). Looking for an updated version of read model ${readModelName} with ID = ${readModelID}` +
          (sequenceKey ? ` and sequence key ${sequenceKey.name} = ${sequenceKey.value}` : '')
      )

      currentReadModel = await this.fetchReadModel(readModelName, readModelID, sequenceKey)
      logger.debug(
        `Current read model ${readModelName} with ID ${readModelID} updated with version = ${currentReadModel?.boosterMetadata?.version}` +
          (sequenceKey ? ` and sequence key ${sequenceKey.name} = ${sequenceKey.value}` : '')
      )
    }
    let migratedReadModel: ReadModelInterface | undefined
    if (currentReadModel) {
      migratedReadModel = await new ReadModelSchemaMigrator(this.config).migrate(currentReadModel, readModelName)
    }
    const currentDatabaseVersion: number = migratedReadModel?.boosterMetadata?.version ?? 0

    let newReadModel: any
    try {
      newReadModel = await this.callFunction(projectionMetadata, entity, migratedReadModel, readModelID)
    } catch (e) {
      const globalErrorDispatcher = new BoosterGlobalErrorDispatcher(this.config)
      const error = await globalErrorDispatcher.dispatch(new ProjectionGlobalError(entity, migratedReadModel, e))
      if (error) throw error
    }

    if (newReadModel === ReadModelAction.Delete) {
      logger.debug(`Deleting read model ${readModelName} with ID ${readModelID}:`, migratedReadModel)
      return this.config.provider.readModels.delete(this.config, readModelName, migratedReadModel)
    } else if (newReadModel === ReadModelAction.Nothing) {
      logger.debug(`Skipping actions for ${readModelName} with ID ${readModelID}:`, newReadModel)
      return
    }

    return await this.store(
      entity,
      projectionMetadata,
      readModelID,
      readModelName,
      migratedReadModel,
      newReadModel,
      currentDatabaseVersion,
      lastProjectedEntity
    )
  }

  private async store(
    entity: EntityInterface,
    projectionMetadata: ProjectionMetadata<EntityInterface, ReadModelInterface>,
    readModelID: UUID | undefined,
    readModelName: string,
    migratedReadModel: ReadModelInterface | undefined,
    newReadModel: any,
    expectedCurrentDatabaseVersion: number,
    lastProjectedEntity?: EntitySnapshotEnvelope
  ): Promise<unknown> {
    const logger = getLogger(this.config, 'ReadModelStore#store')
    const schemaVersion: number =
      migratedReadModel?.boosterMetadata?.schemaVersion ?? this.config.currentVersionFor(readModelName)
    // Increment the read model version in 1 before storing
    const newReadModelVersion = expectedCurrentDatabaseVersion + 1
    newReadModel.boosterMetadata = {
      ...migratedReadModel?.boosterMetadata,
      version: newReadModelVersion,
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
      `Storing new version of read model ${readModelName} with ID ${readModelID}, version ${newReadModel.boosterMetadata.version} and expected database version ${expectedCurrentDatabaseVersion}:`,
      newReadModel
    )
    return this.config.provider.readModels.store(
      this.config,
      readModelName,
      newReadModel,
      expectedCurrentDatabaseVersion
    )
  }

  /**
   * Gets a specific read model instance referencing it by ID when it's a regular read model
   * or by ID + sequenceKey when it's a sequenced read model
   */
  async fetchReadModel(
    readModelName: string,
    readModelID: UUID | undefined,
    sequenceKey?: SequenceKey
  ): Promise<ReadModelInterface | undefined> {
    if (!readModelID) {
      return undefined
    }
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

  public async callFunction<TReadModel extends ReadModelInterface>(
    projectionMetadata: ProjectionMetadata<EntityInterface, ReadModelInterface>,
    entity: EntityInterface,
    migratedReadModel: ReadModelInterface | undefined,
    readModelID: UUID | undefined
  ): Promise<ProjectionResult<TReadModel> | undefined> {
    try {
      const projectionMetadataJoinKey = projectionMetadata.joinKey
      const projectionFunction = this.getProjectionFunction(projectionMetadata)
      if (this.isJoinKeyByEntity(projectionMetadataJoinKey)) {
        return Array.isArray(entity[projectionMetadataJoinKey])
          ? projectionFunction(entity, readModelID, migratedReadModel || null)
          : projectionFunction(entity, migratedReadModel || null)
      }
      return projectionFunction(entity, readModelID, migratedReadModel || null)
    } catch (e) {
      const globalErrorDispatcher = new BoosterGlobalErrorDispatcher(this.config)
      const error = await globalErrorDispatcher.dispatch(new ProjectionGlobalError(entity, migratedReadModel, e))
      if (error) throw error
    }
    return undefined
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  getProjectionFunction(projectionMetadata: ProjectionMetadata<EntityInterface, ReadModelInterface>): Function {
    try {
      return (projectionMetadata.class as any)[projectionMetadata.methodName]
    } catch {
      throw new Error(`Couldn't load the ReadModel class ${projectionMetadata.class.name}`)
    }
  }

  private filterForProjection(
    entity: EntityInterface,
    projectionMetadata: ProjectionMetadata<EntityInterface, ReadModelInterface>,
    entityMetadata: EntityMetadata
  ): FilterFor<ReadModelInterface> | undefined {
    const logger = getLogger(this.config, 'ReadModelStore#filterForProjection')
    const projectionMetadataJoinKey = projectionMetadata.joinKey
    logger.debug(`Calculating filter for projection for ReadModels using Filter ${projectionMetadataJoinKey}`)
    if (this.isJoinKeyByEntity(projectionMetadataJoinKey)) {
      return this.filterForEntityProjection(entity, projectionMetadata, entityMetadata)
    }

    return this.filterForReadModelProjection(entity, projectionMetadata, entityMetadata)
  }

  private filterForEntityProjection<TEntity extends EntityInterface>(
    entity: EntityInterface,
    projectionMetadata: ProjectionMetadata<EntityInterface, ReadModelInterface>,
    entityMetadata: EntityMetadata
  ): FilterFor<ReadModelInterface> | undefined {
    const logger = getLogger(this.config, 'ReadModelStore#filterForEntityProjection')
    const projectionMetadataJoinKey = projectionMetadata.joinKey as keyof TEntity
    const entityJoinKey = (entity as any)[projectionMetadataJoinKey]
    if (!entityJoinKey) {
      logger.warn(
        `Couldn't find the joinKey ${projectionMetadata.joinKey} in entity snapshot of ${entityMetadata.class.name}. Skipping...`
      )
      return
    }
    const ids = Array.isArray(entityJoinKey) ? entityJoinKey : [entityJoinKey]
    if (!ids || ids.length === 0) {
      logger.debug('No ids found for entity projection. Skipping...')
      return undefined
    }
    logger.debug(`Filtering for entity projection with ids ${ids}`)
    return {
      id: {
        in: ids,
      },
    }
  }

  private filterForReadModelProjection(
    entity: EntityInterface,
    projectionMetadata: ProjectionMetadata<EntityInterface, ReadModelInterface>,
    entityMetadata: EntityMetadata
  ): FilterFor<ReadModelInterface> | undefined {
    const logger = getLogger(this.config, 'ReadModelStore#filterForReadModelProjection')
    const joinKeyForProjection = projectionMetadata.joinKey as ReadModelJoinKeyFunction<
      EntityInterface,
      ReadModelInterface
    >
    if (!joinKeyForProjection) {
      logger.warn(
        `Couldn't find the joinKey ${projectionMetadata.joinKey} in entity snapshot of ${entityMetadata.class.name}. Skipping...`
      )
      return
    }
    return joinKeyForProjection(entity)
  }

  private isJoinKeyByEntity<TEntity extends EntityInterface, TReadModel extends ReadModelInterface>(
    projectionMetadataJoinKey: keyof TEntity | ReadModelJoinKeyFunction<TEntity, TReadModel>
  ): projectionMetadataJoinKey is keyof TEntity {
    return typeof projectionMetadataJoinKey === 'string'
  }
}
