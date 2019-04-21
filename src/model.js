import { autorun, extendObservable } from 'mobx'

/**
 * Defines attributes that will be serialized and deserialized. Takes one argument, a class that the attribute will be coerced to.
 * This can be a Javascript primitive or another class. `id` cannot be defined as it is assumed to exist.
 * Attributes can be defined with a default.
 * ```
 * class Todo extends Model {
 *   @attribute(Date) static start_time = moment()
 * }
 * ```
 * @method attribute
 */

export function attribute (coerce = (obj) => obj) {
  return function (target, property, descriptor) {
    target.attributes = target.attributes || {}
    target.attributes[property] = {
      defaultValue: descriptor.initializer(),
      coerce
    }
    return descriptor
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

/*
 * Defines a many-to-one relationship. Defaults to the class with camelized name of the property.
 * An optional argument specifies the data model, if different from the property name.
 * ```
 * class CropVariety extends Model {
 *   @belongsTo crop
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
  constructor (initialAttributes) {
    this.makeObservable(initialAttributes)
    this.setCurrentSnapShot()
    this.trackState()
  }

  makeObservable (initialAttributes) {
    extendObservable(this, {
      ...this.defaultAttributes,
      ...initialAttributes
    })
  }

  setCurrentSnapShot () {
    this.snapshot = this.attributes
  }

  setPreviousSnapshot () {
    this.previousSnapshot = this.snapshot
  }

  trackState () {
    let firstAutorun = true;
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
  async save () {
   const { constructor, store, id } = this
   let url = store.fetchUrl(constructor.type)
   let method = 'POST'

   if (!id.match(/tmp/)) {
     method = 'PUT'
     url += `/${id}`
   }

   const response = await this.store.fetch(url, { method })
   const json = await response.json()
   const attributes = json.data.attributes

   Object.keys(attributes).forEach(key => {
     this[key] = attributes[key]
   })
   return this
  }

  /**
   * deletes a record from the store and server
   * @method destroy
   * @return {Promise} an empty promise with any success/error status
   */

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

   /**
    * current attributes of record
    *
    * @method attributes
    * @return {Object} current attributes
    */
   get attributeNames () {
     return Object.keys(this.constructor.attributes)
   }

   get defaultAttributes () {
     return this.attributeNames.reduce((defaults, key) => {
       defaults[key] = this.constructor.attributes[key].defaultValue
       return defaults
     }, {})
   }

   get jsonapi () {
     const { id } = this
     const { type, attributes: attrDefs } = this.constructor
     const attributes = this.attributeNames.reduce((attrs, key) => {
       attrs[key] = attrDefs[key].coerce(this[key])
       if (!String(id).match(/tmp/)) {
         attrs.id = id
       }
       return attrs
     }, {})
     return {
       data: {
         id: String(id),
         type,
         attributes
       }
     }
   }
}

export default Model
