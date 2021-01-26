"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/* global fetch */
const mobx_1 = require("mobx");
const utils_1 = require("./utils");
/**
 * Defines the Artemis Data Store class.
 *
 * @class Store
 * @constructor
 */
class Store {
    /**
     * Initializer for Store class
     *
     * @method constructor
     */
    constructor(options) {
        /**
         * Observable property used to store data and
         * handle changes to state
         *
         * @property data
         * @type {Object}
         * @default {}
         */
        this.data = {};
        this.genericErrorMessage = 'Something went wrong.';
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
        this.add = (type, data) => {
            if (data.constructor.name === 'Array') {
                return this.addModels(type, data);
            }
            else {
                return this.addModel(type, mobx_1.toJS(data));
            }
        };
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
        this.build = (type, attributes) => {
            const id = utils_1.dbOrNewId(attributes);
            const model = this.createModel(type, id, { attributes });
            return model;
        };
        /**
         * @method addModel
         * @param {String} type
         * @param {Object} attributes json api attributes
         * @return {Object} Artemis Data record
         */
        this.addModel = (type, attributes) => {
            const id = utils_1.dbOrNewId(attributes);
            const model = this.createModel(type, id, { attributes });
            // Add the model to the type records index
            this.data[type].records.set(String(id), model);
            return model;
        };
        /**
         * @method addModels
         * @param {String} type
         * @param {String} data array of data objects
         * @return {Array} array of ArtemisData records
         */
        this.addModels = (type, data) => {
            return mobx_1.transaction(() => data.map((obj) => this.addModel(type, obj)));
        };
        /**
         * Saves a collection of records via a bulk-supported JSONApi
         * endpoint. All records need to be of the same type.
         *
         * @method bulkSave
         * @param {String} type
         * @param {Array} records
         * @param {Object} options {queryParams, extensions}
         */
        this.bulkSave = (type, records, options = {}) => __awaiter(this, void 0, void 0, function* () {
            const { queryParams, extensions } = options;
            // get url for record type
            const url = this.fetchUrl(type, queryParams, null);
            // convert records to an appropriate jsonapi attribute/relationship format
            const recordAttributes = records.map((record) => record.jsonapi(options));
            // build a data payload
            const body = JSON.stringify({ data: recordAttributes });
            // build the json api extension string
            const extensionStr = (extensions === null || extensions === void 0 ? void 0 : extensions.length) ? `ext="bulk,${extensions.join()}"`
                : 'ext="bulk"';
            // send request
            const response = this.fetch(url, {
                headers: Object.assign(Object.assign({}, this.defaultFetchOptions.headers), { 'Content-Type': `application/vnd.api+json; ${extensionStr}` }),
                method: 'POST',
                body
            });
            // update records based on response
            return this.updateRecords(response, records);
        });
        /**
         * Adds a record from the store. We can't simply remove the record
         * by deleting the records property/key via delete due to a bug
         * in mobx.
         *
         * @method remove
         * @param {String} type
         * @param {String} id of record to remove
         */
        this.remove = (type, id) => {
            this.data[type].records.delete(String(id));
        };
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
        this.findOne = (type, id, options = {}) => {
            const { fromServer, queryParams } = options;
            if (fromServer === true) {
                // If fromServer is true always fetch the data and return
                return this.fetchOne(type, id, queryParams);
            }
            else if (fromServer === false) {
                // If fromServer is false never fetch the data and return
                return this.getRecord(type, id);
            }
            else {
                return this.findOrFetchOne(type, id, queryParams);
            }
        };
        /**
         * returns cache if exists, returns promise if not
         *
         * @method findOrFetchOne
         * @param {String} type record type
         * @param id
         * @param {Object} queryParams will inform whether to return cached or fetch
         */
        this.findOrFetchOne = (type, id, queryParams) => {
            // Get the matching record
            const record = this.getMatchingRecord(type, id, queryParams);
            // If the cached record is present
            if (record && record.id) {
                // Return data
                return record;
            }
            else {
                // Otherwise fetch it from the server
                return this.fetchOne(type, id, queryParams);
            }
        };
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
        this.findMany = (type, ids, options = {}) => {
            const { fromServer } = options;
            let idsToQuery = ids.slice().map(String);
            if (fromServer === false) {
                // If fromServer is false never fetch the data and return
                return this.getRecords(type).filter(record => idsToQuery.includes(record.id));
            }
            let recordsInStore = [];
            if (fromServer !== true) {
                recordsInStore = this.getRecords(type).filter(record => idsToQuery.includes(record.id));
                if (recordsInStore.length === idsToQuery.length) {
                    // if fromServer is not false or true, but all the records are in store, wrap it in a promise
                    return Promise.resolve(recordsInStore);
                }
                const recordIdsInStore = recordsInStore.map(({ id }) => String(id));
                // If fromServer is not true, we will only query records that are not already in the store
                idsToQuery = idsToQuery.filter(id => !recordIdsInStore.includes(id));
            }
            const queryParams = options.queryParams || {};
            queryParams.filter = queryParams.filter || {};
            const baseUrl = this.fetchUrl(type, queryParams);
            const idQueries = utils_1.deriveIdQueryStrings(idsToQuery, baseUrl);
            const query = Promise.all(idQueries.map((queryIds) => {
                queryParams.filter.ids = queryIds;
                return this.fetchAll(type, queryParams);
            }));
            return query.then(recordsFromServer => recordsInStore.concat(...recordsFromServer));
        };
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
        this.findAll = (type, options = {}) => {
            const { fromServer, queryParams } = options;
            if (fromServer === true) {
                // If fromServer is true always fetch the data and return
                return this.fetchAll(type, queryParams);
            }
            else if (fromServer === false) {
                // If fromServer is false never fetch the data and return
                return this.getMatchingRecords(type, queryParams) || [];
            }
            else {
                return this.findOrFetchAll(type, queryParams) || [];
            }
        };
        /**
         * @method findAndFetchAll
         * @param {String} type the type to find
         * @param {Object} options
         * @return {Array}
         */
        this.findAndFetchAll = (type, options = {}) => {
            const { beforeFetch, afterFetch, beforeRefetch, afterRefetch, afterError, queryParams } = options;
            const records = this.getMatchingRecords(type, queryParams);
            // NOTE: See note findOrFetchAll about this conditional logic.
            if (records.length > 0) {
                beforeRefetch && beforeRefetch(records);
                this.fetchAll(type, queryParams)
                    .then((result) => afterRefetch && afterRefetch(result))
                    .catch((error) => afterError && afterError(error));
            }
            else {
                beforeFetch && beforeFetch(records);
                this.fetchAll(type, queryParams)
                    .then((result) => afterFetch && afterFetch(result))
                    .catch((error) => afterError && afterError(error));
            }
            return records || [];
        };
        /**
         * returns cache if exists, returns promise if not
         *
         * @method findOrFetchAll
         * @param {String} type record type
         * @param {Object} queryParams will inform whether to return cached or fetch
         */
        this.findOrFetchAll = (type, queryParams) => {
            // Get any matching records
            const records = this.getMatchingRecords(type, queryParams);
            // NOTE: A broader RFC is in development to improve how we keep data in sync
            // with the server. We likely will want to getMatchingRecords and getRecords
            // to return null if nothing is found. However, this causes several regressions
            // in portal we will need to address in a larger PR for mobx-async-store updates.
            if (records.length > 0) {
                // Return data
                return Promise.resolve(records);
            }
            else {
                // Otherwise fetch it from the server
                return this.fetchAll(type, queryParams);
            }
        };
        mobx_1.makeObservable(this);
        this.init(options);
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
    reset(type) {
        if (type) {
            this.data[type] = {
                records: mobx_1.observable.map({}),
                cache: mobx_1.observable.map({})
            };
        }
        else {
            this.initializeObservableDataProperty();
        }
    }
    /* Private Methods */
    /**
     * Entry point for configuring the store
     *
     * @method init
     * @param {Object} options passed to constructor
     */
    init(options) {
        this.initializeNetworkConfiguration(options);
        this.initializeModelTypeIndex();
        this.initializeObservableDataProperty();
    }
    /**
     * Entry point for configuring the store
     *
     * @method initializeNetworkConfiguration
     * @param {Object} options for nextwork config
     */
    initializeNetworkConfiguration(options = {}) {
        this.baseUrl = options.baseUrl || '';
        this.defaultFetchOptions = options.defaultFetchOptions || {};
    }
    /**
     * Entry point for configuring the store
     *
     * @method initializeNetworkConfiguration
     * @param {Object} options for nextwork config
     */
    initializeModelTypeIndex() {
        const { types } = this.constructor;
        this.modelTypeIndex = types.reduce((modelTypeIndex, modelKlass) => {
            modelTypeIndex[modelKlass.type] = modelKlass;
            return modelTypeIndex;
        }, {});
    }
    /**
     * Creates an obserable index with model types
     * as the primary key
     *
     * Observable({ todos: {} })
     *
     * @method initializeObservableDataProperty
     */
    initializeObservableDataProperty() {
        const { types } = this.constructor;
        // NOTE: Is there a performance cost to setting
        // each property individually?
        types.forEach(modelKlass => {
            this.data[modelKlass.type] = {
                records: mobx_1.observable.map({}),
                cache: mobx_1.observable.map({})
            };
        });
    }
    /**
     * Wrapper around fetch applies user defined fetch options
     *
     * @method fetch
     * @param {String} url
     * @param {Object} options
     */
    fetch(url, options = {}) {
        const { defaultFetchOptions } = this;
        const fetchOptions = Object.assign(Object.assign({}, defaultFetchOptions), options);
        const key = JSON.stringify({ url, fetchOptions });
        return utils_1.combineRacedRequests(key, () => fetch(url, Object.assign(Object.assign({}, defaultFetchOptions), options)));
    }
    /**
     * Gets type of collection from data observable
     *
     * @method getType
     * @param {String} type
     * @return {Object} observable type object structure
     */
    getType(type) {
        return this.data[type];
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
    getMatchingRecord(type, id, queryParams) {
        if (queryParams) {
            return this.getCachedRecord(type, id, queryParams);
        }
        else {
            return this.getRecord(type, id);
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
    getRecord(type, id) {
        if (!this.getType(type)) {
            throw new Error(`Could not find a collection for type '${type}'`);
        }
        const record = this.getType(type).records.get(String(id));
        if (!record || record === 'undefined')
            return;
        return record;
    }
    /**
     * Gets records for type of collection from observable
     *
     * @method getRecords
     * @param {String} type
     * @return {Array} array of objects
     */
    getRecords(type) {
        const records = Array.from(this.getType(type).records.values())
            .filter(value => value && value !== 'undefined');
        // NOTE: Handles a scenario where the store keeps around a reference
        // to a newly persisted record by its temp uuid. This is required
        // because we can't simply remove the temp uuid reference because other
        // related models may be still using the temp uuid in their relationships
        // data object. However, when we are listing out records we want them
        // to be unique by the persisted id (which is updated after a Model.save)
        return utils_1.uniqueBy(records, 'id');
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
    getCachedRecord(type, id, queryParams) {
        const cachedRecords = this.getCachedRecords(type, queryParams, id);
        return cachedRecords && cachedRecords[0];
    }
    /**
     * Gets records from store based on cached query
     *
     * @method getCachedRecords
     * @param {String} type
     * @param {Object} queryParams
     * @return {Array} array or records
     */
    getCachedRecords(type, queryParams, id) {
        // Get the url the request would use
        const url = this.fetchUrl(type, queryParams, id);
        // Get the matching ids from the response
        const ids = this.getCachedIds(type, url);
        // Get the records matching the ids
        return this.getRecordsById(type, ids);
    }
    /**
     * Gets records from store based on cached query
     *
     * @method getCachedIds
     * @param {String} type
     * @param {String} url
     * @return {Array} array of ids
     */
    getCachedIds(type, url) {
        const ids = this.getType(type).cache.get(url);
        if (!ids)
            return [];
        const idsSet = new Set(mobx_1.toJS(ids));
        return Array.from(idsSet);
    }
    /**
     * Gets records from store based on cached query
     *
     * @method getCachedId
     * @param {String} type
     * @param {String} url
     * @return {Array} array of ids
     */
    getCachedId(type, id) {
        return this.getType(type).cache.get(String(id));
    }
    /**
     * Get multiple records by id
     *
     * @method getRecordsById
     * @param {String} type
     * @param {Array} ids
     * @return {Array} array or records
     */
    getRecordsById(type, ids = []) {
        // NOTE: Is there a better way to do this?
        return ids.map(id => this.getRecord(type, id))
            .filter(record => record)
            .filter(record => typeof record !== 'undefined');
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
    getMatchingRecords(type, queryParams) {
        if (queryParams) {
            return this.getCachedRecords(type, queryParams);
        }
        else {
            return this.getRecords(type);
        }
    }
    /**
     * Helper to look up model class for type.
     *
     * @method getKlass
     * @param {String} type
     * @return {Class} model class
     */
    getKlass(type) {
        return this.modelTypeIndex[type];
    }
    /**
     * Creates or updates a model
     *
     * @method createOrUpdateModel
     * @param {Object} dataObject
     */
    createOrUpdateModel(dataObject) {
        const { attributes = {}, id, relationships = {}, type } = dataObject;
        let record = this.getRecord(type, id);
        if (record) {
            // Update existing object attributes
            Object.keys(attributes).forEach(key => {
                mobx_1.set(record, key, attributes[key]);
            });
            // If relationships are present, update relationships
            if (relationships) {
                Object.keys(relationships).forEach(key => {
                    // Don't try to create relationship if meta included false
                    if (!relationships[key].meta) {
                        // defensive against existingRecord.relationships being undefined
                        mobx_1.set(record, 'relationships', Object.assign(Object.assign({}, record.relationships), { [key]: relationships[key] }));
                    }
                });
            }
            record._takeSnapshot({ persisted: true });
        }
        else {
            record = this.createModel(type, id, { attributes, relationships });
        }
        this.data[type].records.set(String(record.id), record);
        return record;
    }
    /**
     * Create multiple models from an array of data
     *
     * @method createModelsFromData
     * @param {Array} data
     */
    createModelsFromData(data) {
        return mobx_1.transaction(() => data.map(dataObject => {
            // Only build objects for which we have a type defined.
            // And ignore silently anything else included in the JSON response.
            // TODO: Put some console message in development mode
            if (this.getType(dataObject.type)) {
                return this.createOrUpdateModel(dataObject);
            }
        }));
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
    createModel(type, id, data) {
        const { attributes = {}, relationships = {} } = mobx_1.toJS(data);
        const store = this;
        const ModelKlass = this.getKlass(type);
        if (!ModelKlass) {
            throw new Error(`Could not find a model for '${type}'`);
        }
        return new ModelKlass(Object.assign({ id, store, relationships }, attributes));
    }
    /**
     * Builds fetch url based
     *
     * @method fetchUrl
     * @param {String} type the type to find
     * @param {Object} options
     */
    fetchUrl(type, queryParams, id, options) {
        const { baseUrl, modelTypeIndex } = this;
        const { endpoint } = modelTypeIndex[type];
        return utils_1.requestUrl(baseUrl, endpoint, queryParams, id);
    }
    /**
     * finds an instance by `id`. If available in the store, returns that instance. Otherwise, triggers a fetch.
     *
     * @method fetchAll
     * @param {String} type the type to find
     * @param {Object} options
     */
    fetchAll(type, queryParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const store = this;
            const url = this.fetchUrl(type, queryParams);
            const response = yield this.fetch(url, { method: 'GET' });
            if (response.status === 200) {
                this.data[type].cache.set(url, []);
                const json = yield response.json();
                if (json.included) {
                    this.createModelsFromData(json.included);
                }
                return mobx_1.transaction(() => json.data.map((dataObject) => {
                    const { id, attributes = {}, relationships = {} } = dataObject;
                    const ModelKlass = this.modelTypeIndex[type];
                    const record = new ModelKlass(Object.assign({ store, relationships }, attributes));
                    const cachedIds = this.data[type].cache.get(url);
                    this.data[type].cache.set(url, [...cachedIds, id]);
                    this.data[type].records.set(String(id), record);
                    return record;
                }));
            }
            else {
                return Promise.reject(response.status);
            }
        });
    }
    /**
     * fetches record by `id`.
     *
     * @async
     * @method fetchOne
     * @param {String} type the type to find
     * @param {String} id
     */
    fetchOne(type, id, queryParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = this.fetchUrl(type, queryParams, id);
            // Trigger request
            const response = yield this.fetch(url, { method: 'GET' });
            // Handle response
            if (response.status === 200) {
                const json = yield response.json();
                const { data, included } = json;
                if (included) {
                    this.createModelsFromData(included);
                }
                const record = this.createOrUpdateModel(data);
                this.data[type].cache.set(url, [record.id]);
                return record;
            }
            else {
                // Return null if record is not found
                return null;
            }
        });
    }
    /**
     * Defines a resolution for an API call that will update a record or
     * set of records with the data returned from the API
     *
     * @method updateRecords
     * @param {Promise} a request to the API
     * @param {Model|Array} records to be updated
     */
    updateRecords(promise, records) {
        // records may be a single record, if so wrap it in an array to make
        // iteration simpler
        const recordsArray = Array.isArray(records) ? records : [records];
        recordsArray.forEach((record) => { record.isInFlight = true; });
        return promise.then((response) => __awaiter(this, void 0, void 0, function* () {
            const { status } = response;
            if (status === 200 || status === 201) {
                const json = yield response.json();
                const data = Array.isArray(json.data) ? json.data : [json.data];
                const { included } = json;
                if (data.length !== recordsArray.length)
                    throw new Error('Invariant violated: API response data and records to update do not match');
                data.forEach((targetData, index) => {
                    recordsArray[index].updateAttributesFromResponse(targetData, included);
                });
                if (json.included) {
                    this.createModelsFromData(json.included);
                }
                // on success, return the original record(s).
                // again - this may be a single record so preserve the structure
                return records;
            }
            else {
                recordsArray.forEach(record => { record.isInFlight = false; });
                let json = {};
                try {
                    json = yield response.json();
                }
                catch (error) {
                    // 500 doesn't return a parsable response
                    return Promise.reject(new Error(this.genericErrorMessage));
                }
                // Add all errors from the API response to the record(s).
                // This is done by comparing the pointer in the error to
                // the request.
                json.errors.forEach(error => {
                    const { index, key } = utils_1.parseErrorPointer(error);
                    if (key != null) {
                        const errors = recordsArray[index].errors[key] || [];
                        errors.push(error);
                        recordsArray[index].errors[key] = errors;
                    }
                });
                const errorString = recordsArray
                    .map(record => JSON.stringify(record.errors))
                    .join(';');
                return Promise.reject(new Error(errorString));
            }
        }), function (error) {
            // TODO: Handle error states correctly, including handling errors for multiple targets
            recordsArray.forEach(record => { record.isInFlight = false; });
            recordsArray[0].errors = error;
            throw error;
        });
    }
}
__decorate([
    mobx_1.observable
], Store.prototype, "data", void 0);
__decorate([
    mobx_1.action
], Store.prototype, "addModel", void 0);
__decorate([
    mobx_1.action
], Store.prototype, "remove", void 0);
exports.default = Store;
//# sourceMappingURL=Store.js.map