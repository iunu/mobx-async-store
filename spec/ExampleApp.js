/* eslint-disable jsdoc/require-jsdoc */
import React, { Component } from 'react'
import {
  action,
  makeObservable,
  observable
} from 'mobx'
import { inject, observer } from 'mobx-react'

import PropTypes from 'prop-types'

const todoCardPropTypes = {
  todo: PropTypes.object.isRequired
}
@observer
class TodoCard extends Component {
  constructor () {
    super()
    makeObservable(this, {
      onChange: action
    })
  }

  onChange = ({ target }) => {
    this.props.todo.title = target.value
  }

  render () {
    const { onChange } = this
    const { title } = this.props.todo
    return (
      <li>
        <label>{ title }</label>
        <input
          data-testid={`todo-title-${this.props.todo.id}`}
          value={title}
          onChange={onChange}
        />
      </li>
    )
  }
}

TodoCard.propTypes = todoCardPropTypes

const TodoList = observer(function ({ todos }) {
  return (
    <ul>
      {
        todos.map(todo => <TodoCard key={todo.id} todo={todo} />)
      }
    </ul>
  )
})

TodoList.propTypes = {
  todos: PropTypes.array.isRequired
}

const exampleAppPropTypes = {
  store: PropTypes.object.isRequired
}

@inject('store') @observer
class ExampleApp extends Component {
  constructor (props) {
    super(props)
    makeObservable(this, {
      title: observable,
      todos: observable,
      onChange: action,
      onClick: action
    })

    this.todos = props.store.getAll('todos')
  }

  title = ''

  todos = []

  onChange = ({ target }) => {
    this.title = target.value
  }

  onClick = () => {
    const { title, props: { store } } = this
    const todo = store.add('todos', { title })
    this.todos.push(todo)
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
