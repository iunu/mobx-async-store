/* eslint-disable jsdoc/require-jsdoc */
import {
  FactoryFarm,
  Model,
  Store,
  serverResponse
} from '../src/main'
import { stringType, validatesArrayPresence } from '../src/utils'

class Tag extends Model {
  static type = 'tags'
  static endpoint = 'tags'

  static attributeDefinitions = {
    label: {
      transformer: stringType,
      defaultValue: ''
    }
  }

  static relationshipDefinitions = {
    todo: {
      direction: 'toOne',
      inverse: {
        name: 'tags',
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
      defaultValue: ''
    }
  }

  static relationshipDefinitions = {
    todos: {
      direction: 'toMany'
    }
  }
}

class Note extends Model {
  static type = 'notes'
  static endpoint = 'notes'

  static attributeDefinitions = {
    text: {
      transformer: stringType,
      defaultValue: ''
    }
  }

  static relationshipDefinitions = {
    todo: {
      direction: 'toOne',
      inverse: {
        name: 'notes',
        direction: 'toMany'
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
      defaultValue: ''
    },
    subtitle: {
      transformer: stringType,
      defaultValue: ''
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
    category: {
      direction: 'toOne'
    },
    tags: {
      direction: 'toMany',
      inverse: {
        name: 'todo',
        direction: 'toOne'
      }
    }
  }
}

class AppStore extends Store {
  static models = [Note, Todo, Tag, Category]
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

    it('builds a defined factory', () => {
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
      const category = factoryFarm.build('startCategory')
      const tags = factoryFarm.build('color', {}, 2)

      const todo = factoryFarm.build('planting', {
        tags, category
      })

      expect(todo.tags).toHaveLength(2)
      expect(todo.tags[0].label).toEqual('#a141e')
      expect(todo.tags[1].label).toEqual('#b151f')
      expect(todo.category.name).toEqual('start')

      expect(todo.tags[1].todo).toEqual(todo)
      expect(todo.relationships).toEqual({
        category: {
          data: {
            id: '1',
            type: 'categories'
          }
        },
        tags: {
          data: [{
            id: '1',
            type: 'tags'
          }, {
            id: '2',
            type: 'tags'
          }]
        }
      })
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

      const [category1, tag1, tag2, category2, tag3] =
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

      expect(tag1).toEqual({
        id: '1',
        type: 'tags',
        attributes: {
          label: '#a141e'
        },
        relationships: {
          todo: {
            data: {
              id: '1',
              type: 'todos'
            }
          }
        }
      })
      expect(tag2).toEqual({
        attributes: {
          label: '#b151f'
        },
        id: '2',
        relationships: {
          todo: {
            data: {
              id: '1',
              type: 'todos'
            }
          }
        },
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
        relationships: {
          todo: {
            data: {
              id: '2',
              type: 'todos'
            }
          }
        },
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
            relationships: {
              todo: {
                data: {
                  id: '1',
                  type: 'todos'
                }
              }
            },
            type: 'tags'
          },
          {
            attributes: {
              label: '#b151f'
            },
            id: '2',
            relationships: {
              todo: {
                data: {
                  id: '1',
                  type: 'todos'
                }
              }
            },
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

  describe('Store tagging', () => {
    it('Tags the builtin store so that other test utilities can tell if a store is used for a Factory Farm', () => {
      const store = new AppStore()
      expect(store.__usedForFactoryFarm__).toBe(undefined)

      const factoryFarm = new FactoryFarm(store)
      expect(store.__usedForFactoryFarm__).toBe(true)
      expect(factoryFarm.store.__usedForFactoryFarm__).toBe(true)
    })
  })
})
