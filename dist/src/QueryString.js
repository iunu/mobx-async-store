"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var qs_1 = __importDefault(require("qs"));
var QueryString = {
    parse: function (str) { return qs_1.default.parse(str, { ignoreQueryPrefix: true }); },
    stringify: function (str) { return qs_1.default.stringify(str, { arrayFormat: 'brackets' }); }
};
exports.default = QueryString;
//# sourceMappingURL=QueryString.js.map