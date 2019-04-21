/* global fetch */

import { isObservable } from 'mobx'
import { Store, Model, attribute } from '../main.js'

const timeStamp = new Date().toISOString().split('T')[0]

class Todo extends Model {
  static type = 'todos'
  static endpoint = 'todos'

  @attribute(String) static title = 'NEW TODO'
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
      title: 'Do taxes',
      created_at: timeStamp
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

describe('Model', () => {
  beforeEach(() => {
    fetch.resetMocks()
    store.reset()
  })

  describe('.save', () => {
    it('makes request and updates model in store', async () => {
      expect.assertions(8)
      // Add record to store
      const example = store.add('todos', { title: 'Buy Milk' })
      // Check the model doesn't have attributes
      // only provided by an API request
      expect(example).not.toHaveProperty('created_at')
      // Check that the model has a tmp id
      expect(example.id).toMatch('tmp')
      expect(example.id).toMatch(timeStamp)
      // Mock the API response
      fetch.mockResponse(mockTodoResponse)
      // Trigger the save function and subsequent request
      await example.save()
      // Assert the request was made with the correct
      // url and fetch options
      expect(fetch.mock.calls).toHaveLength(1)
      expect(fetch.mock.calls[0][0]).toEqual('/example_api/todos')
      expect(fetch.mock.calls[0][1].method).toEqual('POST')
      // Check that the id is now what was provider from
      // the server
      expect(example.id).toEqual(1)
      // Check that the `created_at` attribute is populated
      expect(example.created_at).toEqual(timeStamp)
    })
  })
})
