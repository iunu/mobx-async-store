import { transaction } from 'mobx'
import Model from '../Model'
import schema from '../schema'
import { singularizeType } from '../utils'

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
export function relatedToMany (targetOrModelKlass:any, property?:any, descriptor?:any): void | any {
  if (typeof targetOrModelKlass === 'function') {
    return function (target2, property2, descriptor2) {
      schema.addRelationship({
        type: target2.constructor.type,
        property: property2,
        dataType: Array
      })

      return {
        get () {
          const { type } = targetOrModelKlass
          return getRelatedRecords(this, property2, type)
        }
      }
    }
  } else {
    schema.addRelationship({
      type: targetOrModelKlass.constructor.type,
      property,
      dataType: Array
    })

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
export function relatedToOne (targetOrModelKlass, property?, descriptor?): void | any {
  if (typeof targetOrModelKlass === 'function') {
    return function (target2, property2, descriptor2) {
      schema.addRelationship({
        type: target2.constructor.type,
        property: property2,
        dataType: Object
      })

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
    schema.addRelationship({
      type: targetOrModelKlass.constructor.type,
      property,
      dataType: Object
    })
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

  // NOTE: If the record doesn't have a matching references for the relation type
  // fall back to looking up records by a foreign id i.e record.related_record_id
  if (references && references.data) {
    // Ignore any records of unknown types
    relatedRecords = references.data.filter(ref => record.store.getType(ref.type)).map(ref => {
      const recordType = ref.type
      return record.store.getRecord(recordType, ref.id)
    })
  } else {
    const foreignId = `${singularizeType(record.type)}_id`

    if (record.store.getType(relationType)) {
      const allRecords = record.store.getRecords(relationType)
      if (allRecords?.[0]?.[foreignId]) {
        console.warn(`Support for including non-canonical jsonapi references will be removed in future versions. Record type: ${record.type}. Reference: ${foreignId}`)
        relatedRecords = allRecords.filter(rel => String(rel[foreignId]) === String(record.id))
      }
    }
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
  const relationType = modelType ? singularizeType(modelType) : property
  const reference = relationships[relationType]

  // Short circuit if matching reference is not found
  if (!reference || !reference.data) return

  const { id, type } = reference.data
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

  const { relationships, _dirtyRelationships } = record
  const relationType = modelType || property
  const referenceRecord = relatedRecord || getRelatedRecord(record, relationType)

  if (!referenceRecord) { return }

  const { id } = referenceRecord
  const { type } = referenceRecord.constructor
  const data = relationships[relationType] && relationships[relationType].data

  if (!relatedRecord) {
    delete relationships[relationType]
    _dirtyRelationships.add(relationType)
  } else if (!data || !(data.type === type && data.id === id)) {
    relationships[relationType] = { data: { id, type } }
    _dirtyRelationships.add(relationType)
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

/**
 * An array that allows for updating store references and relationships
 * @class RelatedRecordsArray
 * @constructor
 * @param {Array} array the array to extend
 * @param {Object} record the record with the referenced array
 * @param {String} property the property on the record that references the array
 */

export class RelatedRecordsArray extends Array {
  property: any
  record: any
  constructor (array, record, property) {
    super(...array)
    this.property = property
    this.record = record
  }

  /*
   * This method is used by Array internals to decide
   * which class to use for resulting derived objects from array manipulation methods
   * such as `map` or `filter`
   *
   * Without this, `RelatedRecordsArray.map` would return a `RelatedRecordsArray` instance
   * but such derived arrays should not maintain the behavior of the source `RelatedRecordsArray`
   *
   * For more details, see:
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/species
   */
  static get [Symbol.species] () {
    return Array
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
      relationships[property] = {}
    }

    if (!relationships[property].data) {
      relationships[property].data = []
    }

    const existingRelationships = relationships[property]
    const alreadyThere = existingRelationships && existingRelationships.data.find((model) => model.id === id && model.type === type)
    if (!alreadyThere) {
      relationships[property].data.push({ id, type })
      this.push(relatedRecord)
      record._dirtyRelationships.add(property)
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
      const referenceIndexToRemove = relationships[property].data.findIndex((model) => model.id.toString() === id.toString() && model.type === type)
      if (referenceIndexToRemove >= 0) relationships[property].data.splice(referenceIndexToRemove, 1)

      const recordIndexToRemove = this.findIndex((model) => model.id.toString() === id.toString() && model.type === type)
      if (recordIndexToRemove >= 0) this.splice(recordIndexToRemove, 1)

      if (!relationships[property].data.length) {
        delete relationships[property]
      }

      if (!Object.keys(record.relationships).length) {
        delete record.relationships
      }

      record._dirtyRelationships.add(property)

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
      record._dirtyRelationships.add(property)
    })
  }
}
