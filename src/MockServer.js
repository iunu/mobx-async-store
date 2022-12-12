/* global fetch Response */
import FactoryFarm from './FactoryFarm'
import { serverResponse } from './testUtils'

const simulatePost = (store, type, body) => {
  const { data } = JSON.parse(body.toString())

  if (Array.isArray(data)) {
    const records = data.map((record) => {
      const { attributes, relationships = {} } = record
      const id = String(store.getAll(type).length + 1)

      const properties = { ...attributes, ...relationships.data, id }
      return store.add(type, properties)
    })

    return records
  } else {
    const { attributes, relationships = {} } = data
    const id = String(store.getAll(type).length + 1)

    const properties = { ...attributes, ...relationships.data, id }

    return store.add(type, properties)
  }
}

const simulatePatch = (store, type, body) => {
  const { data } = JSON.parse(body.toString())

  if (Array.isArray(data)) {
    return store.createOrUpdateModelsFromData(data)
  } else {
    return store.createOrUpdateModelFromData(data)
  }
}

const getOneFromFactory = (_backendFactoryFarm, factory, type, id) => {
  factory =
    factory ||
    Object.keys(_backendFactoryFarm.factories).find(
      (factoryName) => _backendFactoryFarm.factories[factoryName].type === type
    )
  if (!factory) {
    throw new Error(`No default factory for ${type} exists`)
  }
  return _backendFactoryFarm.build(factory, { id })
}

/**
 * Will throw an error if `fetch` is called from the mockServer, usually due to a `POST` or `PATCH` called by a `save`
 *
 * @param {string} url the url that is attempted
 * @param {object} options options including the http method
 */
const circularFetchError = (url, options) => {
  throw new Error(
    `You tried to call fetch from MockServer with ${options.method} ${url}, which is circular and would call itself. This was caused by calling a method such as 'save' on a model that was created from MockServer. To fix the problem, use FactoryFarm without MockServer`
  )
}

/**
 * Throws an error if MockServer tries to `findOne` or `findAll` from itself.
 *
 * @param {string} type the model type
 * @param {string} id the model id
 */
const circularFindError = (type, id) => {
  const idText = id ? ` with id ${id}` : ''
  throw new Error(
    `You tried to find ${type}${idText} from MockServer which is circular and would call itself. To fix the problem, use FactoryFarm without MockServer`
  )
}

/**
 * Overrides store methods that could trigger a `fetch` to throw errors. MockServer should only provide data for fetches, never call a fetch itself.
 *
 * @param {object} store the internal store
 */
const disallowFetches = (store) => {
  store.fetch = circularFetchError
  store.findOne = circularFindError
  store.findAll = circularFindError
  store.findMany = circularFindError
  store.fetchOne = circularFindError
  store.fetchAll = circularFindError
  store.fetchMany = circularFindError
}

/**
 * Wraps response JSON or object in a Response object that is itself wrapped in a
 * resolved Promise. If no status is given then it will fill in a default based on
 * the method.
 *
 * @param {*} response JSON string
 * @param {string} method the http method
 * @param {number} status the http status
 * @returns {Promise} a promise wrapping the response
 */

const wrapResponse = (response, method, status) => {
  if (!status) {
    status = method === 'POST' ? 201 : 200
  }

  return Promise.resolve(new Response(response, { status }))
}

/**
 * A backend "server" to be used for creating jsonapi-compliant responses.
 */
class MockServer {
  /**
   * Sets properties needed internally
   *   - factoryFarm: a pre-existing factory to use on this server
   *   - responseOverrides: An array of alternative responses that can be used to override the ones that would be served
   *     from the internal store.
   *
   * @param {object} options currently `responseOverrides` and `factoriesForTypes`
   */
  constructor (options = {}) {
    this._backendFactoryFarm = options.factoryFarm || new FactoryFarm()
    this._backendFactoryFarm.__usedForMockServer__ = true
    this._backendFactoryFarm.store.__usedForMockServer__ = true

    this.responseOverrides = options.responseOverrides || []
    disallowFetches(this._backendFactoryFarm.store)
  }

  /**
   * Adds a response override to the server
   *
   * @param {object} options path, method, status, and response to override
   *   - path
   *   - method: defaults to GET
   *   - status: defaults to 200
   *   - response: a method that takes the server as an argument and returns the body of the response
   */
  respond = (options) => {
    this.responseOverrides.push(options)
  }

  /**
   * Sets up fetch mocking to intercept requests. It will then either use overrides, or use its own
   * internal store to simulate serving JSON responses of new data.
   *   - responseOverrides: An array of alternative responses that can be used to override the ones that would be served
   *     from the internal store.
   *   - factoriesForTypes: A key map that can be used to build factories if a queried id does not exist
   *
   * @param {object} options currently `responseOverrides` and `factoriesForTypes`
   */
  start = (options = {}) => {
    const { factoriesForTypes } = options
    const combinedOverrides = [...options.responseOverrides || [], ...this.responseOverrides || []]

    fetch.resetMocks()
    fetch.mockResponse((req) => {
      const foundQuery = combinedOverrides.find((definition) => {
        if (!definition?.path) {
          throw new Error('No path defined for mock server override. Did you define a path?')
        }

        const method = definition.method || 'GET'
        return req.url.match(definition.path) && req.method.match(method)
      })

      const response = foundQuery
        ? foundQuery.response(this, req)
        : serverResponse(this._findFromStore(req, factoriesForTypes))

      return wrapResponse(response, req.method, foundQuery?.status)
    })
  }

  /**
   * Clears mocks and the store
   */
  stop = () => {
    fetch.resetMocks()
    this._backendFactoryFarm.store.reset()
  }

  /**
   * Alias for `this._backendFactoryFarm.build`
   *
   * @param {string} factoryName the name of the factory to use
   * @param {object} overrideOptions overrides for the factory
   * @param {number} numberOfRecords optional number of models to build
   * @returns {*} Object or Array
   */
  build = (factoryName, overrideOptions, numberOfRecords) => this._backendFactoryFarm.build(factoryName, overrideOptions, numberOfRecords)

  /**
   * Alias for `this._backendFactoryFarm.define`
   *
   * @param {string} name the name to use for the factory
   * @param {object} options options for defining a factory
   * @returns {*} Object or Array
   */
  define = (name, options) => this._backendFactoryFarm.define(name, options)

  /**
   * Alias for `this._backendFactoryFarm.add`
   *
   * @param {string} name the name to use for the factory
   * @param {object} options properties and other options for adding a model to the store
   * @returns {*} Object or Array
   */
  add = (name, options) => this._backendFactoryFarm.add(name, options)

  /**
   * Based on a request, simulates building a response, either using found data
   * or a factory.
   *
   * @param {object} req a method, url and body
   * @param {object} factoriesForTypes allows an override for a particular type
   * @returns {object} the found or built store record(s)
   * @private
   */
  _findFromStore = (req, factoriesForTypes = {}) => {
    const { _backendFactoryFarm } = this
    const { method, url, body } = req
    const { store } = _backendFactoryFarm

    const { pathname } = new URL(url, 'http://example.com')
    const type = Object.keys(store.data).find((model_type) => pathname.match(model_type))

    let id = pathname.match(/\d+$/)
    id = id && String(id)

    if (method === 'POST') {
      return simulatePost(store, type, body)
    } else if (method === 'PATCH') {
      return simulatePatch(store, type, body)
    } else if (id) {
      return store.getOne(type, id) || getOneFromFactory(_backendFactoryFarm, factoriesForTypes[type], type, id)
    } else {
      const records = store.getAll(type)
      return records.length > 0
        ? records
        : (factoriesForTypes[type] && [getOneFromFactory(_backendFactoryFarm, factoriesForTypes[type], type, '1')]) ||
            []
    }
  }
}

export default MockServer
