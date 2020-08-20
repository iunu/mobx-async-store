/* global fetch */
import { isObservable, toJS } from 'mobx'
import { Store, Model, attribute, relatedToOne, relatedToMany } from '../src/main'
import { URL_MAX_LENGTH } from '../src/utils'

class Tag extends Model {
  static type = 'tags'
  static endpoint = 'tags'

  @attribute(String) label = ''
  @relatedToOne todo
}

class Category extends Model {
  static type = 'categories'
  static endpoint = 'categories'

  @attribute(String) name = ''
  @relatedToOne todo
}

class Note extends Model {
  static type = 'notes'
  static endpoint = 'notes'

  @attribute(String) text = ''
  @relatedToOne todo
}

class Todo extends Model {
  static type = 'todos'
  static endpoint = 'todos'

  @attribute(String) title = ''
  @relatedToMany(Note) user_notes
  @relatedToOne(Note) instructions
  @relatedToOne category
  @relatedToMany tags
}

class AppStore extends Store {
  static types = [
    Note,
    Todo,
    Tag,
    Category
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
      id: '1',
      title: 'Do taxes'
    }
  }
}

const mockTodoResponse = JSON.stringify(mockTodoData)
const mockTodosResponse = JSON.stringify({ data: [mockTodoData.data] })

const createMockIds = (numberOfIds, idPrefix = '') => {
  return [...Array(numberOfIds)].map((_, index) => {
    const startingNumber = Number(idPrefix)
    return isNaN(startingNumber) ? `${idPrefix}${index}` : String(startingNumber + index)
  })
}

const createMockTodosAttributes = (numberOfRecords, idPrefix = '', titlePrefix = 'Todo') => {
  return createMockIds(numberOfRecords, idPrefix).map(id => {
    return {
      id,
      title: `${titlePrefix} ${id}`
    }
  })
}

const createMockTodosResponse = (numberOfRecords, idPrefix = '', titlePrefix = 'Todo') => {
  const data = createMockTodosAttributes(numberOfRecords, idPrefix, titlePrefix).map(attributes => {
    return {
      id: attributes.id,
      type: 'todos',
      attributes
    }
  })

  return JSON.stringify({ data })
}

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
      todos: Todo,
      notes: Note,
      categories: Category,
      tags: Tag
    })
  })

  it('initializes data observable', () => {
    expect.assertions(1)
    expect(toJS(store.data)).toEqual({
      todos: { cache: {}, records: {} },
      notes: { cache: {}, records: {} },
      categories: { cache: {}, records: {} },
      tags: { cache: {}, records: {} }
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

      const foundExamples = store.findAll('todos', { fromServer: false })
      expect(foundExamples).toHaveLength(2)
    })
  })

  describe('build', () => {
    it('builds a model instance', () => {
      const example = store.build('todos', { title: 'Buy Milk' })
      expect(example.title).toEqual('Buy Milk')
    })

    it('does not add it to the store', () => {
      const example = store.build('todos', { title: 'Buy Milk' })
      expect(store.getRecord('todos', example.id)).toBeUndefined()
    })

    it('gives the record a temporary id', () => {
      const example = store.build('todos', { title: 'Buy Milk' })
      expect(example.id).toMatch(/^tmp-/)
    })

    it('unless an id is present in attributes', () => {
      const example = store.build('todos', { id: 'foo', title: 'Buy Milk' })
      expect(example.id).toBe('foo')
    })
  })

  describe('bulkSave', () => {
    it('raises an invariant error if we submit n records and don\'t receive data for n records', async () => {
      expect.assertions(1)

      const todo1 = store.add('todos', { title: 'Pet Dog' })
      const todo2 = store.add('todos', { title: 'Give Dog Treat' })
      fetch.mockResponse(JSON.stringify({}))

      try {
        await store.bulkSave('todos', [todo1, todo2])
      } catch (err) {
        expect(err.message).toMatch('Invariant violated')
      }
    })

    it('constructs a payload for all records in a jsonapi bulk-extension compliant way', async () => {
      const todo1 = store.add('todos', { title: 'Pet Dog' })
      const todo3 = store.add('todos', { title: 'Give Dog Treat' })

      const mockTodosData = {
        data: [
          {
            id: '1',
            type: 'todos',
            attributes: {
              title: 'Pet Dog'
            }
          },
          {
            id: '2',
            type: 'todos',
            attributes: {
              title: 'Give Dog Treat'
            }
          }]
      }
      const mockTodosResponse = JSON.stringify(mockTodosData)
      fetch.mockResponse(mockTodosResponse)

      await store.bulkSave('todos', [todo1, todo3])

      expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual({
        data: [
          {
            type: 'todos',
            attributes: {
              title: 'Pet Dog'
            }
          },
          {
            type: 'todos',
            attributes: {
              title: 'Give Dog Treat'
            }
          }
        ]
      })
    })

    it('updates the original records after they have been saved with data from the response', async () => {
      const todo1 = store.add('todos', { title: 'Pet Dog' })
      const todo3 = store.add('todos', { title: 'Give Dog Treat' })

      const mockTodosData = {
        data: [
          {
            id: '1',
            type: 'todos',
            attributes: {
              title: 'Pet Dog'
            }
          },
          {
            id: '2',
            type: 'todos',
            attributes: {
              title: 'Give Dog Treat'
            }
          }]
      }
      const mockTodosResponse = JSON.stringify(mockTodosData)

      fetch.mockResponse(mockTodosResponse)
      await store.bulkSave('todos', [todo1, todo3])
      expect(todo1.id).toEqual('1')
      expect(todo3.id).toEqual('2')
    })

    it('adds the bulk extension format to the request header', async () => {
      const todo1 = store.add('todos', { title: 'Pet Dog' })

      const mockTodosData = {
        data: [
          {
            id: '1',
            type: 'todos',
            attributes: {
              title: 'Pet Dog'
            }
          }]
      }
      const mockTodosResponse = JSON.stringify(mockTodosData)
      fetch.mockResponse(mockTodosResponse)

      await store.bulkSave('todos', [todo1])

      expect(fetch.mock.calls[0][1].headers['Content-Type'])
        .toEqual('application/vnd.api+json; ext="bulk"')
    })
  })

  describe('updateRecords', () => {
    describe('error handling', () => {
      it('adds server errors to the models', async () => {
        const todo = store.add('todos', { title: '' })
        const request = new Promise((resolve, reject) => {
          const body = JSON.stringify({
            errors: [
              {
                detail: "Title can't be blank",
                source: { pointer: '/data/attributes/title' },
                title: "Invalid title"
              }
            ]
          })
          process.nextTick(() => resolve(
            new Response(body, { status: 422 })
          ));
        });

        try {
          await store.updateRecords(request, todo)
        } catch {
        }

        expect(todo.errors.title).toEqual([{ message: "Title can't be blank" }])
      })

      it('adds multiple server errors for the same attribute', async () => {
        const todo = store.add('todos', { title: '' })
        const request = new Promise((resolve, reject) => {
          const body = JSON.stringify({
            errors: [
              {
                detail: "Title can't be blank",
                source: { pointer: '/data/attributes/title' },
                title: "Invalid title"
              },
              {
                detail: "Title is taken",
                source: { pointer: '/data/attributes/title' },
                title: "Invalid title"
              }
            ]
          })
          process.nextTick(() => resolve(
            new Response(body, { status: 422 })
          ));
        });

        try {
          await store.updateRecords(request, todo)
        } catch {
        }

        expect(todo.errors.title).toEqual([
          { message: "Title can't be blank" },
          { message: "Title is taken" },
        ])
      })

      it.only('adds server errors for nested attributes', async () => {
        const todo = store.add('todos', { title: '' })
        const request = new Promise((resolve, reject) => {
          const body = JSON.stringify({
            errors: [
              {
                detail: 'Quantity must be greater than 0',
                source: {
                  pointer: '/data/attributes/options/resources/0/quantity'
                },
                title: "Invalid quantity"
              }
            ]
          })
          process.nextTick(() => resolve(
            new Response(body, { status: 422 })
          ));
        });

        try {
          await store.updateRecords(request, todo)
        } catch {
        }

        expect(todo.errors.options['resources.0.quantity']).toEqual([{ message: 'Quantity must be greater than 0' }])
      })

      it('adds server errors for multiple records', async () => {
        const todo1 = store.add('todos', {})
        const todo2 = store.add('todos', {})
        const request = new Promise((resolve, reject) => {
          const body = JSON.stringify({
            errors: [
              {
                detail: "Title can't be blank",
                source: { pointer: '/data/0/attributes/title' },
                title: "Invalid title"
              },
              {
                detail: 'Quantity must be greater than 0',
                source: {
                  pointer: '/data/1/attributes/quantity'
                },
                title: "Invalid quantity"
              }
            ]
          })
          process.nextTick(() => resolve(
            new Response(body, { status: 422 })
          ));
        });

        try {
          await store.updateRecords(request, [todo1, todo2])
        } catch {
        }

        expect(todo1.errors.title).toEqual([{ message: "Title can't be blank" }])
        expect(todo2.errors.quantity).toEqual([{ message: 'Quantity must be greater than 0' }])
      })

      it('adds server errors to the right record', async () => {
        const todo1 = store.add('todos', {})
        const todo2 = store.add('todos', {})
        const request = new Promise((resolve, reject) => {
          const body = JSON.stringify({
            errors: [
              {
                detail: "Title can't be blank",
                source: { pointer: '/data/1/attributes/title' },
                title: "Invalid title"
              }
            ]
          })
          process.nextTick(() => resolve(
            new Response(body, { status: 422 })
          ));
        });

        try {
          await store.updateRecords(request, [todo1, todo2])
        } catch {
        }

        expect(todo2.errors.title).toEqual([{ message: "Title can't be blank" }])
      })
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
          const todos = store.findAll('todos', { fromServer: false })
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
        const todos = await store.findAll('todos', { fromServer: true })
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

      it('fetched data snapshots are marked as persisted', async () => {
        expect.assertions(1)
        fetch.mockResponse(mockTodosResponse)

        // Create an existing todo
        store.add('todos', {
          id: mockTodoData.data.id,
          attributes: mockTodoData.data.attributes
        })

        const todos = await store.findAll('todos', { fromServer: true })

        expect(todos[0].previousSnapshot.persisted).toBeTruthy()
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
          expect(fetch.mock.calls[0][0]).toEqual('/example_api/todos')
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
          expect.assertions(6)
          // Query params for both requests
          const queryParams = { filter: { overdue: true } }
          // Only need to mock response once :)
          fetch.mockResponse(mockTodosResponse)
          // Fetch todos
          let query = store.findAll('todos', { queryParams })
          expect(query).toBeInstanceOf(Promise)
          let todos = await query
          expect(todos).toHaveLength(1)
          expect(fetch.mock.calls).toHaveLength(1)
          // Find todos a second time
          query = store.findAll('todos', { queryParams })
          expect(query).toBeInstanceOf(Promise)
          todos = await query
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

  describe('findMany', () => {
    describe('"fromServer" is set to false', () => {
      describe('records of the specified type do not exist', () => {
        it('returns an empty array', () => {
          const todos = store.findMany('todos', ['1001', '5000'], { fromServer: false })
          expect(todos).toHaveLength(0)
        })
      })

      describe('records of the specified type do exist', () => {
        it('returns existing only models in the store', () => {
          store.add('todos', createMockTodosAttributes(5, '1000'))
          const todos = store.findMany('todos', ['1001', '5000'], {
            fromServer: false
          })
          expect(todos).toHaveLength(1)
        })
      })
    })

    describe('when "fromServer" is set to true', () => {
      it('fetches data from server', async () => {
        expect.assertions(4)
        fetch.mockResponse(createMockTodosResponse(5, '1000'))
        const ids = createMockIds(5, '1000')
        const todos = await store.findMany('todos', ids, { fromServer: true })
        expect(todos).toHaveLength(5)
        expect(todos[0].title).toEqual('Todo 1000')
        expect(fetch.mock.calls).toHaveLength(1)
        expect(fetch.mock.calls[0][0])
          .toEqual('/example_api/todos?filter%5Bids%5D=1000%2C1001%2C1002%2C1003%2C1004')
      })

      it('uses multiple fetches for data from server', async () => {
        expect.assertions(7)

        fetch.mockResponseOnce(createMockTodosResponse(100, '1000'))
        fetch.mockResponseOnce(createMockTodosResponse(100, '1100'))
        fetch.mockResponseOnce(createMockTodosResponse(100, '1200'))

        const ids = createMockIds(300, '1000')
        const todos = await store.findMany('todos', ids, { fromServer: true })

        expect(todos).toHaveLength(300)
        expect(store.findAll('todos', { fromServer: false })).toHaveLength(300)

        expect(fetch.mock.calls).toHaveLength(3)
        const [firstCall] = fetch.mock.calls[0]
        expect(decodeURIComponent(firstCall)).toMatch(/1139$/)

        fetch.mock.calls.forEach(call => {
          expect(call[0].length).toBeLessThan(URL_MAX_LENGTH)
        })
      })

      it('fetches data with other params', async () => {
        expect.assertions(8)

        const ids = createMockIds(300, '1000')
        fetch.mockResponse(mockTodosResponse)

        await store.findMany('todos', ids, {
          fromServer: true,
          queryParams: {
            filter: {
              title: 'Do taxes',
              overdue: true
            }
          }
        })

        expect(fetch.mock.calls).toHaveLength(3)
        fetch.mock.calls.forEach(call => {
          const [path] = call
          expect(decodeURIComponent(path)).toMatch('/example_api/todos?filter[title]=Do taxes&filter[overdue]=true')
          expect(call.length).toBeLessThan(URL_MAX_LENGTH)
        })

        const [firstPath] = fetch.mock.calls[0]
        expect(decodeURIComponent(firstPath)).toMatch(/1132$/)
      })

      it('fetches data with named array filters', async () => {
        expect.assertions(8)
        fetch.mockResponse(mockTodosResponse)
        const ids = createMockIds(300, '1000')
        await store.findMany('todos', ids, {
          fromServer: true,
          queryParams: {
            filter: {
              category: 'important'
            }
          }
        })

        expect(fetch.mock.calls).toHaveLength(3)
        fetch.mock.calls.forEach(call => {
          const [path] = call
          expect(decodeURIComponent(path)).toMatch('filter[category]=important')
          expect(call.length).toBeLessThan(URL_MAX_LENGTH)
        })

        const [firstPath] = fetch.mock.calls[0]
        expect(decodeURIComponent(firstPath)).toMatch(/1135$/)
      })

      it('caches list ids by request url', async () => {
        expect.assertions(1)
        fetch.mockResponse(mockTodosResponse)
        await store.findMany('todos', ['1'], { fromServer: true })
        const cache = toJS(store.data.todos.cache)
        expect(cache['/example_api/todos?filter%5Bids%5D=1']).toEqual(['1'])
      })
    })

    describe('when "fromServer" is not explicitly set', () => {
      describe('no records of the specified type exist', () => {
        it('uses multiple fetches to request all records from server', async () => {
          expect.assertions(7)

          fetch.mockResponseOnce(createMockTodosResponse(100, '1000'))
          fetch.mockResponseOnce(createMockTodosResponse(100, '1100'))
          fetch.mockResponseOnce(createMockTodosResponse(100, '1200'))

          const ids = createMockIds(300, '1000')
          const todos = await store.findMany('todos', ids)

          expect(todos).toHaveLength(300)
          expect(store.findAll('todos', { fromServer: false })).toHaveLength(300)

          expect(fetch.mock.calls).toHaveLength(3)
          const [firstCall] = fetch.mock.calls[0]
          expect(decodeURIComponent(firstCall)).toMatch(/1139$/)

          fetch.mock.calls.forEach(call => {
            expect(call[0].length).toBeLessThan(URL_MAX_LENGTH)
          })
        })
      })

      describe('some records of the specified type exist', () => {
        it('uses multiple fetches to request some records from server', async () => {
          expect.assertions(7)

          fetch.mockResponseOnce(createMockTodosResponse(100, '1000'))
          fetch.mockResponseOnce(createMockTodosResponse(75, '1100'))

          store.add('todos', createMockTodosAttributes(150, '1175'))

          const ids = createMockIds(300, '1000')
          const todos = await store.findMany('todos', ids)

          expect(todos).toHaveLength(300)
          expect(store.findAll('todos', { fromServer: false })).toHaveLength(325)

          expect(fetch.mock.calls).toHaveLength(2)
          expect(fetch.mock.calls.some(call => call[0].match(/1174/))).toBeTruthy()
          expect(fetch.mock.calls.some(call => call[0].match(/1175/))).toBeFalsy()

          fetch.mock.calls.forEach(call => {
            expect(call[0].length).toBeLessThan(URL_MAX_LENGTH)
          })
        })
      })

      describe('all records of the specified type exist', () => {
        it('uses the cache instead of requesting from the server', async () => {
          expect.assertions(3)

          store.add('todos', createMockTodosAttributes(400, '1000'))

          const ids = createMockIds(300, '1000')
          const todos = await store.findMany('todos', ids)

          expect(todos).toHaveLength(300)
          expect(store.findAll('todos', { fromServer: false })).toHaveLength(400)

          expect(fetch.mock.calls).toHaveLength(0)
        })
      })
    })
  })

  describe('createModel', () => {
    it('creates a model obj with attributes', () => {
      const todoData = {
        attributes: { title: 'hello!' }
      }
      const todo = store.createModel('todos', 1, todoData)
      expect(todo.id).toEqual(1)
      expect(todo.title).toEqual(todoData.attributes.title)
    })

    it('creates a model obj with relatedToOne property', () => {
      const category = store.add('categories', { id: 5, name: 'Cat5' })
      const todoData = {
        attributes: { title: 'hello!' },
        relationships: {
          category: { data: { id: category.id, type: 'categories' } }
        }
      }
      const todo = store.createModel('todos', 1, todoData)
      expect(todo.id).toEqual(1)
      expect(todo.category.id).toEqual(category.id)
      expect(todo.category.name).toEqual(category.name)
    })

    it('creates a model with relatedToMany property', () => {
      const tag = store.add('tags', { id: 3, label: 'Tag #3' })
      const todoData = {
        attributes: { title: 'hello!' },
        relationships: {
          tags: { data: [{ id: tag.id, type: 'tags' }] }
        }
      }
      const todo = store.createModel('todos', 1, todoData)
      expect(todo.id).toEqual(1)
      expect(todo.tags[0].id).toEqual(tag.id)
      expect(todo.tags[0].label).toEqual(tag.label)
    })

    it('creates a model with aliased relatedToOne property', () => {
      const note = store.add('notes', { id: 17, text: 'Example text' })
      const todoData = {
        attributes: { title: 'hello!' },
        relationships: {
          note: { data: { id: note.id, type: 'notes' } }
        }
      }
      const todo = store.createModel('todos', 1, todoData)
      expect(todo.instructions.id).toEqual(note.id)
      expect(todo.instructions.text).toEqual(note.text)
    })

    it('creates a model with aliased relatedToMany property', () => {
      const note = store.add('notes', { id: 3, text: 'hi' })
      const todoData = {
        attributes: { title: 'hello!' },
        relationships: {
          notes: { data: [{ id: note.id, type: 'notes' }] }
        }
      }
      const todo = store.createModel('todos', 1, todoData)
      expect(todo.user_notes[0].id).toEqual(note.id)
      expect(todo.user_notes[0].text).toEqual(note.text)
    })
  })

  describe('createOrUpdateModel', () => {
    let record

    beforeEach(() => {
      store.add('notes', { id: 3, text: 'hi' })

      record = store.createOrUpdateModel({
        id: 3,
        type: 'notes',
        attributes: {
          text: 'yo'
        }
      })
    })

    it('sets previous snapshot', () => {
      expect(record.previousSnapshot.attributes.text).toEqual('yo')
    })

    it('sets previous snapshot as persisted', () => {
      expect(record.previousSnapshot.persisted).toBeTruthy()
    })
  })

  describe('createModelsFromData', () => {
    it('creates a list of model objs from a list of data objs', () => {
      const dataObjs = [
        { id: 1, type: 'todos', attributes: { title: 'hello!' }, relationships: {} },
        { id: 2, type: 'todos', attributes: { title: 'see ya!' }, relationships: {} }
      ]
      const todos = store.createModelsFromData(dataObjs)
      expect(todos).toHaveLength(2)
      expect(todos[0].type).toEqual('todos')
      expect(todos[1].type).toEqual('todos')
      expect(todos[0].id).toEqual(dataObjs[0].id)
      expect(todos[1].id).toEqual(dataObjs[1].id)
      expect(todos[0].title).toEqual(dataObjs[0].attributes.title)
      expect(todos[1].title).toEqual(dataObjs[1].attributes.title)
    })

    it('skips objs with an unknown type', () => {
      const dataObjs = [
        { id: 1, type: 'todos', attributes: { title: 'hello!' }, relationships: {} },
        { id: 2, type: 'unknown', attributes: { title: 'see ya!' }, relationships: {} }
      ]
      const todos = store.createModelsFromData(dataObjs)
      expect(todos).toHaveLength(2)
      expect(todos[0].type).toEqual('todos')
      expect(typeof todos[1]).toBe('undefined')
    })
  })

  describe('findAndFetchAll', () => {
    let requestOptions
    let lazyLoadOptions
    let mockAfterFetch = jest.fn()
    let mockBeforeFetch = jest.fn()
    let mockTodosResponse2
    let mockAfterError = jest.fn()

    beforeEach(() => {
      jest.resetAllMocks()

      requestOptions = {
        queryParams: {
          filter: {
            title: 'Do taxes'
          }
        }
      }

      lazyLoadOptions = {
        ...requestOptions,
        afterRefetch: mockAfterFetch,
        beforeRefetch: mockBeforeFetch,
        afterError: mockAfterError
      }

      mockTodosResponse2 = JSON.stringify({
        data: [
          mockTodoData.data,
          { ...mockTodoData.data, id: 2, title: 'Test' }
        ]
      })
    })

    it('triggers a fetch if no cached data is found', async (done) => {
      fetch.mockResponse(mockTodosResponse)

      lazyLoadOptions.afterRefetch = jest.fn((result) => {
        expect(result).toHaveLength(1)
        done()
      })

      await store.findAll('todos', requestOptions)
      const result = store.findAndFetchAll('todos', lazyLoadOptions)

      expect(result).toHaveLength(0)
      expect(fetch).toHaveBeenCalled()
    })

    it('calls beforeRefetch callback with prefetch result', async () => {
      fetch.mockResponse(mockTodosResponse)
      await store.findAll('todos', requestOptions)

      const result = store.findAndFetchAll('todos', lazyLoadOptions)

      expect(result).toHaveLength(1)
      expect(mockBeforeFetch).toHaveBeenCalledWith(result)
    })

    it('calls afterRefetch callback with refetch result', async (done) => {
      const mockTodosResponse2 = JSON.stringify({
        data: [
          mockTodoData.data,
          { ...mockTodoData.data, id: 2, title: 'Test' }
        ]
      })

      fetch.mockResponses(
        [mockTodosResponse, { status: 200 }],
        [mockTodosResponse2, { status: 200 }]
      )

      // Trigger another request
      await store.findAll('todos', requestOptions)

      lazyLoadOptions.afterRefetch = jest.fn((result) => {
        // The refetch result is different then the cached result, because
        // mockTodosResponse2 has 2 records
        expect(result).toHaveLength(2)
        done()
      })

      store.findAndFetchAll('todos', lazyLoadOptions)
    })

    it('returns cached data before refetching', async (done) => {
      fetch.mockResponses(
        [mockTodosResponse, { status: 200 }],
        [mockTodosResponse2, { status: 200 }]
      )

      await store.findAll('todos', requestOptions)

      lazyLoadOptions.afterRefetch = jest.fn((result) => {
        // The refetch result is different then the cached result, because
        // mockTodosResponse2 has 2 records
        expect(result).toHaveLength(2)
        done()
      })

      const result = store.findAndFetchAll('todos', lazyLoadOptions)

      // mockTodosResponse has only one record
      expect(result).toHaveLength(1)
      // fetch was called twice: once from the findAll and once from findAndFetchAll
      // refetching
      expect(fetch.mock.calls).toHaveLength(2)
    })

    it('calls afterError if bad request', (done) => {
      fetch.mockResponses([mockTodosResponse, { status: 400 }])

      lazyLoadOptions.afterError = jest.fn((error) => {
        // NOTE: We should have better errors than this.
        expect(error).toEqual(400)
        done()
      })

      store.findAndFetchAll('todos', lazyLoadOptions)
    })
  })
})
