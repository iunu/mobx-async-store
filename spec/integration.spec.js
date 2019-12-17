/* global fetch */
import React from 'react'
import { mount } from 'enzyme'
import { Provider } from 'mobx-react'
import { isObservable } from 'mobx'

import { Store, Model, attribute } from 'artemis-data'
import ExampleApp from './ExampleApp'

class Todo extends Model {
  static type = 'todos'
  static endpoint = 'todos'

  @attribute(String) title = ''
}

class AppStore extends Store {
  static types = [
    Todo
  ]
}

const store = new AppStore()

describe('Example React App', () => {
  beforeEach(() => {
    fetch.resetMocks()
    store.reset()
  })

  it('has correct default text', () => {
    expect.assertions(2)
    // fetch.mockResponse(JSON.stringify([]))
    // Mount the component and set the wrapper variable
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
    fetch.mockResponse(JSON.stringify([]))

    const wrapper = mount(
      <Provider store={store}>
        <ExampleApp />
      </Provider>
    )

    expect(wrapper.text()).not.toMatch('Buy Milk')

    await wrapper
      .find('input')
      .simulate('change', { target: { value: 'Buy Milk' } })

    await wrapper
      .find('button')
      .simulate('click')

    expect(wrapper.text()).toMatch('Buy Milk')
  })

  it('can edit an existing model', async () => {
    const todoStore = new AppStore()

    let todo = todoStore.add('todos', { title: 'Pay bills' })

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

    expect(wrapper.text()).toMatch('Make payments')
    expect(isObservable(todo)).toBeTruthy()
  })
})
