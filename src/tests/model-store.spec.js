/* global fetch */
import { Store, Model, attribute } from '../main.js'

const timeStamp = new Date().toISOString().split('T')[0]

class Todo extends Model {
  static type = 'todos'
  static endpoint = 'todos'

  @attribute(String) title = 'NEW TODO'
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

// jest.useFakeTimers()

describe('Model store based actions', () => {
  beforeEach(() => {
    fetch.resetMocks()
    store.reset()
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
      expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual({
        data: {
          type: 'todos',
          attributes: {
            title: 'Buy Milk'
          }
        }
      })
      // Check that the id is now what was provider
      // from the server
      expect(example.id).toEqual(1)
      // Check that the `created_at` attribute is populated
      expect(example.created_at).toEqual(timeStamp)
    })
  })
})
