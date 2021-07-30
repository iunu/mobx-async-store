'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _asyncToGenerator = require('@babel/runtime/helpers/asyncToGenerator');
var _initializerDefineProperty = require('@babel/runtime/helpers/initializerDefineProperty');
var _classCallCheck = require('@babel/runtime/helpers/classCallCheck');
var _createClass = require('@babel/runtime/helpers/createClass');
var _defineProperty = require('@babel/runtime/helpers/defineProperty');
require('@babel/runtime/helpers/initializerWarningHelper');
var _applyDecoratedDescriptor = require('@babel/runtime/helpers/applyDecoratedDescriptor');
var _typeof = require('@babel/runtime/helpers/typeof');
var _regeneratorRuntime = require('@babel/runtime/regenerator');
var mobx = require('mobx');
var _inherits = require('@babel/runtime/helpers/inherits');
var _setPrototypeOf = require('@babel/runtime/helpers/setPrototypeOf');
var _toConsumableArray = require('@babel/runtime/helpers/toConsumableArray');
var uuid = require('uuid');
var qs = require('qs');
var pluralize = require('pluralize');
var dig = require('lodash/get');
var flattenDeep = require('lodash/flattenDeep');
var cloneDeep = require('lodash/cloneDeep');
var isEqual = require('lodash/isEqual');
var isObject = require('lodash/isObject');
var findLast = require('lodash/findLast');
var pick = require('lodash/pick');
var uniqBy = require('lodash/uniqBy');
var _assertThisInitialized = require('@babel/runtime/helpers/assertThisInitialized');
var _possibleConstructorReturn = require('@babel/runtime/helpers/possibleConstructorReturn');
var _getPrototypeOf = require('@babel/runtime/helpers/getPrototypeOf');
var _wrapNativeSuper = require('@babel/runtime/helpers/wrapNativeSuper');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _asyncToGenerator__default = /*#__PURE__*/_interopDefaultLegacy(_asyncToGenerator);
var _initializerDefineProperty__default = /*#__PURE__*/_interopDefaultLegacy(_initializerDefineProperty);
var _classCallCheck__default = /*#__PURE__*/_interopDefaultLegacy(_classCallCheck);
var _createClass__default = /*#__PURE__*/_interopDefaultLegacy(_createClass);
var _defineProperty__default = /*#__PURE__*/_interopDefaultLegacy(_defineProperty);
var _applyDecoratedDescriptor__default = /*#__PURE__*/_interopDefaultLegacy(_applyDecoratedDescriptor);
var _typeof__default = /*#__PURE__*/_interopDefaultLegacy(_typeof);
var _regeneratorRuntime__default = /*#__PURE__*/_interopDefaultLegacy(_regeneratorRuntime);
var _inherits__default = /*#__PURE__*/_interopDefaultLegacy(_inherits);
var _setPrototypeOf__default = /*#__PURE__*/_interopDefaultLegacy(_setPrototypeOf);
var _toConsumableArray__default = /*#__PURE__*/_interopDefaultLegacy(_toConsumableArray);
var qs__default = /*#__PURE__*/_interopDefaultLegacy(qs);
var pluralize__default = /*#__PURE__*/_interopDefaultLegacy(pluralize);
var dig__default = /*#__PURE__*/_interopDefaultLegacy(dig);
var flattenDeep__default = /*#__PURE__*/_interopDefaultLegacy(flattenDeep);
var cloneDeep__default = /*#__PURE__*/_interopDefaultLegacy(cloneDeep);
var isEqual__default = /*#__PURE__*/_interopDefaultLegacy(isEqual);
var isObject__default = /*#__PURE__*/_interopDefaultLegacy(isObject);
var findLast__default = /*#__PURE__*/_interopDefaultLegacy(findLast);
var pick__default = /*#__PURE__*/_interopDefaultLegacy(pick);
var uniqBy__default = /*#__PURE__*/_interopDefaultLegacy(uniqBy);
var _assertThisInitialized__default = /*#__PURE__*/_interopDefaultLegacy(_assertThisInitialized);
var _possibleConstructorReturn__default = /*#__PURE__*/_interopDefaultLegacy(_possibleConstructorReturn);
var _getPrototypeOf__default = /*#__PURE__*/_interopDefaultLegacy(_getPrototypeOf);
var _wrapNativeSuper__default = /*#__PURE__*/_interopDefaultLegacy(_wrapNativeSuper);

var QueryString = {
  parse: function parse(str) {
    return qs__default['default'].parse(str, {
      ignoreQueryPrefix: true
    });
  },
  stringify: function stringify(str) {
    return qs__default['default'].stringify(str, {
      arrayFormat: 'brackets'
    });
  }
};

function _wrapRegExp() { _wrapRegExp = function _wrapRegExp(re, groups) { return new BabelRegExp(re, undefined, groups); }; var _super = RegExp.prototype; var _groups = new WeakMap(); function BabelRegExp(re, flags, groups) { var _this = new RegExp(re, flags); _groups.set(_this, groups || _groups.get(re)); return _setPrototypeOf__default['default'](_this, BabelRegExp.prototype); } _inherits__default['default'](BabelRegExp, RegExp); BabelRegExp.prototype.exec = function (str) { var result = _super.exec.call(this, str); if (result) result.groups = buildGroups(result, this); return result; }; BabelRegExp.prototype[Symbol.replace] = function (str, substitution) { if (typeof substitution === "string") { var groups = _groups.get(this); return _super[Symbol.replace].call(this, str, substitution.replace(/\$<([^>]+)>/g, function (_, name) { return "$" + groups[name]; })); } else if (typeof substitution === "function") { var _this = this; return _super[Symbol.replace].call(this, str, function () { var args = arguments; if (_typeof__default['default'](args[args.length - 1]) !== "object") { args = [].slice.call(args); args.push(buildGroups(args, _this)); } return substitution.apply(this, args); }); } else { return _super[Symbol.replace].call(this, str, substitution); } }; function buildGroups(result, re) { var g = _groups.get(re); return Object.keys(g).reduce(function (groups, name) { groups[name] = result[g[name]]; return groups; }, Object.create(null)); } return _wrapRegExp.apply(this, arguments); }
var pending = {};
var counter = {};
var URL_MAX_LENGTH = 1024;
var ENCODED_COMMA = encodeURIComponent(',');

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
  endPart = pluralize__default['default'].singular(endPart);
  return [].concat(_toConsumableArray__default['default'](typeParts), [endPart]).join('_');
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
    queryParamString = "?".concat(QueryString.stringify(queryParams));
  }

  var idForPath = '';

  if (id) {
    idForPath = "/".concat(id);
  } // Return full url


  return "".concat(baseUrl, "/").concat(endpoint).concat(idForPath).concat(queryParamString);
}
function newId() {
  return "tmp-".concat(uuid.v1());
}
function idOrNewId(id) {
  return id || newId();
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
 * convert a value into a date, pass Date or Moment instances thru
 * untouched
 * @method makeDate
 * @param {*} value
 * @return {Date|Moment}
 */

function makeDate(value) {
  if (value instanceof Date || value._isAMomentObject) return value;
  return new Date(Date.parse(value));
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
  if (obj != null && _typeof__default['default'](obj) === 'object') {
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
  return flattenDeep__default['default'](walk(a, function (prevValue, path) {
    var currValue = dig__default['default'](b, path);
    return prevValue === currValue ? undefined : path;
  })).filter(function (x) {
    return x;
  });
}
/**
 * Parses the pointer of the error to retrieve the index of the
 * record the error belongs to and the full path to the attribute
 * which will serve as the key for the error.
 *
 * If there is no parsed index, then assume the payload was for
 * a single record and default to 0.
 *
 * ex.
 *   error = {
 *     detail: "Foo can't be blank",
 *     source: { pointer: '/data/1/attributes/options/foo' },
 *     title: 'Invalid foo'
 *   }
 *
 * parsePointer(error)
 * > {
 *     index: 1,
 *     key: 'options.foo'
 *   }
 *
 * @method parseErrorPointer
 * @param {Object} error
 * @return {Object} the matching parts of the pointer
 */

function parseErrorPointer() {
  var error = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var regex = /*#__PURE__*/_wrapRegExp(/\/data\/([0-9]+)?\/?attributes\/(.*)$/, {
    index: 1,
    key: 2
  });

  var match = dig__default['default'](error, 'source.pointer', '').match(regex);

  var _ref = (match === null || match === void 0 ? void 0 : match.groups) || {},
      _ref$index = _ref.index,
      index = _ref$index === void 0 ? 0 : _ref$index,
      key = _ref.key;

  return {
    index: parseInt(index),
    key: key === null || key === void 0 ? void 0 : key.replace(/\//g, '.')
  };
}
/**
 * Splits an array of ids into a series of strings that can be used to form
 * queries that conform to a max length of URL_MAX_LENGTH. This is to prevent 414 errors.
 * @method deriveIdQueryStrings
 * @param {Array} ids an array of ids that will be used in the string
 * @param {String} restOfUrl the additional text URL that will be passed to the server
 */

function deriveIdQueryStrings(ids) {
  var restOfUrl = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var maxLength = URL_MAX_LENGTH - restOfUrl.length - encodeURIComponent('filter[ids]=,,').length;
  ids = ids.map(String);
  var firstId = ids.shift();
  var encodedIds = ids.reduce(function (nestedArray, id) {
    var workingString = nestedArray[nestedArray.length - 1];
    var longerString = "".concat(workingString).concat(ENCODED_COMMA).concat(id);

    if (longerString.length < maxLength) {
      nestedArray[nestedArray.length - 1] = longerString;
    } else {
      nestedArray.push(id);
    }

    return nestedArray;
  }, [firstId]);
  return encodedIds.map(decodeURIComponent);
}

/**
 * Utility class used to store the schema
 * of model attribute definitions
 *
 * @class Schema
 */
var Schema = /*#__PURE__*/function () {
  function Schema() {
    _classCallCheck__default['default'](this, Schema);

    _defineProperty__default['default'](this, "structure", {});

    _defineProperty__default['default'](this, "relations", {});
  }

  _createClass__default['default'](Schema, [{
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

var _class$1, _descriptor$1;

function ownKeys$2(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$2(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$2(Object(source), true).forEach(function (key) { _defineProperty__default['default'](target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$2(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
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

    if (_typeof__default['default'](property) === 'object') {
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


var Model = (_class$1 = /*#__PURE__*/function () {
  /**
   * Initializer for model
   *
   * @method constructor
   */
  function Model() {
    var initialAttributes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck__default['default'](this, Model);

    _defineProperty__default['default'](this, "isInFlight", false);

    _initializerDefineProperty__default['default'](this, "errors", _descriptor$1, this);

    _defineProperty__default['default'](this, "_snapshots", []);

    mobx.makeObservable(this);
    var defaultAttributes = this.defaultAttributes;
    mobx.extendObservable(this, _objectSpread$2(_objectSpread$2({}, defaultAttributes), initialAttributes));

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


  _createClass__default['default'](Model, [{
    key: "isDirty",
    get: function get() {
      return this.dirtyAttributes.length > 0 || this.dirtyRelationships.length > 0;
    }
    /**
     * A list of any attribute paths which have been changed since the previous snapshot
     *
     * const todo = new Todo({ title: 'Buy Milk' })
     * todo.dirtyAttributes
     * => []
     * todo.title = 'Buy Cheese'
     * todo.dirtyAttributes
     * => ['title']
     * todo.options = { variety: 'Cheddar' }
     * todo.dirtyAttributes
     * => ['title', 'options.variety']
     *
     * @method dirtyAttributes
     * @return {Array} dirty attribute paths
     */

  }, {
    key: "dirtyAttributes",
    get: function get() {
      var _this2 = this;

      return Array.from(Object.keys(this.attributes).reduce(function (dirtyAccumulator, attr) {
        var currentValue = _this2.attributes[attr];
        var previousValue = _this2.previousSnapshot.attributes[attr];

        if (isObject__default['default'](currentValue)) {
          diff(currentValue, previousValue).forEach(function (property) {
            dirtyAccumulator.add("".concat(attr, ".").concat(property));
          });
        } else if (!isEqual__default['default'](previousValue, currentValue)) {
          dirtyAccumulator.add(attr);
        }

        return dirtyAccumulator;
      }, new Set()));
    }
    /**
     * A list of any relationship paths which have been changed since the previous snapshot
     * We check changes to both ids and types in case there are polymorphic relationships
     *
     * const todo = new Todo({ title: 'Buy Milk' })
     * todo.dirtyRelationships
     * => []
     * todo.note = note1
     * todo.dirtyRelationships
     * => ['relationships.note']
     *
     * @method dirtyRelationships
     * @return {Array} dirty relationship paths
     */

  }, {
    key: "dirtyRelationships",
    get: function get() {
      // TODO: make what returns from this.relationships to be more consistent
      var previousRelationships = this.previousSnapshot.relationships || {};
      var currentRelationships = this.relationships || {};
      var schemaRelationships = this.relationshipNames;

      if (Object.keys(currentRelationships).length === 0) {
        return Object.keys(previousRelationships);
      }

      return Array.from(schemaRelationships.reduce(function (dirtyAccumulator, name) {
        var _currentRelationships, _previousRelationship;

        var currentValues = ((_currentRelationships = currentRelationships[name]) === null || _currentRelationships === void 0 ? void 0 : _currentRelationships.data) || [];
        var previousValues = ((_previousRelationship = previousRelationships[name]) === null || _previousRelationship === void 0 ? void 0 : _previousRelationship.data) || [];
        var currentIds = Array.isArray(currentValues) ? currentValues.map(function (value) {
          return [value.id, value.type];
        }).sort() : [currentValues.id, currentValues.type];
        var previousIds = Array.isArray(previousValues) ? previousValues.map(function (value) {
          return [value.id, value.type];
        }).sort() : [previousValues.id, previousValues.type];

        if (!isEqual__default['default'](currentIds, previousIds)) {
          dirtyAccumulator.add(name);
        }

        return dirtyAccumulator;
      }, new Set()));
    }
    /**
     * Have any changes been made since this record was last persisted?
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
    key: "rollback",
    value:
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
    function rollback() {
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
      var _this3 = this;

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
      var body = JSON.stringify({
        data: this.jsonapi({
          relationships: relationships,
          attributes: attributes
        })
      });

      if (relationships) {
        relationships.forEach(function (rel) {
          if (Array.isArray(_this3[rel])) {
            _this3[rel].forEach(function (item, i) {
              if (item && item.isNew) {
                throw new Error("Invariant violated: tried to save a relationship to an unpersisted record: \"".concat(rel, "[").concat(i, "]\""));
              }
            });
          } else if (_this3[rel] && _this3[rel].isNew) {
            throw new Error("Invariant violated: tried to save a relationship to an unpersisted record: \"".concat(rel, "\""));
          }
        });
      }

      var response = this.store.fetch(url, {
        method: method,
        body: body
      });
      var result = this.store.updateRecords(response, this);
      return result;
    }
    /**
     * Replaces the record with the canonical version from the server.
     * @method reload
     * @return {Promise}
     * @param {Object} options
     */

  }, {
    key: "reload",
    value: function reload() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var constructor = this.constructor,
          id = this.id,
          isNew = this.isNew;

      if (isNew) {
        return this.rollback();
      } else {
        return this.store.fetchOne(constructor.type, id, options);
      }
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

      _this.errors = {};
      return promise.then( /*#__PURE__*/function () {
        var _ref = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee(response) {
          var json;
          return _regeneratorRuntime__default['default'].wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _this.isInFlight = false;

                  if (![200, 202, 204].includes(response.status)) {
                    _context.next = 17;
                    break;
                  }

                  if (!skipRemove) {
                    _this.store.remove(type, id);
                  }

                  _context.prev = 3;
                  _context.next = 6;
                  return response.json();

                case 6:
                  json = _context.sent;

                  if (json.data && json.data.attributes) {
                    mobx.runInAction(function () {
                      Object.keys(json.data.attributes).forEach(function (key) {
                        mobx.set(_this, key, json.data.attributes[key]);
                      });
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
                  mobx.runInAction(function () {
                    _this.errors = {
                      status: response.status
                    };
                  });
                  return _context.abrupt("return", _this);

                case 19:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, null, [[3, 10]]);
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
    key: "snapshot",
    get: function get() {
      return {
        attributes: this.attributes,
        relationships: mobx.toJS(this.relationships)
      };
    }
    /**
     * Sets previous snapshot to current snapshot
     *
     * @method setPreviousSnapshot
     */

  }, {
    key: "setPreviousSnapshot",
    value: function setPreviousSnapshot() {
      this._takeSnapshot();
    }
    /**
     * the latest snapshot
     *
     * @method previousSnapshot
     */

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
      return findLast__default['default'](this._snapshots, function (ss) {
        return ss.persisted;
      }) || this._snapshots[0];
    }
    /**
     * take a snapshot of the current model state.
     * if persisted, clear the stack and push this snapshot to the top
     * if not persisted, push this snapshot to the top of the stack
     * @method _takeSnapshot
     * @param {Object} options
     */

  }, {
    key: "_takeSnapshot",
    value: function _takeSnapshot() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var persisted = options.persisted || false;
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
      var _this4 = this;

      if (!snapshot) throw new Error('Invariant violated: tried to apply undefined snapshot');
      mobx.runInAction(function () {
        _this4.attributeNames.forEach(function (key) {
          _this4[key] = snapshot.attributes[key];
        });

        _this4.relationships = snapshot.relationships;
        _this4.errors = {};
      });
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
      var _this5 = this;

      return this.attributeNames.reduce(function (attributes, key) {
        var value = mobx.toJS(_this5[key]);

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
      return schema.structure[type] || {};
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
      return schema.relations[type] || {};
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
     * Getter to check if the record has errors.
     *
     * @method hasErrors
     * @return {Boolean}
     */

  }, {
    key: "errorForKey",
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
    /**
     * getter method to get data in api compliance format
     * TODO: Figure out how to handle unpersisted ids
     *
     * @method jsonapi
     * @return {Object} data in JSON::API format
     */

  }, {
    key: "jsonapi",
    value: function jsonapi() {
      var _this6 = this;

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
        var value = _this6[key];

        if (value) {
          var DataType = attributeDefinitions[key].dataType;
          var attr;

          if (DataType.name === 'Array' || DataType.name === 'Object') {
            attr = mobx.toJS(value);
          } else if (DataType.name === 'Date') {
            attr = makeDate(value).toISOString();
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
          rels[key] = mobx.toJS(_this6.relationships[key]);
          stringifyIds(rels[key]);
          return rels;
        }, {});
        data.relationships = relationships;
      }

      if (meta) {
        data.meta = meta;
      }

      if (String(id).match(/tmp/)) {
        delete data.id;
      }

      return data;
    }
  }, {
    key: "updateAttributes",
    value: function updateAttributes(attributes) {
      var _this7 = this;

      mobx.runInAction(function () {
        Object.keys(attributes).forEach(function (key) {
          _this7[key] = attributes[key];
        });
      });
    } // TODO: this shares a lot of functionality with Store.createOrUpdateModel
    // Perhaps that shared code

  }, {
    key: "updateAttributesFromResponse",
    value: function updateAttributesFromResponse(data, included) {
      var _this8 = this;

      var tmpId = this.id;
      var id = data.id,
          attributes = data.attributes,
          relationships = data.relationships;
      mobx.runInAction(function () {
        mobx.set(_this8, 'id', id);
        Object.keys(attributes).forEach(function (key) {
          mobx.set(_this8, key, attributes[key]);
        });

        if (relationships) {
          Object.keys(relationships).forEach(function (key) {
            if (!Object.prototype.hasOwnProperty.call(relationships[key], 'meta')) {
              // todo: throw error if relationship is not defined in model
              mobx.set(_this8.relationships, key, relationships[key]);
            }
          });
        }

        if (included) {
          _this8.store.createModelsFromData(included);
        }
      }); // Update target isInFlight

      this.isInFlight = false;

      this._takeSnapshot({
        persisted: true
      });

      mobx.runInAction(function () {
        // NOTE: This resolves an issue where a record is persisted but the
        // index key is still a temp uuid. We can't simply remove the temp
        // key because there may be associated records that have the temp
        // uuid id as its only reference to the newly persisted record.
        // TODO: Figure out a way to update associated records to use the
        // newly persisted id.
        _this8.store.data[_this8.type].records.set(String(tmpId), _this8);

        _this8.store.data[_this8.type].records.set(String(_this8.id), _this8);
      });
    }
  }, {
    key: "clone",
    value: function clone() {
      var attributes = cloneDeep__default['default'](this.snapshot.attributes);
      var relationships = cloneDeep__default['default'](this.snapshot.relationships);
      return this.store.createModel(this.type, this.id, {
        attributes: attributes,
        relationships: relationships
      });
    }
    /**
     * Comparison by identity
     * returns `true` if this object has the same type and id as the
     * "other" object, ignores differences in attrs and relationships
     *
     * @method isSame
     * @param {Object} other
     * @return {Object}
     */

  }, {
    key: "isSame",
    value: function isSame(other) {
      if (!other) return false;
      return this.type === other.type && this.id === other.id;
    }
  }]);

  return Model;
}(), (_applyDecoratedDescriptor__default['default'](_class$1.prototype, "isNew", [mobx.computed], Object.getOwnPropertyDescriptor(_class$1.prototype, "isNew"), _class$1.prototype), _descriptor$1 = _applyDecoratedDescriptor__default['default'](_class$1.prototype, "errors", [mobx.observable], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return {};
  }
})), _class$1);

var _class, _descriptor, _descriptor2, _descriptor3, _descriptor4;

function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$1(Object(source), true).forEach(function (key) { _defineProperty__default['default'](target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$1(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
/**
 * Defines the Artemis Data Store class.
 *
 * @class Store
 * @constructor
 */

var Store = (_class = /*#__PURE__*/function () {
  /**
   * Observable property used to store data and
   * handle changes to state
   *
   * @property data
   * @type {Object}
   * @default {}
   */

  /**
   * Observable property used to store values for most recent response headers
   * according to settings specified as `headersOfInterest`
   *
   * @property lastResponseHeaders
   * @type {Object}
   * @default {}
   */

  /**
   * Map(key: queryTag, value: Set([{ url, type, queryParams, queryTag }]))
   * @property loadingStates
   * @type {Map}
   */

  /**
   * Initializer for Store class
   *
   * @method constructor
   */
  function Store(_options) {
    var _this = this;

    _classCallCheck__default['default'](this, Store);

    _initializerDefineProperty__default['default'](this, "data", _descriptor, this);

    _initializerDefineProperty__default['default'](this, "lastResponseHeaders", _descriptor2, this);

    _defineProperty__default['default'](this, "loadingStates", mobx.observable.map());

    _defineProperty__default['default'](this, "genericErrorMessage", 'Something went wrong.');

    _defineProperty__default['default'](this, "add", function (type, data) {
      if (data.constructor.name === 'Array') {
        return _this.addModels(type, data);
      } else {
        return _this.addModel(type, mobx.toJS(data));
      }
    });

    _defineProperty__default['default'](this, "pickAttributes", function (properties, type) {
      var attributeNames = Object.keys(_this.schema.structure[type]);
      return pick__default['default'](properties, attributeNames);
    });

    _defineProperty__default['default'](this, "pickRelationships", function (properties, type) {
      var relationshipNames = Object.keys(_this.schema.relations[type] || {});
      var allRelationships = pick__default['default'](properties, relationshipNames);
      return Object.keys(allRelationships).reduce(function (references, key) {
        var relatedModel = allRelationships[key];
        var data;

        if (Array.isArray(relatedModel)) {
          data = relatedModel.map(function (model) {
            return {
              id: model.id,
              type: model.type
            };
          });
        } else {
          data = {
            id: relatedModel.id,
            type: relatedModel.type
          };
        }

        references[key] = {
          data: data
        };
        return references;
      }, {});
    });

    _defineProperty__default['default'](this, "build", function (type, properties) {
      var id = idOrNewId(properties.id);

      var attributes = _this.pickAttributes(properties, type);

      var model = _this.createModel(type, id, {
        attributes: attributes
      });

      return model;
    });

    _initializerDefineProperty__default['default'](this, "addModel", _descriptor3, this);

    _defineProperty__default['default'](this, "addModels", function (type, data) {
      return mobx.runInAction(function () {
        return data.map(function (obj) {
          return _this.addModel(type, obj);
        });
      });
    });

    _defineProperty__default['default'](this, "bulkSave", /*#__PURE__*/function () {
      var _ref = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee(type, records) {
        var options,
            queryParams,
            extensions,
            url,
            recordAttributes,
            body,
            extensionStr,
            response,
            _args = arguments;
        return _regeneratorRuntime__default['default'].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                options = _args.length > 2 && _args[2] !== undefined ? _args[2] : {};
                queryParams = options.queryParams, extensions = options.extensions; // get url for record type

                url = _this.fetchUrl(type, queryParams, null); // convert records to an appropriate jsonapi attribute/relationship format

                recordAttributes = records.map(function (record) {
                  return record.jsonapi(options);
                }); // build a data payload

                body = JSON.stringify({
                  data: recordAttributes
                }); // build the json api extension string

                extensionStr = extensions !== null && extensions !== void 0 && extensions.length ? "ext=\"bulk,".concat(extensions.join(), "\"") : 'ext="bulk"'; // send request

                response = _this.fetch(url, {
                  headers: _objectSpread$1(_objectSpread$1({}, _this.defaultFetchOptions.headers), {}, {
                    'Content-Type': "application/vnd.api+json; ".concat(extensionStr)
                  }),
                  method: 'POST',
                  body: body
                }); // update records based on response

                return _context.abrupt("return", _this.updateRecords(response, records));

              case 8:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x2, _x3) {
        return _ref.apply(this, arguments);
      };
    }());

    _initializerDefineProperty__default['default'](this, "remove", _descriptor4, this);

    _defineProperty__default['default'](this, "getOne", function (type, id) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      if (!id) {
        console.error("No id given while calling 'getOne' on ".concat(type));
        return;
      }

      var queryParams = options.queryParams;

      if (queryParams) {
        return _this.getCachedRecord(type, id, queryParams);
      } else {
        return _this.getRecord(type, id);
      }
    });

    _defineProperty__default['default'](this, "findOne", function (type, id) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      if (!id) {
        console.error("No id given while calling 'findOne' on ".concat(type));
        return;
      }

      var record = _this.getOne(type, id, options);

      if (record !== null && record !== void 0 && record.id) {
        return record;
      } else {
        return _this.fetchOne(type, id, options);
      }
    });

    _defineProperty__default['default'](this, "getMany", function (type, ids) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var idsToQuery = ids.slice().map(String);

      var records = _this.getAll(type, options);

      return records.filter(function (record) {
        return idsToQuery.includes(record.id);
      });
    });

    _defineProperty__default['default'](this, "fetchMany", function (type, ids) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var idsToQuery = ids.slice().map(String);
      var _options$queryParams = options.queryParams,
          queryParams = _options$queryParams === void 0 ? {} : _options$queryParams,
          queryTag = options.queryTag;
      queryParams.filter = queryParams.filter || {};

      var baseUrl = _this.fetchUrl(type, queryParams);

      var idQueries = deriveIdQueryStrings(idsToQuery, baseUrl);
      var queries = idQueries.map(function (queryIds) {
        queryParams.filter.ids = queryIds;
        return _this.fetchAll(type, {
          queryParams: queryParams,
          queryTag: queryTag
        });
      });
      return Promise.all(queries).then(function (records) {
        var _ref2;

        return (_ref2 = []).concat.apply(_ref2, _toConsumableArray__default['default'](records));
      }).catch(function (err) {
        return Promise.reject(err);
      });
    });

    _defineProperty__default['default'](this, "findMany", function (type, ids) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var idsToQuery = ids.slice().map(String);

      var recordsInStore = _this.getAll(type, options).filter(function (record) {
        return idsToQuery.includes(String(record.id));
      });

      if (recordsInStore.length === idsToQuery.length) {
        return recordsInStore;
      }

      var recordIdsInStore = recordsInStore.map(function (_ref3) {
        var id = _ref3.id;
        return String(id);
      });
      idsToQuery = idsToQuery.filter(function (id) {
        return !recordIdsInStore.includes(id);
      });
      var _options$queryParams2 = options.queryParams,
          queryParams = _options$queryParams2 === void 0 ? {} : _options$queryParams2,
          queryTag = options.queryTag;
      queryParams.filter = queryParams.filter || {};

      var baseUrl = _this.fetchUrl(type, queryParams);

      var idQueries = deriveIdQueryStrings(idsToQuery, baseUrl);
      var query = Promise.all(idQueries.map(function (queryIds) {
        queryParams.filter.ids = queryIds;
        return _this.fetchAll(type, {
          queryParams: queryParams,
          queryTag: queryTag
        });
      }));
      return query.then(function (recordsFromServer) {
        return recordsInStore.concat.apply(recordsInStore, _toConsumableArray__default['default'](recordsFromServer));
      });
    });

    _defineProperty__default['default'](this, "getAll", function (type) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var queryParams = options.queryParams;

      if (queryParams) {
        return _this.getCachedRecords(type, queryParams);
      } else {
        return _this.getRecords(type);
      }
    });

    _defineProperty__default['default'](this, "setLoadingState", function (_ref4) {
      var url = _ref4.url,
          type = _ref4.type,
          queryParams = _ref4.queryParams,
          queryTag = _ref4.queryTag;
      queryTag = queryTag || type;
      var loadingStateInfo = {
        url: url,
        type: type,
        queryParams: queryParams,
        queryTag: queryTag
      };

      var querySet = _this.loadingStates.get(queryTag);

      if (!querySet) {
        querySet = mobx.observable.set([], {
          deep: false
        });

        _this.loadingStates.set(queryTag, querySet);
      }

      querySet.add(loadingStateInfo);
      return loadingStateInfo;
    });

    _defineProperty__default['default'](this, "deleteLoadingState", function (state) {
      var querySet = _this.loadingStates.get(state.queryTag);

      querySet.delete(state);

      if (querySet.size === 0) {
        _this.loadingStates.delete(state.queryTag);
      }
    });

    _defineProperty__default['default'](this, "fetchAll", /*#__PURE__*/function () {
      var _ref5 = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee2(type) {
        var options,
            queryParams,
            url,
            state,
            response,
            json,
            records,
            _args2 = arguments;
        return _regeneratorRuntime__default['default'].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                options = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : {};
                queryParams = options.queryParams;
                url = _this.fetchUrl(type, queryParams);
                state = _this.setLoadingState(_objectSpread$1(_objectSpread$1({}, options), {}, {
                  type: type,
                  url: url
                }));
                _context2.next = 6;
                return _this.fetch(url, {
                  method: 'GET'
                });

              case 6:
                response = _context2.sent;

                if (!(response.status === 200)) {
                  _context2.next = 18;
                  break;
                }

                _this.data[type].cache.set(url, []);

                _context2.next = 11;
                return response.json();

              case 11:
                json = _context2.sent;

                if (json.included) {
                  _this.createModelsFromData(json.included);
                }

                records = mobx.runInAction(function () {
                  return json.data.map(function (dataObject) {
                    var id = dataObject.id,
                        _dataObject$attribute = dataObject.attributes,
                        attributes = _dataObject$attribute === void 0 ? {} : _dataObject$attribute,
                        _dataObject$relations = dataObject.relationships,
                        relationships = _dataObject$relations === void 0 ? {} : _dataObject$relations;

                    var record = _this.createModel(type, id, {
                      attributes: attributes,
                      relationships: relationships
                    });

                    var cachedIds = _this.data[type].cache.get(url);

                    _this.data[type].cache.set(url, [].concat(_toConsumableArray__default['default'](cachedIds), [id]));

                    _this.data[type].records.set(String(id), record);

                    return record;
                  });
                });

                _this.deleteLoadingState(state);

                return _context2.abrupt("return", records);

              case 18:
                _this.deleteLoadingState(state);

                return _context2.abrupt("return", Promise.reject(response.status));

              case 20:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      return function (_x4) {
        return _ref5.apply(this, arguments);
      };
    }());

    _defineProperty__default['default'](this, "findAll", function (type) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var records = _this.getAll(type, options);

      if (records.length > 0) {
        return records;
      } else {
        return _this.fetchAll(type, options);
      }
    });

    mobx.makeObservable(this);
    this.init(_options);
    this.schema = schema;
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


  _createClass__default['default'](Store, [{
    key: "fetchOne",
    value:
    /**
     * Fetches record by `id` from the server and returns a Promise.
     *
     * @async
     * @method fetchOne
     * @param {String} type the record type to fetch
     * @param {String} id the id of the record to fetch
     * @param {Object} options { queryParams }
     * @return {Object} record
     */
    function () {
      var _fetchOne = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee3(type, id) {
        var options,
            queryParams,
            url,
            state,
            response,
            json,
            data,
            included,
            record,
            _args3 = arguments;
        return _regeneratorRuntime__default['default'].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                options = _args3.length > 2 && _args3[2] !== undefined ? _args3[2] : {};

                if (id) {
                  _context3.next = 4;
                  break;
                }

                console.error("No id given while calling 'fetchOne' on ".concat(type));
                return _context3.abrupt("return");

              case 4:
                queryParams = options.queryParams;
                url = this.fetchUrl(type, queryParams, id);
                state = this.setLoadingState(_objectSpread$1(_objectSpread$1({}, options), {}, {
                  type: type,
                  id: id,
                  url: url
                }));
                _context3.next = 9;
                return this.fetch(url, {
                  method: 'GET'
                });

              case 9:
                response = _context3.sent;

                if (!(response.status === 200)) {
                  _context3.next = 22;
                  break;
                }

                _context3.next = 13;
                return response.json();

              case 13:
                json = _context3.sent;
                data = json.data, included = json.included;

                if (included) {
                  this.createModelsFromData(included);
                }

                record = this.createOrUpdateModel(data);
                this.data[type].cache.set(url, [record.id]);
                this.deleteLoadingState(state);
                return _context3.abrupt("return", record);

              case 22:
                // TODO: return Promise.reject(response.status)
                this.deleteLoadingState(state);
                return _context3.abrupt("return", null);

              case 24:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function fetchOne(_x5, _x6) {
        return _fetchOne.apply(this, arguments);
      }

      return fetchOne;
    }()
    /**
     * Finds a record by `id`.
     * If available in the store, it returns that record. Otherwise, it fetches the record from the server.
     *
     *   store.findOne('todos', 5)
     *   // fetch triggered
     *   => event1
     *   store.findOne('todos', 5)
     *   // no fetch triggered
     *   => event1
     *
     * @method findOne
     * @param {String} type the type to find
     * @param {String} id the id of the record to find
     * @param {Object} options { queryParams }
     * @return {Promise||Object} // TODO: make this always return a Promise
     */

  }, {
    key: "fetchUrl",
    value:
    /**
     * Builds fetch url based
     *
     * @method fetchUrl
     * @param {String} type the type to find
     * @param {Object} options
     */
    function fetchUrl(type, queryParams, id, options) {
      var baseUrl = this.baseUrl,
          modelTypeIndex = this.modelTypeIndex;
      var endpoint = modelTypeIndex[type].endpoint;
      return requestUrl(baseUrl, endpoint, queryParams, id, options);
    }
    /**
     * Gets all records with the given `type` from the store. This will never fetch from the server.
     *
     * @method getAll
     * @param {String} type the type to find
     * @param {Object} options
     * @return {Array} array of records
     */

  }, {
    key: "reset",
    value:
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
    function reset(type) {
      if (type) {
        this.data[type] = {
          records: mobx.observable.map({}),
          cache: mobx.observable.map({})
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
      this.headersOfInterest = options.headersOfInterest || [];
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
          records: mobx.observable.map({}),
          cache: mobx.observable.map({})
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
      var _this3 = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var defaultFetchOptions = this.defaultFetchOptions,
          headersOfInterest = this.headersOfInterest;

      var fetchOptions = _objectSpread$1(_objectSpread$1({}, defaultFetchOptions), options);

      var key = JSON.stringify({
        url: url,
        fetchOptions: fetchOptions
      });
      return combineRacedRequests(key, function () {
        return fetch(url, _objectSpread$1(_objectSpread$1({}, defaultFetchOptions), options));
      }).then(function (response) {
        // Capture headers of interest
        if (headersOfInterest) {
          mobx.runInAction(function () {
            headersOfInterest.forEach(function (header) {
              var value = response.headers.get(header); // Only set if it has changed, to minimize observable changes

              if (_this3.lastResponseHeaders[header] !== value) _this3.lastResponseHeaders[header] = value;
            });
          });
        }

        return response;
      });
    }
    /**
     * Gets type of collection from data observable
     *
     * @method getType
     * @param {String} type
     * @return {Object} observable type object structure
     */
    )
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
      if (!this.getType(type)) {
        throw new Error("Could not find a collection for type '".concat(type, "'"));
      }

      var record = this.getType(type).records.get(String(id));
      if (!record || record === 'undefined') return;
      return record;
    }
    /**
     * Gets records for type of collection from observable
     *
     * NOTE: We only return records by unique id, this handles a scenario
     * where the store keeps around a reference to a newly persisted record by its temp uuid.
     * We can't simply remove the temp uuid reference because other
     * related models may be still using the temp uuid in their relationships
     * data object. However, when we are listing out records we want them
     * to be unique by the persisted id (which is updated after a Model.save)
     *
     * @method getRecords
     * @param {String} type
     * @return {Array} array of objects
     */

  }, {
    key: "getRecords",
    value: function getRecords(type) {
      var records = Array.from(this.getType(type).records.values()).filter(function (value) {
        return value && value !== 'undefined';
      });
      return uniqBy__default['default'](records, 'id');
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
     * Gets single from store based on cached query
     *
     * @method getCachedRecord
     * @param {String} type
     * @param id
     * @param {Object} queryParams
     * @return {Object} record
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
     * @param {String} type type of records to get
     * @param {Object} queryParams
     * @param {String} id optional param if only getting 1 cached record by id
     * @return {Array} array of records
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
      var ids = this.getType(type).cache.get(url);
      if (!ids) return [];
      var idsSet = new Set(mobx.toJS(ids));
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

  }, {
    key: "getCachedId",
    value: function getCachedId(type, id) {
      return this.getType(type).cache.get(String(id));
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
          mobx.set(record, key, attributes[key]);
        }); // If relationships are present, update relationships
        // TODO: relationships will always be truthy since we've defined a default above.

        if (relationships) {
          Object.keys(relationships).forEach(function (key) {
            // Don't try to create relationship if meta included false
            if (!relationships[key].meta) {
              // defensive against existingRecord.relationships being undefined
              mobx.set(record, 'relationships', _objectSpread$1(_objectSpread$1({}, record.relationships), {}, _defineProperty__default['default']({}, key, relationships[key])));
            }
          });
        }

        record._takeSnapshot({
          persisted: true
        });
      } else {
        record = this.createModel(type, id, {
          attributes: attributes,
          relationships: relationships
        });
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

  }, {
    key: "createModelsFromData",
    value: function createModelsFromData(data) {
      var _this5 = this;

      return mobx.runInAction(function () {
        return data.map(function (dataObject) {
          // Only build objects for which we have a type defined.
          // And ignore silently anything else included in the JSON response.
          // TODO: Put some console message in development mode
          if (_this5.getType(dataObject.type)) {
            return _this5.createOrUpdateModel(dataObject);
          } else {
            console.warn("no type defined for ".concat(dataObject.type));
            return null;
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

      return new ModelKlass(_objectSpread$1({
        id: id,
        store: store,
        relationships: relationships
      }, attributes));
    }
    /**
     * Defines a resolution for an API call that will update a record or
     * set of records with the data returned from the API
     *
     * @method updateRecords
     * @param {Promise} a request to the API
     * @param {Model|Array} records to be updated
     */

  }, {
    key: "updateRecords",
    value: function updateRecords(promise, records) {
      var _this6 = this;

      // records may be a single record, if so wrap it in an array to make
      // iteration simpler
      var recordsArray = Array.isArray(records) ? records : [records];
      recordsArray.forEach(function (record) {
        record.isInFlight = true;
      });
      return promise.then( /*#__PURE__*/function () {
        var _ref6 = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee4(response) {
          var status, json, data, included, _json, errorString;

          return _regeneratorRuntime__default['default'].wrap(function _callee4$(_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  status = response.status;
                  recordsArray.forEach(function (record) {
                    record.isInFlight = false;
                  });

                  if (!(status === 200 || status === 201)) {
                    _context4.next = 15;
                    break;
                  }

                  _context4.next = 5;
                  return response.json();

                case 5:
                  json = _context4.sent;
                  data = Array.isArray(json.data) ? json.data : [json.data];
                  included = json.included;

                  if (!(data.length !== recordsArray.length)) {
                    _context4.next = 10;
                    break;
                  }

                  throw new Error('Invariant violated: API response data and records to update do not match');

                case 10:
                  data.forEach(function (targetData, index) {
                    recordsArray[index].updateAttributesFromResponse(targetData, included);
                  });

                  if (json.included) {
                    _this6.createModelsFromData(json.included);
                  } // on success, return the original record(s).
                  // again - this may be a single record so preserve the structure


                  return _context4.abrupt("return", records);

                case 15:
                  _json = {};
                  _context4.prev = 16;
                  _context4.next = 19;
                  return response.json();

                case 19:
                  _json = _context4.sent;
                  _context4.next = 25;
                  break;

                case 22:
                  _context4.prev = 22;
                  _context4.t0 = _context4["catch"](16);
                  return _context4.abrupt("return", Promise.reject(new Error(_this6.genericErrorMessage)));

                case 25:
                  if (_json.errors) {
                    _context4.next = 27;
                    break;
                  }

                  return _context4.abrupt("return", Promise.reject(new Error(_this6.genericErrorMessage)));

                case 27:
                  if (Array.isArray(_json.errors)) {
                    _context4.next = 29;
                    break;
                  }

                  return _context4.abrupt("return", Promise.reject(new TypeError('Top level errors in response are not an array.')));

                case 29:
                  mobx.runInAction(function () {
                    _json.errors.forEach(function (error) {
                      var _parseErrorPointer = parseErrorPointer(error),
                          index = _parseErrorPointer.index,
                          key = _parseErrorPointer.key;

                      if (key != null) {
                        var errors = recordsArray[index].errors[key] || [];
                        errors.push(error);
                        recordsArray[index].errors[key] = errors;
                      }
                    });

                    errorString = recordsArray.map(function (record) {
                      return JSON.stringify(record.errors);
                    }).join(';');
                  });
                  return _context4.abrupt("return", Promise.reject(new Error(errorString)));

                case 31:
                case "end":
                  return _context4.stop();
              }
            }
          }, _callee4, null, [[16, 22]]);
        }));

        return function (_x7) {
          return _ref6.apply(this, arguments);
        };
      }(), function (error) {
        // TODO: Handle error states correctly, including handling errors for multiple targets
        recordsArray.forEach(function (record) {
          record.isInFlight = false;
        });
        recordsArray[0].errors = error;
        throw error;
      });
    }
  }]);

  return Store;
}(), (_descriptor = _applyDecoratedDescriptor__default['default'](_class.prototype, "data", [mobx.observable], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return {};
  }
}), _descriptor2 = _applyDecoratedDescriptor__default['default'](_class.prototype, "lastResponseHeaders", [mobx.observable], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return {};
  }
}), _descriptor3 = _applyDecoratedDescriptor__default['default'](_class.prototype, "addModel", [mobx.action], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this7 = this;

    return function (type, properties) {
      var id = idOrNewId(properties.id);

      var attributes = _this7.pickAttributes(properties, type);

      var relationships = _this7.pickRelationships(properties, type);

      var model = _this7.createModel(type, id, {
        attributes: attributes,
        relationships: relationships
      }); // Add the model to the type records index


      _this7.data[type].records.set(String(model.id), model);

      return model;
    };
  }
}), _descriptor4 = _applyDecoratedDescriptor__default['default'](_class.prototype, "remove", [mobx.action], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this8 = this;

    return function (type, id) {
      _this8.data[type].records.delete(String(id));
    };
  }
}), _applyDecoratedDescriptor__default['default'](_class.prototype, "initializeObservableDataProperty", [mobx.action], Object.getOwnPropertyDescriptor(_class.prototype, "initializeObservableDataProperty"), _class.prototype)), _class);

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
      return makeDate(value);
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
 *   @attribute(Date) start_time = new Date()
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

var _Symbol$species;

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf__default['default'](Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf__default['default'](this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn__default['default'](this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty__default['default'](target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
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
/**
 * Syntactic sugar of relatedToMany relationship. Basically
 * everything the same except it only returns a single record.
 *
 * @method relatedToOne
 */

function relatedToOne(targetOrModelKlass, property, descriptor) {
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
  var relationships = record.relationships,
      cachedRelationships = record.cachedRelationships;
  var relationType = modelType || property;
  var references = relationships && relationships[relationType];

  if (!references || !references.data) {
    references = cachedRelationships && cachedRelationships[relationType];
  }

  var relatedRecords = []; // NOTE: If the record doesn't have a matching references for the relation type
  // fall back to looking up records by a foreign id i.e record.related_record_id

  if (references && references.data) {
    // Ignore any records of unknown types
    relatedRecords = references.data.filter(function (ref) {
      return record.store.getType(ref.type);
    }).map(function (ref) {
      var recordType = ref.type;
      return record.store.getRecord(recordType, ref.id);
    });
  } else {
    var foreignReferenceName = singularizeType(record.type);
    var foreignId = "".concat(foreignReferenceName, "_id");

    if (record.store.getType(relationType)) {
      var _allRecords$, _allRecords$$relation, _allRecords$$relation2, _allRecords$2;

      var allRecords = record.store.getRecords(relationType);

      if (allRecords !== null && allRecords !== void 0 && (_allRecords$ = allRecords[0]) !== null && _allRecords$ !== void 0 && (_allRecords$$relation = _allRecords$.relationships) !== null && _allRecords$$relation !== void 0 && (_allRecords$$relation2 = _allRecords$$relation[foreignReferenceName]) !== null && _allRecords$$relation2 !== void 0 && _allRecords$$relation2.data) {
        relatedRecords = allRecords.filter(function (rel) {
          var _rel$relationships$fo, _rel$relationships$fo2;

          return String((_rel$relationships$fo = rel.relationships[foreignReferenceName]) === null || _rel$relationships$fo === void 0 ? void 0 : (_rel$relationships$fo2 = _rel$relationships$fo.data) === null || _rel$relationships$fo2 === void 0 ? void 0 : _rel$relationships$fo2.id) === String(record.id);
        });
      } else if (allRecords !== null && allRecords !== void 0 && (_allRecords$2 = allRecords[0]) !== null && _allRecords$2 !== void 0 && _allRecords$2[foreignId]) {
        console.warn("Support for including non-canonical jsonapi references will be removed in future versions. Record type: ".concat(record.type, ". Relation: ").concat(relationType, ". Reference: ").concat(foreignId, "."));
        relatedRecords = allRecords.filter(function (rel) {
          return String(rel[foreignId]) === String(record.id);
        });
      }
    }

    record.cachedRelationships = _objectSpread(_objectSpread({}, cachedRelationships), {}, _defineProperty__default['default']({}, relationType, {
      data: relatedRecords.map(function (r) {
        return {
          type: r.type,
          id: r.id
        };
      })
    }));
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
var RelatedRecordsArray = /*#__PURE__*/function (_Array) {
  _inherits__default['default'](RelatedRecordsArray, _Array);

  var _super = _createSuper(RelatedRecordsArray);

  function RelatedRecordsArray(_array, _record, _property) {
    var _this;

    _classCallCheck__default['default'](this, RelatedRecordsArray);

    _this = _super.call.apply(_super, [this].concat(_toConsumableArray__default['default'](_array)));

    _defineProperty__default['default'](_assertThisInitialized__default['default'](_this), "add", function (relatedRecord) {
      var _assertThisInitialize = _assertThisInitialized__default['default'](_this),
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


        setRelatedRecord(relatedRecord, record, recordType.slice(0, recordType.length - 1));
      }

      return relatedRecord;
    });

    _defineProperty__default['default'](_assertThisInitialized__default['default'](_this), "remove", function (relatedRecord) {
      var _assertThisInitialize2 = _assertThisInitialized__default['default'](_this),
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

        if (referenceIndexToRemove >= 0) {
          relationships[property].data.splice(referenceIndexToRemove, 1);
        }

        var recordIndexToRemove = _this.findIndex(function (model) {
          return (model === null || model === void 0 ? void 0 : model.id.toString()) === id.toString() && model.type === type;
        });

        if (recordIndexToRemove >= 0) _this.splice(recordIndexToRemove, 1);

        if (!relationships[property].data.length) {
          delete relationships[property];
        } // hack this will only work with singularized relationships.


        setRelatedRecord(relatedRecord, null, recordType.slice(0, recordType.length - 1));
      }

      return relatedRecord;
    });

    _defineProperty__default['default'](_assertThisInitialized__default['default'](_this), "replace", function (array) {
      var _assertThisInitialize3 = _assertThisInitialized__default['default'](_this),
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
    });

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


  _createClass__default['default'](RelatedRecordsArray, null, [{
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
}( /*#__PURE__*/_wrapNativeSuper__default['default'](Array));

exports.Model = Model;
exports.QueryString = QueryString;
exports.Store = Store;
exports.attribute = attribute;
exports.relatedToMany = relatedToMany;
exports.relatedToOne = relatedToOne;
exports.validates = validates;
