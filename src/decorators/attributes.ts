import { ObservableMap, set } from 'mobx'
import schema from '../schema'
import { makeDate } from '../utils'

/**
 * returns `true` as long as the `value` is not `null`, `undefined`, or `''`
 *
 * @method isPresent
 * @param value
 * @return {Boolean}
 */
export function isPresent(value: string): boolean {
  return value !== null && value !== undefined && value !== ''
}

/**
 * returns `true` as long as the `value` is not `null`, `undefined`, or `''`
 * @method validatePresence
 * @param value
 */
function validatePresence(value: string): { isValid: boolean, errors: { key: string, message: string }[] } {
  return {
    isValid: isPresent(value),
    errors: [{
      key: 'blank',
      message: 'can\'t be blank',
    }],
  }
}

/**
 * Helper method for apply the correct defaults to attributes.
 * @method defaultValueForDescriptor
 */
function defaultValueForDescriptor(descriptor: { initializer: Function }, DataType: { name: string | Array<string | number> }) {
  if (typeof descriptor.initializer === 'function') {
    const value = descriptor.initializer()
    if (DataType.name === 'Date') {
      return makeDate(value)
    } else {
      return DataType(value)
    }
  }

  if (DataType.name === 'String') return ''
  if (DataType.name === 'Array') return []

  return null
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
export function attribute(dataType = (obj) => obj) {
  return function(target, property, descriptor) {
    const { type } = target.constructor
    const defaultValue = defaultValueForDescriptor(descriptor, dataType)
    // Update the schema
    schema.addAttribute({
      dataType,
      defaultValue,
      property,
      type
    })
    // Return custom descriptor
    return {
      get () {
        return defaultValue
      },
      set (value) {
        set(target, property, value)
      }
    }
  }
}

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
export function validates (target: Function, property: string) {
   let validator = validatePresence

   if (typeof target === 'function') {
     validator = target

     return function (target, property) {
       const { type } = target.constructor

       schema.addValidation({
         property,
         type,
         validator
       })
     }
   } else {
     const { type } = target.constructor
     schema.addValidation({
       property,
       type,
       validator
     })
   }
 }
