import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {
  action,
  computed,
  observable
} from 'mobx'

import { inject, observer } from 'mobx-react'

const todoCardPropTypes = {
  store: PropTypes.object.isRequired,
  todo: PropTypes.object.isRequired
}

@inject('store') @observer
class TodoCard extends Component {
  @computed get todo () {
    return this.props.todo
  }

  @action onChange = ({ target }) => {
    this.todo.title = target.value
  }

  render () {
    const { onChange, todo } = this
    return (
      <li>
        <label>{ todo.title }</label>
        <input
          value={todo.title}
          onChange={onChange}
        />
      </li>
    )
  }
}

TodoCard.wrappedComponent.propTypes = todoCardPropTypes

function TodoList ({ todos }) {
  return (
    <ul>
      {
        todos.map(todo => <TodoCard key={todo.id} todo={todo} />)
      }
    </ul>
  )
}

TodoList.propTypes = {
  todos: PropTypes.array.isRequired
}

const exampleAppPropTypes = {
  store: PropTypes.object.isRequired
}

@inject('store') @observer
class ExampleApp extends Component {
  @observable title = ''

  @action onChange = ({ target }) => {
    this.title = target.value
  }

  @action onClick = () => {
    const { title, props: { store } } = this
    store.add('todos', { title })
  }

  @computed get todos () {
    const { store } = this.props
    return store.findAll('todos', { fromServer: false })
  }

  render () {
    const { onChange, onClick, todos } = this
    return (
      <div>
        <h1>Todos</h1>
        <input onChange={onChange}/>
        <button onClick={onClick}>Submit</button>
        <TodoList todos={todos} />
      </div>
    )
  }
}

ExampleApp.wrappedComponent.propTypes = exampleAppPropTypes

export default ExampleApp
