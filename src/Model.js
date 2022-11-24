import {
  computed,
  extendObservable,
  set,
  toJS,
  observable,
  makeObservable,
  runInAction
} from 'mobx'

import { diff, getDataType, makeDate, parseErrors } from './utils'

import schema from './schema'
import cloneDeep from 'lodash/cloneDeep'
import isEqual from 'lodash/isEqual'
import isObject from 'lodash/isObject'
import findLast from 'lodash/findLast'
import union from 'lodash/union'

/**
 * Maps the passed-in property names through and runs validations against those properties
 * @method validateProperties
 * @param {Object} model the model to check
 * @param {Array} propertyNames the names of the model properties to check
 * @param {Object} propertyDefinitions a hash map containing validators by property
 * @return {Array} an array of booleans representing results of validations
 */

function validateProperties (model, propertyNames, propertyDefinitions) {
  return propertyNames.map((property) => {
    if (propertyDefinitions) {
      const { validator } = propertyDefinitions[property]

      if (!validator) return true

      const validationResult = validator(model[property], model)

      if (!validationResult.isValid) {
        model.errors[property] = validationResult.errors
      }

      return validationResult.isValid
    } else return false
  })
}

function stringifyIds (object) {
  Object.keys(object).forEach(key => {
    const property = object[key]
    if (typeof property === 'object') {
      if (property.id) {
        property.id = String(property.id)
      }
      stringifyIds(property)
    }
  })
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
    makeObservable(this)
    const { definedAttributesWithDefaults } = this
    extendObservable(this, {
      ...definedAttributesWithDefaults,
      ...initialAttributes
    })
    this._takeSnapshot({ persisted: !this.isNew })
  }

  get definedAttributesWithDefaults () {
      const { attributeDefinitions } = this
      return Object.keys(attributeDefinitions).reduce((allAttrs, key) => {
        allAttrs[key] = attributeDefinitions[key].defaultValue
        return allAttrs
      }, {})
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
   *
   * NOTE that isDirty does _NOT_ track changes to the related objects
   * but it _does_ track changes to the relationships themselves.
   *
   * For example, adding or removing a related object will mark this record as dirty,
   * but changing a related object's properties will not mark this record as dirty.
   *
   * The caller is reponsible for asking related objects about their
   * own dirty state.
   *
   * ```
   * kpi = store.add('kpis', { name: 'A good thing to measure' })
   * kpi.isDirty
   * => true
   * kpi.name
   * => "A good thing to measure"
   * await kpi.save()
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
   */
  get isDirty () {
    return this.dirtyAttributes.length > 0 || this.dirtyRelationships.length > 0
  }

  /**
   * A list of any attribute paths which have been changed since the previous snapshot
   *
   * const todo = new Todo({ title: 'Buy Milk' })
   * todo.dirtyAttributes
   * => []
   * todo.title = 'Buy Cheese'
   * todo.dirtyAttributes
   * => ['title']
   * todo.options = { variety: 'Cheddar' }
   * todo.dirtyAttributes
   * => ['title', 'options.variety']
   *
   * @property dirtyAttributes
   * @type {Array}
   */
  get dirtyAttributes () {
    return Array.from(Object.keys(this.attributes).reduce((dirtyAccumulator, attr) => {
      const currentValue = this.attributes[attr]
      const previousValue = this.previousSnapshot.attributes[attr]

      if (isObject(currentValue)) {
        const currentToPreviousDiff = diff(currentValue, previousValue)
        const previousToCurrentDiff = diff(previousValue, currentValue)

        union(currentToPreviousDiff, previousToCurrentDiff).forEach((property) => {
          dirtyAccumulator.add(`${attr}.${property}`)
        })
      } else if (!isEqual(previousValue, currentValue)) {
        dirtyAccumulator.add(attr)
      }

      return dirtyAccumulator
    }, new Set()))
  }

  /**
   * A list of any relationship paths which have been changed since the previous snapshot
   * We check changes to both ids and types in case there are polymorphic relationships
   *
   * const todo = new Todo({ title: 'Buy Milk' })
   * todo.dirtyRelationships
   * => []
   * todo.note = note1
   * todo.dirtyRelationships
   * => ['relationships.note']
   *
   * @method dirtyRelationships
   * @return {Array} dirty relationship paths
   */
  get dirtyRelationships () {
    // TODO: make what returns from this.relationships to be more consistent
    const previousRelationships = this.previousSnapshot.relationships || {}
    const currentRelationships = this.relationships || {}
    const schemaRelationships = this.relationshipNames

    if (Object.keys(currentRelationships).length === 0) {
      return Object.keys(previousRelationships)
    }

    return Array.from(schemaRelationships.reduce((dirtyAccumulator, name) => {
      const currentValues = currentRelationships[name]?.data || []
      const previousValues = previousRelationships[name]?.data || []
      const currentIds = Array.isArray(currentValues) ? currentValues.map(value => [value.id, value.type]).sort() : [currentValues.id, currentValues.type]
      const previousIds = Array.isArray(previousValues) ? previousValues.map(value => [value.id, value.type]).sort() : [previousValues.id, previousValues.type]

      if (!isEqual(currentIds, previousIds)) {
        dirtyAccumulator.add(name)
      }

      return dirtyAccumulator
    }, new Set()))
  }

  /**
   * Have any changes been made since this record was last persisted?
   * @property hasUnpersistedChanges
   * @type {Boolean}
   */
  get hasUnpersistedChanges () {
    return this.isDirty || !this.previousSnapshot.persisted
  }

  /**
   * True if the model has not been sent to the store
   * @property isNew
   * @type {Boolean}
   */
  @computed get isNew () {
    const { id } = this
    if (!id) return true
    if (String(id).indexOf('tmp') === -1) return false
    return true
  }

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
  @observable errors = {}

  /**
   * a list of snapshots that have been taken since the record was either last persisted or since it was instantiated
   *
   * @property snapshots
   * @type {Array<Snapshot>}
   * @default []
   */
  _snapshots = []

  /**
   * restores data to its last snapshot state
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
    this._applySnapshot(this.previousSnapshot)
  }

  /**
   * restores data to its last persisted state or the oldest snapshot
   * state if the model was never persisted
   * @method rollbackToPersisted
   */
  rollbackToPersisted () {
    this._applySnapshot(this.persistedSnapshot)
    this._takeSnapshot({ persisted: true })
  }

  /**
   * creates or updates a record.
   * @method save
   * @return {Promise}
   * @param {Object} options
   */
  save (options = {}) {
    if (!options.skip_validations && !this.validate(options)) {
      const errorString = JSON.stringify(this.errors)
      return Promise.reject(new Error(errorString))
    }

    const {
      queryParams,
      relationships,
      attributes
    } = options

    const { constructor, id, isNew } = this

    let requestId = id
    let method = 'PATCH'

    if (isNew) {
      method = 'POST'
      requestId = null
    }

    const url = this.store.fetchUrl(constructor.type, queryParams, requestId)

    const body = JSON.stringify({
      data: this.jsonapi({ relationships, attributes })
    })

    if (relationships) {
      relationships.forEach((rel) => {
        if (Array.isArray(this[rel])) {
          this[rel].forEach((item, i) => {
            if (item && item.isNew) {
              throw new Error(`Invariant violated: tried to save a relationship to an unpersisted record: "${rel}[${i}]"`)
            }
          })
        } else if (this[rel] && this[rel].isNew) {
          throw new Error(`Invariant violated: tried to save a relationship to an unpersisted record: "${rel}"`)
        }
      })
    }

    const response = this.store.fetch(url, { method, body })
    const result = this.store.updateRecords(response, this)

    return result
  }

  /**
   * Replaces the record with the canonical version from the server.
   * @method reload
   * @return {Promise}
   * @param {Object} options
   */
  reload (options = {}) {
    const { constructor, id, isNew } = this

    if (isNew) {
      return this.rollback()
    } else {
      return this.store.fetchOne(constructor.type, id, options)
    }
  }

  /**
   * Checks all validations, adding errors where necessary and returning `false` if any are not valid
   * Default is to check all validations, but they can be selectively run via options:
   *  - attributes - an array of names of attributes to validate
   *  - relationships - an array of names of relationships to validate
   *
   * @method validate
   * @param {Object} options
   * @return {Boolean}
   */

  validate (options = {}) {
    this.errors = {}
    const { attributeDefinitions, relationshipDefinitions } = this

    const attributeNames = options.attributes || Object.keys(attributeDefinitions)
    const relationshipNames = options.relationships || this.relationshipNames

    const validAttributes = validateProperties(this, attributeNames, attributeDefinitions)
    const validRelationships = validateProperties(this, relationshipNames, relationshipDefinitions)

    return validAttributes.concat(validRelationships).every(value => value)
  }

  /**
   * deletes a record from the store and server
   * @method destroy
   * @return {Promise} an empty promise with any success/error status
   */
  destroy (options = {}) {
    const {
      constructor: { type }, id, snapshot, isNew
    } = this

    if (isNew) {
      this.store.remove(type, id)
      return snapshot
    }

    const { params = {}, skipRemove = false } = options

    const url = this.store.fetchUrl(type, params, id)
    this.isInFlight = true
    const promise = this.store.fetch(url, { method: 'DELETE' })
    const _this = this
    _this.errors = {}

    return promise.then(
      async function (response) {
        _this.isInFlight = false
        if ([200, 202, 204].includes(response.status)) {
          if (!skipRemove) {
            _this.store.remove(type, id)
          }

          let json
          try {
            json = await response.json()
            if (json.data && json.data.attributes) {
              runInAction(() => {
                Object.keys(json.data.attributes).forEach(key => {
                  set(_this, key, json.data.attributes[key])
                })
              })
            }
          } catch (err) {
            console.log(err)
            // It is text, do you text handling here
          }

          // NOTE: If deleting a record changes other related model
          // You can return then in the delete response
          if (json && json.included) {
            _this.store.createModelsFromData(json.included)
          }

          return _this
        } else {
          const errors = await parseErrors(response, _this.store.errorMessages)
          throw new Error(JSON.stringify(errors))
        }
      },
      function (error) {
        // TODO: Handle error states correctly
        _this.isInFlight = false
        throw error
      }
    )
  }

   /* Private Methods */

  /**
   * The current state of defined attributes and relationships of the instance
   * Really just an alias for attributes
   * ```
   * todo = store.find('todos', 5)
   * todo.title
   * => "Buy the eggs"
   * snapshot = todo.snapshot
   * todo.title = "Buy the eggs and bacon"
   * snapshot.title
   * => "Buy the eggs and bacon"
   * ```
   * @method snapshot
   * @return {Object} current attributes
   */
  get snapshot () {
    return {
      attributes: this.attributes,
      relationships: toJS(this.relationships)
    }
  }

  /**
   * Sets previous snapshot to current snapshot
   *
   * @method setPreviousSnapshot
   */
  setPreviousSnapshot () {
    this._takeSnapshot()
  }

  /**
   * the latest snapshot
   *
   * @method previousSnapshot
   */
  get previousSnapshot () {
    const length = this._snapshots.length
    if (length === 0) throw new Error('Invariant violated: model has no snapshots')
    return this._snapshots[length - 1]
  }

  /**
   * the latest persisted snapshot or the first snapshot if the model was never persisted
   *
   * @method previousSnapshot
   */
  get persistedSnapshot () {
    return findLast(this._snapshots, (ss) => ss.persisted) || this._snapshots[0]
  }

  /**
   * take a snapshot of the current model state.
   * if persisted, clear the stack and push this snapshot to the top
   * if not persisted, push this snapshot to the top of the stack
   * @method _takeSnapshot
   * @param {Object} options
   */
  _takeSnapshot (options = {}) {
    const persisted = options.persisted || false
    const { attributes, relationships } = this.snapshot
    const snapshot = {
      persisted,
      attributes,
      relationships
    }
    if (persisted) {
      this._snapshots = []
    }
    this._snapshots.push(snapshot)
  }

  /**
   * set the current attributes and relationships to the attributes
   * and relationships of the snapshot to be applied. also reset errors
   * @method _applySnapshot
   * @param {Object} snapshot
   */
  _applySnapshot (snapshot) {
    if (!snapshot) throw new Error('Invariant violated: tried to apply undefined snapshot')
    runInAction(() => {
      this.attributeNames.forEach((key) => {
        this[key] = snapshot.attributes[key]
      })
      this.relationships = snapshot.relationships
      this.errors = {}
    })
  }

  /**
   * shortcut to get the static
   *
   * @method type
   * @return {String} current attributes
  */
  get type () {
    return this.constructor.type
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
      if (value == null) {
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

 /*
  *Old attributeDefinitions getter from schema.structure =
  get attributeDefinitions () {
    const { type } = this.constructor
    return schema.structure[type]
  } */

  /**
   * Getter find the relationship definitions for the model type.
   *
   * @method relationshipDefinitions
   * @return {Object}
   */
  get relationshipDefinitions () {
    const { type } = this.constructor
    return schema.relations[type] || {}
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
   * Getter to check if the record has errors.
   *
   * @method hasErrors
   * @return {Boolean}
   */
  errorForKey (key) {
    return this.errors[key]
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
   * Getter to just get the names of a records relationships.
   *
   * @method relationshipNames
   * @return {Array}
   */
  get relationshipNames () {
    return Object.keys(this.relationshipDefinitions)
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
    }, {
      relationships: {}
    })
  }

  /**
   * getter method to get data in api compliance format
   * TODO: Figure out how to handle unpersisted ids
   *
   * @method jsonapi
   * @return {Object} data in JSON::API format
   */
  jsonapi (options = {}) {
    const {
      attributeDefinitions,
      attributeNames,
      meta,
      id,
      constructor: { type }
    } = this

    let filteredAttributeNames = attributeNames
    let filteredRelationshipNames = []

    if (options.attributes) {
      filteredAttributeNames = attributeNames
        .filter(name => options.attributes.includes(name))
    }

    const attributes = filteredAttributeNames.reduce((attrs, key) => {
      const value = this[key]
      if (value) {
        const dataType = getDataType(value)
        let attr
        if (dataType === 'Array' || dataType === 'Object') {
          attr = toJS(value)
        } else if (dataType === 'Date') {
          attr = makeDate(value).toISOString()
        } else if (dataType === 'String') {
          attr = value.toString()
        } else {
          if (attributeDefinitions[key].transformer) { attr = attributeDefinitions[key].transformer(value) }
        }
        attrs[key] = attr
      } else {
        attrs[key] = value
      }
      return attrs
    }, {})

    const data = {
      type,
      attributes,
      id: String(id)
    }

    if (options.relationships) {
      filteredRelationshipNames = Object.keys(this.relationships)
        .filter(name => options.relationships.includes(name))

      const relationships = filteredRelationshipNames.reduce((rels, key) => {
        rels[key] = toJS(this.relationships[key])
        stringifyIds(rels[key])
        return rels
      }, {})

      data.relationships = relationships
    }

    if (meta) {
      data.meta = meta
    }

    if (String(id).match(/tmp/)) {
      delete data.id
    }

    return data
  }

  updateAttributes (attributes) {
    runInAction(() => {
      Object.keys(attributes).forEach(key => {
        this[key] = attributes[key]
      })
    })
  }

  updateAttributesFromResponse (data, included) {
    const tmpId = this.id
    const { id, attributes, relationships } = data

    runInAction(() => {
      set(this, 'id', id)

      Object.keys(attributes).forEach(key => {
        set(this, key, attributes[key])
      })
      if (relationships) {
        Object.keys(relationships).forEach((key) => {
          // Don't try to create relationship if meta included false
          if (relationships[key].meta?.included !== false) {
            set(this.relationships, key, relationships[key])
          }
        })
      }
      if (included) {
        this.store.createModelsFromData(included)
      }
    })

    // Update target isInFlight
    this.isInFlight = false
    this._takeSnapshot({ persisted: true })

    runInAction(() => {
      // NOTE: This resolves an issue where a record is persisted but the
      // index key is still a temp uuid. We can't simply remove the temp
      // key because there may be associated records that have the temp
      // uuid id as its only reference to the newly persisted record.
      // TODO: Figure out a way to update associated records to use the
      // newly persisted id.
      this.store.data[this.type].records.set(String(tmpId), this)
      this.store.data[this.type].records.set(String(this.id), this)
    })
  }

  clone () {
    const attributes = cloneDeep(this.snapshot.attributes)
    const relationships = cloneDeep(this.snapshot.relationships)
    return this.store.createModel(this.type, this.id, { attributes, relationships })
  }

  /**
   * Comparison by identity
   * returns `true` if this object has the same type and id as the
   * "other" object, ignores differences in attrs and relationships
   *
   * @method isSame
   * @param {Object} other
   * @return {Object}
   */
  isSame (other) {
    if (!other) return false
    return this.type === other.type && this.id === other.id
  }
}

export default Model
