/**
 * Defines the Data Store class.
 */
declare class Store {
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
    data: {};
    /**
     * The most recent response headers according to settings specified as `headersOfInterest`
     *
     * @type {object}
     * @default {}
     */
    lastResponseHeaders: {};
    /**
     * Map of data that is in flight. This can be observed to know if a given type (or tag)
     * is still processing.
     * - Key is a tag that is either the model type or a custom value
     * - Falue is a Set of JSON-encoded objects with unique urls and queryParams
     *   Set[JSON.stringify({ url, type, queryParams, queryTag })]
     *
     * @type {Map}
     */
    loadingStates: Map<any, any>;
    /**
     * Map of data that has been loaded into the store. This can be observed to know if a given
     * type (or tag) has finished loading.
     * - Key is a tag that is either the model type or a custom value
     * - Falue is a Set of JSON-encoded objects with unique urls and queryParams
     *   Set[JSON.stringify({ url, type, queryParams, queryTag })]
     *
     * @type {Map}
     */
    loadedStates: Map<any, any>;
    /**
     * True if models in the store should stop taking snapshots. This is
     * useful when updating records without causing records to become
     * 'dirty', for example when initializing records using `add`
     *
     * @type {boolean}
     */
    pauseSnapshots: boolean;
    /**
     * Initializer for Store class
     *
     * @param {object} options options to use for initialization
     */
    constructor(options: any);
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
    add(type: any, props: {} | undefined, options: any): any;
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
    pickAttributes(properties: any, type: any): Pick<any, string>;
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
    pickRelationships(properties: any, type: any): Pick<any, string>;
    /**
     * Saves a collection of records via a bulk-supported JSONApi endpoint.
     * All records need to be of the same type.
     *
     * @param {string} type the model type
     * @param {Array} records records that will be bulk saved
     * @param {object} options {queryParams, extensions}
     * @returns {Promise} the saved records
     */
    bulkSave(type: any, records: any, options?: {}): any;
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
    _bulkSave(type: any, records: any, options: {} | undefined, method: any): any;
    /**
     * Save a collection of new records via a bulk-supported JSONApi endpoint.
     * All records need to be of the same type and not have an existing id.
     *
     * @param {string} type the model type
     * @param {Array} records to be bulk created
     * @param {object} options {queryParams, extensions}
     * @returns {Promise} the created records
     */
    bulkCreate(type: any, records: any, options?: {}): any;
    /**
     * Updates a collection of records via a bulk-supported JSONApi endpoint.
     * All records need to be of the same type and have an existing id.
     *
     * @param {string} type the model type
     * @param {Array} records array of records to be bulk updated
     * @param {object} options {queryParams, extensions}
     * @returns {Promise} the saved records
     */
    bulkUpdate(type: any, records: any, options?: {}): any;
    /**
     * Removes a record from the store by deleting it from the
     * type's record map
     *
     * @param {string} type the model type
     * @param {string} id of record to remove
     */
    remove(type: any, id: any): void;
    /**
     * Gets a record from the store. Will never fetch from the server.
     * If given queryParams, it will check the cache for the record.
     *
     * @param {string} type the type to find
     * @param {string} id the id of the record to get
     * @param {object} options { queryParams }
     * @returns {object} record
     */
    getOne(type: any, id: any, options?: {}): any;
    /**
     * Fetches record by `id` from the server and returns a Promise.
     *
     * @async
     * @param {string} type the record type to fetch
     * @param {string} id the id of the record to fetch
     * @param {object} options { queryParams }
     * @returns {Promise} record result wrapped in a Promise
     */
    fetchOne(type: any, id: any, options?: {}): Promise<any>;
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
    findOne(type: any, id: any, options?: {}): any;
    /**
     * Get all records with the given `type` and `ids` from the store. This will never fetch from the server.
     *
     * @param {string} type the type to get
     * @param {string} ids the ids of the records to get
     * @param {object} options { queryParams }
     * @returns {Array} array of records
     */
    getMany(type: any, ids: any, options?: {}): any[];
    /**
     * Fetch all records with the given `type` and `ids` from the server.
     *
     * @param {string} type the type to get
     * @param {string} ids the ids of the records to get
     * @param {object} options { queryParams }
     * @returns {Promise} Promise.resolve(records) or Promise.reject([Error: [{ detail, status }])
     */
    fetchMany(type: any, ids: any, options?: {}): Promise<never[]>;
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
    findMany(type: any, ids: any, options?: {}): Promise<any[]>;
    /**
     * Builds fetch url based on type, queryParams, id, and options
     *
     * @param {string} type the type to find
     * @param {object} queryParams params to be used in the fetch
     * @param {string} id a model id
     * @param {object} options options for fetching
     * @returns {string} a formatted url
     */
    fetchUrl(type: any, queryParams: any, id: any, options: any): string;
    /**
     * Gets all records with the given `type` from the store. This will never fetch from the server.
     *
     * @param {string} type the type to find
     * @param {object} options options for fetching queryParams
     * @returns {Array} array of records
     */
    getAll(type: any, options?: {}): any[];
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
    setLoadingState({ url, type, queryParams, queryTag }: {
        url: any;
        type: any;
        queryParams: any;
        queryTag: any;
    }): {
        url: any;
        type: any;
        queryParams: any;
        queryTag: any;
    };
    /**
     * Removes a loading state. If that leaves an empty array for the map key in `loadingStates`,
     * will also delete the set. Also adds to loadedStates.
     *
     * @param {object} state the state to remove
     */
    deleteLoadingState(state: any): void;
    /**
     * Finds all records with the given `type`. Always fetches from the server.
     *
     * @async
     * @param {string} type the type to find
     * @param {object} options query params and other options
     * @returns {Promise} Promise.resolve(records) or Promise.reject([Error: [{ detail, status }])
     */
    fetchAll(type: any, options?: {}): Promise<undefined>;
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
    findAll(type: any, options: any): Promise<any[]> | Promise<undefined>;
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
    reset(type: any): void;
    /**
     * Entry point for configuring the store
     *
     * @param {object} options passed to constructor
     */
    init(options?: {}): void;
    /**
     * Configures the store's network options
     *
     * @param {string} options the parameters that will be used to set up network requests
     * @param {string} options.baseUrl the API's root url
     * @param {object} options.defaultFetchOptions options that will be used when fetching
     * @param {Array} options.headersOfInterest an array of headers to watch
     * @param {object} options.retryOptions options for re-fetch attempts and interval
     */
    initializeNetworkConfiguration({ baseUrl, defaultFetchOptions, headersOfInterest, retryOptions }: {
        baseUrl?: string | undefined;
        defaultFetchOptions?: {} | undefined;
        headersOfInterest?: never[] | undefined;
        retryOptions?: {
            attempts: number;
            delay: number;
        } | undefined;
    }): void;
    /**
     * Creates the key/value index of model types
     *
     * @param {object} models a fallback list of models
     */
    initializeModelIndex(models: any): void;
    /**
     * Configure the error messages returned from the store when API requests fail
     *
     * @param {object} options for initializing the store
     *   options for initializing error messages for different HTTP status codes
     */
    initializeErrorMessages(options?: {}): void;
    /**
     * Wrapper around fetch applies user defined fetch options
     *
     * @param {string} url the url to fetch
     * @param {object} options override options to use for fetching
     * @returns {Promise} the data from the server
     */
    fetch(url: any, options?: {}): Promise<any>;
    /**
     * Gets individual record from store
     *
     * @param {string} type the model type
     * @param {number} id the model id
     * @returns {object} record
     */
    getRecord(type: any, id: any): any;
    /**
     * Gets records for type of collection
     *
     * @param {string} type the model type
     * @returns {Array} array of objects
     */
    getRecords(type: any): unknown[];
    /**
     * Get multiple records by id
     *
     * @param {string} type the model type
     * @param {Array} ids the ids to find
     * @returns {Array} array or records
     */
    getRecordsById(type: any, ids?: never[]): any[];
    /**
     * Clears the cache for provided record type
     *
     * @param {string} type the model type
     * @returns {Set} the cleared set
     */
    clearCache(type: any): any;
    /**
     * Gets single from store based on cached query
     *
     * @param {string} type the model type
     * @param {string} id the model id
     * @param {object} queryParams the params to be searched
     * @returns {object} record
     */
    getCachedRecord(type: any, id: any, queryParams: any): any;
    /**
     * Gets records from store based on cached query and any previously requested ids
     *
     * @param {string} type type of records to get
     * @param {object} queryParams query params that were used for the query
     * @param {string} id optional param if only getting 1 cached record by id
     * @returns {Array} array of records
     */
    getCachedRecords(type: any, queryParams: any, id: any): any[];
    /**
     * Gets records from store based on cached query
     *
     * @param {string} type the model type
     * @param {string} url the url that was requested
     * @returns {Array} array of ids
     */
    getCachedIds(type: any, url: any): unknown[];
    /**
     * Gets a record from store based on cached query
     *
     * @param {string} type the model type
     * @param {string} id the id to get
     * @returns {object} the cached object
     */
    getCachedId(type: any, id: any): any;
    /**
     * Helper to look up model class for type.
     *
     * @param {string} type the model type
     * @returns {Function} model constructor
     */
    getKlass(type: any): any;
    /**
     * Creates or updates a model
     *
     * @param {object} data the object will be used to update or create a model
     * @returns {object} the record
     */
    createOrUpdateModelFromData(data: any): any;
    /**
     * Updates a record from a jsonapi hash
     *
     * @param {object} record a Model record
     * @param {object} data jsonapi-formatted data
     */
    updateRecordFromData(record: any, data: any): void;
    /**
     * Create multiple models from an array of data. It will only build objects
     * with defined models, and ignore everything else in the data.
     *
     * @param {Array} data the array of jsonapi data
     * @returns {Array} an array of the models serialized
     */
    createOrUpdateModelsFromData(data: any): any;
    /**
     * Helper to create a new model
     *
     * @param {object} data id, type, attributes and relationships
     * @param {object} options currently supports `skipInitialization`
     * @returns {object} model instance
     */
    createModelFromData(data: any, options: any): any;
    /**
     * Defines a resolution for an API call that will update a record or
     * set of records with the data returned from the API
     *
     * @param {Promise} promise a response from the API
     * @param {object|Array} records to be updated
     * @returns {Promise} a resolved promise after operations have been performed
     */
    updateRecordsFromResponse(promise: any, records: any): any;
}
export default Store;
//# sourceMappingURL=Store.d.ts.map