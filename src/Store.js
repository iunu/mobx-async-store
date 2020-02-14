/* global fetch */
import { action, observable, transaction, set, toJS } from 'mobx'
import { dbOrNewId, requestUrl, uniqueBy, combineRacedRequests } from './utils'
import MiddlewarePipe from './MiddlewarePipe'
import JSON from 'circular-json'
/**
 * Defines the Artemis Data Store class.
 *
 * @class Store
 * @constructor
 */
class Store {
  /**
   * Observable property used to store data and
   * handle changes to state
   *
   * @property data
   * @type {Object}
   * @default {}
   */
  @observable data = {}

  genericErrorMessage = 'Something went wrong.'

  // Generic inbound pipe
  inboundPipe = null

  // Generic outbound pipe
  outboundPipe = null
  loggerEnabled = false
  /**
   * Initializer for Store class
   *
   * @method constructor
   */
  constructor (options) {
    this.init(options)
    this.fetchUrl = this.fetchUrl.bind(this)
  }
  /**
   * Adds an instance or an array of instances to the store.
   * ```
   * kpiHash = { name: "A good thing to measure" }
   * kpi = store.add('kpis', kpiHash)
   * kpi.name
   * => "A good thing to measure"
   * ```
   * @method add
   * @param {String} type
   * @param {Object} properties the properties to use
   * @return {Object} the new record
   */
  add = (type, data) => {
    if (data.constructor.name === 'Array') {
      return this.addModels(type, data)
    } else {
      return this.addModel(type, toJS(data))
    }
  }

  /**
   * @method addModel
   * @param {String} type
   * @param {Object} attributes json api attributes
   * @return {Object} Artemis Data record
   */
  @action
  addModel = (type, attributes) => {
    const id = dbOrNewId(attributes)
    const model = this.createModel(type, id, { attributes })

    // Add the model to the type records index
    this.data[type].records[id] = model

    return model
  }

  /**
   * @method addModels
   * @param {String} type
   * @param {String} data array of data objects
   * @return {Array} array of ArtemisData records
   */
  addModels = (type, data) => {
    return transaction(() => data.map((obj) => this.addModel(type, obj)))
  }

  /**
   * Adds a record from the store. We can't simply remove the record
   * by deleting the records property/key via delete due to a bug
   * in mobx.
   *
   * @method remove
   * @param {String} type
   * @param {String} id of record to remove
   */
  @action
  remove = (type, id) => {
    const records = this.getRecords(type)

    this.data[type].records = records.reduce((hash, record) => {
      if (String(record.id) !== String(id)) {
        hash[record.id] = record
      }
      return hash
    }, {})
  }

  /**
   * finds an instance by `id`. If available in the store, returns that instance. Otherwise, triggers a fetch.
   *
   *   store.findOne('todos', 5)
   *   // fetch triggered
   *   => event1
   *   store.findOne('todos', 5)
   *   // no fetch triggered
   *   => event1
   *
   * Passing `fromServer` as an option will always trigger a fetch if `true` and never trigger a fetch if `false`.
   * Otherwise, it will trigger the default behavior
   *
   *   store.findOne('todos', 5, { fromServer: false })
   *   // no fetch triggered
   *   => undefined
   *
   *   store.findOne('todos', 5)
   *   // fetch triggered
   *   => event1
   *
   *   store.findOne('todos', 5, { fromServer: true })
   *   // fetch triggered
   *   => event1
   *
   * @method findOne
   * @param {String} type the type to find
   * @param id
   * @param {Object} options
   */
  findOne = (type, id, options = {}) => {
    const { fromServer, queryParams } = options

    if (fromServer === true) {
      // If fromServer is true always fetch the data and return
      return this.fetchOne(type, id, queryParams)
    } else if (fromServer === false) {
      // If fromServer is false never fetch the data and return
      return this.getRecord(type, id, queryParams)
    } else {
      return this.findOrFetchOne(type, id, queryParams)
    }
  }

  /**
   * returns cache if exists, returns promise if not
   *
   * @method findOrFetchOne
   * @param {String} type record type
   * @param id
   * @param {Object} queryParams will inform whether to return cached or fetch
   */
  findOrFetchOne = (type, id, queryParams) => {
    // Get the matching record
    const record = this.getMatchingRecord(type, id, queryParams)

    // If the cached record is present
    if (record && record.id) {
      // Return data
      return record
    } else {
      // Otherwise fetch it from the server
      return this.fetchOne(type, id, queryParams)
    }
  }

  /**
   * finds all of the instances of a given type. If there are instances available in the store,
   * it will return those, otherwise it will trigger a fetch
   *
   *   store.findAll('todos')
   *   // fetch triggered
   *   => [event1, event2, event3]
   *   store.findAll('todos')
   *   // no fetch triggered
   *   => [event1, event2, event3]
   *
   * passing `fromServer` as an option will always trigger a
   * fetch if `true` and never trigger a fetch if `false`.
   * Otherwise, it will trigger the default behavior
   *
   *   store.findAll('todos', { fromServer: false })
   *   // no fetch triggered
   *   => []
   *
   *   store.findAll('todos')
   *   // fetch triggered
   *   => [event1, event2, event3]
   *
   *   // async stuff happens on the server
   *   store.findAll('todos')
   *   // no fetch triggered
   *   => [event1, event2, event3]
   *
   *   store.findAll('todos', { fromServer: true })
   *   // fetch triggered
   *   => [event1, event2, event3, event4]
   *
   * Query params can be passed as part of the options hash.
   * The response will be cached, so the next time `findAll`
   * is called with identical params and values, the store will
   * first look for the local result (unless `fromServer` is `true`)
   *
   *   store.findAll('todos', {
   *     queryParams: {
   *       filter: {
   *         start_time: moment(),
   *         end_time: moment()
   *       }
   *     }
   *   })
   *
   * @method findAll
   * @param {String} type the type to find
   * @param {Object} options
   */
  findAll = (type, options = {}) => {
    const { fromServer, queryParams } = options

    if (fromServer === true) {
      // If fromServer is true always fetch the data and return
      return this.fetchAll(type, queryParams)
    } else if (fromServer === false) {
      // If fromServer is false never fetch the data and return
      return this.getMatchingRecords(type, queryParams)
    } else {
      return this.findOrFetchAll(type, queryParams)
    }
  }

  /**
   * returns cache if exists, returns promise if not
   *
   * @method findOrFetchAll
   * @param {String} type record type
   * @param {Object} queryParams will inform whether to return cached or fetch
   */
  findOrFetchAll = (type, queryParams) => {
    // Get any matching records
    const records = this.getMatchingRecords(type, queryParams)

    // If any records are present
    if (records.length > 0) {
      // Return data
      return records
    } else {
      // Otherwise fetch it from the server
      return this.fetchAll(type, queryParams)
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
   * @method reset
   */
  reset (type) {
    if (type) {
      this.data[type] = { records: {}, cache: {} }
    } else {
      this.initializeObservableDataProperty()
    }
  }

  /* Private Methods */

  /**
   * Entry point for configuring the store
   *
   * @method init
   * @param {Object} options passed to constructor
   */
  init (options) {
    this.initializeNetworkConfiguration(options)
    this.initializeModelTypeIndex()
    this.initializeObservableDataProperty()

    // Everything afterwards is configuration and setup of
    // pipes and the logger (if logger is enabled)
    this.loggerEnabled = options && options.loggerEnabled
    this.inboundPipe = new MiddlewarePipe()
    this.outboundPipe = new MiddlewarePipe({ reversed: true })
    this.outboundPipe.use(this.fetchMiddleWare)
    this.inboundPipe.use(this.inboundMiddleware)
  }

  /**
   * Entry point for configuring the store
   *
   * @method outboundMiddleware
   * @param {Function} fn passed to constructor
   */
  outboundMiddleware (fn) {
    this._logger({action: 'added a function to outbound pipe', info: fn})
    this.outboundPipe.use(fn)
  }

  /**
   * Entry point for configuring the store
   *
   * @method inboundMiddleware
   * @param {Function} fn passed to constructor
   */
  inboundMiddleware (fn) {
    this._logger({action: 'added a function to inbound pipe', info: fn})
    this.inboundPipe.use(fn)
  }

  /**
   * Entry point for configuring the store
   *
   * @method initializeNetworkConfiguration
   * @param {Object} options for nextwork config
   */
  initializeNetworkConfiguration (options = {}) {
    this.baseUrl = options.baseUrl || ''
    this.defaultFetchOptions = options.defaultFetchOptions || {}
    this._logger({action: 'initializeNetworkConfiguration', info: options})
  }

  /**
   * Logger for the dataStore if you wish to have one.
   *
   * @method _logger
   * @param {Object} {action info, message}, action taken, info associated, message associated
   */
  _logger = ({action, info, message}) => {
    if (this.loggerEnabled) {
      console.info(`action: ${action} ${info && 'result: ' + JSON.stringify(info)} ${message && 'message: ' + message}`)
    }
  }

  /**
   * Entry point for configuring the store
   *
   * @method initializeNetworkConfiguration
   * @param {Object} options for nextwork config
   */
  initializeModelTypeIndex () {
    const { types } = this.constructor
    this.modelTypeIndex = types.reduce((modelTypeIndex, modelKlass) => {
      modelTypeIndex[modelKlass.type] = modelKlass
      return modelTypeIndex
    }, {})
  }

  /**
   * Creates an obserable index with model types
   * as the primary key
   *
   * Observable({ todos: {} })
   *
   * @method initializeObservableDataProperty
   */
  initializeObservableDataProperty () {
    const { types } = this.constructor

    // NOTE: Is there a performance cost to setting
    // each property individually?
    this._logger({action: 'initializeObservableDataProperty', info: types})

    types.forEach(modelKlass => {
      this.data[modelKlass.type] = { records: {}, cache: {} }
    })
  }

  /**
   * Wrapper around fetch applies user defined fetch options
   *
   * @method fetch
   * @param {String} url
   * @param {Object} options
   */
  fetch (url, options = {}) {
    const { defaultFetchOptions } = this
    const fetchOptions = { ...defaultFetchOptions, ...options }
    const key = JSON.stringify({ url, fetchOptions })
    this._logger({
      action: 'fetch',
      info: {
          url,
          ...{ ...defaultFetchOptions, ...options }
        }
      })
    return combineRacedRequests(key, () => fetch(url, { ...defaultFetchOptions, ...options }))
  }

  /**
   * Gets type of collection from data observable
   *
   * @method getType
   * @param {String} type
   * @return {Object} observable type object structure
   */
  getType (type) {
    return this.data[type]
  }

  /**
   * Get single all record
   * based on query params
   *
   * @method getMatchingRecord
   * @param {String} type
   * @param id
   * @param {Object} queryParams
   * @return {Array} array or records
   */
  getMatchingRecord (type, id, queryParams) {
    if (queryParams) {
      this._logger({action: 'getMatchingRecord.getCachedRecord', info: { type, id, queryParams }})
      return this.getCachedRecord(type, id, queryParams)
    } else {
      this._logger({action: 'getMatchingRecord.getRecord', info: { type, id }})
      return this.getRecord(type, id)
    }
  }

  /**
   * Gets individual record from store
   *
   * @method getRecord
   * @param {String} type
   * @param {Number} id
   * @return {Object} record
   */
  getRecord (type, id) {
    this._logger({action: 'getRecord', info: { type, id }})
    if (!this.getType(type)) {
      throw new Error(`Could not find a collection for type '${type}'`)
    }

    const record = this.getType(type).records[id]
    this._logger({action: 'getRecord.record', info: { record }})

    if (!record || record === 'undefined') return

    return record
  }

  /**
   * Gets records for type of collection from observable
   *
   * @method getRecords
   * @param {String} type
   * @return {Array} array of objects
   */
  getRecords (type) {
    this._logger({action: 'getRecords', info: { type }})

    const records = Object.values(this.getType(type).records)
                          .filter(value => value && value !== 'undefined')
    this._logger({action: 'getRecords.records', info: { type, records }})

    // NOTE: Handles a scenario where the store keeps around a reference
    // to a newly persisted record by its temp uuid. This is required
    // because we can't simply remove the temp uuid reference because other
    // related models may be still using the temp uuid in their relationships
    // data object. However, when we are listing out records we want them
    // to be unique by the persisted id (which is updated after a Model.save)
    return uniqueBy(records, 'id')
  }

  /**
   * Gets single from store based on cached query
   *
   * @method getCachedRecord
   * @param {String} type
   * @param id
   * @param {Object} queryParams
   * @return {Array} array or records
   */
  getCachedRecord (type, id, queryParams) {
    this._logger({action: 'getCachedRecord', info: { type, id, queryParams }})
    const cachedRecords = this.getCachedRecords(type, queryParams, id)
    this._logger({action: 'getCachedRecord.cachedRecords', info: { type, id, queryParams, cachedRecords }})
    return cachedRecords && cachedRecords[0]
  }

  /**
   * Gets records from store based on cached query
   *
   * @method getCachedRecords
   * @param {String} type
   * @param {Object} queryParams
   * @return {Array} array or records
   */
  getCachedRecords (type, queryParams, id) {
    // Get the url the request would use
    const url = this.fetchUrl(type, queryParams, id)
    // Get the matching ids from the response
    const ids = this.getCachedIds(type, url)
    // Get the records matching the ids
    return this.getRecordsById(type, ids)
  }

  /**
   * Gets records from store based on cached query
   *
   * @method getCachedIds
   * @param {String} type
   * @param {String} url
   * @return {Array} array of ids
   */
  getCachedIds (type, url) {
    const ids = this.getType(type).cache[url]
    if (!ids) return []
    const idsSet = new Set(toJS(ids))
    return Array.from(idsSet)
  }

  /**
   * Gets records from store based on cached query
   *
   * @method getCachedIds
   * @param {String} type
   * @param {String} url
   * @return {Array} array of ids
   */
  getCachedId (type, id) {
    return this.getType(type).cache[id]
  }

  /**
   * Get multiple records by id
   *
   * @method getRecordsById
   * @param {String} type
   * @param {Array} ids
   * @return {Array} array or records
   */
  getRecordsById (type, ids = []) {
    // NOTE: Is there a better way to do this?
    return ids.map(id => this.getRecord(type, id))
              .filter(record => record)
              .filter(record => typeof record !== 'undefined')
  }

  /**
   * Gets records all records or records
   * based on query params
   *
   * @method getMatchingRecords
   * @param {String} type
   * @param {Object} queryParams
   * @return {Array} array or records
   */
  getMatchingRecords (type, queryParams) {
    if (queryParams) {
      return this.getCachedRecords(type, queryParams)
    } else {
      return this.getRecords(type)
    }
  }

  /**
   * Helper to look up model class for type.
   *
   * @method getKlass
   * @param {String} type
   * @return {Class} model class
   */
  getKlass (type) {
    return this.modelTypeIndex[type]
  }

  /**
   * Creates or updates a model
   *
   * @method createOrUpdateModel
   * @param {Object} dataObject
   */
  createOrUpdateModel (dataObject) {
    const { attributes = {}, id, relationships = {}, type } = dataObject
    this._logger({action: 'createOrUpdateModel', info: { dataObject }})

    let record = this.getRecord(type, id)
    this._logger({action: 'createOrUpdateModel.record', info: { record }})

    if (record) {
      // Update existing object attributes
      Object.keys(attributes).forEach(key => {
        set(record, key, attributes[key])
        set(this.data[type].records, id, record)
      })

      // If relationships are present, update relationships
      if (relationships) {
        Object.keys(relationships).forEach(key => {
          // Don't try to create relationship if meta included false
          if (!relationships[key].meta) {
            // defensive against existingRecord.relationships being undefined
            set(record, 'relationships', { ...record.relationships, [key]: relationships[key] })
            set(this.data[type].records, id, record)
          }
        })
      }
    } else {
      this._logger({action: 'createOrUpdateModel.createModel', info: { type, id, attributes, relationships }})

      record = this.createModel(type, id, { attributes, relationships })
      this.data[type].records[record.id] = record
    }

    return record
  }

  /**
   * Create multiple models from an array of data
   *
   * @method createModelsFromData
   * @param {Array} data
   */
  createModelsFromData (data) {
    this._logger({action: 'createModelsFromData', info: { data }})

    return transaction(() => data.map(dataObject => {
      // Only build objects for which we have a type defined.
      // And ignore silently anything else included in the JSON response.
      // TODO: Put some console message in development mode
      if (this.getType(dataObject.type)) {
        return this.createOrUpdateModel(dataObject)
      }
    }))
  }

  /**
   * Helper to create a new model
   *
   * @method createModel
   * @param {String} type
   * @param {Number} type
   * @param {Object} attributes
   * @return {Object} model instance
   */
  createModel (type, id, data) {
    const { attributes = {}, relationships = {} } = toJS(data)
    const store = this
    const ModelKlass = this.getKlass(type)

    if (!ModelKlass) {
      throw new Error(`Could not find a model for '${type}'`)
    }

    return new ModelKlass({ id, store, relationships, ...attributes })
  }

  /**
   * Builds fetch url based
   *
   * @method fetchUrl
   * @param {String} type the type to find
   * @param {Object} options
   */
  fetchUrl = (type, queryParams, id, options) => {
    const { baseUrl, modelTypeIndex } = this
    const { endpoint } = modelTypeIndex[type]

    return requestUrl(baseUrl, endpoint, queryParams, id, options)
  }

  /**
   * This is the initiator for the inboundPipe on every returning response
   *
   * @method fetchMiddleWare
   * @param {Object} { type, queryParams }
   */
  fetchMiddleWare = async ({ type, queryParams }) => {
    const url = this.fetchUrl(type, queryParams)
    this._logger({action: 'fetchMiddleWare', info: { url }})
    const response = await this.fetch(url, { method: 'GET' })
    this._logger({action: 'fetchMiddleWare.response', info: { response }})

    return this.inboundPipe.process({ response, type, url })
  }

  /**
   * This is the json api inbound middleware that joe originall created
   *
   * @method inboundMiddleware
   * @param {Object} { response, type, url }
   */
  inboundMiddleware = async ({ response, type, url }) => {
    const store = this

    if (response.status === 200) {
      this.data[type].cache[url] = []
      const json = await response.json()
      if (json.included) {
        this.createModelsFromData(json.included)
      }

      return transaction(() => json.data.map((dataObject) => {
        const { id, attributes = {}, relationships = {} } = dataObject
        const ModelKlass = this.modelTypeIndex[type]
        const record = new ModelKlass({ store, relationships, ...attributes })

        this.data[type].cache[url].push(id)
        this.data[type].records[id] = record

        return record
      }))
    } else {
      return Promise.reject(response.status)
    }
  }

  /**
   * finds an instance by `id`. If available in the store, returns that instance. Otherwise, triggers a fetch.
   *
   * @method fetchAll
   * @param {String} type the type to find
   * @param {Object} options
   */
  async fetchAll (type, queryParams) {
    this._logger({action: 'fetchAll', info: { type, queryParams }})

    return this.outboundPipe.process({type, queryParams})
  }

  /**
   * fetches record by `id`.
   *
   * @async
   * @method fetchOne
   * @param {String} type the type to find
   * @param {String} id
   */
  async fetchOne (type, id, queryParams) {
    const url = this.fetchUrl(type, queryParams, id)
    // Trigger request
    this._logger({action: 'fetchOne', info: { type, id, queryParams }})

    const response = await this.fetch(url, { method: 'GET' })
    this._logger({action: 'fetchOne.response', info: { response }})

    // Handle response
    if (response.status === 200) {
      const json = await response.json()

      const { data, included } = json

      if (included) {
        this.createModelsFromData(included)
      }

      const record = this.createOrUpdateModel(data)

      this.data[type].cache[url] = []
      this.data[type].cache[url].push(record.id)

      return record
    } else {
      // Return null if record is not found
      return null
    }
  }
}

export default Store
