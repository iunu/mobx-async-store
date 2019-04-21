import { isObservable } from 'mobx'
import { Store } from '../main.js'

class AppStore extends Store {}

const store = new AppStore()

describe('Store', () => {
  it('has observable data property', () => {
    expect.assertions(1)
    expect(isObservable(store.data)).toBe(true)
  })
})
