import _regeneratorRuntime from '@babel/runtime/regenerator';
import _asyncToGenerator from '@babel/runtime/helpers/asyncToGenerator';
import _objectSpread from '@babel/runtime/helpers/objectSpread';
import _initializerDefineProperty from '@babel/runtime/helpers/initializerDefineProperty';
import _classCallCheck from '@babel/runtime/helpers/classCallCheck';
import _createClass from '@babel/runtime/helpers/createClass';
import _applyDecoratedDescriptor from '@babel/runtime/helpers/applyDecoratedDescriptor';
import '@babel/runtime/helpers/initializerWarningHelper';
import { observable, transaction, set, extendObservable, autorun, toJS } from 'mobx';
import 'uuid/v1';
import jqueryParam from 'jquery-param';
import _toConsumableArray from '@babel/runtime/helpers/toConsumableArray';
import _possibleConstructorReturn from '@babel/runtime/helpers/possibleConstructorReturn';
import _getPrototypeOf from '@babel/runtime/helpers/getPrototypeOf';
import _assertThisInitialized from '@babel/runtime/helpers/assertThisInitialized';
import _inherits from '@babel/runtime/helpers/inherits';
import _wrapNativeSuper from '@babel/runtime/helpers/wrapNativeSuper';
import { Serializer } from 'jsonapi-serializer';

/**
 * Build request url from base url, endpoint, query params, and ids.
 *
 * @method requestUrl
 * @return {String} formatted url string
 */

function requestUrl(baseUrl, endpoint) {
  var queryParams = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var id = arguments.length > 3 ? arguments[3] : undefined;
  var queryParamString = '';

  if (Object.keys(queryParams).length > 0) {
    queryParamString = "?".concat(jqueryParam(queryParams));
  }

  var idForPath = '';

  if (id) {
    idForPath = "/".concat(id);
  } // Return full url


  return "".concat(baseUrl, "/").concat(endpoint).concat(idForPath).concat(queryParamString);
}
function dbOrNewId(properties) {
  return properties.id || "tmp-".concat(uuid.v1());
}

var _class, _descriptor, _temp;
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
  function Store(_options) {
    var _this = this;

    _classCallCheck(this, Store);

    _initializerDefineProperty(this, "data", _descriptor, this);

    this.add = function (type, data) {
      if (data.constructor.name === 'Array') {
        return _this.addModels(type, data);
      } else {
        return _this.addModel(type, data);
      }
    };

    this.addModel = function (type, attributes) {
      var id = dbOrNewId(attributes); // Create new model install

      var model = _this.createModel(type, id, {
        attributes: attributes
      }); // Add the model to the type records index


      _this.data[type].records[id] = model;
      return model;
    };

    this.addModels = function (type, data) {
      var records = [];
      transaction(function () {
        records = data.map(function (obj) {
          return _this.addModel(type, obj);
        });
      });
      return records;
    };

    this.remove = function (type, id) {
      delete _this.data[type].records[id];
    };

    this.findOne = function (type, id) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      if (_this.shouldFetchOne(type, id, options)) {
        return _this.fetchOne(type, id, options);
      } else {
        return _this.getRecord(type, id);
      }
    };

    this.findAll = function (type) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var fromServer = options.fromServer,
          queryParams = options.queryParams; // If fromServer is true always fetch the data and return

      if (fromServer === true) return _this.fetchAll(type, queryParams); // If fromServer is false never fetch the data and return

      if (fromServer === false) return _this.getMatchingRecords(type, queryParams); // Get any matching records

      var records = _this.getMatchingRecords(type, queryParams); // If any records are present
      // console.log('findAll', type, queryParams)
      // console.log('records', records.length)


      if (records.length > 0) {
        // Return data
        return records;
      } else {
        // Otherwise fetch it from the server
        return _this.fetchAll(type, queryParams);
      }
    };

    this.init(_options);
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
    key: "reset",

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
    value: function reset(type) {
      if (type) {
        this.data[type] = {
          records: {},
          cache: {}
        };
      } else {
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

  }, {
    key: "init",
    value: function init(options) {
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

  }, {
    key: "initializeNetworkConfiguration",
    value: function initializeNetworkConfiguration() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      this.baseUrl = options.baseUrl || '';
      this.defaultFetchOptions = options.defaultFetchOptions || {};
    }
    /**
     * Entry point for configuring the store
     *
     * @method initializeNetworkConfiguration
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
     */

  }, {
    key: "initializeObservableDataProperty",
    value: function initializeObservableDataProperty() {
      var _this2 = this;

      var types = this.constructor.types; // NOTE: Is there a performance cost to setting
      // each property individually?

      types.forEach(function (modelKlass) {
        _this2.data[modelKlass.type] = {
          records: {},
          cache: {}
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
      return fetch(url, _objectSpread({}, defaultFetchOptions, options));
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
      var collection = this.getType(type);

      if (!collection) {
        throw new Error("Could not find a collection for type '".concat(type, "'"));
      }

      return collection.records[id];
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

      var ids = this.getCachedIds(type, url); // Get the records matching the ids

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

  }, {
    key: "getCachedIds",
    value: function getCachedIds(type, url) {
      return this.getType(type).cache[url];
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
    value: function getRecordsById(type) {
      var _this3 = this;

      var ids = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      // NOTE: Is there a better way to do this?
      return ids.map(function (id) {
        return _this3.getRecord(type, id);
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
  }, {
    key: "createModelsFromData",
    value: function createModelsFromData(data) {
      var _this4 = this;

      var store = this;
      transaction(function () {
        data.forEach(function (dataObject) {
          var attributes = dataObject.attributes,
              id = dataObject.id,
              relationships = dataObject.relationships,
              type = dataObject.type;

          var existingRecord = _this4.getRecord(type, id);

          if (existingRecord) {
            Object.keys(attributes).forEach(function (key) {
              existingRecord[key] = attributes[key];
              _this4.data[type].records[id] = existingRecord;
            });

            if (relationships) {
              Object.keys(relationships).forEach(function (key) {
                existingRecord.relationships[key] = relationships[key];
                _this4.data[type].records[id] = existingRecord;
              });
            }
          } else {
            var ModelKlass = _this4.modelTypeIndex[type];
            var record = new ModelKlass(_objectSpread({
              id: id,
              store: store,
              relationships: relationships
            }, attributes));
            _this4.data[type].records[record.id] = record;
          }
        });
      });
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

      if (!ModelKlass) {
        throw new Error("Could not find a model for '".concat(type, "'"));
      }

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
    value: function fetchUrl(type, queryParams, id) {
      var baseUrl = this.baseUrl,
          modelTypeIndex = this.modelTypeIndex;
      var endpoint = modelTypeIndex[type].endpoint;
      return requestUrl(baseUrl, endpoint, queryParams, id);
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
      _regeneratorRuntime.mark(function _callee(type, queryParams) {
        var _this5 = this;

        var url, response, json, records;
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                url = this.fetchUrl(type, queryParams);
                _context.next = 3;
                return this.fetch(url);

              case 3:
                response = _context.sent;

                if (!(response.status === 200)) {
                  _context.next = 15;
                  break;
                }

                this.data[type].cache[url] = [];
                _context.next = 8;
                return response.json();

              case 8:
                json = _context.sent;

                if (json.included) {
                  this.createModelsFromData(json.included);
                }

                records = [];
                transaction(function () {
                  records = json.data.map(function (dataObject) {
                    var id = dataObject.id;
                    var attributes = dataObject.attributes,
                        relationships = dataObject.relationships;
                    var ModelKlass = _this5.modelTypeIndex[type];
                    var store = _this5;
                    var record = new ModelKlass(_objectSpread({
                      relationships: relationships,
                      store: store
                    }, attributes));

                    _this5.data[type].cache[url].push(id);

                    _this5.data[type].records[id] = record;
                    return record;
                  });
                });
                return _context.abrupt("return", records);

              case 15:
                return _context.abrupt("return", Promise.reject(response.status));

              case 16:
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
      _regeneratorRuntime.mark(function _callee2(type, id, options) {
        var queryParams, url, response, json, record;
        return _regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                queryParams = options.queryParams;
                url = this.fetchUrl(type, queryParams, id); // Trigger request

                _context2.next = 4;
                return this.fetch(url);

              case 4:
                response = _context2.sent;

                if (!(response.status === 200)) {
                  _context2.next = 17;
                  break;
                }

                _context2.next = 8;
                return response.json();

              case 8:
                json = _context2.sent;

                if (json.included) {
                  this.createModelsFromData(json.included);
                }

                record = this.createModel(type, null, json.data); // Is this needed?

                this.data[type].cache[url] = [];
                this.data[type].cache[url].push(record.id);
                this.data[type].records[record.id] = record;
                return _context2.abrupt("return", record);

              case 17:
                return _context2.abrupt("return", response.status);

              case 18:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function fetchOne(_x4, _x5, _x6) {
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
}(), _temp), (_descriptor = _applyDecoratedDescriptor(_class.prototype, "data", [observable], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return {};
  }
})), _class);

function ObjectPromiseProxy(promise, target) {
  target.isInFlight = true;
  var result = promise.then(
  /*#__PURE__*/
  function () {
    var _ref = _asyncToGenerator(
    /*#__PURE__*/
    _regeneratorRuntime.mark(function _callee(response) {
      var json, _json$data, attributes, relationships;

      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!(response.status === 200 || response.status === 201)) {
                _context.next = 9;
                break;
              }

              _context.next = 3;
              return response.json();

            case 3:
              json = _context.sent;
              // Update target model
              _json$data = json.data, attributes = _json$data.attributes, relationships = _json$data.relationships;
              transaction(function () {
                Object.keys(attributes).forEach(function (key) {
                  target[key] = attributes[key];
                });

                if (relationships) {
                  Object.keys(relationships).forEach(function (key) {
                    if (!relationships[key].hasOwnProperty('meta')) {
                      target.relationships[key] = relationships[key];
                    }
                  });
                }

                if (json.included) {
                  target.store.createModelsFromData(json.included);
                } // Update target isInFlight


                target.isInFlight = false;
              });
              return _context.abrupt("return", target);

            case 9:
              target.errors = {
                status: response.status
              };
              return _context.abrupt("return", target);

            case 11:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }(), function (error) {
    // TODO: Handle error states correctly
    target.isInFlight = false;
    target.errors = error;
    throw error; // return target
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
}();

var schema = new Schema();

var _class$1, _descriptor$1, _temp$1;
/**
 * Helper method for apply the correct defaults to attributes.
 * @method defaultValueForDescriptor
 */

function defaultValueForDescriptor(descriptor, DataType) {
  if (typeof descriptor.initializer === 'function') {
    var value = descriptor.initializer();

    if (DataType.name === 'Date') {
      return new DataType(value);
    } else {
      return DataType(value);
    }
  }

  if (DataType.name === 'String') return '';
  if (DataType.name === 'Array') return [];
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


function attribute() {
  var dataType = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (obj) {
    return obj;
  };
  return function (target, property, descriptor) {
    var type = target.constructor.type;
    var defaultValue = defaultValueForDescriptor(descriptor, dataType); // Update the schema

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
      set: function set$1(value) {
        set(target, property, value);
      }
    };
  };
}
/**
 * Handles getting polymorphic records or only a specific
 * type if specified.
 *
 * @method getRelatedRecords
 * @param {Object} record the record with the relationship
 * @param {String} property the related property to set
 * @param {String} modelType an override of the modelType
 */

function getRelatedRecords(record, property) {
  var modelType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var relationships = record.relationships;
  var relationType = modelType || property;
  var references = relationships && relationships[relationType];
  var relatedRecords = [];

  if (references && references.data) {
    relatedRecords = references.data.map(function (ref) {
      var recordType = ref.type;
      return record.store.getRecord(recordType, ref.id);
    });
  }

  return new RelatedRecordsArray(relatedRecords, record, relationType);
}
/**
 * Handles getting polymorphic has_one/belong_to.
 *
 * @method getRelatedRecord
 */

function getRelatedRecord(record, property) {
  var modelType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  // Get relationships
  var relationships = record.relationships; // Short circuit if no relationships are present

  if (!relationships) return; // Use property name unless model type is provided

  var relationType = modelType || property;
  var reference = relationships[relationType]; // Short circuit if matching reference is not found

  if (!reference || !reference.data) return;
  var _relationships$relati = relationships[relationType].data,
      id = _relationships$relati.id,
      type = _relationships$relati.type;
  var recordType = modelType || type;
  return record.store.getRecord(recordType, id);
}
/**
 * Handles setting polymorphic has_one/belong_to.
 * - Validates the related record to make sure it inherits from `Model` class
 * - Sets the relationship
 * - Attempts to find an inverse relationship, and if successful adds it as well
 *
 * @method setRelatedRecord
 * @param {Object} record the record with the relationship
 * @param {Object} relatedRecord the record that will be related
 * @param {String} property the related property to set
 * @param {String} modelType an override of the modelType
 */

function setRelatedRecord(record, relatedRecord, property) {
  var modelType = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

  if (relatedRecord && !(relatedRecord instanceof Model)) {
    throw new Error('Related record must be a valid Model object');
  }

  var relationships = record.relationships;
  var relationType = modelType || property;
  var referenceRecord = relatedRecord || getRelatedRecord(record, relationType);

  if (!referenceRecord) {
    return;
  }

  var id = referenceRecord.id;
  var type = referenceRecord.constructor.type;
  var data = relationships[relationType] && relationships[relationType].data;

  if (!relatedRecord) {
    delete relationships[relationType];
  } else if (!data || !(data.type === type && data.id === id)) {
    relationships[relationType] = {
      data: {
        id: id,
        type: type
      }
    };
  } else {
    return relatedRecord;
  } // hack we don't have a reference to the inverse name so we just use the record type.
  // this may cause problems with polymorphic relationships


  var inverseRelatedToMany = getRelatedRecords(referenceRecord, null, record.constructor.type);

  if (inverseRelatedToMany) {
    var inverseMethod = relatedRecord ? 'add' : 'remove';
    inverseRelatedToMany[inverseMethod](record);
  }

  return relatedRecord;
}
/*
 * Defines a one-to-many relationship. Defaults to the class with camelized singular name of the property
 * An optional argument specifies the data model, if different from the property name
 * ```
 * class CropVariety extends Model {
 *   @relatedToMany growth_cycles
 * }
 *
 * class Crop extends Model {
 *   @relatedToMany(CropVariety) varieties
 * }
 * ```
 * @method relatedToMany
 */

function relatedToMany(targetOrModelKlass, property, descriptor) {
  if (typeof targetOrModelKlass === 'function') {
    return function (target2, property2, descriptor2) {
      return {
        get: function get() {
          var type = targetOrModelKlass.type;
          return getRelatedRecords(this, property2, type);
        }
      };
    };
  } else {
    return {
      get: function get() {
        return getRelatedRecords(this, property);
      }
    };
  }
}
/**
 * Syntactic sugar of relatedToMany relationship. Basically
 * everything the same except it only returns a single record.
 *
 * @method relatedToOne
 */

function relatedToOne(targetOrModelKlass, property, descriptor) {
  if (typeof targetOrModelKlass === 'function') {
    return function (target2, property2, descriptor2) {
      return {
        get: function get() {
          var type = targetOrModelKlass.type;
          return getRelatedRecord(this, property2, type);
        },
        set: function set(record) {
          var type = targetOrModelKlass.type;
          return setRelatedRecord(this, record, property2, type);
        }
      };
    };
  } else {
    return {
      get: function get() {
        return getRelatedRecord(this, property);
      },
      set: function set(record) {
        return setRelatedRecord(this, record, property);
      }
    };
  }
}
/**
 * An array that allows for updating store references and relationships
 * @class RelatedRecordsArray
 * @constructor
 * @param {Array} array the array to extend
 * @param {Object} record the record with the referenced array
 * @param {String} property the property on the record that references the array
 */

var RelatedRecordsArray =
/*#__PURE__*/
function (_Array) {
  _inherits(RelatedRecordsArray, _Array);

  function RelatedRecordsArray(_array, _record, _property) {
    var _getPrototypeOf2;

    var _this2;

    _classCallCheck(this, RelatedRecordsArray);

    _this2 = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(RelatedRecordsArray)).call.apply(_getPrototypeOf2, [this].concat(_toConsumableArray(_array))));

    _this2.add = function (relatedRecord) {
      var _assertThisInitialize = _assertThisInitialized(_this2),
          record = _assertThisInitialize.record,
          property = _assertThisInitialize.property;

      var recordType = record.constructor.type;
      var id = relatedRecord.id,
          type = relatedRecord.constructor.type;

      if (!relatedRecord || !(relatedRecord instanceof Model)) {
        throw new Error('Related record must be a valid Model object');
      }

      if (!record.relationships) {
        record.relationships = {};
      }

      var relationships = record.relationships;

      if (!relationships[property]) {
        relationships[property] = {
          data: []
        };
      }

      var alreadyThere = relationships[property].data.find(function (model) {
        return model.id === id && model.type === type;
      });

      if (!alreadyThere) {
        relationships[property].data.push({
          id: id,
          type: type
        });

        _this2.push(relatedRecord); // setting the inverse - hack this will only work with singularized relationships.


        setRelatedRecord(relatedRecord, record, recordType.slice(0, recordType.length - 1));
      }

      return relatedRecord;
    };

    _this2.remove = function (relatedRecord) {
      var _assertThisInitialize2 = _assertThisInitialized(_this2),
          record = _assertThisInitialize2.record,
          property = _assertThisInitialize2.property;

      var relationships = record.relationships,
          recordType = record.constructor.type;
      var id = relatedRecord.id,
          type = relatedRecord.constructor.type;

      if (relationships && relationships[property] && relatedRecord) {
        var referenceIndexToRemove = relationships[property].data.findIndex(function (model) {
          return model.id === id && model.type === type;
        });
        relationships[property].data.splice(referenceIndexToRemove, 1);

        var recordIndexToRemove = _this2.findIndex(function (model) {
          return model.id === id && model.type === type;
        });

        if (recordIndexToRemove >= 0) {
          _this2.splice(recordIndexToRemove, 1);
        }

        if (!relationships[property].data.length) {
          delete relationships[property];
        }

        if (!Object.keys(record.relationships).length) {
          delete record.relationships;
        } // hack this will only work with singularized relationships.


        setRelatedRecord(relatedRecord, null, recordType.slice(0, recordType.length - 1));
      }

      return relatedRecord;
    };

    _this2.replace = function (array) {
      var _assertThisInitialize3 = _assertThisInitialized(_this2),
          record = _assertThisInitialize3.record,
          property = _assertThisInitialize3.property;

      var relationships = record.relationships;
      transaction(function () {
        relationships[property] = {
          data: []
        };
        array.forEach(function (object) {
          return _this2.add(object);
        });
      });
    };

    _this2.property = _property;
    _this2.record = _record;
    return _this2;
  }
  /**
   * Adds a record to the array, and updates references in the store, as well as inverse references
   * @method add
   * @param {Object} relatedRecord the record to add to the array
   * @return {Object} the original relatedRecord
   */


  return RelatedRecordsArray;
}(_wrapNativeSuper(Array));
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


var Model = (_class$1 = (_temp$1 =
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

    _initializerDefineProperty(this, "isDirty", _descriptor$1, this);

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
      var _this3 = this;

      this.attributeNames.forEach(function (key) {
        _this3[key] = _this3.previousSnapshot[key];
      });
      this.setCurrentSnapShot();
    }
    /**
     * creates or updates a record.
     * @method save
     * @return {Promise}
     * @param {Object} options
     */

  }, {
    key: "save",
    value: function save() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var queryParams = options.queryParams;
      var constructor = this.constructor,
          id = this.id;
      var requestId = id;
      var method = 'PATCH';

      if (String(id).match(/tmp/)) {
        method = 'POST';
        requestId = null;
      }

      var url = this.store.fetchUrl(constructor.type, queryParams, requestId);
      var body = JSON.stringify(this.jsonapi);
      var response = this.store.fetch(url, {
        method: method,
        body: body
      });
      return new ObjectPromiseProxy(response, this);
    }
    /**
     * deletes a record from the store and server
     * @method destroy
     * @return {Promise} an empty promise with any success/error status
     */

  }, {
    key: "destroy",
    value: function destroy() {
      var type = this.constructor.type,
          id = this.id,
          snapshot = this.snapshot;

      if (String(id).match(/tmp/)) {
        this.store.remove(type, id);
        return snapshot;
      }

      var url = this.store.fetchUrl(type, {}, id);
      this.isInFlight = true;
      var promise = this.store.fetch(url, {
        method: 'DELETE'
      });

      var _this = this;

      return promise.then(
      /*#__PURE__*/
      function () {
        var _ref = _asyncToGenerator(
        /*#__PURE__*/
        _regeneratorRuntime.mark(function _callee(response) {
          return _regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _this.isInFlight = false;

                  if (!(response.status === 202 || response.status === 204)) {
                    _context.next = 6;
                    break;
                  }

                  _this.store.remove(type, id);

                  return _context.abrupt("return", _this);

                case 6:
                  _this.errors = {
                    status: response.status
                  };
                  return _context.abrupt("return", _this);

                case 8:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }));

        return function (_x) {
          return _ref.apply(this, arguments);
        };
      }(), function (error) {
        // TODO: Handle error states correctly
        _this.isInFlight = false;
        _this.errors = error;
        throw error;
      });
    }
    /* Private Methods */

    /**
     * Magic method that makes changes to records
     * observable
     *
     * @method makeObservable
     */

  }, {
    key: "makeObservable",
    value: function makeObservable(initialAttributes) {
      var defaultAttributes = this.defaultAttributes;
      extendObservable(this, _objectSpread({}, defaultAttributes, initialAttributes));
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
      var _this4 = this;

      var firstAutorun = true;
      autorun(function () {
        // `JSON.stringify` will touch all attributes
        // ensuring they are automatically observed.
        JSON.stringify(_this4.attributes);

        if (!firstAutorun) {
          _this4.setPreviousSnapshot();

          _this4.setCurrentSnapShot();

          _this4.isDirty = true;
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
    key: "updateAttributes",

    /**
     * getter method to get data in api compliance format
     * TODO: Figure out how to handle unpersisted ids
     *
     * @method updateAttributes
     */
    value: function updateAttributes(attributes) {
      var _this5 = this;

      transaction(function () {
        Object.keys(attributes).forEach(function (key) {
          _this5[key] = attributes[key];
        });
      });
    }
  }, {
    key: "attributes",
    get: function get() {
      var _this6 = this;

      return this.attributeNames.reduce(function (attributes, key) {
        var value = toJS(_this6[key]);

        if (!value) {
          delete attributes[key];
        } else {
          attributes[key] = value;
        }

        return attributes;
      }, {});
    }
    /**
     * Getter find the attribute definition for the model type.
     *
     * @method attributeDefinitions
     * @return {Object}
     */

  }, {
    key: "attributeDefinitions",
    get: function get() {
      var type = this.constructor.type;
      return schema.structure[type];
    }
    /**
     * Getter to check if the record has errors.
     *
     * @method hasErrors
     * @return {Boolean}
     */

  }, {
    key: "hasErrors",
    get: function get() {
      return Object.keys(this.errors).length > 0;
    }
    /**
     * Getter to just get the names of a records attributes.
     *
     * @method attributeNames
     * @return {Array}
     */

  }, {
    key: "attributeNames",
    get: function get() {
      return Object.keys(this.attributeDefinitions);
    }
    /**
     * getter method to get the default attributes
     *
     * @method defaultAttributes
     * @return {Object}
     */

  }, {
    key: "defaultAttributes",
    get: function get() {
      var attributeDefinitions = this.attributeDefinitions;
      return this.attributeNames.reduce(function (defaults, key) {
        var defaultValue = attributeDefinitions[key].defaultValue;
        defaults[key] = defaultValue;
        return defaults;
      }, {});
    }
    /**
     * getter method to get data in api compliance format
     * TODO: Figure out how to handle unpersisted ids
     *
     * @method jsonapi
     * @return {Object} data in JSON::API format
     */

  }, {
    key: "jsonapi",
    get: function get() {
      var attributeNames = this.attributeNames,
          id = this.id,
          _this$constructor = this.constructor,
          type = _this$constructor.type,
          requestAttributeNames = _this$constructor.requestAttributeNames;
      var filterNames = attributeNames;

      if (requestAttributeNames) {
        filterNames = attributeNames.filter(function (name) {
          return requestAttributeNames.includes(name);
        });
      }

      var ModelSerializer = new Serializer(type, {
        attributes: filterNames,
        keyForAttribute: 'underscore_case'
      });
      var data = this.attributes;

      if (!String(id).match(/tmp/)) {
        data.id = id;
      }

      return ModelSerializer.serialize(data);
    }
  }]);

  return Model;
}(), _temp$1), (_descriptor$1 = _applyDecoratedDescriptor(_class$1.prototype, "isDirty", [observable], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return false;
  }
})), _class$1);

export { Model, Store, attribute, relatedToMany, relatedToOne };
