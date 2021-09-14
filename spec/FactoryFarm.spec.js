import {
  FactoryFarm,
  Model,
  Store,
  attribute,
  relatedToMany,
  relatedToOne,
  serverResponse
} from '../src/main'

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
  @relatedToMany todos
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
  @attribute(String) subtitle = ''
  @relatedToMany notes
  @relatedToOne category
  @relatedToMany tags
}

class AppStore extends Store {
  static types = [Note, Todo, Tag, Category]
}

describe('FactoryFarm', () => {
  describe('building a todo', () => {
    let factoryFarm
    beforeEach(() => {
      const store = new AppStore()
      factoryFarm = new FactoryFarm(store)
      factoryFarm.define('planting', {
        type: 'todos',
        title: 'Plant Seeds',
        subtitle: 'Lettuce'
      })
      factoryFarm.define('color', {
        type: 'tags',
        label: (i) => {
          const hexBase = factoryFarm.store.getAll('tags').length + i
          return `#${(hexBase + 10).toString(16)}${(hexBase + 20).toString(16)}${(hexBase + 30).toString(16)}`
        }
      })
      factoryFarm.define('note', {
        type: 'notes',
        text: "Don't forget"
      })
      factoryFarm.define('finishCategory', {
        type: 'categories',
        name: 'finish'
      })
      factoryFarm.define('startCategory', {
        type: 'categories',
        name: 'start'
      })
    })

    it('builds a defined facotry', () => {
      const todo = factoryFarm.build('planting')
      expect(todo.title).toEqual('Plant Seeds')
      expect(todo.subtitle).toEqual('Lettuce')
    })

    it('applies overrides for a defined factory', () => {
      factoryFarm.define('harvest', {
        parent: 'planting',
        title: 'Harvest'
      })
      const planting = factoryFarm.build('planting')
      const harvest = factoryFarm.build('harvest')

      expect(planting.title).toEqual('Plant Seeds')
      expect(planting.subtitle).toEqual('Lettuce')

      expect(harvest.title).toEqual('Harvest')
      expect(harvest.subtitle).toEqual('Lettuce')
    })

    it('applies relationships', () => {
      const todo = factoryFarm.build('planting', {
        category: () => factoryFarm.build('startCategory'),
        tags: () => factoryFarm.build('color', {}, 2)
      })

      expect(todo.tags).toHaveLength(2)
      expect(todo.tags[0].label).toEqual('#a141e')
      expect(todo.tags[1].label).toEqual('#b151f')
      expect(todo.category.name).toEqual('start')
    })

    it('exports a model array to jsonapi', () => {
      const todos = factoryFarm.build(
        'planting',
        {
          category: () => factoryFarm.build('startCategory'),
          tags: () => factoryFarm.build('color', {}, 2)
        },
        2
      )

      todos[0].category.todos.add(todos[0])
      todos[1].category.todos.add(todos[1])

      const batchServerResponse = serverResponse(todos)
      const servedObject = JSON.parse(batchServerResponse)

      expect(servedObject.data).toEqual([
        {
          id: '1',
          type: 'todos',
          attributes: {
            subtitle: 'Lettuce',
            title: 'Plant Seeds'
          },
          relationships: {
            categorie: {
              data: {
                id: '1',
                type: 'categories'
              }
            },
            category: {
              data: {
                id: '1',
                type: 'categories'
              }
            },
            tags: {
              data: [
                {
                  id: '1',
                  type: 'tags'
                },
                {
                  id: '2',
                  type: 'tags'
                }
              ]
            }
          }
        },
        {
          id: '2',
          type: 'todos',
          attributes: {
            subtitle: 'Lettuce',
            title: 'Plant Seeds'
          },
          relationships: {
            categorie: {
              data: {
                id: '2',
                type: 'categories'
              }
            },
            category: {
              data: {
                id: '2',
                type: 'categories'
              }
            },
            tags: {
              data: [
                {
                  id: '3',
                  type: 'tags'
                },
                {
                  id: '4',
                  type: 'tags'
                }
              ]
            }
          }
        }
      ])

      const [category1, tag1, tag2, category1a, category2, tag3] =
        servedObject.included

      expect(category1).toEqual({
        attributes: {
          name: 'start'
        },
        id: '1',
        type: 'categories',
        relationships: {
          todos: {
            data: [
              {
                id: '1',
                type: 'todos'
              }
            ]
          }
        }
      })

      // TODO: why is this added twice?
      expect(category1a).toEqual({
        attributes: {
          name: 'start'
        },
        id: '1',
        type: 'categories',
        relationships: {
          todos: {
            data: [
              {
                id: '1',
                type: 'todos'
              }
            ]
          }
        }
      })
      expect(tag1).toEqual({
        id: '1',
        type: 'tags',
        attributes: {
          label: '#a141e'
        },
        relationships: {}
      })
      expect(tag2).toEqual({
        attributes: {
          label: '#b151f'
        },
        id: '2',
        relationships: {},
        type: 'tags'
      })
      expect(category2).toEqual({
        id: '2',
        type: 'categories',
        attributes: {
          name: 'start'
        },
        relationships: {
          todos: {
            data: [
              {
                id: '2',
                type: 'todos'
              }
            ]
          }
        }
      })
      expect(tag3).toEqual({
        attributes: {
          label: '#c1620'
        },
        id: '3',
        relationships: {},
        type: 'tags'
      })
    })

    it('exports a single model to jsonapi', () => {
      const todo = factoryFarm.build('planting', {
        category: () => factoryFarm.build('startCategory'),
        tags: () => factoryFarm.build('color', {}, 2)
      })

      const todoServerResponse = serverResponse(todo)

      expect(JSON.parse(todoServerResponse)).toEqual({
        data: {
          id: '1',
          type: 'todos',
          attributes: {
            subtitle: 'Lettuce',
            title: 'Plant Seeds'
          },
          relationships: {
            category: {
              data: {
                id: '1',
                type: 'categories'
              }
            },
            tags: {
              data: [
                {
                  id: '1',
                  type: 'tags'
                },
                {
                  id: '2',
                  type: 'tags'
                }
              ]
            }
          }
        },
        included: [
          {
            id: '1',
            type: 'categories',
            attributes: {
              name: 'start'
            },
            relationships: {}
          },
          {
            attributes: {
              label: '#a141e'
            },
            id: '1',
            relationships: {},
            type: 'tags'
          },
          {
            attributes: {
              label: '#b151f'
            },
            id: '2',
            relationships: {},
            type: 'tags'
          }
        ]
      })
    })
  })

  describe('Singletons', () => {
    let factoryFarm
    beforeEach(() => {
      const store = new AppStore()
      factoryFarm = new FactoryFarm(store)
      factoryFarm.define('todo', {
        type: 'todos'
      })
    })

    it('regular factories generate new objects on each call to build', () => {
      const todo1 = factoryFarm.build('todo')
      const todo2 = factoryFarm.build('todo')
      expect(todo1.id).not.toBe(todo2.id)
    })

    it('defines a factory that results in singleton objects', () => {
      factoryFarm.define('todo_planting', {
        type: 'todos',
        identity: 'todo_planting',
        title: 'Plant Seeds'
      })

      const todo1 = factoryFarm.build('todo_planting')
      const todo2 = factoryFarm.build('todo_planting')
      const todo3 = factoryFarm.build('todo')
      expect(todo1.id).toBe(todo2.id)
      expect(todo1.id).not.toBe(todo3.id)
    })

    it('allows individual builds that use identities', () => {
      const todo1 = factoryFarm.build('todo', { identity: 'todo_planting' })
      const todo2 = factoryFarm.build('todo', { identity: 'todo_planting' })
      const todo3 = factoryFarm.build('todo')
      expect(todo1.id).toBe(todo2.id)
      expect(todo1.id).not.toBe(todo3.id)
    })

    it('allows overriding identities on factories that already have them', () => {
      factoryFarm.define('todo_planting', {
        type: 'todos',
        identity: 'todo_planting',
        title: 'Plant Seeds'
      })

      const todo1 = factoryFarm.build('todo_planting')
      const todo2 = factoryFarm.build('todo_planting', { identity: 'other_planting' })
      const todo3 = factoryFarm.build('todo_planting')
      const todo4 = factoryFarm.build('todo_planting', { identity: 'other_planting' })
      const todo5 = factoryFarm.build('todo')
      expect(todo1.id).toBe(todo3.id)
      expect(todo2.id).toBe(todo4.id)
      expect(todo1.id).not.toBe(todo2.id)
      expect(todo1.id).not.toBe(todo2.id)
      expect(todo2.id).not.toBe(todo5.id)
    })

    it('allows identities to be used thru relationships', () => {
      factoryFarm.define('category', {
        type: 'categories'
      })
      factoryFarm.define('todo', {
        type: 'todos',
        category: () => factoryFarm.build('category', { identity: 'current_category' })
      })
      factoryFarm.define('current_todo', {
        parent: 'todo',
        identity: 'current_todo'
      })

      const todo1 = factoryFarm.build('current_todo')
      const todo2 = factoryFarm.build('todo')
      const todo3 = factoryFarm.build('todo', {
        category: factoryFarm.build('category', { identity: 'other_category' })
      })
      const todo4 = factoryFarm.build('current_todo')
      const currentOrg = factoryFarm.build('category', { identity: 'current_category' })
      const otherOrg = factoryFarm.build('category', { identity: 'other_category' })

      expect(todo1.id).toBe(todo4.id)
      expect(todo1.id).not.toBe(todo2.id)
      expect(todo1.id).not.toBe(todo3.id)
      expect(todo2.id).not.toBe(todo3.id)

      expect(currentOrg.id).not.toBe(otherOrg.id)
      expect(todo1.category.id).toBe(currentOrg.id)
      expect(todo2.category.id).toBe(currentOrg.id)
      expect(todo3.category.id).toBe(otherOrg.id)
      expect(todo4.category.id).toBe(currentOrg.id)
    })
  })
})
