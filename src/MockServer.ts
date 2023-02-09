import { IRecordObject, ModelClass, ModelClassArray } from 'interfaces/global'
import { IModelInitOptions, StoreClass } from 'Model'
import Store, { IRESTTypes } from './Store'
import FactoryFarm, { IDefineOptions, IFactoryFarm } from './FactoryFarm'
import { serverResponse } from './testUtils'
import { FetchMock, MockResponseInit } from 'jest-fetch-mock'
const fetchMock = fetch as FetchMock;

interface IStartOptions {
  responseOverrides?: IResponseOverride[]
  factoriesForTypes?: { [key: string]: string }
}

/**
 * Finds or creates a model that will match an id. This is useful for
 * creating a response on the fly if no object already exists
 *
 * @param {object} _backendFactoryFarm the private factory farm
 * @param {object} factory the name of the factory to use
 * @param {string} type the model type
 * @param {string} id the id to find
 * @returns {object} a Model object
 */
const getOneFromFactory = (_backendFactoryFarm: IFactoryFarm, factory: string | void, type: string, id: string) => {
  const factoryName =
    factory ||
    Object.keys(_backendFactoryFarm.factories).find(
      (factoryName) => _backendFactoryFarm.factories[factoryName].type === type
    )
  if (!factoryName) {
    throw new Error(`No default factory for ${type} exists`)
  }
  return _backendFactoryFarm.build(factoryName, { id })
}

/**
 * Will throw an error if `fetch` is called from the mockServer, usually due to a `POST` or `PATCH` called by a `save`
 *
 * @param {string} url the url that is attempted
 * @param {object} fetchOptions options including the http method
 */
const circularFetchError = (url: RequestInfo, fetchOptions: RequestInit): never => {
  throw new Error(
    `You tried to call fetch from MockServer with ${fetchOptions.method} ${url}, which is circular and would call itself. This was caused by calling a method such as 'save' on a model that was created from MockServer. To fix the problem, use FactoryFarm without MockServer`
  )
}

/**
 * Throws an error if MockServer tries to `findOne` or `findAll` from itself.
 *
 * @param {string} type the model type
 * @param {string} id the model id
 */
const circularFindError = (type: string, id?: string): never => {
  const idText = id ? ` with id ${id}` : ''
  throw new Error(
    `You tried to find ${type}${idText} from MockServer which is circular and would call itself. To fix the problem, use FactoryFarm without MockServer`
  )
}

/**
 * Wraps response JSON or object in a Response object that is itself wrapped in a
 * resolved Promise. If no status is given then it will fill in a default based on
 * the method.
 *
 * @param {string} response JSON string
 * @param {string} method the http method
 * @param {number} status the http status
 * @returns {Promise} a promise wrapping the response
 */
const wrapResponse = (response: string, method: IRESTTypes | string, status: number | void): Promise<any> => {
  if (!status) {
    status = method === 'POST' ? 201 : 200
  }

  // typing as `any` because jest-fetch-mock MockResponseInit type doesn't accept Response
  // https://github.com/jefflau/jest-fetch-mock/pull/223
  return Promise.resolve(new Response(response, { status }))
}

export interface IMockServer {
  _backendFactoryFarm: IFactoryFarm
}

interface IResponseOverride {
  path: string
  response(server: IMockServer, request: Request): any
  method?: string
  status?: number
}

interface IMockServerInitOptions {
  factoryFarm?: IFactoryFarm
  store?: StoreClass
  responseOverrides?: IResponseOverride[]
}

const DISALLOWED_METHODS: (string | symbol)[] = [
  'findOne', 'findAll', 'findMany', 'fetchOne', 'fetchAll', 'fetchMany'
]


/**
 * A backend "server" to be used for creating jsonapi-compliant responses.
 */
class MockServer {
  _backendFactoryFarm: IFactoryFarm
  responseOverrides: IResponseOverride[]
  /**
   * Sets properties needed internally
   *   - factoryFarm: a pre-existing factory to use on this server
   *   - responseOverrides: An array of alternative responses that can be used to override the ones that would be served
   *     from the internal store.
   *
   * @param {object} options currently `responseOverrides` and `factoriesForTypes`
   */
  constructor (options: IMockServerInitOptions = {}) {
    const store = options.store || options.factoryFarm?.store || new Store()

    const backendStore: StoreClass = new Proxy(store, {
      get: function(target, property) {
        if (DISALLOWED_METHODS.includes(property)) {
          return circularFindError
        } else if (property === 'fetch') {
          return circularFetchError
        } else if (property === '__usedForMockServer__') {
          return true
        }
        return Reflect.get(target, property);
      }
    })

    this._backendFactoryFarm = options.factoryFarm || new FactoryFarm()
    this._backendFactoryFarm.store = backendStore

    this.responseOverrides = options.responseOverrides || []
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
  respond (options: IResponseOverride) {
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
  start (options: IStartOptions = {}) {
    const { factoriesForTypes } = options
    const combinedOverrides = [...options.responseOverrides || [], ...this.responseOverrides || []]

    fetchMock.resetMocks()
    fetchMock.mockResponse((req: Request): Promise<MockResponseInit> => {
      const foundQuery = combinedOverrides.find((definition) => {
        if (!definition?.path) {
          throw new Error('No path defined for mock server override. Did you define a path?')
        }

        const method = definition.method || 'GET'
        return req.url.match(definition.path) && req.method?.match(method)
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
  stop () {
    fetchMock.resetMocks()
    this._backendFactoryFarm.store?.reset()
  }

  /* eslint-disable jsdoc/require-jsdoc */
  /**
   * Alias for `_backendFactoryFarm.build`
   *
   * @param {string} factoryName the name of the factory to use
   * @param {object} overrideOptions overrides for the factory
   * @param {number} numberOfRecords optional number of models to build
   * @returns {object} instance of an Store model
   */
  build (factoryName: string, overrideOptions: object): ModelClass
  build (factoryName: string, overrideOptions: object, numberOfRecords: number): ModelClass[]
  build (factoryName: string, overrideOptions = {}, numberOfRecords?: number): ModelClass | ModelClass[] {
    return this._backendFactoryFarm.build(factoryName, overrideOptions, numberOfRecords)
  }

  /**
   * Alias for `this._backendFactoryFarm.define`
   *
   * @param {string} name the name to use for the factory
   * @param {object} options options for defining a factory
   * @returns {*} Object or Array
   */
  define (name: string, options?: IDefineOptions): void {
    return this._backendFactoryFarm.define(name, options)
  }

  /**
   * Alias for `this._backendFactoryFarm.add`
   *
   * @param {string} name the name to use for the factory
   * @param {object} options properties and other options for adding a model to the store
   * @returns {*} Object or Array
   */
  add (type: string, props: IRecordObject, options?: IModelInitOptions): ModelClass
  add (type: string, props: IRecordObject[], options?: IModelInitOptions): ModelClassArray
  add (type: string, props: IRecordObject | IRecordObject[], options?: IModelInitOptions): ModelClass | ModelClassArray {
    return this._backendFactoryFarm.add(type, props, options)
  }
  /* eslint-enable jsdoc/require-jsdoc */

  /**
   * Based on a request, simulates building a response, either using found data
   * or a factory.
   *
   * @param {object} req a method, url and body
   * @param {object} factoriesForTypes allows an override for a particular type
   * @returns {ModelClass | void} the found or built store record(s)
   * @private
   */
  private _findFromStore (req: Request, factoriesForTypes: { [key: string]: string } = {}): ModelClass | ModelClass[] | void {
    const { _backendFactoryFarm } = this
    const { method, url, body } = req
    const { store } = _backendFactoryFarm
    if (!store) { return }

    const { pathname } = new URL(url, 'http://example.com')
    const type = Object.keys(store.data).find((model_type) => pathname.match(model_type))

    const id = pathname.match(/\d+$/)

    if (method === 'POST' || method === 'PATCH') {
      if (typeof type === 'undefined' || body == null) { return undefined }
      const { data } = JSON.parse(body.toString())

      if (Array.isArray(data)) {
        return store.createOrUpdateModelsFromData(data)
      } else {
        return store.createOrUpdateModelFromData(data)
      }
    // } else if (method === 'PATCH') {
    //   return simulatePatch(store, body)
    } else if (id !== null) {
      if (typeof type === 'undefined') { return undefined }
      return store.getOne(type, String(id)) || getOneFromFactory(_backendFactoryFarm, factoriesForTypes[type], type, String(id))
    } else {
      if (typeof type === 'undefined') { return [] }
      const records = store.getAll(type)
      return records.length > 0
        ? records
        : (factoriesForTypes[type] && [getOneFromFactory(_backendFactoryFarm, factoriesForTypes[type], type, '1')]) ||
            []
    }
  }
}

export default MockServer


// type Modify<T, R> = Omit<T, keyof R> & R;

// interface IMockServerStore extends Modify<IStore, {
//   fetch(url: RequestInfo, fetchOptions: RequestInit): Promise<Response|Error>
//   findOne(type?: string, id?: string): Promise<Error | ModelClass>
//   findAll(type?: string): Promise<Error | ModelClass>
//   findMany(type: string, id?: string): void
//   fetchOne(type: string, id?: string): void
//   fetchAll(type: string, id?: string): void
//   fetchMany(type: string, id?: string): void
// }> {}

// class MockServerStore extends Store implements IMockServerStore {
//   fetch: (url: RequestInfo, fetchOptions: RequestInit) => Promise<Response|Error> = circularFetchError
//   findOne: (type: string, id: string) => Promise<Error | ModelClass> = circularFindError
//   findAll: (type: string) => Promise<Error | ModelClass> = circularFindError
//   findMany: (type: string, id?: string) => void = circularFindError
//   fetchOne: (type: string, id?: string) => void = circularFindError
//   fetchAll: (type: string, id?: string) => void = circularFindError
//   fetchMany: (type: string, id?: string) => void = circularFindError
// }


// /**
//  * Interpret a `POST` request
//  *
//  * @param {object} store the store
//  * @param {string} type the type
//  * @param {string} body json encoded response body
//  * @returns {object|Array} a model or array created from the response
//  */
// const simulatePost = (store: StoreClass, type, body) => {
//   const { data } = JSON.parse(body.toString())

//   if (Array.isArray(data)) {
//     const records = data.map((record) => {
//       const { attributes, relationships = {} } = record
//       const id = String(store.getAll(type).length + 1)

//       const properties = { ...attributes, ...relationships.data, id }
//       return store.add(type, properties)
//     })

//     return records
//   } else {
//     const { attributes, relationships = {} } = data
//     const id = String(store.getAll(type).length + 1)

//     const properties = { ...attributes, ...relationships.data, id }

//     return store.add(type, properties)
//   }
// }

// /**
//  * Interpret a `PATCH` request
//  *
//  * @param {object} store the store
//  * @param {string} type the type
//  * @param {string} body json encoded response body
//  * @returns {object|Array} a model or array created from the response
//  */
// const simulatePatch = (store: StoreClass, body: JSONAPIDataObject | JSONAPIDataObject[]) => {
//   const { data } = JSON.parse(body.toString())

//   if (Array.isArray(data)) {
//     return store.createOrUpdateModelsFromData(data)
//   } else {
//     return store.createOrUpdateModelFromData(data)
//   }
// }
