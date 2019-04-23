/* global fetch */
import { autorun, isObservable } from 'mobx'
import moment from 'moment'

import {
  attribute,
  hasMany,
  Model,
  Store
} from '../main.js'

import exampleRelationalResponse from './fixtures/exampleRelationalResponse'

// YYYY-MM-DD
const timestamp = moment()

class Note extends Model {
  static type = 'notes'
  static endpoint = 'notes'

  @attribute(String) description = ''
}

class Todo extends Model {
  static type = 'todos'
  static endpoint = 'todos'

  @attribute(String) title = 'NEW TODO'
  @attribute(Date) due_at = timestamp

  @hasMany(Note) notes
}

class AppStore extends Store {
  static types = [
    Todo,
    Note
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
      title: 'Do taxes',
      created_at: timestamp.format('YYYY-MM-DD')
    }
  }
}

const mockTodoResponse = JSON.stringify(mockTodoData)

describe('Model', () => {
  beforeEach(() => {
    fetch.resetMocks()
    store.reset()
  })

  describe('initialization', () => {
    it('attributes can have default values', () => {
      const todo = new Todo()
      expect(todo.title).toEqual('NEW TODO')
      todo.title = 'test'
      expect(todo.title).toEqual('test')
    })

    it('attributes are observable', (done) => {
      const todo = new Todo({ title: 'one' })
      expect(isObservable(todo)).toBe(true)

      let runs = 0
      const expected = ['one', 'two', 'three']
      autorun(() => {
        expect(todo.title).toBe(expected[runs])
        runs++
        if (runs === 3) {
          done()
        }
      })

      todo.title = 'two'
      todo.title = 'three'
    })

    it('attributes are overridable in constructor', () => {
      const todo = new Todo({ title: 'Buy Milk' })
      expect(todo.title).toEqual('Buy Milk')
    })

    it('attributes can be set', () => {
      const todo = new Todo()
      todo.title = 'Do laundry'
      expect(todo.title).toEqual('Do laundry')
    })

    it('hasMany returns matching records', async () => {
      expect.assertions(3)
      // Add record to store

      const expectedDesciption = 'Use new fabric softener'

      store.add('notes', {
        id: 1,
        description: expectedDesciption
      })

      fetch.mockResponse(exampleRelationalResponse)
      const todo = await store.findOne('todos', 1)

      expect(todo.title).toEqual('Do laundry')

      expect(todo.notes).toHaveLength(1)
      expect(todo.notes[0].description)
        .toEqual(expectedDesciption)
    })
  })

  describe('.snapshot', () => {
    it('sets snapshot on initialization', async () => {
      const todo = new Todo({ title: 'Buy Milk' })
      expect(todo.snapshot).toEqual({
        title: 'Buy Milk',
        due_at: timestamp
      })
    })
  })

  describe('.jsonapi', () => {
    it('returns data in valid jsonapi structure with coerced values', async () => {
      const todo = new Todo({ id: 1, title: 'Buy Milk' })
      expect(todo.jsonapi).toEqual({
        data: {
          id: '1',
          type: 'todos',
          attributes: {
            id: 1,
            title: 'Buy Milk',
            due_at: Date(timestamp)
          }
        }
      })
    })
  })

  describe('.isDirty', () => {
    it('is initially false', async () => {
      const todo = new Todo({ title: 'Buy Milk' })
      expect(todo.isDirty).toBeFalsy()
    })

    it('is set to true if record changes', async () => {
      const todo = new Todo({ title: 'Buy Milk' })
      todo.title = 'Do the laundry'
      expect(todo.isDirty).toBe(true)
    })
  })

  describe('.rollback', () => {
    it('rollback restores data to last persisted state ', async () => {
      const todo = new Todo({ title: 'Buy Milk' })
      expect(todo.snapshot.title).toEqual('Buy Milk')
      todo.title = 'Do Laundry'
      expect(todo.snapshot.title).toEqual('Do Laundry')
      todo.rollback()
      expect(todo.title).toEqual('Buy Milk')
      expect(todo.snapshot.title).toEqual('Buy Milk')
    })
  })

  describe('.save', () => {
    it('handles in flight behavior', (done) => {
      // expect.assertions(3)
      // Mock slow server response
      fetch.mockResponseOnce(() => {
        return new Promise(resolve => {
          return setTimeout(() => resolve({
            body: mockTodoResponse
          }), 1000)
        })
      })

      const todo = store.add('todos', { title: 'Buy Milk' })
      expect(todo.isInFlight).toBe(false)

      todo.save()
      // Assert isInFlight is true
      expect(todo.isInFlight).toBe(true)
      // Assert title hasn't changed yet
      expect(todo.title).toEqual('Buy Milk')

      setTimeout(() => {
        expect(todo.isInFlight).toBe(false)
        expect(todo.title).toEqual('Do taxes')
        done()
      }, 1001)
    })

    it('makes request and updates model in store', async () => {
      expect.assertions(9)
      // Add record to store
      const example = store.add('todos', { title: 'Buy Milk' })
      // Check the model doesn't have attributes
      // only provided by an API request
      expect(example).not.toHaveProperty('created_at')
      // Check that the model has a tmp id
      expect(example.id).toMatch('tmp')
      const timeString = timestamp.format('YYYY-MM-DD')
      expect(example.id).toMatch(timeString)
      // Mock the API response
      fetch.mockResponse(mockTodoResponse)
      // Trigger the save function and subsequent request
      await example.save()
      // Assert the request was made with the correct
      // url and fetch options
      expect(fetch.mock.calls).toHaveLength(1)
      expect(fetch.mock.calls[0][0]).toEqual('/example_api/todos')
      expect(fetch.mock.calls[0][1].method).toEqual('POST')
      expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual({
        data: {
          type: 'todos',
          attributes: {
            title: 'Buy Milk',
            due_at: Date(timestamp)
          }
        }
      })
      // Check that the id is now what was provider
      // from the server
      expect(example.id).toEqual(1)
      // Check that the `created_at` attribute is populated
      expect(example.created_at)
        .toEqual(timestamp.format('YYYY-MM-DD'))
    })
  })
})
