"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.deriveIdQueryStrings = exports.parseErrorPointer = exports.diff = exports.walk = exports.makeDate = exports.stringifyIds = exports.uniqueBy = exports.uniqueByReducer = exports.combineRacedRequests = exports.dbOrNewId = exports.newId = exports.requestUrl = exports.singularizeType = exports.URL_MAX_LENGTH = void 0;
var v1_1 = require("uuid/v1");
var QueryString_1 = require("./QueryString");
var pluralize_1 = require("pluralize");
var get_1 = require("lodash/get");
var flattenDeep_1 = require("lodash/flattenDeep");
var pending = {};
var counter = {};
exports.URL_MAX_LENGTH = 1024;
var incrementor = function (key) { return function () {
    var count = (counter[key] || 0) + 1;
    counter[key] = count;
    return count;
}; };
var decrementor = function (key) { return function () {
    var count = (counter[key] || 0) - 1;
    counter[key] = count;
    return count;
}; };
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
    endPart = pluralize_1["default"].singular(endPart);
    return __spreadArrays(typeParts, [endPart]).join('_');
}
exports.singularizeType = singularizeType;
/**
 * Build request url from base url, endpoint, query params, and ids.
 *
 * @method requestUrl
 * @return {String} formatted url string
 */
function requestUrl(baseUrl, endpoint, queryParams, id) {
    if (queryParams === void 0) { queryParams = {}; }
    var queryParamString = '';
    if (Object.keys(queryParams).length > 0) {
        queryParamString = "?" + QueryString_1["default"].stringify(queryParams);
    }
    var idForPath = '';
    if (id) {
        idForPath = "/" + id;
    }
    // Return full url
    return baseUrl + "/" + endpoint + idForPath + queryParamString;
}
exports.requestUrl = requestUrl;
function newId() {
    return "tmp-" + v1_1["default"]();
}
exports.newId = newId;
function dbOrNewId(properties) {
    return properties.id || newId();
}
exports.dbOrNewId = dbOrNewId;
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
    var decrementBlocked = decrementor(key);
    // keep track of the number of callers waiting for this promise to resolve
    incrementBlocked();
    function handleResponse(response) {
        var count = decrementBlocked();
        // if there are other callers waiting for this request to resolve, we should
        // clone the response before returning so that we can re-use it for the
        // remaining callers
        if (count > 0)
            return response.clone();
        // if there are no more callers waiting for this promise to resolve (i.e. if
        // this is the last one), we can remove the reference to the pending promise
        // allowing subsequent requests to proceed unblocked.
        delete pending[key];
        return response;
    }
    // Return pending promise if one already exists
    if (pending[key])
        return pending[key].then(handleResponse);
    // Otherwise call the method and on resolution
    // clear out the pending promise for the key
    pending[key] = fn.call();
    return pending[key].then(handleResponse);
}
exports.combineRacedRequests = combineRacedRequests;
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
        return accumulator.some(function (item) { return item[key] === current[key]; })
            ? accumulator
            : __spreadArrays(accumulator, [current]);
    };
}
exports.uniqueByReducer = uniqueByReducer;
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
exports.uniqueBy = uniqueBy;
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
exports.stringifyIds = stringifyIds;
/**
 * convert a value into a date, pass Date or Moment instances thru
 * untouched
 * @method makeDate
 * @param {*} value
 * @return {Date|Moment}
 */
function makeDate(value) {
    if (value instanceof Date || value._isAMomentObject)
        return value;
    return new Date(Date.parse(value));
}
exports.makeDate = makeDate;
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
    if (obj != null && typeof obj === 'object') {
        return Object.keys(obj).map(function (prop) {
            return walk(obj[prop], iteratee, [prefix, prop].filter(function (x) { return x; }).join('.'));
        });
    }
    return iteratee(obj, prefix);
}
exports.walk = walk;
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
function diff(a, b) {
    if (a === void 0) { a = {}; }
    if (b === void 0) { b = {}; }
    return flattenDeep_1["default"](walk(a, function (prevValue, path) {
        var currValue = get_1["default"](b, path);
        return prevValue === currValue ? undefined : path;
    }, null)).filter(function (x) { return x; });
}
exports.diff = diff;
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
function parseErrorPointer(error) {
    if (error === void 0) { error = {}; }
    var regex = /\/data\/(?<index>\d+)?\/?attributes\/(?<key>.*)$/;
    var match = get_1["default"](error, 'source.pointer', '').match(regex);
    var _a = (match === null || match === void 0 ? void 0 : match.groups) || {}, _b = _a.index, index = _b === void 0 ? 0 : _b, key = _a.key;
    return {
        index: parseInt(index),
        key: key === null || key === void 0 ? void 0 : key.replace(/\//g, '.')
    };
}
exports.parseErrorPointer = parseErrorPointer;
/**
 * Splits an array of ids into a series of strings that can be used to form
 * queries that conform to a max length of URL_MAX_LENGTH. This is to prevent 414 errors.
 * @method deriveIdQueryStrings
 * @param {Array} ids an array of ids that will be used in the string
 * @param {String} restOfUrl the additional text URL that will be passed to the server
 */
function deriveIdQueryStrings(ids, restOfUrl) {
    if (restOfUrl === void 0) { restOfUrl = ''; }
    var idLength = Math.max.apply(Math, ids.map(function (id) { return String(id).length; }));
    var maxLength = exports.URL_MAX_LENGTH - restOfUrl.length - encodeURIComponent('filter[ids]=,,').length;
    var encodedIds = encodeURIComponent(ids.join(','));
    if (encodedIds.length <= maxLength) {
        return [ids.join(',')];
    }
    var minLength = maxLength - idLength;
    var regexp = new RegExp(".{" + minLength + "," + maxLength + "}%2C", 'g');
    // the matches
    var matched = encodedIds.match(regexp);
    // everything that doesn't match, ie the last of the ids
    var tail = encodedIds.replace(regexp, '');
    // we manually strip the ',' at the end because javascript's non-capturing regex groups are hard to manage
    return __spreadArrays(matched, [tail]).map(decodeURIComponent).map(function (string) { return string.replace(/,$/, ''); });
}
exports.deriveIdQueryStrings = deriveIdQueryStrings;
