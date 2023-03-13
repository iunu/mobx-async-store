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

/**
 * Annotations for mobx observability. We can't use `makeAutoObservable` because we have subclasses.
 */

const mobxAnnotations = {
  lastResponseHeaders: observable,
  loadingStates: observable,
  loadedStates: observable,
  add: action,
  pickAttributes: action,
  pickRelationships: action,
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
  setLoadingState: action,
  deleteLoadingState: action,
  fetchAll: action,
  findAll: action,
  reset: action,
  init: action,
  initializeNetworkConfiguration: action,
  initializeModelIndex: action,
  initializeErrorMessages: action,
  fetch: action,
  getRecord: action,
  getRecords: action,
  getRecordsById: action,
  clearCache: action,
  getCachedRecord: action,
  getCachedRecords: action,
  getCachedIds: action,
  getCachedId: action,
  getKlass: action,
  createOrUpdateModelFromData: action,
  updateRecordFromData: action,
  createOrUpdateModelsFromData: action,
  createModelFromData: action,
  updateRecordsFromResponse: action
}

/**
 * Defines the Data Store class.
 */
class Store {
  /**
   * Stores data by type.
   * {
   *   todos: {
   *     records: new Map(), // records by id
   *     cache: new Map(), // cached ids by url
   *     meta: new Map() // meta information by url
   *   }
   * }
   *
   * @type {object}
   * @default {}
   */
  data = {}

  /**
   * The most recent response headers according to settings specified as `headersOfInterest`
   *
   * @type {object}
   * @default {}
   */
  lastResponseHeaders = {}

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

  /**
   * Initializer for Store class
   *
   * @param {object} options options to use for initialization
   */
  constructor (options) {
    makeObservable(this, mobxAnnotations)
    this.init(options)
  }

  /**
   * Adds an instance or an array of instances to the store.
   * Adds the model to the type records index
   * Adds relationships explicitly. This is less efficient than adding via data if
   * there are also inverse relationships.
   *
   * ```
   * const todo = store.add('todos', { name: "A good thing to measure" })
   * todo.name
   * => "A good thing to measure"
   *
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
  add (type, props = {}, options) {
    if (props.constructor.name === 'Array') {
      return props.map((model) => this.add(type, model))
    } else {
      const id = String(props.id || newId())

      const attributes = cloneDeep(this.pickAttributes(props, type))

      const record = this.createModelFromData({ type, id, attributes }, options)

      // set separately to get inverses
      this.pauseSnapshots = true
      Object.entries(this.pickRelationships(props, type)).forEach(([key, value]) => {
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
   * pickAttributes(properties, 'todos')
   * => { title: 'Do laundry' }
   * ```
   *
   * @param {object} properties a full list of properties that may or may not conform
   * @param {string} type the model type
   * @returns {object} the scrubbed attributes
   */
  pickAttributes (properties, type) {
    const attributeNames = Object.keys(this.getKlass(type).attributeDefinitions)
    return pick(properties, attributeNames)
  }

  /**
   * Given a set of properties and type, returns an object with only the properties
   * that are defined as relationships in the model for that type.
   * ```
   * properties = { notes: [note1, note2], category: cat1, title: 'Fold Laundry' }
   * pickRelationships(properties, 'todos')
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
   */
  pickRelationships (properties, type) {
    const definitions = this.getKlass(type).relationshipDefinitions
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
  bulkSave (type, records, options = {}) {
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
   * @private
   * @param {string} type the model type
   * @param {Array} records records to be bulk saved
   * @param {object} options {queryParams, extensions}
   * @param {string} method http method
   * @returns {Promise} the saved records
   */
  _bulkSave (type, records, options = {}, method) {
    const { queryParams, extensions } = options

    const url = this.fetchUrl(type, queryParams, null)
    const recordAttributes = records.map((record) => record.jsonapi(options))
    const body = JSON.stringify({ data: recordAttributes })

    const extensionStr = extensions?.length
      ? `ext="bulk,${extensions.join()}"`
      : 'ext="bulk"'

    const response = this.fetch(url, {
      headers: {
        ...this.defaultFetchOptions.headers,
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
  bulkCreate (type, records, options = {}) {
    if (records.some((record) => !record.isNew)) {
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
  bulkUpdate (type, records, options = {}) {
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
  remove (type, id) {
    this.data[type].records.delete(String(id))
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
  getOne (type, id, options = {}) {
    if (!id) {
      console.error(`No id given while calling 'getOne' on ${type}`)
      return undefined
    }
    const { queryParams } = options
    if (queryParams) {
      return this.getCachedRecord(type, id, queryParams)
    } else {
      return this.getRecord(type, id)
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
  async fetchOne (type, id, options = {}) {
    if (!id) {
      console.error(`No id given while calling 'fetchOne' on ${type}`)
      return undefined
    }
    const { queryParams } = options
    const url = this.fetchUrl(type, queryParams, id)

    const state = this.setLoadingState({ ...options, type, id, url })

    const response = await this.fetch(url, { method: 'GET' })

    if (response.status === 200) {
      const { data, included } = await response.json()

      const record = this.createOrUpdateModelFromData(data)

      if (included) {
        this.createOrUpdateModelsFromData(included)
      }

      this.data[type].cache.set(url, [record.id])

      this.deleteLoadingState(state)
      return record
    } else {
      this.deleteLoadingState(state)
      const errors = await parseErrors(response, this.errorMessages)
      throw new Error(JSON.stringify(errors))
    }
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
  findOne (type, id, options = {}) {
    if (!id) {
      console.error(`No id given while calling 'findOne' on ${type}`)
      return undefined
    }
    const record = this.getOne(type, id, options)
    return record?.id ? record : this.fetchOne(type, id, options)
  }

  /**
   * Get all records with the given `type` and `ids` from the store. This will never fetch from the server.
   *
   * @param {string} type the type to get
   * @param {string} ids the ids of the records to get
   * @param {object} options { queryParams }
   * @returns {Array} array of records
   */
  getMany (type, ids, options = {}) {
    const idsToQuery = ids.slice().map(String)
    const records = this.getAll(type, options)

    return records.filter((record) => idsToQuery.includes(record.id))
  }

  /**
   * Fetch all records with the given `type` and `ids` from the server.
   *
   * @param {string} type the type to get
   * @param {string} ids the ids of the records to get
   * @param {object} options { queryParams }
   * @returns {Promise} Promise.resolve(records) or Promise.reject([Error: [{ detail, status }])
   */
  fetchMany (type, ids, options = {}) {
    const idsToQuery = ids.slice().map(String)
    const { queryParams = {}, queryTag } = options
    queryParams.filter = queryParams.filter || {}

    const baseUrl = this.fetchUrl(type, queryParams)
    const idQueries = deriveIdQueryStrings(idsToQuery, baseUrl)
    const queries = idQueries.map((queryIds) => {
      const params = cloneDeep(queryParams)
      params.filter.ids = queryIds

      return this.fetchAll(type, { queryParams: params, queryTag })
    })

    return Promise.all(queries)
      .then(records => [].concat(...records))
      .catch(err => Promise.reject(err))
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
  async findMany (type, ids, options = {}) {
    ids = [...new Set(ids)].map(String)
    const existingRecords = this.getMany(type, ids, options)

    if (ids.length === existingRecords.length) {
      return existingRecords
    }

    const existingIds = existingRecords.map(({ id }) => id)
    const idsToQuery = ids.filter((id) => !existingIds.includes(id))

    const { queryParams = {}, queryTag } = options
    queryParams.filter = queryParams.filter || {}
    const baseUrl = this.fetchUrl(type, queryParams)
    const idQueries = deriveIdQueryStrings(idsToQuery, baseUrl)

    await Promise.all(
      idQueries.map((queryIds) => {
        queryParams.filter.ids = queryIds
        return this.fetchAll(type, { queryParams, queryTag })
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
  fetchUrl (type, queryParams, id, options) {
    const { baseUrl } = this
    const { endpoint } = this.getKlass(type)

    return requestUrl(baseUrl, endpoint, queryParams, id, options)
  }

  /**
   * Gets all records with the given `type` from the store. This will never fetch from the server.
   *
   * @param {string} type the type to find
   * @param {object} options options for fetching queryParams
   * @returns {Array} array of records
   */
  getAll (type, options = {}) {
    const { queryParams } = options
    if (queryParams) {
      return this.getCachedRecords(type, queryParams)
    } else {
      return this.getRecords(type).filter((record) => record.initialized)
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
  setLoadingState ({ url, type, queryParams, queryTag }) {
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
  deleteLoadingState (state) {
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
   * @returns {Promise} Promise.resolve(records) or Promise.reject([Error: [{ detail, status }])
   */
  async fetchAll (type, options = {}) {
    const { queryParams } = options

    const url = this.fetchUrl(type, queryParams)

    const state = this.setLoadingState({ ...options, type, url })

    const response = await this.fetch(url, { method: 'GET' })

    if (response.status === 200) {
      const { included, data, meta } = await response.json()

      let records
      runInAction(() => {
        if (included) {
          this.createOrUpdateModelsFromData(included)
        }

        records = this.createOrUpdateModelsFromData(data)
        const recordIds = records.map(({ id }) => id)
        this.data[type].cache.set(url, recordIds)

        this.deleteLoadingState(state)
      })
      if (meta) {
        records.meta = meta
        this.data[type].meta.set(url, meta)
      }
      return records
    } else {
      runInAction(() => {
        this.deleteLoadingState(state)
      })
      const errors = await parseErrors(response, this.errorMessages)
      throw new Error(JSON.stringify(errors))
    }
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
   * @returns {Promise} Promise.resolve(records) or Promise.reject([Error: [{ detail, status }])
   */
  findAll (type, options) {
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
  reset (type) {
    const types = type ? [type] : this.models.map(({ type }) => type)
    types.forEach((type) => {
      this.data[type] = {
        records: new Map(),
        cache: new Map(),
        meta: new Map()
      }
    })
  }

  /**
   * Entry point for configuring the store
   *
   * @param {object} options passed to constructor
   */
  init (options = {}) {
    this.initializeNetworkConfiguration(options)
    this.initializeModelIndex(options.models)
    this.reset()
    this.initializeErrorMessages(options)
  }

  /**
   * Configures the store's network options
   *
   * @param {string} options the parameters that will be used to set up network requests
   * @param {string} options.baseUrl the API's root url
   * @param {object} options.defaultFetchOptions options that will be used when fetching
   * @param {Array} options.headersOfInterest an array of headers to watch
   * @param {object} options.retryOptions options for re-fetch attempts and interval
   */
  initializeNetworkConfiguration ({ baseUrl = '', defaultFetchOptions = {}, headersOfInterest = [], retryOptions = { attempts: 1, delay: 0 } }) {
    this.baseUrl = baseUrl
    this.defaultFetchOptions = defaultFetchOptions
    this.headersOfInterest = headersOfInterest
    this.retryOptions = retryOptions
  }

  /**
   * Creates the key/value index of model types
   *
   * @param {object} models a fallback list of models
   */
  initializeModelIndex (models) {
    this.models = this.constructor.models || models
  }

  /**
   * Configure the error messages returned from the store when API requests fail
   *
   * @param {object} options for initializing the store
   *   options for initializing error messages for different HTTP status codes
   */
  initializeErrorMessages (options = {}) {
    const errorMessages = { ...options.errorMessages }

    this.errorMessages = {
      default: 'Something went wrong.',
      ...errorMessages
    }
  }

  /**
   * Wrapper around fetch applies user defined fetch options
   *
   * @param {string} url the url to fetch
   * @param {object} options override options to use for fetching
   * @returns {Promise} the data from the server
   */
  async fetch (url, options = {}) {
    const { defaultFetchOptions, headersOfInterest, retryOptions } = this
    const fetchOptions = { ...defaultFetchOptions, ...options }
    const { attempts, delay } = retryOptions

    const response = await fetchWithRetry(url, fetchOptions, attempts, delay)

    if (headersOfInterest) {
      runInAction(() => {
        headersOfInterest.forEach(header => {
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
   */
  getRecord (type, id) {
    if (!this.data[type]) {
      throw new Error(`Could not find a collection for type '${type}'`)
    }

    const record = this.data[type].records.get(String(id))

    return (!record || record === 'undefined') ? undefined : record
  }

  /**
   * Gets records for type of collection
   *
   * @param {string} type the model type
   * @returns {Array} array of objects
   */
  getRecords (type) {
    return Array.from(this.data[type].records.values())
  }

  /**
   * Get multiple records by id
   *
   * @param {string} type the model type
   * @param {Array} ids the ids to find
   * @returns {Array} array or records
   */
  getRecordsById (type, ids = []) {
    // NOTE: Is there a better way to do this?
    return ids
      .map((id) => this.getRecord(type, id))
      .filter((record) => record)
      .filter((record) => typeof record !== 'undefined')
  }

  /**
   * Clears the cache for provided record type
   *
   * @param {string} type the model type
   * @returns {Set} the cleared set
   */
  clearCache (type) {
    return this.data[type].cache.clear()
  }

  /**
   * Gets single from store based on cached query
   *
   * @param {string} type the model type
   * @param {string} id the model id
   * @param {object} queryParams the params to be searched
   * @returns {object} record
   */
  getCachedRecord (type, id, queryParams) {
    const cachedRecords = this.getCachedRecords(type, queryParams, id)

    return cachedRecords && cachedRecords[0]
  }

  /**
   * Gets records from store based on cached query and any previously requested ids
   *
   * @param {string} type type of records to get
   * @param {object} queryParams query params that were used for the query
   * @param {string} id optional param if only getting 1 cached record by id
   * @returns {Array} array of records
   */
  getCachedRecords (type, queryParams, id) {
    const url = this.fetchUrl(type, queryParams, id)
    const ids = this.getCachedIds(type, url)
    const meta = this.data[type].meta.get(url)

    const cachedRecords = this.getRecordsById(type, ids)

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
  getCachedIds (type, url) {
    const ids = this.data[type].cache.get(url)
    if (!ids) return []
    const idsSet = new Set(toJS(ids))
    return Array.from(idsSet)
  }

  /**
   * Gets a record from store based on cached query
   *
   * @param {string} type the model type
   * @param {string} id the id to get
   * @returns {object} the cached object
   */
  getCachedId (type, id) {
    return this.data[type].cache.get(String(id))
  }

  /**
   * Helper to look up model class for type.
   *
   * @param {string} type the model type
   * @returns {Function} model constructor
   */
  getKlass (type) {
    return this.models.find((model) => model.type === type)
  }

  /**
   * Creates or updates a model
   *
   * @param {object} data the object will be used to update or create a model
   * @returns {object} the record
   */
  createOrUpdateModelFromData (data) {
    const { id, type } = data

    let record = this.getRecord(type, id)

    if (record) {
      this.updateRecordFromData(record, data)
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
  updateRecordFromData (record, data) {
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

      Object.keys(relationships).forEach((relationshipName) => {
        if (relationships[relationshipName].included === false) {
          delete relationships[relationshipName]
        }
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
  createOrUpdateModelsFromData (data) {
    return data.map((dataObject) => {
      if (this.data[dataObject.type]) {
        return this.createOrUpdateModelFromData(dataObject)
      } else {
        console.warn(`no type defined for ${dataObject.type}`)
        return null
      }
    })
  }

  /**
   * Helper to create a new model
   *
   * @param {object} data id, type, attributes and relationships
   * @param {object} options currently supports `skipInitialization`
   * @returns {object} model instance
   */
  createModelFromData (data, options) {
    const { id, type, attributes = {}, relationships = {} } = data

    const store = this
    const ModelKlass = this.getKlass(type)

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
  updateRecordsFromResponse (promise, records) {
    // records may be a single record, if so wrap it in an array to make
    // iteration simpler
    const recordsArray = Array.isArray(records) ? records : [records]
    recordsArray.forEach((record) => {
      record.isInFlight = true
    })

    return promise.then(
      async (response) => {
        const { status } = response

        recordsArray.forEach((record) => {
          record.isInFlight = false
        })

        if (status === 200 || status === 201) {
          const json = await response.json()
          const data = Array.isArray(json.data) ? json.data : [json.data]
          const { included } = json

          if (data.length !== recordsArray.length) {
            throw new Error(
              'Invariant violated: API response data and records to update do not match'
            )
          }

          recordsArray.forEach((record, i) => this.updateRecordFromData(record, data[i]))

          if (included) {
            this.createOrUpdateModelsFromData(included)
          }

          // on success, return the original record(s).
          // again - this may be a single record so preserve the structure
          return records
        } else {
          const errors = await parseErrors(response, this.errorMessages)
          runInAction(() => {
            errors.forEach((error) => {
              const { index, key } = parseErrorPointer(error)
              if (key != null) {
                // add the error to the record
                const errors = recordsArray[index].errors[key] || []
                errors.push(error)
                recordsArray[index].errors[key] = errors
              }
            })
          })

          throw new Error(JSON.stringify(errors))
        }
      },
      function (error) {
        // TODO: Handle error states correctly, including handling errors for multiple targets
        recordsArray.forEach((record) => {
          record.isInFlight = false
        })
        recordsArray[0].errors = error
        throw error
      }
    )
  }
}

export default Store
