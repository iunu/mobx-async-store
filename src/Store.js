/* global fetch */
import { observable, transaction } from 'mobx'
import { dbOrNewId, requestUrl } from './utils'

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

  /**
   * Initializer for Store class
   *
   * @method constructor
   */
  constructor (options) {
    this.init(options)
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
      return this.addModel(type, data)
    }
  }

  addModel = (type, attributes) => {
    const id = dbOrNewId(attributes)
    // Create new model install
    const model = this.createModel(type, id, { attributes })
    // Add the model to the type records index
    this.data[type].records[id] = model
    return model
  }

  addModels = (type, data) => {
    let records = []
    transaction(() => {
      records = data.map(obj => this.addModel(type, obj))
    })
    return records
  }

  remove = (type, id) => {
    delete this.data[type].records[id]
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
    if (this.shouldFetchOne(type, id, options)) {
      return this.fetchOne(type, id, options)
    } else {
      return this.getRecord(type, id)
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
    // If fromServer is true always fetch the data and return
    if (fromServer === true) return this.fetchAll(type, queryParams)
    // If fromServer is false never fetch the data and return
    if (fromServer === false) return this.getMatchingRecords(type, queryParams)
    // Get any matching records
    const records = this.getMatchingRecords(type, queryParams)
    // If any records are present
    // console.log('findAll', type, queryParams)
    // console.log('records', records.length)
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
    types.forEach(modelKlass => {
      this.data[modelKlass.type] = {
        records: {},
        cache: {}
      }
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

    return fetch(url, {
      ...defaultFetchOptions,
      ...options
    })
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
   * Gets individual record from store
   *
   * @method getRecord
   * @param {String} type
   * @param {Number} id
   * @return {Object} record
   */
  getRecord (type, id) {
    const collection = this.getType(type)
    if (!collection) {
      throw new Error(`Could not find a collection for type '${type}'`)
    }
    return collection.records[id]
  }

  /**
   * Gets records for type of collection from observable
   *
   * @method getRecords
   * @param {String} type
   * @return {Array} array of objects
   */
  getRecords (type) {
    return Object.values(this.getType(type).records)
  }

  /**
   * Gets records from store based on cached query
   *
   * @method getCachedRecords
   * @param {String} type
   * @param {Object} queryParams
   * @return {Array} array or records
   */
  getCachedRecords (type, queryParams) {
    // Get the url the request would use
    const url = this.fetchUrl(type, queryParams)
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
    return this.getType(type).cache[url]
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

  createModelsFromData (data) {
    const store = this
    transaction(() => {
      data.forEach(dataObject => {
        const {
          attributes,
          id,
          relationships,
          type
        } = dataObject

        const existingRecord = this.getRecord(type, id)

        if (existingRecord) {
          Object.keys(attributes).forEach(key => {
            existingRecord[key] = attributes[key]
            this.data[type].records[id] = existingRecord
          })
          if (relationships) {
            Object.keys(relationships).forEach(key => {
              existingRecord.relationships[key] = relationships[key]
              this.data[type].records[id] = existingRecord
            })
          }
        } else {
          const ModelKlass = this.modelTypeIndex[type]
          const record = new ModelKlass({
            id,
            store,
            relationships,
            ...attributes
          })
          this.data[type].records[record.id] = record
        }
      })
    })
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
    const { attributes } = data

    let relationships = {}
    if (data.hasOwnProperty('relationships')) {
      relationships = data.relationships
    }

    const store = this
    const ModelKlass = this.getKlass(type)

    if (!ModelKlass) {
      throw new Error(`Could not find a model for '${type}'`)
    }

    return new ModelKlass({
      id,
      store,
      relationships,
      ...attributes
    })
  }

  /**
   * Builds fetch url based
   *
   * @method fetchUrl
   * @param {String} type the type to find
   * @param {Object} options
   */
  fetchUrl (type, queryParams, id) {
    const { baseUrl, modelTypeIndex } = this
    const { endpoint } = modelTypeIndex[type]
    return requestUrl(baseUrl, endpoint, queryParams, id)
  }

  /**
   * finds an instance by `id`. If available in the store, returns that instance. Otherwise, triggers a fetch.
   *
   * @method findAll
   * @param {String} type the type to find
   * @param {Object} options
   */
  async fetchAll (type, queryParams) {
    const url = this.fetchUrl(type, queryParams)
    const response = await this.fetch(url)
    if (response.status === 200) {
      this.data[type].cache[url] = []
      const json = await response.json()
      if (json.included) {
        this.createModelsFromData(json.included)
      }

      let records = []
      transaction(() => {
        records = json.data.map(dataObject => {
          const { id } = dataObject
          const { attributes, relationships } = dataObject
          const ModelKlass = this.modelTypeIndex[type]
          const store = this
          const record = new ModelKlass({
            relationships,
            store,
            ...attributes
          })
          this.data[type].cache[url].push(id)
          this.data[type].records[id] = record
          return record
        })
      })
      return records
    } else {
      return Promise.reject(response.status)
    }
  }

  /**
   * fetches record by `id`.
   *
   * @async
   * @method fetchOne
   * @param {String} type the type to find
   * @param {String} id
   */
  async fetchOne (type, id, options) {
    const { queryParams } = options
    const url = this.fetchUrl(type, queryParams, id)
    // Trigger request
    const response = await this.fetch(url)
    // Handle response
    if (response.status === 200) {
      const json = await response.json()

      if (json.included) {
        this.createModelsFromData(json.included)
      }

      const record = this.createModel(type, null, json.data)
      // Is this needed?
      this.data[type].cache[url] = []
      this.data[type].cache[url].push(record.id)
      this.data[type].records[record.id] = record
      return record
    } else {
      return response.status
    }
  }

  /**
   * Determines if an individual record should be
   * fetched or looked up in the store
   *
   * @method shouldFetchOne
   * @param {String} type the type to find
   * @param {String} id
   * @param {Object} options
   */
  shouldFetchOne (type, id, { fromServer }) {
    // If fromServer is true immediately return true
    if (fromServer === true) return true
    // Check if matching record is in store
    // If fromServer is undefined and record is not found
    // return true
    return typeof fromServer === 'undefined' &&
           !this.getRecord(type, id)
  }
}

export default Store
