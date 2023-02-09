import {
  toJS,
  makeObservable,
  runInAction,
  extendObservable,
  computed,
  action,
  observable
} from 'mobx'

import { diff, parseErrors } from './utils'

import cloneDeep from 'lodash/cloneDeep'
import isEqual from 'lodash/isEqual'
import isObject from 'lodash/isObject'
import findLast from 'lodash/findLast'
import union from 'lodash/union'
import Store, { IStore } from './Store'
import { defineToManyRelationships, defineToOneRelationships, definitionsByDirection } from './relationships'
import pick from 'lodash/pick'
import { ValidationResult, JSONAPIRelationshipObject, JSONAPIDocument, IRequestParamsOpts, JSONAPISingleDocument, IObjectWithAny, JSONAPIRelationshipReference, IQueryParams, JSONAPIDocumentReference, ModelClass, IDOptionalJSONAPIDataObject, IErrorMessage } from 'interfaces/global'

/**
 * Coerces all ids to strings
 *
 * @param {object} object object to coerce
 */
function stringifyIds (object: Record<string, any>): void {
  Object.keys(object).forEach((key: string) => {
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
 * Annotations for mobx observability. We can't use `makeAutoObservable` because we have subclasses.
 */
const mobxAnnotations = {
  errors: observable,
  isInFlight: observable,
  relationships: observable,
  _snapshots: observable,
  attributeDefinitions: computed,
  attributeNames: computed,
  attributes: computed,
  defaultAttributes: computed,
  dirtyAttributes: computed,
  dirtyRelationships: computed,
  hasErrors: computed,
  hasUnpersistedChanges: computed,
  isDirty: computed,
  isNew: computed,
  previousSnapshot: computed,
  persistedOrFirstSnapshot: computed,
  relationshipDefinitions: computed,
  type: computed,
  relationshipNames: computed,
  destroy: action,
  clearSnapshots: action,
  errorForKey: action,
  initializeAttributes: action,
  initializeRelationships: action,
  isSame: action,
  jsonapi: action,
  reload: action,
  rollback: action,
  save: action,
  takeSnapshot: action,
  validate: action,
  undo: action,
  updateAttributes: action,
  _applySnapshot: action
}

export type StoreClass = InstanceType<typeof Store> | IStore

interface ISnapshot {
  relationships: { [key: string]: { data: JSONAPIRelationshipReference } | null }
  attributes: { [key: string]: any }
  persisted: boolean
}

interface IAttributeDefinition {
  transformer?: (property: any) => any
  validator?: (property?: any, model?: ModelClass, propertyName?: string) => ValidationResult
  defaultValue?: any
}

export interface IRelationshipInverseDefinition {
  name: string
  direction: string
  types?: string[]
}

export interface IRelationshipDefinition {
  validator?: (property?: any, model?: ModelClass, propertyName?: string) => ValidationResult
  direction: string
  types?: string[]
  inverse?: IRelationshipInverseDefinition
}

export interface IModelInitOptions {
  skipInitialization?: boolean
}

export interface IModel {
  id?: string
  errors: { [key: string]: IErrorMessage[] }
  isInFlight: boolean
  relationships: { [key: string]: { data: JSONAPIRelationshipObject | JSONAPIRelationshipReference } | null }
  _snapshots: ISnapshot[]
  attributeDefinitions: { [key: string]: IAttributeDefinition }
  attributeNames: string[]
  attributes: Record<string, any>
  defaultAttributes: { [key: string]: any }
  dirtyAttributes: Set<string|undefined>
  dirtyRelationships: Set<string>
  hasErrors: boolean
  hasUnpersistedChanges: boolean
  isDirty: boolean
  isNew: boolean
  previousSnapshot: ISnapshot
  persistedOrFirstSnapshot: ISnapshot
  relationshipDefinitions: { [key: string]: IRelationshipDefinition }
  type: string
  relationshipNames: string[]
  destroy(options?: { params?: {} | undefined; skipRemove?: boolean }): Promise<this|void>
  clearSnapshots: () => void
  errorForKey: (key: string) => IErrorMessage[]
  initializeAttributes: (attributes: { [key: string]: any }) => void
  initializeRelationships: () => void
  isSame(other: IModel | JSONAPIDocumentReference | null | void): boolean
  jsonapi(options?: IRequestParamsOpts): IDOptionalJSONAPIDataObject
  reload: () => Promise<IModel>
  rollback: () => void
  save(options?: { skip_validations?: boolean, queryParams?: IQueryParams, relationships?: string[], attributes?: string[] }): Promise<ModelClass>
  takeSnapshot: (options?: { persisted: boolean }) => void
  validate: (options?: { attributes: string[], relationships: string[] }) => boolean
  undo: () => void
  updateAttributes: (attributes: { [key: string]: any }) => void
  
  store?: StoreClass
  [key: string]: any
}

export interface IInitialProperties {
  id?: string
  relationships?: { [key: string]: { data: JSONAPIRelationshipReference } | null }
  attributes?: { [key: string]: any }
  [key: string]: any
}

/**
 * The base class for data records
 */
class Model implements IModel {
  [x: string]: any
  store: StoreClass

  static attributeDefinitions: { [key: string]: IAttributeDefinition } = {}
  static relationshipDefinitions: { [key: string]: IRelationshipDefinition } = {}


  /**
   * - Sets the store and id.
   * - Sets jsonapi reference to relationships as a hash.
   * - Makes the predefined getters, setters and attributes observable
   * - Initializes relationships and sets attributes
   * - Takes a snapshot of the initial state
   *
   * @param {IInitialProperties} initialProperties attributes and relationships that will be set
   * @param {object} store the store that will define relationships
   * @param {object} options supports `skipInitialization`
   * @param {boolean} options.skipInitialization if true, will skip initializing attributes and relationships
   */
  constructor (initialProperties: IInitialProperties = {}, store: StoreClass | void = undefined, options: IModelInitOptions = {}) {
    const { id, relationships } = initialProperties
    if(!store) { store = new Store({ models: [this.constructor as typeof Model] }) }

    this.store = store
    this.id = id != null ? String(id) : id
    if (relationships) { this.relationships = relationships }

    if (!options.skipInitialization) {
      this.initialize(initialProperties)
    }
  }

  /**
   * True if model attributes and relationships have been initialized
   *
   * @type {boolean}
   */
  initialized = false

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
   * The unique document identifier. Should not change except when persisted.
   *
   * @type {string}
   */
  id?: string

  /**
   * The reference to relationships. Is observed and used to provide references to the objects themselves
   *
   * todo.relationships
   * => { tag: { data: { type: 'tags', id: '1' } } }
   * todo.tag
   * => Tag with id: '1'
   *
   * @type {object}
   */
  relationships: { [key: string]: { data: JSONAPIRelationshipReference } | null } = {}

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
    return this.dirtyAttributes.size > 0 || this.dirtyRelationships.size > 0
  }

  /**
   * A list of any attribute paths which have been changed since the previous snapshot
   *
   * const todo = new Todo({ title: 'Buy Milk' })
   * todo.dirtyAttributes
   * => Set()
   * todo.title = 'Buy Cheese'
   * todo.dirtyAttributes
   * => Set('title')
   * todo.options = { variety: 'Cheddar' }
   * todo.dirtyAttributes
   * => Set('title', 'options.variety')
   *
   * @type {Set}
   * @readonly
   */
  get dirtyAttributes () {
    if (this._snapshots.length === 0) { return <Set<string>> new Set() }

    return Object.keys(this.attributes).reduce((dirtyAccumulator: Set<string>, attr: string) => {
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
    }, new Set())
  }

  /**
   * A list of any relationship paths which have been changed since the previous snapshot
   * We check changes to both ids and types in case there are polymorphic relationships
   *
   * const todo = new Todo({ title: 'Buy Milk' })
   * todo.dirtyRelationships
   * => Set()
   * todo.note = note1
   * todo.dirtyRelationships
   * => Set('note')
   *
   * @type {Set}
   */
  get dirtyRelationships (): Set<string> {
    const dirtySet: Set<string> = new Set()
    if (this._snapshots.length === 0 || !this.relationshipDefinitions) { return dirtySet }

    const { previousSnapshot, persistedOrFirstSnapshot, toOneDefinitions, toManyDefinitions } = this

    toManyDefinitions.reduce((relationshipSet: Set<string>, [relationshipName]) => {
      const firstData = (persistedOrFirstSnapshot.relationships?.[relationshipName]?.data || []) as JSONAPIDocumentReference[]
      const currentData = (previousSnapshot.relationships?.[relationshipName]?.data || []) as JSONAPIDocumentReference[]

      const isDifferent = firstData.length !== currentData?.length || firstData.some(({ id, type }, i) => currentData[i].id !== id || currentData[i].type !== type)

      if (isDifferent) {
        relationshipSet.add(relationshipName)
      }
      return relationshipSet
    }, dirtySet)

    toOneDefinitions.reduce((relationshipSet: Set<string>, [relationshipName]) => {
      let firstData = persistedOrFirstSnapshot.relationships?.[relationshipName]?.data as JSONAPIDocumentReference
      let currentData = previousSnapshot.relationships?.[relationshipName]?.data as JSONAPIDocumentReference

      const isDifferent = firstData?.id !== currentData?.id || firstData?.type !== currentData?.type

      if (isDifferent) {
        relationshipSet.add(relationshipName)
      }

      return relationshipSet
    }, dirtySet)

    return dirtySet
  }

  /**
   * Have any changes been made since this record was last persisted?
   *
   * @type {boolean}
   */
  get hasUnpersistedChanges (): boolean {
    return this.isDirty || !this.previousSnapshot.persisted
  }

  /**
   * True if the model has not been sent to the store
   *
   * @type {boolean}
   */
  get isNew (): boolean {
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
  isInFlight: boolean = false

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
  errors: { [key: string]: IErrorMessage[] } = {}

  /**
   * a list of snapshots that have been taken since the record was either last persisted or since it was instantiated
   *
   * @property _snapshots
   * @type {Array<Snapshot>}
   * @default []
   */
  _snapshots: ISnapshot[] = []

  /**
   * Initializes observable attributes and relationships
   *
   * @param {object} initialProperties attributes
   */
   initialize (initialProperties: IInitialProperties) {
    const { ...attributes } = initialProperties

    makeObservable(this, mobxAnnotations)

    this.initializeAttributes(attributes)
    this.initializeRelationships()

    this.takeSnapshot({ persisted: !this.isNew })
    this.initialized = true
  }

  /**
   * Sets initial attribute properties
   *
   * @param {object} overrides data that will be set over defaults
   */
  initializeAttributes (overrides: { [key: string]: any }) {
    const { attributeDefinitions } = this

    const attributes = Object.keys(attributeDefinitions).reduce((object: { [key: string]: any }, attributeName: string) => {
      object[attributeName] = overrides[attributeName] === undefined ? attributeDefinitions[attributeName].defaultValue : overrides[attributeName]
      return object
    }, {})

    extendObservable(this, attributes)
  }

  /**
   * Initializes relationships based on the `relationships` hash.
   */
  initializeRelationships () {
    const { store, toOneDefinitions, toManyDefinitions } = this

    const toOneRelationships = defineToOneRelationships(this as ModelClass, store, toOneDefinitions)
    const toManyRelationships = defineToManyRelationships(this as ModelClass, store, toManyDefinitions)

    extendObservable(this, toOneRelationships)
    extendObservable(this, toManyRelationships)
  }

  get toOneDefinitions (): [string, IRelationshipDefinition][] {
    return definitionsByDirection(this as ModelClass, 'toOne')
  }

  get toManyDefinitions (): [string, IRelationshipDefinition][] {
    return definitionsByDirection(this as ModelClass, 'toMany')
  }

  /**
   * restores data to its last persisted state or the oldest snapshot
   * state if the model was never persisted
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
    this._applySnapshot(this.persistedOrFirstSnapshot)
    this.takeSnapshot({ persisted: true })
  }

  /**
   * restores data to its last state
   * state if the model was never persisted
   */
  undo () {
    this._applySnapshot(this.previousSnapshot)
  }

  /**
   * creates or updates a record.
   *
   * @param {object} options query params and sparse fields to use
   * @returns {Promise} the persisted record
   */
  async save (options: { skip_validations?: boolean, queryParams?: IQueryParams, relationships?: string[], attributes?: string[] } = {}): Promise<ModelClass> {
    if (!options.skip_validations && !this.validate(options)) {
      const errorString = JSON.stringify(this.errors)
      throw new Error(errorString)
    }

    const {
      queryParams,
      relationships,
      attributes
    } = options

    const {
      type,
      id,
      isNew,
      dirtyRelationships,
      dirtyAttributes
    } = this

    const hasAttributesToSave = dirtyAttributes.size > 0
    const hasRelationshipsToSave = relationships && dirtyRelationships.size > 0

    if (!isNew && !hasAttributesToSave && !hasRelationshipsToSave) {
      return Promise.resolve(this)
    }

    const requestId = isNew ? undefined : id
    const method = isNew ? 'POST' : 'PATCH'

    const url = this.store.fetchUrl(type, queryParams, requestId)

    const body = JSON.stringify({
      data: this.jsonapi({ relationships, attributes })
    })

    if (relationships) {
      relationships.forEach((rel) => {
        if (Array.isArray(this[rel])) {
          this[rel].forEach((item: ModelClass, i: number) => {
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
    const result = await this.store.updateRecordsFromResponse(response, [this])
    this.takeSnapshot({ persisted: true })

    return result[0]
  }

  /**
   * Replaces the record with the canonical version from the server.
   *
   * @param {object} options props to use for the fetch
   * @returns {Promise} the refreshed record
   */
  async reload (options: IRequestParamsOpts = {}): Promise<ModelClass> {
    const { type, id, isNew } = this

    if (isNew || !id) {
      this.rollback()
    } else {
      this.store.fetchOne(type, id, options)
        .catch((error) => {
          console.error('Reload Failed', error)
          return this
        })
    }
    return this
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
  validate (options: { attributes?: string[], relationships?: string[] } = {}): boolean {
    this.errors = {}
    const { attributeDefinitions, relationshipDefinitions, _validateProperties } = this

    const attributeNames = options.attributes || Object.keys(attributeDefinitions)
    const relationshipNames = options.relationships || this.relationshipNames

    const validAttributes = _validateProperties(attributeNames, attributeDefinitions)
    const validRelationships = _validateProperties(relationshipNames, relationshipDefinitions)

    return validAttributes.concat(validRelationships).every((value) => value)
  }

  /**
   * Maps the passed-in property names through and runs validations against those properties
   *
   * @param {object} model the model to check
   * @param {Array} propertyNames the names of the model properties to check
   * @param {object} propertyDefinitions a hash map containing validators by property
   * @returns {Array} an array of booleans representing results of validations
   * @private
   */
  _validateProperties (propertyNames: string[], propertyDefinitions: { [key: string]: IAttributeDefinition|IRelationshipDefinition }): boolean[] {
    return propertyNames.map((propertyName) => {
      if (propertyDefinitions) {
        const { validator } = propertyDefinitions[propertyName]

        if (!validator) return true

        const validationResult: ValidationResult = validator(this[propertyName], this, propertyName)

        if (!validationResult.isValid) {
          this.errors[propertyName] = validationResult.errors
        }

        return validationResult.isValid
      } else return true
    })
  }

  /**
   * deletes a record from the store and server
   *
   * @param {object} options params and option to skip removal from the store
   * @returns {Promise} an empty promise with any success/error status
   */
  destroy (options: { params?: {} | undefined; skipRemove?: boolean } = {}): Promise<this|void> {
    const { type, id, isNew, store } = this

    if (isNew && id) {
      store.remove(type, id)
      return Promise.resolve(this)
    }

    const { params = {}, skipRemove = false } = options

    const url = store.fetchUrl(type, params, id)
    this.isInFlight = true
    const promise = store.fetch(url, { method: 'DELETE' })
    this.errors = {}

    return promise.then(
      async (response: Response) => {
        this.isInFlight = false
        if ([200, 202, 204].includes(response.status)) {
          if (!skipRemove && id) {
            store.remove(type, id)
          }

          let json: JSONAPISingleDocument

          try {
            json = await response.json()
            
            runInAction(() => {
              const attributes: IObjectWithAny | void = json.data?.attributes
              if (attributes) {
                Object.entries(attributes).forEach(([key, value]) => {
                  this[key] = value
                })
              }

              // NOTE: If deleting a record changes other related model
              // You can return then in the delete response
              if (json?.included) {
                store.createOrUpdateModelsFromData(json.included)
              }
            })
          } catch (err) {
            console.log(err)
            // It is text, do you text handling here
          }

          return this
        } else {
          const errors = await parseErrors(response, store.errorMessages)
          throw new Error(JSON.stringify(errors))
        }
      },
      (error: Error) => {
        // TODO: Handle error states correctly
        this.isInFlight = false
        throw error
      }
    )
  }

   /* Private Methods */

  /**
   * the latest snapshot
   *
   * @type {object}
   */
  get previousSnapshot (): ISnapshot {
    const length = this._snapshots.length
    // if (length === 0) throw new Error('Invariant violated: model has no snapshots')
    return this._snapshots[length - 1]
  }

  /**
   * the latest persisted snapshot or the first snapshot if the model was never persisted
   *
   * @type {object}
   */
  get persistedOrFirstSnapshot (): ISnapshot {
    return findLast(this._snapshots, (ss: ISnapshot) => ss.persisted) || this._snapshots[0]
  }

  /**
   * take a snapshot of the current model state.
   * if persisted, clear the stack and push this snapshot to the top
   * if not persisted, push this snapshot to the top of the stack
   *
   * @param {object} options options to use to set the persisted state
   */
  takeSnapshot (options: { persisted: boolean } = { persisted: false }): void {
    const { store, _snapshots } = this
    if (store.pauseSnapshots && _snapshots.length > 0) { return }
    const properties = cloneDeep(pick(this, ['attributes', 'relationships']))

    _snapshots.push({
      persisted: options.persisted,
      ...properties
    })
  }

  /**
   * Sets `_snapshots` to an empty array
   */
  clearSnapshots () {
    this._snapshots = []
  }

  /**
   * set the current attributes and relationships to the attributes
   * and relationships of the snapshot to be applied. also reset errors
   *
   * @param {object} snapshot the snapshot to apply
   */
  protected _applySnapshot (snapshot: ISnapshot): void {
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
  get type (): string {
    return (this.constructor as typeof Model).type
  }

  /**
   * current attributes of record
   *
   * @type {object}
   */
  get attributes () {
    return this.attributeNames.reduce((attributes: { [key: string]: any }, key: string) => {
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
  get attributeDefinitions (): { [key: string]: IAttributeDefinition } {
    return (this.constructor as typeof Model).attributeDefinitions || {}
  }

  /**
   * Getter find the relationship definitions for the model type.
   *
   * @type {object}
   */
  get relationshipDefinitions (): { [key: string]: IRelationshipDefinition } {
    return (this.constructor as typeof Model).relationshipDefinitions || {}
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
  errorForKey (key: string): IErrorMessage[] {
    return this.errors[key]
  }

  /**
   * Getter to just get the names of a records attributes.
   *
   * @returns {Array} the keys of the attribute definitions
   */
  get attributeNames (): string[] {
    return Object.keys(this.attributeDefinitions)
  }

  /**
   * Getter to just get the names of a records relationships.
   *
   * @returns {Array} the keys of the relationship definitions
   */
  get relationshipNames (): string[] {
    return Object.keys(this.relationshipDefinitions)
  }

  /**
   * getter method to get the default attributes
   *
   * @returns {object} key / value of attributes and defaults
   */
  get defaultAttributes () {
    const { attributeDefinitions } = this
    return this.attributeNames.reduce((defaults: { [key: string]: any }, key: string) => {
      const { defaultValue } = attributeDefinitions[key]
      defaults[key] = defaultValue
      return defaults
    }, {})
  }

  /**
   * getter method to get data in api compliance format
   * TODO: Figure out how to handle unpersisted ids
   *
   * @param {object} options serialization options
   * @returns {object} data in JSON::API format
   */
  jsonapi (options: IRequestParamsOpts = {}): IDOptionalJSONAPIDataObject {
    const {
      attributeDefinitions,
      attributeNames,
      meta,
      id,
      type
    } = this

    let filteredAttributeNames = attributeNames
    let filteredRelationshipNames = []

    if (options.attributes) {
      filteredAttributeNames = attributeNames
        .filter(name => options.attributes?.includes(name))
    }

    const attributes = filteredAttributeNames.reduce((attrs: { [key: string]: any }, key) => {
      const rawValue = this[key]
      const needsTransformation = typeof rawValue !== 'undefined' && attributeDefinitions[key].transformer

      attrs[key] = needsTransformation ? attributeDefinitions[key].transformer?.(rawValue) : rawValue
      return attrs
    }, {})

    const data: IDOptionalJSONAPIDataObject = {
      type,
      attributes,
      id,
      relationships: {}
    }

    const validNames = this.relationshipNames

    options.relationships?.forEach((relationshipName) => {
      if(validNames.includes(relationshipName) && data?.relationships != null) {
        data.relationships[relationshipName] = toJS(this.relationships[relationshipName])
      } else {
        console.error(`Relationship ${relationshipName} does not exist`)
      }
    })

    if (meta) {
      data.meta = meta
    }

    if (String(id).match(/tmp/)) {
      delete data.id
    }

    return data
  }

  /**
   * Updates attributes of this record via a key / value hash
   *
   * @param {object} attributes the attributes to update
   */
  updateAttributes (attributes: { [x: string]: string }): void {
    const { attributeNames } = this
    const validAttributes = pick(attributes, attributeNames)

    Object.entries(validAttributes).forEach(([key, value]) => (this[key] = value))
  }

  /**
   * Comparison by identity
   * returns `true` if this object has the same type and id as the
   * "other" object, ignores differences in attrs and relationships
   *
   * @param {IModel} other other model object
   * @returns {boolean} if this object has the same type and id
   */
  isSame (other: IModel | JSONAPIDocumentReference | null | void) {
    if (!other) return false
    return this.type === other.type && this.id === other.id
  }
}

export default Model
