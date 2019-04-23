'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _asyncToGenerator = _interopDefault(require('@babel/runtime/helpers/esm/asyncToGenerator'));
var _objectSpread = _interopDefault(require('@babel/runtime/helpers/esm/objectSpread'));
var _initializerDefineProperty = _interopDefault(require('@babel/runtime/helpers/esm/initializerDefineProperty'));
var _classCallCheck = _interopDefault(require('@babel/runtime/helpers/esm/classCallCheck'));
var _createClass = _interopDefault(require('@babel/runtime/helpers/esm/createClass'));
var _applyDecoratedDescriptor = _interopDefault(require('@babel/runtime/helpers/esm/applyDecoratedDescriptor'));
require('@babel/runtime/helpers/esm/initializerWarningHelper');
var mobx = require('mobx');
var moment = _interopDefault(require('moment'));

var _class, _descriptor, _temp;
// TODO: Figure out patch
// import uuidv1 from 'uuid/v1'

function uuidv1() {
  var number = Math.floor(100000 + Math.random() * 900000);
  return String(number);
}

function stringifyFilterParams(filters) {
  return Object.keys(filters).map(function (key) {
    var encodedValue = encodeURIComponent(filters[key]);
    return "filter[".concat(key, "]=").concat(encodedValue);
  }).join('&');
}
function stringifyIncludeParams(include) {
  return "include=".concat(include.join(','));
}
function requestUrl(baseUrl, endpoint) {
  var queryParams = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var queryParamString = '';

  if (Object.keys(queryParams).length > 0) {
    queryParamString += '?';

    if (queryParams.hasOwnProperty('filter')) {
      var filter = queryParams.filter;
      queryParamString += stringifyFilterParams(filter);
    }

    if (queryParams.hasOwnProperty('include')) {
      var include = queryParams.include;

      if (queryParamString !== '?') {
        queryParamString += '&';
      }

      queryParamString += stringifyIncludeParams(include);
    }
  } // Return full url


  return "".concat(baseUrl, "/").concat(endpoint).concat(queryParamString);
}

function dbOrNewId(properties) {
  var timestamp = moment().format('YYYY-MM-DD');
  return properties.id || "tmp-".concat(timestamp, "-").concat(uuidv1());
}
/**
 * Defines the Artemis Data Store class.
 *
 * @class Store
 * @constructor
 */


var Store = (_class = (_temp =
/*#__PURE__*/
function () {
  /**
   * Observable property used to store data and
   * handle changes to state
   *
   * @property data
   * @type {Object}
   * @default {}
   */

  /**
   * Initializer for Store class
   *
   * @method constructor
   */
  function Store(options) {
    _classCallCheck(this, Store);

    _initializerDefineProperty(this, "data", _descriptor, this);

    this.init(options);
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


  _createClass(Store, [{
    key: "add",
    value: function add(type, attributes) {
      // Use id from DB/API or create a temporary id
      var id = dbOrNewId(attributes); // Create new model install

      var model = this.createModel(type, id, {
        attributes: attributes
      }); // Return the model

      this.data[type].isEmpty = false; // Add the model to the type records index

      this.data[type].records[id] = model;
      return model;
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

  }, {
    key: "findOne",
    value: function findOne(type, id) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      if (this.shouldFetchOne(type, id, options)) {
        return this.fetchOne(type, id);
      } else {
        return this.getRecord(type, id);
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

  }, {
    key: "findAll",
    value: function findAll(type) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var fromServer = options.fromServer,
          queryParams = options.queryParams;

      var _this$getType = this.getType(type),
          isEmpty = _this$getType.isEmpty;

      if (fromServer === false && isEmpty) return [];
      if (fromServer === false && !queryParams) return this.getRecords(type);
      if (fromServer === true) return this.fetchAll(type, queryParams);
      if (isEmpty) return this.fetchAll(type, queryParams);
      return this.getMatchingRecords(type, queryParams);
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

  }, {
    key: "reset",
    value: function reset() {
      this.initializeObservableDataProperty();
    }
    /* Private Methods */

    /**
     * Entry point for configuring the store
     *
     * @method init
     * @param {Object} options passed to constructor
     */

  }, {
    key: "init",
    value: function init(options) {
      this.initializeNextworkConfiguration(options);
      this.initializeModelTypeIndex();
      this.initializeObservableDataProperty();
    }
    /**
     * Entry point for configuring the store
     *
     * @method initializeNextworkConfiguration
     * @param {Object} options for nextwork config
     */

  }, {
    key: "initializeNextworkConfiguration",
    value: function initializeNextworkConfiguration() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      this.baseUrl = options.baseUrl || '';
      this.defaultFetchOptions = options.defaultFetchOptions || {};
    }
    /**
     * Entry point for configuring the store
     *
     * @method initializeNextworkConfiguration
     * @param {Object} options for nextwork config
     */

  }, {
    key: "initializeModelTypeIndex",
    value: function initializeModelTypeIndex() {
      var types = this.constructor.types;
      this.modelTypeIndex = types.reduce(function (modelTypeIndex, modelKlass) {
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
     * @param {Object} options for nextwork config
     */

  }, {
    key: "initializeObservableDataProperty",
    value: function initializeObservableDataProperty() {
      var _this = this;

      var types = this.constructor.types; // NOTE: Is there a performance cost to setting
      // each property individually?

      types.forEach(function (modelKlass) {
        _this.data[modelKlass.type] = {
          records: {},
          cache: {},
          isEmpty: true
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

  }, {
    key: "fetch",
    value: function (_fetch) {
      function fetch(_x) {
        return _fetch.apply(this, arguments);
      }

      fetch.toString = function () {
        return _fetch.toString();
      };

      return fetch;
    }(function (url) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var defaultFetchOptions = this.defaultFetchOptions;
      return fetch(url, _objectSpread({
        defaultFetchOptions: defaultFetchOptions
      }, options));
    })
    /**
     * Gets type of collection from data observable
     *
     * @method getType
     * @param {String} type
     * @return {Object} observable type object structure
     */

  }, {
    key: "getType",
    value: function getType(type) {
      return this.data[type];
    }
    /**
     * Gets individual record from store
     *
     * @method getRecord
     * @param {String} type
     * @param {Number} id
     * @return {Object} record
     */

  }, {
    key: "getRecord",
    value: function getRecord(type, id) {
      return this.getType(type).records[id];
    }
    /**
     * Gets records for type of collection from observable
     *
     * @method getRecords
     * @param {String} type
     * @return {Array} array of objects
     */

  }, {
    key: "getRecords",
    value: function getRecords(type) {
      return Object.values(this.getType(type).records);
    }
    /**
     * Gets records from store based on cached query
     *
     * @method getCachedRecords
     * @param {String} type
     * @param {Object} queryParams
     * @return {Array} array or records
     */

  }, {
    key: "getCachedRecords",
    value: function getCachedRecords(type, queryParams) {
      // Get the url the request would use
      var url = this.fetchUrl(type, queryParams); // Get the matching ids from the response

      var ids = this.getType(type).cache[url]; // Get the records matching the ids

      return this.getRecordsById(type, ids);
    }
    /**
     * Get multiple records by id
     *
     * @method getRecordsById
     * @param {String} type
     * @param {Array} ids
     * @return {Array} array or records
     */

  }, {
    key: "getRecordsById",
    value: function getRecordsById(type, ids) {
      var _this2 = this;

      // NOTE: Is there a better way to do this?
      return ids.map(function (id) {
        return _this2.getRecord(type, id);
      }).filter(function (record) {
        return typeof record !== 'undefined';
      });
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

  }, {
    key: "getMatchingRecords",
    value: function getMatchingRecords(type, queryParams) {
      if (queryParams) {
        return this.getCachedRecords(type, queryParams);
      } else {
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

  }, {
    key: "getKlass",
    value: function getKlass(type) {
      return this.modelTypeIndex[type];
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

  }, {
    key: "createModel",
    value: function createModel(type, id, data) {
      var attributes = data.attributes;
      var relationships = {};

      if (data.hasOwnProperty('relationships')) {
        relationships = data.relationships;
      }

      var store = this;
      var ModelKlass = this.getKlass(type);
      return new ModelKlass(_objectSpread({
        id: id,
        store: store,
        relationships: relationships
      }, attributes));
    }
    /**
     * Builds fetch url based
     *
     * @method fetchUrl
     * @param {String} type the type to find
     * @param {Object} options
     */

  }, {
    key: "fetchUrl",
    value: function fetchUrl(type, queryParams) {
      var baseUrl = this.baseUrl,
          modelTypeIndex = this.modelTypeIndex;
      var endpoint = modelTypeIndex[type].endpoint;
      return requestUrl(baseUrl, endpoint, queryParams);
    }
    /**
     * finds an instance by `id`. If available in the store, returns that instance. Otherwise, triggers a fetch.
     *
     * @method findAll
     * @param {String} type the type to find
     * @param {Object} options
     */

  }, {
    key: "fetchAll",
    value: function () {
      var _fetchAll = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(type, queryParams) {
        var _this3 = this;

        var url, response, json, records;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                url = this.fetchUrl(type, queryParams);
                _context.next = 3;
                return this.fetch(url);

              case 3:
                response = _context.sent;

                if (!(response.status === 200)) {
                  _context.next = 14;
                  break;
                }

                this.data[type].cache[url] = [];
                _context.next = 8;
                return response.json();

              case 8:
                json = _context.sent;
                // TODO: Refactor, abstract, and handle relations
                records = json.data.map(function (dataObject) {
                  var id = dataObject.id;
                  var attributes = dataObject.attributes;
                  var ModelKlass = _this3.modelTypeIndex[type];
                  var record = new ModelKlass(attributes);

                  _this3.data[type].cache[url].push(id);

                  _this3.data[type].records[id] = record;
                  return record;
                });
                this.data[type].isEmpty = false;
                return _context.abrupt("return", records);

              case 14:
                return _context.abrupt("return", response.status);

              case 15:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function fetchAll(_x2, _x3) {
        return _fetchAll.apply(this, arguments);
      }

      return fetchAll;
    }()
    /**
     * fetches record by `id`.
     *
     * @async
     * @method fetchOne
     * @param {String} type the type to find
     * @param {String} id
     */

  }, {
    key: "fetchOne",
    value: function () {
      var _fetchOne = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2(type, id) {
        var url, response, json;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                url = this.fetchUrl(type); // Trigger request

                _context2.next = 3;
                return this.fetch("".concat(url, "/").concat(id));

              case 3:
                response = _context2.sent;

                if (!(response.status === 200)) {
                  _context2.next = 11;
                  break;
                }

                _context2.next = 7;
                return response.json();

              case 7:
                json = _context2.sent;
                return _context2.abrupt("return", this.createModel(type, null, json.data));

              case 11:
                return _context2.abrupt("return", response.status);

              case 12:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function fetchOne(_x4, _x5) {
        return _fetchOne.apply(this, arguments);
      }

      return fetchOne;
    }()
    /**
     * Determines if an individual record should be
     * fetched or looked up in the store
     *
     * @method shouldFetchOne
     * @param {String} type the type to find
     * @param {String} id
     * @param {Object} options
     */

  }, {
    key: "shouldFetchOne",
    value: function shouldFetchOne(type, id, _ref) {
      var fromServer = _ref.fromServer;
      // If fromServer is true immediately return true
      if (fromServer === true) return true; // Check if matching record is in store
      // If fromServer is undefined and record is not found
      // return true

      return typeof fromServer === 'undefined' && !this.getRecord(type, id);
    }
  }]);

  return Store;
}(), _temp), (_descriptor = _applyDecoratedDescriptor(_class.prototype, "data", [mobx.observable], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return {};
  }
})), _class);

function ObjectPromiseProxy(promise, target) {
  target.isInFlight = true;
  var result = promise.then(function (v) {
    var json = JSON.parse(v.body); // Update target model

    var attributes = json.data.attributes;
    Object.keys(attributes).forEach(function (key) {
      target[key] = attributes[key];
    }); // Update target isInFlight

    target.isInFlight = false;
    return target;
  }, function (e) {
    // TODO: Handle error states correctly
    target.isInFlight = false;
    target.errors = e;
    throw e;
  }); // Define proxied attributes

  var attributeNames = Object.keys(target.attributeNames);
  var tempProperties = attributeNames.reduce(function (attrs, key) {
    attrs[key] = {
      value: target[key],
      writable: false
    };
    return attrs;
  }, {});
  Object.defineProperties(result, _objectSpread({
    isInFlight: {
      value: target.isInFlight
    }
  }, tempProperties)); // Return promise

  return result;
}

/**
 * Utility class used to store the schema
 * of model attribute definitions
 *
 * @class Schema
 */

var Schema =
/*#__PURE__*/
function () {
  function Schema() {
    _classCallCheck(this, Schema);

    this.structure = {};
  }

  _createClass(Schema, [{
    key: "addAttribute",
    value: function addAttribute(_ref) {
      var type = _ref.type,
          property = _ref.property,
          dataType = _ref.dataType,
          defaultValue = _ref.defaultValue;
      this.structure[type] = this.structure[type] || {};
      this.structure[type][property] = {
        defaultValue: defaultValue,
        dataType: dataType
      };
    }
  }]);

  return Schema;
}(); // TODO: Abstract into separate file


var schema = new Schema();
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

function attribute() {
  var dataType = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (obj) {
    return obj;
  };
  return function (target, property, descriptor) {
    var type = target.constructor.type;
    var defaultValue = descriptor.initializer(); // Update the schema

    schema.addAttribute({
      dataType: dataType,
      defaultValue: defaultValue,
      property: property,
      type: type
    }); // Return custom descriptor

    return {
      get: function get() {
        return defaultValue;
      },
      set: function set(value) {
        mobx.set(target, property, value);
      }
    };
  };
}
/*
 * Defines a one-to-many relationship. Defaults to the class with camelized singular name of the property
 * An optional argument specifies the data model, if different from the property name
 * ```
 * class CropVariety extends Model {
 *   @hasMany growth_cycles
 * }
 *
 * class Crop extends Model {
 *   @hasMany(CropVariety) varieties
 * }
 * ```
 * @method hasMany
 */

function hasMany() {
  var modelKlass = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (obj) {
    return obj;
  };
  return function (target, property, descriptor) {
    return {
      get: function get() {
        var type = modelKlass.type;
        var references = Object.values(this.relationships[type].data);
        var ids = references.map(function (ref) {
          return ref.id;
        });
        return this.store.getRecordsById(type, ids);
      }
    };
  };
}
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

var Model =
/*#__PURE__*/
function () {
  /**
   * Initializer for model
   *
   * @method constructor
   */
  function Model() {
    var initialAttributes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Model);

    this.isDirty = false;
    this.isInFlight = false;
    this.errors = {};
    this.snapshot = {};
    this.previousSnapshot = {};
    this.makeObservable(initialAttributes);
    this.setCurrentSnapShot();
    this.trackState();
  }
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
   * @property endpoint
   * @static
   */

  /**
   * True if the instance has been modified from its persisted state
   * ```
   * kpi = store.find('kpis', 5)
   * kpi.name
   * => "A good thing to measure"
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


  _createClass(Model, [{
    key: "rollback",

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
    value: function rollback() {
      var _this = this;

      this.attributeNames.forEach(function (key) {
        _this[key] = _this.previousSnapshot[key];
      });
      this.setCurrentSnapShot();
    }
    /**
     * creates or updates a record.
     * @method save
     * @return {Promise}
     */

  }, {
    key: "save",
    value: function save() {
      var constructor = this.constructor,
          store = this.store,
          id = this.id;
      var url = store.fetchUrl(constructor.type);
      var method = 'POST';

      if (!String(id).match(/tmp/)) {
        method = 'PUT';
        url += "/".concat(id);
      }

      var body = JSON.stringify(this.jsonapi);
      var response = this.store.fetch(url, {
        method: method,
        body: body
      });
      return ObjectPromiseProxy(response, this);
    }
    /**
     * deletes a record from the store and server
     * @method destroy
     * @return {Promise} an empty promise with any success/error status
     */

  }, {
    key: "destroy",
    value: function destroy() {
      throw new Error('Pending Implementation');
    }
    /* Private Methods */

    /**
     * Magic method that makes changes to records
     * observable
     *
     * @method setCurrentSnapShot
     */

  }, {
    key: "makeObservable",
    value: function makeObservable(initialAttributes) {
      var defaultAttributes = this.defaultAttributes;
      mobx.extendObservable(this, _objectSpread({}, defaultAttributes, initialAttributes));
    }
    /**
     * Sets current snapshot to current attributes
     *
     * @method setCurrentSnapShot
     */

  }, {
    key: "setCurrentSnapShot",
    value: function setCurrentSnapShot() {
      this.snapshot = this.attributes;
    }
    /**
     * Sets previous snapshot to current snapshot
     *
     * @method setPreviousSnapshot
     */

  }, {
    key: "setPreviousSnapshot",
    value: function setPreviousSnapshot() {
      this.previousSnapshot = this.snapshot;
    }
    /**
     * Uses mobx.autorun to track changes to attributes
     *
     * @method trackState
     */

  }, {
    key: "trackState",
    value: function trackState() {
      var _this2 = this;

      var firstAutorun = true;
      mobx.autorun(function () {
        // `JSON.stringify` will touch all attributes
        // ensuring they are automatically observed.
        JSON.stringify(_this2.attributes);

        if (!firstAutorun) {
          _this2.setPreviousSnapshot();

          _this2.setCurrentSnapShot();

          _this2.isDirty = true;
        }

        firstAutorun = false;
      });
    }
    /**
     * current attributes of record
     *
     * @method attributes
     * @return {Object} current attributes
     */

  }, {
    key: "attributes",
    get: function get() {
      var _this3 = this;

      return this.attributeNames.reduce(function (attributes, key) {
        attributes[key] = _this3[key];
        return attributes;
      }, {});
    }
  }, {
    key: "attributeDefinitions",
    get: function get() {
      var type = this.constructor.type;
      return schema.structure[type];
    }
    /**
     * current attributes of record
     *
     * @method attributes
     * @return {Object} current attributes
     */

  }, {
    key: "attributeNames",
    get: function get() {
      return Object.keys(this.attributeDefinitions);
    }
  }, {
    key: "defaultAttributes",
    get: function get() {
      var attributeDefinitions = this.attributeDefinitions;
      return this.attributeNames.reduce(function (defaults, key) {
        defaults[key] = attributeDefinitions[key].defaultValue;
        return defaults;
      }, {});
    }
    /**
     * getter method to get data in api compliance format
     * TODO: Figure out how to handle unpesisted ids
     *
     * @method jsonapi
     * @return {Object} data in JSON::API format
     */

  }, {
    key: "jsonapi",
    get: function get() {
      var _this4 = this;

      var attributeDefinitions = this.attributeDefinitions,
          constructor = this.constructor,
          id = this.id;
      var type = constructor.type;
      var attributes = this.attributeNames.reduce(function (attrs, key) {
        attrs[key] = attributeDefinitions[key].dataType(_this4[key]);
        return attrs;
      }, {});
      var dataObject = {
        data: {
          type: type,
          attributes: attributes
        }
      };

      if (!String(id).match(/tmp/)) {
        dataObject.data.id = String(id);
        dataObject.data.attributes.id = id;
      }

      return dataObject;
    }
  }]);

  return Model;
}();

exports.Model = Model;
exports.Store = Store;
exports.attribute = attribute;
exports.hasMany = hasMany;
