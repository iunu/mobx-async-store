"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
/* global fetch */
var mobx_1 = require("mobx");
var utils_1 = require("./utils");
/**
 * Defines the Artemis Data Store class.
 *
 * @class Store
 * @constructor
 */
var Store = /** @class */ (function () {
    /**
     * Initializer for Store class
     *
     * @method constructor
     */
    function Store(options) {
        var _this = this;
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
        this.add = function (type, data) {
            if (data.constructor.name === 'Array') {
                return _this.addModels(type, data);
            }
            else {
                return _this.addModel(type, mobx_1.toJS(data));
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
        this.build = function (type, attributes) {
            var id = utils_1.dbOrNewId(attributes);
            var model = _this.createModel(type, id, { attributes: attributes });
            return model;
        };
        /**
         * @method addModel
         * @param {String} type
         * @param {Object} attributes json api attributes
         * @return {Object} Artemis Data record
         */
        this.addModel = function (type, attributes) {
            var id = utils_1.dbOrNewId(attributes);
            var model = _this.createModel(type, id, { attributes: attributes });
            // Add the model to the type records index
            _this.data[type].records.set(String(id), model);
            return model;
        };
        /**
         * @method addModels
         * @param {String} type
         * @param {String} data array of data objects
         * @return {Array} array of ArtemisData records
         */
        this.addModels = function (type, data) {
            return mobx_1.transaction(function () { return data.map(function (obj) { return _this.addModel(type, obj); }); });
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
        this.bulkSave = function (type, records, options) {
            if (options === void 0) { options = {}; }
            return __awaiter(_this, void 0, void 0, function () {
                var queryParams, extensions, url, recordAttributes, body, extensionStr, response;
                return __generator(this, function (_a) {
                    queryParams = options.queryParams, extensions = options.extensions;
                    url = this.fetchUrl(type, queryParams, null);
                    recordAttributes = records.map(function (record) { return record.jsonapi(options); });
                    body = JSON.stringify({ data: recordAttributes });
                    extensionStr = (extensions === null || extensions === void 0 ? void 0 : extensions.length) ? "ext=\"bulk," + extensions.join() + "\""
                        : 'ext="bulk"';
                    response = this.fetch(url, {
                        headers: __assign(__assign({}, this.defaultFetchOptions.headers), { 'Content-Type': "application/vnd.api+json; " + extensionStr }),
                        method: 'POST',
                        body: body
                    });
                    // update records based on response
                    return [2 /*return*/, this.updateRecords(response, records)];
                });
            });
        };
        /**
         * Adds a record from the store. We can't simply remove the record
         * by deleting the records property/key via delete due to a bug
         * in mobx.
         *
         * @method remove
         * @param {String} type
         * @param {String} id of record to remove
         */
        this.remove = function (type, id) {
            _this.data[type].records.delete(String(id));
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
        this.findOne = function (type, id, options) {
            if (options === void 0) { options = {}; }
            var fromServer = options.fromServer, queryParams = options.queryParams;
            if (fromServer === true) {
                // If fromServer is true always fetch the data and return
                return _this.fetchOne(type, id, queryParams);
            }
            else if (fromServer === false) {
                // If fromServer is false never fetch the data and return
                return _this.getRecord(type, id, queryParams);
            }
            else {
                return _this.findOrFetchOne(type, id, queryParams);
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
        this.findOrFetchOne = function (type, id, queryParams) {
            // Get the matching record
            var record = _this.getMatchingRecord(type, id, queryParams);
            // If the cached record is present
            if (record && record.id) {
                // Return data
                return record;
            }
            else {
                // Otherwise fetch it from the server
                return _this.fetchOne(type, id, queryParams);
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
        this.findMany = function (type, ids, options) {
            if (options === void 0) { options = {}; }
            var fromServer = options.fromServer;
            var idsToQuery = ids.slice().map(String);
            if (fromServer === false) {
                // If fromServer is false never fetch the data and return
                return _this.getRecords(type).filter(function (record) { return idsToQuery.includes(record.id); });
            }
            var recordsInStore = [];
            if (fromServer !== true) {
                recordsInStore = _this.getRecords(type).filter(function (record) { return idsToQuery.includes(record.id); });
                if (recordsInStore.length === idsToQuery.length) {
                    // if fromServer is not false or true, but all the records are in store, wrap it in a promise
                    return Promise.resolve(recordsInStore);
                }
                var recordIdsInStore_1 = recordsInStore.map(function (_a) {
                    var id = _a.id;
                    return String(id);
                });
                // If fromServer is not true, we will only query records that are not already in the store
                idsToQuery = idsToQuery.filter(function (id) { return !recordIdsInStore_1.includes(id); });
            }
            var queryParams = options.queryParams || {};
            queryParams.filter = queryParams.filter || {};
            var baseUrl = _this.fetchUrl(type, queryParams);
            var idQueries = utils_1.deriveIdQueryStrings(idsToQuery, baseUrl);
            var query = Promise.all(idQueries.map(function (queryIds) {
                queryParams.filter.ids = queryIds;
                return _this.fetchAll(type, queryParams);
            }));
            return query.then(function (recordsFromServer) { return recordsInStore.concat.apply(recordsInStore, recordsFromServer); });
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
        this.findAll = function (type, options) {
            if (options === void 0) { options = {}; }
            var fromServer = options.fromServer, queryParams = options.queryParams;
            if (fromServer === true) {
                // If fromServer is true always fetch the data and return
                return _this.fetchAll(type, queryParams);
            }
            else if (fromServer === false) {
                // If fromServer is false never fetch the data and return
                return _this.getMatchingRecords(type, queryParams) || [];
            }
            else {
                return _this.findOrFetchAll(type, queryParams) || [];
            }
        };
        /**
         * @method findAndFetchAll
         * @param {String} type the type to find
         * @param {Object} options
         * @return {Array}
         */
        this.findAndFetchAll = function (type, options) {
            if (options === void 0) { options = {}; }
            var beforeFetch = options.beforeFetch, afterFetch = options.afterFetch, beforeRefetch = options.beforeRefetch, afterRefetch = options.afterRefetch, afterError = options.afterError, queryParams = options.queryParams;
            var records = _this.getMatchingRecords(type, queryParams);
            // NOTE: See note findOrFetchAll about this conditional logic.
            if (records.length > 0) {
                beforeRefetch && beforeRefetch(records);
                _this.fetchAll(type, queryParams)
                    .then(function (result) { return afterRefetch && afterRefetch(result); })
                    .catch(function (error) { return afterError && afterError(error); });
            }
            else {
                beforeFetch && beforeFetch(records);
                _this.fetchAll(type, queryParams)
                    .then(function (result) { return afterFetch && afterFetch(result); })
                    .catch(function (error) { return afterError && afterError(error); });
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
        this.findOrFetchAll = function (type, queryParams) {
            // Get any matching records
            var records = _this.getMatchingRecords(type, queryParams);
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
                return _this.fetchAll(type, queryParams);
            }
        };
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
    Store.prototype.reset = function (type) {
        if (type) {
            this.data[type] = {
                records: mobx_1.observable.map({}),
                cache: mobx_1.observable.map({})
            };
        }
        else {
            this.initializeObservableDataProperty();
        }
    };
    /* Private Methods */
    /**
     * Entry point for configuring the store
     *
     * @method init
     * @param {Object} options passed to constructor
     */
    Store.prototype.init = function (options) {
        this.initializeNetworkConfiguration(options);
        this.initializeModelTypeIndex();
        this.initializeObservableDataProperty();
    };
    /**
     * Entry point for configuring the store
     *
     * @method initializeNetworkConfiguration
     * @param {Object} options for nextwork config
     */
    Store.prototype.initializeNetworkConfiguration = function (options) {
        if (options === void 0) { options = {}; }
        this.baseUrl = options.baseUrl || '';
        this.defaultFetchOptions = options.defaultFetchOptions || {};
    };
    /**
     * Entry point for configuring the store
     *
     * @method initializeNetworkConfiguration
     * @param {Object} options for nextwork config
     */
    Store.prototype.initializeModelTypeIndex = function () {
        var types = this.constructor.types;
        this.modelTypeIndex = types.reduce(function (modelTypeIndex, modelKlass) {
            modelTypeIndex[modelKlass.type] = modelKlass;
            return modelTypeIndex;
        }, {});
    };
    /**
     * Creates an obserable index with model types
     * as the primary key
     *
     * Observable({ todos: {} })
     *
     * @method initializeObservableDataProperty
     */
    Store.prototype.initializeObservableDataProperty = function () {
        var _this = this;
        var types = this.constructor.types;
        // NOTE: Is there a performance cost to setting
        // each property individually?
        types.forEach(function (modelKlass) {
            _this.data[modelKlass.type] = {
                records: mobx_1.observable.map({}),
                cache: mobx_1.observable.map({})
            };
        });
    };
    /**
     * Wrapper around fetch applies user defined fetch options
     *
     * @method fetch
     * @param {String} url
     * @param {Object} options
     */
    Store.prototype.fetch = function (url, options) {
        if (options === void 0) { options = {}; }
        var defaultFetchOptions = this.defaultFetchOptions;
        var fetchOptions = __assign(__assign({}, defaultFetchOptions), options);
        var key = JSON.stringify({ url: url, fetchOptions: fetchOptions });
        return utils_1.combineRacedRequests(key, function () { return fetch(url, __assign(__assign({}, defaultFetchOptions), options)); });
    };
    /**
     * Gets type of collection from data observable
     *
     * @method getType
     * @param {String} type
     * @return {Object} observable type object structure
     */
    Store.prototype.getType = function (type) {
        return this.data[type];
    };
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
    Store.prototype.getMatchingRecord = function (type, id, queryParams) {
        if (queryParams) {
            return this.getCachedRecord(type, id, queryParams);
        }
        else {
            return this.getRecord(type, id);
        }
    };
    /**
     * Gets individual record from store
     *
     * @method getRecord
     * @param {String} type
     * @param {Number} id
     * @return {Object} record
     */
    Store.prototype.getRecord = function (type, id) {
        if (!this.getType(type)) {
            throw new Error("Could not find a collection for type '" + type + "'");
        }
        var record = this.getType(type).records.get(String(id));
        if (!record || record === 'undefined')
            return;
        return record;
    };
    /**
     * Gets records for type of collection from observable
     *
     * @method getRecords
     * @param {String} type
     * @return {Array} array of objects
     */
    Store.prototype.getRecords = function (type) {
        var records = Array.from(this.getType(type).records.values())
            .filter(function (value) { return value && value !== 'undefined'; });
        // NOTE: Handles a scenario where the store keeps around a reference
        // to a newly persisted record by its temp uuid. This is required
        // because we can't simply remove the temp uuid reference because other
        // related models may be still using the temp uuid in their relationships
        // data object. However, when we are listing out records we want them
        // to be unique by the persisted id (which is updated after a Model.save)
        return utils_1.uniqueBy(records, 'id');
    };
    /**
     * Gets single from store based on cached query
     *
     * @method getCachedRecord
     * @param {String} type
     * @param id
     * @param {Object} queryParams
     * @return {Array} array or records
     */
    Store.prototype.getCachedRecord = function (type, id, queryParams) {
        var cachedRecords = this.getCachedRecords(type, queryParams, id);
        return cachedRecords && cachedRecords[0];
    };
    /**
     * Gets records from store based on cached query
     *
     * @method getCachedRecords
     * @param {String} type
     * @param {Object} queryParams
     * @return {Array} array or records
     */
    Store.prototype.getCachedRecords = function (type, queryParams, id) {
        // Get the url the request would use
        var url = this.fetchUrl(type, queryParams, id);
        // Get the matching ids from the response
        var ids = this.getCachedIds(type, url);
        // Get the records matching the ids
        return this.getRecordsById(type, ids);
    };
    /**
     * Gets records from store based on cached query
     *
     * @method getCachedIds
     * @param {String} type
     * @param {String} url
     * @return {Array} array of ids
     */
    Store.prototype.getCachedIds = function (type, url) {
        var ids = this.getType(type).cache.get(url);
        if (!ids)
            return [];
        var idsSet = new Set(mobx_1.toJS(ids));
        return Array.from(idsSet);
    };
    /**
     * Gets records from store based on cached query
     *
     * @method getCachedId
     * @param {String} type
     * @param {String} url
     * @return {Array} array of ids
     */
    Store.prototype.getCachedId = function (type, id) {
        return this.getType(type).cache.get(String(id));
    };
    /**
     * Get multiple records by id
     *
     * @method getRecordsById
     * @param {String} type
     * @param {Array} ids
     * @return {Array} array or records
     */
    Store.prototype.getRecordsById = function (type, ids) {
        var _this = this;
        if (ids === void 0) { ids = []; }
        // NOTE: Is there a better way to do this?
        return ids.map(function (id) { return _this.getRecord(type, id); })
            .filter(function (record) { return record; })
            .filter(function (record) { return typeof record !== 'undefined'; });
    };
    /**
     * Gets records all records or records
     * based on query params
     *
     * @method getMatchingRecords
     * @param {String} type
     * @param {Object} queryParams
     * @return {Array} array or records
     */
    Store.prototype.getMatchingRecords = function (type, queryParams) {
        if (queryParams) {
            return this.getCachedRecords(type, queryParams);
        }
        else {
            return this.getRecords(type);
        }
    };
    /**
     * Helper to look up model class for type.
     *
     * @method getKlass
     * @param {String} type
     * @return {Class} model class
     */
    Store.prototype.getKlass = function (type) {
        return this.modelTypeIndex[type];
    };
    /**
     * Creates or updates a model
     *
     * @method createOrUpdateModel
     * @param {Object} dataObject
     */
    Store.prototype.createOrUpdateModel = function (dataObject) {
        var _a = dataObject.attributes, attributes = _a === void 0 ? {} : _a, id = dataObject.id, _b = dataObject.relationships, relationships = _b === void 0 ? {} : _b, type = dataObject.type;
        var record = this.getRecord(type, id);
        if (record) {
            // Update existing object attributes
            Object.keys(attributes).forEach(function (key) {
                mobx_1.set(record, key, attributes[key]);
            });
            // If relationships are present, update relationships
            if (relationships) {
                Object.keys(relationships).forEach(function (key) {
                    var _a;
                    // Don't try to create relationship if meta included false
                    if (!relationships[key].meta) {
                        // defensive against existingRecord.relationships being undefined
                        mobx_1.set(record, 'relationships', __assign(__assign({}, record.relationships), (_a = {}, _a[key] = relationships[key], _a)));
                    }
                });
            }
            record._takeSnapshot({ persisted: true });
        }
        else {
            record = this.createModel(type, id, { attributes: attributes, relationships: relationships });
        }
        this.data[type].records.set(String(record.id), record);
        return record;
    };
    /**
     * Create multiple models from an array of data
     *
     * @method createModelsFromData
     * @param {Array} data
     */
    Store.prototype.createModelsFromData = function (data) {
        var _this = this;
        return mobx_1.transaction(function () { return data.map(function (dataObject) {
            // Only build objects for which we have a type defined.
            // And ignore silently anything else included in the JSON response.
            // TODO: Put some console message in development mode
            if (_this.getType(dataObject.type)) {
                return _this.createOrUpdateModel(dataObject);
            }
        }); });
    };
    /**
     * Helper to create a new model
     *
     * @method createModel
     * @param {String} type
     * @param {Number} type
     * @param {Object} attributes
     * @return {Object} model instance
     */
    Store.prototype.createModel = function (type, id, data) {
        var _a = mobx_1.toJS(data), _b = _a.attributes, attributes = _b === void 0 ? {} : _b, _c = _a.relationships, relationships = _c === void 0 ? {} : _c;
        var store = this;
        var ModelKlass = this.getKlass(type);
        if (!ModelKlass) {
            throw new Error("Could not find a model for '" + type + "'");
        }
        return new ModelKlass(__assign({ id: id, store: store, relationships: relationships }, attributes));
    };
    /**
     * Builds fetch url based
     *
     * @method fetchUrl
     * @param {String} type the type to find
     * @param {Object} options
     */
    Store.prototype.fetchUrl = function (type, queryParams, id, options) {
        var _a = this, baseUrl = _a.baseUrl, modelTypeIndex = _a.modelTypeIndex;
        var endpoint = modelTypeIndex[type].endpoint;
        return utils_1.requestUrl(baseUrl, endpoint, queryParams, id, options);
    };
    /**
     * finds an instance by `id`. If available in the store, returns that instance. Otherwise, triggers a fetch.
     *
     * @method fetchAll
     * @param {String} type the type to find
     * @param {Object} options
     */
    Store.prototype.fetchAll = function (type, queryParams) {
        return __awaiter(this, void 0, void 0, function () {
            var store, url, response, json_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        store = this;
                        url = this.fetchUrl(type, queryParams);
                        return [4 /*yield*/, this.fetch(url, { method: 'GET' })];
                    case 1:
                        response = _a.sent();
                        if (!(response.status === 200)) return [3 /*break*/, 3];
                        this.data[type].cache.set(url, []);
                        return [4 /*yield*/, response.json()];
                    case 2:
                        json_1 = _a.sent();
                        if (json_1.included) {
                            this.createModelsFromData(json_1.included);
                        }
                        return [2 /*return*/, mobx_1.transaction(function () { return json_1.data.map(function (dataObject) {
                                var id = dataObject.id, _a = dataObject.attributes, attributes = _a === void 0 ? {} : _a, _b = dataObject.relationships, relationships = _b === void 0 ? {} : _b;
                                var ModelKlass = _this.modelTypeIndex[type];
                                var record = new ModelKlass(__assign({ store: store, relationships: relationships }, attributes));
                                var cachedIds = _this.data[type].cache.get(url);
                                _this.data[type].cache.set(url, __spreadArrays(cachedIds, [id]));
                                _this.data[type].records.set(String(id), record);
                                return record;
                            }); })];
                    case 3: return [2 /*return*/, Promise.reject(response.status)];
                }
            });
        });
    };
    /**
     * fetches record by `id`.
     *
     * @async
     * @method fetchOne
     * @param {String} type the type to find
     * @param {String} id
     */
    Store.prototype.fetchOne = function (type, id, queryParams) {
        return __awaiter(this, void 0, void 0, function () {
            var url, response, json, data, included, record;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = this.fetchUrl(type, queryParams, id);
                        return [4 /*yield*/, this.fetch(url, { method: 'GET' })
                            // Handle response
                        ];
                    case 1:
                        response = _a.sent();
                        if (!(response.status === 200)) return [3 /*break*/, 3];
                        return [4 /*yield*/, response.json()];
                    case 2:
                        json = _a.sent();
                        data = json.data, included = json.included;
                        if (included) {
                            this.createModelsFromData(included);
                        }
                        record = this.createOrUpdateModel(data);
                        this.data[type].cache.set(url, [record.id]);
                        return [2 /*return*/, record];
                    case 3: 
                    // Return null if record is not found
                    return [2 /*return*/, null];
                }
            });
        });
    };
    /**
     * Defines a resolution for an API call that will update a record or
     * set of records with the data returned from the API
     *
     * @method updateRecords
     * @param {Promise} a request to the API
     * @param {Model|Array} records to be updated
     */
    Store.prototype.updateRecords = function (promise, records) {
        var _this = this;
        // records may be a single record, if so wrap it in an array to make
        // iteration simpler
        var recordsArray = Array.isArray(records) ? records : [records];
        recordsArray.forEach(function (record) { record.isInFlight = true; });
        return promise.then(function (response) { return __awaiter(_this, void 0, void 0, function () {
            var status, json, data, included_1, json, error_1, errorString;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        status = response.status;
                        if (!(status === 200 || status === 201)) return [3 /*break*/, 2];
                        return [4 /*yield*/, response.json()];
                    case 1:
                        json = _a.sent();
                        data = Array.isArray(json.data) ? json.data : [json.data];
                        included_1 = json.included;
                        if (data.length !== recordsArray.length)
                            throw new Error('Invariant violated: API response data and records to update do not match');
                        data.forEach(function (targetData, index) {
                            recordsArray[index].updateAttributesFromResponse(targetData, included_1);
                        });
                        if (json.included) {
                            this.createModelsFromData(json.included);
                        }
                        // on success, return the original record(s).
                        // again - this may be a single record so preserve the structure
                        return [2 /*return*/, records];
                    case 2:
                        recordsArray.forEach(function (record) { record.isInFlight = false; });
                        json = {};
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, response.json()];
                    case 4:
                        json = _a.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        error_1 = _a.sent();
                        // 500 doesn't return a parsable response
                        return [2 /*return*/, Promise.reject(new Error(this.genericErrorMessage))];
                    case 6:
                        // Add all errors from the API response to the record(s).
                        // This is done by comparing the pointer in the error to
                        // the request.
                        json.errors.forEach(function (error) {
                            var _a = utils_1.parseErrorPointer(error), index = _a.index, key = _a.key;
                            if (key != null) {
                                var errors = recordsArray[index].errors[key] || [];
                                errors.push(error);
                                recordsArray[index].errors[key] = errors;
                            }
                        });
                        errorString = recordsArray
                            .map(function (record) { return JSON.stringify(record.errors); })
                            .join(';');
                        return [2 /*return*/, Promise.reject(new Error(errorString))];
                }
            });
        }); }, function (error) {
            // TODO: Handle error states correctly, including handling errors for multiple targets
            recordsArray.forEach(function (record) { record.isInFlight = false; });
            recordsArray[0].errors = error;
            throw error;
        });
    };
    __decorate([
        mobx_1.observable
    ], Store.prototype, "data", void 0);
    __decorate([
        mobx_1.action
    ], Store.prototype, "addModel", void 0);
    __decorate([
        mobx_1.action
    ], Store.prototype, "remove", void 0);
    return Store;
}());
exports.default = Store;
//# sourceMappingURL=Store.js.map