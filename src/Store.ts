import { action, makeObservable, observable, runInAction, toJS } from 'mobx'
import pick from 'lodash/pick'
import {
  fetchWithRetry,
  deriveIdQueryStrings,
  parseErrors,
  parseErrorPointer,
  requestUrl,
  newId
} from './utils'
import cloneDeep from 'lodash/cloneDeep'
import Model, { IModelInitOptions } from 'Model'
import { ModelClass, IErrorMessages, IQueryParams, IRecordObject, IRequestParamsOpts, JSONAPIDataObject, JSONAPIErrorObject, ModelClassArray } from 'interfaces/global'

interface IStoreInitOptions {
  baseUrl?: string
  defaultFetchOptions?: RequestInit
  headersOfInterest?: string[]
  retryOptions?: {
    attempts?: number,
    delay?: number
  }
  errorMessages?: IErrorMessages
  models?: (typeof Model)[]
}

interface IDataStorage {
  [recordType: string]: {
    records: Map<string, ModelClass>
    cache: Map<string, string[]>
    meta: Map<string, object>
  }
}

interface ILoadingState {
  url: string
  type: string
  queryParams?: IQueryParams
  queryTag?: string
  id?: string
}

export type IRESTTypes = 'POST' | 'PATCH' | 'GET' | 'DELETE'

export interface IStore {
  data: IDataStorage
  lastResponseHeaders: { [key: string]: string | null }
  loadingStates: Map<string, Set<string>>
  loadedStates: Map<string, Set<string>>
  errorMessages: IErrorMessages
  pauseSnapshots: boolean
  __usedForFactoryFarm__: boolean
  __usedForMockServer__: boolean
  add(type: string, props: IRecordObject, options?: IModelInitOptions): ModelClass
  add(type: string, props: IRecordObject[], options?: IModelInitOptions): ModelClassArray
  add(type: string, props: IRecordObject | IRecordObject[], options?: IModelInitOptions): ModelClass | ModelClassArray
  bulkSave(type: string, records: ModelClassArray, options?: IRequestParamsOpts): Promise<ModelClassArray>
  bulkCreate(type: string, records: ModelClassArray, options?: IRequestParamsOpts): Promise<ModelClassArray>
  bulkUpdate(type: string, records: ModelClassArray, options?: IRequestParamsOpts): Promise<ModelClassArray>
  remove(type: string, id: string): void
  getOne(type: string, id: string, options?: IRequestParamsOpts): ModelClass | void
  fetchOne(type: string, id: string, options?: IRequestParamsOpts): Promise<ModelClass>
  findOne(type: string, id: string, options?: IRequestParamsOpts): Promise<ModelClass>
  getMany(type: string, ids: string[], options?: IRequestParamsOpts): ModelClassArray
  fetchMany(type: string, ids: string[], options?: IRequestParamsOpts): Promise<ModelClassArray>
  findMany(type: string, ids: string[], options?: IRequestParamsOpts): Promise<ModelClassArray>
  fetchUrl(type: string, queryParams?: IQueryParams, id?: string): string
  getAll(type: string, options?: IRequestParamsOpts): ModelClassArray
  fetchAll(type: string, options?: IRequestParamsOpts): Promise<ModelClassArray>
  findAll(type: string, options?: IRequestParamsOpts): Promise<ModelClassArray>
  reset(type?: string): void
  init(options?: IStoreInitOptions): void
  fetch(url: RequestInfo, fetchOptions: RequestInit): Promise<Response>
  clearCache(type: string): void
  getCachedIds(type: string, url: string): string[]
  getKlass(type: string): typeof Model | void
  createOrUpdateModelFromData(data: JSONAPIDataObject): ModelClass
  createOrUpdateModelsFromData(data: JSONAPIDataObject[]): ModelClassArray
  createModelFromData(data: JSONAPIDataObject, options?: IModelInitOptions): ModelClass
  updateRecordsFromResponse(promise: Promise<Response>, records: ModelClassArray): Promise<ModelClassArray>
}

/**
 * Annotations for mobx observability. We can't use `makeAutoObservable` because we have subclasses.
 */

const mobxAnnotations = {
  data: observable,
  lastResponseHeaders: observable,
  loadingStates: observable,
  loadedStates: observable,
  add: action,
  _pickAttributes: action,
  _pickRelationships: action,
  bulkSave: action,
  _bulkSave: action,
  bulkCreate: action,
  bulkUpdate: action,
  remove: action,
  getOne: action,
  fetchOne: action,
  findOne: action,
  getMany: action,
  fetchMany: action,
  findMany: action,
  fetchUrl: action,
  getAll: action,
  _setLoadingState: action,
  _deleteLoadingState: action,
  fetchAll: action,
  findAll: action,
  reset: action,
  init: action,
  _initializeNetworkConfiguration: action,
  _initializeModelIndex: action,
  _initializeErrorMessages: action,
  fetch: action,
  _getRecord: action,
  _getRecords: action,
  _getRecordsByIds: action,
  clearCache: action,
  _getCachedRecord: action,
  _getCachedRecords: action,
  getCachedIds: action,
  getKlass: action,
  createOrUpdateModelFromData: action,
  _updateRecordFromData: action,
  createOrUpdateModelsFromData: action,
  createModelFromData: action,
  updateRecordsFromResponse: action
}

/**
 * Defines the Data Store class.
 */
class Store implements IStore {
  static models: (typeof Model)[] = []
  __usedForMockServer__: boolean = false

  /**
   * Stores data by type.
   * {
   *   todos: {
   *     records: observable.map(), // records by id
   *     cache: observable.map(), // cached ids by url
   *     meta: observable.map() // meta information by url
   *   }
   * }
   *
   * @type {object}
   * @default {}
   */
  data: IDataStorage = {}

  /**
   * The most recent response headers according to settings specified as `_headersOfInterest`
   *
   * @type {object}
   * @default {}
   */
  lastResponseHeaders: { [key: string]: string | null } = {}

  /**
   * Map of data that is in flight. This can be observed to know if a given type (or tag)
   * is still processing.
   * - Key is a tag that is either the model type or a custom value
   * - Falue is a Set of JSON-encoded objects with unique urls and queryParams
   *   Set[JSON.stringify({ url, type, queryParams, queryTag })]
   *
   * @type {Map}
   */
  loadingStates = new Map()

  /**
   * Map of data that has been loaded into the store. This can be observed to know if a given
   * type (or tag) has finished loading.
   * - Key is a tag that is either the model type or a custom value
   * - Falue is a Set of JSON-encoded objects with unique urls and queryParams
   *   Set[JSON.stringify({ url, type, queryParams, queryTag })]
   *
   * @type {Map}
   */
  loadedStates = new Map()

  /**
   * True if models in the store should stop taking snapshots. This is
   * useful when updating records without causing records to become
   * 'dirty', for example when initializing records using `add`
   *
   * @type {boolean}
   */
  pauseSnapshots = false

  protected _defaultFetchOptions: RequestInit = {}
  protected _baseUrl: string = ''

  errorMessages: IErrorMessages = {}

  protected _models: (typeof Model)[] = []
  protected _headersOfInterest: string[] = []
  protected _retryOptions: {
    attempts?: number
    delay?: number
  } = {}

  __usedForFactoryFarm__ = false

  /**
   * Initializer for Store class
   *
   * @param {object} options options to use for initialization
   */
  constructor (options?: IStoreInitOptions) {
    makeObservable(this, mobxAnnotations)
    this.init(options)
  }

  /**
   * Adds an instance to the store.
   * ```
   * const todo = store.add('todos', { name: "A good thing to measure" })
   * todo.name
   * => "A good thing to measure"
   * ```
   *
   * @param {string} type the model type
   * @param {object} props the properties to use
   * @param {object} options currently supports `skipInitialization`
   * @returns {ModelClass} the new record
   */
  add (type: string, props: IRecordObject, options?: IModelInitOptions): ModelClass
  /**
   * Adds an array of instances to the store.
   * ```
   * const todoArray = [{ name: "Another good thing to measure" }]
   * const [todo] = store.add('todos', [{ name: "Another good thing to measure" }])
   * todo.name
   * => "Another good thing to measure"
   * ```
   *
   * @param {string} type the model type
   * @param {object|Array} props the properties to use
   * @param {object} options currently supports `skipInitialization`
   * @returns {object|Array} the new record or records
   */
  add (type: string, props: IRecordObject[], options?: IModelInitOptions): ModelClassArray
  /**
   * Adds an instance or an array of instances to the store.
   * Adds relationships explicitly. This is less efficient than adding via data if
   * there are also inverse relationships.
   *
   * @param {string} type the model type
   * @param {object|Array} props the properties to use
   * @param {object} options currently supports `skipInitialization`
   * @returns {ModelClass|ModelClassArray} the new record or records
   */
  add (type: string, props: IRecordObject | IRecordObject[], options?: IModelInitOptions): ModelClass | ModelClassArray {
    if (Array.isArray(props)) {
      const records: ModelClassArray = props.map((properties: IRecordObject) => {
        const record: ModelClass = this.add(type, properties, options)
        return record
      })
      return records
    } else {
      const id = props.id || newId()

      const attributes = cloneDeep(this._pickAttributes(props, type))

      const record: ModelClass = this.createModelFromData({ type, id, attributes }, options)

      // set post-initialization to get inverses
      this.pauseSnapshots = true
      Object.entries(this._pickRelationships(props, type)).forEach(([key, value]) => {
        record[key] = value
      })
      this.pauseSnapshots = false

      this.data[type].records.set(id, record)

      return record
    }
  }

  /**
   * Given a set of properties and type, returns an object with only the properties
   * that are defined as attributes in the model for that type.
   * ```
   * properties = { title: 'Do laundry', unrelatedProperty: 'Do nothing' }
   * _pickAttributes(properties, 'todos')
   * => { title: 'Do laundry' }
   * ```
   *
   * @param {object} properties a full list of properties that may or may not conform
   * @param {string} type the model type
   * @returns {object} the scrubbed attributes
   * @protected
   */
  protected _pickAttributes (properties: IRecordObject, type: string): IRecordObject {
    const attributes = this.getKlass(type)?.attributeDefinitions
    return attributes ? pick(properties, Object.keys(attributes)): {}
  }

  /**
   * Given a set of properties and type, returns an object with only the properties
   * that are defined as relationships in the model for that type.
   * ```
   * properties = { notes: [note1, note2], category: cat1, title: 'Fold Laundry' }
   * _pickRelationships(properties, 'todos')
   * => {
   *       notes: {
   *         data: [{ id: '1', type: 'notes' }, { id: '2', type: 'notes' }]
   *       },
   *       category: {
   *         data: { id: '1', type: 'categories' }
   *       }
   *    }
   * ```
   *
   * @param {object} properties a full list of properties that may or may not conform
   * @param {string} type the model type
   * @returns {object} the scrubbed relationships
   * @protected
   */
  protected _pickRelationships (properties: object, type: string): IRecordObject {
    const definitions = this.getKlass(type)?.relationshipDefinitions
    return definitions ? pick(properties, Object.keys(definitions)) : {}
  }

  /**
   * Saves a collection of records via a bulk-supported JSONApi endpoint.
   * All records need to be of the same type.
   *
   * @param {string} type the model type
   * @param {Array} records records that will be bulk saved
   * @param {object} options {queryParams, extensions}
   * @returns {Promise} the saved records
   */
  bulkSave (type: string, records: ModelClassArray, options: IRequestParamsOpts = {}): Promise<ModelClassArray> {
    console.warn('bulkSave is deprecated. Please use either bulkCreate or bulkUpdate to be more precise about your request.')
    return this._bulkSave(type, records, options, 'POST')
  }

  /**
   * Saves a collection of records via a bulk-supported JSONApi endpoint.
   * All records need to be of the same type.
   * - gets url for record type
   * - converts records to an appropriate jsonapi attribute/relationship format
   * - builds a data payload
   * - builds the json api extension string
   * - sends request
   * - update records based on response
   *
   * @param {string} type the model type
   * @param {Array} records records to be bulk saved
   * @param {object} options {queryParams, extensions}
   * @param {string} method http method
   * @returns {Promise} the saved records
   * @protected
   */
  protected _bulkSave (type: string, records: ModelClassArray, options: IRequestParamsOpts = {}, method: IRESTTypes): Promise<ModelClassArray> {
    const { queryParams, extensions } = options

    const url = this.fetchUrl(type, queryParams)
    const recordAttributes = records.map((record) => record.jsonapi(options))
    const body = JSON.stringify({ data: recordAttributes })

    const extensionStr = extensions?.length
      ? `ext="bulk,${extensions.join()}"`
      : 'ext="bulk"'

    const response = this.fetch(url, {
      headers: {
        ...this._defaultFetchOptions.headers,
        'Content-Type': `application/vnd.api+json; ${extensionStr}`
      },
      method,
      body
    })

    return this.updateRecordsFromResponse(response, records)
  }

  /**
   * Save a collection of new records via a bulk-supported JSONApi endpoint.
   * All records need to be of the same type and not have an existing id.
   *
   * @param {string} type the model type
   * @param {Array} records to be bulk created
   * @param {object} options {queryParams, extensions}
   * @returns {Promise} the created records
   */
  bulkCreate (type: string, records: ModelClassArray, options: IRequestParamsOpts = {}): Promise<ModelClassArray> {
    if (records.some((record: ModelClass) => !record.isNew)) {
      throw new Error('Invariant violated: all records must be new records to perform a create')
    }
    return this._bulkSave(type, records, options, 'POST')
  }

  /**
   * Updates a collection of records via a bulk-supported JSONApi endpoint.
   * All records need to be of the same type and have an existing id.
   *
   * @param {string} type the model type
   * @param {Array} records array of records to be bulk updated
   * @param {object} options {queryParams, extensions}
   * @returns {Promise} the saved records
   */
  bulkUpdate (type: string, records: ModelClassArray, options: IRequestParamsOpts = {}): Promise<ModelClassArray> {
    if (records.some((record) => record.isNew)) {
      throw new Error('Invariant violated: all records must have a persisted id to perform an update')
    }
    return this._bulkSave(type, records, options, 'PATCH')
  }

  /**
   * Removes a record from the store by deleting it from the
   * type's record map
   *
   * @param {string} type the model type
   * @param {string} id of record to remove
   */
  remove (type: string, id: string): void {
    this.data[type].records.delete(id)
  }

  /**
   * Gets a record from the store. Will never fetch from the server.
   * If given queryParams, it will check the cache for the record.
   *
   * @param {string} type the type to find
   * @param {string} id the id of the record to get
   * @param {object} options { queryParams }
   * @returns {object} record
   */
  getOne (type: string, id: string, options: IRequestParamsOpts = {}): ModelClass | void {
    if (!id) {
      console.error(`No id given while calling 'getOne' on ${type}`)
      return undefined
    }
    const { queryParams } = options
    if (queryParams) {
      return this._getCachedRecord(type, id, queryParams)
    } else {
      return this._getRecord(type, id)
    }
  }

  /**
   * Fetches record by `id` from the server and returns a Promise.
   *
   * @async
   * @param {string} type the record type to fetch
   * @param {string} id the id of the record to fetch
   * @param {object} options { queryParams }
   * @returns {Promise} record result wrapped in a Promise
   */
  async fetchOne (type: string, id: string, options: IRequestParamsOpts = {}): Promise<ModelClass> {
    const { queryParams } = options
    const url: string = this.fetchUrl(type, queryParams, id)

    const state = this._setLoadingState({ ...options, type, id, url })

    const response = await this.fetch(url, { method: 'GET' })

    if (response.status !== 200) {
      this._deleteLoadingState(state)
      const errors: JSONAPIErrorObject[] = await parseErrors(response, this.errorMessages)
      throw new Error(JSON.stringify(errors))
    }

    const { data, included } = await response.json()

    const record: ModelClass = this.createOrUpdateModelFromData(data)

    if (included) {
      this.createOrUpdateModelsFromData(included)
    }

    if (record.id) {
      this.data[type].cache.set(url, [record.id])
    }

    this._deleteLoadingState(state)
    return record
  }

  /**
   * Finds a record by `id`, always returning a Promise.
   * If available in the store, it returns that record. Otherwise, it fetches the record from the server.
   *
   *   store.findOne('todos', 5)
   *   // fetch triggered
   *   => Promise(todo)
   *   store.findOne('todos', 5)
   *   // no fetch triggered
   *   => Promise(todo)
   *
   * @param {string} type the type to find
   * @param {string} id the id of the record to find
   * @param {object} options { queryParams }
   * @returns {Promise} a promise that will resolve to the record
   */
  findOne (type: string, id: string, options: IRequestParamsOpts = {}): Promise<ModelClass> {
    const record = this.getOne(type, id, options)
    return record?.id ? Promise.resolve(record) : this.fetchOne(type, id, options)
  }

  /**
   * Get all records with the given `type` and `ids` from the store. This will never fetch from the server.
   *
   * @param {string} type the type to get
   * @param {string} ids the ids of the records to get
   * @param {object} options { queryParams }
   * @returns {Array} array of records
   */
  getMany (type: string, ids: string[], options: IRequestParamsOpts = {}): ModelClassArray {
    const idsToQuery: string[] = ids.slice()
    const records: ModelClassArray = this.getAll(type, options)

    return records.filter((record: ModelClass) => typeof record.id !== 'undefined' && idsToQuery.includes(record.id))
  }

  /**
   * Fetch all records with the given `type` and `ids` from the server.
   *
   * @param {string} type the type to get
   * @param {string} ids the ids of the records to get
   * @param {object} options { queryParams }
   * @returns {Promise} Promise.resolve(records)
   */
  fetchMany (type: string, ids: string[], options: IRequestParamsOpts = {}): Promise<ModelClassArray> {
    const idsToQuery = ids.slice().map(String)
    const { queryParams = {}, queryTag } = options

    const _baseUrl = this.fetchUrl(type, queryParams)
    const idQueries = deriveIdQueryStrings(idsToQuery, _baseUrl)
    const queries = idQueries.map((queryIds) => {
      const params: IQueryParams = cloneDeep(queryParams)
      params.filter = queryParams.filter || {}
      params.filter.ids = queryIds

      return this.fetchAll(type, { queryParams: params, queryTag })
    })

    return Promise.all(queries).then((records: ModelClassArray[]) => records.flat())
  }

 /**
  * Finds multiple records of the given `type` with the given `ids` and returns them wrapped in a Promise.
  * If all records are in the store, it returns those.
  * If some records are in the store, it returns those plus fetches all other records.
  * Otherwise, it fetches all records from the server.
  *
  *   store.findMany('todos', [1, 2, 3])
  *   // fetch triggered
  *   => [todo1, todo2, todo3]
  *
  *   store.findMany('todos', [3, 2, 1])
  *   // no fetch triggered
  *   => [todo1, todo2, todo3]
  *
  * @param {string} type the type to find
  * @param {string} ids the ids of the records to find
  * @param {object} options { queryParams }
  * @returns {Promise} a promise that will resolve an array of records
  */
  async findMany (type: string, ids: string[], options: IRequestParamsOpts = {}): Promise<ModelClassArray> {
    ids = [...new Set(ids)].map(String)
    const existingRecords = this.getMany(type, ids, options)

    if (ids.length === existingRecords.length) {
      return existingRecords
    }

    const existingIds: string[] = existingRecords.reduce((ids: string[], record: ModelClass) => {
      if(typeof record.id !== 'undefined') {
        ids.push(record.id)
      }
      return ids
    }, [])
    const idsToQuery: string[] = ids.filter((id: string) => !existingIds.includes(id))

    const { queryParams = {}, queryTag } = options
    queryParams.filter = queryParams.filter || {}
    const _baseUrl: string = this.fetchUrl(type, queryParams)
    const idQueries = deriveIdQueryStrings(idsToQuery, _baseUrl)

    await Promise.all(
      idQueries.map((queryIds) => {
        return this.fetchAll(type, {
          queryParams: {
            filter: { ...queryParams.filter, ids: queryIds }
          },
          queryTag
        })
      })
    )

    return this.getMany(type, ids)
  }

  /**
   * Builds fetch url based on type, queryParams, id, and options
   *
   * @param {string} type the type to find
   * @param {object} queryParams params to be used in the fetch
   * @param {string} id a model id
   * @param {object} options options for fetching
   * @returns {string} a formatted url
   */
fetchUrl (type: string, queryParams?: IQueryParams, id?: string): string {
    const { _baseUrl } = this
    const endpoint = this.getKlass(type)?.endpoint || ''

    return requestUrl(_baseUrl, endpoint, queryParams, id)
  }

  /**
   * Gets all records with the given `type` from the store. This will never fetch from the server.
   *
   * @param {string} type the type to find
   * @param {object} options options for fetching queryParams
   * @returns {Array} array of records
   */
  getAll (type: string, options: IRequestParamsOpts = {}): ModelClassArray {
    const { queryParams } = options
    if (queryParams) {
      return this._getCachedRecords(type, queryParams)
    } else {
      return this._getRecords(type).filter((record: ModelClass) => record.initialized)
    }
  }

  /**
   * Sets a loading state when a fetch / deserialization is in flight. Loading states
   * are Sets inside of the `loadingStates` Map, so multiple loading states can be in flight
   * at the same time. An optional query tag can be passed to identify the particular query.
   *
   * const todos = store.fetchAll('todos', { queryTag: 'myTodos' })
   * store.loadingStates.get('myTodos')
   * => Set([JSON.stringify({ url, type, queryParams, queryTag })])
   *
   * @param {object} options options that can be used to build the loading state info
   * @param {string} options.url the url queried
   * @param {string} options.type the model type
   * @param {string} options.queryParams the query params used
   * @param {string} options.queryTag an optional tag to use in place of the type
   * @returns {object} the loading state that was added
   */
  _setLoadingState ({ url, type, queryParams, queryTag }: ILoadingState) {
    queryTag = queryTag || type

    const loadingStateInfo = { url, type, queryParams, queryTag }

    if (!this.loadingStates.get(queryTag)) {
      this.loadingStates.set(queryTag, new Set())
    }
    this.loadingStates.get(queryTag).add(JSON.stringify(loadingStateInfo))

    return loadingStateInfo
  }

  /**
   * Removes a loading state. If that leaves an empty array for the map key in `loadingStates`,
   * will also delete the set. Also adds to loadedStates.
   *
   * @param {object} state the state to remove
   */
  _deleteLoadingState (state: ILoadingState) {
    const { loadingStates, loadedStates } = this
    const { queryTag } = state

    const encodedState = JSON.stringify(state)

    if (!loadedStates.get(queryTag)) {
      loadedStates.set(queryTag, new Set())
    }

    loadedStates.get(queryTag).add(encodedState)

    if (loadingStates.get(queryTag)) {
      loadingStates.get(queryTag).delete(encodedState)
      if (loadingStates.get(queryTag).size === 0) {
        loadingStates.delete(queryTag)
      }
    } else {
      console.warn(`no loadingState found for ${encodedState}`)
    }
  }

  /**
   * Finds all records with the given `type`. Always fetches from the server.
   *
   * @async
   * @param {string} type the type to find
   * @param {object} options query params and other options
   * @returns {Promise} Promise.resolve(records)
   */
  async fetchAll (type: string, options: IRequestParamsOpts = {}): Promise<ModelClassArray> {
    const { queryParams } = options

    const url = this.fetchUrl(type, queryParams)

    const state = this._setLoadingState({ ...options, type, url })

    const response = await this.fetch(url, { method: 'GET' })
    if (response.status !== 200) {
      runInAction(() => {
        this._deleteLoadingState(state)
      })
      const errors = await parseErrors(response, this.errorMessages)
      throw new Error(JSON.stringify(errors))
    }

    const { included, data, meta } = await response.json()

    let records: ModelClassArray = []
    runInAction(() => {
      if (included) {
        this.createOrUpdateModelsFromData(included)
      }

      records = this.createOrUpdateModelsFromData(data)
      const recordIds = records.reduce((ids: string[], record: ModelClass) => {
        if (record.id) ids.push(record.id)
        return ids
      }, [])
      this.data[type].cache.set(url, recordIds)

      this._deleteLoadingState(state)
      if (meta) {
        records.meta = meta
        this.data[type].meta.set(url, meta)
      }
    })

    return records
  }

  /**
   * Finds all records of the given `type`.
   * If any records from the given type from url are in the store, it returns those.
   * Otherwise, it fetches all records from the server.
   *
   *   store.findAll('todos')
   *   // fetch triggered
   *   => [todo1, todo2, todo3]
   *
   *   store.findAll('todos')
   *   // no fetch triggered
   *   => [todo1, todo2, todo3]
   *
   * Query params can be passed as part of the options hash.
   * The response will be cached, so the next time `findAll`
   * is called with identical params and values, the store will
   * first look for the local result.
   *
   *   store.findAll('todos', {
   *     queryParams: {
   *       filter: {
   *         start_time: '2020-06-01T00:00:00.000Z',
   *         end_time: '2020-06-02T00:00:00.000Z'
   *       }
   *     }
   *   })
   *
   * @param {string} type the type to find
   * @param {object} options { queryParams }
   * @returns {Promise} Promise.resolve(records)
   */
  findAll (type: string, options?: IRequestParamsOpts): Promise<ModelClassArray> {
    const records = this.getAll(type, options)

    if (records?.length > 0) {
      return Promise.resolve(records)
    } else {
      return this.fetchAll(type, options)
    }
  }

  /**
   * Clears the store of a given type, or clears all if no type given
   *
   *   store.reset('todos')
   *   // removes all todos from store
   *   store.reset()
   *   // clears store
   *
   * @param {string} type the model type
   */
  reset (type?: string): void {
    const types = type ? [type] : this._models.map(({ type }) => type)
    types.forEach((type: string) => {
      this.data[type] = {
        records: observable.map(),
        cache: observable.map(),
        meta: observable.map()
      }
    })
  }

  /**
   * Entry point for configuring the store
   *
   * @param {object} options passed to constructor
   */
  init (options: IStoreInitOptions = {}): void {
    const { models, errorMessages } = options
    this._initializeNetworkConfiguration(options)
    if (models) { this._initializeModelIndex(models) }
    if (errorMessages) { this._initializeErrorMessages(errorMessages) }
    this.reset()
  }

  /**
   * Configures the store's network options
   *
   * @param {string} options the parameters that will be used to set up network requests
   * @param {string} options._baseUrl the API's root url
   * @param {object} options._defaultFetchOptions options that will be used when fetching
   * @param {Array} options.headersOfInterest an array of headers to watch
   * @param {object} options._retryOptions options for re-fetch attempts and interval
   */
  _initializeNetworkConfiguration (options: IStoreInitOptions = {}): void {
    const { baseUrl, defaultFetchOptions, headersOfInterest, retryOptions } = options
    if (baseUrl) { this._baseUrl = baseUrl }
    if (defaultFetchOptions) { this._defaultFetchOptions = defaultFetchOptions }
    if (headersOfInterest) { this._headersOfInterest = headersOfInterest }
    if (retryOptions) { this._retryOptions = retryOptions }
  }

  /**
   * Creates the key/value index of model types
   *
   * @param {object} models a fallback list of models
   */
  _initializeModelIndex (models: (typeof Model)[]): void {
    this._models = (this.constructor as typeof Store).models || models
  }

  /**
   * Configure the error messages returned from the store when API requests fail
   *
   * @param {IErrorMessages} errorMessages for initializing the error messages
   *   options for initializing error messages for different HTTP status codes
   */
  _initializeErrorMessages (errorMessages: IErrorMessages = {}) {
    this.errorMessages = {
      defaultMessage: 'Something went wrong.',
      ...errorMessages
    }
  }

  /**
   * Wrapper around fetch applies user defined fetch options
   *
   * @param {string} url the url to fetch
   * @param {object} fetchOptions override options to use for fetching
   * @returns {Promise} the data from the server
   */
  async fetch (url: RequestInfo, fetchOptions: RequestInit): Promise<Response> {
    const { _defaultFetchOptions, _headersOfInterest, _retryOptions } = this
    fetchOptions = { ..._defaultFetchOptions, ...fetchOptions }
    const { attempts, delay } = _retryOptions

    const response: Response = await fetchWithRetry(url, fetchOptions, attempts, delay)

    if (_headersOfInterest) {
      runInAction(() => {
        _headersOfInterest.forEach(header => {
          const value = response.headers.get(header)
          // Only set if it has changed, to minimize observable changes
          if (this.lastResponseHeaders[header] !== value) this.lastResponseHeaders[header] = value
        })
      })
    }

    return response
  }

  /**
   * Gets individual record from store
   *
   * @param {string} type the model type
   * @param {number} id the model id
   * @returns {object} record
   * @protected
   */
  protected _getRecord (type: string, id: string): ModelClass | void {
    if (!this.data[type]) {
      throw new Error(`Could not find a collection for type '${type}'`)
    }

    return this.data[type].records.get(id)
  }

  /**
   * Gets records for type of collection
   *
   * @param {string} type the model type
   * @returns {Array} array of objects
   * @protected
   */
  protected _getRecords (type: string): ModelClassArray {
    return Array.from(this.data[type].records.values())
  }

  /**
   * Get multiple records by id
   *
   * @param {string} type the model type
   * @param {Array} ids the ids to find
   * @returns {Array} array or records
   * @protected
   */
  protected _getRecordsByIds (type: string, ids: string[]): ModelClassArray {
    return ids.reduce((records: ModelClassArray, id: string) => {
      const record = this._getRecord(type, id)
      if (record != null) { records.push(record) }
      return records
    }, [])
  }

  /**
   * Clears the cache for provided record type
   *
   * @param {string} type the model type
   * @returns {Set} the cleared set
   */
  clearCache (type: string): void {
    return this.data[type].cache.clear()
  }

  /**
   * Gets single from store based on cached query
   *
   * @param {string} type the model type
   * @param {string} id the model id
   * @param {object} queryParams the params to be searched
   * @returns {object} record
   * @protected
   */
  _getCachedRecord (type: string, id: string, queryParams: IQueryParams): ModelClass | void {
    const cachedRecords = this._getCachedRecords(type, queryParams, id)

    return cachedRecords && cachedRecords[0]
  }

  /**
   * Gets records from store based on cached query and any previously requested ids
   *
   * @param {string} type type of records to get
   * @param {object} queryParams query params that were used for the query
   * @param {string} id optional param if only getting 1 cached record by id
   * @returns {Array} array of records
   * @protected
   */
  _getCachedRecords (type: string, queryParams: IQueryParams, id?: string): ModelClassArray {
    const url = this.fetchUrl(type, queryParams, id)
    const ids = this.getCachedIds(type, url)
    const meta = this.data[type].meta.get(url)

    const cachedRecords: ModelClassArray = this._getRecordsByIds(type, ids)

    if (meta) cachedRecords.meta = meta

    return cachedRecords
  }

  /**
   * Gets records from store based on cached query
   *
   * @param {string} type the model type
   * @param {string} url the url that was requested
   * @returns {Array} array of ids
   */
  getCachedIds (type: string, url: string): string[] {
    const ids = this.data[type].cache.get(url)
    if (!ids) return []
    const idsSet = new Set(toJS(ids))
    return Array.from(idsSet)
  }

  /**
   * Helper to look up model class for type.
   *
   * @param {string} type the model type
   * @returns {Function} model constructor
   */
  getKlass (type: string): typeof Model | void {
    return this._models.find((model: typeof Model) => model.type === type)
  }

  /**
   * Creates or updates a model
   *
   * @param {object} data the object will be used to update or create a model
   * @returns {object} the record
   */
  createOrUpdateModelFromData (data: JSONAPIDataObject): ModelClass {
    const { id, type } = data

    let record: ModelClass | void = this._getRecord(type, id)

    if (record) {
      this._updateRecordFromData(record, data)
    } else {
      record = this.createModelFromData(data)
    }

    this.data[type].records.set(String(record.id), record)
    return record
  }

  /**
   * Updates a record from a jsonapi hash
   *
   * @param {object} record a Model record
   * @param {object} data jsonapi-formatted data
   */
  _updateRecordFromData (record: ModelClass, data: JSONAPIDataObject): void {
    const tmpId = record.id
    const { id, type, attributes = {}, relationships = {} } = data

    runInAction(() => {
      record.id = String(id)

      // records that are created as inverses are not initialized
      if (!record.initialized) {
        record.initialize(data)
      }

      Object.entries(attributes).forEach(([key, value]) => {
        record[key] = value
      })

      record.relationships = { ...record.relationships, ...relationships }
    })

    record.isInFlight = false
    record.takeSnapshot({ persisted: true })

    runInAction(() => {
      this.data[type].records.set(String(tmpId), record)
      this.data[type].records.set(String(id), record)
    })
  }

  /**
   * Create multiple models from an array of data. It will only build objects
   * with defined models, and ignore everything else in the data.
   *
   * @param {Array} data the array of jsonapi data
   * @returns {Array} an array of the models serialized
   */
  createOrUpdateModelsFromData (data: JSONAPIDataObject[]): ModelClassArray {
    return data.reduce((records: ModelClassArray, dataObject: JSONAPIDataObject) => {
      if (!this.data[dataObject.type]) {
        console.warn(`no type defined for ${dataObject.type}`)
        return records
      }

      const record: ModelClass = this.createOrUpdateModelFromData(dataObject)
      if (record != null) {
        records.push(record)
      }

      return records
    }, [])
  }

  /**
   * Helper to create a new model
   *
   * @param {object} data id, type, attributes and relationships
   * @param {object} options currently supports `skipInitialization`
   * @returns {object} model instance
   */
  createModelFromData (data: JSONAPIDataObject, options?: IModelInitOptions): ModelClass {
    const { id, type, attributes = {}, relationships = {} } = data

    const store = this
    const ModelKlass: typeof Model | void = this.getKlass(type)

    if (!ModelKlass) {
      throw new Error(`Could not find a model for '${type}'`)
    }

    return new ModelKlass({ id, relationships, ...attributes }, store, options)
  }

  /**
   * Defines a resolution for an API call that will update a record or
   * set of records with the data returned from the API
   *
   * @param {Promise} promise a response from the API
   * @param {object|Array} records to be updated
   * @returns {Promise} a resolved promise after operations have been performed
   */
  async updateRecordsFromResponse (promise: Promise<Response>, records: ModelClassArray): Promise<ModelClassArray> {
    records.forEach((record) => {
      record.isInFlight = true
    })

    return promise.then(
      async (response: Response) => {
        records.forEach((record) => {
          record.isInFlight = false
        })

        if (response.status === 200 || response.status === 201) {
          const json = await response.json()
          const data = Array.isArray(json.data) ? json.data : [json.data]
          const { included }: { included: JSONAPIDataObject[] } = json

          if (data.length !== records.length) {
            throw new Error(
              'Invariant violated: API response data and records to update do not match'
            )
          }

          records.forEach((record, i) => this._updateRecordFromData(record, data[i]))

          if (included) {
            this.createOrUpdateModelsFromData(included)
          }

          // on success, return the original record(s).
          // again - this may be a single record so preserve the structure
          return records
        } else {
          const errors: JSONAPIErrorObject[] = await parseErrors(response, this.errorMessages)
          runInAction(() => {
            errors.forEach((error) => {
              const { index, key } = parseErrorPointer(error)
              if (key != null) {
                // add the error to the record
                const errors = records[index].errors[key] || []
                // errors.push(error)
                records[index].errors[key] = errors
              }
            })
          })

          throw new Error(JSON.stringify(errors))
        }
      },
      function (error) {
        // TODO: Handle error states correctly, including handling errors for multiple targets
        records.forEach((record) => {
          record.isInFlight = false
        })
        records[0].errors = error
        throw error
      }
    )
  }
}

export default Store
