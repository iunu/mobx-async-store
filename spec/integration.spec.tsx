/* global fetch */
import React from 'react'
import { mount } from 'enzyme'
import { Provider } from 'mobx-react'
import { isObservable } from 'mobx'
import { Store, Model, attribute } from '../src/main'

import ExampleApp from './ExampleApp'

class Todo extends Model {
  static type = 'todos'
  static endpoint = 'todos'

  @attribute({ defaultValue: ''}) title: string
}

class AppStore extends Store {
  static types = [
    Todo
  ]
}

const mockBaseUrl = '/example_api'

const mockFetchOptions = {
  headers: {
    'Content-Type': 'application/vnd.api+json',
    'Accepts': 'application/json'
  }
}

const store:any = new AppStore({
  baseUrl: mockBaseUrl,
  defaultFetchOptions: mockFetchOptions
})

describe('Example React App', () => {
  beforeEach(() => {
    // @ts-ignore
    fetch.resetMocks()
    store.reset()
  })

  it('has correct default text', () => {
    expect.assertions(2)
    // fetch.mockResponse(JSON.stringify([]))
    // Mount the component and set the wrapper variable
    // @ts-ignore

    const wrapper = mount(
      <Provider store={store}>
        <ExampleApp />
      </Provider>
    )
    expect(wrapper.text()).toMatch('Todos')
    expect(wrapper.text()).not.toMatch('Buy Milk')
  })

  it('can create a new model', async () => {
    expect.assertions(2)
    // @ts-ignore
    fetch.mockResponse(JSON.stringify([]))

    const wrapper = mount(
      <Provider store={store}>
        <ExampleApp />
      </Provider>
    )

    expect(wrapper.text()).not.toMatch('Pay bills')

    await wrapper
      .find('input')
      .first()
      .simulate('change', {
        target: {
          value: 'Buy Milk'
        }
      })

    expect(wrapper.text()).not.toMatch('Buy Milk')
  })

  it('can edit an existing model', async () => {
    const todoStore = new AppStore({
      baseUrl: mockBaseUrl,
      defaultFetchOptions: mockFetchOptions
    })

    let todo = todoStore.add('todos', { title: 'Pay bills', options: { trackable_id: 1 } })

    const wrapper = mount(
      <Provider store={todoStore}>
        <ExampleApp />
      </Provider>
    )

    expect(wrapper.text()).toMatch('Pay bills')

    await wrapper
      .find('input')
      .last()
      .simulate('change', { target: { value: 'Make payments' } })

    expect(todo.options.trackable_id).toBe(1)
    expect(wrapper.text()).toMatch('Make payments')
    expect(isObservable(todo)).toBeTruthy()
  })
})
