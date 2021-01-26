"use strict";
exports.__esModule = true;
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
    /**
     * Adds a validation to either the schema `structure` (for attributes) or `relations` (for relationships)
     * @method addValidation
     * @param {Object} options includes `type`, `property`, and `validator`
     */
    Schema.prototype.addValidation = function (_a) {
        var type = _a.type, property = _a.property, validator = _a.validator;
        if (this.structure[type][property]) {
            this.structure[type][property].validator = validator;
        }
        else {
            this.relations[type][property].validator = validator;
        }
    };
    return Schema;
}());
var schema = new Schema();
exports["default"] = schema;
