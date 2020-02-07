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
var moment_1 = __importDefault(require("moment"));
var utils_1 = require("./utils");
var ObjectPromiseProxy_1 = __importDefault(require("./ObjectPromiseProxy"));
var schema_1 = __importDefault(require("./schema"));
var cloneDeep_1 = __importDefault(require("lodash/cloneDeep"));
var get_1 = __importDefault(require("lodash/get"));
var flattenDeep_1 = __importDefault(require("lodash/flattenDeep"));
function isPresent(value) {
    return value !== null && value !== undefined && value !== '';
}
/**
 * returns `true` as long as the `value` is not `null`, `undefined`, or `''`
 * @method validatePresence
 * @param value
 */
function validatePresence(value) {
    return {
        isValid: isPresent(value),
        errors: [{
                key: 'blank',
                message: 'can\'t be blank'
            }]
    };
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
 * Helper method for apply the correct defaults to attributes.
 * @method defaultValueForDescriptor
 */
function defaultValueForDescriptor(descriptor, DataType) {
    if (typeof descriptor.initializer === 'function') {
        var value = descriptor.initializer();
        if (DataType.name === 'Date') {
            return moment_1.default(value).toDate();
        }
        else {
            return DataType(value);
        }
    }
    if (DataType.name === 'String')
        return '';
    if (DataType.name === 'Array')
        return [];
    return null;
}
/**
 * Defines attributes that will be serialized and deserialized. Takes one argument, a class that the attribute will be coerced to.
 * This can be a Javascript primitive or another class. `id` cannot be defined as it is assumed to exist.
 * Attributes can be defined with a default.
 * ```
 * class Todo extends Model {
 *   @attribute(Date) start_time = moment()
 * }
 * ```
 * @method attribute
 */
function attribute(dataType) {
    if (dataType === void 0) { dataType = function (obj) { return obj; }; }
    return function (target, property, descriptor) {
        var type = target.constructor.type;
        var defaultValue = defaultValueForDescriptor(descriptor, dataType);
        // Update the schema
        schema_1.default.addAttribute({
            dataType: dataType,
            defaultValue: defaultValue,
            property: property,
            type: type
        });
        // Return custom descriptor
        return {
            get: function () {
                return defaultValue;
            },
            set: function (value) {
                mobx_1.set(target, property, value);
            }
        };
    };
}
exports.attribute = attribute;
/**
 * Defines validations for attributes that will be applied before saving. Takes one argument, a function to validate
 * the attribute. The default validator is `presence`: not `null`, `undefined`, or `''`.
 * ```
 * function nonzero(value => value !== 0)
 *
 * class Todo extends Model {
 *   `@validates`
 *   `@attribute`(nonzero) numberOfAssignees
 * }
 * ```
 * @method validates
 */
function validates(target, property) {
    var validator = validatePresence;
    if (typeof target === 'function') {
        validator = target;
        return function (target, property) {
            var type = target.constructor.type;
            schema_1.default.addValidation({
                property: property,
                type: type,
                validator: validator
            });
        };
    }
    else {
        var type = target.constructor.type;
        schema_1.default.addValidation({
            property: property,
            type: type,
            validator: validator
        });
    }
}
exports.validates = validates;
/*
 * Defines a many-to-one relationship. Defaults to the class with camelized name of the property.
 * An optional argument specifies the data model, if different from the property name.
 * ```
 * class Note extends Model {
 *   @belongsTo todo
 *   @belongsTo(Facility) greenhouse
 * }
 * ```
 * Polymorphic relationships
 * Define `belongsTo` with the the associated models
 * Define `hasMany` as you normally would
 * ```
 * class Note extends Model {
 *   @belongsTo(Todo, ScheduledEvent) notable
 * }
 *
 * class Todo extends Model {
 *   @hasMany notes
 * }
 * ```
 * @method belongsTo
 */
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
         * The canonical path to the resource on the server. Defined on the class.
         * Defaults to the underscored version of the class name
         * @property endpoint
         * @static
         */
        this._dirtyRelationships = new Set();
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
         * The previous state of defined attributes and relationships of the instance
         *
         * @property previousSnapshot
         * @type {Object}
         * @default {}
         */
        this.previousSnapshot = {};
        this._makeObservable(initialAttributes);
        this.setPreviousSnapshot();
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
         * @default false
         */
        get: function () {
            return this.dirtyAttributes.length > 0;
        },
        enumerable: true,
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
        enumerable: true,
        configurable: true
    });
    /**
     * restores data to its last persisted state
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
        var _this_1 = this;
        mobx_1.transaction(function () {
            var previousSnapshot = _this_1.previousSnapshot;
            _this_1.attributeNames.forEach(function (key) {
                _this_1[key] = previousSnapshot.attributes[key];
            });
            _this_1.relationships = previousSnapshot.relationships;
            _this_1.errors = {};
        });
        this.setPreviousSnapshot();
    };
    /**
     * creates or updates a record.
     * @method save
     * @return {Promise}
     * @param {Object} options
     */
    Model.prototype.save = function (options) {
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
        var url = this.store.fetchUrl(this.type, queryParams, requestId);
        var body = JSON.stringify(this.jsonapi({ relationships: relationships, attributes: attributes }));
        var response = this.store.fetch(url, { method: method, body: body });
        return ObjectPromiseProxy_1.default(response, this);
    };
    /**
     * Checks all validations, adding errors where necessary and returning `false` if any are not valid
     * @method validate
     * @return {Boolean}
     */
    Model.prototype.validate = function () {
        var _this_1 = this;
        this.errors = {};
        var _a = this, attributeNames = _a.attributeNames, attributeDefinitions = _a.attributeDefinitions;
        var validationChecks = attributeNames.map(function (property) {
            var validator = attributeDefinitions[property].validator;
            if (!validator)
                return true;
            var validationResult = validator(_this_1[property], _this_1);
            if (!validationResult.isValid) {
                _this_1.errors[property] = validationResult.errors;
            }
            return validationResult.isValid;
        });
        return validationChecks.every(function (value) { return value; });
    };
    /**
     * deletes a record from the store and server
     * @method destroy
     * @return {Promise} an empty promise with any success/error status
     */
    Model.prototype.destroy = function (options) {
        if (options === void 0) { options = {}; }
        var _a = this, type = _a.type, id = _a.id, snapshot = _a.snapshot, isNew = _a.isNew;
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
                            if (!(response.status === 202 || response.status === 204)) return [3 /*break*/, 5];
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
        enumerable: true,
        configurable: true
    });
    /**
     * Sets previous snapshot to current snapshot
     *
     * @method setPreviousSnapshot
     */
    Model.prototype.setPreviousSnapshot = function () {
        this._dirtyRelationships = new Set();
        this.previousSnapshot = this.snapshot;
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
         * ```
         * @method dirtyAttributes
         * @return {Array} dirty attribute paths
         */
        get: function () {
            var _this_1 = this;
            var relationships = Array.from(this._dirtyRelationships).map(function (property) { return "relationships." + property; });
            var attributes = flattenDeep_1.default(utils_1.walk(this.previousSnapshot.attributes, function (prevValue, path) {
                var currValue = get_1.default(_this_1.snapshot.attributes, path);
                return prevValue === currValue ? undefined : path;
            }, null, null)).filter(function (x) { return x; });
            return __spreadArrays(relationships, attributes);
        },
        enumerable: true,
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
            return this.type;
        },
        enumerable: true,
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
                if (!value) {
                    delete attributes[key];
                }
                else {
                    attributes[key] = value;
                }
                return attributes;
            }, {});
        },
        enumerable: true,
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
            return schema_1.default.structure[this.type];
        },
        enumerable: true,
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
            return schema_1.default.relations[this.type];
        },
        enumerable: true,
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
        enumerable: true,
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
        enumerable: true,
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
        enumerable: true,
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
        var _a = this, attributeDefinitions = _a.attributeDefinitions, attributeNames = _a.attributeNames, meta = _a.meta, id = _a.id, type = _a.type;
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
                    attr = moment_1.default(value).toISOString();
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
            id: String(id),
            relationships: null
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
        return { data: data };
    };
    Model.prototype.updateAttributes = function (attributes) {
        var _this_1 = this;
        mobx_1.transaction(function () {
            Object.keys(attributes).forEach(function (key) {
                _this_1[key] = attributes[key];
            });
        });
    };
    Model.prototype.clone = function () {
        var attributes = cloneDeep_1.default(this.snapshot.attributes);
        var relationships = this.relationships;
        return this.store.createModel(this.type, this.id, { attributes: attributes, relationships: relationships });
    };
    __decorate([
        mobx_1.observable
    ], Model.prototype, "_dirtyRelationships", void 0);
    __decorate([
        mobx_1.computed
    ], Model.prototype, "isNew", null);
    __decorate([
        mobx_1.observable
    ], Model.prototype, "errors", void 0);
    return Model;
}());
exports.default = Model;
