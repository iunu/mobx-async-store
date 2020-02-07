"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Utility class used to store the schema
 * of model attribute definitions
 *
 * @class Schema
 */
var Schema = /** @class */ (function () {
    function Schema() {
        this.structure = {};
        this.relations = {};
    }
    Schema.prototype.addAttribute = function (_a) {
        var type = _a.type, property = _a.property, dataType = _a.dataType, defaultValue = _a.defaultValue;
        this.structure[type] = this.structure[type] || {};
        this.structure[type][property] = {
            defaultValue: defaultValue, dataType: dataType
        };
    };
    Schema.prototype.addRelationship = function (_a) {
        var type = _a.type, property = _a.property, dataType = _a.dataType;
        this.relations[type] = this.relations[type] || {};
        this.relations[type][property] = {
            dataType: dataType
        };
    };
    Schema.prototype.addValidation = function (_a) {
        var type = _a.type, property = _a.property, validator = _a.validator;
        this.structure[type][property].validator = validator;
    };
    return Schema;
}());
var schema = new Schema();
exports.default = schema;
