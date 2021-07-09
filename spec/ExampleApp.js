import React, { Component } from 'react'
import {
  action,
  computed,
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
    makeObservable(this)
  }

  @action onChange = ({ target }) => {
    this.props.todo.title = target.value
  }

  render () {
    const { onChange } = this
    const { title } = this.props.todo
    return (
      <li>
        <label>{ title }</label>
        <input
          value={title}
          onChange={onChange}
        />
      </li>
    )
  }
}

TodoCard.propTypes = todoCardPropTypes

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
  constructor () {
    super()
    makeObservable(this)
  }

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
    return store.getAll('todos')
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
