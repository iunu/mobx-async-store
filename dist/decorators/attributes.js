"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validates = exports.attribute = exports.isPresent = void 0;
const mobx_1 = require("mobx");
const schema_1 = __importDefault(require("../schema"));
const utils_1 = require("../utils");
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
function defaultValueForDescriptor(descriptor, dataType) {
    if (!descriptor)
        return null;
    if (typeof descriptor.initializer === 'function') {
        const value = descriptor.initializer();
        if (dataType.name === 'Date') {
            return utils_1.makeDate(value);
        }
        else {
            return dataType(value);
        }
    }
    if (dataType.name === 'String')
        return '';
    if (dataType.name === 'Array')
        return [];
    return null;
}
/**
 * Defines attributes that will be serialized and deserialized. Takes one argument, a class that the attribute will be coerced to.
 * This can be a Javascript primitive or another class. `id` cannot be defined as it is assumed to exist.
 * Attributes can be defined with a default.
 * ```
 * class Todo extends Model {
 *   @attribute(Date) start_time = new Date()
 * }
 * ```
 * @method attribute
 */
function attribute(options, dataType = (obj) => obj) {
    return function (target, property, descriptor) {
        const { type } = target.constructor;
        // Update the schema
        schema_1.default.addAttribute({
            dataType,
            defaultValue: options === null || options === void 0 ? void 0 : options.defaultValue,
            property,
            type
        });
        // Return custom descriptor
        return {
            get() {
                return target[property] || (options === null || options === void 0 ? void 0 : options.defaultValue);
            },
            set(value) {
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
    let validator = validatePresence;
    if (typeof target === 'function') {
        validator = target;
        return function (target, property) {
            const { type } = target.constructor;
            schema_1.default.addValidation({
                property,
                type,
                validator
            });
            return null;
        };
    }
    else {
        const { type } = target.constructor;
        schema_1.default.addValidation({
            property,
            type,
            validator
        });
    }
    return null;
}
exports.validates = validates;
//# sourceMappingURL=attributes.js.map