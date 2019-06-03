import {
  autorun,
  extendObservable,
  observable,
  set,
  toJS,
  transaction
} from 'mobx'
import { Serializer as JSONAPISerializer } from 'jsonapi-serializer'

import ObjectPromiseProxy from './ObjectPromiseProxy'
import schema from './schema'

/**
 * Helper method for apply the correct defaults to attributes.
 * @method defaultValueForDescriptor
 */
function defaultValueForDescriptor (descriptor, DataType) {
  if (typeof descriptor.initializer === 'function') {
    const value = descriptor.initializer()
    if (DataType.name === 'Date') {
      return new DataType(value)
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
 *   @attribute(Date) start_time = moment()
 * }
 * ```
 * @method attribute
 */
export function attribute (dataType = (obj) => obj) {
  return function (target, property, descriptor) {
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
 * Handles getting polymorphic records or only a specific
 * type if specified.
 *
 * @method getRelatedRecords
 * @param {Object} record the record with the relationship
 * @param {String} property the related property to set
 * @param {String} modelType an override of the modelType
 */
export function getRelatedRecords (record, property, modelType = null) {
  const { relationships } = record

  const relationType = modelType || property

  const references = relationships && relationships[relationType]
  let relatedRecords = []

  if (references && references.data) {
    relatedRecords = references.data.map(ref => {
      const recordType = ref.type
      return record.store.getRecord(recordType, ref.id)
    })
  }

  return new RelatedRecordsArray(relatedRecords, record, relationType)
}

/**
 * Handles getting polymorphic has_one/belong_to.
 *
 * @method getRelatedRecord
 */
export function getRelatedRecord (record, property, modelType = null) {
  // Get relationships
  const { relationships } = record
  // Short circuit if no relationships are present
  if (!relationships) return
  // Use property name unless model type is provided
  const relationType = modelType || property
  const reference = relationships[relationType]
  // Short circuit if matching reference is not found
  if (!reference || !reference.data) return
  const { id, type } = relationships[relationType].data
  const recordType = modelType || type
  return record.store.getRecord(recordType, id)
}

/**
 * Handles setting polymorphic has_one/belong_to.
 * - Validates the related record to make sure it inherits from `Model` class
 * - Sets the relationship
 * - Attempts to find an inverse relationship, and if successful adds it as well
 *
 * @method setRelatedRecord
 * @param {Object} record the record with the relationship
 * @param {Object} relatedRecord the record that will be related
 * @param {String} property the related property to set
 * @param {String} modelType an override of the modelType
 */
export function setRelatedRecord (record, relatedRecord, property, modelType = null) {
  if (relatedRecord && !(relatedRecord instanceof Model)) {
    throw new Error('Related record must be a valid Model object')
  }
  const { relationships } = record

  const relationType = modelType || property
  const referenceRecord = relatedRecord || getRelatedRecord(record, relationType)

  if (!referenceRecord) { return }

  const { id } = referenceRecord
  const { type } = referenceRecord.constructor
  const data = relationships[relationType] && relationships[relationType].data

  if (!relatedRecord) {
    delete relationships[relationType]
  } else if (!data || !(data.type === type && data.id === id)) {
    relationships[relationType] = { data: { id, type } }
  } else {
    return relatedRecord
  }

  // hack we don't have a reference to the inverse name so we just use the record type.
  // this may cause problems with polymorphic relationships
  const inverseRelatedToMany = getRelatedRecords(referenceRecord, null, record.constructor.type)

  if (inverseRelatedToMany) {
    const inverseMethod = relatedRecord ? 'add' : 'remove'
    inverseRelatedToMany[inverseMethod](record)
  }

  return relatedRecord
}

/*
 * Defines a one-to-many relationship. Defaults to the class with camelized singular name of the property
 * An optional argument specifies the data model, if different from the property name
 * ```
 * class CropVariety extends Model {
 *   @relatedToMany growth_cycles
 * }
 *
 * class Crop extends Model {
 *   @relatedToMany(CropVariety) varieties
 * }
 * ```
 * @method relatedToMany
 */
export function relatedToMany (targetOrModelKlass, property, descriptor) {
  if (typeof targetOrModelKlass === 'function') {
    return function (target2, property2, descriptor2) {
      return {
        get () {
          const { type } = targetOrModelKlass
          return getRelatedRecords(this, property2, type)
        }
      }
    }
  } else {
    return {
      get () {
        return getRelatedRecords(this, property)
      }
    }
  }
}

/**
 * Syntactic sugar of relatedToMany relationship. Basically
 * everything the same except it only returns a single record.
 *
 * @method relatedToOne
 */
export function relatedToOne (targetOrModelKlass, property, descriptor) {
  if (typeof targetOrModelKlass === 'function') {
    return function (target2, property2, descriptor2) {
      return {
        get () {
          const { type } = targetOrModelKlass
          return getRelatedRecord(this, property2, type)
        },
        set (record) {
          const { type } = targetOrModelKlass
          return setRelatedRecord(this, record, property2, type)
        }
      }
    }
  } else {
    return {
      get () {
        return getRelatedRecord(this, property)
      },
      set (record) {
        return setRelatedRecord(this, record, property)
      }
    }
  }
}

/**
 * An array that allows for updating store references and relationships
 * @class RelatedRecordsArray
 * @constructor
 * @param {Array} array the array to extend
 * @param {Object} record the record with the referenced array
 * @param {String} property the property on the record that references the array
 */

class RelatedRecordsArray extends Array {
  constructor (array, record, property) {
    super(...array)
    this.property = property
    this.record = record
  }

  /**
   * Adds a record to the array, and updates references in the store, as well as inverse references
   * @method add
   * @param {Object} relatedRecord the record to add to the array
   * @return {Object} the original relatedRecord
   */
  add = (relatedRecord) => {
    const { record, property } = this
    const { constructor: { type: recordType } } = record
    const { id, constructor: { type } } = relatedRecord

    if (!relatedRecord || !(relatedRecord instanceof Model)) {
      throw new Error('Related record must be a valid Model object')
    }

    if (!record.relationships) {
      record.relationships = {}
    }

    const { relationships } = record

    if (!relationships[property]) {
      relationships[property] = { data: [] }
    }

    const alreadyThere = relationships[property].data.find((model) => model.id === id && model.type === type)
    if (!alreadyThere) {
      relationships[property].data.push({ id, type })
      this.push(relatedRecord)
      // setting the inverse - hack this will only work with singularized relationships.
      setRelatedRecord(relatedRecord, record, recordType.slice(0, recordType.length - 1))
    }

    return relatedRecord
  }

  /**
   * Removes a record from the array, and updates references in the store, as well as inverse references
   * @method remove
   * @param {Object} relatedRecord the record to remove from the array
   * @return {Object} the original relatedRecord
   */
  remove = (relatedRecord) => {
    const { record, property } = this
    const { relationships, constructor: { type: recordType } } = record
    const { id, constructor: { type } } = relatedRecord

    if (relationships && relationships[property] && relatedRecord) {
      const referenceIndexToRemove = relationships[property].data.findIndex((model) => model.id === id && model.type === type)
      relationships[property].data.splice(referenceIndexToRemove, 1)

      let recordIndexToRemove = this.findIndex((model) => model.id === id && model.type === type)
      if (recordIndexToRemove >= 0) {
        this.splice(recordIndexToRemove, 1)
      }

      if (!relationships[property].data.length) {
        delete relationships[property]
      }

      if (!Object.keys(record.relationships).length) {
        delete record.relationships
      }

      // hack this will only work with singularized relationships.
      setRelatedRecord(relatedRecord, null, recordType.slice(0, recordType.length - 1))
    }
    return relatedRecord
  }

  replace = (array) => {
    const { record, property } = this
    const { relationships } = record

    transaction(() => {
      relationships[property] = { data: [] }
      array.forEach(object => this.add(object))
    })
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
  @observable isDirty = false

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
   * @param {Object} options
   */
  save (options = {}) {
   const { queryParams } = options
   const { constructor, id } = this

   let requestId = id
   let method = 'PATCH'

   if (String(id).match(/tmp/)) {
     method = 'POST'
     requestId = null
   }

   const url = this.store.fetchUrl(constructor.type, queryParams, requestId)
   const body = JSON.stringify(this.jsonapi)
   const response = this.store.fetch(url, { method, body })

   return new ObjectPromiseProxy(response, this)
  }

  /**
   * deletes a record from the store and server
   * @method destroy
   * @return {Promise} an empty promise with any success/error status
   */
  destroy () {
    const {
      constructor: { type }, id, snapshot
    } = this

    if (String(id).match(/tmp/)) {
      this.store.remove(type, id)
      return snapshot
    }

    const url = this.store.fetchUrl(type, {}, id)
    this.isInFlight = true
    const promise = this.store.fetch(url, { method: 'DELETE' })
    const _this = this
    return promise.then(
      async function (response) {
        _this.isInFlight = false
        if (response.status === 202 || response.status === 204) {
          _this.store.remove(type, id)
          return _this
        } else {
          _this.errors = { status: response.status }
          return _this
        }
      },
      function (error) {
        // TODO: Handle error states correctly
        _this.isInFlight = false
        _this.errors = error
        throw error
      }
    )
  }

   /* Private Methods */

  /**
   * Magic method that makes changes to records
   * observable
   *
   * @method makeObservable
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
      const value = toJS(this[key])
      if (!value) {
        delete attributes[key]
      } else {
        attributes[key] = value
      }
      return attributes
    }, {})
  }

  /**
   * Getter find the attribute definition for the model type.
   *
   * @method attributeDefinitions
   * @return {Object}
   */
  get attributeDefinitions () {
    const { type } = this.constructor
    return schema.structure[type]
  }

  /**
   * Getter to check if the record has errors.
   *
   * @method hasErrors
   * @return {Boolean}
   */
  get hasErrors () {
    return Object.keys(this.errors).length > 0
  }

  /**
   * Getter to just get the names of a records attributes.
   *
   * @method attributeNames
   * @return {Array}
   */
  get attributeNames () {
    return Object.keys(this.attributeDefinitions)
  }

  /**
   * getter method to get the default attributes
   *
   * @method defaultAttributes
   * @return {Object}
   */
  get defaultAttributes () {
    const { attributeDefinitions } = this
    return this.attributeNames.reduce((defaults, key) => {
      const { defaultValue } = attributeDefinitions[key]
      defaults[key] = defaultValue
      return defaults
    }, {})
  }

  /**
   * getter method to get data in api compliance format
   * TODO: Figure out how to handle unpersisted ids
   *
   * @method jsonapi
   * @return {Object} data in JSON::API format
   */
  get jsonapi () {
    const {
      attributeNames,
      meta,
      id,
      constructor: { type, requestAttributeNames }
    } = this

    let filterNames = attributeNames
    if (requestAttributeNames) {
      filterNames = attributeNames.filter(name => {
        return requestAttributeNames.includes(name)
      })
    }

    const ModelSerializer = new JSONAPISerializer(type, {
      attributes: filterNames,
      keyForAttribute: 'underscore_case'
    })

    const data = this.attributes

    if (!String(id).match(/tmp/)) {
      data.id = id
    }

    return ModelSerializer.serialize(data)
  }

  /**
   * getter method to get data in api compliance format
   * TODO: Figure out how to handle unpersisted ids
   *
   * @method updateAttributes
   */
  updateAttributes (attributes) {
    transaction(() => {
      Object.keys(attributes).forEach(key => {
        this[key] = attributes[key]
      })
    })
  }
}

export default Model
