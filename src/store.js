/* global fetch */
import { observable } from 'mobx'
import uuidv1 from 'uuid/v1'

export function stringifyFilterParams (filters) {
  return Object.keys(filters).map(function (key) {
    const encodedValue = encodeURIComponent(filters[key])
    return `filter[${key}]=${encodedValue}`
  }).join('&')
}

export function stringifyIncludeParams (include) {
  return `include=${include.join(',')}`
}

export function requestUrl (baseUrl, endpoint, queryParams = {}) {
  let queryParamString = ''
  if (Object.keys(queryParams).length > 0) {
    queryParamString += '?'
    if (queryParams.hasOwnProperty('filter')) {
      const { filter } = queryParams
      queryParamString += stringifyFilterParams(filter)
    }
    if (queryParams.hasOwnProperty('include')) {
      const { include } = queryParams
      if (queryParamString !== '?') {
        queryParamString += '&'
      }
      queryParamString += stringifyIncludeParams(include)
    }
  }
  // Return full url
  return `${baseUrl}/${endpoint}${queryParamString}`
}

function dbOrNewId (properties) {
  const timestamp = new Date().toISOString()
  return properties.id || `tmp-${timestamp}-${uuidv1()}`
}

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
  add (type, properties) {
    // Use id from DB/API or create a temporary id
    const id = dbOrNewId(properties)
    // Create new model install
    const model = this.createModel(type, id, properties)
    // Return the model
    this.data[type].isEmpty = false
    // Add the model to the type records index
    this.data[type].records[id] = model
    return model
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
  findOne (type, id, options = {}) {
    if (this.shouldFetchOne(type, id, options)) {
      return this.fetchOne(type, id)
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
  findAll (type, options = {}) {
    const { fromServer, queryParams } = options
    const { isEmpty } = this.getType(type)
    if (fromServer === false && isEmpty) return []
    if (fromServer === false && !queryParams) return this.getRecords(type)
    if (fromServer === true) return this.fetchAll(type, queryParams)
    if (isEmpty) return this.fetchAll(type, queryParams)

    return this.getMatchingRecords(type, queryParams)
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
  reset () {
    this.initializeObservableDataProperty()
  }

  /* Private Methods */

  /**
   * Entry point for configuring the store
   *
   * @method init
   * @params {Object} options passed to constructor
   */
  init (options) {
     this.initializeNextworkConfiguration(options)
     this.initializeModelTypeIndex()
     this.initializeObservableDataProperty()
   }

  /**
   * Entry point for configuring the store
   *
   * @method initializeNextworkConfiguration
   * @params {Object} options for nextwork config
   */
  initializeNextworkConfiguration (options = {}) {
    this.baseUrl = options.baseUrl || ''
    this.defaultFetchOptions = options.defaultFetchOptions || {}
  }

  /**
   * Entry point for configuring the store
   *
   * @method initializeNextworkConfiguration
   * @params {Object} options for nextwork config
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
   * @params {Object} options for nextwork config
   */
  initializeObservableDataProperty () {
    const { types } = this.constructor
    // NOTE: Is there a performance cost to setting
    // each property individually?
    types.forEach(modelKlass => {
      this.data[modelKlass.type] = {
        records: {},
        cache: {},
        isEmpty: true
      }
    })
  }

  /**
   * Wrapper around fetch applies user defined fetch options
   *
   * @method fetch
   * @params {String} url
   * @params {Object} options
   */
  fetch (url, options = {}) {
    const { defaultFetchOptions } = this
    return fetch(url, {
      defaultFetchOptions,
      ...options
    })
  }

  /**
   * Gets type of collection from data observable
   *
   * @method getType
   * @params {String} type
   * @return {Object} observable type object structure
   */
  getType (type) {
    return this.data[type]
  }

  /**
   * Gets individual record from store
   *
   * @method getRecord
   * @params {String} type
   * @params {Number} id
   * @return {Object} record
   */
  getRecord (type, id) {
    return this.getType(type).records[id]
  }

  /**
   * Gets records for type of collection from observable
   *
   * @method getRecords
   * @params {String} type
   * @return {Array} array of objects
   */
  getRecords (type) {
    return Object.values(this.getType(type).records)
  }

  /**
   * Gets records from store based on cached query
   *
   * @method getCachedRecords
   * @params {String} type
   * @params {Object} queryParams
   * @return {Array} array or records
   */
  getCachedRecords (type, queryParams) {
    // Get the url the request would use
    const url = this.fetchUrl(type, queryParams)
    // Get the matching ids from the response
    const ids = this.getType(type).cache[url]
    // Get the records matching the ids
    return ids.map(id => this.getRecord(type, id))
  }

  /**
   * Gets records all records or records
   * based on query params
   *
   * @method getMatchingRecords
   * @params {String} type
   * @params {Object} queryParams
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
   * Helper to create a new model
   *
   * @method createModel
   * @param {String}
   * @return {Object} model instance
   */
  createModel (type, id, properties) {
    const ModelKlass = this.getKlass(type)
    return new ModelKlass({
      id,
      store: this,
      ...properties
    })
  }

  /**
   * Builds fetch url based
   *
   * @method fetchUrl
   * @param {String} type the type to find
   * @param {Object} options
   */
  fetchUrl (type, queryParams) {
    const { baseUrl, modelTypeIndex } = this
    const { endpoint } = modelTypeIndex[type]
    return requestUrl(baseUrl, endpoint, queryParams)
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
      // TODO: Refactor, abstract, and handle relations
      const records = json.data.map(dataObject => {
        const { id } = dataObject
        const { attributes } = dataObject
        const ModelKlass = this.modelTypeIndex[type]
        const record = new ModelKlass(attributes)
        this.data[type].cache[url].push(id)
        this.data[type].records[id] = record
        return record
      })
      this.data[type].isEmpty = false
      return records
    } else {
      return response.status
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
  async fetchOne (type, id) {
    const url = this.fetchUrl(type)
    // Trigger request
    const response = await this.fetch(`${url}/${id}`)
    // Handle response
    if (response.status === 200) {
      const json = await response.json()
      return this.createModel(type, null, json.data.attributes)
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
