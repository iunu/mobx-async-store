import {
  autorun,
  extendObservable,
  set
} from 'mobx'
import ObjectPromiseProxy from './object_promise_proxy'

/**
 * Utility class used to store the schema
 * of model attribute definitions
 *
 * @class Schema
 */
class Schema {
  structure = {}

  addAttribute ({ type, property, dataType, defaultValue }) {
    this.structure[type] = this.structure[type] || {}
    this.structure[type][property] = {
      defaultValue, dataType
    }
  }
}

// TODO: Abstract into separate file
const schema = new Schema()

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
export function attribute (dataType = (obj) => obj) {
  return function (target, property, descriptor) {
    const { type } = target.constructor
    const defaultValue = descriptor.initializer()
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

/*
 * Defines a one-to-many relationship. Defaults to the class with camelized singular name of the property
 * An optional argument specifies the data model, if different from the property name
 * ```
 * class CropVariety extends Model {
 *   @hasMany growth_cycles
 * }
 *
 * class Crop extends Model {
 *   @hasMany(CropVariety) varieties
 * }
 * ```
 * @method hasMany
 */
export function hasMany (modelKlass = (obj) => obj) {
  return function (target, property, descriptor) {
    return {
      get () {
        const { type } = modelKlass
        const references = Object.values(this.relationships[type].data)
        const ids = references.map(ref => ref.id)
        return this.store.getRecordsById(type, ids)
      }
    }
  }
}

/*
 * Defines a many-to-one relationship. Defaults to the class with camelized name of the property.
 * An optional argument specifies the data model, if different from the property name.
 * ```
 * class Note extends Model {
 *   @belongsTo todo
 *   @belongsTo(Facility) greenhouse
 * }
 * ```
 * Polymorphic relationships
 * Define `belongsTo` with the the associated models
 * Define `hasMany` as you normally would
 * ```
 * class Note extends Model {
 *   @belongsTo(Todo, ScheduledEvent) notable
 * }
 *
 * class Todo extends Model {
 *   @hasMany notes
 * }
 * ```
 * @method belongsTo
 */

/**
 @class Model
 */
class Model {
  /**
   * Initializer for model
   *
   * @method constructor
   */
  constructor (initialAttributes = {}) {
    this.makeObservable(initialAttributes)
    this.setCurrentSnapShot()
    this.trackState()
  }

  /**
   * The type of the model. Defined on the class. Defaults to the underscored version of the class name
   * (eg 'calendar_events').
   *
   * @property type
   * @static
   */

  /**
   * The canonical path to the resource on the server. Defined on the class.
   * Defaults to the underscored version of the class name
   * @property endpoint
   * @static
   */

  /**
   * True if the instance has been modified from its persisted state
   * ```
   * kpi = store.find('kpis', 5)
   * kpi.name
   * => "A good thing to measure"
   * kpi.isDirty
   * => false
   * kpi.name = "Another good thing to measure"
   * kpi.isDirty
   * => true
   * await kpi.save()
   * kpi.isDirty
   * => false
   * ```
   * @property isDirty
   * @type {Boolean}
   * @default false
   */
  isDirty = false

  /**
   * True if the instance is coming from / going to the server
   * ```
   * kpi = store.find('kpis', 5)
   * // fetch started
   * kpi.isInFlight
   * => true
   * // fetch finished
   * kpi.isInFlight
   * => false
   * ```
   * @property isInFlight
   * @type {Boolean}
   * @default false
   */
  isInFlight = false

  /**
   * A hash of errors from the server
   * ```
   * kpi = store.find('kpis', 5)
   * kpi.errors
   * => { authorization: "You do not have access to this resource" }
   * ```
   * @property errors
   * @type {Object}
   * @default {}
   */
  errors = {}

  /**
   * The current state of defined attributes and relationships of the instance
   * ```
   * todo = store.find('todos', 5)
   * todo.title
   * => "Buy the eggs"
   * snapshot = todo.snapshot
   * todo.title = "Buy the eggs and bacon"
   * snapshot.title
   * => "Buy the eggs and bacon"
   * ```
   * @property snapshot
   * @type {Object}
   * @default {}
   */
  snapshot = {}

  /**
   * The previous state of defined attributes and relationships of the instance
   *
   * @property previousSnapshot
   * @type {Object}
   * @default {}
   */
  previousSnapshot = {}

  /**
   * restores data to its last persisted state
   * ```
   * kpi = store.find('kpis', 5)
   * kpi.name
   * => "A good thing to measure"
   * kpi.name = "Another good thing to measure"
   * kpi.rollback()
   * kpi.name
   * => "A good thing to measure"
   * ```
   * @method rollback
   */
  rollback () {
    this.attributeNames.forEach((key) => {
      this[key] = this.previousSnapshot[key]
    })
    this.setCurrentSnapShot()
  }

  /**
   * creates or updates a record.
   * @method save
   * @return {Promise}
   */
  save () {
   const { constructor, store, id } = this
   let url = store.fetchUrl(constructor.type)
   let method = 'POST'

   if (!String(id).match(/tmp/)) {
     method = 'PUT'
     url += `/${id}`
   }

   const body = JSON.stringify(this.jsonapi)

   const response = this.store.fetch(url, {
     method,
     body
   })

   return ObjectPromiseProxy(response, this)
  }

  /**
   * deletes a record from the store and server
   * @method destroy
   * @return {Promise} an empty promise with any success/error status
   */
   destroy () {
     throw new Error('Pending Implementation')
   }

   /* Private Methods */

   /**
    * Magic method that makes changes to records
    * observable
    *
    * @method setCurrentSnapShot
    */
   makeObservable (initialAttributes) {
     const { defaultAttributes } = this
     extendObservable(this, {
       ...defaultAttributes,
       ...initialAttributes
     })
   }

   /**
    * Sets current snapshot to current attributes
    *
    * @method setCurrentSnapShot
    */
   setCurrentSnapShot () {
     this.snapshot = this.attributes
   }

   /**
    * Sets previous snapshot to current snapshot
    *
    * @method setPreviousSnapshot
    */
   setPreviousSnapshot () {
     this.previousSnapshot = this.snapshot
   }

   /**
    * Uses mobx.autorun to track changes to attributes
    *
    * @method trackState
    */
   trackState () {
     let firstAutorun = true
     autorun(() => {
       // `JSON.stringify` will touch all attributes
       // ensuring they are automatically observed.
       JSON.stringify(this.attributes)
       if (!firstAutorun) {
         this.setPreviousSnapshot()
         this.setCurrentSnapShot()
         this.isDirty = true
       }
       firstAutorun = false
     })
   }

   /**
    * current attributes of record
    *
    * @method attributes
    * @return {Object} current attributes
    */
   get attributes () {
     return this.attributeNames.reduce((attributes, key) => {
       attributes[key] = this[key]
       return attributes
     }, {})
   }

   get attributeDefinitions () {
     const { type } = this.constructor
     return schema.structure[type]
   }

   /**
    * current attributes of record
    *
    * @method attributes
    * @return {Object} current attributes
    */
   get attributeNames () {
     return Object.keys(this.attributeDefinitions)
   }

   get defaultAttributes () {
     const { attributeDefinitions } = this
     return this.attributeNames.reduce((defaults, key) => {
       defaults[key] = attributeDefinitions[key].defaultValue
       return defaults
     }, {})
   }

   /**
    * getter method to get data in api compliance format
    * TODO: Figure out how to handle unpesisted ids
    *
    * @method jsonapi
    * @return {Object} data in JSON::API format
    */
   get jsonapi () {
     const { attributeDefinitions, constructor, id } = this
     const { type } = constructor
     const attributes = this.attributeNames.reduce((attrs, key) => {
       attrs[key] = attributeDefinitions[key].dataType(this[key])
       return attrs
     }, {})
     const dataObject = { data: { type, attributes } }
     if (!String(id).match(/tmp/)) {
       dataObject.data.id = String(id)
       dataObject.data.attributes.id = id
     }
     return dataObject
   }
}

export default Model