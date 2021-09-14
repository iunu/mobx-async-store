/* global fetch */

import {
  MockServer,
  FactoryFarm,
  Model,
  Store,
  attribute,
  serverResponse
} from '../src/main'

class Todo extends Model {
  static type = 'todos'
  static endpoint = 'todos'

  @attribute(String) title = ''
  @attribute(String) subtitle = ''
}

class AppStore extends Store {
  static types = [Todo]
}

describe('MockServer', () => {
  let store
  let factoryFarm

  beforeEach(() => {
    store = new AppStore()
    const backendStore = new AppStore()
    factoryFarm = new FactoryFarm(backendStore)
  })

  it('finds one from a mocked store', async () => {
    const mockServer = new MockServer({ factoryFarm })
    mockServer.add('todos', { id: '2', title: 'Plant Seeds' })
    mockServer.start()

    const user = await store.fetchOne('todos', '2')
    expect(user.id).toEqual('2')
    expect(user.title).toEqual('Plant Seeds')
  })

  it('"finds" one using a factory when record not defined in store', async () => {
    const mockServer = new MockServer({ factoryFarm })

    mockServer.define('planting', {
      type: 'todos',
      title: 'Plant Seeds'
    })

    mockServer.start()

    const user = await store.fetchOne('todos', '1')
    expect(user.id).toEqual('1')
    expect(user.title).toEqual('Plant Seeds')
  })

  it('finds all from a mocked store', async () => {
    const mockServer = new MockServer({ factoryFarm })
    mockServer.add('todos', { id: '1', title: 'Plant Seeds' })
    mockServer.add('todos', { id: '2', title: 'Harvest Plants' })
    mockServer.start()

    const todos = await store.fetchAll('todos')
    const [boromir, faramir] = todos
    expect(todos).toHaveLength(2)
    expect(boromir.title).toEqual('Plant Seeds')
    expect(faramir.title).toEqual('Harvest Plants')
  })

  it('"finds" all using a factory when record not defined in store', async () => {
    const mockServer = new MockServer({ factoryFarm })

    mockServer.define('planting', {
      type: 'todos',
      title: 'Plant Seeds',
      id: '1'
    })

    mockServer.start({
      factoriesForTypes: {
        todos: 'planting'
      }
    })

    const todos = await store.fetchAll('todos')
    const result = await fetch.mock.results[0].value

    expect(todos).toHaveLength(1)

    const [user] = todos
    expect(user.title).toEqual('Plant Seeds')
    expect(result.body.toString()).toMatch('Plant Seeds')
  })

  it('saves a new model', async () => {
    const mockServer = new MockServer({ factoryFarm })
    mockServer.start()

    const user = store.add('todos', { title: 'Harvest Plants' })
    await user.save()
    expect(user.id).toEqual('1')
    expect(fetch.mock.calls).toHaveLength(1)
  })

  it('updates a model', async () => {
    const mockServer = new MockServer({ factoryFarm })
    mockServer.add('todos', { id: '1', title: 'Plant Seeds' })
    mockServer.start()

    const user = await store.findOne('todos', '1')
    expect(user.title).toEqual('Plant Seeds')

    user.title = 'Harvest Plants'
    await user.save()

    expect(user.id).toEqual('1')
    expect(user.title).toEqual('Harvest Plants')
    expect(fetch.mock.calls).toHaveLength(2)
    const updateResponse = await fetch.mock.results[1].value
    expect(updateResponse.body.toString()).toMatch('Harvest Plants')
  })

  it('allows a response override', async () => {
    const mockServer = new MockServer({ factoryFarm })
    mockServer.define('planting', {
      type: 'todos',
      title: 'Plant Seeds',
      id: '1'
    })

    const responseOverrides = [
      {
        path: /todos\/1/,
        response: (mockServer) => serverResponse(mockServer.build('planting', { title: 'Harvest Plants', id: '2' }))
      }
    ]

    mockServer.start({ responseOverrides })

    const otherUser = await store.findOne('todos', '1')
    expect(otherUser.id).toEqual('2')
    expect(otherUser.title).toEqual('Harvest Plants')
  })

  describe('failed responses', () => {
    let mockServer
    beforeEach(() => {
      mockServer = new MockServer({ factoryFarm })
    })

    it('allows a specific response override to have a failed response', async () => {
      expect.assertions(3)
      const responseOverrides = [
        {
          path: /todos\/1/,
          method: 'PATCH',
          status: 422,
          response: () =>
            JSON.stringify({
              errors: [
                {
                  detail: "can't be weird",
                  meta: { server: true },
                  source: { pointer: '/data/attributes/title' },
                  title: 'Invalid name'
                }
              ]
            })
        }
      ]

      const user = store.add('todos', { id: '1', title: 'Spray Plants' })
      mockServer.start({ responseOverrides })

      try {
        await user.save()
      } catch (error) {
        expect(user.errors.title[0].detail).toEqual("can't be weird")
        const results = await fetch.mock.results[0].value
        expect(results.status).toEqual(422)
        expect(fetch.mock.calls).toHaveLength(1)
      }
    })

    it('allows a simulated response for a server failure', async () => {
      expect.assertions(2)
      const responseOverrides = [
        {
          path: /todos\/1/,
          method: 'PATCH',
          status: 500,
          response: () => ({
            title: 'You made a bad request.'
          })
        }
      ]
      mockServer.start({ responseOverrides })

      const user = store.add('todos', { id: '1', title: 'Spray Plants' })

      try {
        await user.save()
      } catch (error) {
        expect(user.errors.title).toEqual('You made a bad request.')
        expect(fetch.mock.calls).toHaveLength(1)
      }
    })
  })

  describe('incorrectly mixing frontend and backend factories', () => {
    let store

    beforeEach(() => {
      const mockServer = new MockServer({ factoryFarm })
      store = mockServer._backendFactoryFarm.store
    })

    it('does not allow a `findOne` call', () => {
      expect(() => store.findAll('todos')).toThrow(
        'You tried to find todos from MockServer which is circular and would call itself. To fix the problem, use FactoryFarm without MockServer'
      )
    })

    it('does not allow a `findOne` call', () => {
      expect(() => store.findOne('todos', '1')).toThrow(
        'You tried to find todos with id 1 from MockServer which is circular and would call itself. To fix the problem, use FactoryFarm without MockServer'
      )
    })

    it('does not allow a `findMany` call', () => {
      expect(() => store.findMany('todos', ['1', '2'])).toThrow(
        'You tried to find todos with id 1,2 from MockServer which is circular and would call itself. To fix the problem, use FactoryFarm without MockServer'
      )
    })

    it('does not allow a `fetchAll` call', () => {
      expect(() => store.fetchAll('todos')).toThrow(
        'You tried to find todos from MockServer which is circular and would call itself. To fix the problem, use FactoryFarm without MockServer'
      )
    })

    it('does not allow a POST call', () => {
      expect(() => store.add('todos', { title: 'Plant Seeds' }).save()).toThrow(
        "You tried to call fetch from MockServer with POST /todos, which is circular and would call itself. This was caused by calling a method such as 'save' on a model that was created from MockServer. To fix the problem, use FactoryFarm without MockServer"
      )
    })
  })

  describe('Store tagging', () => {
    it('Tags the builtin store so that other test utilities can tell if a store is used for a Factory Farm', () => {
      const backendStore = new AppStore()
      const factoryFarm = new FactoryFarm(backendStore)

      expect(backendStore.__usedForFactoryFarm__).toBe(true)
      expect(factoryFarm.store.__usedForFactoryFarm__).toBe(true)

      expect(backendStore.__usedForMockServer__).toBe(undefined)
      expect(factoryFarm.store.__usedForMockServer__).toBe(undefined)
      expect(factoryFarm.__usedForMockServer__).toBe(undefined)

      const mockServer = new MockServer({ factoryFarm })
      expect(backendStore.__usedForMockServer__).toBe(true)
      expect(factoryFarm.__usedForMockServer__).toBe(true)
      expect(factoryFarm.store.__usedForMockServer__).toBe(true)
      expect(mockServer._backendFactoryFarm.__usedForMockServer__).toBe(true)
      expect(mockServer._backendFactoryFarm.store.__usedForMockServer__).toBe(true)
    })
  })
})
