import _toConsumableArray from '@babel/runtime/helpers/toConsumableArray';
import _defineProperty from '@babel/runtime/helpers/defineProperty';
import _initializerDefineProperty from '@babel/runtime/helpers/initializerDefineProperty';
import _classCallCheck from '@babel/runtime/helpers/classCallCheck';
import _createClass from '@babel/runtime/helpers/createClass';
import _applyDecoratedDescriptor from '@babel/runtime/helpers/applyDecoratedDescriptor';
import '@babel/runtime/helpers/initializerWarningHelper';
import _typeof from '@babel/runtime/helpers/typeof';
import { transaction, set, observable, computed, extendObservable, reaction, toJS, action } from 'mobx';
import moment from 'moment';
import uuidv1 from 'uuid/v1';
import jqueryParam from 'jquery-param';
import pluralize from 'pluralize';
import dig from 'lodash/get';
import flattenDeep from 'lodash/flattenDeep';
import _regeneratorRuntime from '@babel/runtime/regenerator';
import _asyncToGenerator from '@babel/runtime/helpers/asyncToGenerator';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import isObject from 'lodash/isObject';
import findLast from 'lodash/findLast';
import _possibleConstructorReturn from '@babel/runtime/helpers/possibleConstructorReturn';
import _getPrototypeOf from '@babel/runtime/helpers/getPrototypeOf';
import _assertThisInitialized from '@babel/runtime/helpers/assertThisInitialized';
import _inherits from '@babel/runtime/helpers/inherits';
import _wrapNativeSuper from '@babel/runtime/helpers/wrapNativeSuper';

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
var pending = {};
var counter = {};

var incrementor = function incrementor(key) {
  return function () {
    var count = (counter[key] || 0) + 1;
    counter[key] = count;
    return count;
  };
};

var decrementor = function decrementor(key) {
  return function () {
    var count = (counter[key] || 0) - 1;
    counter[key] = count;
    return count;
  };
};
/**
 * Singularizes record type
 * @method singularizeType
 * @param {String} recordType type of record
 * @return {String}
 */


function singularizeType(recordType) {
  var typeParts = recordType.split('_');
  var endPart = typeParts[typeParts.length - 1];
  typeParts = typeParts.slice(0, -1);
  endPart = pluralize.singular(endPart);
  return [].concat(_toConsumableArray(typeParts), [endPart]).join('_');
}
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
 * Avoids making racing requests by blocking a request if an identical one is
 * already in-flight. Blocked requests will be resolved when the initial request
 * resolves by cloning the response.
 *
 * @method combineRacedRequests
 * @param {String} key the unique key for the request
 * @param {Function} fn the function the generates the promise
 * @return {Promise}
 */

function combineRacedRequests(key, fn) {
  var incrementBlocked = incrementor(key);
  var decrementBlocked = decrementor(key); // keep track of the number of callers waiting for this promise to resolve

  incrementBlocked();

  function handleResponse(response) {
    var count = decrementBlocked(); // if there are other callers waiting for this request to resolve, we should
    // clone the response before returning so that we can re-use it for the
    // remaining callers

    if (count > 0) return response.clone(); // if there are no more callers waiting for this promise to resolve (i.e. if
    // this is the last one), we can remove the reference to the pending promise
    // allowing subsequent requests to proceed unblocked.

    delete pending[key];
    return response;
  } // Return pending promise if one already exists


  if (pending[key]) return pending[key].then(handleResponse); // Otherwise call the method and on resolution
  // clear out the pending promise for the key

  pending[key] = fn.call();
  return pending[key].then(handleResponse);
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
/**
 * recursively walk an object and call the `iteratee` function for
 * each property. returns an array of results of calls to the iteratee.
 * @method walk
 * @param {*} obj
 * @param {Function} iteratee
 * @param {String} prefix
 * @return Array
 */

function walk(obj, iteratee, prefix) {
  if (obj != null && _typeof(obj) === 'object') {
    return Object.keys(obj).map(function (prop) {
      return walk(obj[prop], iteratee, [prefix, prop].filter(function (x) {
        return x;
      }).join('.'));
    });
  }

  return iteratee(obj, prefix);
}
/**
 * deeply compare objects a and b and return object paths for attributes
 * which differ. it is important to note that this comparison is biased
 * toward object a. object a is walked and compared against values in
 * object b. if a property exists in object b, but not in object a, it
 * will not be counted as a difference.
 * @method diff
 * @param {Object} a
 * @param {Object} b
 * @return Array<String>
 */

function diff() {
  var a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return flattenDeep(walk(a, function (prevValue, path) {
    var currValue = dig(b, path);
    return prevValue === currValue ? undefined : path;
  })).filter(function (x) {
    return x;
  });
}
function buildDecoratedPromise(target, result) {
  // Define proxied attributes
  var attributeNames = Object.keys(target.attributeNames);
  attributeNames.push('isInFlight');
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
  }, tempProperties));
  return result;
}

function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$1(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$1(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function parseApiErrors(errors, defaultMessage) {
  return errors[0].detail.length === 0 ? defaultMessage : errors[0].detail[0];
}

function ObjectPromiseProxy(promise, target) {
  // Immediately set isInFlight to true
  target.isInFlight = true; // Keep the current id around in case it is a new object.

  var tmpId = target.id;
  var result = promise.then(
  /*#__PURE__*/
  function () {
    var _ref = _asyncToGenerator(
    /*#__PURE__*/
    _regeneratorRuntime.mark(function _callee(response) {
      var status, json, message, _json, errorString;

      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              status = response.status;

              if (!(status === 200 || status === 201)) {
                _context.next = 11;
                break;
              }

              _context.next = 4;
              return response.json();

            case 4:
              json = _context.sent;
              transaction(function () {
                // Update target record's current id
                set(target, 'id', json.data.id); // NOTE: This resolves an issue where a record is persisted but the
                // index key is still a temp uuid. We can't simply remove the temp
                // key because there may be associated records that have the temp
                // uuid id as its only reference to the newly persisted record.
                // TODO: Figure out a way to update associated records to use the
                // newly persisted id.

                target.store.data[target.type].records[tmpId] = target;
                target.store.data[target.type].records[target.id] = target; // Update the existing record in the store.

                target.store._createOrUpdateOneRecordFromResponseData(json.data); // Create or update the related (included) records.


                if (json.included) {
                  target.store._createOrUpdateAllRecordsFromResponseData(json.included);
                }
              }); // End the "loading" state by setting target isInFlight to false

              target.isInFlight = false;

              target._takeSnapshot({
                persisted: true
              });

              return _context.abrupt("return", target);

            case 11:
              message = target.store.genericErrorMessage;
              _json = {};
              _context.prev = 13;
              _context.next = 16;
              return response.json();

            case 16:
              _json = _context.sent;
              message = parseApiErrors(_json.errors, message);
              _context.next = 22;
              break;

            case 20:
              _context.prev = 20;
              _context.t0 = _context["catch"](13);

            case 22:
              // TODO: add all errors from the API response to the target
              target.errors = _objectSpread$1({}, target.errors, {
                status: status,
                base: [{
                  message: message
                }],
                server: _json.errors
              });
              errorString = JSON.stringify(target.errors);
              target.isInFlight = false;
              return _context.abrupt("return", Promise.reject(new Error(errorString)));

            case 26:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[13, 20]]);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }(), function (error) {
    // TODO: Handle error states correctly
    target.isInFlight = false;
    target.errors = error;
    throw error;
  });
  return buildDecoratedPromise(target, result);
}

function DeleteObjectPromiseProxy(promise, target) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  target.errors = {};
  var result = promise.then(
  /*#__PURE__*/
  function () {
    var _ref = _asyncToGenerator(
    /*#__PURE__*/
    _regeneratorRuntime.mark(function _callee(response) {
      var json, data, included;
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!(response.status === 202 || response.status === 204)) {
                _context.next = 22;
                break;
              }

              if (!options.softDestroy) {
                _context.next = 16;
                break;
              }

              _context.prev = 2;
              _context.next = 5;
              return response.json();

            case 5:
              json = _context.sent;
              data = json.data, included = json.included;

              if (data) {
                target.store._createOrUpdateOneRecordFromResponseData(data);
              }

              if (included) {
                target.store._createOrUpdateAllRecordsFromResponseData(included);
              }

              _context.next = 14;
              break;

            case 11:
              _context.prev = 11;
              _context.t0 = _context["catch"](2);
              console.log(_context.t0); // It is text, do you text handling here

            case 14:
              _context.next = 18;
              break;

            case 16:
              target.dispose();
              target.store.remove(target.type, target.id);

            case 18:
              target.isInFlight = false;
              return _context.abrupt("return", target);

            case 22:
              target.isInFlight = false;
              target.errors = {
                status: response.status
              };
              return _context.abrupt("return", target);

            case 25:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[2, 11]]);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }(), function (error) {
    target.isInFlight = false;
    target.errors = error;
    throw error;
  });
  return buildDecoratedPromise(target, result);
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
    /**
     * Adds a validation to either the schema `structure` (for attributes) or `relations` (for relationships)
     * @method addValidation
     * @param {Object} options includes `type`, `property`, and `validator`
     */

  }, {
    key: "addValidation",
    value: function addValidation(_ref3) {
      var type = _ref3.type,
          property = _ref3.property,
          validator = _ref3.validator;

      if (this.structure[type][property]) {
        this.structure[type][property].validator = validator;
      } else {
        this.relations[type][property].validator = validator;
      }
    }
  }]);

  return Schema;
}();

var schema = new Schema();

var _class, _descriptor, _descriptor2, _descriptor3, _descriptor4, _temp;

function ownKeys$2(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$2(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$2(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$2(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
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
    if (!validator) return true;
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

    if (_typeof(property) === 'object') {
      if (property.id) {
        property.id = String(property.id);
      }

      stringifyIds(property);
    }
  });
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

    _initializerDefineProperty(this, "_disposed", _descriptor, this);

    _initializerDefineProperty(this, "_dirtyRelationships", _descriptor2, this);

    _initializerDefineProperty(this, "_dirtyAttributes", _descriptor3, this);

    this.isInFlight = false;

    _initializerDefineProperty(this, "errors", _descriptor4, this);

    this._snapshots = [];

    this._makeObservable(initialAttributes);

    this._takeSnapshot({
      persisted: !this.isNew
    });
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
    * has this object been destroyed?
    * @property _disposed
    * @type {Boolean}
    * @default false
    */


  _createClass(Model, [{
    key: "rollback",

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
    value: function rollback() {
      this._applySnapshot(this.previousSnapshot);
    }
    /**
     * restores data to its last persisted state or the oldest snapshot
     * state if the model was never persisted
     * @method rollbackToPersisted
     */

  }, {
    key: "rollbackToPersisted",
    value: function rollbackToPersisted() {
      this._applySnapshot(this.persistedSnapshot);

      this._takeSnapshot({
        persisted: true
      });
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
      var _this = this;

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

      if (relationships) {
        relationships.forEach(function (rel) {
          if (Array.isArray(_this[rel])) {
            _this[rel].forEach(function (item, i) {
              if (item && item.isNew) {
                throw new Error("Invariant violated: tried to save a relationship to an unpersisted record: \"".concat(rel, "[").concat(i, "]\""));
              }
            });
          } else if (_this[rel] && _this[rel].isNew) {
            throw new Error("Invariant violated: tried to save a relationship to an unpersisted record: \"".concat(rel, "\""));
          }
        });
      }

      var response = this.store.fetch(url, {
        method: method,
        body: body
      });
      return new ObjectPromiseProxy(response, this);
    }
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

  }, {
    key: "validate",
    value: function validate() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      this.errors = {};
      var attributeDefinitions = this.attributeDefinitions,
          relationshipDefinitions = this.relationshipDefinitions;
      var attributeNames = options.attributes || this.attributeNames;
      var relationshipNames = options.relationships || this.relationshipNames;
      var validAttributes = validateProperties(this, attributeNames, attributeDefinitions);
      var validRelationships = validateProperties(this, relationshipNames, relationshipDefinitions);
      return validAttributes.concat(validRelationships).every(function (value) {
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
      this.isInFlight = true;
      var type = this.type,
          id = this.id,
          snapshot = this.snapshot,
          isNew = this.isNew; // If the record is new we can just remove the record and short circuit

      if (isNew) {
        this.store.remove(type, id);
        return snapshot;
      }

      var url = this.store.fetchUrl(type, options.params, id);
      var response = this.store.fetch(url, {
        method: 'DELETE'
      });
      return new DeleteObjectPromiseProxy(response, this, options);
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
      extendObservable(this, _objectSpread$2({}, defaultAttributes, {}, initialAttributes));

      this._listenForChanges();
    }
    /**
     * sets up a reaction for each top-level attribute so we can compare
     * values after each mutation and keep track of dirty attr states
     * if an attr is different than the last snapshot, add it to the
     * _dirtyAttributes set
     * if it's the same as the last snapshot, make sure it's _not_ in the
     * _dirtyAttributes set
     * @method _listenForChanges
     */

  }, {
    key: "_listenForChanges",
    value: function _listenForChanges() {
      var _this2 = this;

      this._disposers = Object.keys(this.attributes).map(function (attr) {
        return reaction(function () {
          return _this2.attributes[attr];
        }, function (value) {
          var previousValue = _this2.previousSnapshot.attributes[attr];

          if (isEqual(previousValue, value)) {
            _this2._dirtyAttributes.delete(attr);
          } else if (isObject(value)) {
            // handles Objects and Arrays
            // clear out any dirty attrs that start with this attr prefix
            // then we can reset them if they are still (or newly) dirty
            Array.from(_this2._dirtyAttributes).forEach(function (path) {
              if (path.indexOf("".concat(attr, ".")) === 0) {
                _this2._dirtyAttributes.delete(path);
              }
            });
            diff(previousValue, value).forEach(function (property) {
              _this2._dirtyAttributes.add("".concat(attr, ".").concat(property));
            });
          } else {
            _this2._dirtyAttributes.add(attr);
          }
        });
      });
    }
    /**
     * call this when destroying an object to make sure that we clean up
     * any event listeners and don't leak memory
     * @method dispose
     */

  }, {
    key: "dispose",
    value: function dispose() {
      this._disposed = true;

      this._disposers.forEach(function (dispose) {
        return dispose();
      });
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
      this._takeSnapshot();
    }
    /**
     * the latest snapshot
     *
     * @method previousSnapshot
     */

  }, {
    key: "_takeSnapshot",

    /**
     * take a snapshot of the current model state.
     * if persisted, clear the stack and push this snapshot to the top
     * if not persisted, push this snapshot to the top of the stack
     * @method _takeSnapshot
     * @param {Object} options
     */
    value: function _takeSnapshot() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var persisted = options.persisted || false;

      this._dirtyRelationships.clear();

      this._dirtyAttributes.clear();

      var _this$snapshot = this.snapshot,
          attributes = _this$snapshot.attributes,
          relationships = _this$snapshot.relationships;
      var snapshot = {
        persisted: persisted,
        attributes: attributes,
        relationships: relationships
      };

      if (persisted) {
        this._snapshots = [];
      }

      this._snapshots.push(snapshot);
    }
    /**
     * set the current attributes and relationships to the attributes
     * and relationships of the snapshot to be applied. also reset errors
     * @method _applySnapshot
     * @param {Object} snapshot
     */

  }, {
    key: "_applySnapshot",
    value: function _applySnapshot(snapshot) {
      var _this3 = this;

      if (!snapshot) throw new Error('Invariant violated: tried to apply undefined snapshot');
      transaction(function () {
        _this3.attributeNames.forEach(function (key) {
          _this3[key] = snapshot.attributes[key];
        });

        _this3.relationships = snapshot.relationships;
        _this3.errors = {};
      });
    }
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
      var _this4 = this;

      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var attributeDefinitions = this.attributeDefinitions,
          attributeNames = this.attributeNames,
          meta = this.meta,
          id = this.id,
          type = this.type;
      var filteredAttributeNames = attributeNames;
      var filteredRelationshipNames = [];

      if (options.attributes) {
        filteredAttributeNames = attributeNames.filter(function (name) {
          return options.attributes.includes(name);
        });
      }

      var attributes = filteredAttributeNames.reduce(function (attrs, key) {
        var value = _this4[key];

        if (value) {
          var DataType = attributeDefinitions[key].dataType;
          var attr;

          if (DataType.name === 'Array' || DataType.name === 'Object') {
            attr = toJS(value);
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
          rels[key] = toJS(_this4.relationships[key]);
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
    /**
     * @method updateAttributes
     * @param {Object} attributes
     */

  }, {
    key: "updateAttributes",
    value: function updateAttributes(attributes) {
      var _this5 = this;

      transaction(function () {
        Object.keys(attributes).forEach(function (key) {
          set(_this5, key, attributes[key]);
        });
      });
    }
    /**
     * @method clone
     * @return {Model} initialize clone record
     */

  }, {
    key: "clone",
    value: function clone() {
      var attributes = cloneDeep(this.snapshot.attributes);
      var relationships = this.relationships;
      return this.store._createModel(this.type, this.id, {
        attributes: attributes,
        relationships: relationships
      });
    }
  }, {
    key: "isDirty",

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
    get: function get() {
      return this._dirtyAttributes.size > 0 || this._dirtyRelationships.size > 0;
    }
    /**
     * have any changes been made since this record was last persisted?
     * @property hasUnpersistedChanges
     * @type {Boolean}
     */

  }, {
    key: "hasUnpersistedChanges",
    get: function get() {
      return this.isDirty || !this.previousSnapshot.persisted;
    }
    /**
     * True if the model has not been sent to the store
     * @property isNew
     * @type {Boolean}
     */

  }, {
    key: "isNew",
    get: function get() {
      var id = this.id;
      if (!id) return true;
      if (String(id).indexOf('tmp') === -1) return false;
      return true;
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
        relationships: toJS(this.relationships)
      };
    }
  }, {
    key: "previousSnapshot",
    get: function get() {
      var length = this._snapshots.length;
      if (length === 0) throw new Error('Invariant violated: model has no snapshots');
      return this._snapshots[length - 1];
    }
    /**
     * the latest persisted snapshot or the first snapshot if the model was never persisted
     *
     * @method previousSnapshot
     */

  }, {
    key: "persistedSnapshot",
    get: function get() {
      return findLast(this._snapshots, function (ss) {
        return ss.persisted;
      }) || this._snapshots[0];
    }
  }, {
    key: "dirtyAttributes",
    get: function get() {
      var relationships = Array.from(this._dirtyRelationships).map(function (property) {
        return "relationships.".concat(property);
      });
      var attributes = Array.from(this._dirtyAttributes);
      return [].concat(_toConsumableArray(relationships), _toConsumableArray(attributes));
    }
    /**
     * shortcut to get the static
     *
     * @method type
     * @return {String} current attributes
    */

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
      var _this6 = this;

      return this.attributeNames.reduce(function (attributes, key) {
        var value = toJS(_this6[key]);

        if (value == null) {
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
     * Getter to just get the names of a records relationships.
     *
     * @method relationshipNames
     * @return {Array}
     */

  }, {
    key: "relationshipNames",
    get: function get() {
      return Object.keys(this.relationshipDefinitions);
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
}(), _temp), (_descriptor = _applyDecoratedDescriptor(_class.prototype, "_disposed", [observable], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, "_dirtyRelationships", [observable], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new Set();
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class.prototype, "_dirtyAttributes", [observable], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new Set();
  }
}), _applyDecoratedDescriptor(_class.prototype, "isNew", [computed], Object.getOwnPropertyDescriptor(_class.prototype, "isNew"), _class.prototype), _descriptor4 = _applyDecoratedDescriptor(_class.prototype, "errors", [observable], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return {};
  }
})), _class);

var _class$1, _descriptor$1, _descriptor2$1, _descriptor3$1, _temp$1;

function ownKeys$3(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$3(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$3(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$3(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
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

    this.genericErrorMessage = 'Something went wrong.';

    this.add = function (type, data) {
      if (data.constructor.name === 'Array') {
        return _this.addModels(type, data);
      } else {
        return _this.addModel(type, toJS(data));
      }
    };

    _initializerDefineProperty(this, "addModel", _descriptor2$1, this);

    this.addModels = function (type, data) {
      return transaction(function () {
        return data.map(function (obj) {
          return _this.addModel(type, obj);
        });
      });
    };

    _initializerDefineProperty(this, "remove", _descriptor3$1, this);

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
      var record = _this._getMatchingRecord(type, id, queryParams); // If the cached record is present


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
        return _this._getMatchingRecords(type, queryParams);
      } else {
        return _this._findOrFetchAll(type, queryParams);
      }
    };

    this._findOrFetchAll = function (type, queryParams) {
      // Get any matching records
      var records = _this._getMatchingRecords(type, queryParams); // If any records are present


      if (records.length > 0) {
        // Return data
        return records;
      } else {
        // Otherwise fetch it from the server
        return _this.fetchAll(type, queryParams);
      }
    };

    this._init(_options);
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
    key: "fetchUrl",

    /**
     * Builds fetch url based
     *
     * @method fetchUrl
     * @param {String} type the type to find
     * @param {Object} options
     */
    value: function fetchUrl(type, queryParams, id, options) {
      var baseUrl = this.baseUrl,
          modelTypeIndex = this.modelTypeIndex;
      var endpoint = modelTypeIndex[type].endpoint;
      return requestUrl(baseUrl, endpoint, queryParams, id, options);
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
    value: function () {
      var _fetchAll = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee(type, queryParams) {
        var _this2 = this;

        var store, url, response, json;
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                store = this;
                url = this.fetchUrl(type, queryParams);
                _context.next = 4;
                return this.fetch(url, {
                  method: 'GET'
                });

              case 4:
                response = _context.sent;

                if (!(response.status === 200)) {
                  _context.next = 14;
                  break;
                }

                this.data[type].cache[url] = [];
                _context.next = 9;
                return response.json();

              case 9:
                json = _context.sent;

                if (json.included) {
                  this._createOrUpdateAllRecordsFromResponseData(json.included);
                }

                return _context.abrupt("return", transaction(function () {
                  return json.data.map(function (dataObject) {
                    var id = dataObject.id,
                        _dataObject$attribute = dataObject.attributes,
                        attributes = _dataObject$attribute === void 0 ? {} : _dataObject$attribute,
                        _dataObject$relations = dataObject.relationships,
                        relationships = _dataObject$relations === void 0 ? {} : _dataObject$relations;
                    var ModelKlass = _this2.modelTypeIndex[type];
                    var record = new ModelKlass(_objectSpread$3({
                      store: store,
                      relationships: relationships
                    }, attributes));

                    _this2.data[type].cache[url].push(id);

                    _this2.data[type].records[id] = record;
                    return record;
                  });
                }));

              case 14:
                return _context.abrupt("return", Promise.reject(response.status));

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
      _regeneratorRuntime.mark(function _callee2(type, id, queryParams) {
        var url, response, json, data, included, record;
        return _regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                url = this.fetchUrl(type, queryParams, id); // Trigger request

                _context2.next = 3;
                return this.fetch(url, {
                  method: 'GET'
                });

              case 3:
                response = _context2.sent;

                if (!(response.status === 200)) {
                  _context2.next = 16;
                  break;
                }

                _context2.next = 7;
                return response.json();

              case 7:
                json = _context2.sent;
                data = json.data, included = json.included;
                record = this._createOrUpdateOneRecordFromResponseData(data);

                if (included) {
                  this._createOrUpdateAllRecordsFromResponseData(included);
                }

                this.data[type].cache[url] = [];
                this.data[type].cache[url].push(record.id);
                return _context2.abrupt("return", record);

              case 16:
                return _context2.abrupt("return", null);

              case 17:
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

      var fetchOptions = _objectSpread$3({}, defaultFetchOptions, {}, options);

      var key = JSON.stringify({
        url: url,
        fetchOptions: fetchOptions
      });
      return combineRacedRequests(key, function () {
        return fetch(url, _objectSpread$3({}, defaultFetchOptions, {}, options));
      });
    })
    /**
     * Gets individual record from store.
     * NOTE: This originally were meant to be internal methods, but having to call
     * findAll/findOne with { fromServer: false } to just get a record from the store ended up
     * being pretty verbose, so in several places we use getRecord to shorten things.
     *
     * @method getRecord
     * @param {String} type
     * @param {Number} id
     * @return {Object} record
     */

  }, {
    key: "getRecord",
    value: function getRecord(type, id) {
      if (!this._getType(type)) {
        throw new Error("Could not find a collection for type '".concat(type, "'"));
      }

      var record = this._getType(type).records[id];

      if (!record || record === 'undefined') return;
      return record;
    }
    /**
     * Gets records for type of collection from observable.
     * NOTE: See note about `getRecord`.
     *
     * @method getRecords
     * @param {String} type
     * @return {Array} array of objects
     */

  }, {
    key: "getRecords",
    value: function getRecords(type) {
      var records = Object.values(this._getType(type).records).filter(function (value) {
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
    value: function reset(type) {
      if (type) {
        this.data[type] = {
          records: {},
          cache: {}
        };
      } else {
        this._initializeObservableDataProperty();
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
    key: "_init",
    value: function _init(options) {
      this._initializeNetworkConfiguration(options);

      this._initializeModelTypeIndex();

      this._initializeObservableDataProperty();
    }
    /**
     * Entry point for configuring the store
     *
     * @method _initializeNetworkConfiguration
     * @param {Object} options for nextwork config
     */

  }, {
    key: "_initializeNetworkConfiguration",
    value: function _initializeNetworkConfiguration() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      this.baseUrl = options.baseUrl || '';
      this.defaultFetchOptions = options.defaultFetchOptions || {};
    }
    /**
     * Entry point for configuring the store
     *
     * @method initializeModelTypeIndex
     * @param {Object} options for nextwork config
     */

  }, {
    key: "_initializeModelTypeIndex",
    value: function _initializeModelTypeIndex() {
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
     * @method _initializeObservableDataProperty
     */

  }, {
    key: "_initializeObservableDataProperty",
    value: function _initializeObservableDataProperty() {
      var _this3 = this;

      var types = this.constructor.types; // NOTE: Is there a performance cost to setting
      // each property individually?

      types.forEach(function (modelKlass) {
        _this3.data[modelKlass.type] = {
          records: {},
          cache: {}
        };
      });
    }
    /**
     * Gets type of collection from data observable
     *
     * @method _getType
     * @param {String} type
     * @return {Object} observable type object structure
     */

  }, {
    key: "_getType",
    value: function _getType(type) {
      return this.data[type];
    }
    /**
     * Get single all record
     * based on query params
     *
     * @method _getMatchingRecord
     * @param {String} type
     * @param id
     * @param {Object} queryParams
     * @return {Array} array or records
     */

  }, {
    key: "_getMatchingRecord",
    value: function _getMatchingRecord(type, id, queryParams) {
      if (queryParams) {
        return this._getCachedRecord(type, id, queryParams);
      } else {
        return this.getRecord(type, id);
      }
    }
    /**
     * Gets single from store based on cached query
     *
     * @method _getCachedRecord
     * @param {String} type
     * @param id
     * @param {Object} queryParams
     * @return {Array} array or records
     */

  }, {
    key: "_getCachedRecord",
    value: function _getCachedRecord(type, id, queryParams) {
      var cachedRecords = this._getCachedRecords(type, queryParams, id);

      return cachedRecords && cachedRecords[0];
    }
    /**
     * Gets records from store based on cached query
     *
     * @method _getCachedRecords
     * @param {String} type
     * @param {Object} queryParams
     * @return {Array} array or records
     */

  }, {
    key: "_getCachedRecords",
    value: function _getCachedRecords(type, queryParams, id) {
      // Get the url the request would use
      var url = this.fetchUrl(type, queryParams, id); // Get the matching ids from the response

      var ids = this._getCachedIds(type, url); // Get the records matching the ids


      return this._getRecordsById(type, ids);
    }
    /**
     * Gets records from store based on cached query
     *
     * @method _getCachedIds
     * @param {String} type
     * @param {String} url
     * @return {Array} array of ids
     */

  }, {
    key: "_getCachedIds",
    value: function _getCachedIds(type, url) {
      var ids = this._getType(type).cache[url];

      if (!ids) return [];
      var idsSet = new Set(toJS(ids));
      return Array.from(idsSet);
    }
    /**
     * Gets records from store based on cached query
     *
     * @method _getCachedIds
     * @param {String} type
     * @param {String} url
     * @return {Array} array of ids
     */

  }, {
    key: "_getCachedId",
    value: function _getCachedId(type, id) {
      return this._getType(type).cache[id];
    }
    /**
     * Get multiple records by id
     *
     * @method _getRecordsById
     * @param {String} type
     * @param {Array} ids
     * @return {Array} array or records
     */

  }, {
    key: "_getRecordsById",
    value: function _getRecordsById(type) {
      var _this4 = this;

      var ids = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      // NOTE: Is there a better way to do this?
      return ids.map(function (id) {
        return _this4.getRecord(type, id);
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
     * @method _getMatchingRecords
     * @param {String} type
     * @param {Object} queryParams
     * @return {Array} array or records
     */

  }, {
    key: "_getMatchingRecords",
    value: function _getMatchingRecords(type, queryParams) {
      if (queryParams) {
        return this._getCachedRecords(type, queryParams);
      } else {
        return this.getRecords(type);
      }
    }
    /**
     * Helper to look up model class for type.
     *
     * @method _getKlass
     * @param {String} type
     * @return {Class} model class
     */

  }, {
    key: "_getKlass",
    value: function _getKlass(type) {
      return this.modelTypeIndex[type];
    }
    /**
     * returns cache if exists, returns promise if not
     *
     * @method _findOrFetchAll
     * @param {String} type record type
     * @param {Object} queryParams will inform whether to return cached or fetch
     */

  }, {
    key: "_createOrUpdateOneRecordFromResponseData",

    /**
     * Creates or updates a record
     *
     * @method _createOrUpdateOneRecordFromResponseData
     * @param {Object} dataObject
     */
    value: function _createOrUpdateOneRecordFromResponseData(dataObject) {
      var _this5 = this;

      var _dataObject$attribute2 = dataObject.attributes,
          attributes = _dataObject$attribute2 === void 0 ? {} : _dataObject$attribute2,
          id = dataObject.id,
          _dataObject$relations2 = dataObject.relationships,
          relationships = _dataObject$relations2 === void 0 ? {} : _dataObject$relations2,
          type = dataObject.type;
      var record = this.getRecord(type, id);

      if (record) {
        // Update existing object attributes
        Object.keys(attributes).forEach(function (key) {
          set(record, key, attributes[key]);
          set(_this5.data[type].records, id, record);
        }); // If relationships are present, update relationships

        if (relationships) {
          Object.keys(relationships).forEach(function (key) {
            // Don't try to create relationship if meta included false
            if (!relationships[key].meta) {
              // defensive against existingRecord.relationships being undefined
              set(record, 'relationships', _objectSpread$3({}, record.relationships, _defineProperty({}, key, relationships[key])));
              set(_this5.data[type].records, id, record);
            }
          });
        }

        record._takeSnapshot({
          persisted: true
        });
      } else {
        record = this._createModel(type, id, {
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
     * @method _createOrUpdateAllRecordsFromResponseData
     * @param {Array} data
     */

  }, {
    key: "_createOrUpdateAllRecordsFromResponseData",
    value: function _createOrUpdateAllRecordsFromResponseData(data) {
      var _this6 = this;

      return transaction(function () {
        return data.map(function (dataObject) {
          // Only build objects for which we have a type defined.
          // And ignore silently anything else included in the JSON response.
          // TODO: Put some console message in development mode
          if (_this6._getType(dataObject.type)) {
            return _this6._createOrUpdateOneRecordFromResponseData(dataObject);
          }
        });
      });
    }
    /**
     * Helper to create a new model
     *
     * @method _createModel
     * @param {String} type
     * @param {Number} type
     * @param {Object} attributes
     * @return {Object} model instance
     */

  }, {
    key: "_createModel",
    value: function _createModel(type, id, data) {
      var _toJS = toJS(data),
          _toJS$attributes = _toJS.attributes,
          attributes = _toJS$attributes === void 0 ? {} : _toJS$attributes,
          _toJS$relationships = _toJS.relationships,
          relationships = _toJS$relationships === void 0 ? {} : _toJS$relationships;

      var store = this;

      var ModelKlass = this._getKlass(type);

      if (!ModelKlass) {
        throw new Error("Could not find a model for '".concat(type, "'"));
      }

      return new ModelKlass(_objectSpread$3({
        id: id,
        store: store,
        relationships: relationships
      }, attributes));
    }
  }]);

  return Store;
}(), _temp$1), (_descriptor$1 = _applyDecoratedDescriptor(_class$1.prototype, "data", [observable], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return {};
  }
}), _descriptor2$1 = _applyDecoratedDescriptor(_class$1.prototype, "addModel", [action], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this7 = this;

    return function (type, attributes) {
      var id = dbOrNewId(attributes);

      var model = _this7._createModel(type, id, {
        attributes: attributes
      }); // Add the model to the type records index


      _this7.data[type].records[id] = model;
      return model;
    };
  }
}), _descriptor3$1 = _applyDecoratedDescriptor(_class$1.prototype, "remove", [action], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this8 = this;

    return function (type, id) {
      var records = _this8.getRecords(type);

      _this8.data[type].records = records.reduce(function (hash, record) {
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
      set: function set$1(value) {
        set(target, property, value);
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

var _Symbol$species;
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
          return getRelatedRecords(this, property2, type);
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
      schema.addRelationship({
        type: target2.constructor.type,
        property: property2,
        dataType: Object
      });
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
    schema.addRelationship({
      type: targetOrModelKlass.constructor.type,
      property: property,
      dataType: Object
    });
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
  var relatedRecords = []; // NOTE: If the record doesn't have a matching references for the relation type
  // fall back to looking up records by a foreign id i.e record.related_record_id

  if (references && references.data) {
    // Ignore any records of unknown types
    relatedRecords = references.data.filter(function (ref) {
      return record.store._getType(ref.type);
    }).map(function (ref) {
      var recordType = ref.type;
      return record.store.getRecord(recordType, ref.id);
    });
  } else {
    var foreignId = "".concat(singularizeType(record.type), "_id");
    relatedRecords = record.store.getRecords(relationType).filter(function (rel) {
      return String(rel[foreignId]) === String(record.id);
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

  var relationType = modelType ? singularizeType(modelType) : property;
  var reference = relationships[relationType]; // Short circuit if matching reference is not found

  if (!reference || !reference.data) return;
  var _reference$data = reference.data,
      id = _reference$data.id,
      type = _reference$data.type;
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

_Symbol$species = Symbol.species;
var RelatedRecordsArray =
/*#__PURE__*/
function (_Array) {
  _inherits(RelatedRecordsArray, _Array);

  function RelatedRecordsArray(_array, _record, _property) {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, RelatedRecordsArray);

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

        record._dirtyRelationships.add(property); // setting the inverse - hack this will only work with singularized relationships.


        setRelatedRecord(relatedRecord, record, recordType.slice(0, recordType.length - 1));
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
          return model.id.toString() === id.toString() && model.type === type;
        });
        if (referenceIndexToRemove >= 0) relationships[property].data.splice(referenceIndexToRemove, 1);

        var recordIndexToRemove = _this.findIndex(function (model) {
          return model.id.toString() === id.toString() && model.type === type;
        });

        if (recordIndexToRemove >= 0) _this.splice(recordIndexToRemove, 1);

        if (!relationships[property].data.length) {
          delete relationships[property];
        }

        if (!Object.keys(record.relationships).length) {
          delete record.relationships;
        }

        record._dirtyRelationships.add(property); // hack this will only work with singularized relationships.


        setRelatedRecord(relatedRecord, null, recordType.slice(0, recordType.length - 1));
      }

      return relatedRecord;
    };

    _this.replace = function (array) {
      var _assertThisInitialize3 = _assertThisInitialized(_this),
          record = _assertThisInitialize3.record,
          property = _assertThisInitialize3.property;

      var relationships = record.relationships;
      transaction(function () {
        relationships[property] = {
          data: []
        };
        array.forEach(function (object) {
          return _this.add(object);
        });

        record._dirtyRelationships.add(property);
      });
    };

    _this.property = _property;
    _this.record = _record;
    return _this;
  }
  /*
   * This method is used by Array internals to decide
   * which class to use for resulting derived objects from array manipulation methods
   * such as `map` or `filter`
   *
   * Without this, `RelatedRecordsArray.map` would return a `RelatedRecordsArray` instance
   * but such derived arrays should not maintain the behavior of the source `RelatedRecordsArray`
   *
   * For more details, see:
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/species
   */


  _createClass(RelatedRecordsArray, null, [{
    key: _Symbol$species,
    get: function get() {
      return Array;
    }
    /**
     * Adds a record to the array, and updates references in the store, as well as inverse references
     * @method add
     * @param {Object} relatedRecord the record to add to the array
     * @return {Object} the original relatedRecord
     */

  }]);

  return RelatedRecordsArray;
}(_wrapNativeSuper(Array));

export { Model, ObjectPromiseProxy, Store, attribute, relatedToMany, relatedToOne, validates };
