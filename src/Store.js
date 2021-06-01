/* global fetch */
import { action, observable, set, toJS, transaction } from 'mobx'
import pick from 'lodash/pick'
import uniqBy from 'lodash/uniqBy'
import {
  combineRacedRequests,
  idOrNewId,
  deriveIdQueryStrings,
  parseErrorPointer,
  requestUrl
} from './utils'
import schema from './schema'

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
   * Observable property used to store values for most recent response headers
   * according to settings specified as `headersOfInterest`
   *
   * @property lastResponseHeaders
   * @type {Object}
   * @default {}
   */
  @observable lastResponseHeaders = {}

  genericErrorMessage = 'Something went wrong.'

  /**
   * Initializer for Store class
   *
   * @method constructor
   */
  constructor (options) {
    this.init(options)
    this.schema = schema
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
   * Given a set of properties and type, returns an object with only the properties
   * that are defined as attributes in the schema for that type.
   * ```
   * properties = { title: 'Do laundry', unrelatedProperty: 'Do nothing' }
   * pickAttributes(properties, 'todos')
   * => { title: 'Do laundry' }
   * ```
   * @method pickAttributes
   * @param {Object} properties
   * @param {String} type
   * @return {Object}
   */
  pickAttributes = (properties, type) => {
    const attributeNames = Object.keys(this.schema.structure[type])
    return pick(properties, attributeNames)
  }

  /**
   * Given a set of properties and type, returns an object with only the properties
   * that are defined as relationships in the schema for that type.
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
   * @method pickRelationships
   * @param {Object} properties
   * @param {String} type
   * @return {Object}
   */
  pickRelationships = (properties, type) => {
    const relationshipNames = Object.keys(this.schema.relations[type] || {})
    const allRelationships = pick(properties, relationshipNames)

    return Object.keys(allRelationships).reduce((references, key) => {
      const relatedModel = allRelationships[key]
      let data
      if (Array.isArray(relatedModel)) {
        data = relatedModel.map((model) => ({
          id: model.id,
          type: model.type
        }))
      } else {
        data = { id: relatedModel.id, type: relatedModel.type }
      }
      references[key] = { data }
      return references
    }, {})
  }

  /**
   * Builds an instance of a model that includes either an automatically or manually created temporary ID, but does not add it to the store.
   * Does not support relationships, since they require references to objects in the store.
   * ```
   * kpiHash = { name: "A good thing to measure" }
   * kpi = store.build('kpis', kpiHash)
   * kpi.name
   * => "A good thing to measure"
   * ```
   * @method build
   * @param {String} type
   * @param {Object} properties the properties to use
   * @return {Object} the new record
   */
  build = (type, properties) => {
    const id = idOrNewId(properties.id)

    const attributes = this.pickAttributes(properties, type)
    const model = this.createModel(type, id, { attributes })

    return model
  }

  /**
   * @method addModel
   * @param {String} type
   * @param {Object} attributes json api attributes
   * @return {Object} Artemis Data record
   */
  @action
  addModel = (type, properties) => {
    const id = idOrNewId(properties.id)

    const attributes = this.pickAttributes(properties, type)
    const relationships = this.pickRelationships(properties, type)

    const model = this.createModel(type, id, { attributes, relationships })

    // Add the model to the type records index
    this.data[type].records.set(String(model.id), model)

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
   * Saves a collection of records via a bulk-supported JSONApi
   * endpoint. All records need to be of the same type.
   *
   * @method bulkSave
   * @param {String} type
   * @param {Array} records
   * @param {Object} options {queryParams, extensions}
   */
  bulkSave = async (type, records, options = {}) => {
    const { queryParams, extensions } = options

    // get url for record type
    const url = this.fetchUrl(type, queryParams, null)

    // convert records to an appropriate jsonapi attribute/relationship format
    const recordAttributes = records.map((record) => record.jsonapi(options))

    // build a data payload
    const body = JSON.stringify({ data: recordAttributes })

    // build the json api extension string
    const extensionStr = extensions?.length
      ? `ext="bulk,${extensions.join()}"`
      : 'ext="bulk"'

    // send request
    const response = this.fetch(url, {
      headers: {
        ...this.defaultFetchOptions.headers,
        'Content-Type': `application/vnd.api+json; ${extensionStr}`
      },
      method: 'POST',
      body
    })

    // update records based on response
    return this.updateRecords(response, records)
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
    this.data[type].records.delete(String(id))
  }

  /**
   * Gets a record from the store, will not fetch from the server if it doesn't exist in store.
   * If given queryParams, it will check the cache for the record.
   *
   * @method getOne
   * @param {String} type the type to find
   * @param {String} id the id of the record to get
   * @param {Object} options { queryParams }
   * @return {Object} record
   */
  getOne = (type, id, options = {}) => {
    if (!id) {
      console.error(`No id given while calling 'getOne' on ${type}`)
      return
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
   * @method fetchOne
   * @param {String} type the record type to fetch
   * @param {String} id the id of the record to fetch
   * @param {Object} options { queryParams }
   * @return {Object} record
   */
  async fetchOne (type, id, options = {}) {
    if (!id) {
      console.error(`No id given while calling 'fetchOne' on ${type}`)
      return
    }
    const { queryParams } = options
    const url = this.fetchUrl(type, queryParams, id)
    const response = await this.fetch(url, { method: 'GET' })

    if (response.status === 200) {
      const json = await response.json()
      const { data, included } = json

      if (included) {
        this.createModelsFromData(included)
      }

      const record = this.createOrUpdateModel(data)

      this.data[type].cache.set(url, [record.id])
      return record
    } else {
      // TODO: return Promise.reject(response.status)
      return null
    }
  }

  /**
   * Finds a record by `id`.
   * If available in the store, it returns that record. Otherwise, it fetches the record from the server.
   *
   *   store.findOne('todos', 5)
   *   // fetch triggered
   *   => event1
   *   store.findOne('todos', 5)
   *   // no fetch triggered
   *   => event1
   *
   * @method findOne
   * @param {String} type the type to find
   * @param {String} id the id of the record to find
   * @param {Object} options { queryParams }
   * @return {Promise||Object} // TODO: make this always return a Promise
   */
  findOne = (type, id, options = {}) => {
    if (!id) {
      console.error(`No id given while calling 'findOne' on ${type}`)
      return
    }
    const record = this.getOne(type, id, options)
    if (record?.id) {
      return record
    } else {
      return this.fetchOne(type, id, options)
    }
  }

  /**
   * Get all records with the given `type` and `ids` from the store. This will never fetch from the server.
   *
   * @method getMany
   * @param {String} type the type to get
   * @param {String} ids the ids of the records to get
   * @param {Object} options { queryParams }
   * @return {Array} array of records
   */
  getMany = (type, ids, options = {}) => {
    const idsToQuery = ids.slice().map(String)
    const records = this.getAll(type, options)

    return records.filter((record) => idsToQuery.includes(record.id))
  }

  /**
   * Fetch all records with the given `type` and `ids` from the server.
   *
   * @method fetchMany
   * @param {String} type the type to get
   * @param {String} ids the ids of the records to get
   * @param {Object} options { queryParams }
   * @return {Promise} Promise.resolve(records) or Promise.reject(status)
   */
  fetchMany = (type, ids, options = {}) => {
    const idsToQuery = ids.slice().map(String)
    const queryParams = options.queryParams || {}
    queryParams.filter = queryParams.filter || {}

    const baseUrl = this.fetchUrl(type, queryParams)
    const idQueries = deriveIdQueryStrings(idsToQuery, baseUrl)
    const queries = idQueries.map((queryIds) => {
      queryParams.filter.ids = queryIds
      return this.fetchAll(type, { queryParams })
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
   * @method findMany
   * @param {String} type the type to find
   * @param {String} ids the ids of the records to find
   * @param {Object} options { queryParams }
   * @return {Promise||Object} // TODO: make this always return a Promise
   */
  findMany = (type, ids, options = {}) => {
    let idsToQuery = ids.slice().map(String)
    const recordsInStore = this.getAll(type, options).filter((record) =>
      idsToQuery.includes(String(record.id))
    )

    if (recordsInStore.length === idsToQuery.length) {
      return recordsInStore
    }

    const recordIdsInStore = recordsInStore.map(({ id }) => String(id))
    idsToQuery = idsToQuery.filter((id) => !recordIdsInStore.includes(id))

    const queryParams = options.queryParams || {}
    queryParams.filter = queryParams.filter || {}
    const baseUrl = this.fetchUrl(type, queryParams)
    const idQueries = deriveIdQueryStrings(idsToQuery, baseUrl)

    const query = Promise.all(
      idQueries.map((queryIds) => {
        queryParams.filter.ids = queryIds
        return this.fetchAll(type, { queryParams })
      })
    )

    return query.then((recordsFromServer) =>
      recordsInStore.concat(...recordsFromServer)
    )
  }

  /**
   * Builds fetch url based
   *
   * @method fetchUrl
   * @param {String} type the type to find
   * @param {Object} options
   */
  fetchUrl (type, queryParams, id, options) {
    const { baseUrl, modelTypeIndex } = this
    const { endpoint } = modelTypeIndex[type]

    return requestUrl(baseUrl, endpoint, queryParams, id, options)
  }

  /**
   * Gets all records with the given `type` from the store. This will never fetch from the server.
   *
   * @method getAll
   * @param {String} type the type to find
   * @param {Object} options
   * @return {Array} array of records
   */
  getAll = (type, options = {}) => {
    const { queryParams } = options
    if (queryParams) {
      return this.getCachedRecords(type, queryParams)
    } else {
      return this.getRecords(type)
    }
  }

  /**
   * Finds all records with the given `type`. Always fetches from the server.
   *
   * @async
   * @method fetchAll
   * @param {String} type the type to find
   * @param {Object} options
   * @return {Promise} Promise.resolve(records) or Promise.reject(status)
   */
  async fetchAll (type, options = {}) {
    const { queryParams } = options
    const url = this.fetchUrl(type, queryParams)
    const response = await this.fetch(url, { method: 'GET' })

    if (response.status === 200) {
      this.data[type].cache.set(url, [])
      const json = await response.json()

      if (json.included) {
        this.createModelsFromData(json.included)
      }

      return transaction(() =>
        json.data.map((dataObject) => {
          const { id, attributes = {}, relationships = {} } = dataObject
          const record = this.createModel(type, id, { attributes, relationships })
          const cachedIds = this.data[type].cache.get(url)
          this.data[type].cache.set(url, [...cachedIds, id])
          this.data[type].records.set(String(id), record)
          return record
        })
      )
    } else {
      return Promise.reject(response.status)
    }
  }

  /**
   * Finds all records of the given `type`.
   * If all records are in the store, it returns those.
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
   *
   * NOTE: A broader RFC is in development to improve how we keep data in sync
   * with the server. We likely will want to getAll and getRecords
   * to return null if nothing is found. However, this causes several regressions
   * in portal we will need to address in a larger PR for mobx-async-store updates.
   *
   * @method findAll
   * @param {String} type the type to find
   * @param {Object} options { queryParams }
   * @return {Promise} Promise.resolve(records) or Promise.reject(status)
   */
  findAll = (type, options = {}) => {
    const records = this.getAll(type, options)
    if (records.length > 0) {
      return records
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
   * @method reset
   */
  reset (type) {
    if (type) {
      this.data[type] = {
        records: observable.map({}),
        cache: observable.map({})
      }
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
    this.headersOfInterest = options.headersOfInterest || []
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
    types.forEach((modelKlass) => {
      this.data[modelKlass.type] = {
        records: observable.map({}),
        cache: observable.map({})
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
    const { defaultFetchOptions, headersOfInterest } = this
    const fetchOptions = { ...defaultFetchOptions, ...options }
    const key = JSON.stringify({ url, fetchOptions })

    return combineRacedRequests(key, () =>
      fetch(url, { ...defaultFetchOptions, ...options })
    ).then(response => {
      // Capture headers of interest
      if (headersOfInterest) {
        headersOfInterest.forEach(header => {
          const value = response.headers.get(header)
          // Only set if it has changed, to minimize observable changes
          if (this.lastResponseHeaders[header] !== value) this.lastResponseHeaders[header] = value
        })
      }

      return response
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
    if (!this.getType(type)) {
      throw new Error(`Could not find a collection for type '${type}'`)
    }

    const record = this.getType(type).records.get(String(id))

    if (!record || record === 'undefined') return

    return record
  }

  /**
   * Gets records for type of collection from observable
   *
   * NOTE: We only return records by unique id, this handles a scenario
   * where the store keeps around a reference to a newly persisted record by its temp uuid.
   * We can't simply remove the temp uuid reference because other
   * related models may be still using the temp uuid in their relationships
   * data object. However, when we are listing out records we want them
   * to be unique by the persisted id (which is updated after a Model.save)
   *
   * @method getRecords
   * @param {String} type
   * @return {Array} array of objects
   */
  getRecords (type) {
    const records = Array.from(this.getType(type).records.values()).filter(
      (value) => value && value !== 'undefined'
    )
    return uniqBy(records, 'id')
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
    return ids
      .map((id) => this.getRecord(type, id))
      .filter((record) => record)
      .filter((record) => typeof record !== 'undefined')
  }

  /**
   * Gets single from store based on cached query
   *
   * @method getCachedRecord
   * @param {String} type
   * @param id
   * @param {Object} queryParams
   * @return {Object} record
   */
  getCachedRecord (type, id, queryParams) {
    const cachedRecords = this.getCachedRecords(type, queryParams, id)

    return cachedRecords && cachedRecords[0]
  }

  /**
   * Gets records from store based on cached query
   *
   * @method getCachedRecords
   * @param {String} type type of records to get
   * @param {Object} queryParams
   * @param {String} id optional param if only getting 1 cached record by id
   * @return {Array} array of records
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
    const ids = this.getType(type).cache.get(url)
    if (!ids) return []
    const idsSet = new Set(toJS(ids))
    return Array.from(idsSet)
  }

  /**
   * Gets records from store based on cached query
   *
   * @method getCachedId
   * @param {String} type
   * @param {String} url
   * @return {Array} array of ids
   */
  getCachedId (type, id) {
    return this.getType(type).cache.get(String(id))
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

    let record = this.getRecord(type, id)

    if (record) {
      // Update existing object attributes
      Object.keys(attributes).forEach((key) => {
        set(record, key, attributes[key])
      })

      // If relationships are present, update relationships
      // TODO: relationships will always be truthy since we've defined a default above.
      if (relationships) {
        Object.keys(relationships).forEach((key) => {
          // Don't try to create relationship if meta included false
          if (!relationships[key].meta) {
            // defensive against existingRecord.relationships being undefined
            set(record, 'relationships', {
              ...record.relationships,
              [key]: relationships[key]
            })
          }
        })
      }
      record._takeSnapshot({ persisted: true })
    } else {
      record = this.createModel(type, id, { attributes, relationships })
    }

    this.data[type].records.set(String(record.id), record)
    return record
  }

  /**
   * Create multiple models from an array of data
   *
   * @method createModelsFromData
   * @param {Array} data
   */
  createModelsFromData (data) {
    return transaction(() =>
      data.map((dataObject) => {
        // Only build objects for which we have a type defined.
        // And ignore silently anything else included in the JSON response.
        // TODO: Put some console message in development mode
        if (this.getType(dataObject.type)) {
          return this.createOrUpdateModel(dataObject)
        } else {
          console.warn(`no type defined for ${dataObject.type}`)
          return null
        }
      })
    )
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
   * Defines a resolution for an API call that will update a record or
   * set of records with the data returned from the API
   *
   * @method updateRecords
   * @param {Promise} a request to the API
   * @param {Model|Array} records to be updated
   */
  updateRecords (promise, records) {
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

          data.forEach((targetData, index) => {
            recordsArray[index].updateAttributesFromResponse(
              targetData,
              included
            )
          })

          if (json.included) {
            this.createModelsFromData(json.included)
          }

          // on success, return the original record(s).
          // again - this may be a single record so preserve the structure
          return records
        } else {
          let json = {}
          try {
            json = await response.json()
          } catch (error) {
            // 500 doesn't return a parsable response
            return Promise.reject(new Error(this.genericErrorMessage))
          }

          if (!json.errors) {
            return Promise.reject(new Error(this.genericErrorMessage))
          }

          if (!Array.isArray(json.errors)) {
            return Promise.reject(new TypeError('Top level errors in response are not an array.'))
          }

          // Add all errors from the API response to the record(s).
          // This is done by comparing the pointer in the error to
          // the request.
          json.errors.forEach((error) => {
            const { index, key } = parseErrorPointer(error)
            if (key != null) {
              const errors = recordsArray[index].errors[key] || []
              errors.push(error)
              recordsArray[index].errors[key] = errors
            }
          })
          const errorString = recordsArray
            .map((record) => JSON.stringify(record.errors))
            .join(';')

          return Promise.reject(new Error(errorString))
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
