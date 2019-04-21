import { isObservable } from 'mobx'
import { Model, attribute } from '../main.js'
import moment from 'moment'

const dueAt = moment()

class Todo extends Model {
  static type = 'todos'
  static endpoint = 'todos'

  @attribute(String) static title = 'NEW TODO'
  @attribute(Date) static due_at = dueAt
}

describe('Model', () => {
  describe('initialization', () => {
    it('attributes can have default values', () => {
      const todo = new Todo()
      expect(todo.title).toEqual('NEW TODO')
      expect(todo.due_at).toEqual(dueAt)
    })

    it('attributes are observable', () => {
      const todo = new Todo()
      expect(isObservable(todo)).toBe(true)
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
  })

  describe('.snapshot', () => {
    it('sets snapshot on initialization', async () => {
      const todo = new Todo({ title: 'Buy Milk' })
      expect(todo.snapshot).toEqual({
        title: 'Buy Milk',
        due_at: dueAt
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
            due_at: Date(dueAt)
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
})
