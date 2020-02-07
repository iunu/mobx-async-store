"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var v1_1 = require("uuid/v1");
var jquery_param_1 = require("jquery-param");
var pluralize_1 = require("pluralize");
var pending = {};
var counter = {};
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
    endPart = pluralize_1.default.singular(endPart);
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
        queryParamString = "?" + jquery_param_1.default(queryParams);
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
    return "tmp-" + v1_1.default();
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
function walk(value, iteratee, prop, path) {
    if (value != null && typeof value === 'object') {
        return Object.keys(value).map(function (prop) {
            return walk(value[prop], iteratee, prop, [path, prop].filter(function (x) { return x; }).join('.'));
        });
    }
    return iteratee(value, path);
}
exports.walk = walk;
