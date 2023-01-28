import {
  Model,
  Store
} from '../src/main'
/* global fetch */
import { autorun, isObservable, runInAction } from 'mobx'
import {
  exampleRelatedToManyIncludedResponse,
  exampleRelatedToManyIncludedWithNoiseResponse,
  exampleRelatedToManyResponse,
  exampleRelatedToManyWithNoiseResponse,
  exampleRelatedToOneNoRelatedRecords
} from './fixtures/exampleRelationalResponses'
import { arrayType, dateType, objectType, stringType, validatesArray, validatesArrayPresence, validatesOptions, validatesPresence, validatesString } from '../src/utils'

const timestamp = new Date(Date.now())

class Note extends Model {
  static type = 'notes'
  static endpoint = 'notes'

  static attributeDefinitions = {
      description: {
        transformer: stringType,
        defaultValue: ''
      }
  }

  static relationshipDefinitions = {
    organization: {
      direction: 'toOne',
      validator: validatesPresence
    },
    todo: {
      direction: 'toOne',
      inverse: {
        name: 'notes',
        direction: 'toMany'
      }
    }
  }
}

class Relationshipless extends Model {
  static type = 'relationshipless'
  static endpoint = 'relationshipless'

  static attributeDefinitions = {
    name: {
      transformer: stringType,
      defaultValue: 'name'
    }
  }
}

class User extends Model {
  static type = 'users'
  static endpoint = 'users'

  static attributeDefinitions = {
    name: {
      transformer: stringType,
      validator: validatesString,
      defaultValue: 'name'
    }
  }

  static relationshipDefinitions = {
    todos: {
      direction: 'toMany',
      inverse: {
        direction: 'toMany',
        name: 'users'
      }
    }
  }
}

class Organization extends Model {
  static type = 'organizations'
  static endpoint = 'organizations'

  static attributeDefinitions = {
    name: {
      transformer: stringType,
      validator: validatesString,
      defaultValue: 'NEWCO'
    }
  }

  static relationshipDefinitions = {
    categories: {
      direction: 'toMany',
      inverse: {
        name: 'organization',
        direction: 'toOne'
      }
    },
    note: {
      direction: 'toOne',
      inverse: {
        name: 'organization',
        direction: 'toOne'
      }
    }
  }
}

class Todo extends Model {
  static type = 'todos'
  static endpoint = 'todos'

  static attributeDefinitions = {
    title: {
      transformer: stringType,
      validator: validatesString,
      defaultValue: 'NEW TODO'
    },
    due_at: {
      transformer: dateType,
      defaultValue: timestamp
    },
    tags: {
      transformer: arrayType,
      validator: validatesArray,
      defaultValue: []
    },
    options: {
      transformer: objectType,
      validator: validatesOptions,
      defaultValue: {}
    }
  }

  static relationshipDefinitions = {
    notes: {
      direction: 'toMany',
      validator: validatesArrayPresence,
      inverse: {
        name: 'todo',
        direction: 'toOne'
      }
    },
    awesome_notes: {
      direction: 'toMany'
    },
    categories: {
      direction: 'toMany'
    },
    user: {
      direction: 'toOne'
    },
    users: {
      direction: 'toMany',
      inverse: {
        name: 'todos',
        direction: 'toMany'
      }
    }
  }
}

class Category extends Model {
  static type = 'categories'
  static endpoint = 'categories'

  static attributeDefinitions = {
    name: {
      transformer: stringType,
      validator: validatesString,
      defaultValue: 'name'
    }
  }

  static relationshipDefinitions = {
    targets: {
      direction: 'toMany'
    },
    organization: {
      direction: 'toOne',
      inverse: {
        name: 'categories',
        direction: 'toMany'
      }
    }
  }
}

class AppStore extends Store {
  static models = [
    Organization,
    Note,
    User,
    Todo,
    Relationshipless,
    Category
  ]
}

const mockBaseUrl = '/example_api'

const mockFetchOptions = {
  headers: {
    'Content-Type': 'application/vnd.api+json',
    'Accepts': 'application/json'
  }
}

describe('Model', () => {
  let store
  let mockTodoResponse
  let mockNoteWithErrorResponse
  let mockTodoData

  beforeEach(() => {
    store = new AppStore({
      baseUrl: mockBaseUrl,
      defaultFetchOptions: mockFetchOptions
    })

    mockTodoData = {
      data: {
        id: '1',
        type: 'todos',
        attributes: {
          title: 'Do taxes',
          // YYYY-MM-DD
          created_at: timestamp.toISOString().split('T')[0]
        }
      }
    }

    mockTodoResponse = JSON.stringify(mockTodoData)

    const mockNoteDataWithErrors = {
      errors: {
        description: ["can't be blank"]
      }
    }

    mockNoteWithErrorResponse = JSON.stringify(mockNoteDataWithErrors)

    fetch.resetMocks()
  })

  describe('initialization', () => {
    it('attributes default to specified type', () => {
      const todo = new Todo()
      expect(todo.tags).toBeInstanceOf(Array)
      const note = new Note()
      expect(note.description).toEqual('')
    })

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

      runInAction(() => {
        todo.title = 'two'
      })

      runInAction(() => {
        todo.title = 'three'
      })
    })

    it('attributes are overridable in constructor', () => {
      const todo = new Todo({ title: 'Buy Milk' })
      expect(todo.title).toEqual('Buy Milk')
    })

    it('attributes can be set', () => {
      const todo = new Todo()
      todo.title = 'Do laundry'
      expect(todo.title).toEqual('Do laundry')
      todo.tags.push('chore')
      expect(todo.tags).toHaveLength(1)
      expect(todo.tags[0]).toEqual('chore')
    })

    it('attributes are observable', (done) => {
      expect.assertions(3)

      const todo = new Todo({ options: {} })

      let runs = 0
      const expected = [undefined, 'one', 'two']
      autorun(() => {
        expect(todo.options.test).toEqual(expected[runs])
        runs++
        if (runs === 2) {
          done()
        }
      })

      runInAction(() => {
        todo.options.test = 'one'
      })

      runInAction(() => {
        todo.options.test = 'two'
      })
    })

    it('attributes are observable', () => {
      const todo = store.add('todos', { id: 1, title: 'Buy Milk', options: { test: 'one' } })

      expect(todo.options.test).toEqual('one')
    })
  })

  describe('isNew', () => {
    it('is true if id does not exist', () => {
      const todo = new Organization({ title: 'Buy Milk' })
      expect(todo.id).toBeUndefined()
      expect(todo.isNew).toBe(true)
    })

    it('is false if id does not contain "tmp"', () => {
      const todo = new Organization({ id: 7, title: 'Buy Milk' })
      expect(todo.isNew).toBe(false)
    })

    it('is false when added to store with an id', () => {
      const note = store.add('notes', { id: 10, description: 'heyo' })
      expect(note.isNew).toBe(false)
    })

    it('is true when added to store without an id', () => {
      const note = store.add('notes', { description: 'heyo' })
      expect(note.isNew).toBe(true)
    })

    it('is true when added to store with an id which includes "tmp"', () => {
      const note = store.add('notes', { id: 'tmp-0', description: 'heyo' })
      expect(note.isNew).toBe(true)
    })
  })

  describe('relationships', () => {
    describe('toMany', () => {
      it('builds relationship with included data', async () => {
        fetch.mockResponse(exampleRelatedToManyIncludedResponse)
        const todo = await store.findOne('organizations', 1)

        expect(todo.title).toEqual('Do laundry')
        expect(todo.notes).toHaveLength(1)
        expect(todo.notes[0].description).toEqual('Use fabric softener')
      })

      it('builds relationship without included data', async () => {
        fetch.mockResponse(exampleRelatedToOneNoRelatedRecords)
        const todo = await store.findOne('todos', 1)

        expect(todo.title).toEqual('Do laundry')
        expect(todo.awesome_notes).toHaveLength(0)
        expect(todo.awesome_notes).toBeInstanceOf(Array)
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

      it('can replace relationships', () => {
        const [note, note2, note3] = store.add('notes', [{
          id: 10,
          description: 'Quickly'
        }, {
          id: 20,
          description: 'Cheaply'
        }, {
          id: 30,
          description: 'Thoroughly'
        }])

        const todo = store.add('todos', { id: 10, title: 'Buy Milk' })

        todo.notes.replace([note])

        expect(todo.notes).toContain(note)
        expect(todo.notes).toContain(note)

        todo.notes.replace([note2, note3])

        expect(todo.notes).toHaveLength(2)
        expect(todo.notes).toContain(note2)
        expect(todo.notes).toContain(note3)

        todo.notes.replace([note])
        expect(todo.notes).toHaveLength(1)
        expect(todo.notes).toContain(note)

        todo.notes.replace([note, note2])
        expect(todo.notes).toHaveLength(2)
        expect(todo.notes).toContain(note)
        expect(todo.notes).toContain(note2)

        todo.notes.replace([note])
        expect(todo.notes).toHaveLength(1)
        expect(todo.notes).toContain(note)
      })

      it('can replace using =', () => {
        const note = store.add('notes', {
          id: 10,
          description: 'Quickly'
        })

        const todo = store.add('todos', { id: 10, title: 'Buy Milk' })
        todo.notes = [note]

        expect(todo.notes).toHaveLength(1)
        expect(todo.notes).toContain(note)

        todo.notes = []
        todo.notes = []
        expect(todo.notes).toHaveLength(0)
      })

      it('doesn\'t blow up on empty iteration', () => {
        const todo = store.add('todos', { id: 10, title: 'Buy Milk' })
        expect(todo.notes).toHaveLength(0)
        expect(todo.notes.map(note => note)).toHaveLength(0)
      })

      it('doesn\'t blow up after adding to empty array', () => {
        const todo = store.add('todos', { id: 10, title: 'Buy Milk' })
        expect(todo.notes).toHaveLength(0)
        expect(todo.notes.map(note => note)).toHaveLength(0)

        const note = store.add('notes', {
          id: 10,
          description: 'Example description'
        })

        todo.notes.add(note)

        expect(todo.notes.map(note => note)).toHaveLength(1)
      })

      it('models can be removed', () => {
        const note1 = store.add('notes', {
          description: 'Example description'
        })
        const note2 = store.add('notes', {
          description: 'Another note'
        })
        const todo = store.add('todos', {
          title: 'Buy Milk',
          notes: [
            {
              id: '1001',
              type: 'notes'
            },
            note1,
            note2
          ]
        })

        todo.notes.remove(note1)
        expect(todo.notes).not.toContain(note1)
        expect(todo.notes).toContain(note2)
      })

      it('models remove reference to record', () => {
        const note1 = store.add('notes', {
          description: 'Example description'
        })
        const note2 = store.add('notes', {
          description: 'Another note'
        })
        const todo = store.add('todos', { title: 'Buy Milk' })

        todo.notes.add(note1)
        todo.notes.add(note2)
        todo.notes.remove(note1)

        expect(todo.notes).not.toContain(note1)
        expect(todo.notes).toContain(note2)
      })

      describe('manyToOne', () => {
        it('models adds inverse relationships', () => {
          const note = store.add('notes', {
            id: 10,
            description: 'Example description'
          })
          const todo = store.add('todos', { id: 10, title: 'Buy Milk' })
          const todo2 = store.add('todos', { id: 11, title: 'Buy Milk' })

          todo.notes.add(note)

          expect(todo.notes).toContain(note)
          expect(note.todo).toEqual(todo)

          todo2.notes.add(note)
          expect(todo2.notes).toContain(note)
          expect(todo.notes).not.toContain(note)
        })

        it('models remove inverse relationships', () => {
          const note = store.add('notes', {
            id: 10,
            description: 'Example description'
          })
          const todo = store.add('todos', { id: 10, title: 'Buy Milk' })

          todo.notes.add(note)

          expect(note.todo).toEqual(todo)

          todo.notes.remove(note)

          expect(note.todo).toBeFalsy()
        })

        it('inverse relationships are used when the base model did not load the relationship', () => {
          // For this test, we need to create seed data using JSON in order to simulate the results of API calls
          // where Notes are loaded separately, and Organizations don't include notes directly.
          store.createOrUpdateModelFromData({
            type: 'notes',
            id: 10,
            attributes: { description: 'Note 1 for Todo 1' },
            relationships: { todo: { data: { type: 'todos', id: 1 } } }
          })

          store.createOrUpdateModelFromData({
            type: 'notes',
            id: 11,
            attributes: { description: 'Note 2 for Todo 1' },
            relationships: { todo: { data: { type: 'todos', id: 1 } } }
          })

          store.createOrUpdateModelFromData({
            type: 'notes',
            id: 12,
            attributes: { description: 'Note 1 for Todo 2' },
            relationships: { todo: { data: { type: 'todos', id: 2 } } }
          })

          store.createOrUpdateModelFromData({
            type: 'notes',
            id: 13,
            attributes: { description: 'Orphaned note' },
            relationships: { }
          })

          const todo1 = store.createOrUpdateModelFromData({
            type: 'todos',
            id: 1,
            attributes: { description: 'Todo 1' },
            relationships: { notes: { included: false } }
          })

          const todo2 = store.createOrUpdateModelFromData({
            type: 'todos',
            id: 2,
            attributes: { description: 'Todo 2' },
            relationships: { notes: { included: false } }
          })

          expect(todo1.notes.map(n => n.attributes.description)).toEqual(['Note 1 for Todo 1', 'Note 2 for Todo 1'])
          expect(todo2.notes.map(n => n.attributes.description)).toEqual(['Note 1 for Todo 2'])
        })

        it('relationship data is cached when falling back to inverse relationships', () => {
          // For this test, we need to create seed data using JSON in order to simulate the results of API calls
          // where Notes are loaded separately, and Organizations don't include notes directly.
          store.createOrUpdateModelFromData({
            type: 'notes',
            id: 10,
            attributes: { description: 'Note 1 for Todo 100' },
            relationships: { todo: { data: { type: 'todos', id: 100 } } }
          })

          store.createOrUpdateModelFromData({
            type: 'notes',
            id: 11,
            attributes: { description: 'Note 2 for Todo 100' },
            relationships: { todo: { data: { type: 'todos', id: 100 } } }
          })

          const todo1 = store.createOrUpdateModelFromData({
            type: 'todos',
            id: 100,
            attributes: { description: 'Todo 100' },
            relationships: { notes: { included: false } }
          })

          expect(todo1.notes.map(n => n.attributes.description)).toEqual(['Note 1 for Todo 100', 'Note 2 for Todo 100'])

          store.createOrUpdateModelFromData({
            type: 'notes',
            id: 11,
            attributes: { description: 'Note 2 for Todo 101' },
            relationships: { organization: { data: { type: 'todos', id: 101 } } }
          })

          expect(todo1.notes.map(n => n.attributes.description)).toEqual(['Note 1 for Todo 100', 'Note 2 for Todo 101'])
        })

        it('relationship arrays provide regular arrays for derived objects', () => {
          const note = store.add('notes', {
            id: 10,
            description: 'Example description'
          })
          const todo = store.add('todos', { id: 10, title: 'Buy Milk' })

          todo.notes.add(note)

          expect(todo.notes.constructor.name).toEqual('RelatedRecordsArray')
          expect(todo.notes.map((x) => x.id).constructor.name).toEqual('Array')
          expect(todo.notes.map((x) => x.id)).toEqual(['10'])
        })
      })
      describe('manyToMany', () => {
        let user
        let todo

        beforeEach(() => {
          user = store.add('users', { id: '1', name: 'Jon' })
          todo = store.add('todos', { id: '1', title: 'Buy Milk' })
        })

        it('adds inverse relationships', () => {
          user.todos.add(todo)

          expect(todo.users).toContain(user)
        })

        it('remove inverse relationships', () => {
          user.todos.add(todo)

          expect(todo.users).toContain(user)

          user.todos.remove(todo)

          expect(todo.users).not.toContain(user)
        })
      })
    })
    describe('toOne', () => {
      let category
      let organization
      let organization2
      let note
      let todo
      let todo2

      beforeEach(() => {
        category = store.add('categories', {})
        organization = store.add('organizations', { id: '1' })
        organization2 = store.add('organizations', { id: '2' })
        note = store.add('notes', { id: '1', description: 'Example description' })
        todo = store.add('todos', { id: '1', title: 'Buy Milk' })
        todo2 = store.add('todos', { id: '21', title: 'Do laundry' })
      })
      it('sets a relationship object', () => {
        expect(category.organization).toBeUndefined()
        category.organization = organization
        expect(category.organization).toEqual(organization)
        category.organization = null
        expect(category.organization).toBeUndefined()
        category.organization = organization
        expect(category.organization).toEqual(organization)
      })

      it('sets a relationship object via relationships hash', () => {
        expect(category.organization).toBeUndefined()
        category.relationships.organization = { data: { id: organization.id, type: 'organizations' } }
        category.relationships.organization = { data: { id: organization2.id, type: 'organizations' } }
        expect(category.organization).toEqual(organization2)
        category.relationships.organization = null
        expect(category.organization).toBeUndefined()
        category.relationships.organization = { data: { id: organization.id, type: 'organizations' } }
        expect(category.organization).toEqual(organization)
      })

      it('keeps a relationship after saving', async () => {
        expect(category.organization).toBeUndefined()
        category.relationships.organization = { data: { id: organization.id, type: 'organizations' } }

        mockTodoResponse = JSON.stringify({ data: category.jsonapi({ relationships: ['organization'] }) })
        fetch.mockResponseOnce(mockTodoResponse)
        await category.save({ relationships: ['organization'] })

        expect(category.organization).toEqual(organization)
      })

      it('relationship can be set', () => {
        note.todo = todo
        expect(note.todo).toEqual(todo)
      })

      it('relationship can be unset', () => {
        note.todo = todo
        expect(note.todo).toEqual(todo)

        note.todo = null
        expect(note.todo).toBeFalsy()
      })

      describe('oneToMany', () => {
        it('adds to inverse', () => {
          note.todo = todo
          expect(todo.notes).toContain(note)

          note.todo = todo2
          expect(todo2.notes).toContain(note)
          expect(todo.notes).not.toContain(note)
        })

        it('removes from inverse', () => {
          note.todo = todo

          note.todo = null
          expect(note.todo).toBeFalsy()
        })
      })

      describe('oneToOne', () => {
        it('sets inverse', () => {
          organization.note = note
          expect(note.organization).toEqual(organization)
        })

        it('unsets inverse', () => {
          organization.note = note
          expect(note.organization).toEqual(organization)

          organization.note = null
          expect(note.organization).toBeFalsy()
        })
      })

      it('builds relationship with existing models', async () => {
        fetch.mockResponse(exampleRelatedToManyResponse)
        const todo = await store.findOne('todos', '2')

        expect(todo.title).toEqual('Do laundry')
        expect(todo.notes).toHaveLength(1)
        expect(todo.notes[0].description).toEqual('Example description')
      })
    })
  })

  describe('.snapshot', () => {
    it('a snapshot of the current attributes and relationship', async () => {
      const todo = new Todo({ title: 'Buy Milk' })
      expect(todo.snapshot.attributes).toEqual({
        due_at: timestamp,
        tags: [],
        title: 'Buy Milk',
        options: {}
      })
    })

    it('doesn\'t exclude falsey values', async () => {
      const todo = new Todo({ title: '' })
      expect(todo.snapshot.attributes).toEqual({
        due_at: timestamp,
        tags: [],
        title: '',
        options: {}
      })
    })

    it("doesn't snapshot when paused", () => {
      const todo = new Todo({ title: 'Buy Milk' })
      expect(todo._snapshots).toHaveLength(1)
      todo.store.pauseSnapshots = true
      todo.takeSnapshot()
      expect(todo._snapshots).toHaveLength(1)
      todo.store.pauseSnapshots = false
      todo.takeSnapshot()
      expect(todo._snapshots).toHaveLength(2)
    })
  })

  describe('.previousSnapshot', () => {
    it('return the previous snapshot', async () => {
      const todo = new Todo({ title: 'Buy Milk' })
      todo.title = 'something different'
      expect(todo.previousSnapshot.attributes).toEqual({
        due_at: timestamp,
        tags: [],
        title: 'Buy Milk',
        options: {}
      })
    })
  })

  describe('.hasUnpersistedChanges', () => {
    it('is true on initialization', async () => {
      const todo = new Todo({ title: 'Buy Milk' })
      expect(todo.hasUnpersistedChanges).toBe(true)
    })

    it('is false on initialization if an id is present', async () => {
      const todo = new Todo({ id: 10, title: 'Buy Milk' })
      expect(todo.hasUnpersistedChanges).toBe(false)
    })

    it('is true on initialization if the id is a tmp id', async () => {
      const todo = new Todo({ id: 'tmp-123', title: 'Buy Milk' })
      expect(todo.hasUnpersistedChanges).toBe(true)
    })

    it('is true after attribute mutation', async () => {
      const todo = new Todo({ id: 1, title: 'Buy Milk' })
      expect(todo.hasUnpersistedChanges).toBe(false)
      todo.title = 'Buy something else'
      expect(todo.hasUnpersistedChanges).toBe(true)
    })

    it('is false after nested attribute mutation', async () => {
      const todo = new Todo({ id: 1, title: 'Buy Milk', options: { color: 'red' } })
      expect(todo.hasUnpersistedChanges).toBe(false)
      todo.options.color = 'blue'
      expect(todo.hasUnpersistedChanges).toBe(true)
    })
  })

  describe('.dirtyAttributes', () => {
    it('returns an empty array on a new model', () => {
      const todo = store.add('todos', { title: 'Buy Milk' })
      expect(todo.isNew).toBeTruthy()
      expect(todo.dirtyAttributes).toEqual([])
    })

    it('returns a list of paths for attributes that have been mutated since the last snapshot', async () => {
      const todo = new Todo({ title: 'Buy Milk' })
      expect(todo.dirtyAttributes).toHaveLength(0)
      todo.title = 'Buy Cheese'
      expect(todo.dirtyAttributes).toHaveLength(1)
      expect(todo.dirtyAttributes[0]).toEqual('title')
    })

    it('works on nested attributes', async () => {
      const todo = new Todo({ title: 'Buy Milk', options: { variety: '2%' } })
      expect(todo.dirtyAttributes).toHaveLength(0)
      todo.options.variety = 'Skim'
      expect(todo.dirtyAttributes).toHaveLength(1)
      expect(todo.dirtyAttributes[0]).toEqual('options.variety')
    })

    it('tracks sibling changes on nested attributes', async () => {
      const todo = new Todo({ id: 1, title: 'Buy Milk', options: { size: 'Quart', variety: '2%' } })
      expect(todo.dirtyAttributes).toHaveLength(0)
      todo.options.variety = 'Skim'
      expect(todo.dirtyAttributes).toHaveLength(1)
      expect(todo.dirtyAttributes[0]).toEqual('options.variety')
      todo.options.size = 'Gallon'
      expect(todo.dirtyAttributes).toHaveLength(2)
      expect(todo.dirtyAttributes.includes('options.variety')).toBe(true)
      expect(todo.dirtyAttributes.includes('options.size')).toBe(true)
      todo.options.variety = '2%'
      expect(todo.dirtyAttributes).toHaveLength(1)
      expect(todo.dirtyAttributes[0]).toEqual('options.size')
    })

    it('dirties attributes that didnt exist in the previous snapshot', () => {
      const todo = store.add('todos', { title: 'Buy Milk' })
      expect(todo.dirtyAttributes).toHaveLength(0)
      expect(todo.previousSnapshot.attributes.options).toEqual({})
      todo.options.variety = 'Coconut'
      expect(todo.dirtyAttributes).toHaveLength(1)
      expect(todo.dirtyAttributes[0]).toEqual('options.variety')
    })

    it('tracks attributes that dont exist in the current snapshot', () => {
      const todo = store.add('todos', { title: 'Buy Milk', options: { variety: 'Coconut' } })
      expect(todo.dirtyAttributes).toHaveLength(0)
      expect(todo.previousSnapshot.attributes.options).toEqual({ variety: 'Coconut' })
      todo.options = {}
      expect(todo.dirtyAttributes).toHaveLength(1)
      expect(todo.dirtyAttributes[0]).toEqual('options.variety')
    })

    it('reverts to empty after changing and then reverting an attribute', async () => {
      const todo = store.add('todos', { id: 11, title: 'Buy Milk' })

      expect(todo.dirtyAttributes).toEqual([])
      todo.title = 'Clean clothes'
      expect(todo.dirtyAttributes).toEqual(['title'])
      todo.title = 'Buy Milk'
      expect(todo.dirtyAttributes).toEqual([])
    })

    it('does NOT track attribute changes to the related models', async () => {
      const todo = store.add('todos', { id: 11, title: 'Buy Milk' })
      const note = store.add('notes', {
        id: 11,
        description: 'Example description'
      })

      todo.notes.add(note)
      note.description = 'something different'
      expect(todo.dirtyAttributes).toEqual([])
      expect(note.dirtyAttributes).toEqual(['description'])
    })
  })

  describe('.dirtyRelationships', () => {
    it('returns an empty array if no relationships are defined', () => {
      const relationshipless = store.add('relationshipless', { id: 1 })
      expect(relationshipless.relationships).toEqual({})
      expect(relationshipless.dirtyRelationships).toEqual(new Set())
    })

    it('returns an empty array if the model is new', () => {
      const todo = store.add('todos', { title: 'Buy Milk' })
      expect(todo.isNew).toBeTruthy()
      expect(todo.dirtyRelationships).toEqual(new Set())
    })

    it('tracks removed toMany relationships', async () => {
      const todo = store.add('todos', { title: 'Buy Milk' })
      const note = store.add('notes', {
        id: 11,
        description: 'Example description'
      })

      todo.notes.add(note)
      todo.clearSnapshots()
      todo.takeSnapshot()
      expect(todo.dirtyRelationships).toEqual(new Set())
      todo.notes.remove(note)
      expect(todo.dirtyRelationships).toContain('notes')
    })

    it('tracks removed toOne relationships', async () => {
      const todo = store.add('todos', { title: 'Buy Milk' })
      const note = store.add('notes', {
        id: 11,
        description: 'Example description'
      })

      note.todo = todo
      note.clearSnapshots()
      note.takeSnapshot()
      expect(note.dirtyRelationships).toEqual(new Set())
      note.todo = null
      expect(note.dirtyRelationships).toContain('todo')
    })

    it('tracks added toMany relationship', async () => {
      const todo = store.add('todos', { title: 'Buy Milk' })
      const note = store.add('notes', {
        id: 11,
        description: 'Example description'
      })

      expect(todo.dirtyRelationships).toEqual(new Set())
      todo.notes.add(note)
      const { dirtyRelationships } = todo
      expect(dirtyRelationships).toContain('notes')
    })

    it('tracks added toOne relationship', async () => {
      const todo = store.add('todos', { title: 'Buy Milk' })
      const note = store.add('notes', {
        id: 11,
        description: 'Example description'
      })

      expect(note.dirtyRelationships).toEqual(new Set())
      note.todo = todo
      expect(note.dirtyRelationships).toContain('todo')
    })

    it('tracks updated toOne relationship', async () => {
      const todo1 = store.add('todos', { id: 11, title: 'Buy Milk' })
      const todo2 = store.add('todos', { id: 12, title: 'Buy Milk' })

      const note = store.add('notes', {
        id: 11,
        description: 'Example description'
      })

      note.todo = todo1

      note.clearSnapshots()
      expect(note.dirtyRelationships).toEqual(new Set())
      note.takeSnapshot()

      note.todo = todo2
      expect(note.dirtyRelationships).toContain('todo')
    })

    it('handles polymorphic relationships', () => {
      const category = store.add('categories', { id: 1, name: 'Very important' })
      const todo = store.add('todos', { id: 1 })
      const organization = store.add('organizations', { id: 1 })

      category.targets.add(todo)
      category.clearSnapshots()
      category.takeSnapshot()
      expect(category.dirtyRelationships).toEqual(new Set())

      category.targets.remove(todo)
      category.targets.add(organization)
      expect(category.dirtyRelationships).toContain('targets')

      organization.categories.add(category)
      expect(organization.dirtyRelationships).toContain('categories')
    })

    it('reverts to empty after adding and then removing a relationship and vice versa', async () => {
      const todo = store.add('todos', { id: 11, title: 'Buy Milk' })
      const note = store.add('notes', {
        id: 11,
        description: 'Example description'
      })

      expect(todo.dirtyRelationships).toEqual(new Set())
      todo.notes.add(note)
      expect(todo.dirtyRelationships).toContain('notes')
      todo.notes.remove(note)
      expect(todo.dirtyRelationships).toEqual(new Set())
    })

    it('reverts to empty after removing and then adding back a relationship', async () => {
      const todo = store.add('todos', { id: 11, title: 'Buy Milk' })
      const note = store.add('notes', {
        id: 11,
        description: 'Example description'
      })

      todo.notes.add(note)
      todo.clearSnapshots()
      todo.takeSnapshot()
      expect(todo.dirtyRelationships).toEqual(new Set())
      todo.notes.remove(note)
      expect(todo.dirtyRelationships).toContain('notes')
      todo.notes.add(note)
      expect(todo.dirtyRelationships).toEqual(new Set())
    })

    it('does NOT track changes to the related objects themselves', async () => {
      const todo = store.add('todos', { id: 11, title: 'Buy Milk' })
      const note = store.add('notes', {
        id: 11,
        description: 'Example description'
      })

      todo.notes.add(note)
      todo.clearSnapshots()
      todo.takeSnapshot()
      note.description = "everything's changed"
      expect(todo.dirtyRelationships).toEqual(new Set())
    })
  })

  describe('.jsonapi', () => {
    it('returns data in valid jsonapi structure with coerced values', async () => {
      const todo = store.add('todos', { id: 1, title: 'Buy Milk' })
      expect(todo.jsonapi()).toEqual({
        id: '1',
        type: 'todos',
        attributes: {
          due_at: timestamp.toISOString(),
          tags: [],
          title: 'Buy Milk',
          options: {}
        }
      })
    })

    it('models can be added', () => {
      const note = store.add('notes', {
        id: 11,
        description: 'Example description'
      })

      const todo = store.add('todos', { id: 11, title: 'Buy Milk' })

      todo.notes.add(note)

      expect(todo.jsonapi({ relationships: ['notes'] })).toEqual({
        id: '11',
        type: 'todos',
        attributes: {
          due_at: timestamp.toISOString(),
          tags: [],
          title: 'Buy Milk',
          options: {}
        },
        relationships: {
          notes: {
            data: [{ id: '11', type: 'notes' }]
          }
        }
      })
    })
  })

  describe('.isDirty', () => {
    it('is initially false if the model is new', async () => {
      const todo = new Todo({ title: 'Buy Milk' })
      expect(todo.isDirty).toBeFalsy()
    })

    it('is initially false if the model is not new', async () => {
      const todo = new Todo({ id: 1, title: 'Buy Milk' })
      expect(todo.isDirty).toBeFalsy()
    })

    it('is set to true if record changes', async () => {
      const todo = new Todo({ title: 'Buy Milk' })
      todo.title = 'Do the laundry'
      expect(todo.isDirty).toBe(true)
    })

    it('is set back to false if changed back to original value', async () => {
      const todo = new Todo({ title: 'Buy Milk' })
      todo.title = 'Do the laundry'
      expect(todo.isDirty).toBe(true)
      todo.title = 'Buy Milk'
      expect(todo.isDirty).toBe(false)
    })

    it('is set to true if a relationship is added', async () => {
      const todo = store.add('todos', { title: 'Buy Milk' })
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
      const note = store.add('notes', {
        id: 10,
        description: 'Example description'
      })
      const todo = store.add('todos', { title: 'Good title' })
      todo.notes.add(note)

      expect(todo.validate()).toBeTruthy()
      expect(Object.keys(todo.errors)).toHaveLength(0)
    })

    it('uses default validation to check for presence of attribute', () => {
      const todo = store.add('todos', { title: '' })
      expect(todo.validate()).toBeFalsy()
      expect(todo.errors.title[0].key).toEqual('blank')
      expect(todo.errors.title[0].message).toEqual('can\'t be blank')
    })

    it('validates for a non-empty many relationship', () => {
      const todo = store.add('todos', {})
      expect(todo.validate()).toBeFalsy()
      expect(todo.errors.notes[0].key).toEqual('empty')
      expect(todo.errors.notes[0].message).toEqual('must have at least one record')
    })

    it('uses custom validation', () => {
      const todo = store.add('todos', { tags: 'not an array' })
      expect(todo.validate()).toBeFalsy()
      expect(todo.errors.tags[0].key).toEqual('must_be_an_array')
      expect(todo.errors.tags[0].message).toEqual('must be an array')
    })

    it('uses introspective custom validation', () => {
      const todo = store.add('todos', { options: { foo: 'bar', baz: null } })

      todo.requiredOptions = ['foo', 'baz']

      expect(todo.validate()).toBeFalsy()
      expect(todo.errors.options[0].key).toEqual('blank')
      expect(todo.errors.options[0].data.optionKey).toEqual('baz')
    })

    it('allows for undefined relationshipDefinitions', () => {
      const todo = store.add('relationshipless', { name: 'lonely model' })
      expect(todo.validate()).toBeTruthy()
    })
  })

  describe('.rollback', () => {
    it('rollback restores data to last snapshot state ', async () => {
      const todo = new Todo({ title: 'Buy Milk' })
      expect(todo.previousSnapshot.attributes.title).toEqual('Buy Milk')
      todo.title = 'Do Laundry'
      expect(todo.title).toEqual('Do Laundry')
      todo.rollback()
      expect(todo.title).toEqual('Buy Milk')
      expect(todo.previousSnapshot.attributes.title).toEqual('Buy Milk')
    })

    it('rollbacks to state after save', async () => {
      // Add record to store
      const note = store.add('notes', {
        id: 10,
        description: 'Example description'
      })
      const savedTitle = mockTodoData.data.attributes.title
      const todo = store.add('todos', { title: savedTitle })
      todo.notes.add(note)
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

  describe('.rollbackToPersisted', () => {
    it('rollback restores data to last persisted state ', () => {
      const todo = new Todo({ title: 'Buy Milk', id: 10 })
      expect(todo.previousSnapshot.attributes.title).toEqual('Buy Milk')
      todo.title = 'Do Laundry'
      expect(todo.title).toEqual('Do Laundry')
      todo.takeSnapshot()
      todo.title = 'Do something else'
      expect(todo.title).toEqual('Do something else')
      todo.rollbackToPersisted()
      expect(todo.title).toEqual('Buy Milk')
    })

    it('will restore the original (unpersisted) state if model was never persisted', () => {
      const todo = new Todo({ title: 'Buy Milk' })
      expect(todo.previousSnapshot.attributes.title).toEqual('Buy Milk')
      todo.title = 'Do Laundry'
      todo.takeSnapshot()
      todo.title = 'Do something else'
      todo.rollbackToPersisted()
      expect(todo.title).toEqual('Buy Milk')
    })
  })

  describe('.isSame', () => {
    let original
    beforeEach(() => {
      const note = store.add('notes', {
        id: 11,
        description: 'Example description'
      })
      original = store.add('todos', {
        id: 11,
        title: 'Buy Milk',
        options: { color: 'green' }
      })
      original.notes.add(note)
    })

    it('is false when the other obj is null', () => {
      expect(original.isSame(null)).toBe(false)
    })

    it('is false for two different objects', () => {
      expect(original.isSame(original.notes[0])).toBe(false)
    })

    it('is false for objects with the same type but different ids', () => {
      const newTodo = store.add('todos', {
        id: 12,
        title: 'Buy Milk',
        options: { color: 'green' }
      })
      expect(original.isSame(newTodo)).toBe(false)
    })

    it('ignores differences in attrs and relationships', () => {
      const { id, type } = original
      const sameIdAndType = { id, type }
      expect(original.isSame(sameIdAndType)).toBe(true)
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

      const todo = store.add('tod', { title: 'Buy Milk' })
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
      const note = store.add('notes', {
        id: 10,
        description: 'Example description'
      })
      // expect.assertions(9)
      // Add record to store
      const todo = store.add('todos', { title: 'Buy Milk' })
      todo.notes.add(note)
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
      expect(fetch.mock.calls[0][0]).toEqual('/example_api/todos')
      expect(fetch.mock.calls[0][1].method).toEqual('POST')
      expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual({
        data: {
          type: 'todos',
          attributes: {
            due_at: timestamp.toISOString(),
            tags: [],
            title: 'Buy Milk',
            options: {}
          }
        }
      })
      // Check that the id is now what was provider
      // from the server
      expect(todo.id).toEqual('1')
      // Check that the `created_at` attribute is populated
      // YYYY-MM-DD
      expect(todo.created_at)
        .toEqual(timestamp.toISOString().split('T')[0])
    })

    it('sets hasUnpersistedChanges = false when save succeeds', async () => {
      const note = store.add('notes', {
        id: 10,
        description: 'Example description'
      })
      const todo = store.add('todos', { title: 'Buy Milk' })
      todo.notes.add(note)
      fetch.mockResponse(mockTodoResponse)
      expect(todo.hasUnpersistedChanges).toBe(true)
      await todo.save()
      expect(todo.hasUnpersistedChanges).toBe(false)
    })

    it('does not set hasUnpersistedChanges after save fails', async () => {
      const note = store.add('notes', {
        description: ''
      })

      expect(note.hasUnpersistedChanges).toBe(true)
      // Mock the API response
      fetch.mockResponse(mockNoteWithErrorResponse, { status: 422 })

      // Trigger the save function and subsequent request
      try {
        await note.save()
      } catch (errors) {
        expect(note.hasUnpersistedChanges).toBe(true)
      }
    })

    it('allows undefined relationships', async () => {
      const note = store.add('notes', {
        id: 10,
        description: ''
      })
      const todo = store.add('todos', { title: 'Good title' })
      todo.notes.add(note)
      fetch.mockResponse(mockTodoResponse)
      expect(todo.hasUnpersistedChanges).toBe(true)
      await todo.save({ relationships: ['user'] })
      expect(todo.hasUnpersistedChanges).toBe(false)
    })

    it('saves when attributes are dirty', () => {
      fetch.mockResponse(mockTodoResponse)

      const note = store.add('notes', {
        id: '10',
        description: 'hello'
      })

      note.save()
      expect(fetch).not.toHaveBeenCalled()

      note.description = 'changed description'

      note.save()
      expect(fetch).toHaveBeenCalled()
    })

    it('saves with a new model', () => {
      fetch.mockResponse(mockTodoResponse)

      const note = store.add('notes', {
        description: 'hello'
      })

      note.save()
      expect(fetch).toHaveBeenCalled()
    })

    it('saves when relationships are dirty', () => {
      fetch.mockResponse(mockTodoResponse)

      const todo1 = store.add('todos', {
        id: '10',
        title: 'Buy Milk'
      })

      const todo2 = store.add('todos', {
        id: '20',
        title: 'Buy Milk'
      })

      const note = store.add('notes', {
        id: '10',
        description: 'hello',
        todo: todo1
      })

      note.save({ relationships: ['todo'] })

      expect(fetch).not.toHaveBeenCalled()

      note.todo = todo2

      note.save()

      expect(fetch).not.toHaveBeenCalled()

      note.save({ relationships: ['todo'] })

      expect(fetch).toHaveBeenCalledTimes(1)
    })
  })

  describe('.reload', () => {
    describe('with a persisted model', () => {
      it('reloads data from server', async () => {
        fetch.mockResponseOnce(mockTodoResponse)
        const todo = store.add('todos', { id: '1', title: 'do nothing' })
        const response = await todo.reload()
        expect(response.title).toEqual('Do taxes')
        expect(todo.title).toEqual('Do taxes')
      })
    })
    describe('with a new model', () => {
      beforeEach(() => fetch.resetMocks())
      it('reverts data from server', async () => {
        const todo = store.add('todos', { title: 'do nothing' })
        await todo.reload()
        expect(todo.title).toEqual('do nothing')
        todo.title = 'do something'
        await todo.reload()
        expect(todo.title).toEqual('do nothing')
        expect(fetch.mock.calls).toHaveLength(0)
      })
    })
  })

  describe('.destroy', () => {
    it('makes request and removes model from the store', async () => {
      fetch.mockResponses([JSON.stringify({}), { status: 204 }])
      const todo = store.add('todos', { id: 1, title: 'Buy Milk' })
      expect(store.getAll('todos'))
        .toHaveLength(1)
      await todo.destroy()
      expect(fetch.mock.calls).toHaveLength(1)
      expect(fetch.mock.calls[0][0]).toEqual('/example_api/todos/1')
      expect(fetch.mock.calls[0][1].method).toEqual('DELETE')
      expect(store.getAll('todos'))
        .toHaveLength(0)
    })

    describe('error handling', () => {
      it('rejects with the status', async () => {
        fetch.mockResponses([JSON.stringify({}), { status: 500 }])
        const todo = store.add('todos', { id: 1, title: 'Buy Milk' })
        try {
          await todo.destroy()
        } catch (error) {
          const jsonError = JSON.parse(error.message)[0]
          expect(jsonError.detail).toBe('Something went wrong.')
          expect(jsonError.status).toBe(500)
        }
      })

      it('uses the configured error message for the corresponding HTTP status code', async () => {
        const store2 = new AppStore({
          baseUrl: mockBaseUrl,
          defaultFetchOptions: mockFetchOptions,
          errorMessages: {
            403: "You don't have permission to access this record.",
            500: 'Oh no!',
            default: 'Sorry.'
          }
        })

        fetch.mockResponses([JSON.stringify({}), { status: 403 }])
        const todo = store2.add('todos', { id: 1, title: 'Buy Milk' })

        try {
          await todo.destroy()
        } catch (error) {
          const jsonError = JSON.parse(error.message)[0]
          expect(jsonError.detail).toBe("You don't have permission to access this record.")
          expect(jsonError.status).toBe(403)
          expect(error.name).toBe('Error')
        }
      })

      it('does not remove the record from the store', async () => {
        fetch.mockResponses([JSON.stringify({}), { status: 500 }])
        const todo = store.add('todos', { id: 1, title: 'Buy Milk' })
        try {
          await todo.destroy()
        } catch (error) {
          expect(store.getAll('todos')).toHaveLength(1)
        }
      })
    })
  })
})
