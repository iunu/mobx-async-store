import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'mobx-react'
import { isObservable } from 'mobx'
import { Store, Model } from '../src/main'

import ExampleApp from './ExampleApp'

class Todo extends Model {
  static type = 'todos'
  static endpoint = 'todos'

  static attributeDefinitions = {
    title: {
      transformer: toString,
      defaultValue: ''
    },
    options: {
      defaultValue: {}
    }
  }
}

class AppStore extends Store {
  static models = [
    Todo
  ]
}

describe('Example React App', () => {
  let store

  beforeEach(() => {
    fetch.resetMocks()
    store = new AppStore()
  })

  it('has correct default text', () => {
    render(
      <Provider store={store}>
        <ExampleApp />
      </Provider>
    )
    expect(screen.getByRole('heading')).toHaveTextContent('Todos')
  })

  it('can create a new model', () => {
    render(
      <Provider store={store}>
        <ExampleApp />
      </Provider>
    )

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Buy Milk' } })

    fireEvent.click(screen.getByRole('button'))

    expect(screen.getByRole('listitem')).toHaveTextContent('Buy Milk')
  })

  it('can edit an existing model', () => {
    const todoStore = new AppStore()

    const todo = todoStore.add('todos', { title: 'Pay bills', options: { trackable_id: 1 } })

    render(
      <Provider store={todoStore}>
        <ExampleApp />
      </Provider>
    )

    expect(screen.getByRole('listitem')).toHaveTextContent('Pay bills')
    fireEvent.change(screen.getByTestId(`todo-title-${todo.id}`), { target: { value: 'Make payments' } })

    expect(todo.options.trackable_id).toBe(1)
    expect(screen.getByRole('listitem')).toHaveTextContent('Make payments')
    expect(isObservable(todo)).toBeTruthy()
  })
})
