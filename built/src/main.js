"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Model_1 = __importDefault(require("./Model"));
exports.Model = Model_1.default;
var Store_1 = __importDefault(require("./Store"));
exports.Store = Store_1.default;
var attributes_1 = require("./decorators/attributes");
exports.attribute = attributes_1.attribute;
exports.validates = attributes_1.validates;
var relationships_1 = require("./decorators/relationships");
exports.relatedToMany = relationships_1.relatedToMany;
exports.relatedToOne = relationships_1.relatedToOne;
var ObjectPromiseProxy_1 = __importDefault(require("./ObjectPromiseProxy"));
exports.ObjectPromiseProxy = ObjectPromiseProxy_1.default;
