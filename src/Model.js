import {
  computed,
  extendObservable,
  observable,
  reaction,
  set,
  toJS,
  transaction
} from 'mobx'

import moment from 'moment'
import { Serializer as JSONAPISerializer } from 'jsonapi-serializer'

import ObjectPromiseProxy from './ObjectPromiseProxy'
import { stringifyIds } from './utils'
import schema from './schema'

/**
 * @class Model
 */
class Model {
  /**
   * Initializer for model
   *
   * @method constructor
   */
  constructor (initialAttributes = {}) {
    this._makeObservable(initialAttributes)
    this.setPreviousSnapshot()
    this._trackState()
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
   * @default false
   */
  @computed get isDirty () {
    const { isNew, _isDirty } = this
    return _isDirty || isNew
  }

  set isDirty (value) {
    this._isDirty = value
  }

  /**
   * Private method. True if the model has been programatically changed,
   * as opposed to just being new.
   * @property _isDirty
   * @type {Boolean}
   * @default false
   * @private
   */

  @observable _isDirty = false

  /**
   * True if the model has not been sent to the store
   * @property isNew
   * @type {Boolean}
   */
  @computed get isNew () {
    const { id } = this
    return !!String(id).match(/tmp/)
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
    transaction(() => {
      this.attributeNames.forEach((key) => {
        this[key] = this.previousSnapshot[key]
      })

      this.errors = {}
    })

    this.setPreviousSnapshot()
  }

  /**
   * creates or updates a record.
   * @method save
   * @return {Promise}
   * @param {Object} options
   */
  save (options = {}) {
    this.errors = {}

    if (!options.skip_validations && !this.validate()) {
      const errorString = JSON.stringify(this.errors)
      return Promise.reject(new Error(errorString))
    }

    const { attributes, queryParams, relationships } = options
    const { constructor, id, isNew } = this

    let requestId = id
    let method = 'PATCH'

    if (isNew) {
      method = 'POST'
      requestId = null
    }

    const url = this.store.fetchUrl(constructor.type, queryParams, requestId)
    const body = JSON.stringify(this.jsonapi({ relationships, attributes }))
    const response = this.store.fetch(url, { method, body })

    return new ObjectPromiseProxy(response, this)
  }

  /**
   * Checks all validations, adding errors where necessary and returning `false` if any are not valid
   * @method validate
   * @return {Boolean}
   */
  validate () {
    const { attributeNames, attributeDefinitions } = this

    const validationChecks = attributeNames.map((property) => {
      const { validator } = attributeDefinitions[property]

      if (!validator) return true

      const validationResult = validator(this[property], this)

      if (!validationResult.isValid) {
        this.errors[property] = validationResult.errors
      }

      return validationResult.isValid
    })

    return validationChecks.every(value => value)
  }

  /**
   * deletes a record from the store and server
   * @method destroy
   * @return {Promise} an empty promise with any success/error status
   */
  destroy (options = {}) {
    const { type, id, snapshot, isNew } = this

    if (isNew) {
      this.store.remove(type, id)
      return snapshot
    }

    const { params = {}, skipRemove = false } = options

    this.isInFlight = true

    const url = this.store.fetchUrl(type, params, id)
    const promise = this.store.fetch(url, { method: 'DELETE' })
    const _this = this

    return promise.then(
      async function (response) {
        _this.isInFlight = false

        if (response.status === 202 || response.status === 204) {
          if (!skipRemove) {
            _this.store.remove(type, id)
          }

          let json

          try {
            json = await response.json()

            if (json.data && json.data.attributes) {
              Object.keys(json.data.attributes).forEach(key => {
                set(_this, key, json.data.attributes[key])
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
   * @method _makeObservable
   */
  _makeObservable (initialAttributes) {
    const { defaultAttributes } = this

    extendObservable(this, { ...defaultAttributes, ...initialAttributes })
  }

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
    return this.attributes
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
   * @method _trackState
   */
  _trackState () {
    reaction(
      () => JSON.stringify(this.attributes),
      objectString => {
        this.isDirty = true
      }
    )

    reaction(
      () => JSON.stringify(this.relationships),
      relString => {
        this.isDirty = true
      }
    )
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
    return schema.structure[this.type]
  }

  /**
   * Getter find the relationship definitions for the model type.
   *
   * @method relationshipDefinitions
   * @return {Object}
   */
  get relationshipDefinitions () {
    return schema.relations[this.type]
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
    }, { relationships: {} })
  }

  /**
   * getter method to get data in api compliance format
   * TODO: Figure out how to handle unpersisted ids
   *
   * @method jsonapi
   * @return {Object} data in JSON::API format
   */
  jsonapi (options = {}) {
    let {
      attributeDefinitions,
      attributeNames,
      attributes,
      id,
      // meta = {},
      relationships,
      type
    } = this

    let {
      attributes: attributeNamesSubset,
      relationships: relationshipNamesSubset
    } = options

    if (attributeNamesSubset) {
      attributeNames = attributeNames.filter(name => attributeNamesSubset.includes(name))
    }

    const attributeData = attributeNames.reduce((attrs, key) => {
      const value = attributes[key]

      if (value) {
        const { dataType: DataType } = attributeDefinitions[key]

        let attr

        if (DataType.name === 'Array' || DataType.name === 'Object') {
          attr = toJS(value)
        } else if (DataType.name === 'Date') {
          attr = moment(value).toISOString()
        } else {
          attr = DataType(value)
        }

        attrs[key] = attr
      } else {
        attrs[key] = value
      }

      return attrs
    }, {})

    let relationshipNames = Object.keys(relationships)

    if (relationshipNamesSubset) {
      relationshipNames = relationshipNames.filter(name => relationshipNamesSubset.includes(name))
    }

    const relationshipData = relationshipNames.reduce((rels, key) => {
      rels[key] = toJS(relationships[key].data)
      stringifyIds(rels[key])
      return rels
    }, {})

    const relationshipSerializerConfigs = relationshipNames.reduce((relConfig, key) => {
      relConfig[key] = { ref: 'id', included: false }
      return relConfig
    }, {})

    const ModelSerializer = new JSONAPISerializer(type, {
      attributes: [...attributeNames, ...relationshipNames],
      keyForAttribute: 'underscore_case',
      ...relationshipSerializerConfigs
    })

    if (String(id).match(/tmp/)) {
      id = null
    }

    return ModelSerializer.serialize({
      id,
      type,
      ...attributeData,
      ...relationshipData
    })
  }

  updateAttributes (attributes) {
    transaction(() => {
      Object.keys(attributes).forEach(key => {
        this[key] = attributes[key]
      })
    })
  }
}

export default Model
