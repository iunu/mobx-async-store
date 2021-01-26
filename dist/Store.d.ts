/**
 * Defines the Artemis Data Store class.
 *
 * @class Store
 * @constructor
 */
declare class Store {
    /**
     * Observable property used to store data and
     * handle changes to state
     *
     * @property data
     * @type {Object}
     * @default {}
     */
    data: any;
    defaultFetchOptions: any;
    baseUrl: string;
    modelTypeIndex: any;
    genericErrorMessage: string;
    /**
     * Initializer for Store class
     *
     * @method constructor
     */
    constructor(options: any);
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
    add: (type: any, data: any) => any;
    /**
     * Builds an instance of a model that includes either an automatically or manually created temporary ID, but does not add it to the store.
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
    build: (type: any, attributes: any) => any;
    /**
     * @method addModel
     * @param {String} type
     * @param {Object} attributes json api attributes
     * @return {Object} Artemis Data record
     */
    addModel: (type: any, attributes: any) => any;
    /**
     * @method addModels
     * @param {String} type
     * @param {String} data array of data objects
     * @return {Array} array of ArtemisData records
     */
    addModels: (type: any, data: any) => any;
    /**
     * Saves a collection of records via a bulk-supported JSONApi
     * endpoint. All records need to be of the same type.
     *
     * @method bulkSave
     * @param {String} type
     * @param {Array} records
     * @param {Object} options {queryParams, extensions}
     */
    bulkSave: (type: any, records: any, options?: any) => Promise<any>;
    /**
     * Adds a record from the store. We can't simply remove the record
     * by deleting the records property/key via delete due to a bug
     * in mobx.
     *
     * @method remove
     * @param {String} type
     * @param {String} id of record to remove
     */
    remove: (type: any, id: any) => void;
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
    findOne: (type: any, id: any, options?: any) => any;
    /**
     * returns cache if exists, returns promise if not
     *
     * @method findOrFetchOne
     * @param {String} type record type
     * @param id
     * @param {Object} queryParams will inform whether to return cached or fetch
     */
    findOrFetchOne: (type: any, id: any, queryParams: any) => any;
    /**
     * Like 'findOne', but with an array ids. If there are instances available in the store,
     * it will return those, otherwise it will trigger a fetch
     *
     *   store.findMany('todos', [1, 2, 3])
     *   // fetch triggered
     *   => [event1, event2, event3]
     *   store.findMany('todos', [3, 2, 1])
     *   // no fetch triggered
     *   => [event1, event2, event3]
     *
     * passing `fromServer` as an option will always trigger a
     * fetch if `true` and never trigger a fetch if `false`.
     * Otherwise, it will trigger the default behavior
     *
     *   store.findMany('todos', [1, 2])
     *   // fetch triggered
     *   => [event1, event2]
     *
     *   store.findMany('todos', [1, 2, 3], { fromServer: false })
     *   // no fetch triggered, only returns the records already in the store
     *   => [event1, event2]
     *
     *   store.findMany('todos')
     *   // fetch triggered
     *   => [event1, event2, event3]
     *
     *   // async stuff happens on the server
     *   store.findMany('todos', [1, 2, 3])
     *   // no fetch triggered
     *   => [event1, event2, event3]
     *
     *   store.findMany('todos', [1, 2, 3], { fromServer: true })
     *   // fetch triggered
     *   => [event1, event2, event3]
     *
     * Query params can be passed as part of the options hash.
     * The response will be cached, so the next time `findMany`
     * is called with identical params and values, the store will
     * first look for the local result (unless `fromServer` is `true`)
     *
     *   store.findMany('todos', [1, 2, 3], {
     *     queryParams: {
     *       filter: {
     *         start_time: '2020-06-01T00:00:00.000Z',
     *         end_time: '2020-06-02T00:00:00.000Z'
     *       }
     *     }
     *   })
     *
     * @method findMany
     * @param {String} type the type to find
     * @param {Object} options
     */
    findMany: (type: any, ids: any, options?: any) => any;
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
     *         start_time: '2020-06-01T00:00:00.000Z',
     *         end_time: '2020-06-02T00:00:00.000Z'
     *       }
     *     }
     *   })
     *
     * @method findAll
     * @param {String} type the type to find
     * @param {Object} options
     */
    findAll: (type: any, options?: any) => any;
    /**
     * @method findAndFetchAll
     * @param {String} type the type to find
     * @param {Object} options
     * @return {Array}
     */
    findAndFetchAll: (type: any, options?: any) => any;
    /**
     * returns cache if exists, returns promise if not
     *
     * @method findOrFetchAll
     * @param {String} type record type
     * @param {Object} queryParams will inform whether to return cached or fetch
     */
    findOrFetchAll: (type: any, queryParams: any) => Promise<any>;
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
    reset(type?: any): void;
    /**
     * Entry point for configuring the store
     *
     * @method init
     * @param {Object} options passed to constructor
     */
    init(options: any): void;
    /**
     * Entry point for configuring the store
     *
     * @method initializeNetworkConfiguration
     * @param {Object} options for nextwork config
     */
    initializeNetworkConfiguration(options?: any): void;
    /**
     * Entry point for configuring the store
     *
     * @method initializeNetworkConfiguration
     * @param {Object} options for nextwork config
     */
    initializeModelTypeIndex(): void;
    /**
     * Creates an obserable index with model types
     * as the primary key
     *
     * Observable({ todos: {} })
     *
     * @method initializeObservableDataProperty
     */
    initializeObservableDataProperty(): void;
    /**
     * Wrapper around fetch applies user defined fetch options
     *
     * @method fetch
     * @param {String} url
     * @param {Object} options
     */
    fetch(url: any, options?: {}): any;
    /**
     * Gets type of collection from data observable
     *
     * @method getType
     * @param {String} type
     * @return {Object} observable type object structure
     */
    getType(type: any): any;
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
    getMatchingRecord(type: any, id: any, queryParams: any): any;
    /**
     * Gets individual record from store
     *
     * @method getRecord
     * @param {String} type
     * @param {Number} id
     * @return {Object} record
     */
    getRecord(type?: any, id?: any): any;
    /**
     * Gets records for type of collection from observable
     *
     * @method getRecords
     * @param {String} type
     * @return {Array} array of objects
     */
    getRecords(type: any): any;
    /**
     * Gets single from store based on cached query
     *
     * @method getCachedRecord
     * @param {String} type
     * @param id
     * @param {Object} queryParams
     * @return {Array} array or records
     */
    getCachedRecord(type: any, id: any, queryParams: any): any;
    /**
     * Gets records from store based on cached query
     *
     * @method getCachedRecords
     * @param {String} type
     * @param {Object} queryParams
     * @return {Array} array or records
     */
    getCachedRecords(type: any, queryParams?: any, id?: any): any[];
    /**
     * Gets records from store based on cached query
     *
     * @method getCachedIds
     * @param {String} type
     * @param {String} url
     * @return {Array} array of ids
     */
    getCachedIds(type: any, url: any): unknown[];
    /**
     * Gets records from store based on cached query
     *
     * @method getCachedId
     * @param {String} type
     * @param {String} url
     * @return {Array} array of ids
     */
    getCachedId(type: any, id: any): any;
    /**
     * Get multiple records by id
     *
     * @method getRecordsById
     * @param {String} type
     * @param {Array} ids
     * @return {Array} array or records
     */
    getRecordsById(type: any, ids?: never[]): any[];
    /**
     * Gets records all records or records
     * based on query params
     *
     * @method getMatchingRecords
     * @param {String} type
     * @param {Object} queryParams
     * @return {Array} array or records
     */
    getMatchingRecords(type: any, queryParams: any): any;
    /**
     * Helper to look up model class for type.
     *
     * @method getKlass
     * @param {String} type
     * @return {Class} model class
     */
    getKlass(type: any): any;
    /**
     * Creates or updates a model
     *
     * @method createOrUpdateModel
     * @param {Object} dataObject
     */
    createOrUpdateModel(dataObject: any): any;
    /**
     * Create multiple models from an array of data
     *
     * @method createModelsFromData
     * @param {Array} data
     */
    createModelsFromData(data: any): any;
    /**
     * Helper to create a new model
     *
     * @method createModel
     * @param {String} type
     * @param {Number} type
     * @param {Object} attributes
     * @return {Object} model instance
     */
    createModel(type: any, id: any, data: any): any;
    /**
     * Builds fetch url based
     *
     * @method fetchUrl
     * @param {String} type the type to find
     * @param {Object} options
     */
    fetchUrl(type: any, queryParams: any, id?: any, options?: any): string;
    /**
     * finds an instance by `id`. If available in the store, returns that instance. Otherwise, triggers a fetch.
     *
     * @method fetchAll
     * @param {String} type the type to find
     * @param {Object} options
     */
    fetchAll(type: any, queryParams: any): Promise<any>;
    /**
     * fetches record by `id`.
     *
     * @async
     * @method fetchOne
     * @param {String} type the type to find
     * @param {String} id
     */
    fetchOne(type: any, id: any, queryParams: any): Promise<any>;
    /**
     * Defines a resolution for an API call that will update a record or
     * set of records with the data returned from the API
     *
     * @method updateRecords
     * @param {Promise} a request to the API
     * @param {Model|Array} records to be updated
     */
    updateRecords(promise: any, records: any): any;
}
export default Store;
