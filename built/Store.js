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
         * @method addModel
         * @param {String} type
         * @param {Object} attributes json api attributes
         * @return {Object} Artemis Data record
         */
        this.addModel = function (type, attributes) {
            var id = utils_1.dbOrNewId(attributes);
            var model = _this.createModel(type, id, { attributes: attributes });
            // Add the model to the type records index
            _this.data[type].records[id] = model;
            return model;
        };
        /**
         * @method addModels
         * @param {String} type
         * @param {String} data array of data objects
         * @return {Array} array of ArtemisData records
         */
        this.addModels = function (type, data) {
            var records = [];
            mobx_1.transaction(function () {
                records = data.map(function (obj) { return _this.addModel(type, obj); });
            });
            return records;
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
            var records = _this.getRecords(type);
            _this.data[type].records = records.reduce(function (hash, record) {
                if (String(record.id) !== String(id)) {
                    hash[record.id] = record;
                }
                return hash;
            }, {});
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
        this.findAll = function (type, options) {
            if (options === void 0) { options = {}; }
            var fromServer = options.fromServer, queryParams = options.queryParams;
            if (fromServer === true) {
                // If fromServer is true always fetch the data and return
                return _this.fetchAll(type, queryParams);
            }
            else if (fromServer === false) {
                // If fromServer is false never fetch the data and return
                return _this.getMatchingRecords(type, queryParams);
            }
            else {
                return _this.findOrFetchAll(type, queryParams);
            }
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
            // If any records are present
            if (records.length > 0) {
                // Return data
                return records;
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
            this.data[type] = { records: {}, cache: {} };
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
            _this.data[modelKlass.type] = { records: {}, cache: {} };
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
        var record = this.getType(type).records[id];
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
        var records = Object.values(this.getType(type).records)
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
        var ids = this.getType(type).cache[url];
        if (!ids)
            return [];
        var idsSet = new Set(mobx_1.toJS(ids));
        return Array.from(idsSet);
    };
    /**
     * Gets records from store based on cached query
     *
     * @method getCachedIds
     * @param {String} type
     * @param {String} url
     * @return {Array} array of ids
     */
    Store.prototype.getCachedId = function (type, id) {
        return this.getType(type).cache[id];
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
        var _this = this;
        var _a = dataObject.attributes, attributes = _a === void 0 ? {} : _a, id = dataObject.id, _b = dataObject.relationships, relationships = _b === void 0 ? {} : _b, type = dataObject.type;
        var record = this.getRecord(type, id);
        if (record) {
            // Update existing object attributes
            Object.keys(attributes).forEach(function (key) {
                mobx_1.set(record, key, attributes[key]);
                mobx_1.set(_this.data[type].records, id, record);
            });
            // If relationships are present, update relationships
            if (relationships) {
                Object.keys(relationships).forEach(function (key) {
                    var _a;
                    // Don't try to create relationship if meta included false
                    if (!relationships[key].meta) {
                        // defensive against existingRecord.relationships being undefined
                        mobx_1.set(record, 'relationships', __assign(__assign({}, record.relationships), (_a = {}, _a[key] = relationships[key], _a)));
                        mobx_1.set(_this.data[type].records, id, record);
                    }
                });
            }
        }
        else {
            record = this.createModel(type, id, { attributes: attributes, relationships: relationships });
            this.data[type].records[record.id] = record;
        }
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
        var records = [];
        mobx_1.transaction(function () {
            records = data.forEach(function (dataObject) {
                // Only build objects for which we have a type defined.
                // And ignore silently anything else included in the JSON response.
                // TODO: Put some console message in development mode
                if (_this.getType(dataObject.type)) {
                    _this.createOrUpdateModel(dataObject);
                }
            });
        });
        return records;
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
            var store, url, response, json_1, records_1;
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
                        this.data[type].cache[url] = [];
                        return [4 /*yield*/, response.json()];
                    case 2:
                        json_1 = _a.sent();
                        if (json_1.included) {
                            this.createModelsFromData(json_1.included);
                        }
                        records_1 = [];
                        mobx_1.transaction(function () {
                            records_1 = json_1.data.map(function (dataObject) {
                                var id = dataObject.id, _a = dataObject.attributes, attributes = _a === void 0 ? {} : _a, _b = dataObject.relationships, relationships = _b === void 0 ? {} : _b;
                                var ModelKlass = _this.modelTypeIndex[type];
                                var record = new ModelKlass(__assign({ store: store, relationships: relationships }, attributes));
                                _this.data[type].cache[url].push(id);
                                _this.data[type].records[id] = record;
                                return record;
                            });
                        });
                        return [2 /*return*/, records_1];
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
                        this.data[type].cache[url] = [];
                        this.data[type].cache[url].push(record.id);
                        return [2 /*return*/, record];
                    case 3: 
                    // Return null if record is not found
                    return [2 /*return*/, null];
                }
            });
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
