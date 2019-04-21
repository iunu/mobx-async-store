/**
 * Defines attributes that will be serialized and deserialized. Takes one argument, a class that the attribute will be coerced to.
 * This can be a Javascript primitive or another class. `id` cannot be defined as it is assumed to exist.
 * Attributes can be defined with a default.
 * ```
 * class CalendarEvent extends Model {
 *   @attribute(Date) start_time = moment()
 * }
 * ```
 * @method attribute
 * @
 */

export function attribute (coerce = (obj) => obj) {
  return function (target, property, descriptor) {
    coerce(property)
    descriptor.property = property
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
 *   @belongsTo(CalendarEvent,Kpi,CropBatchAction) notable
 * }
 *
 * class CalendarEvent extends Model {
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

  /**
   * The current state of defined properties and relationships of the instance
   * ```
   * kpi = store.find('kpis', 5)
   * kpi.name
   * => "A good thing to measure"
   * snapshot = kpi.snapshot
   * kpi.name = "Another good thing to measure"
   * snapshot.name
   * => "A good thing to measure"
   * ```
   * @property snapshot
   * @type {Object}
   * @default {}
   */

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

  /**
   * creates or updates a record.
   * @method save
   * @return {Promise}
   */

  /**
   * deletes a record from the store and server
   * @method destroy
   * @return {Promise} an empty promise with any success/error status
   */
}

export default Model
