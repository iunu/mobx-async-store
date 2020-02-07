"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var moment_1 = require("moment");
var mobx_1 = require("mobx");
var schema_1 = require("../schema");
/**
 * returns `true` as long as the `value` is not `null`, `undefined`, or `''`
 *
 * @method isPresent
 * @param value
 * @return {Boolean}
 */
function isPresent(value) {
    return value !== null && value !== undefined && value !== '';
}
exports.isPresent = isPresent;
/**
 * returns `true` as long as the `value` is not `null`, `undefined`, or `''`
 * @method validatePresence
 * @param value
 */
function validatePresence(value) {
    return {
        isValid: isPresent(value),
        errors: [{
                key: 'blank',
                message: 'can\'t be blank'
            }]
    };
}
/**
 * Helper method for apply the correct defaults to attributes.
 * @method defaultValueForDescriptor
 */
function defaultValueForDescriptor(descriptor, DataType) {
    if (typeof descriptor.initializer === 'function') {
        var value = descriptor.initializer();
        if (DataType.name === 'Date') {
            return moment_1.default(value).toDate();
        }
        else {
            return DataType(value);
        }
    }
    if (DataType.name === 'String')
        return '';
    if (DataType.name === 'Array')
        return [];
    return null;
}
/**
 * Defines attributes that will be serialized and deserialized. Takes one argument, a class that the attribute will be coerced to.
 * This can be a Javascript primitive or another class. `id` cannot be defined as it is assumed to exist.
 * Attributes can be defined with a default.
 * ```
 * class Todo extends Model {
 *   @attribute(Date) start_time = moment()
 * }
 * ```
 * @method attribute
 */
function attribute(dataType) {
    if (dataType === void 0) { dataType = function (obj) { return obj; }; }
    return function (target, property, descriptor) {
        var type = target.constructor.type;
        var defaultValue = defaultValueForDescriptor(descriptor, dataType);
        // Update the schema
        schema_1.default.addAttribute({
            dataType: dataType,
            defaultValue: defaultValue,
            property: property,
            type: type
        });
        // Return custom descriptor
        return {
            get: function () {
                return defaultValue;
            },
            set: function (value) {
                mobx_1.set(target, property, value);
            }
        };
    };
}
exports.attribute = attribute;
/**
 * Defines validations for attributes that will be applied before saving. Takes one argument, a function to validate
 * the attribute. The default validator is `presence`: not `null`, `undefined`, or `''`.
 * ```
 * function nonzero(value => value !== 0)
 *
 * class Todo extends Model {
 *   `@validates`
 *   `@attribute`(nonzero) numberOfAssignees
 * }
 * ```
 * @method validates
 */
function validates(target, property) {
    var validator = validatePresence;
    if (typeof target === 'function') {
        validator = target;
        return function (target, property) {
            var type = target.constructor.type;
            schema_1.default.addValidation({
                property: property,
                type: type,
                validator: validator
            });
        };
    }
    else {
        var type = target.constructor.type;
        schema_1.default.addValidation({
            property: property,
            type: type,
            validator: validator
        });
    }
}
exports.validates = validates;
