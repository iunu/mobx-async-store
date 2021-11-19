import {
  Model,
  Store,
  attribute,
  relatedToMany,
  relatedToOne
} from '../src/main'
import { computed, isObservable, toJS } from 'mobx'
import { Schema } from '../src/schema'

import { URL_MAX_LENGTH } from '../src/utils'

/* global fetch Response */

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
  @relatedToMany notes
  @relatedToOne category
  @relatedToMany tags
}

class AppStore extends Store {
  @computed get loadingTodos () {
    return this.loadingStates.get('todos')?.size > 0
  }

  static types = [Note, Todo, Tag, Category]
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
  defaultFetchOptions: mockFetchOptions,
  headersOfInterest: ['X-Mobx-Example']
})

const mockTodoData = {
  data: {
    id: '1',
    type: 'todos',
    attributes: {
      title: 'Do taxes'
    }
  }
}

const mockTodoWithNotes = {
  data: {
    id: '101',
    type: 'todos',
    attributes: {
      title: 'Do taxes'
    },
    relationships: {
      notes: {
        data: [{
          id: '1',
          type: 'notes'
        }]
      }
    }
  },
  included: [{
    id: '1',
    type: 'notes',
    attributes: {
      text: 'Do something'
    }
  }]
}

const mockTodoWithTags = {
  data: {
    id: '101',
    type: 'todos',
    attributes: {
      title: 'Do taxes'
    },
    relationships: {
      tags: {
        data: [{
          id: '1',
          type: 'tags'
        }]
      }
    }
  },
  included: [{
    id: '1',
    type: 'tags',
    attributes: {
      text: 'green'
    }
  }]
}

const mockTodoWithMetaData = {
  data: {
    id: '101',
    type: 'todos',
    attributes: {
      title: 'Do taxes'
    },
    relationships: {
      notes: {
        meta: {
          data: 'present'
        }
      },
      tags: {
        meta: {
          included: false
        }
      }
    }
  }
}

const mockTodoData2 = {
  data: {
    id: '2',
    type: 'todos',
    attributes: {
      title: 'Sort pills'
    }
  }
}

const mockTodoResponse = JSON.stringify(mockTodoData)
const mockTodoWithNotesResponse = JSON.stringify(mockTodoWithNotes)
const mockTodoWithTagsResponse = JSON.stringify(mockTodoWithTags)
const mockTodoWithMetaDataResponse = JSON.stringify(mockTodoWithMetaData)
const mockTodosResponse = JSON.stringify({ data: [mockTodoData.data] })
const mockAllTodosResponse = JSON.stringify({
  data: [mockTodoData.data, mockTodoData2.data]
})
const mockTodosResponseWithMeta = JSON.stringify({
  data: [mockTodoWithMetaData.data],
  meta: { data: 'present' }
})

const createMockIds = (numberOfIds, idPrefix = '') => {
  return [...Array(numberOfIds)].map((_, index) => {
    const startingNumber = Number(idPrefix)
    return isNaN(startingNumber)
      ? `${idPrefix}${index}`
      : String(startingNumber + index)
  })
}

const createMockTodosAttributes = (
  numberOfRecords,
  idPrefix = '',
  titlePrefix = 'Todo'
) => {
  return createMockIds(numberOfRecords, idPrefix).map((id) => {
    return {
      id,
      title: `${titlePrefix} ${id}`
    }
  })
}

const createMockTodosResponse = (
  numberOfRecords,
  idPrefix = '',
  titlePrefix = 'Todo'
) => {
  const data = createMockTodosAttributes(
    numberOfRecords,
    idPrefix,
    titlePrefix
  ).map((attributes) => {
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

  it('has a reference to the schema object', () => {
    expect(store.schema).toBeInstanceOf(Schema)
  })

  it('has observable data property', () => {
    expect(isObservable(store.data)).toBe(true)
  })

  it('sets network configuration properties', () => {
    expect(store.baseUrl).toEqual(mockBaseUrl)
    expect(store.defaultFetchOptions).toEqual(mockFetchOptions)
    expect(store.headersOfInterest).toEqual(['X-Mobx-Example'])
  })

  it('has observable lastResponseHeaders', () => {
    expect(isObservable(store.lastResponseHeaders)).toBe(true)
  })

  it('sets model type index', () => {
    expect(store.modelTypeIndex).toEqual({
      todos: Todo,
      notes: Note,
      categories: Category,
      tags: Tag
    })
  })

  it('initializes data observable', () => {
    const map = new Map()
    expect(toJS(store.data)).toEqual({
      todos: { cache: map, meta: map, records: map },
      notes: { cache: map, meta: map, records: map },
      categories: { cache: map, meta: map, records: map },
      tags: { cache: map, meta: map, records: map }
    })
  })

  // // Could not get `fetch.mockResponse` to mock headers, so had to comment out these tests
  // describe('lastResponseHeaders', () => {
  //   it('captures interesting headers from http responses', async () => {
  //     fetch.mockResponse({ body: 'data: {}', headers: { 'X-Ignore-Me': 'Ignore', 'X-Mobx-Example': '123' } })
  //     store.fetchOne('todos', 1)

  //     expect(store.lastResponseHeaders).toEqual({'X-Mobx-Example': '123'})

  //     fetch.mockResponse({ body: 'data: {}', headers: { 'X-Ignore-Me': 'Ignore', 'X-Mobx-Example': 'ABC' } })
  //     store.fetchOne('todos', 2)

  //     expect(store.lastResponseHeaders).toEqual({'X-Mobx-Example': 'ABC'})
  //   })
  // })

  describe('add', () => {
    it('adds basic model to store', () => {
      const example = store.add('todos', { title: 'Buy Milk' })
      expect(example.title).toEqual('Buy Milk')
    })

    it('adds model with toOne relationship to store', () => {
      const category = store.add('categories', { name: 'Cat5' })
      const example = store.add('todos', { category })
      expect(example.category.name).toEqual('Cat5')
    })

    it('adds model with toMany relationship to store', () => {
      const notes = store.add('notes', [{ text: 'satisfying' }, { text: 'unsatisfying' }])
      const example = store.add('todos', { notes })
      expect(example.notes).toContain(notes[0])
      expect(example.notes).toContain(notes[1])
    })

    it('adds multiple records to the store', () => {
      const exampleData = [{ title: 'Buy Milk' }, { title: 'Do laundry' }]

      const examples = store.add('todos', exampleData)
      expect(examples).toHaveLength(2)

      const foundExamples = store.getAll('todos')
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
    it("raises an invariant error if we submit n records and don't receive data for n records", async () => {
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
          }
        ]
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
          }
        ]
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
          }
        ]
      }
      const mockTodosResponse = JSON.stringify(mockTodosData)
      fetch.mockResponse(mockTodosResponse)

      await store.bulkSave('todos', [todo1])

      expect(fetch.mock.calls[0][1].headers['Content-Type']).toEqual(
        'application/vnd.api+json; ext="bulk"'
      )
    })

    it('adds the extensions to the request header', async () => {
      const todo1 = store.add('todos', { title: 'Pet Dog' })
      const extensions = ['artemis/group', 'artemis/extendDaThings']
      const mockTodosData = {
        data: [
          {
            id: '1',
            type: 'todos',
            attributes: {
              title: 'Pet Dog'
            }
          }
        ]
      }
      const mockTodosResponse = JSON.stringify(mockTodosData)
      fetch.mockResponse(mockTodosResponse)

      await store.bulkSave('todos', [todo1], { extensions })

      expect(fetch.mock.calls[0][1].headers['Content-Type']).toEqual(
        'application/vnd.api+json; ext="bulk,artemis/group,artemis/extendDaThings"'
      )
    })

    it('ignores empty extensions in the request header', async () => {
      const todo1 = store.add('todos', { title: 'Pet Dog' })
      const extensions = []
      const mockTodosData = {
        data: [
          {
            id: '1',
            type: 'todos',
            attributes: {
              title: 'Pet Dog'
            }
          }
        ]
      }
      const mockTodosResponse = JSON.stringify(mockTodosData)
      fetch.mockResponse(mockTodosResponse)

      await store.bulkSave('todos', [todo1], { extensions })

      expect(fetch.mock.calls[0][1].headers['Content-Type']).toEqual(
        'application/vnd.api+json; ext="bulk"'
      )
    })
  })

  describe('updateRecords', () => {
    function mockRequest (errors) {
      return new Promise((resolve, reject) => {
        const body = JSON.stringify({ errors })
        process.nextTick(() => resolve(new Response(body, { status: 422 })))
      })
    }

    describe('error handling', () => {
      it('ignores errors without a pointer', async () => {
        const todo = store.add('todos', { title: '' })
        const errors = [
          {
            detail: "Title can't be blank",
            title: 'Invalid title'
          }
        ]

        try {
          await store.updateRecords(mockRequest(errors), todo)
        } catch (error) {
          expect(todo.errors).toEqual({})
        }
      })

      it('ignores pointers not in the jsonapi spec format', async () => {
        const todo = store.add('todos', { title: '' })
        const errors = [
          {
            detail: "Title can't be blank",
            source: { pointer: 'attributes:title' },
            title: 'Invalid title'
          }
        ]

        try {
          await store.updateRecords(mockRequest(errors), todo)
        } catch (error) {
          expect(todo.errors).toEqual({})
        }
      })

      it('adds server errors to the models', async () => {
        const todo = store.add('todos', { title: '' })
        const errors = [
          {
            detail: "Title can't be blank",
            source: { pointer: '/data/attributes/title' },
            title: 'Invalid title'
          }
        ]

        try {
          await store.updateRecords(mockRequest(errors), todo)
        } catch (error) {
          expect(todo.errors.title).toEqual(errors)
        }
      })

      it('adds multiple server errors for the same attribute', async () => {
        const todo = store.add('todos', { title: '' })
        const errors = [
          {
            detail: "Title can't be blank",
            source: { pointer: '/data/attributes/title' },
            title: 'Invalid title'
          },
          {
            detail: 'Title is taken',
            source: { pointer: '/data/attributes/title' },
            title: 'Invalid title'
          }
        ]

        try {
          await store.updateRecords(mockRequest(errors), todo)
        } catch (error) {
          expect(todo.errors.title).toEqual(errors)
        }
      })

      // Note: There is no support for model validations for nested attributes
      it('adds server errors for nested attributes', async () => {
        const todo = store.add('todos', { title: '' })
        const errors = [
          {
            detail: 'Quantity must be greater than 0',
            source: {
              pointer: '/data/attributes/options/resources/0/quantity'
            },
            title: 'Invalid quantity'
          }
        ]

        try {
          await store.updateRecords(mockRequest(errors), todo)
        } catch (error) {
          expect(todo.errors['options.resources.0.quantity']).toEqual(errors)
        }
      })

      it('adds server errors for multiple records', async () => {
        const todo1 = store.add('todos', {})
        const todo2 = store.add('todos', {})
        const errors = [
          {
            detail: "Title can't be blank",
            source: { pointer: '/data/0/attributes/title' },
            title: 'Invalid title'
          },
          {
            detail: 'Quantity must be greater than 0',
            source: {
              pointer: '/data/1/attributes/quantity'
            },
            title: 'Invalid quantity'
          }
        ]

        try {
          await store.updateRecords(mockRequest(errors), [todo1, todo2])
        } catch (error) {
          expect(todo2.errors.quantity).toEqual([errors[1]])
        }
      })

      it('adds server errors to the right record', async () => {
        const todo1 = store.add('todos', {})
        const todo2 = store.add('todos', {})
        const errors = [
          {
            detail: "Title can't be blank",
            source: { pointer: '/data/1/attributes/title' },
            title: 'Invalid title'
          }
        ]

        try {
         await store.updateRecords(mockRequest(errors), [todo1, todo2])
        } catch (error) {
         expect(todo2.errors.title).toEqual(errors)
        }
      })

      it('warns of improperly formed jsonapi error response ', async () => {
        const todo1 = store.add('todos', {})
        const todo2 = store.add('todos', {})
        const errors =
        {
          detail: "Title can't be blank",
          source: { pointer: '/data/1/attributes/title' },
          title: 'Invalid title'
        }

        try {
          await store.updateRecords(mockRequest(errors), [todo1, todo2])
        } catch (error) {
          expect(error.message).toBe('Top level errors in response are not an array.')
          expect(error.name).toBe('TypeError')
        }
      })

      it('renders generic error for undefined json error response ', async () => {
        const todo1 = store.add('todos', {})
        const todo2 = store.add('todos', {})
        const errors = undefined

        try {
          await store.updateRecords(mockRequest(errors), [todo1, todo2])
        } catch (error) {
          expect(error.message).toMatch('Something went wrong.')
          expect(error.name).toBe('Error')
        }
      })
    })
  })

  describe('reset', () => {
    it('removes all records from the store', () => {
      store.add('todos', { title: 'Buy Milk' })
      store.add('notes', { text: 'Example text' })

      expect(store.getAll('todos')).toHaveLength(1)
      expect(store.getAll('notes')).toHaveLength(1)

      store.reset()

      expect(store.getAll('todos')).toHaveLength(0)
      expect(store.getAll('notes')).toHaveLength(0)
    })

    it('removes records of a specific type if type arg is provided', () => {
      store.add('todos', { title: 'Buy Milk' })
      store.add('notes', { text: 'Example text' })

      expect(store.getAll('todos')).toHaveLength(1)
      expect(store.getAll('notes')).toHaveLength(1)

      store.reset('todos')

      expect(store.getAll('todos')).toHaveLength(0)
      expect(store.getAll('notes')).toHaveLength(1)
    })
  })

  describe('getOne', () => {
    it('returns and console warns if not given an id', () => {
      console.error = jest.fn()
      const foundRecord = store.getOne('todos', undefined)
      expect(console.error).toHaveBeenCalledWith("No id given while calling 'getOne' on todos")
      expect(foundRecord).toBeUndefined()
    })

    it('returns the record with the given type and id from the store', () => {
      const todo = store.add('todos', { title: 'Buy Milk' })
      const foundRecord = store.getOne('todos', todo.id)
      expect(foundRecord.title).toEqual(todo.title)
    })

    it('will not return the record if it is not in the store', () => {
      const todo = store.getOne('todos', '1')
      expect(todo).toBeUndefined()
    })
  })

  describe('fetchOne', () => {
    it('returns and console warns if not given an id', async () => {
      console.error = jest.fn()
      const foundRecord = await store.fetchOne('todos', undefined)
      expect(console.error).toHaveBeenCalledWith("No id given while calling 'fetchOne' on todos")
      expect(foundRecord).toBeUndefined()
    })

    it('always fetches the record with the given id from the server', async () => {
      fetch.mockResponse(mockTodoResponse)
      store.add('todos', { ...mockTodoData.data.attributes }) // Add todo to store
      const foundRecord = await store.fetchOne('todos', 1)
      expect(foundRecord.title).toEqual('Do taxes')
      expect(fetch.mock.calls).toHaveLength(1)
    })

    it('identifies relationships, even when not returned from server', async () => {
      fetch.mockResponseOnce(mockTodoWithMetaDataResponse)
      const foundRecord = await store.fetchOne('todos', '101')
      expect(foundRecord.notes).toHaveLength(0)
    })

    it('keeps relationships on successive fetches', async () => {
      fetch.mockResponseOnce(mockTodoWithNotesResponse)
      fetch.mockResponseOnce(mockTodoWithTagsResponse)
      const fetchedRecord = await store.fetchOne('todos', '101')
      expect(fetchedRecord.notes).toHaveLength(1)
      expect(fetchedRecord.tags).toHaveLength(0)

      await store.fetchOne('todos', '101')
      expect(fetchedRecord.notes).toHaveLength(1)
      expect(fetchedRecord.tags).toHaveLength(1)
    })

    it('supports queryParams', async () => {
      fetch.mockResponse(mockTodoResponse)
      await store.fetchOne('todos', '1', {
        queryParams: {
          user_id: 1,
          filter: {
            due_at: '2019-01-01'
          },
          include: 'todo.notes',
          fields: { todos: 'title' }
        }
      })
      expect(decodeURIComponent(fetch.mock.calls[0][0])).toEqual(
        '/example_api/todos/1?user_id=1&filter[due_at]=2019-01-01&include=todo.notes&fields[todos]=title'
      )
    })

    it('allows setting a tag for a query', async () => {
      expect.assertions(2)

      fetch.mockResponseOnce(() => {
        expect(toJS(store.loadingStates.get('loadingSpecialTodo'))).toMatchObject(new Set([JSON.stringify({ url: '/example_api/todos/3', type: 'todos', queryParams: undefined, queryTag: 'loadingSpecialTodo' })]))
        return Promise.resolve(mockTodoResponse)
      })

      await store.fetchOne('todos', '3', { queryTag: 'loadingSpecialTodo' })
      expect(store.loadingStates.get('loadingSpecialTodos')).toBeUndefined()
    })
  })

  describe('findOne', () => {
    it('returns and console warns if not given an id', async () => {
      console.error = jest.fn()
      const foundRecord = await store.findOne('todos', undefined)
      expect(console.error).toHaveBeenCalledWith("No id given while calling 'findOne' on todos")
      expect(foundRecord).toBeUndefined()
    })

    it('finds model if it is in store', async () => {
      const addedModel = store.add('todos', { title: 'Buy Milk' })
      const foundModel = await store.findOne('todos', addedModel.id)
      expect(foundModel.title).toEqual(addedModel.title)
      expect(fetch.mock.calls).toHaveLength(0)
    })

    it('fetches model if it is not in the store', async () => {
      fetch.mockResponse(mockTodoResponse)
      const todo = await store.findOne('todos', '1')
      expect(todo.title).toEqual('Do taxes')
      expect(fetch.mock.calls).toHaveLength(1)
    })

    it('supports queryParams', async () => {
      fetch.mockResponse(mockTodoResponse)
      await store.findOne('todos', '1', {
        queryParams: {
          filter: {
            due_at: '2019-01-01'
          },
          include: 'todo.notes',
          fields: { notes: 'text' },
          user_id: '1'
        }
      })
      expect(decodeURIComponent(fetch.mock.calls[0][0])).toEqual(
        '/example_api/todos/1?filter[due_at]=2019-01-01&include=todo.notes&fields[notes]=text&user_id=1'
      )
    })
  })

  describe('getAll', () => {
    it('returns the record with the given type from the store', () => {
      store.add('todos', [{ title: 'Buy Milk' }, { title: 'Make milkshake' }])
      const foundRecords = store.getAll('todos')
      expect(foundRecords[0].title).toEqual('Buy Milk')
      expect(foundRecords[1].title).toEqual('Make milkshake')
    })

    it('returns records with a unique id', () => {
      store.add('todos', [{ id: 1, title: 'Buy Milk' }, { id: 1, title: 'Make milkshake' }, { id: 2, title: 'Guzzle milkshake' }])
      const foundRecords = store.getAll('todos')
      expect(foundRecords).toHaveLength(2)
      expect(foundRecords[0].title).toEqual('Make milkshake')
      expect(foundRecords[1].title).toEqual('Guzzle milkshake')
    })

    it('returns an empty array if there are no records in the store', () => {
      store.reset()
      expect(store.getAll('todos')).toHaveLength(0)
    })
  })

  describe('findAll', () => {
    describe('no records of the specified type exist in the store', () => {
      it('fetches data from the server', async () => {
        fetch.mockResponse(mockTodosResponse)
        const query = store.findAll('todos')
        expect(query).toBeInstanceOf(Promise)
        const todos = await query
        expect(todos).toHaveLength(1)
        expect(todos[0].title).toEqual('Do taxes')
        expect(fetch.mock.calls).toHaveLength(1)
        expect(fetch.mock.calls[0][0]).toEqual('/example_api/todos')
      })
    })

    describe('records of the specified type exist in the store', () => {
      it('does not fetch and returns records from the store', () => {
        store.add('todos', { title: 'Buy Milk' })
        const todos = store.findAll('todos')
        expect(fetch.mock.calls).toHaveLength(0)
        expect(todos).toBeInstanceOf(Array) // TODO: will be changed to return Promise in the future
        expect(todos).toHaveLength(1)
      })
    })

    describe('if a query is made with identical params', () => {
      it('skips fetch and returns local data from the store', async () => {
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
        expect(query).toBeInstanceOf(Array) // TODO: will be changed to return Promise in the future
        todos = await query
        // Not fetch should be kicked off
        expect(todos).toHaveLength(1)
        expect(fetch.mock.calls).toHaveLength(1)
      })
    })

    it('fetches data with filter params', async () => {
      fetch.mockResponse(mockTodosResponse)
      await store.findAll('todos', {
        queryParams: {
          filter: {
            title: 'Do taxes',
            overdue: true
          }
        }
      })
      expect(fetch.mock.calls).toHaveLength(1)
      expect(decodeURIComponent(fetch.mock.calls[0][0])).toEqual(
        '/example_api/todos?filter[title]=Do taxes&filter[overdue]=true'
      )
    })

    it('fetches data with include params', async () => {
      fetch.mockResponse(mockTodosResponse)
      await store.findAll('todos', {
        queryParams: {
          include: 'todo.notes,todo.comments'
        }
      })
      expect(fetch.mock.calls).toHaveLength(1)
      expect(decodeURIComponent(fetch.mock.calls[0][0])).toEqual(
        '/example_api/todos?include=todo.notes,todo.comments'
      )
    })

    it('fetches data with named query params', async () => {
      fetch.mockResponse(mockTodosResponse)
      await store.findAll('todos', {
        queryParams: {
          foo: 'bar'
        }
      })
      expect(fetch.mock.calls).toHaveLength(1)
      expect(decodeURIComponent(fetch.mock.calls[0][0])).toEqual(
        '/example_api/todos?foo=bar'
      )
    })

    it('fetches data with named array filters', async () => {
      fetch.mockResponse(mockTodosResponse)
      await store.findAll('todos', {
        queryParams: {
          filter: {
            ids: ['1', '2']
          }
        }
      })
      expect(fetch.mock.calls).toHaveLength(1)
      expect(decodeURIComponent(fetch.mock.calls[0][0])).toEqual(
        '/example_api/todos?filter[ids][]=1&filter[ids][]=2'
      )
    })

    it('caches list ids by request url', async () => {
      fetch.mockResponse(mockTodosResponse)
      await store.findAll('todos')
      const cache = toJS(store.data.todos.cache)
      expect(cache.get('/example_api/todos')).toEqual(['1'])
    })

    it('fetched data snapshots are marked as persisted', async () => {
      fetch.mockResponse(mockTodosResponse)

      // Create an existing todo
      store.add('todos', {
        id: mockTodoData.data.id,
        attributes: mockTodoData.data.attributes
      })

      const todos = await store.findAll('todos')

      expect(todos[0].previousSnapshot.persisted).toBeTruthy()
    })

    describe('cache behavior', () => {
      const assertionText = `If you fetch a record from the server,
        update its attributes (client-only), then look it up again via
        the same query
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

        it('will populate and clear the cache', async () => {
          fetch.mockResponse(mockTodosResponse)
          const queryUrl = '/example_api/todos?title=Do%20taxes'

          // Populate the cache
          await store.findAll('todos', {
            queryParams: {
              title: 'Do taxes'
            }
          })

          // Get the current cache of IDs
          let cachedIds = store.getCachedIds('todos', queryUrl)
          expect(cachedIds.length).toBe(1)

          // Clear the cache
          await store.clearCache('todos')

          // Get the cache of IDs after clearing
          cachedIds = store.getCachedIds('todos', queryUrl)
          expect(cachedIds.length).toBe(0)
        })
      })
    })

    it('returns cached meta', async () => {
      fetch.mockResponse(mockTodosResponseWithMeta)
      // Populate the cache
      await store.findAll('todos', {
        queryParams: {
          title: 'Do taxes'
        }
      })

      const todos = await store.findAll('todos', {
        queryParams: {
          title: 'Do taxes'
        }
      })
      expect(todos.meta.data).toEqual('present')
    })
  })

  describe('fetchAll', () => {
    it('always fetches the records with the given type from the server', async () => {
      fetch.mockResponse(mockAllTodosResponse)
      const todos = await store.fetchAll('todos')

      expect(todos).toHaveLength(2)
      expect(todos[0].title).toBe('Do taxes')
      expect(todos[0].id).toBe('1')
      expect(todos[1].title).toBe('Sort pills')
      expect(todos[1].id).toBe('2')

      expect(fetch.mock.calls).toHaveLength(1)
      expect(fetch.mock.calls[0][0]).toEqual('/example_api/todos')
    })

    it('returns a rejected Promise with the status if fetching fails', async () => {
      fetch.mockResponse('', { status: 401 })
      const query = store.fetchAll('todos')
      expect(query).toBeInstanceOf(Promise)
      await expect(query).rejects.toEqual(401)
    })

    it('allows setting a tag for a query', async () => {
      expect.assertions(4)

      fetch.mockResponseOnce(() => {
        expect(toJS(store.loadingStates.get('loadingSpecialTodos'))).toMatchObject(new Set([JSON.stringify({ url: '/example_api/todos?a=b', type: 'todos', queryParams: { a: 'b' }, queryTag: 'loadingSpecialTodos' })]))
        expect(store.loadingTodos).toBe(false)
        return Promise.resolve(JSON.stringify({ data: [] }))
      })

      await store.fetchAll('todos', { queryTag: 'loadingSpecialTodos', queryParams: { a: 'b' } })
      expect(store.loadingStates.get('loadingSpecialTodos')).toBeUndefined()
      expect(store.loadingTodos).toBe(false)
    })

    it('sets a default tag for a query', async () => {
      expect.assertions(4)

      fetch.mockResponseOnce(() => {
        expect(toJS(store.loadingStates.get('todos'))).toMatchObject(new Set([JSON.stringify({ url: '/example_api/todos', type: 'todos', queryParams: undefined, queryTag: 'todos' })]))
        expect(store.loadingTodos).toBe(true)
        return Promise.resolve(JSON.stringify({ data: [] }))
      })

      await store.fetchAll('todos')
      expect(store.loadingStates.get('todos')).toBeUndefined()
      expect(store.loadingTodos).toBe(false)
    })

    it('supports multiple loading states from the same tag', async () => {
      expect.assertions(3)

      fetch.mockResponseOnce(() => {
        expect(toJS(store.loadingStates.get('todos'))).toMatchObject(new Set([JSON.stringify({ url: '/example_api/todos?a=b', type: 'todos', queryParams: { a: 'b' }, queryTag: 'todos' })]))
        return new Promise((resolve) => setTimeout(() => resolve(JSON.stringify({ data: [] })), 100))
      })

      fetch.mockResponseOnce(() => {
        expect(toJS(store.loadingStates.get('todos'))).toMatchObject(new Set([
          JSON.stringify({ url: '/example_api/todos?a=b', type: 'todos', queryParams: { a: 'b' }, queryTag: 'todos' }),
          JSON.stringify({ url: '/example_api/todos?c=d', type: 'todos', queryParams: { c: 'd' }, queryTag: 'todos' })
        ]))
        return Promise.resolve(JSON.stringify({ data: [] }))
      })

      await Promise.all([
        store.fetchAll('todos', { queryParams: { a: 'b' } }),
        store.fetchAll('todos', { queryParams: { c: 'd' } })
      ])

      expect(store.loadingStates.get('todos')).toBeUndefined()
    })

    it('records meta', async () => {
      expect.assertions(3)
      fetch.mockResponse(mockTodosResponseWithMeta)
      const todos = await store.fetchAll('todos')
      expect(todos.meta.data).toEqual('present')
      expect(todos[0].tags).toHaveLength(0)
      expect(todos[0].notes).toHaveLength(0)
    })

    it('only fetches once when called multiple times', async () => {
      expect.assertions(2)

      console.warn = jest.fn()
      const mockResponseData = JSON.stringify({ data: [] })

      fetch.mockResponseOnce(() => (new Promise((resolve) => setTimeout(() => resolve(mockResponseData), 100))))
      fetch.mockResponseOnce(Promise.resolve(mockResponseData))

      await Promise.all([
        store.fetchAll('todos'),
        store.fetchAll('todos')
      ])

      expect(fetch.mock.calls).toHaveLength(1)
      expect(console.warn).toHaveBeenCalledWith('no loadingState found for {"url":"/example_api/todos","type":"todos","queryTag":"todos"}')
    })

    it('supports queryParams', async () => {
      expect.assertions(2)
      fetch.mockResponse(mockTodosResponse)
      await store.fetchAll('todos', {
        queryParams: {
          filter: {
            title: 'Do taxes',
            overdue: true
          },
          include: 'todo.notes',
          fields: { todos: 'title' },
          user_id: '13'
        }
      })
      expect(fetch.mock.calls).toHaveLength(1)
      expect(decodeURIComponent(fetch.mock.calls[0][0])).toEqual(
        '/example_api/todos?filter[title]=Do taxes&filter[overdue]=true&include=todo.notes&fields[todos]=title&user_id=13'
      )
    })
  })

  describe('getMany', () => {
    it('returns the records with the given type and ids from the store, never fetches from the server', () => {
      store.add('todos', createMockTodosAttributes(5, '1000'))
      const [foundRecord1, foundRecord2] = store.getMany('todos', [
        '1000',
        '1001',
        '5000'
      ])
      expect(foundRecord1.title).toEqual('Todo 1000')
      expect(foundRecord2.title).toEqual('Todo 1001')
    })

    it('returns an empty array if there are no records in the store with the given ids', () => {
      store.add('todos', createMockTodosAttributes(5, '1000'))
      const todos = store.getMany('todos', ['1'])
      expect(todos).toHaveLength(0)
    })
  })

  describe('fetchMany', () => {
    it('returns a promise with the records of the given type and id', async () => {
      expect.assertions(5)
      fetch.mockResponse(createMockTodosResponse(5, '1000'))
      const ids = createMockIds(5, '1000')
      const query = store.fetchMany('todos', ids)
      expect(query).toBeInstanceOf(Promise)
      const todos = await query
      expect(todos).toHaveLength(5)
      expect(todos[0].title).toEqual('Todo 1000')
      expect(fetch.mock.calls).toHaveLength(1)
      expect(fetch.mock.calls[0][0]).toEqual(
        '/example_api/todos?filter%5Bids%5D=1000%2C1001%2C1002%2C1003%2C1004'
      )
    })

    it('returns an empty array if there are no records of the given type and ids', async () => {
      expect.assertions(2)
      fetch.mockResponse(JSON.stringify({ data: [] }))
      const todos = await store.fetchMany('todos', ['1'])
      expect(todos).toHaveLength(0)
      expect(fetch.mock.calls).toHaveLength(1)
    })

    it('allows setting a tag for a query', async () => {
      expect.assertions(2)

      fetch.mockResponseOnce(() => {
        expect(toJS(store.loadingStates.get('loadingSpecialTodos'))).toMatchObject(new Set([JSON.stringify({ url: '/example_api/todos?filter%5Bids%5D=1', type: 'todos', queryParams: { filter: { ids: '1' } }, queryTag: 'loadingSpecialTodos' })]))
        return Promise.resolve(JSON.stringify({ data: [] }))
      })

      await store.fetchMany('todos', ['1'], { queryTag: 'loadingSpecialTodos' })
      expect(store.loadingStates.get('loadingSpecialTodos')).toBeUndefined()
    })

    it('returns a rejected Promise with the status if fetching fails', async () => {
      expect.assertions(2)
      fetch.mockResponse('', { status: 401 })
      const ids = createMockIds(5, '1000')
      const query = store.fetchMany('todos', ids)
      expect(query).toBeInstanceOf(Promise)
      await expect(query).rejects.toEqual(401)
    })

    it('uses multiple fetches for data from server', async () => {
      expect.assertions(7)
      fetch.mockResponseOnce(createMockTodosResponse(100, '1000'))
      fetch.mockResponseOnce(createMockTodosResponse(100, '1100'))
      fetch.mockResponseOnce(createMockTodosResponse(100, '1200'))

      const ids = createMockIds(300, '1000')
      const todos = await store.fetchMany('todos', ids)

      expect(todos).toHaveLength(300)
      expect(store.getAll('todos')).toHaveLength(300)

      expect(fetch.mock.calls).toHaveLength(3)
      const [firstCall] = fetch.mock.calls[0]
      expect(decodeURIComponent(firstCall)).toMatch(/1139$/)

      fetch.mock.calls.forEach((call) => {
        expect(call[0].length).toBeLessThan(URL_MAX_LENGTH)
      })
    })

    it('supports queryParams', async () => {
      expect.assertions(2)
      fetch.mockResponse(createMockTodosResponse(5, '1000'))
      const ids = createMockIds(5, '1000')
      await store.fetchMany('todos', ids, {
        queryParams: {
          filter: {
            due_at: '2019-01-01'
          },
          include: 'todo.notes',
          fields: { todos: 'title' },
          user_id: '4'
        }
      })

      expect(fetch.mock.calls).toHaveLength(1)
      expect(decodeURIComponent(fetch.mock.calls[0][0])).toEqual(
        '/example_api/todos?filter[due_at]=2019-01-01&filter[ids]=1000,1001,1002,1003,1004&include=todo.notes&fields[todos]=title&user_id=4'
      )
    })

    it('caches list ids by request url', async () => {
      expect.assertions(1)
      fetch.mockResponse(mockTodosResponse)

      await store.fetchMany('todos', ['1'])
      const cache = toJS(store.data.todos.cache)
      expect(cache.get('/example_api/todos?filter%5Bids%5D=1')).toEqual(['1'])
    })
  })

  describe('findMany', () => {
    describe('no records of the specified type and ids exist in the store', () => {
      it('uses multiple fetches to request all records from server', async () => {
        expect.assertions(7)

        fetch.mockResponseOnce(createMockTodosResponse(100, '1000'))
        fetch.mockResponseOnce(createMockTodosResponse(100, '1100'))
        fetch.mockResponseOnce(createMockTodosResponse(100, '1200'))

        const ids = createMockIds(300, '1000')
        const todos = await store.findMany('todos', ids)

        expect(todos).toHaveLength(300)
        expect(store.getAll('todos')).toHaveLength(300)

        expect(fetch.mock.calls).toHaveLength(3)
        const [firstCall] = fetch.mock.calls[0]
        expect(decodeURIComponent(firstCall)).toMatch(/1139$/)

        fetch.mock.calls.forEach((call) => {
          expect(call[0].length).toBeLessThan(URL_MAX_LENGTH)
        })
      })

      it('uses multiple fetches to request all records from server', async () => {
        expect.assertions(7)

        fetch.mockResponseOnce(createMockTodosResponse(100, '1000'))
        fetch.mockResponseOnce(createMockTodosResponse(100, '1100'))
        fetch.mockResponseOnce(createMockTodosResponse(100, '1200'))

        const ids = createMockIds(300, '1000')
        const todos = await store.findMany('todos', ids)

        expect(todos).toHaveLength(300)
        expect(store.getAll('todos')).toHaveLength(300)

        expect(fetch.mock.calls).toHaveLength(3)
        const [firstCall] = fetch.mock.calls[0]
        expect(decodeURIComponent(firstCall)).toMatch(/1139$/)

        fetch.mock.calls.forEach((call) => {
          expect(call[0].length).toBeLessThan(URL_MAX_LENGTH)
        })
      })
    })

    describe('some records of the specified type and ids are the store', () => {
      it('uses multiple fetches to request the rest of the records from the server', async () => {
        expect.assertions(7)

        fetch.mockResponseOnce(createMockTodosResponse(100, '1000'))
        fetch.mockResponseOnce(createMockTodosResponse(75, '1100'))

        store.add('todos', createMockTodosAttributes(150, '1175'))

        const ids = createMockIds(300, '1000')
        const todos = await store.findMany('todos', ids)

        expect(todos).toHaveLength(300)
        expect(store.getAll('todos')).toHaveLength(325)

        expect(fetch.mock.calls).toHaveLength(2)
        expect(
          fetch.mock.calls.some((call) => call[0].match(/1174/))
        ).toBeTruthy()
        expect(
          fetch.mock.calls.some((call) => call[0].match(/1175/))
        ).toBeFalsy()

        fetch.mock.calls.forEach((call) => {
          expect(call[0].length).toBeLessThan(URL_MAX_LENGTH)
        })
      })
    })

    describe('all records of the specified type and ids are the store', () => {
      it('uses the cache instead of requesting from the server', async () => {
        expect.assertions(3)

        store.add('todos', createMockTodosAttributes(400, '1000'))

        const ids = createMockIds(300, '1000')
        const todos = await store.findMany('todos', ids)

        expect(todos).toHaveLength(300)
        expect(store.getAll('todos')).toHaveLength(400)

        expect(fetch.mock.calls).toHaveLength(0)
      })

      it('uses the cache instead of requesting from the server, even with duplicate ids', async () => {
        expect.assertions(3)

        store.add('todos', createMockTodosAttributes(400, '1000'))

        const ids = [...createMockIds(300, '1000'), ...createMockIds(300, '1000')]
        const todos = await store.findMany('todos', ids)

        expect(todos).toHaveLength(300)
        expect(store.getAll('todos')).toHaveLength(400)

        expect(fetch.mock.calls).toHaveLength(0)
      })
    })

    it('fetches data with other params', async () => {
      expect.assertions(10)
      const ids = createMockIds(300, '1000')
      fetch.mockResponse(mockTodosResponse)

      await store.findMany('todos', ids, {
        queryParams: {
          include: 'todo.notes',
          filter: {
            title: 'Do taxes',
            overdue: true
          }
        }
      })

      expect(fetch.mock.calls).toHaveLength(3)
      fetch.mock.calls.forEach((call) => {
        const [path] = call
        expect(decodeURIComponent(path)).toMatch(
          '/example_api/todos?include=todo.notes&filter[title]=Do taxes&filter[overdue]=true'
        )
        expect(call.length).toBeLessThan(URL_MAX_LENGTH)
      })

      const [[firstPath], [secondPath], [thirdPath]] = fetch.mock.calls

      expect(decodeURIComponent(firstPath)).toMatch(/1129$/)
      expect(decodeURIComponent(secondPath)).toMatch(/1259$/)
      expect(decodeURIComponent(thirdPath)).toMatch(/1299$/)
    })

    it('fetches data with named array filters', async () => {
      expect.assertions(8)
      fetch.mockResponse(mockTodosResponse)

      const ids = createMockIds(300, '1000')
      await store.findMany('todos', ids, {
        queryParams: {
          filter: {
            category: 'important'
          }
        }
      })

      expect(fetch.mock.calls).toHaveLength(3)
      fetch.mock.calls.forEach((call) => {
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

      await store.findMany('todos', ['1'])
      const cache = toJS(store.data.todos.cache)
      expect(cache.get('/example_api/todos?filter%5Bids%5D=1')).toEqual(['1'])
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
        {
          id: 1,
          type: 'todos',
          attributes: { title: 'hello!' },
          relationships: {}
        },
        {
          id: 2,
          type: 'todos',
          attributes: { title: 'see ya!' },
          relationships: {}
        }
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
        {
          id: 1,
          type: 'todos',
          attributes: { title: 'hello!' },
          relationships: {}
        },
        {
          id: 2,
          type: 'unknown',
          attributes: { title: 'see ya!' },
          relationships: {}
        }
      ]
      const todos = store.createModelsFromData(dataObjs)
      expect(todos).toHaveLength(2)
      expect(todos[0].type).toEqual('todos')
      expect(todos[1]).toBe(null)
    })
  })
})
