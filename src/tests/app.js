import React, { Component } from 'react'
import {
  action,
  computed,
  observable,
  isObservable
} from 'mobx'
import { inject, observer } from 'mobx-react'

@inject('store') @observer
class TodoCard extends Component {
  @action onChange = ({ target }) => {
    this.props.todo.title = target.value
  }

  @action onClick = (todo, { value }) => {
    // todo.title = this.title
  }

  @computed get todo () {
    return this.props.todo
  }

  render () {
    const { onClick, onChange, todo } = this
    return (
      <li>
        <label>{ todo.title }</label>
        <input
          value={todo.title}
          onChange={onChange}
        />
        <button onClick={onClick}>Save</button>
      </li>
    )
  }
}

function TodoList ({ todos }) {
  return (
    <ul>
      {
        todos.map(todo => <TodoCard key={todo.id} todo={todo} />)
      }
    </ul>
  )
}

@inject('store') @observer
class App extends Component {
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

export default App
