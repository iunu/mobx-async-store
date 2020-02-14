![Statements Covered!](./coverage/badge-statements.svg)
![Lines Covered!](./coverage/badge-lines.svg)
![Functions Covered!](./coverage/badge-functions.svg)

# mobx-async-store

Mobx-based store for async data fetching and state management. https://artemis-ag.github.io/mobx-async-store/

# Caution

This library is experimental and not advised for use in production use.

# TODO
- [ ] Improve documentation

## Table of Contents
- Introduction
- Development Setup
- Testing
- Distribution
- Installation
- Usage
  - Creating models by extending `Model`
  - Creating stores by extending `Store`
  - Initializing stores
  - Fetching multiple records with `Store#findAll`
  - `Store#findAll` options
  - Fetching individual records with `Store#findOne`
  - `Store#findOne` options
  - Adding records with `Store#add`
  - Persisting records with `Model#save`
  - Handling errors with `Model#errors`


## Introduction

`mobx-async-store` was designed to consume [JSON::API specification](https://jsonapi.org) compliant REST APIs and provide a state management system for conveniently manipulating client-side data and keeping it in sync with the server-side. In the future, `mobx-async-store` may add support for other APIs types like GraphQL or custom REST APIs.

The library uses `mobx` internally to provide reactivity and observability; i.e when you fetch data from the server or make changes to client-side records then the UI should update accordingly. This system has only be tested in combination with `mobx-react`, but should hypothetically work with libraries like `mobx-vue` or `mobx-angular`.

## Development setup

Clone this repository and install its dependencies:

```bash
git clone git@github.com:artemis-ag/mobx-async-store.git
cd mobx-async-store
yarn install
```

## Testing

`yarn test` builds the library, then tests it.

## Distribution
`yarn build` builds the library to `dist`, generating three files:

* `dist/mobx-async-store.cjs.js`
    A CommonJS bundle, suitable for use in Node.js, that `require`s the external dependency. This corresponds to the `"main"` field in package.json
* `dist/mobx-async-store.esm.js`
    an ES module bundle, suitable for use in other people's libraries and applications, that `import`s the external dependency. This corresponds to the `"module"` field in package.json
* `dist/mobx-async-store.umd.js`
    a UMD build, suitable for use in any environment (including the browser, as a `<script>` tag), that includes the external dependency. This corresponds to the `"browser"` field in package.json

## Installation

```
yarn add git+ssh://git@github.com:artemis-ag/mobx-async-store.git
```

## Usage

### Create models

```JavaScript
import { Model, attribute } from 'mobx-async-store'

class Todo extends Model {
  static type = 'todos'
  static endpoint = 'todos'

  @attribute(String) title = ''
  @attribute(Boolean) completed = false
  @attribute(String) category = 'uncategorized'
}

export default Todo
```

### Create stores

```JavaScript
import { Store } from 'mobx-async-store'
import Todo from './Todo'

class AppStore extends Store {
  static types = [
    Todo
  ]
}

export default AppStore
```

### Initializing stores

```JavaScript
import AppStore from './AppStore'

const store = new AppStore({
  baseUrl: 'https//api.example.com',
  defaultFetchOptions: {
    credentials: 'include',
    headers: {
      'Accepts': 'application/json',
      'Content-Type': 'application/vnd.api+json',
      'X-CSRF-Token': 'EXAMPLE-CSRF-TOKEN'
    }
  }
})

```

### Fetching multiple records with `Store#findAll`

The default behavior for `mobx-async-store` is to fetch all records matching the type provided from the server. Calling the `.findAll` method will kick off an AJAX request and return a promise with the returns data. Subsequent calls to `.findAll` with no options provided with hit a local cache instead of making anothrer request.

```JavaScript
// GET /todos
const todos = await store.findAll('todos')

// No request is made, return result in the store
await store.findAll('todos')
```

### `Store#findAll` options

The `findAll` method takes and options object as a second argument.

``` JavaScript
store.findAll(MODEL_TYPE, OPTIONS)
```

#### `fromServer` option

You can force an `mobx-async-store`-based store to fetch data from the server (and break the cache), by providing the `fromServer` option as true.

```JavaScript
await store.findAll('todos', { fromServer: true })
```

Passing `fromServer: false` will prevent requests from being made and only return data on client-side. It will also never return a promise. This is useful in computed contexts.

#### `queryParams` options

`mobx-async-store` builds queries that are `JSON::API` compliant. By default, making a request with `queryParams` will trigger an API request, even if a previous call of  `.findAll` was made without options.

##### `queryParams.filter`

To filter API results you can use the `filter` key. See the [JSON::API filter documentation](https://jsonapi.org/format/#fetching-filtering) for more information.

```JavaScript
store.findAll('todos', {
  queryParams: {
    filter: {
      completed: true,
      category: 'chores'
    }
  }
})
```

##### `queryParams.include`

If the record type you are fetching has related data you need to side-load you can provide the `include` key.
See [JSON::API includes documentation](https://jsonapi.org/format/#fetching-includes) and the relationships section blow for details.

```JavaScript
store.findAll('todos', {
  queryParams: {
    filter: {
      include: 'todos.notes'
    }
  }
})
```

##### `queryParams` miscellaneous params

If you do need to use a non JSON::API compliance param you can simply pass a key/value pair to queryParams.

```JavaScript
store.findAll('todos', { queryParams: { foo: 'bar' } })
```

#### `refresh` / `lazyLoad` / `load` options

`mobx-async-store` needs additional options for keeping the local store in sync with the server-side. These options are pending an RFC.

### Fetching single records with `Store#findOne`

You can fetch a single record from the server with the `findOne` method. The same caching behavior applies for findOne as well.

```JavaScript
// GET /todos
const todos = await store.findOne('todos', 1)

// No request is made, return result in the store
store.findOne('todos', 1)
```

### `findOne` options

The `findOne` method also supports the `fromServer` and `queryParam` options.

### Adding records with `Store#add`

Records can be added to a store via the `add` method.

```JavaScript
const todo = store.add('todos', { title: 'Buy Milk', category: 'chores' })
```

Newly created client records with have a temporary id by default.

```JavaScript
const todo = store.add('todos', {})

todo.id
// => tmp-6b46fa20-db49-11e9-8256-1be9dad543b1
```


Multiple records can be added at the same time.
```JavaScript
const todos = store.add('todos', [
  { title: 'Buy Milk', category: 'chores' },
  { title: 'Do laundry', category: 'chores' }
])
```

### Persisting records with `Model#save`

Records created on client side can be persisted via an AJAX request by calling the `save` method on the record.

```JavaScript
const todo = store.add('todos', { title: 'Buy Milk', category: 'chores' })

// POST /todos
await todo.save()
```

### Handling errors with `Model#errors`

If a `save` method call on a model fails for any reason (and your API support JSON::API errors), then the model
will populate the `Model#errors` object.

### To Be Continued...
