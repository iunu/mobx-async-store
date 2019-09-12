/* global fetch */
import { isObservable, toJS } from 'mobx'
import { Store, Model, attribute } from 'artemis-data'

class Note extends Model {
  static type = 'notes'
  static endpoint = 'notes'

  @attribute(String) text = ''
}

class Todo extends Model {
  static type = 'todos'
  static endpoint = 'todos'

  @attribute(String) title = ''
}

class AppStore extends Store {
  static types = [
    Note,
    Todo
  ]
}

const mockBaseUrl = '/example_api'

const mockFetchOptions = {
  // credentials: 'includes',
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
      'todos': Todo,
      'notes': Note
    })
  })

  it('initializes data observable', () => {
    expect.assertions(1)
    expect(toJS(store.data)).toEqual({
      todos: { cache: {}, records: {} },
      notes: { cache: {}, records: {} }
    })
  })

  describe('add', () => {
    it('adds basic model to store', () => {
      expect.assertions(1)
      const example = store.add('todos', { title: 'Buy Milk' })
      expect(example.title).toEqual('Buy Milk')
    })

    it('adds multiple records to the store', () => {
      expect.assertions(2)

      const exampleData = [
        { title: 'Buy Milk' },
        { title: 'Do laundry' }
      ]

      const examples = store.add('todos', exampleData)
      expect(examples).toHaveLength(2)

      const foundExamples = store.findAll('todos', exampleData, { fromServer: false })
      expect(foundExamples).toHaveLength(2)
    })
  })

  describe('reset', () => {
    it('removes all records from the store', async () => {
      expect.assertions(4)
      store.add('todos', { title: 'Buy Milk' })
      store.add('notes', { text: 'Example text' })

      expect(store.findAll('todos', { fromServer: false }))
        .toHaveLength(1)
      expect(store.findAll('notes', { fromServer: false }))
        .toHaveLength(1)

      store.reset()

      expect(store.findAll('todos', { fromServer: false }))
        .toHaveLength(0)
      expect(store.findAll('notes', { fromServer: false }))
        .toHaveLength(0)
    })

    it('removes records of a specific type if type arg is provided', async () => {
      expect.assertions(4)
      store.add('todos', { title: 'Buy Milk' })
      store.add('notes', { text: 'Example text' })

      expect(store.findAll('todos', { fromServer: false }))
        .toHaveLength(1)
      expect(store.findAll('notes', { fromServer: false }))
        .toHaveLength(1)

      store.reset('todos')

      expect(store.findAll('todos', { fromServer: false }))
        .toHaveLength(0)
      expect(store.findAll('notes', { fromServer: false }))
        .toHaveLength(1)
    })
  })

  describe('findOne', () => {
    it('find model in store', async () => {
      expect.assertions(1)
      const addedModel = store.add('todos', { title: 'Buy Milk' })
      const { id } = addedModel
      const foundModel = await store.findOne('todos', id)
      expect(foundModel.title).toEqual(addedModel.title)
    })

    it('fetches model if it not present', async () => {
      expect.assertions(1)
      fetch.mockResponse(mockTodoResponse)
      const todo = await store.findOne('todos', '1')
      expect(todo.title).toEqual('Do taxes')
    })

    it('supports queryParams', async () => {
      expect.assertions(1)
      fetch.mockResponse(mockTodoResponse)
      await store.findOne('todos', '1', {
        queryParams: {
          filter: {
            due_at: '2019-01-01'
          },
          include: 'todo.notes',
          user_id: '1'
        }
      })
      expect(decodeURIComponent(fetch.mock.calls[0][0]))
        .toEqual('/example_api/todos/1?filter[due_at]=2019-01-01&include=todo.notes&user_id=1')
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

      it('fetches data with filter params', async () => {
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
        expect(decodeURIComponent(fetch.mock.calls[0][0]))
          .toEqual('/example_api/todos?filter[title]=Do taxes&filter[overdue]=true')
      })

      it('fetches data with include params', async () => {
        expect.assertions(2)
        fetch.mockResponse(mockTodosResponse)
        await store.findAll('todos', {
          fromServer: true,
          queryParams: {
            include: 'todo.notes,todo.comments'
          }
        })
        expect(fetch.mock.calls).toHaveLength(1)
        expect(decodeURIComponent(fetch.mock.calls[0][0]))
          .toEqual('/example_api/todos?include=todo.notes,todo.comments')
      })

      it('fetches data with named query params', async () => {
        expect.assertions(2)
        fetch.mockResponse(mockTodosResponse)
        await store.findAll('todos', {
          fromServer: true,
          queryParams: {
            foo: 'bar'
          }
        })
        expect(fetch.mock.calls).toHaveLength(1)
        expect(decodeURIComponent(fetch.mock.calls[0][0]))
          .toEqual('/example_api/todos?foo=bar')
      })

      it('fetches data with named array filters', async () => {
        expect.assertions(2)
        fetch.mockResponse(mockTodosResponse)
        await store.findAll('todos', {
          fromServer: true,
          queryParams: {
            filter: {
              ids: ['1', '2']
            }
          }
        })
        expect(fetch.mock.calls).toHaveLength(1)
        expect(decodeURIComponent(fetch.mock.calls[0][0]))
          .toEqual('/example_api/todos?filter[ids][]=1&filter[ids][]=2')
      })

      it('caches list ids by request url', async () => {
        expect.assertions(1)
        fetch.mockResponse(mockTodosResponse)
        await store.findAll('todos', { fromServer: true })
        const cache = toJS(store.data.todos.cache)
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
      const assertionText = `If you fetch a record from the server,
        update its attributes (client-only), then look it up again via
        the same query, and fromServer is false or undefined
      `
      describe(assertionText, () => {
        it('the record will be returned from cache with updated attributes preserved', async () => {
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
