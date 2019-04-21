import { observable } from 'mobx'

/**
 * Defines the Artemis Data Store class.
 *
 * @class Store
 * @constructor
 */
class Store {
  @observable data = {}

  /**
   * Method for smoke test
   *
   * @method ping
   * @return {String} 'pong'
   */
  ping () {
    return 'pong'
  }
}

export default Store
