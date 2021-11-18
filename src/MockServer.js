/* global fetch Response */
import FactoryFarm from './FactoryFarm'
import { serverResponse } from './testUtils'

const simulatePost = (store, type, body) => {
  const { attributes } = JSON.parse(body.toString()).data
  const id = String(store.getAll(type).length + 1)

  const attributesWithId = { ...attributes, id }

  return store.add(type, attributesWithId)
}

const simulatePatch = (store, type, body) => {
  const { data } = JSON.parse(body.toString())
  const record = store.getOne(type, String(data.id))
  record.updateAttributesFromResponse(data)
  return record
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
 * @method circularFetchError
 * @param {String} url
 */
const circularFetchError = (url, options) => {
  throw new Error(
    `You tried to call fetch from MockServer with ${options.method} ${url}, which is circular and would call itself. This was caused by calling a method such as 'save' on a model that was created from MockServer. To fix the problem, use FactoryFarm without MockServer`
  )
}

/**
 * Throws an error if MockServer tries to `findOne` or `findAll` from itself.
 * @method circularFindError
 * @param {String} type
 * @param {String} id
 */
const circularFindError = (type, id) => {
  const idText = id ? ` with id ${id}` : ''
  throw new Error(
    `You tried to find ${type}${idText} from MockServer which is circular and would call itself. To fix the problem, use FactoryFarm without MockServer`
  )
}

/**
 * Overrides store methods that could trigger a `fetch` to throw errors. MockServer should only provide data for fetches, never call a fetch itself.
 * @method disallowFetches
 * @param {Object} store
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
 * @method wrapResponse
 * @param {*} response JSON string
 * @param {String} method
 * @param {Number} status
 * @return {Promise}
 */

const wrapResponse = (response, method, status) => {
  if (!status) {
    status = method === 'POST' ? 201 : 200
  }

  return Promise.resolve(new Response(response, { status }))
}

/**
 * A backend "server" to be used for creating jsonapi-compliant responses.
 * @class MockServer
 */
class MockServer {
  /**
   * Sets properties needed internally
   * factoryFarm can be passed into the constructor
   * @method constructor
   * @param {*} param
   */
  constructor (options = {}) {
    this._backendFactoryFarm = options.factoryFarm || new FactoryFarm()
    this._backendFactoryFarm.__usedForMockServer__ = true
    this._backendFactoryFarm.store.__usedForMockServer__ = true

    this.responseOverrides = options.responseOverrides

    disallowFetches(this._backendFactoryFarm.store)
  }

  /**
   * Sets up fetch mocking to intercept requests. It will then either use overrides, or use its own
   * internal store to simulate serving JSON responses of new data.
   *   - responseOverrides: An array of alternative responses that can be used to override the ones that would be served
   *     from the internal store.
   *   - factoriesForTypes: A key map that can be used to build factories if a queried id does not exist
   * @method start
   * @param {Object} options currently `responseOverrides` and `factoriesForTypes`
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
        ? foundQuery.response(this)
        : serverResponse(this._findFromStore(req, factoriesForTypes))

      return wrapResponse(response, req.method, foundQuery?.status)
    })
  }

  /**
   * Clears mocks and the store
   * @method stop
   */
  stop = () => {
    fetch.resetMocks()
    this._backendFactoryFarm.store.reset()
  }

  /**
   * Alias for `this._backendFactoryFarm.build`
   * @method build
   * @param {String} factoryName the name of the factory to use
   * @param {Object} overrideOptions overrides for the factory
   * @param {Number} numberOfRecords optional number of models to build
   * @return {*} Object or Array
   */
  build = (...params) => this._backendFactoryFarm.build(...params)

  /**
   * Alias for `this._backendFactoryFarm.define`
   * @method define
   * @param {String} name the name to use for the factory
   * @param {Object} options
   * @return {*} Object or Array
   */
  define = (...params) => this._backendFactoryFarm.define(...params)

  /**
   * Alias for `this._backendFactoryFarm.add`
   * @method add
   * @param {String} name the name to use for the factory
   * @param {Object} options
   * @return {*} Object or Array
   */
  add = (...params) => this._backendFactoryFarm.add(...params)

  /**
   * Based on a request, simulates building a response, either using found data
   * or a factory.
   * @method _findFromStore
   * @param {*} req
   * @return {Object} the found or built store record(s)
   * @private
   */
  _findFromStore = (req, factoriesForTypes = {}) => {
    const { _backendFactoryFarm } = this
    const { method, url, body } = req
    const { store } = _backendFactoryFarm

    const { pathname } = new URL(url, 'http://example.com')

    const type = Object.keys(store.schema.structure).find((model_type) => pathname.match(model_type))
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
