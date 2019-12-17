'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _defineProperty = _interopDefault(require('@babel/runtime/helpers/defineProperty'));
var _regeneratorRuntime = _interopDefault(require('@babel/runtime/regenerator'));
var _initializerDefineProperty = _interopDefault(require('@babel/runtime/helpers/initializerDefineProperty'));
var _createClass = _interopDefault(require('@babel/runtime/helpers/createClass'));
require('@babel/runtime/helpers/initializerWarningHelper');
var _applyDecoratedDescriptor = _interopDefault(require('@babel/runtime/helpers/applyDecoratedDescriptor'));
var _toConsumableArray = _interopDefault(require('@babel/runtime/helpers/toConsumableArray'));
var _classCallCheck = _interopDefault(require('@babel/runtime/helpers/classCallCheck'));
var _possibleConstructorReturn = _interopDefault(require('@babel/runtime/helpers/possibleConstructorReturn'));
var _getPrototypeOf = _interopDefault(require('@babel/runtime/helpers/getPrototypeOf'));
var _assertThisInitialized = _interopDefault(require('@babel/runtime/helpers/assertThisInitialized'));
var _inherits = _interopDefault(require('@babel/runtime/helpers/inherits'));
var _wrapNativeSuper = _interopDefault(require('@babel/runtime/helpers/wrapNativeSuper'));
var _typeof = _interopDefault(require('@babel/runtime/helpers/typeof'));
var mobx = require('mobx');
var moment = _interopDefault(require('moment'));
var uuidv1 = _interopDefault(require('uuid/v1'));
var jqueryParam = _interopDefault(require('jquery-param'));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function ObjectPromiseProxy(requestFunc, target) {
  var promise = requestFunc();
  target.isInFlight = true;
  var tmpId = target.id;
  var result = promise.then(function _callee(response) {
    var status, json, _json$data, attributes, relationships, message, _json, errorString;

    return _regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            status = response.status;

            if (!(status === 200 || status === 201)) {
              _context.next = 14;
              break;
            }

            _context.next = 4;
            return _regeneratorRuntime.awrap(response.json());

          case 4:
            json = _context.sent;
            // Update target model
            _json$data = json.data, attributes = _json$data.attributes, relationships = _json$data.relationships;
            mobx.transaction(function () {
              Object.keys(attributes).forEach(function (key) {
                mobx.set(target, key, attributes[key]);
              });

              if (relationships) {
                Object.keys(relationships).forEach(function (key) {
                  if (!relationships[key].hasOwnProperty('meta')) {
                    // todo: throw error if relationship is not defined in model
                    mobx.set(target.relationships, key, relationships[key]);
                  }
                });
              }

              if (json.included) {
                target.store.createModelsFromData(json.included);
              }
            }); // Update target isInFlight and isDirty

            target.isInFlight = false;
            target.isDirty = false;
            target.setPreviousSnapshot();
            mobx.transaction(function () {
              // NOTE: This resolves an issue where a record is persisted but the
              // index key is still a temp uuid. We can't simply remove the temp
              // key because there may be associated records that have the temp
              // uuid id as its only reference to the newly persisted record.
              // TODO: Figure out a way to update associated records to use the
              // newly persisted id.
              target.store.data[target.type].records[tmpId] = target;
              target.store.data[target.type].records[target.id] = target;
            });
            return _context.abrupt("return", target);

          case 14:
            if (!(response.status === 503 || response.status === 429)) {
              _context.next = 18;
              break;
            }

            return _context.abrupt("return", target);

          case 18:
            target.isInFlight = false;
            message = target.store.genericErrorMessage;
            _context.prev = 20;
            _context.next = 23;
            return _regeneratorRuntime.awrap(response.json());

          case 23:
            _json = _context.sent;
            message = parseApiErrors(_json.errors, message);
            _context.next = 29;
            break;

          case 27:
            _context.prev = 27;
            _context.t0 = _context["catch"](20);

          case 29:
            // TODO: add all errors from the API response to the target
            target.errors = _objectSpread({}, target.errors, {
              status: status,
              base: [{
                message: message
              }]
            });
            errorString = JSON.stringify(target.errors);
            return _context.abrupt("return", Promise.reject(new Error(errorString)));

          case 32:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[20, 27]]);
  }, function (error) {
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

function parseApiErrors(errors, defaultMessage) {
  return errors[0].detail.length === 0 ? defaultMessage : errors[0].detail[0];
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
    this.relations = {};
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
  }, {
    key: "addRelationship",
    value: function addRelationship(_ref2) {
      var type = _ref2.type,
          property = _ref2.property,
          dataType = _ref2.dataType;
      this.relations[type] = this.relations[type] || {};
      this.relations[type][property] = {
        dataType: dataType
      };
    }
  }, {
    key: "addValidation",
    value: function addValidation(_ref3) {
      var type = _ref3.type,
          property = _ref3.property,
          validator = _ref3.validator;
      this.structure[type][property].validator = validator;
    }
  }]);

  return Schema;
}();

var schema = new Schema();

var _class, _descriptor, _descriptor2, _temp;

function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$1(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$1(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function stringifyIds(object) {
  Object.keys(object).forEach(function (key) {
    var property = object[key];

    if (_typeof(property) === 'object') {
      if (property.id) {
        property.id = String(property.id);
      }

      stringifyIds(property);
    }
  });
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
        relationships[property] = {};
      }

      if (!relationships[property].data) {
        relationships[property].data = [];
      }

      var existingRelationships = relationships[property];
      var alreadyThere = existingRelationships && existingRelationships.data.find(function (model) {
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

      record.isDirty = true;
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

        if (recordIndexToRemove > 0) _this2.splice(recordIndexToRemove, 1);

        if (!relationships[property].data.length) {
          delete relationships[property];
        }

        if (!Object.keys(record.relationships).length) {
          delete record.relationships;
        } // hack this will only work with singularized relationships.


        setRelatedRecord(relatedRecord, null, recordType.slice(0, recordType.length - 1));
      }

      record.isDirty = true;
      return relatedRecord;
    };

    _this2.replace = function (array) {
      var _assertThisInitialize3 = _assertThisInitialized(_this2),
          record = _assertThisInitialize3.record,
          property = _assertThisInitialize3.property;

      var relationships = record.relationships;
      mobx.transaction(function () {
        relationships[property] = {
          data: []
        };
        array.forEach(function (object) {
          return _this2.add(object);
        });
      });
      record.isDirty = true;
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


var Model = (_class = (_temp =
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

    _initializerDefineProperty(this, "_isDirty", _descriptor, this);

    this.isInFlight = false;

    _initializerDefineProperty(this, "errors", _descriptor2, this);

    this.isPendingSync = false;
    this.previousSnapshot = {};

    this._makeObservable(initialAttributes);

    this.setPreviousSnapshot();

    this._trackState();
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

      mobx.transaction(function () {
        var previousSnapshot = _this3.previousSnapshot;

        _this3.attributeNames.forEach(function (key) {
          _this3[key] = previousSnapshot.attributes[key];
        });

        _this3.relationships = previousSnapshot.relationships;
        _this3.errors = {};
      });
      this.setPreviousSnapshot();
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
      var _this4 = this;

      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (!options.skip_validations && !this.validate()) {
        var errorString = JSON.stringify(this.errors);
        return Promise.reject(new Error(errorString));
      }

      var queryParams = options.queryParams,
          relationships = options.relationships,
          attributes = options.attributes;
      var constructor = this.constructor,
          id = this.id,
          isNew = this.isNew;
      var requestId = id;
      var method = 'PATCH';

      if (isNew) {
        method = 'POST';
        requestId = null;
      }

      var url = this.store.fetchUrl(constructor.type, queryParams, requestId);
      var body = JSON.stringify(this.jsonapi({
        relationships: relationships,
        attributes: attributes
      }));

      var requestFunc = function requestFunc() {
        return _this4.store.fetch(url, {
          method: method,
          body: body
        });
      };

      return new ObjectPromiseProxy(requestFunc, this);
    }
    /**
     * Checks all validations, adding errors where necessary and returning `false` if any are not valid
     * @method validate
     * @return {Boolean}
     */

  }, {
    key: "validate",
    value: function validate() {
      var _this5 = this;

      this.errors = {};
      var attributeNames = this.attributeNames,
          attributeDefinitions = this.attributeDefinitions;
      var validationChecks = attributeNames.map(function (property) {
        var validator = attributeDefinitions[property].validator;
        if (!validator) return true;
        var validationResult = validator(_this5[property], _this5);

        if (!validationResult.isValid) {
          _this5.errors[property] = validationResult.errors;
        }

        return validationResult.isValid;
      });
      return validationChecks.every(function (value) {
        return value;
      });
    }
    /**
     * deletes a record from the store and server
     * @method destroy
     * @return {Promise} an empty promise with any success/error status
     */

  }, {
    key: "destroy",
    value: function destroy() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var type = this.constructor.type,
          id = this.id,
          snapshot = this.snapshot,
          isNew = this.isNew;

      if (isNew) {
        this.store.remove(type, id);
        return snapshot;
      }

      var _options$params = options.params,
          params = _options$params === void 0 ? {} : _options$params,
          _options$skipRemove = options.skipRemove,
          skipRemove = _options$skipRemove === void 0 ? false : _options$skipRemove;
      var url = this.store.fetchUrl(type, params, id);
      this.isInFlight = true;
      var promise = this.store.fetch(url, {
        method: 'DELETE'
      });

      var _this = this;

      return promise.then(function _callee(response) {
        var json;
        return _regeneratorRuntime.async(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _this.isInFlight = false;

                if (!(response.status === 202 || response.status === 204)) {
                  _context.next = 17;
                  break;
                }

                if (!skipRemove) {
                  _this.store.remove(type, id);
                }

                _context.prev = 3;
                _context.next = 6;
                return _regeneratorRuntime.awrap(response.json());

              case 6:
                json = _context.sent;

                if (json.data && json.data.attributes) {
                  Object.keys(json.data.attributes).forEach(function (key) {
                    mobx.set(_this, key, json.data.attributes[key]);
                  });
                }

                _context.next = 13;
                break;

              case 10:
                _context.prev = 10;
                _context.t0 = _context["catch"](3);
                console.log(_context.t0); // It is text, do you text handling here

              case 13:
                // NOTE: If deleting a record changes other related model
                // You can return then in the delete response
                if (json && json.included) {
                  _this.store.createModelsFromData(json.included);
                }

                return _context.abrupt("return", _this);

              case 17:
                _this.errors = {
                  status: response.status
                };
                return _context.abrupt("return", _this);

              case 19:
              case "end":
                return _context.stop();
            }
          }
        }, null, null, [[3, 10]]);
      }, function (error) {
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
     * @method _makeObservable
     */

  }, {
    key: "_makeObservable",
    value: function _makeObservable(initialAttributes) {
      var defaultAttributes = this.defaultAttributes;
      mobx.extendObservable(this, _objectSpread$1({}, defaultAttributes, {}, initialAttributes));
    }
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

  }, {
    key: "setPreviousSnapshot",

    /**
     * Sets previous snapshot to current snapshot
     *
     * @method setPreviousSnapshot
     */
    value: function setPreviousSnapshot() {
      this.previousSnapshot = this.snapshot;
    }
    /**
     * Uses mobx.autorun to track changes to attributes
     *
     * @method _trackState
     */

  }, {
    key: "_trackState",
    value: function _trackState() {
      var _this6 = this;

      this.disposers = [];
      this.disposers.push(mobx.reaction(function () {
        return JSON.stringify(_this6.attributes);
      }, function (objectString) {
        _this6.isDirty = true;
      }));
      this.disposers.push(mobx.reaction(function () {
        return JSON.stringify(_this6.relationships);
      }, function (relString) {
        _this6.isDirty = true;
      }));
    }
    /**
     * disposes of track state reactions
     * @method diposeReactions
    */

  }, {
    key: "disposeReactions",
    value: function disposeReactions() {
      this.disposers.forEach(function (dispose) {
        return dispose();
      });
      this.disposers = [];
    }
    /**
     * shortcut to get the static
     *
     * @method type
     * @return {String} current attributes
    */

  }, {
    key: "errorForKey",

    /**
     * Getter to check if the record has errors.
     *
     * @method hasErrors
     * @return {Boolean}
     */
    value: function errorForKey(key) {
      return this.errors[key];
    }
    /**
     * Getter to just get the names of a records attributes.
     *
     * @method attributeNames
     * @return {Array}
     */

  }, {
    key: "jsonapi",

    /**
     * getter method to get data in api compliance format
     * TODO: Figure out how to handle unpersisted ids
     *
     * @method jsonapi
     * @return {Object} data in JSON::API format
     */
    value: function jsonapi() {
      var _this7 = this;

      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var attributeDefinitions = this.attributeDefinitions,
          attributeNames = this.attributeNames,
          meta = this.meta,
          id = this.id,
          type = this.constructor.type;
      var filteredAttributeNames = attributeNames;
      var filteredRelationshipNames = [];

      if (options.attributes) {
        filteredAttributeNames = attributeNames.filter(function (name) {
          return options.attributes.includes(name);
        });
      }

      var attributes = filteredAttributeNames.reduce(function (attrs, key) {
        var value = _this7[key];

        if (value) {
          var DataType = attributeDefinitions[key].dataType;
          var attr;

          if (DataType.name === 'Array' || DataType.name === 'Object') {
            attr = mobx.toJS(value);
          } else if (DataType.name === 'Date') {
            attr = moment(value).toISOString();
          } else {
            attr = DataType(value);
          }

          attrs[key] = attr;
        } else {
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
        filteredRelationshipNames = Object.keys(this.relationships).filter(function (name) {
          return options.relationships.includes(name);
        });
        var relationships = filteredRelationshipNames.reduce(function (rels, key) {
          rels[key] = mobx.toJS(_this7.relationships[key]);
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

      return {
        data: data
      };
    }
  }, {
    key: "updateAttributes",
    value: function updateAttributes(attributes) {
      var _this8 = this;

      mobx.transaction(function () {
        Object.keys(attributes).forEach(function (key) {
          mobx.set(_this8, key, attributes[key]);
        });
      });
    }
  }, {
    key: "isDirty",
    get: function get() {
      var isNew = this.isNew,
          _isDirty = this._isDirty;
      return _isDirty || isNew;
    },
    set: function set(value) {
      this._isDirty = value;
    }
    /**
     * Private method. True if the model has been programatically changed,
     * as opposed to just being new.
     * @property _isDirty
     * @type {Boolean}
     * @default false
     * @private
     */

  }, {
    key: "isNew",

    /**
     * True if the model has not been sent to the store
     * @property isNew
     * @type {Boolean}
     */
    get: function get() {
      var id = this.id;
      return !!String(id).match(/tmp/);
    }
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

  }, {
    key: "snapshot",
    get: function get() {
      return {
        attributes: this.attributes,
        relationships: mobx.toJS(this.relationships)
      };
    }
  }, {
    key: "type",
    get: function get() {
      return this.constructor.type;
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
      var _this9 = this;

      return this.attributeNames.reduce(function (attributes, key) {
        var value = mobx.toJS(_this9[key]);

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
     * Getter find the relationship definitions for the model type.
     *
     * @method relationshipDefinitions
     * @return {Object}
     */

  }, {
    key: "relationshipDefinitions",
    get: function get() {
      var type = this.constructor.type;
      return schema.relations[type];
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
      }, {
        relationships: {}
      });
    }
  }]);

  return Model;
}(), _temp), (_applyDecoratedDescriptor(_class.prototype, "isDirty", [mobx.computed], Object.getOwnPropertyDescriptor(_class.prototype, "isDirty"), _class.prototype), _descriptor = _applyDecoratedDescriptor(_class.prototype, "_isDirty", [mobx.observable], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return false;
  }
}), _applyDecoratedDescriptor(_class.prototype, "isNew", [mobx.computed], Object.getOwnPropertyDescriptor(_class.prototype, "isNew"), _class.prototype), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, "errors", [mobx.observable], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return {};
  }
})), _class);

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
function newId() {
  return "tmp-".concat(uuidv1());
}
function dbOrNewId(properties) {
  return properties.id || newId();
}
/**
 * Reducer function for filtering out duplicate records
 * by a key provided. Returns a function that has a accumulator and
 * current record per Array.reduce.
 *
 * @method uniqueByReducer
 * @param {Array} key
 * @return {Function}
 */

function uniqueByReducer(key) {
  return function (accumulator, current) {
    return accumulator.some(function (item) {
      return item[key] === current[key];
    }) ? accumulator : [].concat(_toConsumableArray(accumulator), [current]);
  };
}
/**
 * Returns objects unique by key provided
 *
 * @method uniqueBy
 * @param {Array} array
 * @param {String} key
 * @return {Array}
 */

function uniqueBy(array, key) {
  return array.reduce(uniqueByReducer(key), []);
}

var _class$1, _descriptor$1, _descriptor2$1, _descriptor3, _descriptor4, _temp$1;

function ownKeys$2(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$2(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$2(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$2(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
/**
 * Defines the Artemis Data Store class.
 *
 * @class Store
 * @constructor
 */

var Store = (_class$1 = (_temp$1 =
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

    _initializerDefineProperty(this, "data", _descriptor$1, this);

    this.moment = moment;

    this.add = function (type, data) {
      if (data.constructor.name === 'Array') {
        return _this.addModels(type, data);
      } else {
        return _this.addModel(type, mobx.toJS(data));
      }
    };

    _initializerDefineProperty(this, "addModel", _descriptor2$1, this);

    _initializerDefineProperty(this, "newModel", _descriptor3, this);

    this.addModels = function (type, data) {
      var records = [];
      mobx.transaction(function () {
        records = data.map(function (obj) {
          return _this.addModel(type, obj);
        });
      });
      return records;
    };

    _initializerDefineProperty(this, "remove", _descriptor4, this);

    this.findOne = function (type, id) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var fromServer = options.fromServer,
          queryParams = options.queryParams;

      if (fromServer === true) {
        // If fromServer is true always fetch the data and return
        return _this.fetchOne(type, id, queryParams);
      } else if (fromServer === false) {
        // If fromServer is false never fetch the data and return
        return _this.getRecord(type, id, queryParams);
      } else {
        return _this.findOrFetchOne(type, id, queryParams);
      }
    };

    this.findOrFetchOne = function (type, id, queryParams) {
      // Get the matching record
      var record = _this.getMatchingRecord(type, id, queryParams); // If the cached record is present


      if (record && record.id) {
        // Return data
        return record;
      } else {
        // Otherwise fetch it from the server
        return _this.fetchOne(type, id, queryParams);
      }
    };

    this.findAll = function (type) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var fromServer = options.fromServer,
          queryParams = options.queryParams;

      if (fromServer === true) {
        // If fromServer is true always fetch the data and return
        return _this.fetchAll(type, queryParams);
      } else if (fromServer === false) {
        // If fromServer is false never fetch the data and return
        return _this.getMatchingRecords(type, queryParams);
      } else {
        return _this.findOrFetchAll(type, queryParams);
      }
    };

    this.findOrFetchAll = function (type, queryParams) {
      // Get any matching records
      var records = _this.getMatchingRecords(type, queryParams); // If any records are present


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
      return fetch(url, _objectSpread$2({}, defaultFetchOptions, {}, options));
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
     * Get single all record
     * based on query params
     *
     * @method getMatchingRecord
     * @param {String} type
     * @param id
     * @param {Object} queryParams
     * @return {Array} array or records
     */

  }, {
    key: "getMatchingRecord",
    value: function getMatchingRecord(type, id, queryParams) {
      if (queryParams) {
        return this.getCachedRecord(type, id, queryParams);
      } else {
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

  }, {
    key: "getRecord",
    value: function getRecord(type, id) {
      if (!this.getType(type)) {
        throw new Error("Could not find a collection for type '".concat(type, "'"));
      }

      var record = this.getType(type).records[id];
      if (!record || record === 'undefined') return;
      return record;
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
      var records = Object.values(this.getType(type).records).filter(function (value) {
        return value && value !== 'undefined';
      }); // NOTE: Handles a scenario where the store keeps around a reference
      // to a newly persisted record by its temp uuid. This is required
      // because we can't simply remove the temp uuid reference because other
      // related models may be still using the temp uuid in their relationships
      // data object. However, when we are listing out records we want them
      // to be unique by the persisted id (which is updated after a Model.save)

      return uniqueBy(records, 'id');
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

  }, {
    key: "getCachedRecord",
    value: function getCachedRecord(type, id, queryParams) {
      var cachedRecords = this.getCachedRecords(type, queryParams, id);
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

  }, {
    key: "getCachedRecords",
    value: function getCachedRecords(type, queryParams, id) {
      // Get the url the request would use
      var url = this.fetchUrl(type, queryParams, id); // Get the matching ids from the response

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
     * Gets records from store based on cached query
     *
     * @method getCachedIds
     * @param {String} type
     * @param {String} url
     * @return {Array} array of ids
     */

  }, {
    key: "getCachedId",
    value: function getCachedId(type, id) {
      return this.getType(type).cache[id];
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
        return record;
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
     * Creates or updates a model
     *
     * @method createOrUpdateModel
     * @param {Object} dataObject
     */

  }, {
    key: "createOrUpdateModel",
    value: function createOrUpdateModel(dataObject) {
      var _this4 = this;

      var _dataObject$attribute = dataObject.attributes,
          attributes = _dataObject$attribute === void 0 ? {} : _dataObject$attribute,
          id = dataObject.id,
          _dataObject$relations = dataObject.relationships,
          relationships = _dataObject$relations === void 0 ? {} : _dataObject$relations,
          type = dataObject.type;
      var record = this.getRecord(type, id);

      if (record) {
        // Update existing object attributes
        Object.keys(attributes).forEach(function (key) {
          mobx.set(record, key, attributes[key]);
          mobx.set(_this4.data[type].records, id, record);
        }); // If relationships are present, update relationships

        if (relationships) {
          Object.keys(relationships).forEach(function (key) {
            // Don't try to create relationship if meta included false
            if (!relationships[key].meta) {
              // defensive against existingRecord.relationships being undefined
              mobx.set(record, 'relationships', _objectSpread$2({}, record.relationships, _defineProperty({}, key, relationships[key])));
              mobx.set(_this4.data[type].records, id, record);
            }
          });
        }
      } else {
        record = this.createModel(type, id, {
          attributes: attributes,
          relationships: relationships
        });
        this.data[type].records[record.id] = record;
      }

      return record;
    }
    /**
     * Create multiple models from an array of data
     *
     * @method createModelsFromData
     * @param {Array} data
     */

  }, {
    key: "createModelsFromData",
    value: function createModelsFromData(data) {
      var _this5 = this;

      var records = [];
      mobx.transaction(function () {
        records = data.forEach(function (dataObject) {
          return _this5.createOrUpdateModel(dataObject);
        });
      });
      return records;
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
      var _toJS = mobx.toJS(data),
          _toJS$attributes = _toJS.attributes,
          attributes = _toJS$attributes === void 0 ? {} : _toJS$attributes,
          _toJS$relationships = _toJS.relationships,
          relationships = _toJS$relationships === void 0 ? {} : _toJS$relationships;

      var store = this;
      var ModelKlass = this.getKlass(type);

      if (!ModelKlass) {
        throw new Error("Could not find a model for '".concat(type, "'"));
      }

      return new ModelKlass(_objectSpread$2({
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
     * @method fetchAll
     * @param {String} type the type to find
     * @param {Object} options
     */

  }, {
    key: "fetchAll",
    value: function fetchAll(type, queryParams) {
      var _this6 = this;

      var store, url, response, json, records;
      return _regeneratorRuntime.async(function fetchAll$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              store = this;
              url = this.fetchUrl(type, queryParams);
              _context.next = 4;
              return _regeneratorRuntime.awrap(this.fetch(url, {
                method: 'GET'
              }));

            case 4:
              response = _context.sent;

              if (!(response.status === 200)) {
                _context.next = 16;
                break;
              }

              this.data[type].cache[url] = [];
              _context.next = 9;
              return _regeneratorRuntime.awrap(response.json());

            case 9:
              json = _context.sent;

              if (json.included) {
                this.createModelsFromData(json.included);
              }

              records = [];
              mobx.transaction(function () {
                records = json.data.map(function (dataObject) {
                  var id = dataObject.id,
                      _dataObject$attribute2 = dataObject.attributes,
                      attributes = _dataObject$attribute2 === void 0 ? {} : _dataObject$attribute2,
                      _dataObject$relations2 = dataObject.relationships,
                      relationships = _dataObject$relations2 === void 0 ? {} : _dataObject$relations2;
                  var ModelKlass = _this6.modelTypeIndex[type];
                  var record = new ModelKlass(_objectSpread$2({
                    store: store,
                    relationships: relationships
                  }, attributes));

                  _this6.data[type].cache[url].push(id);

                  _this6.data[type].records[id] = record;
                  return record;
                });
              });
              return _context.abrupt("return", records);

            case 16:
              return _context.abrupt("return", Promise.reject(response.status));

            case 17:
            case "end":
              return _context.stop();
          }
        }
      }, null, this);
    }
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
    value: function fetchOne(type, id, queryParams) {
      var url, response, json, data, included, record;
      return _regeneratorRuntime.async(function fetchOne$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              url = this.fetchUrl(type, queryParams, id); // Trigger request

              _context2.next = 3;
              return _regeneratorRuntime.awrap(this.fetch(url, {
                method: 'GET'
              }));

            case 3:
              response = _context2.sent;

              if (!(response.status === 200)) {
                _context2.next = 16;
                break;
              }

              _context2.next = 7;
              return _regeneratorRuntime.awrap(response.json());

            case 7:
              json = _context2.sent;
              data = json.data, included = json.included;
              record = this.createOrUpdateModel(data);
              this.data[type].cache[url] = [];
              this.data[type].cache[url].push(record.id);

              if (included) {
                this.createModelsFromData(included);
              }

              return _context2.abrupt("return", record);

            case 16:
              return _context2.abrupt("return", response.status);

            case 17:
            case "end":
              return _context2.stop();
          }
        }
      }, null, this);
    }
  }]);

  return Store;
}(), _temp$1), (_descriptor$1 = _applyDecoratedDescriptor(_class$1.prototype, "data", [mobx.observable], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return {};
  }
}), _descriptor2$1 = _applyDecoratedDescriptor(_class$1.prototype, "addModel", [mobx.action], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this7 = this;

    return function (type, attributes) {
      var id = dbOrNewId(attributes);

      var model = _this7.createModel(type, id, {
        attributes: attributes
      }); // Add the model to the type records index


      _this7.data[type].records[id] = model;
      return model;
    };
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class$1.prototype, "newModel", [mobx.action], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this8 = this;

    return function (type, attributes) {
      return _this8.createModel(type, newId(), {
        attributes: attributes
      });
    };
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class$1.prototype, "remove", [mobx.action], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this9 = this;

    return function (type, id) {
      var records = _this9.getRecords(type);

      _this9.data[type].records = records.reduce(function (hash, record) {
        if (String(record.id) !== String(id)) {
          hash[record.id] = record;
        }

        return hash;
      }, {});
    };
  }
})), _class$1);

/**
 * returns `true` as long as the `value` is not `null`, `undefined`, or `''`
 *
 * @method isPresent
 * @param value
 * @return {Boolean}
 */

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
/**
 * Helper method for apply the correct defaults to attributes.
 * @method defaultValueForDescriptor
 */


function defaultValueForDescriptor(descriptor, DataType) {
  if (typeof descriptor.initializer === 'function') {
    var value = descriptor.initializer();

    if (DataType.name === 'Date') {
      return moment(value).toDate();
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
      set: function set(value) {
        mobx.set(target, property, value);
      }
    };
  };
}
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
      schema.addValidation({
        property: property,
        type: type,
        validator: validator
      });
    };
  } else {
    var type = target.constructor.type;
    schema.addValidation({
      property: property,
      type: type,
      validator: validator
    });
  }
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
      schema.addRelationship({
        type: target2.constructor.type,
        property: property2,
        dataType: Array
      });
      return {
        get: function get() {
          var type = targetOrModelKlass.type;
          return getRelatedRecords$1(this, property2, type);
        }
      };
    };
  } else {
    schema.addRelationship({
      type: targetOrModelKlass.constructor.type,
      property: property,
      dataType: Array
    });
    return {
      get: function get() {
        return getRelatedRecords$1(this, property);
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
      schema.addRelationship({
        type: target2.constructor.type,
        property: property2,
        dataType: Object
      });
      return {
        get: function get() {
          var type = targetOrModelKlass.type;
          return getRelatedRecord$1(this, property2, type);
        },
        set: function set(record) {
          var type = targetOrModelKlass.type;
          return setRelatedRecord$1(this, record, property2, type);
        }
      };
    };
  } else {
    schema.addRelationship({
      type: targetOrModelKlass.constructor.type,
      property: property,
      dataType: Object
    });
    return {
      get: function get() {
        return getRelatedRecord$1(this, property);
      },
      set: function set(record) {
        return setRelatedRecord$1(this, record, property);
      }
    };
  }
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

function getRelatedRecords$1(record, property) {
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

  return new RelatedRecordsArray$1(relatedRecords, record, relationType);
}
/**
 * Handles getting polymorphic has_one/belong_to.
 *
 * @method getRelatedRecord
 */

function getRelatedRecord$1(record, property) {
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

function setRelatedRecord$1(record, relatedRecord, property) {
  var modelType = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

  if (relatedRecord && !(relatedRecord instanceof Model)) {
    throw new Error('Related record must be a valid Model object');
  }

  var relationships = record.relationships;
  var relationType = modelType || property;
  var referenceRecord = relatedRecord || getRelatedRecord$1(record, relationType);

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


  var inverseRelatedToMany = getRelatedRecords$1(referenceRecord, null, record.constructor.type);

  if (inverseRelatedToMany) {
    var inverseMethod = relatedRecord ? 'add' : 'remove';
    inverseRelatedToMany[inverseMethod](record);
  }

  return relatedRecord;
}
/**
 * An array that allows for updating store references and relationships
 * @class RelatedRecordsArray
 * @constructor
 * @param {Array} array the array to extend
 * @param {Object} record the record with the referenced array
 * @param {String} property the property on the record that references the array
 */

var RelatedRecordsArray$1 =
/*#__PURE__*/
function (_Array) {
  _inherits(RelatedRecordsArray, _Array);

  function RelatedRecordsArray(_array, _record, _property) {
    var _this;

    _classCallCheck(this, RelatedRecordsArray);

    // Invalid attempt to spread non-iterable instance
    // https://github.com/babel/babel/issues/7258
    if (!_array || !_array.length || _array.length === 0) {
      _this = _possibleConstructorReturn(this, _getPrototypeOf(RelatedRecordsArray).call(this));

      _this.add = function (relatedRecord) {
        var _assertThisInitialize = _assertThisInitialized(_this),
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
          relationships[property] = {};
        }

        if (!relationships[property].data) {
          relationships[property].data = [];
        }

        var existingRelationships = relationships[property];
        var alreadyThere = existingRelationships && existingRelationships.data.find(function (model) {
          return model.id === id && model.type === type;
        });

        if (!alreadyThere) {
          relationships[property].data.push({
            id: id,
            type: type
          });

          _this.push(relatedRecord); // setting the inverse - hack this will only work with singularized relationships.


          setRelatedRecord$1(relatedRecord, record, recordType.slice(0, recordType.length - 1));
        }

        return relatedRecord;
      };

      _this.remove = function (relatedRecord) {
        var _assertThisInitialize2 = _assertThisInitialized(_this),
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

          var recordIndexToRemove = _this.findIndex(function (model) {
            return model.id === id && model.type === type;
          });

          if (recordIndexToRemove > 0) _this.splice(recordIndexToRemove, 1);

          if (!relationships[property].data.length) {
            delete relationships[property];
          }

          if (!Object.keys(record.relationships).length) {
            delete record.relationships;
          } // hack this will only work with singularized relationships.


          setRelatedRecord$1(relatedRecord, null, recordType.slice(0, recordType.length - 1));
        }

        return relatedRecord;
      };

      _this.replace = function (array) {
        var _assertThisInitialize3 = _assertThisInitialized(_this),
            record = _assertThisInitialize3.record,
            property = _assertThisInitialize3.property;

        var relationships = record.relationships;
        mobx.transaction(function () {
          relationships[property] = {
            data: []
          };
          array.forEach(function (object) {
            return _this.add(object);
          });
        });
      };
    } else {
      var _getPrototypeOf2;

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(RelatedRecordsArray)).call.apply(_getPrototypeOf2, [this].concat(_toConsumableArray(_array))));

      _this.add = function (relatedRecord) {
        var _assertThisInitialize = _assertThisInitialized(_this),
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
          relationships[property] = {};
        }

        if (!relationships[property].data) {
          relationships[property].data = [];
        }

        var existingRelationships = relationships[property];
        var alreadyThere = existingRelationships && existingRelationships.data.find(function (model) {
          return model.id === id && model.type === type;
        });

        if (!alreadyThere) {
          relationships[property].data.push({
            id: id,
            type: type
          });

          _this.push(relatedRecord);

          setRelatedRecord$1(relatedRecord, record, recordType.slice(0, recordType.length - 1));
        }

        return relatedRecord;
      };

      _this.remove = function (relatedRecord) {
        var _assertThisInitialize2 = _assertThisInitialized(_this),
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

          var recordIndexToRemove = _this.findIndex(function (model) {
            return model.id === id && model.type === type;
          });

          if (recordIndexToRemove > 0) _this.splice(recordIndexToRemove, 1);

          if (!relationships[property].data.length) {
            delete relationships[property];
          }

          if (!Object.keys(record.relationships).length) {
            delete record.relationships;
          }

          setRelatedRecord$1(relatedRecord, null, recordType.slice(0, recordType.length - 1));
        }

        return relatedRecord;
      };

      _this.replace = function (array) {
        var _assertThisInitialize3 = _assertThisInitialized(_this),
            record = _assertThisInitialize3.record,
            property = _assertThisInitialize3.property;

        var relationships = record.relationships;
        mobx.transaction(function () {
          relationships[property] = {
            data: []
          };
          array.forEach(function (object) {
            return _this.add(object);
          });
        });
      };
    }

    _this.property = _property;
    _this.record = _record;
    return _possibleConstructorReturn(_this);
  }
  /**
   * Adds a record to the array, and updates references in the store, as well as inverse references
   * @method add
   * @param {Object} relatedRecord the record to add to the array
   * @return {Object} the original relatedRecord
   */


  return RelatedRecordsArray;
}(_wrapNativeSuper(Array));

exports.Model = Model;
exports.Store = Store;
exports.attribute = attribute;
exports.relatedToMany = relatedToMany;
exports.relatedToOne = relatedToOne;
exports.validates = validates;
