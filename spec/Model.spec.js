/* global fetch */
import { autorun, isObservable } from 'mobx'
import moment from 'moment'

import {
  Model,
  Store,
  attribute,
  relatedToMany,
  relatedToOne,
  validates
} from '../src/main'

import {
  exampleRelatedToManyResponse,
  exampleRelatedToManyWithNoiseResponse,
  exampleRelatedToManyIncludedResponse,
  exampleRelatedToManyIncludedWithNoiseResponse
} from './fixtures/exampleRelationalResponses'

// YYYY-MM-DD
const timestamp = moment()

class Note extends Model {
  static type = 'notes'
  static endpoint = 'notes'

  @attribute(String) description
  @relatedToOne organization
}

function validatesArray (property) {
  return {
    isValid: Array.isArray(property),
    errors: [{
      key: 'must_be_an_array',
      message: 'must be an array'
    }]
  }
}

function validatesOptions (property, target) {
  const errors = []

  if (target.requiredOptions) {
    target.requiredOptions.forEach(optionKey => {
      if (!property[optionKey]) {
        errors.push({
          key: 'blank',
          message: 'can\t be blank',
          data: { optionKey }
        })
      }
    })
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

class Organization extends Model {
  static type = 'organizations'
  static endpoint = 'organizations'

  @validates
  @attribute(String) title = 'NEW TODO'

  @attribute(Date) due_at = timestamp

  @validates(validatesArray)
  @attribute(Array) tags

  @validates(validatesOptions)
  @attribute(Object) options = {}

  @relatedToMany(Note) meeting_notes
  @relatedToMany notes
}

class AppStore extends Store {
  static types = [
    Organization,
    Note
  ]
}

const mockBaseUrl = '/example_api'

const mockFetchOptions = {
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
    type: 'organizations',
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
    it('attributes default to specified type', () => {
      const todo = new Organization()
      expect(todo.tags).toBeInstanceOf(Array)
      const note = new Note()
      expect(note.description).toEqual('')
    })

    it('attributes can have default values', () => {
      const todo = new Organization()
      expect(todo.title).toEqual('NEW TODO')
      todo.title = 'test'
      expect(todo.title).toEqual('test')
    })

    it('attributes are observable', (done) => {
      const todo = new Organization({ title: 'one' })
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
      const todo = new Organization({ title: 'Buy Milk' })
      expect(todo.title).toEqual('Buy Milk')
    })

    it('attributes can be set', () => {
      const todo = new Organization()
      todo.title = 'Do laundry'
      expect(todo.title).toEqual('Do laundry')
      todo.tags.push('chore')
      expect(todo.tags).toHaveLength(1)
      expect(todo.tags[0]).toEqual('chore')
    })

    it('attributes are observable', (done) => {
      const todo = new Organization({})

      let runs = 0
      const expected = [undefined, 'one', 'two']
      autorun(() => {
        expect(todo.options.test).toEqual(expected[runs])
        runs++
        if (runs === 2) {
          done()
        }
      })

      todo.options.test = 'one'
      todo.options.test = 'two'
    })

    it('attributes are observable', () => {
      const todo = store.add('organizations', { id: 1, title: 'Buy Milk', options: { test: 'one' } })

      expect(todo.options.test).toEqual('one')
    })

    it('relatedToOne relationship can be set', () => {
      const note = store.add('notes', {
        id: 1,
        description: 'Example description'
      })
      const todo = store.add('organizations', { id: 1, title: 'Buy Milk' })
      note.organization = todo
      expect(note.organization).toEqual(todo)
    })

    it('relatedToOne relationship can be unset', () => {
      const note = store.add('notes', {
        id: 1,
        description: 'Example description'
      })
      const todo = store.add('organizations', { id: 1, title: 'Buy Milk' })

      note.organization = todo
      expect(note.organization).toEqual(todo)

      note.organization = null
      expect(note.organization).toBeFalsy()
    })

    it('relatedToOne relationship adds to inverse', () => {
      const note = store.add('notes', {
        id: 1,
        description: 'Example description'
      })
      let todo = store.add('organizations', { id: 1, title: 'Buy Milk' })

      note.organization = todo
      expect(todo.notes).toContain(note)
    })

    it('relatedToOne relationship removes from inverse', () => {
      const note = store.add('notes', {
        id: 1,
        description: 'Example description'
      })

      const todo = store.add('organizations', { id: 1, title: 'Buy Milk' })

      note.organization = todo
      expect(todo.notes).toContain(note)

      note.organization = null
      expect(note.organization).toBeFalsy()
    })

    it('builds relatedToMany relationship with existing models', async () => {
      store.add('notes', {
        id: 1,
        description: 'Example description'
      })

      fetch.mockResponse(exampleRelatedToManyResponse)
      const todo = await store.findOne('organizations', 1)

      expect(todo.title).toEqual('Do laundry')
      expect(todo.notes).toHaveLength(1)
      expect(todo.notes[0].description).toEqual('Example description')
    })

    it('builds relatedToMany relationship with included data', async () => {
      fetch.mockResponse(exampleRelatedToManyIncludedResponse)
      const todo = await store.findOne('organizations', 1)

      expect(todo.title).toEqual('Do laundry')
      expect(todo.notes).toHaveLength(1)
      expect(todo.notes[0].description).toEqual('Use fabric softener')
    })

    it('builds aliased relatedToMany relationship', async () => {
      fetch.mockResponse(exampleRelatedToManyIncludedResponse)
      const todo = await store.findOne('organizations', 1)

      expect(todo.title).toEqual('Do laundry')
      expect(todo.meeting_notes).toHaveLength(1)
      expect(todo.meeting_notes[0].description).toEqual('Use fabric softener')
    })

    it('ignores unexpected types in relationship data', async () => {
      fetch.mockResponse(exampleRelatedToManyWithNoiseResponse)
      const todo = await store.findOne('organizations', 1)

      expect(todo.title).toEqual('Do laundry')
      expect(todo.notes).toHaveLength(1)
    })

    it('ignores unexpected types in included data', async () => {
      fetch.mockResponse(exampleRelatedToManyIncludedWithNoiseResponse)
      const todo = await store.findOne('organizations', 1)

      expect(todo.title).toEqual('Do laundry')
      expect(todo.notes).toHaveLength(1)
      expect(todo.notes[0].description).toEqual('Use fabric softener')
    })
  })

  it('relatedToMany models can be added', () => {
    const note = store.add('notes', {
      id: 10,
      description: 'Example description'
    })
    const todo = store.add('organizations', { id: 10, title: 'Buy Milk' })
    const { notes } = todo

    notes.add(note)

    expect(notes).toContain(note)
    expect(todo.notes).toContain(note)
  })

  it('relatedToMany doesn\'t blow up on empty iteration', () => {
    const todo = store.add('organizations', { id: 10, title: 'Buy Milk' })
    expect(todo.notes).toHaveLength(0)
    expect(todo.notes.map(note => note)).toHaveLength(0)
  })

  it('relatedToMany doesn\'t blow up after adding to empty array', () => {
    const todo = store.add('organizations', { id: 10, title: 'Buy Milk' })
    expect(todo.notes).toHaveLength(0)
    expect(todo.notes.map(note => note)).toHaveLength(0)

    const note = store.add('notes', {
      id: 10,
      description: 'Example description'
    })

    todo.notes.add(note)

    expect(todo.notes.map(note => note)).toHaveLength(1)
  })

  it('relatedToMany models can be removed', () => {
    const note = store.add('notes', {
      id: 10,
      description: 'Example description'
    })
    const todo = store.add('organizations', { id: 10, title: 'Buy Milk' })

    todo.notes.add(note)

    expect(todo.notes).toContain(note)

    todo.notes.remove(note)
    expect(todo.notes).not.toContain(note)
  })

  it('relatedToMany models adds inverse relationships', () => {
    const note = store.add('notes', {
      id: 10,
      description: 'Example description'
    })
    const todo = store.add('organizations', { id: 10, title: 'Buy Milk' })

    todo.notes.add(note)

    expect(todo.notes).toContain(note)
    expect(note.organization).toEqual(todo)
  })

  it('relatedToMany models remove inverse relationships', () => {
    const note = store.add('notes', {
      id: 10,
      description: 'Example description'
    })
    const todo = store.add('organizations', { id: 10, title: 'Buy Milk' })

    todo.notes.add(note)

    expect(note.organization).toEqual(todo)

    todo.notes.remove(note)

    expect(note.organization).toBeFalsy()
  })

  it('relationship arrays provide regular arrays for derived objects', () => {
    const note = store.add('notes', {
      id: 10,
      description: 'Example description'
    })
    const todo = store.add('organizations', { id: 10, title: 'Buy Milk' })

    todo.notes.add(note)

    expect(todo.notes.constructor.name).toEqual('RelatedRecordsArray')
    expect(todo.notes.map((x) => x.id).constructor.name).toEqual('Array')
    expect(todo.notes.map((x) => x.id)).toEqual([10])
  })

  describe('.snapshot', () => {
    it('sets snapshot on initialization', async () => {
      const todo = new Organization({ title: 'Buy Milk' })
      expect(todo.previousSnapshot.attributes).toEqual({
        due_at: moment(timestamp).toDate(),
        tags: [],
        title: 'Buy Milk',
        options: {}
      })
    })
  })

  describe('.dirtyAttributes', () => {
    it('returns a list of paths for attributes that have been mutated since the last snapshot', async () => {
      const todo = new Organization({ title: 'Buy Milk' })
      expect(todo.dirtyAttributes).toHaveLength(0)
      todo.title = 'Buy Cheese'
      expect(todo.dirtyAttributes).toHaveLength(1)
      expect(todo.dirtyAttributes[0]).toEqual('title')
    })

    it('works on nested attributes', async () => {
      const todo = new Organization({ title: 'Buy Milk', options: { variety: '2%' } })
      expect(todo.dirtyAttributes).toHaveLength(0)
      todo.options.variety = 'Skim'
      expect(todo.dirtyAttributes).toHaveLength(1)
      expect(todo.dirtyAttributes[0]).toEqual('options.variety')
    })

    it('tracks removed to relationships', async () => {
      const todo = store.add('organizations', { id: 11, title: 'Buy Milk' })
      const note = store.add('notes', {
        id: 11,
        description: 'Example description'
      })

      todo.notes.add(note)
      todo.setPreviousSnapshot()
      expect(todo.dirtyAttributes).toEqual([])
      todo.notes.remove(note)
      expect(todo.dirtyAttributes).toEqual(['relationships.notes'])
    })

    it('tracks added relationship', async () => {
      const todo = store.add('organizations', { id: 11, title: 'Buy Milk' })
      const note = store.add('notes', {
        id: 11,
        description: 'Example description'
      })

      expect(todo.dirtyAttributes).toEqual([])
      todo.notes.add(note)
      expect(todo.dirtyAttributes).toEqual(['relationships.notes'])
    })

    it('does NOT revert to empty after adding and then removing a relationship', async () => {
      const todo = store.add('organizations', { id: 11, title: 'Buy Milk' })
      const note = store.add('notes', {
        id: 11,
        description: 'Example description'
      })

      expect(todo.dirtyAttributes).toEqual([])
      todo.notes.add(note)
      expect(todo.dirtyAttributes).toEqual(['relationships.notes'])
      todo.notes.remove(note)
      expect(todo.dirtyAttributes).toEqual(['relationships.notes'])
    })

    it('does NOT track changes to the related objects themselves', async () => {
      const todo = store.add('organizations', { id: 11, title: 'Buy Milk' })
      const note = store.add('notes', {
        id: 11,
        description: 'Example description'
      })

      todo.notes.add(note)
      todo.setPreviousSnapshot()
      note.description = 'something different'
      expect(todo.dirtyAttributes).toEqual([])
    })
  })

  describe('.jsonapi', () => {
    it('returns data in valid jsonapi structure with coerced values', async () => {
      const todo = store.add('organizations', { id: 1, title: 'Buy Milk' })
      expect(todo.jsonapi()).toEqual({
        data: {
          id: '1',
          type: 'organizations',
          attributes: {
            due_at: moment(timestamp).toISOString(),
            tags: [],
            title: 'Buy Milk',
            options: {}
          }
        }
      })
    })

    it('relatedToMany models can be added', () => {
      const note = store.add('notes', {
        id: 11,
        description: 'Example description'
      })

      const todo = store.add('organizations', { id: 11, title: 'Buy Milk' })

      todo.notes.add(note)

      expect(todo.jsonapi({ relationships: ['notes'] })).toEqual({
        data: {
          id: '11',
          type: 'organizations',
          attributes: {
            due_at: moment(timestamp).toISOString(),
            tags: [],
            title: 'Buy Milk',
            options: {}
          },
          relationships: {
            notes: {
              data: [{ id: '11', type: 'notes' }]
            }
          }
        }
      })
    })
  })

  describe('.isDirty', () => {
    it('is initially false', async () => {
      const todo = new Organization({ title: 'Buy Milk' })
      expect(todo.isDirty).toBe(false)
    })

    it('is set to true if record changes', async () => {
      const todo = new Organization({ title: 'Buy Milk' })
      todo.title = 'Do the laundry'
      expect(todo.isDirty).toBe(true)
    })

    it('is set back to false if changed back to original value', async () => {
      const todo = new Organization({ title: 'Buy Milk' })
      todo.title = 'Do the laundry'
      expect(todo.isDirty).toBe(true)
      todo.title = 'Buy Milk'
      expect(todo.isDirty).toBe(false)
    })

    it('is set to true if a relationship is added', async () => {
      const todo = store.add('organizations', { id: 11, title: 'Buy Milk' })
      const note = store.add('notes', {
        id: 11,
        description: 'Example description'
      })

      expect(todo.isDirty).toBe(false)
      todo.notes.add(note)
      expect(todo.isDirty).toBe(true)
    })
  })

  describe('.validate', () => {
    it('validates correct data formats', () => {
      const todo = new Organization()
      expect(todo.validate()).toBeTruthy()
      expect(Object.keys(todo.errors)).toHaveLength(0)
    })

    it('uses default validation to check for presence', () => {
      const todo = new Organization({ title: '' })
      expect(todo.validate()).toBeFalsy()
      expect(todo.errors.title[0].key).toEqual('blank')
      expect(todo.errors.title[0].message).toEqual('can\'t be blank')
    })

    it('uses custom validation', () => {
      const todo = new Organization({ tags: 'not an array' })
      expect(todo.validate()).toBeFalsy()
      expect(todo.errors.tags[0].key).toEqual('must_be_an_array')
      expect(todo.errors.tags[0].message).toEqual('must be an array')
    })

    it('uses introspective custom validation', () => {
      const todo = new Organization({ options: { foo: 'bar', baz: null } })

      todo.requiredOptions = ['foo', 'baz']

      expect(todo.validate()).toBeFalsy()
      expect(todo.errors.options[0].key).toEqual('blank')
      expect(todo.errors.options[0].data.optionKey).toEqual('baz')
    })
  })

  describe('.rollback', () => {
    it('rollback restores data to last persisted state ', async () => {
      const todo = new Organization({ title: 'Buy Milk' })
      expect(todo.previousSnapshot.attributes.title).toEqual('Buy Milk')
      todo.title = 'Do Laundry'
      expect(todo.title).toEqual('Do Laundry')
      todo.rollback()
      expect(todo.title).toEqual('Buy Milk')
      expect(todo.previousSnapshot.attributes.title).toEqual('Buy Milk')
    })

    it('rollbacks to state after save', async () => {
      // expect.assertions(9)
      // Add record to store
      const savedTitle = mockTodoData.data.attributes.title
      const todo = store.add('organizations', { title: savedTitle })
      // Mock the API response
      fetch.mockResponse(mockTodoResponse)
      // Trigger the save function and subsequent request
      await todo.save()
      expect(todo.title).toEqual(savedTitle)
      todo.title = 'Unsaved title'
      expect(todo.title).toEqual('Unsaved title')
      todo.rollback()
      expect(todo.title).toEqual(savedTitle)
    })
  })

  describe('.save', () => {
    xit('handles in flight behavior', (done) => {
      // expect.assertions(3)
      // Mock slow server response
      fetch.mockResponseOnce(() => {
        return new Promise(resolve => {
          return setTimeout(() => resolve({
            body: mockTodoResponse
          }), 1000)
        })
      })

      const todo = store.add('organizations', { title: 'Buy Milk' })
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
      // expect.assertions(9)
      // Add record to store
      const todo = store.add('organizations', { title: 'Buy Milk' })
      // Check the model doesn't have attributes
      // only provided by an API request
      expect(todo).not.toHaveProperty('created_at')
      // Check that the model has a tmp id
      expect(todo.id).toMatch('tmp')
      // Check the the tmp id has the correct length
      expect(todo.id).toHaveLength(40)
      // Mock the API response
      fetch.mockResponse(mockTodoResponse)
      // Trigger the save function and subsequent request
      await todo.save()
      // Assert the request was made with the correct
      // url and fetch options
      expect(fetch.mock.calls).toHaveLength(1)
      expect(fetch.mock.calls[0][0]).toEqual('/example_api/organizations')
      expect(fetch.mock.calls[0][1].method).toEqual('POST')
      expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual({
        data: {
          type: 'organizations',
          attributes: {
            due_at: moment(timestamp).toDate().toISOString(),
            tags: [],
            title: 'Buy Milk',
            options: {}
          }
        }
      })
      // Check that the id is now what was provider
      // from the server
      expect(todo.id).toEqual(1)
      // Check that the `created_at` attribute is populated
      expect(todo.created_at)
        .toEqual(timestamp.format('YYYY-MM-DD'))
    })
  })

  describe('.delete', () => {
    it('makes request and removes model from the store store', async () => {
      fetch.mockResponses([JSON.stringify({}), { status: 204 }])
      const todo = store.add('organizations', { id: 1, title: 'Buy Milk' })
      expect(store.findAll('organizations', { fromServer: false }))
        .toHaveLength(1)
      await todo.destroy()
      expect(fetch.mock.calls).toHaveLength(1)
      expect(fetch.mock.calls[0][0]).toEqual('/example_api/organizations/1')
      expect(fetch.mock.calls[0][1].method).toEqual('DELETE')
      expect(store.findAll('organizations', { fromServer: false }))
        .toHaveLength(0)
    })
  })
})
