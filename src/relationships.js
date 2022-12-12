import { transaction } from 'mobx'
import Model from './Model'

/**
 * Takes the `toOne` definitions from a document type and creates getters and setters.
 * A getter finds a record from the store. The setter calls `setRelatedRecord`, which will
 * return an instance of a model and add it to the inverse relationship if necessary.
 *
 * @param {object} record
 * @param {object} store
 * @param {object} toOneDefinitions
 * @returns {object}
 */

export const defineToOneRelationships = (record, store, toOneDefinitions) => {
  return toOneDefinitions.reduce((object, [relationshipName, definition]) => {
    const { inverse } = definition

    Object.defineProperty(object, relationshipName, {
      get () {
        const reference = record.relationships[relationshipName]?.data
        if (reference) {
          return coerceDataToExistingRecord(store, reference)
        }
      },
      set (relatedReference) {
        return setRelatedRecord(relationshipName, record, relatedReference, store, inverse)
      }
    })

    return object
  }, {})
}

/**
 * Takes the `toMany` definitions from a document type and creates getters and setters.
 * A getter finds records from the store, falling back to a lookup of the inverse records if
 * none are defined in the `relationships` hash.
 *
 * The setter will unset the previous inverse and set the current inverse.
 * Both return a `RelatedRecordsArray`, which is an array with added methods `add`, `remove`, and `replace`
 *
 * @param {object} record
 * @param {object} store
 * @param {object} toOneDefinitions
 * @returns {object}
 */

export const defineToManyRelationships = (record, store, toManyDefinitions) => {
  return toManyDefinitions.reduce((object, [relationshipName, definition]) => {
    const { inverse, types: relationshipTypes } = definition

    Object.defineProperty(object, relationshipName, {
      get () {
        const references = record.relationships[relationshipName]?.data
        let relatedRecords
        if (references) {
          relatedRecords = references.filter((reference) => store.getKlass(reference.type)).map((reference) => coerceDataToExistingRecord(store, reference))
        } else if (inverse) {
          const types = relationshipTypes || [relationshipName]
          relatedRecords = types.map((type) => record.store.getAll(type)).flat().filter((potentialRecord) => {
            const reference = potentialRecord.relationships[inverse.name]?.data
            return reference && (reference.type === record.type) && (reference.id === record.id)
          })
        }

        return new RelatedRecordsArray(record, relationshipName, relatedRecords)
      },
      set (relatedRecords) {
        this.relationships[relationshipName] = { data: relatedRecords.map(({ id, type }) => ({ id, type })) }

        relatedRecords = relatedRecords.map((reference) => coerceDataToExistingRecord(store, reference))

        if (inverse) {
          const { types, name: inverseName } = inverse

          const oldRelatedRecords = types.map((type) => record.store.getAll(type)).flat().filter((potentialRecord) => {
            const reference = potentialRecord.relationships[inverseName]?.data
            return reference && (reference.type === record.type) && (reference.id === record.id)
          })

          oldRelatedRecords.forEach((oldRelatedRecord) => {
            oldRelatedRecord.relationships[inverseName] = null
          })

          relatedRecords.forEach((relatedRecord) => {
            relatedRecord.relationships[inverseName] = { data: { id: record.id, type: record.type } }
          })
        }

        return new RelatedRecordsArray(record, relationshipName, relatedRecords)
      }
    })

    return object
  }, {})
}

export const setRelatedRecord = (relationshipName, record, relatedRecord, store, inverse) => {
  if (relatedRecord != null) {
    relatedRecord = coerceDataToExistingRecord(store, relatedRecord)
    record.relationships[relationshipName] = { data: { id: relatedRecord.id, type: relatedRecord.type } }
  } else {
    record.relationships[relationshipName] = null
  }

  if (inverse) {
    const relatedArray = relatedRecord?.[inverse.name]

    if (relatedArray && !relatedArray.includes(record)) {
      addRelatedRecord(relatedArray, inverse.name, relatedRecord, record)
    }
  }

  record.takeSnapshot()
  return relatedRecord
}

export const removeRelatedRecord = (array, relationshipName, record, relatedRecord, inverse) => {
  if (array == null || relatedRecord == null) { return relatedRecord }

if (Array.isArray(relatedRecord)) {
    return relatedRecord.map(singleRecord => removeRelatedRecord(array, relationshipName, record, singleRecord, inverse))
  }

  const existingData = (record.relationships[relationshipName]?.data || [])

  const recordIndexToRemove = existingData.findIndex(({ id: comparedId, type: comparedType }) => {
    return comparedId === relatedRecord.id && comparedType === relatedRecord.type
  })

  if (recordIndexToRemove > -1) {
    if (inverse) {
      setRelatedRecord(inverse.name, relatedRecord, null, record.store)
    }

    existingData.splice(recordIndexToRemove, 1)
    array.splice(recordIndexToRemove, 1)
  }

  record.takeSnapshot()
  return coerceDataToExistingRecord(record.store, relatedRecord)
}

export const addRelatedRecord = (array, relationshipName, record, relatedRecord, inverse) => {
  if (Array.isArray(relatedRecord)) {
    return relatedRecord.map(singleRecord => addRelatedRecord(array, relationshipName, record, singleRecord, inverse))
  }

  if (array == null || relatedRecord == null || !record.store.getKlass(record.type)) { return relatedRecord }

  if (inverse) {
    setRelatedRecord(inverse.name, relatedRecord, record, record.store)
    relatedRecord.relationships[inverse.name] = { data: { id: record.id, type: record.type } }
  }

  const existingData = (record.relationships[relationshipName]?.data || [])

  const recordFromStore = coerceDataToExistingRecord(record.store, relatedRecord)
  const alreadyThere = array.includes(recordFromStore)

  if (!alreadyThere) {
    record.relationships[relationshipName] = { data: [...existingData, { id: relatedRecord.id, type: relatedRecord.type }] }
    array.push(recordFromStore)
  }

  record.takeSnapshot()
  return recordFromStore
}

export const coerceDataToExistingRecord = (store, record) => {
  if (!store?.getType(record.type)) { return null }
  if (record && !(record instanceof Model)) {
    const { id, type } = record
    record = store.getOne(type, id) || store.add(type, { id })
  }
  return record
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
  constructor (record, property, array = []) {
    super(...array)
    this.property = property
    this.record = record
    this.store = record.store
    this.inverse = record.relationshipDefinitions[this.property].inverse
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
   * @return {Object} a model record reflecting the original relatedRecord
   */
  add = (relatedRecord) => {
    const { inverse, record, property } = this

    return addRelatedRecord(this, property, record, relatedRecord, inverse)
  }

  /**
   * Removes a record from the array, and updates references in the store, as well as inverse references
   * @method remove
   * @param {Object} relatedRecord the record to remove from the array
   * @return {Object} a model record reflecting the original relatedRecord
   */
  remove = (relatedRecord) => {
    const { inverse, record, property } = this
    return removeRelatedRecord(this, property, record, relatedRecord, inverse)
  }

  replace = (array = []) => {
    const { inverse, record, property } = this
    let newRecords

    transaction(() => {
      this.forEach((relatedRecord) => removeRelatedRecord(this, property, record, relatedRecord, inverse))
      newRecords = array.forEach((relatedRecord) => addRelatedRecord(this, property, record, relatedRecord, inverse))
    })

    return newRecords
  }
}
