import {
  computed,
  set,
  toJS,
  observable,
  makeObservable,
  runInAction,
  extendObservable
} from 'mobx'

import { diff, parseErrors } from './utils'

import cloneDeep from 'lodash/cloneDeep'
import isEqual from 'lodash/isEqual'
import isObject from 'lodash/isObject'
import findLast from 'lodash/findLast'
import union from 'lodash/union'
import Store from './Store'
import { defineToManyRelationships, defineToOneRelationships } from './relationships'
import pick from 'lodash/pick'

/**
 * Maps the passed-in property names through and runs validations against those properties
 *
 * @param {object} model the model to check
 * @param {Array} propertyNames the names of the model properties to check
 * @param {object} propertyDefinitions a hash map containing validators by property
 * @returns {Array} an array of booleans representing results of validations
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
    } else return true
  })
}

/**
 * Coerces all ids to strings
 *
 * @param {object} object object to coerce
 */
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

/**
 * The base class for data records
 */
class Model {
  /**
   * Initializer for model
   *
   * @param {object} initialAttributes relationships and attributes to override defaults
   */
  constructor (initialProperties = {}, store = new Store({ models: [this.constructor] })) {
    const { id, relationships, ...attributes } = initialProperties

    const { initializeAttributes, initializeRelationships } = this
    this.store = store
    this.id = id
    this.relationships = relationships

    makeObservable(this)

    initializeAttributes(attributes)
    initializeRelationships()

    this.takeSnapshot({ persisted: !this.isNew })
  }

  initializeAttributes = (overrides) => {
    const { attributeDefinitions } = this

    const attributes = Object.keys(attributeDefinitions).reduce((object, attributeName) => {
      object[attributeName] = overrides[attributeName] === undefined ? attributeDefinitions[attributeName].defaultValue : overrides[attributeName]
      return object
    }, {})

    extendObservable(this, attributes)
  }

  /**
   * Initializes relationships based on the `relationships` hash.
   * @method initializeRelationships
   */
  initializeRelationships = () => {
    const { store, relationshipDefinitions = {} } = this
    const definitionEntries = Object.entries(relationshipDefinitions)

    const toOneDefinitions = definitionEntries.filter(([_, definition]) => definition.direction === 'toOne')
    const toManyDefinitions = definitionEntries.filter(([_, definition]) => definition.direction === 'toMany')

    const toOneRelationships = defineToOneRelationships(this, store, toOneDefinitions)
    const toManyRelationships = defineToManyRelationships(this, store, toManyDefinitions)

    extendObservable(this, toOneRelationships)
    extendObservable(this, toManyRelationships)
  }

  /**
   * The type of the model. Defined on the class. Defaults to the underscored version of the class name
   * (eg 'calendar_events').
   *
   * @type {string}
   * @static
   */

  static type = ''

  /**
   * The canonical path to the resource on the server. Defined on the class.
   * Defaults to the underscored version of the class name
   *
   * @type {string}
   * @static
   */

  static endpoint = ''

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
   * todo = store.add('todos', { name: 'A good thing to measure' })
   * todo.isDirty
   * => true
   * todo.name
   * => "A good thing to measure"
   * await todo.save()
   * todo.isDirty
   * => false
   * todo.name = "Another good thing to measure"
   * todo.isDirty
   * => true
   * await todo.save()
   * todo.isDirty
   * => false
   * ```
   *
   * @type {boolean}
   */
  get isDirty () {
    return this.dirtyAttributes.length > 0 || this.dirtyRelationships.size > 0
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
   * => ['note']
   *
   * @type {Array}
   */
  get dirtyRelationships () {
    if (this._snapshots.length === 0 || !this.relationshipDefinitions) { return new Set() }

    const { previousSnapshot, persistedOrFirstSnapshot, relationshipDefinitions } = this

    return Object.entries(relationshipDefinitions || {}).reduce((relationshipSet, [relationshipName, definition]) => {
      const { direction } = definition
      let firstData = persistedOrFirstSnapshot.relationships?.[relationshipName]?.data
      let currentData = previousSnapshot.relationships?.[relationshipName]?.data
      let isDifferent

      if (direction === 'toMany') {
        firstData = firstData || []
        currentData = currentData || []
        isDifferent = firstData.length !== currentData?.length || firstData.some(({ id, type }, i) => currentData[i].id !== id || currentData[i].type !== type)
      } else {
        isDifferent = firstData?.id !== currentData?.id || firstData?.type !== currentData?.type
      }

      if (isDifferent) {
        relationshipSet.add(relationshipName)
      }
      return relationshipSet
    }, new Set())
  }

  /**
   * Have any changes been made since this record was last persisted?
   *
   * @type {boolean}
   */
  get hasUnpersistedChanges () {
    return this.isDirty || !this.previousSnapshot.persisted
  }

  /**
   * True if the model has not been sent to the store
   *
   * @type {boolean}
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
   * todo = store.find('todos', 5)
   * // fetch started
   * todo.isInFlight
   * => true
   * // fetch finished
   * todo.isInFlight
   * => false
   * ```
   *
   * @type {boolean}
   * @default false
   */
  isInFlight = false

  /**
   * A hash of errors from the server
   * ```
   * todo = store.find('todos', 5)
   * todo.errors
   * => { authorization: "You do not have access to this resource" }
   * ```
   *
   * @type {object}
   * @default {}
   */
  @observable errors = {}

  /**
   * a list of snapshots that have been taken since the record was either last persisted or since it was instantiated
   *
   * @type {Array}
   * @default []
   */
  _snapshots = []

  /**
   * restores data to its last snapshot state
   * ```
   * todo = store.find('todos', 5)
   * todo.name
   * => "A good thing to measure"
   * todo.name = "Another good thing to measure"
   * todo.rollback()
   * todo.name
   * => "A good thing to measure"
   * ```
   */
  rollback () {
    this._applySnapshot(this.previousSnapshot)
  }

  /**
   * restores data to its last persisted state or the oldest snapshot
   * state if the model was never persisted
   */
  rollbackToPersisted () {
    this._applySnapshot(this.persistedOrFirstSnapshot)
    this.takeSnapshot({ persisted: true })
  }

  /**
   * creates or updates a record.
   *
   * @param {object} options query params and sparse fields to use
   * @returns {Promise} the persisted record
   */
  save = async (options = {}) => {
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
    const result = await this.store.updateRecords(response, this)
    this.takeSnapshot({ persisted: true })

    return result
  }

  /**
   * Replaces the record with the canonical version from the server.
   *
   * @param {object} options props to use for the fetch
   * @returns {Promise} the refreshed record
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
   * @param {object} options attributes and relationships to use for the validation
   * @returns {boolean} key / value of attributes and relationship validations
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
   *
   * @param {object} options params and option to skip removal from the store
   * @returns {Promise} an empty promise with any success/error status
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
   *
   * @type {object}
   */
  get snapshot () {
    return {
      attributes: this.attributes,
      relationships: toJS(this.relationships)
    }
  }

  /**
   * the latest snapshot
   *
   * @type {object}
   */
  get previousSnapshot () {
    const length = this._snapshots.length
    if (length === 0) throw new Error('Invariant violated: model has no snapshots')
    return this._snapshots[length - 1]
  }

  /**
   * the latest persisted snapshot or the first snapshot if the model was never persisted
   *
   * @type {object}
   */
  get persistedOrFirstSnapshot () {
    return findLast(this._snapshots, (ss) => ss.persisted) || this._snapshots[0]
  }

  /**
   * take a snapshot of the current model state.
   * if persisted, clear the stack and push this snapshot to the top
   * if not persisted, push this snapshot to the top of the stack
   *
   * @param {object} options options to use to set the persisted state
   */
  takeSnapshot = (options = {}) => {
    const persisted = options.persisted || false
    const properties = cloneDeep(pick(this, ['attributes', 'relationships']))

    this._snapshots.push({
      persisted,
      ...properties
    })
  }

  clearSnapshots = () => {
    this._snapshots = []
  }

  /**
   * set the current attributes and relationships to the attributes
   * and relationships of the snapshot to be applied. also reset errors
   *
   * @param {object} snapshot the snapshot to apply
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
   * @type {string}
   */
  get type () {
    return this.constructor.type
  }

  /**
   * current attributes of record
   *
   * @type {object}
   */
  get attributes () {
    return this.attributeNames.reduce((attributes, key) => {
      const value = toJS(this[key])
      if (value != null) {
        attributes[key] = value
      }
      return attributes
    }, {})
  }

  /**
   * Getter find the attribute definition for the model type.
   *
   * @type {object}
   */

  get attributeDefinitions () {
    return this.constructor.attributeDefinitions || {}
  }

  /**
   * Getter find the relationship definitions for the model type.
   *
   * @type {object}
   */
  get relationshipDefinitions () {
    return this.constructor.relationshipDefinitions || {}
  }

  /**
   * Getter to check if the record has errors.
   *
   * @type {boolean}
   */
  get hasErrors () {
    return Object.keys(this.errors).length > 0
  }

  /**
   * Getter to check if the record has errors.
   *
   * @param {string} key the key to check
   * @returns {string} the error text
   */
  errorForKey (key) {
    return this.errors[key]
  }

  /**
   * Getter to just get the names of a records attributes.
   *
   * @returns {Array} the keys of the attribute definitions
   */
  get attributeNames () {
    return Object.keys(this.attributeDefinitions)
  }

  /**
   * Getter to just get the names of a records relationships.
   *
   * @returns {Array} the keys of the relationship definitions
   */
  get relationshipNames () {
    return Object.keys(this.relationshipDefinitions)
  }

  /**
   * getter method to get the default attributes
   *
   * @returns {object} key / value of attributes and defaults
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
   * @param {object} options serialization options
   * @returns {object} data in JSON::API format
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
      let value = this[key]
      if (value) {
        if (attributeDefinitions[key].transformer) { value = attributeDefinitions[key].transformer(value) }
      }
      attrs[key] = value
      return attrs
    }, {})

    const data = {
      type,
      attributes,
      id: String(id)
    }

    if (options.relationships) {
      filteredRelationshipNames = this.relationshipNames
        .filter(name => options.relationships.includes(name) && this.relationships[name])

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

  /**
   * Comparison by identity
   * returns `true` if this object has the same type and id as the
   * "other" object, ignores differences in attrs and relationships
   *
   * @param {object} other other model object
   * @returns {boolean} if this object has the same type and id
   */
  isSame (other) {
    if (!other) return false
    return this.type === other.type && this.id === other.id
  }
}

export default Model
