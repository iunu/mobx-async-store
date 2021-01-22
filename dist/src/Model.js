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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mobx_1 = require("mobx");
var utils_1 = require("./utils");
var ObjectPromiseProxy_1 = __importDefault(require("./ObjectPromiseProxy"));
var schema_1 = __importDefault(require("./schema"));
var cloneDeep_1 = __importDefault(require("lodash/cloneDeep"));
var isEqual_1 = __importDefault(require("lodash/isEqual"));
var isObject_1 = __importDefault(require("lodash/isObject"));
var findLast_1 = __importDefault(require("lodash/findLast"));
/**
 * Maps the passed-in property names through and runs validations against those properties
 * @method validateProperties
 * @param {Object} model the model to check
 * @param {Array} propertyNames the names of the model properties to check
 * @param {Object} propertyDefinitions a hash map containing validators by property
 * @return {Array} an array of booleans representing results of validations
 */
function validateProperties(model, propertyNames, propertyDefinitions) {
    return propertyNames.map(function (property) {
        var validator = propertyDefinitions[property].validator;
        if (!validator)
            return true;
        var validationResult = validator(model[property], model);
        if (!validationResult.isValid) {
            model.errors[property] = validationResult.errors;
        }
        return validationResult.isValid;
    });
}
function stringifyIds(object) {
    Object.keys(object).forEach(function (key) {
        var property = object[key];
        if (typeof property === 'object') {
            if (property.id) {
                property.id = String(property.id);
            }
            stringifyIds(property);
        }
    });
}
/**
 @class Model
 */
var Model = /** @class */ (function () {
    /**
     * Initializer for model
     *
     * @method constructor
     */
    function Model(initialAttributes) {
        if (initialAttributes === void 0) { initialAttributes = {}; }
        /**
         * The type of the model. Defined on the class. Defaults to the underscored version of the class name
         * (eg 'calendar_events').
         *
         * @property type
         * @static
         */
        /**
         * The canonical path to the resource on the server. Defined on the class.
         * Defaults to the underscored version of the class name
         * @property store
         * @static
         */
        /**
          * has this object been destroyed?
          * @property _disposed
          * @type {Boolean}
          * @default false
          */
        this._disposed = false;
        /**
          * set of relationships which have changed since last snapshot
          * @property _dirtyRelationships
          * @type {Set}
          */
        this._dirtyRelationships = new Set();
        /**
          * set of attributes which have changed since last snapshot
          * @property _dirtyAttributes
          * @type {Set}
          */
        this._dirtyAttributes = new Set();
        /**
         * True if the instance is coming from / going to the server
         * ```
         * kpi = store.find('kpis', 5)
         * // fetch started
         * kpi.isInFlight
         * => true
         * // fetch finished
         * kpi.isInFlight
         * => false
         * ```
         * @property isInFlight
         * @type {Boolean}
         * @default false
         */
        this.isInFlight = false;
        /**
         * A hash of errors from the server
         * ```
         * kpi = store.find('kpis', 5)
         * kpi.errors
         * => { authorization: "You do not have access to this resource" }
         * ```
         * @property errors
         * @type {Object}
         * @default {}
         */
        this.errors = {};
        /**
         * a list of snapshots that have been taken since the record was either last persisted or since it was instantiated
         *
         * @property snapshots
         * @type {Array<Snapshot>}
         * @default []
         */
        this._snapshots = [];
        this._makeObservable(initialAttributes);
        this._takeSnapshot({ persisted: !this.isNew });
    }
    Object.defineProperty(Model.prototype, "isDirty", {
        /**
         * True if the instance has been modified from its persisted state
         *
         * NOTE that isDirty does _NOT_ track changes to the related objects
         * but it _does_ track changes to the relationships themselves.
         *
         * For example, adding or removing a related object will mark this record as dirty,
         * but changing a related object's properties will not mark this record as dirty.
         *
         * The caller is reponsible for asking related objects about their
         * own dirty state.
         *
         * ```
         * kpi = store.add('kpis', { name: 'A good thing to measure' })
         * kpi.isDirty
         * => true
         * kpi.name
         * => "A good thing to measure"
         * await kpi.save()
         * kpi.isDirty
         * => false
         * kpi.name = "Another good thing to measure"
         * kpi.isDirty
         * => true
         * await kpi.save()
         * kpi.isDirty
         * => false
         * ```
         * @property isDirty
         * @type {Boolean}
         */
        get: function () {
            return this._dirtyAttributes.size > 0 || this._dirtyRelationships.size > 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Model.prototype, "hasUnpersistedChanges", {
        /**
         * have any changes been made since this record was last persisted?
         * @property hasUnpersistedChanges
         * @type {Boolean}
         */
        get: function () {
            return this.isDirty || !this.previousSnapshot.persisted;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Model.prototype, "isNew", {
        /**
         * True if the model has not been sent to the store
         * @property isNew
         * @type {Boolean}
         */
        get: function () {
            var id = this.id;
            if (!id)
                return true;
            if (String(id).indexOf('tmp') === -1)
                return false;
            return true;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * restores data to its last snapshot state
     * ```
     * kpi = store.find('kpis', 5)
     * kpi.name
     * => "A good thing to measure"
     * kpi.name = "Another good thing to measure"
     * kpi.rollback()
     * kpi.name
     * => "A good thing to measure"
     * ```
     * @method rollback
     */
    Model.prototype.rollback = function () {
        this._applySnapshot(this.previousSnapshot);
    };
    /**
     * restores data to its last persisted state or the oldest snapshot
     * state if the model was never persisted
     * @method rollbackToPersisted
     */
    Model.prototype.rollbackToPersisted = function () {
        this._applySnapshot(this.persistedSnapshot);
        this._takeSnapshot({ persisted: true });
    };
    /**
     * creates or updates a record.
     * @method save
     * @return {Promise}
     * @param {Object} options
     */
    Model.prototype.save = function (options) {
        var _this_1 = this;
        if (options === void 0) { options = {}; }
        if (!options.skip_validations && !this.validate()) {
            var errorString = JSON.stringify(this.errors);
            return Promise.reject(new Error(errorString));
        }
        var queryParams = options.queryParams, relationships = options.relationships, attributes = options.attributes;
        var _a = this, constructor = _a.constructor, id = _a.id, isNew = _a.isNew;
        var requestId = id;
        var method = 'PATCH';
        if (isNew) {
            method = 'POST';
            requestId = null;
        }
        var url = this.store.fetchUrl(constructor.type, queryParams, requestId);
        var body = JSON.stringify({
            data: this.jsonapi({ relationships: relationships, attributes: attributes })
        });
        if (relationships) {
            relationships.forEach(function (rel) {
                if (Array.isArray(_this_1[rel])) {
                    _this_1[rel].forEach(function (item, i) {
                        if (item && item.isNew) {
                            throw new Error("Invariant violated: tried to save a relationship to an unpersisted record: \"" + rel + "[" + i + "]\"");
                        }
                    });
                }
                else if (_this_1[rel] && _this_1[rel].isNew) {
                    throw new Error("Invariant violated: tried to save a relationship to an unpersisted record: \"" + rel + "\"");
                }
            });
        }
        var response = this.store.fetch(url, { method: method, body: body });
        return ObjectPromiseProxy_1.default(response, this);
    };
    /**
     * Checks all validations, adding errors where necessary and returning `false` if any are not valid
     * Default is to check all validations, but they can be selectively run via options:
     *  - attributes - an array of names of attributes to validate
     *  - relationships - an array of names of relationships to validate
     *
     * @method validate
     * @param {Object} options
     * @return {Boolean}
     */
    Model.prototype.validate = function (options) {
        if (options === void 0) { options = {}; }
        this.errors = {};
        var _a = this, attributeDefinitions = _a.attributeDefinitions, relationshipDefinitions = _a.relationshipDefinitions;
        var attributeNames = options.attributes || this.attributeNames;
        var relationshipNames = options.relationships || this.relationshipNames;
        var validAttributes = validateProperties(this, attributeNames, attributeDefinitions);
        var validRelationships = validateProperties(this, relationshipNames, relationshipDefinitions);
        return validAttributes.concat(validRelationships).every(function (value) { return value; });
    };
    /**
     * deletes a record from the store and server
     * @method destroy
     * @return {Promise} an empty promise with any success/error status
     */
    Model.prototype.destroy = function (options) {
        if (options === void 0) { options = {}; }
        var _a = this, type = _a.constructor.type, id = _a.id, snapshot = _a.snapshot, isNew = _a.isNew;
        if (isNew) {
            this.store.remove(type, id);
            return snapshot;
        }
        var _b = options.params, params = _b === void 0 ? {} : _b, _c = options.skipRemove, skipRemove = _c === void 0 ? false : _c;
        var url = this.store.fetchUrl(type, params, id);
        this.isInFlight = true;
        var promise = this.store.fetch(url, { method: 'DELETE' });
        var _this = this;
        _this.errors = {};
        return promise.then(function (response) {
            return __awaiter(this, void 0, void 0, function () {
                var json_1, err_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _this.isInFlight = false;
                            if (![200, 202, 204].includes(response.status)) return [3 /*break*/, 5];
                            if (!skipRemove) {
                                _this.store.remove(type, id);
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, response.json()];
                        case 2:
                            json_1 = _a.sent();
                            if (json_1.data && json_1.data.attributes) {
                                Object.keys(json_1.data.attributes).forEach(function (key) {
                                    mobx_1.set(_this, key, json_1.data.attributes[key]);
                                });
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            err_1 = _a.sent();
                            console.log(err_1);
                            return [3 /*break*/, 4];
                        case 4:
                            // NOTE: If deleting a record changes other related model
                            // You can return then in the delete response
                            if (json_1 && json_1.included) {
                                _this.store.createModelsFromData(json_1.included);
                            }
                            _this.dispose();
                            return [2 /*return*/, _this];
                        case 5:
                            _this.errors = { status: response.status };
                            return [2 /*return*/, _this];
                    }
                });
            });
        }, function (error) {
            // TODO: Handle error states correctly
            _this.isInFlight = false;
            _this.errors = error;
            throw error;
        });
    };
    /* Private Methods */
    /**
     * Magic method that makes changes to records
     * observable
     *
     * @method _makeObservable
     */
    Model.prototype._makeObservable = function (initialAttributes) {
        var defaultAttributes = this.defaultAttributes;
        mobx_1.extendObservable(this, __assign(__assign({}, defaultAttributes), initialAttributes));
        this._listenForChanges();
    };
    /**
     * sets up a reaction for each top-level attribute so we can compare
     * values after each mutation and keep track of dirty attr states
     * if an attr is different than the last snapshot, add it to the
     * _dirtyAttributes set
     * if it's the same as the last snapshot, make sure it's _not_ in the
     * _dirtyAttributes set
     * @method _listenForChanges
     */
    Model.prototype._listenForChanges = function () {
        var _this_1 = this;
        this._disposers = Object.keys(this.attributes).map(function (attr) {
            return mobx_1.reaction(function () { return _this_1.attributes[attr]; }, function (value) {
                var previousValue = _this_1.previousSnapshot.attributes[attr];
                if (isEqual_1.default(previousValue, value)) {
                    _this_1._dirtyAttributes.delete(attr);
                }
                else if (isObject_1.default(value)) { // handles Objects and Arrays
                    // clear out any dirty attrs that start with this attr prefix
                    // then we can reset them if they are still (or newly) dirty
                    Array.from(_this_1._dirtyAttributes).forEach(function (path) {
                        if (path.indexOf(attr + ".") === 0) {
                            _this_1._dirtyAttributes.delete(path);
                        }
                    });
                    utils_1.diff(previousValue, value).forEach(function (property) {
                        _this_1._dirtyAttributes.add(attr + "." + property);
                    });
                }
                else {
                    _this_1._dirtyAttributes.add(attr);
                }
            });
        });
    };
    /**
     * call this when destroying an object to make sure that we clean up
     * any event listeners and don't leak memory
     * @method dispose
     */
    Model.prototype.dispose = function () {
        this._disposed = true;
        this._disposers.forEach(function (dispose) { return dispose(); });
    };
    Object.defineProperty(Model.prototype, "snapshot", {
        /**
         * The current state of defined attributes and relationships of the instance
         * Really just an alias for attributes
         * ```
         * todo = store.find('todos', 5)
         * todo.title
         * => "Buy the eggs"
         * snapshot = todo.snapshot
         * todo.title = "Buy the eggs and bacon"
         * snapshot.title
         * => "Buy the eggs and bacon"
         * ```
         * @method snapshot
         * @return {Object} current attributes
         */
        get: function () {
            return {
                attributes: this.attributes,
                relationships: mobx_1.toJS(this.relationships)
            };
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Sets previous snapshot to current snapshot
     *
     * @method setPreviousSnapshot
     */
    Model.prototype.setPreviousSnapshot = function () {
        this._takeSnapshot();
    };
    Object.defineProperty(Model.prototype, "previousSnapshot", {
        /**
         * the latest snapshot
         *
         * @method previousSnapshot
         */
        get: function () {
            var length = this._snapshots.length;
            if (length === 0)
                throw new Error('Invariant violated: model has no snapshots');
            return this._snapshots[length - 1];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Model.prototype, "persistedSnapshot", {
        /**
         * the latest persisted snapshot or the first snapshot if the model was never persisted
         *
         * @method previousSnapshot
         */
        get: function () {
            return findLast_1.default(this._snapshots, function (ss) { return ss.persisted; }) || this._snapshots[0];
        },
        enumerable: false,
        configurable: true
    });
    /**
     * take a snapshot of the current model state.
     * if persisted, clear the stack and push this snapshot to the top
     * if not persisted, push this snapshot to the top of the stack
     * @method _takeSnapshot
     * @param {Object} options
     */
    Model.prototype._takeSnapshot = function (options) {
        if (options === void 0) { options = {}; }
        var persisted = options.persisted || false;
        this._dirtyRelationships.clear();
        this._dirtyAttributes.clear();
        var _a = this.snapshot, attributes = _a.attributes, relationships = _a.relationships;
        var snapshot = {
            persisted: persisted,
            attributes: attributes,
            relationships: relationships
        };
        if (persisted) {
            this._snapshots = [];
        }
        this._snapshots.push(snapshot);
    };
    /**
     * set the current attributes and relationships to the attributes
     * and relationships of the snapshot to be applied. also reset errors
     * @method _applySnapshot
     * @param {Object} snapshot
     */
    Model.prototype._applySnapshot = function (snapshot) {
        var _this_1 = this;
        if (!snapshot)
            throw new Error('Invariant violated: tried to apply undefined snapshot');
        mobx_1.transaction(function () {
            _this_1.attributeNames.forEach(function (key) {
                _this_1[key] = snapshot.attributes[key];
            });
            _this_1.relationships = snapshot.relationships;
            _this_1.errors = {};
        });
    };
    Object.defineProperty(Model.prototype, "dirtyAttributes", {
        /**
         * a list of any property paths which have been changed since the previous
         * snapshot
         * ```
         * const todo = new Todo({ title: 'Buy Milk' })
         * todo.dirtyAttributes
         * => []
         * todo.title = 'Buy Cheese'
         * todo.dirtyAttributes
         * => ['title']
         * todo.note = note1
         * todo.dirtyAttributes
         * => ['title', 'relationships.note']
         * ```
         * @method dirtyAttributes
         * @return {Array} dirty attribute paths
         */
        get: function () {
            var relationships = Array.from(this._dirtyRelationships).map(function (property) { return "relationships." + property; });
            var attributes = Array.from(this._dirtyAttributes);
            return __spreadArrays(relationships, attributes);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Model.prototype, "type", {
        /**
         * shortcut to get the static
         *
         * @method type
         * @return {String} current attributes
        */
        get: function () {
            return this.constructor.type;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Model.prototype, "attributes", {
        /**
         * current attributes of record
         *
         * @method attributes
         * @return {Object} current attributes
         */
        get: function () {
            var _this_1 = this;
            return this.attributeNames.reduce(function (attributes, key) {
                var value = mobx_1.toJS(_this_1[key]);
                if (value == null) {
                    delete attributes[key];
                }
                else {
                    attributes[key] = value;
                }
                return attributes;
            }, {});
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Model.prototype, "attributeDefinitions", {
        /**
         * Getter find the attribute definition for the model type.
         *
         * @method attributeDefinitions
         * @return {Object}
         */
        get: function () {
            var type = this.constructor.type;
            return schema_1.default.structure[type] || {};
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Model.prototype, "relationshipDefinitions", {
        /**
         * Getter find the relationship definitions for the model type.
         *
         * @method relationshipDefinitions
         * @return {Object}
         */
        get: function () {
            var type = this.constructor.type;
            return schema_1.default.relations[type] || {};
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Model.prototype, "hasErrors", {
        /**
         * Getter to check if the record has errors.
         *
         * @method hasErrors
         * @return {Boolean}
         */
        get: function () {
            return Object.keys(this.errors).length > 0;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Getter to check if the record has errors.
     *
     * @method hasErrors
     * @return {Boolean}
     */
    Model.prototype.errorForKey = function (key) {
        return this.errors[key];
    };
    Object.defineProperty(Model.prototype, "attributeNames", {
        /**
         * Getter to just get the names of a records attributes.
         *
         * @method attributeNames
         * @return {Array}
         */
        get: function () {
            return Object.keys(this.attributeDefinitions);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Model.prototype, "relationshipNames", {
        /**
         * Getter to just get the names of a records relationships.
         *
         * @method relationshipNames
         * @return {Array}
         */
        get: function () {
            return Object.keys(this.relationshipDefinitions);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Model.prototype, "defaultAttributes", {
        /**
         * getter method to get the default attributes
         *
         * @method defaultAttributes
         * @return {Object}
         */
        get: function () {
            var attributeDefinitions = this.attributeDefinitions;
            return this.attributeNames.reduce(function (defaults, key) {
                var defaultValue = attributeDefinitions[key].defaultValue;
                defaults[key] = defaultValue;
                return defaults;
            }, {
                relationships: {}
            });
        },
        enumerable: false,
        configurable: true
    });
    /**
     * getter method to get data in api compliance format
     * TODO: Figure out how to handle unpersisted ids
     *
     * @method jsonapi
     * @return {Object} data in JSON::API format
     */
    Model.prototype.jsonapi = function (options) {
        var _this_1 = this;
        if (options === void 0) { options = {}; }
        var _a = this, attributeDefinitions = _a.attributeDefinitions, attributeNames = _a.attributeNames, meta = _a.meta, id = _a.id, type = _a.constructor.type;
        var filteredAttributeNames = attributeNames;
        var filteredRelationshipNames = [];
        if (options.attributes) {
            filteredAttributeNames = attributeNames
                .filter(function (name) { return options.attributes.includes(name); });
        }
        var attributes = filteredAttributeNames.reduce(function (attrs, key) {
            var value = _this_1[key];
            if (value) {
                var DataType = attributeDefinitions[key].dataType;
                var attr = void 0;
                if (DataType.name === 'Array' || DataType.name === 'Object') {
                    attr = mobx_1.toJS(value);
                }
                else if (DataType.name === 'Date') {
                    attr = utils_1.makeDate(value).toISOString();
                }
                else {
                    attr = DataType(value);
                }
                attrs[key] = attr;
            }
            else {
                attrs[key] = value;
            }
            return attrs;
        }, {});
        var data = {
            type: type,
            attributes: attributes,
            id: String(id)
        };
        if (options.relationships) {
            filteredRelationshipNames = Object.keys(this.relationships)
                .filter(function (name) { return options.relationships.includes(name); });
            var relationships = filteredRelationshipNames.reduce(function (rels, key) {
                rels[key] = mobx_1.toJS(_this_1.relationships[key]);
                stringifyIds(rels[key]);
                return rels;
            }, {});
            data.relationships = relationships;
        }
        if (meta) {
            data['meta'] = meta;
        }
        if (String(id).match(/tmp/)) {
            delete data.id;
        }
        return data;
    };
    Model.prototype.updateAttributes = function (attributes) {
        var _this_1 = this;
        mobx_1.transaction(function () {
            Object.keys(attributes).forEach(function (key) {
                _this_1[key] = attributes[key];
            });
        });
    };
    // TODO: this shares a lot of functionality with Store.createOrUpdateModel
    // Perhaps that shared code
    Model.prototype.updateAttributesFromResponse = function (data, included) {
        var _this_1 = this;
        var tmpId = this.id;
        var id = data.id, attributes = data.attributes, relationships = data.relationships;
        mobx_1.transaction(function () {
            mobx_1.set(_this_1, 'id', id);
            Object.keys(attributes).forEach(function (key) {
                mobx_1.set(_this_1, key, attributes[key]);
            });
            if (relationships) {
                Object.keys(relationships).forEach(function (key) {
                    if (!relationships[key].hasOwnProperty('meta')) {
                        // todo: throw error if relationship is not defined in model
                        mobx_1.set(_this_1.relationships, key, relationships[key]);
                    }
                });
            }
            if (included) {
                _this_1.store.createModelsFromData(included);
            }
        });
        // Update target isInFlight
        this.isInFlight = false;
        this._takeSnapshot({ persisted: true });
        mobx_1.transaction(function () {
            // NOTE: This resolves an issue where a record is persisted but the
            // index key is still a temp uuid. We can't simply remove the temp
            // key because there may be associated records that have the temp
            // uuid id as its only reference to the newly persisted record.
            // TODO: Figure out a way to update associated records to use the
            // newly persisted id.
            _this_1.store.data[_this_1.type].records.set(String(tmpId), _this_1);
            _this_1.store.data[_this_1.type].records.set(String(_this_1.id), _this_1);
        });
    };
    Model.prototype.clone = function () {
        var attributes = cloneDeep_1.default(this.snapshot.attributes);
        var relationships = cloneDeep_1.default(this.snapshot.relationships);
        return this.store.createModel(this.type, this.id, { attributes: attributes, relationships: relationships });
    };
    /**
     * Comparison by value
     * returns `true` if this object has the same attrs and relationships
     * as the "other" object, ignores differences in internal state like
     * attribute "dirtyness" or errors
     *
     * @method isEqual
     * @param {Object} other
     * @return {Object}
     */
    Model.prototype.isEqual = function (other) {
        if (!other)
            return false;
        return isEqual_1.default(this.attributes, other.attributes) && isEqual_1.default(this.relationships, other.relationships);
    };
    /**
     * Comparison by identity
     * returns `true` if this object has the same type and id as the
     * "other" object, ignores differences in attrs and relationships
     *
     * @method isSame
     * @param {Object} other
     * @return {Object}
     */
    Model.prototype.isSame = function (other) {
        if (!other)
            return false;
        return this.type === other.type && this.id === other.id;
    };
    __decorate([
        mobx_1.observable
    ], Model.prototype, "_disposed", void 0);
    __decorate([
        mobx_1.observable
    ], Model.prototype, "_dirtyRelationships", void 0);
    __decorate([
        mobx_1.observable
    ], Model.prototype, "_dirtyAttributes", void 0);
    __decorate([
        mobx_1.computed
    ], Model.prototype, "isNew", null);
    __decorate([
        mobx_1.observable
    ], Model.prototype, "errors", void 0);
    return Model;
}());
exports.default = Model;
//# sourceMappingURL=Model.js.map