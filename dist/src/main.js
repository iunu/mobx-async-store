"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryString = exports.ObjectPromiseProxy = exports.validates = exports.relatedToOne = exports.relatedToMany = exports.attribute = exports.Store = exports.Model = void 0;
var Model_1 = __importDefault(require("./Model"));
exports.Model = Model_1.default;
var Store_1 = __importDefault(require("./Store"));
exports.Store = Store_1.default;
var QueryString_1 = __importDefault(require("./QueryString"));
exports.QueryString = QueryString_1.default;
var attributes_1 = require("./decorators/attributes");
Object.defineProperty(exports, "attribute", { enumerable: true, get: function () { return attributes_1.attribute; } });
Object.defineProperty(exports, "validates", { enumerable: true, get: function () { return attributes_1.validates; } });
var relationships_1 = require("./decorators/relationships");
Object.defineProperty(exports, "relatedToMany", { enumerable: true, get: function () { return relationships_1.relatedToMany; } });
Object.defineProperty(exports, "relatedToOne", { enumerable: true, get: function () { return relationships_1.relatedToOne; } });
var ObjectPromiseProxy_1 = __importDefault(require("./ObjectPromiseProxy"));
exports.ObjectPromiseProxy = ObjectPromiseProxy_1.default;
//# sourceMappingURL=main.js.map