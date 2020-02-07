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
Object.defineProperty(exports, "__esModule", { value: true });
var mobx_1 = require("mobx");
function ObjectPromiseProxy(promise, target) {
    target.isInFlight = true;
    var tmpId = target.id;
    var result = promise.then(function (response) {
        return __awaiter(this, void 0, void 0, function () {
            var status, json_1, _a, attributes_1, relationships_1, message, json, error_1, errorString;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        status = response.status;
                        if (!(status === 200 || status === 201)) return [3 /*break*/, 2];
                        return [4 /*yield*/, response.json()
                            // Update target model
                        ];
                    case 1:
                        json_1 = _b.sent();
                        _a = json_1.data, attributes_1 = _a.attributes, relationships_1 = _a.relationships;
                        mobx_1.transaction(function () {
                            Object.keys(attributes_1).forEach(function (key) {
                                mobx_1.set(target, key, attributes_1[key]);
                            });
                            if (relationships_1) {
                                Object.keys(relationships_1).forEach(function (key) {
                                    if (!relationships_1[key].hasOwnProperty('meta')) {
                                        // todo: throw error if relationship is not defined in model
                                        mobx_1.set(target.relationships, key, relationships_1[key]);
                                    }
                                });
                            }
                            if (json_1.included) {
                                target.store.createModelsFromData(json_1.included);
                            }
                        });
                        // Update target isInFlight
                        target.isInFlight = false;
                        target.setPreviousSnapshot();
                        mobx_1.transaction(function () {
                            // NOTE: This resolves an issue where a record is persisted but the
                            // index key is still a temp uuid. We can't simply remove the temp
                            // key because there may be associated records that have the temp
                            // uuid id as its only reference to the newly persisted record.
                            // TODO: Figure out a way to update associated records to use the
                            // newly persisted id.
                            target.store.data[target.type].records[tmpId] = target;
                            target.store.data[target.type].records[target.id] = target;
                        });
                        return [2 /*return*/, target];
                    case 2:
                        target.isInFlight = false;
                        message = target.store.genericErrorMessage;
                        _b.label = 3;
                    case 3:
                        _b.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, response.json()];
                    case 4:
                        json = _b.sent();
                        message = parseApiErrors(json.errors, message);
                        return [3 /*break*/, 6];
                    case 5:
                        error_1 = _b.sent();
                        return [3 /*break*/, 6];
                    case 6:
                        // TODO: add all errors from the API response to the target
                        target.errors = __assign(__assign({}, target.errors), { status: status, base: [{ message: message }] });
                        errorString = JSON.stringify(target.errors);
                        return [2 /*return*/, Promise.reject(new Error(errorString))];
                }
            });
        });
    }, function (error) {
        // TODO: Handle error states correctly
        target.isInFlight = false;
        target.errors = error;
        throw error;
        // return target
    });
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
function parseApiErrors(errors, defaultMessage) {
    return (errors[0].detail.length === 0) ? defaultMessage : errors[0].detail[0];
}
exports.default = ObjectPromiseProxy;
