![Statements Covered!](./coverage/badge-statements.svg)
![Lines Covered!](./coverage/badge-lines.svg)
![Functions Covered!](./coverage/badge-functions.svg)

# mobx-async-store

Mobx-based store for async data fetching and state management. https://iunu.github.io/mobx-async-store/

## Table of Contents
- [Introduction](#introduction)
- [Development Setup](#development-setup)
- [Testing](#testing)
- [Distribution](#distribution)
- [Installation](#installation)
- [Usage](#usage)
  - [Creating models by extending `Model`](#create-models)
  - [Creating stores by extending `Store`](#create-stores)
  - [Initializing stores](#initializing-stores)
  - [Fetching all records with `Store#getAll`, `Store#fetchAll`, `Store#findAll`](#getting-all-records-with-storegetall)
  - [Finding records by id with `Store#getMany`, `Store#fetchMany`, `Store#findMany`](#getting-records-by-id-with-storegetmany)
  - [Find/fetch options](#findfetch-options)
  - [Finding single records with `Store#getOne`, `Store#fetchOne`, `Store#findOne`](#getting-single-records-with-storegetone)
  - [Clear the query cache](#clear-the-query-cache)
  - [Adding records with `Store#add`](#adding-records-with-storeadd)
  - [Persisting records with `Model#save`](#persisting-records-with-modelsave)
  - [Handling errors](#handling-errors)

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

### Step 1 - Build the dist files

`yarn build` builds the library to `dist`, generating three files:

- `dist/mobx-async-store.cjs.js`
  A CommonJS bundle, suitable for use in Node.js, that `require`s the external dependency. This corresponds to the `"main"` field in package.json
- `dist/mobx-async-store.esm.js`
  an ES module bundle, suitable for use in other people's libraries and applications, that `import`s the external dependency. This corresponds to the `"module"` field in package.json
- `dist/mobx-async-store.umd.js`
  a UMD build, suitable for use in any environment (including the browser, as a `<script>` tag), that includes the external dependency. This corresponds to the `"browser"` field in package.json

### Step 2 - Update the documentation

`yarn run docs` updates the documentation, located in `docs`.

### Step 3 - Publish

`npm login` to authenticate yourself as someone authorized to publish this package
`npm publish`

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
  },
  errorMessages: {
    400: 'Bad request.',
    403: 'Forbidden',
    ...
    default: 'Something went wrong.',
  }
})
```

`errorMessages`: These are optional error messages that can be configured to provide additional details
when returning errors for various requests. Each property corresponds to an HTTP status code which can be
customized, and any errors returned from the server that have a `status` matching this code will have their `detail` property overriden by this value. A `default` can also be set as a fallback.

### Getting all records with `Store#getAll`

Gets all records matching the type provided from the store. This never hits the server.

```JavaScript
// No request is made, return result from the store
store.getAll('todos')
```

### Fetching all records with `Store#fetchAll`

Fetches all records matching the given type from the server.
This will always fetch from the server and return a promise.

```JavaScript
// GET /todos
await store.fetchAll('todos')
```

### Finding all records with `Store#findAll`

Finds all records first in the store, otherwise will fetch from the server.
Subsequent calls to `.findAll` will hit a local cache instead of making another request.

```JavaScript
// GET /todos
await store.findAll('todos')

// No request is made, return result from the store
await store.findAll('todos')
```

### Getting records by id with `Store#getMany`

Gets records with the given ids and type provided from the store.
This will never fetch from the server.

```JavaScript
// No request is made, return result from the store
const ids = ['2', '3', '4']
store.getMany('todos', ids)
```

### Fetching records by id with `Store#fetchMany`

Fetches records with the given ids and type from the server.
This will always fetch from the server and return a promise.

```JavaScript
// GET /todos with ids 4, 5
const ids = ['4', '5']
await store.fetchMany('todos', ids)
```

### Finding records by id with `Store#findMany`

Finds records with the given ids and type first in the store, otherwise will fetch from the server.
Subsequent calls to `.findMany` will hit a local cache instead of making another request.

```JavaScript
// GET /todos with ids 1, 4
const ids = ['1', '4']
await store.findMany('todos', ids)

// No request is made, return result from the store
await store.findMany('todos', ids)
```

### find/fetch options

The `find` and `fetch` methods can take an options object as a second argument.

```JavaScript
await store.fetchOne(MODEL_TYPE, OPTIONS)
await store.findOne(MODEL_TYPE, OPTIONS)

await store.fetchAll(MODEL_TYPE, OPTIONS)
await store.findAll(MODEL_TYPE, OPTIONS)

await store.fetchMany(MODEL_TYPE, OPTIONS)
await store.findMany(MODEL_TYPE, OPTIONS)
```

#### `queryParams` options

`mobx-async-store` builds queries that are `JSON::API` compliant. Requests are cached from the previous call - including any `queryParams` given.

```JavaScript
store.findAll('todos', { queryParams: filter: { title: 'Do taxes', filter: { overdue: true } } })
// The query is: '/example_api/todos?filter[title]=Do taxes&filter[overdue]=true'
// This fetches from the server and stores the result of the query in the cache.

store.findAll('todos', { queryParams: filter: { title: 'Do taxes', filter: { overdue: true } } })
// Returns result from the cache.
```

##### `queryParams.filter`

To filter API results you can use the `filter` key. See the [JSON::API filter documentation](https://jsonapi.org/format/#fetching-filtering) for more information.

```JavaScript
store.findMany('todos', ['1', '2'], {
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
store.fetchAll('todos', {
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

### Getting single records with `Store#getOne`

You can get a single record from the store with the `getOne` method.
This will never fetch from the server.

```JavaScript
const todo = store.add('todos', { title: 'Buy Milk' })

// Returns record from the store, no request made.
store.getOne('todos', todo.id)

// No record returned as it never fetches from the server.
store.reset('todos')
store.getOne('todos', todo.id)
```

### Fetching single records with `Store#fetchOne`

Fetches a single record with the given id from the server.
This will always fetch from the server and return a promise that will resolve with the new record.

```JavaScript
const todo = store.add('todos', { title: 'Pay bills' })

// Request made, record is always returned from the server.
await store.fetchOne('todos', todo.id)
```

If the server responds with any status other than 200, the promise will reject with an [error](#handling-errors)

### Finding single records with `Store#findOne`

Finds a single record with the given id and type first in the store, otherwise will fetch from the server.
Subsequent calls to `.findOne` will hit a local cache instead of making another request.

```JavaScript
const todo = store.add('todos', { title: 'Buy Milk' })

// Returns record from the store, no request made.
store.findOne('todos', todo.id)

// Returns record from the server if it's not in the store.
store.reset('todos')
store.findOne('todos', todo.id)
```

### Clear the query cache

Sometimes the query cache from `findAll` can cause weird frontend bugs, to fix this use the `clearCache` method.
This will clear the query cache for the type you pass as a parameter.

```Javascript
store.clearCache('todos')
```

The next time you use `findAll` after clearing the cache, it will pull a query directly from the server and repopulate
the cache.

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

### Building without adding to the store

Records can be built without being added to the store with `Store#build`

```JavaScript
const todo = store.build('todos', { title: 'Buy Milk', category: 'chores' })
```

Newly created client records with have a temporary id by default.

```JavaScript
todo.id
// => tmp-6b46fa20-db49-11e9-8256-1be9dad543b1
```

The newly built record will be ephemeral and will not be added to the store

```JavaScript
store.findOne('todos', todo.id)
// => undefined
```

### Persisting records with `Model#save`

Records created on client side can be persisted via an AJAX request by calling the `save` method on the record.

```JavaScript
const todo = store.add('todos', { title: 'Buy Milk', category: 'chores' })

// POST /todos
await todo.save()
```

If the server responds to a `save` with a status code that is not 200 or 201, then the `Model#errors`
object will populated by matching [source pointers](https://jsonapi.org/format/#error-objects) from the
response to the attributes on the model.


### Handling errors

If any fetch, save, or destroy fails, the query will return a rejected promise with an error
containing any JSONAPI errors returned with the response. If no errors are present, then the response
status will be converted to an error and returned with the corresponding [configured error message](#initializing-stores).

For example, if the server returns a 500 response with no body for a `fetchOne`, then the error returned
will be

```JavaScript
  [
    {
      detail: "Something went wrong.",
      status: 500
    }
  ]
```

This value will always be a stringified JSON array, so you can handle errors as such:

```JavaScript
  try {
    await store.fetchMany('todos', ids);
  } catch (error) {
    const errors = JSON.parse(error.message);
    console.log(errors[0].detail); // "Something went wrong."
    console.log(errors[0].status); // 500
  }
```

### To Be Continued...
