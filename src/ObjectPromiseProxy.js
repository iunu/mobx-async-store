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
exports.__esModule = true;
function ObjectPromiseProxy(promise, target) {
    var result = target.store.updateRecords(promise, target);
    // Define proxied attributes
    var attributeNames = Object.keys(target.attributeNames);
    var tempProperties = attributeNames.reduce(function (attrs, key) {
        attrs[key] = {
            value: target[key],
            writable: false
        };
        return attrs;
    }, {});
    Object.defineProperties(result, __assign({ isInFlight: { value: target.isInFlight } }, tempProperties));
    // Return promise
    return result;
}
exports["default"] = ObjectPromiseProxy;
