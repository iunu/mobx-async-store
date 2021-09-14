import Store from './Store'
import clone from 'lodash/clone'
import times from 'lodash/times'

/**
 * A class to create and use factories
 * @class FactoryFarm
 */
class FactoryFarm {
  constructor (store) {
    this.store = store || new Store()
    this.store.__usedForFactoryFarm__ = true
  }

  /**
   * A hash of available factories. A factory is an object with a structure like:
   * { name, type, attributes, relationships }.
   * @property factories
   * @type {Object}
   */
  factories = {}

  /**
   * A hash of singleton objects.
   * @property factories
   * @type {Object}
   */
  singletons = {}

  /**
   * Allows easy building of ArtemisStore objects, including relationships.
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
   * @method build
   * @param {String} factoryName the name of the factory to use
   * @param {Object} overrideOptions overrides for the factory
   * @param {Number} numberOfRecords optional number of models to build
   * @return {Object} instance of an ArtemisStore model
   */
  build (factoryName, overrideOptions = {}, numberOfRecords = 1) {
    const { store, factories, singletons, _verifyFactory, _buildModel } = this
    _verifyFactory(factoryName)
    const { type, ...properties } = factories[factoryName]

    const newModelProperties = {
      id: (i) => String(store.getAll(type).length + i + 1),
      ...properties,
      ...overrideOptions
    }

    let identity = false
    if (newModelProperties.identity) {
      if (typeof newModelProperties.identity === 'string') {
        identity = newModelProperties.identity
      } else {
        identity = factoryName
      }
      delete newModelProperties.identity
      if (numberOfRecords === 1) {
        if (singletons[identity]) return singletons[identity]
      }
    }

    let addProperties

    if (numberOfRecords > 1) {
      addProperties = times(numberOfRecords, (i) => _buildModel(factoryName, newModelProperties, i))
    } else {
      addProperties = _buildModel(factoryName, newModelProperties)
    }

    const results = store.add(type, addProperties)

    if (identity) {
      singletons[identity] = results
    }

    return results
  }

  /**
   * Creates a factory with { name, type, parent, ...attributesAndRelationships }, which can be used for
   * building test data.
   * The factory is named, with a set of options to use to configure it.
   *   * parent - use another factory as a basis for this one
   *   * type - the type of model to use (for use if no parent)
   *   * identity - whether this factory should be a singleton
   * attributesAndRelationships - attributes and relationships. If properties are a function or an array of functions, they
   *   will be executed at runtime.
   *
   * @method define
   * @param {String} name the name to use for the factory
   * @param {Object} options
   */
  define (name, options = {}) {
    const { type, parent, ...properties } = options

    let factory

    if (parent) {
      const fromFactory = this.factories[parent]

      if (!fromFactory) {
        throw new Error(`Factory ${parent} does not exist`)
      }

      factory = {
        ...fromFactory,
        ...properties
      }
    } else {
      factory = {
        type,
        ...properties
      }
    }

    this.factories[name] = factory
  }

  /**
   * Alias for `this.store.add`
   * @method add
   * @param  {...any} params
   * @return {*} object or array
   */
  add = (...params) => this.store.add(...params)

  /**
   * Verifies that the requested factory exists
   * @method _verifyFactory
   * @param {String} factoryName
   * @private
   */
  _verifyFactory = (factoryName) => {
    const factory = this.factories[factoryName]

    if (!factory) {
      throw new Error(`Factory ${factoryName} does not exist`)
    }
  }

  /**
   * Builds model properties that will be used for creating models. Since factories can use
   * functions to define relationships, it loops through properties and attempts to execute any functions.
   *
   * @method _buildModel
   * @param {String} factoryName
   * @param {Object} properties
   * @param {Number} index
   * @return {Object} an object of properties to be used.
   * @private
   */
  _buildModel = (factoryName, properties, index = 0) => {
    properties = clone(properties)
    Object.keys(properties).forEach((key) => {
      if (Array.isArray(properties[key])) {
        properties[key] = properties[key].map((propDefinition) => {
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
   * @method _callPropertyDefinition
   * @param {*} definition
   * @param {Number} index
   * @param {String} factoryName
   * @param {Object} properties
   * @return {*}
   */
  _callPropertyDefinition = (definition, index, factoryName, properties) => {
    return typeof definition === 'function' ? definition.call(this, index, factoryName, properties) : definition
  }
}

export default FactoryFarm
