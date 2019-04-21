/* global fetch */
import { isObservable, toJS } from 'mobx'
import { Store, Model, attribute } from '../main.js'

class Todo extends Model {
  static type = 'todos'
  static endpoint = 'todos'

  @attribute(String) static title = ''
}

class AppStore extends Store {
  static types = [
    Todo
  ]
}

const mockBaseUrl = '/example_api'

const mockFetchOptions = {
  credentials: 'includes',
  headers: {
    'Content-Type': 'application/vnd.api+json',
    'Accepts': 'application/json'
  }
}

const store = new AppStore({
  baseUrl: mockBaseUrl,
  defaultFetchOptions: mockFetchOptions
})

const mockTodoData = {
  data: {
    id: '1',
    type: 'todos',
    attributes: {
      id: 1,
      title: 'Do taxes'
    }
  }
}

const mockTodoResponse = JSON.stringify(mockTodoData)

const mockTodosResponse = JSON.stringify({
  data: [
    {
      id: '1',
      type: 'todos',
      attributes: {
        id: 1,
        title: 'Do taxes'
      }
    }
  ]
})

describe('Store', () => {
  beforeEach(() => {
    fetch.resetMocks()
    store.reset()
  })

  it('has observable data property', () => {
    expect.assertions(1)
    expect(isObservable(store.data)).toBe(true)
  })

  it('sets network configuration properties', () => {
    expect.assertions(2)
    expect(store.baseUrl).toEqual(mockBaseUrl)
    expect(store.defaultFetchOptions).toEqual(mockFetchOptions)
  })

  it('sets model type index', () => {
    expect.assertions(1)
    expect(store.modelTypeIndex).toEqual({
      'todos': Todo
    })
  })

  it('initializes data observable', () => {
    expect.assertions(1)
    expect(toJS(store.data)).toEqual({
      todos: {
        cache: {},
        records: {},
        isEmpty: true
      }
    })
  })

  describe('add', () => {
    it('adds basic model to store', () => {
      expect.assertions(1)
      const example = store.add('todos', { title: 'Buy Milk' })
      expect(example.title).toEqual('Buy Milk')
    })
  })

  xdescribe('findOne', () => {
    it('find model in store', async () => {
      expect.assertions(1)
      const addedModel = store.add('todos', { title: 'Buy Milk' })
      const { id } = addedModel
      const options = { fromServer: true }
      const foundModel = await store.findOne('todos', id, options)
      expect(foundModel.title).toEqual(addedModel.title)
    })

    it('fetches model if it not present', async () => {
      expect.assertions(1)
      fetch.mockResponse(mockTodoResponse)
      const todo = await store.findOne('todos', '1')
      expect(todo.title).toEqual('Do taxes')
    })
  })

  describe('findAll', () => {
    describe('when "fromServer" is set to false', () => {
      describe('if records of the specified type do not exist', () => {
        it('returns an empty array', () => {
          expect.assertions(1)
          const todos = store.findAll('todos', {
            fromServer: false
          })
          expect(todos).toHaveLength(0)
        })
      })

      describe('if records of the specified type do exist', () => {
        it('returns existing models in the store', () => {
          expect.assertions(1)
          store.add('todos', { title: 'Buy Milk' })
          const todos = store.findAll('todos', {
            fromServer: false
          })
          expect(todos).toHaveLength(1)
        })
      })
    })

    describe('when "fromServer" is set to true', () => {
      it('fetches data from server', async () => {
        expect.assertions(4)
        fetch.mockResponse(mockTodosResponse)
        const todos = await store.findAll('todos', {
          fromServer: true
        })
        expect(todos).toHaveLength(1)
        expect(todos[0].title).toEqual('Do taxes')
        expect(fetch.mock.calls).toHaveLength(1)
        expect(fetch.mock.calls[0][0])
          .toEqual('/example_api/todos')
      })

      it('fetches data with filter query params', async () => {
        expect.assertions(2)
        fetch.mockResponse(mockTodosResponse)
        await store.findAll('todos', {
          fromServer: true,
          queryParams: {
            filter: {
              title: 'Do taxes',
              overdue: true
            }
          }
        })
        expect(fetch.mock.calls).toHaveLength(1)
        expect(fetch.mock.calls[0][0])
          .toEqual('/example_api/todos?filter[title]=Do%20taxes&filter[overdue]=true')
      })

      it('fetches data with include query params', async () => {
        expect.assertions(2)
        fetch.mockResponse(mockTodosResponse)
        await store.findAll('todos', {
          fromServer: true,
          queryParams: {
            include: ['notes', 'comments']
          }
        })
        expect(fetch.mock.calls).toHaveLength(1)
        expect(fetch.mock.calls[0][0])
          .toEqual('/example_api/todos?include=notes,comments')
      })

      it('caches list ids by request url', async () => {
        expect.assertions(1)
        fetch.mockResponse(mockTodosResponse)
        await store.findAll('todos', {
          fromServer: true
        })
        const { data: { todos: { cache } } } = store
        expect(cache['/example_api/todos']).toEqual(['1'])
      })
    })

    describe('when "fromServer" is not explicitly set', () => {
      describe('if records of the specified type do not exist', () => {
        it('fetches data from server', async () => {
          expect.assertions(4)
          fetch.mockResponse(mockTodosResponse)
          const todos = await store.findAll('todos')
          expect(todos).toHaveLength(1)
          expect(todos[0].title).toEqual('Do taxes')
          expect(fetch.mock.calls).toHaveLength(1)
          expect(fetch.mock.calls[0][0])
            .toEqual('/example_api/todos')
        })
      })

      describe('if records of the specified type do exist', () => {
        it('skips fetch and returns local data from the store', async () => {
          expect.assertions(2)
          store.add('todos', { title: 'Buy Milk' })
          const todos = await store.findAll('todos')
          expect(todos).toHaveLength(1)
          expect(fetch).not.toHaveBeenCalled()
        })
      })

      describe('if a query is made with identical params', () => {
        it('skips fetch and returns local data from the store', async () => {
          expect.assertions(4)
          // Query params for both requests
          const queryParams = { filter: { overdue: true } }
          // Only need to mock response once :)
          fetch.mockResponse(mockTodosResponse)
          // Fetch todos
          let todos = await store.findAll('todos', { queryParams })
          expect(todos).toHaveLength(1)
          expect(fetch.mock.calls).toHaveLength(1)
          // Find todos a second time
          todos = await store.findAll('todos', { queryParams })
          // Not fetch should be kicked off
          expect(todos).toHaveLength(1)
          expect(fetch.mock.calls).toHaveLength(1)
        })
      })
    })

    describe('cache behavior', () => {
      const assertionText = `
        if a record, originally fetched via a query, is changed
        (client only) and the record is found in a cached query
      `
      describe(assertionText, () => {
        it('its updated attributes will be persisted', async () => {
          expect.assertions(6)
          fetch.mockResponse(mockTodosResponse)
          // First fetch the record from the server
          const todos = await store.findAll('todos', {
            queryParams: {
              title: 'Do taxes'
            }
          })
          // Check the correct number of todos are found
          expect(todos).toHaveLength(1)
          const todo = todos[0]
          // Check the record has the correct attribute
          expect(todo.title).toEqual('Do taxes')
          // Check that a call a request was made
          expect(fetch.mock.calls).toHaveLength(1)
          // Update the model in the store
          todo.title = 'New title'
          // Trigger a "findAll" with the identical
          // query params
          const cachedTodos = await store.findAll('todos', {
            queryParams: {
              title: 'Do taxes'
            }
          })
          // Once again the correct number of todos are found
          expect(cachedTodos).toHaveLength(1)
          // Check that a request was NOT made
          expect(fetch.mock.calls).toHaveLength(1)
          // Check the record still has the value
          // set in the store
          const cachedTodo = cachedTodos[0]
          expect(cachedTodo.title).toEqual('New title')
        })
      })
    })
  })
})
