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

`mobx-async-store` was designed to consume [JSON::API specification](https://jsonapi.org) compliant REST APIs and provide a state management system for conveniently manipulating client-side data and keeping it in sync with the server-side.

The library uses `mobx` internally to provide reactivity and observability; i.e when you fetch data from the server or make changes to client-side records then the UI should update accordingly. This system has only be tested in combination with `mobx-react`, but should hypothetically work with libraries like `mobx-vue` or `mobx-angular`.

## Development setup

Clone this repository and install its dependencies:

```bash
git clone git@github.com:iunu/mobx-async-store.git
cd mobx-async-store
yarn install
```

## Testing

`yarn test` will run all tests.

## Distribution

### Step 1 - Build the dist files

`yarn build` builds the library to `dist`, generating two files:

- `dist/mobx-async-store.cjs.js`
  A CommonJS bundle, suitable for use in Node.js, that `require`s the external dependency. This corresponds to the `"main"` field in package.json
- `dist/mobx-async-store.esm.js`
  an ES module bundle, suitable for use in other people's libraries and applications, that `import`s the external dependency. This corresponds to the `"module"` field in package.json

### Step 2 - Update the documentation

`yarn docs` updates the documentation, located in `docs`.

### Step 3 - Publish

`npm login` to authenticate yourself as someone authorized to publish this package
`npm publish` (or `npm publish =tag=develop` for development releases)

## Installation

```
yarn add mobx-async-store
```

# Usage
`mobx-async-store` uses two main classes, `Store` and `Model`. Subclasses of `Model` are used to instantiate data objects, and `Store` provides an interface to add and manipulate those objects.

## Models
You can define models by extending them and adding your own property definitions. The static property `type` determines how the store and other objects will refer to the class (corresponds to `type` in a jsonapi document), and `endpoint` defines the path the model will use to the server. Definitions are stored in two hashes that are static properties on the model, `attributeDefinitions` and `relationshipDefinitions`. These definitions determine how data will be parsed and implemented as it is returned from the server.


```JavaScript
import { Model } from 'mobx-async-store'

class Todo extends Model {
  static type = 'todos'
  static endpoint = 'todos'

  static attributeDefinitions = {
    title: {
      transformer: stringType,
      validator: validatesString,
      defaultValue: 'NEW TODO'
    }
  }

  static relationshipDefinitions = {
    notes: {
      direction: 'toMany',
      validator: validatesArrayPresence,
      types: ['notes', 'awesome_notes'],
      inverse: {
        name: 'todo',
        direction: 'toOne'
      }
    }
  }
}
```

### Attributes
The `attributeDefinitions` hash corresponds to the `attributes` hash of a jsonapi document. It is defined by keys representing the names of the properties, and objects with definitions of those properties.
- `transformer` - a function used to coerce the value to a given type or format
- `validator` - a function used to determine whether a key is allowed or not
- `defaultValue` - the value that is used on a new instance if none is defined

### Relationships
The `relationshipDefinitions` hash corresponds to `relationships` in a jsonapi document. It is defined by keys representing the names of the relationships, and objects with defintions of those properties.
- `direction` - can be `toOne` or `toMany`
- `validator` - a function used for validating a relationship
- `types` - an array of polymorphic model `types` that can be used for this relationship
- `inverse` - the other direction of a relationship. Not required, but allows models to be related both directions without explicitly defining both directions
  - `name` - the name the relationship uses to refer to this model. This is automatically inferred if it matches the model `type` (usually for `toMany` relationships)
  - `direction` - the inverse direction, `toOne` or `toMany`

### Model methods and properties

[See jsdoc documentation](https://iunu.github.io/mobx-async-store/Model.html)

## Store
The store is used to collect, retrieve and refer to documents.

```JavaScript
import AppStore from './AppStore'

const store = new AppStore({
  baseUrl: 'https//api.example.com',
  defaultFetchOptions: {
    headers: {
      'Accepts': 'application/json',
      'Content-Type': 'application/vnd.api+json',
      'X-CSRF-Token': 'EXAMPLE-CSRF-TOKEN'
    }
  },
  headersOfInterest: ['X-Iunu-Roots'],
  retryOptions: {
    attempts: 3,
    delay: 1000,
  },
  errorMessages: {
    400: 'Bad request.',
    403: 'Forbidden',
    ...
    default: 'Something went wrong.',
  }
})
```

### Retrieving documents
The store uses variations of `get`, `find` and `fetch` to retrieve records from the store, with `All`, `Many`, and `One` determining how many records will be requested. An optional `options` hash provides further customization for requesting and caching.
- `get` will only retrieve locally cached records, and will never request from the server
- `find` will first look for records of a given type in the store, and then will go to the server
- `fetch` will always request from the server
- `getAll`, `findAll`, and `fetchAll` retrieve all records that match the optional `options`
  - `store.getAll('todos', { queryParams: { recent: true } })`
- `getOne`, `findOne`, and `fetchOne` retrieves one record. Usually used with just one id but can also use the `options` hash.
  - `store.getOne('todos', '1')`
- `getMany`, `findMany`, and `fetchMany` are like `One` but with an array of ids instead of a single id


#### `queryParams` options

`mobx-async-store` builds queries that are `JSON::API` compliant. Requests are cached from the previous call - including any `queryParams` given.

```JavaScript
store.findAll('todos', { queryParams: filter: { title: 'Do taxes', filter: { overdue: true } } })
// The query is: '/example_api/todos?filter[title]=Do taxes&filter[overdue]=true'
// This fetches from the server and stores the result of the query in the cache.

store.findAll('todos', { queryParams: filter: { title: 'Do taxes', filter: { overdue: true } } })
// Returns result from the cache.
```

## Testing
`FactoryFarm`  to quickly build data models that can be used for testing. An instance of FactoryFarm has factories defined that can be used to build models at runtime.

Defining a factory
You can define a factory for any model in shared-js/store. Then, objects can be built using the predefined factory, which describes attributes and relationships.

const factoryFarm = new FactoryFarm()
factoryFarm.define('funZone', { type: 'zones', name: 'Fun Zone' })

const funZone = factoryFarm.build('funZone')
funZone.name
=> 'Fun Zone'

Factories follow an inheritance tree which can be used to override some properties while keeping the other parent properties.

const factoryFarm = new FactoryFarm()
factoryFarm.define('funZone', { type: 'zones', name: 'Fun Zone' })
factoryFarm.define('bigZone', { parent: 'funZone', seeding_unit_capacity: 1000 })

const funZone = factoryFarm.build('bigZone')
funZone.name
=> 'Fun Zone'
funZone.seeding_unit_capacity
=> 1000

FactoryFarm from utils/Testing comes pre-loaded with a number of factories. Most are singularized versions of the model name.

Factories and relationships
Factories can be used to build relationships just as you would with mobx-async-store.

const factoryFarm = new FactoryFarm()
const seeding_unit = factoryFarm.build('seeding_unit', { name: 'Seeding Unit 1')
factoryFarm.define('bigZone', { parent: 'funZone', seeding_unit })

const funZone = factoryFarm.build('funZone')
funZone.seeding_unit.name
=> 'Seeding Unit 1'

Dynamic factories
Attributes and relationships can be defined as functions. The function will be executed at build. Passing a third parameter while building will return an array of objects.

const factoryFarm = new FactoryFarm()
factoryFarm.define('dynamicZone', {
  parent: 'funZone',
  name: (index, properties) => `Fun Zone ${properties.id}`,
  seeding_unit: () => factoryFarm.build('seeding_unit'),
})

const facility = factoryFarm.build('facility', { name: 'Jay St' })

const dynamicZones = factoryFarm.build('dynamicZone', { facility }, 2)
const [zone1, zone2] = dynamicZones

zone1.name
=> 'Fun Zone 1'
zone1.seeding_unit.name
=> 'Seeding Unit 1'
zone1.facility.name
=> 'Jay St'
zone2.name
=> 'Fun Zone 2'
zone2.seeding_unit.name
=> 'Seeding Unit 2'
zone2.facility.name
=> 'Jay St'

More on Server Calls
MockServer uses an internal factory and store to simulate data to return during a fetch. For GET requests, it will first try to return a defined object from the store. If that misses, it will return an object from the default factory. PATCH requests return the properties that were sent, and POST requests return a new object with the properties that were sent with a new id. Special cases such as defining specific routes (eg for external apis), delayed responses (for race conditions), and error states are described below.


Example with a component

// Component
@inject('dataStore')
class Button extends Component {
  @observable zone 
  changeZoneName = (name) => {
    const { zone } = this
    zone.name = name
    zone.save()
  }
  componentDidMount() {
    this.loadData()
  }

  loadData = async () {
    const { dataStore, zoneId } = this.props
    this.zone = await dataStore.fetchOne('zones', zoneId)
  }
  render () {
    const { name } = this.zone?.name
    const { changeZoneName } = this
    return <button onClick={() => changeZoneName('Zone 2')}>{name}</button>
  }
}

// Test
describe('it changes the zone name', () => {
  let wrapper

  beforeEach(() => {
    mockServer.start()

    wrapper = mount(
      <TestContextWrapper>
        <Button zoneId='1' />
      </TestContextWrapper>
    )
    setImmediate((done) => {
      wrapper.update()
      done()
    })
  })

  it('changes zone name when clicked', () => {
    expect(wrapper.text()).toMatch('Zone 1')
    wrapper.find('button').simulate('click')
    expect(wrapper.text()).toMatch('Zone 2')
    expect(fetch.mock.calls).toHaveLength(2)
    const [fetchZone, patchZone] = fetch.mock.calls
    expect(fetchZone[0].method).toEqual('GET')
    expect(fetchZone[0].body).toMatch('Zone 1')
    expect(fetchZone[0].method).toEqual('PATCH')
    expect(fetchZone[0].body).toMatch('Zone 2')
  })
})

Example with a helper

export const fetchZone = (zoneId) {
  return dataStore.fetchOne('zones', zoneId)
}

// Test
describe('fetchZone', () => {
  let factoryFarm
  let wrapper

  beforeEach(() => {
    const mockServer = new MockServer()
    mockServer.start()
  })

  it('loads the zone', async (done) => {
    const zone = await fetchZone('1')
    expect(zone.name).toMatch('Zone 1')
    expect(fetch.mock.calls).toHaveLength(1)
    expect(fetch.mock.calls[0].method).toEqual('GET')
  })
})


Example - failure on specific call 

// Testing a catch alerts with errors
  it('returns errors if saving fails', async (done) => {
    expect.assertions(3)
    // Include non 200 status in response override (default is 200)
    const responseOverrides = [
      {
        path: '/new/completions',
        method: 'POST',
        status: 500,
        response: () => {
          return {
            errors: [{ title: 'Invalid options', detail: 'There is an error!', meta: { server: true } }],
          }
        },
      },
    ]

    // Pass in response overrides when starting the server
    const mockServer = new MockServer()
    mockServer.start({ responseOverrides })
    
    window.alert = jest.fn()
    expect(fetch.mock.calls).toHaveLength(1)
    
    const submitBtn = wrapper.find('button[data-testid="manual-task-submit-button"]')
    await submitBtn.simulate('click')
    
    expect(fetch.mock.calls).toHaveLength(2)
    setImmediate(() => {
      expect(window.alert).toHaveBeenCalledWith('There is an error!')
      done()
    })
  })

Example - failure on all calls

// Testing a catch alerts with errors
  it('returns errors if saving fails', async (done) => {
    expect.assertions(2)

    // Pass in non-200 status when starting the server (this will fail all responses)
    const mockServer = new MockServer()
    mockServer.start({ status: 500 })
    
    expect(fetch.mock.calls).toHaveLength(1)
    const submitBtn = wrapper.find('button[data-testid="manual-task-submit-button"]')
  
    try {
      await submitBtn.simulate('click')
    } catch (error) {
      expect(fetch.mock.calls).toHaveLength(2)
    }
  })

Customizing Data
You can pass in a factory or store to define data that will be returned by the server, using the factoryFarm and store in the constructor options. Passing factoriesForType  will allow you to use a defined factory for mocking data instead of the default factory.

// Component
@inject('dataStore')
class Button extends Component {
  @observable zone 

  componentDidMount() {
    this.loadData()
  }

  loadData = async () {
    const { dataStore, zoneId } = this.props
    this.zone = await dataStore.fetchOne('zones', zoneId)
  }

  render () {
    const { name } = this.zone?.name
    const { changeZoneName } = this
    return <button onClick={() => changeZoneName('Zone 2')}>{name}</button>
  }
}

// Test
describe('it displays the zone name', () => {
  let factoryFarm
  let wrapper

  beforeEach(() => {
    const mockServer = new MockServer()
    mockServer.define('funZone', {
      name: (index) => `Fun Zone ${index}`
    })

    mockServer.start({
      factoriesForType: { zones: 'funZone' },
    })

    wrapper = mount(
      <TestContextWrapper>
        <Button zoneId='1'/>
      </TestContextWrapper>
    )

    setImmediate((done) => {
      wrapper.update()
      done()
    })
  })

  it('displays the zone name', () => {
    expect(wrapper.text()).toMatch('Fun Zone 1')
    expect(fetch.mock.calls).toHaveLength(1)
    expect(fetch.mock.calls[0].method).toEqual('GET')
  })
})

Complex Setup
responseOverrides will take a hash of responses and use those to match fetch calls, overriding the server’s calls to the store. delayedResponse, in conjunction with serverResponse, adds a timeout to the promise to simulate a delay in returning from the server.


### Errors
`errorMessages`: These are optional error messages that can be configured to provide additional details
when returning errors for various requests. Each property corresponds to an HTTP status code which can be
customized, and any errors returned from the server that have a `status` matching this code will have their `detail` property overriden by this value. A `default` can also be set as a fallback.

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
