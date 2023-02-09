import Store from './Store'
import clone from 'lodash/clone'
import times from 'lodash/times'
import { IModelInitOptions, StoreClass } from 'Model'
import { IObjectWithAny, IRecordObject, ModelClass, ModelClassArray } from 'interfaces/global'

export interface IFactoryFarm {
  store?: StoreClass
  factories: { [key: string]: IFactory }
  build(factoryName: string, overrideOptions?: IRecordObject): ModelClass
  build(factoryName: string, overrideOptions: IRecordObject, numberOfRecords: number): ModelClass[]
  build(factoryName: string, overrideOptions?: IRecordObject, numberOfRecords?: number): ModelClass | ModelClass[]
  add (type: string, props: IRecordObject, options?: IModelInitOptions): ModelClass
  add (type: string, props: IRecordObject[], options?: IModelInitOptions): ModelClassArray
  add (type: string, props: IRecordObject | IRecordObject[], options?: IModelInitOptions): ModelClass | ModelClassArray
  define(name: string, options?: IDefineOptions): void
  __usedForMockServer__?: boolean
}

export interface IDefineOptions {
  type?: string
  parent?: string
  [key: string]: any
}

export interface IFactory {
  type: string
  [key: string]: any
}

export interface IModelBuilder {
  [key: string]: Function | any
}

/**
 * A class to create and use factories
 *
 * @class FactoryFarm
 */
class FactoryFarm implements IFactoryFarm {
  /**
   * Sets up the store, and a private property to make it apparent the store is used
   * for a FactoryFarm
   *
   * @param {object} store the store to use under the hood
   */
  constructor (store: StoreClass | void) {
    this.store = store || new Store()
    this.store.__usedForFactoryFarm__ = true
  }

  store: StoreClass

  /**
   * A hash of available factories. A factory is an object with a structure like:
   * { name, type, attributes, relationships }.
   *
   * @type {object}
   */
  factories: { [key: string]: IFactory } = {}

  /**
   * A hash of singleton objects.
   *
   * @type {object}
   */
  singletons: {
    [key: string]: ModelClass
  } = {}

  /**
   * Allows easy building of multipleStore objects, including relationships.
   * 
   * @param {string} factoryName the name of the factory to use
   * @param {object} overrideOptions overrides for the factory
   * @returns {object} instance of an Store model
   */
  build (factoryName: string, overrideOptions: object): ModelClass
  /**
   * Allows easy building of multipleStore objects, including relationships.
   * 
   * @param {string} factoryName the name of the factory to use
   * @param {object} overrideOptions overrides for the factory
   * @param {number} numberOfRecords number of models to build
   * @returns {object} instance of an Store model
   */
  build (factoryName: string, overrideOptions: object, numberOfRecords: number): ModelClass[]
  /**
   * Allows easy building of Store objects, including relationships.
   * Takes parameters `attributes` and `relationships` to use for building.
   *
   *   const batchAction = store.build('cropBatchAction')
   *   store.build('basilBatch', {
   *     arbitrary_id: 'new_id'
   *     zone: 'bay1',
   *     crop_batch_actions: [
   *       batchAction,
   *       store.build('batchAction')
   *     ]
   *   })
   *
   * @param {string} factoryName the name of the factory to use
   * @param {object} overrideOptions overrides for the factory
   * @param {number} numberOfRecords optional number of models to build
   * @returns {object} instance of an Store model
   */
  build (factoryName: string, overrideOptions = {}, numberOfRecords?: number): ModelClass | ModelClass[] {
    const { store, factories, singletons, _verifyFactory, _buildModel } = this
    _verifyFactory(factoryName)
    const { type, ...properties } = factories[factoryName]

    const newModelProperties: IModelBuilder = {
      /**
       * Increments the id for the type based on ids already present
       *
       * @param {number} index the number that will be used to create an id
       * @returns {number} an incremented number related to the latest id in the store
       */
      id: (index: number) => String(store.getAll(type).length + index + 1),
      ...properties,
      ...overrideOptions
    }

    let identity: string = factoryName
    if (newModelProperties.identity) {
      if (typeof newModelProperties.identity === 'string') {
        identity = newModelProperties.identity
      }

      delete newModelProperties.identity
      if (typeof numberOfRecords === 'undefined' && singletons[identity]) {
        return singletons[identity]
      }
    }

    if (typeof numberOfRecords !== 'undefined') {
      const addProperties = times(numberOfRecords, (i) => _buildModel(factoryName, newModelProperties, i))
      return store.add(type, addProperties)
    }
    
    const addProperties = _buildModel(factoryName, newModelProperties)
    const result = store.add(type, addProperties) as ModelClass

    if (identity) {
      singletons[identity] = result
    }

    return result
  }

  /**
   * Creates a factory with { name, type, parent, ...attributesAndRelationships }, which can be used for
   * building test data.
   * The factory is named, with a set of options to use to configure it.
   *   - parent - use another factory as a basis for this one
   *   - type - the type of model to use (for use if no parent)
   *   - identity - whether this factory should be a singleton
   * attributesAndRelationships - attributes and relationships. If properties are a function or an array of functions, they
   *   will be executed at runtime.
   *
   * @param {string} name the name to use for the factory
   * @param {object} options options that can be used to configure the factory
   */
  define (name: string, options: IDefineOptions = {}): void {
    const { type, parent, ...properties } = options

    if (parent) {
      const fromFactory = this.factories[parent]

      if (!fromFactory) {
        throw new Error(`Factory ${parent} does not exist`)
      }

      this.factories[name] = {
        ...fromFactory,
        ...properties
      }
    } else if (type) {
      this.factories[name] = {
        type,
        ...properties
      }
    }
  }

  /* eslint-disable jsdoc/require-jsdoc */
  /**
   * Alias for `this.store.add`
   *
   * @param {string} type the model type
   * @param {object|Array} props the properties to use
   * @param {object} options currently supports `skipInitialization`
   * @returns {ModelClass|ModelClassArray} the new record or records
   */
  add (type: string, props: IRecordObject, options?: IModelInitOptions): ModelClass
  add (type: string, props: IRecordObject[], options?: IModelInitOptions): ModelClassArray
  add (type: string, props: IRecordObject | IRecordObject[], options?: IModelInitOptions): ModelClass | ModelClassArray {
    return this.store.add(type, props, options)
  }
  /* eslint-enable jsdoc/require-jsdoc */

  /**
   * Verifies that the requested factory exists
   *
   * @param {string} factoryName the name of the factory
   * @private
   */
  private _verifyFactory = (factoryName: string) => {
    const factory = this.factories[factoryName]

    if (!factory) {
      throw new Error(`Factory ${factoryName} does not exist`)
    }
  }

  /**
   * Builds model properties that will be used for creating models. Since factories can use
   * functions to define relationships, it loops through properties and attempts to execute any functions.
   *
   * @param {string} factoryName the name of the factory
   * @param {object} properties properties to build the object
   * @param {number} index a number that can be used to build the object
   * @returns {object} an object of properties to be used.
   * @private
   */
  private _buildModel (factoryName: string, properties: IObjectWithAny, index = 0) {
    properties = clone(properties)
    Object.keys(properties).forEach((key) => {
      if (Array.isArray(properties[key])) {
        properties[key] = properties[key].map((propDefinition: any) => {
          return this._callPropertyDefinition(propDefinition, index, factoryName, properties)
        })
      } else {
        properties[key] = this._callPropertyDefinition(properties[key], index, factoryName, properties)
      }
    })
    return properties
  }

  /**
   * If `definition` is a function, calls the function. Otherwise, returns the definition.
   *
   * @param {*} definition a property or function
   * @param {number} index an index to be passed to the called function
   * @param {string} factoryName the name of the factory
   * @param {object} properties properties to be passed to the executed function
   * @returns {*} a definition or executed function
   * @private
   */
  private _callPropertyDefinition = (definition: any, index: number, factoryName: string, properties: IObjectWithAny) => {
    return typeof definition === 'function' ? definition.call(this, index, factoryName, properties) : definition
  }
}

export default FactoryFarm
