/* global fetch */
import { isObservable, toJS } from 'mobx'
import { Store, Model, attribute, relatedToOne, relatedToMany } from '../src/main'

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

      const foundExamples = store.findAll('todos', exampleData, { fromServer: false })
      expect(foundExamples).toHaveLength(2)
    })
  })

  describe('bulkSave', () => {
    it('raises an invariant error if not all records are of the stated type', () => {
    })

    it('constructs a payload for all record in a jsonapi bulk-extenstion compliant way', async () => {
      const todo1 = store.add('todos', { title: 'Pet Dog' })
      const todo2 = store.add('todos', { title: 'Feed Dog' })
      const todo3 = store.add('todos', { title: 'Give Dog Treat' })

      fetch.mockResponse({})
      await store.bulkSave('todos', [todo1, todo3])

      expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual({
        data: [
          {
            type: 'todos',
            attributes: {
              title: 'Pet Dog',
            }
          },
          {
            type: 'todos',
            attributes: {
              title: 'Give Dog Treat',
            }
          }
        ]
      })
    })

    it('updates the original records after they have been saved with data from the response', () => {
    })

    it('adds the bulk extension format to the request header', async () => {
      const todo1 = store.add('todos', { title: 'Pet Dog' })

      fetch.mockResponse({})
      await store.bulkSave('todos', [todo1])

      expect(fetch.mock.calls[0][1].headers['Content-Type'])
        .toEqual('application/vnd.api+json; ext="bulk"')
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
