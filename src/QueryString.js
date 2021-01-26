"use strict";
exports.__esModule = true;
var qs_1 = require("qs");
var QueryString = {
    parse: function (str) { return qs_1["default"].parse(str, { ignoreQueryPrefix: true }); },
    stringify: function (str) { return qs_1["default"].stringify(str, { arrayFormat: 'brackets' }); }
};
exports["default"] = QueryString;
