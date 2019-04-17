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
   * Adds an instance or an array of instances to the store.
   * ```
   * kpiHash = { name: "A good thing to measure" }
   * kpi = store.add('kpis', kpiHash)
   * kpi.name
   * => "A good thing to measure"
   * ```
   * @method add
   * @param {Object} properties the properties to use
   * @return {Object} the new record
   */

  /**
   * finds an instance by `id`. If available in the store, returns that instance. Otherwise, triggers a fetch.
   *
   *   store.findOne('calendar_events', 5)
   *   // fetch triggered
   *   => event1
   *   store.findOne('calendar_events', 5)
   *   // no fetch triggered
   *   => event1
   *
   * Passing `fromServer` as an option will always trigger a fetch if `true` and never trigger a fetch if `false`.
   * Otherwise, it will trigger the default behavior
   *
   *   store.findOne('calendar_events', 5, { fromServer: false })
   *   // no fetch triggered
   *   => undefined
   *
   *   store.findOne('calendar_events', 5)
   *   // fetch triggered
   *   => event1
   *
   *   store.findOne('calendar_events', 5, { fromServer: true })
   *   // fetch triggered
   *   => event1
   *
   * @method findOne
   * @param {String} type the type to find
   * @param id
   * @param {Object} options
   */

  /**
   * finds all of the instances of a given type. If there are instances available in the store,
   * it will return those, otherwise it will trigger a fetch
   *
   *   store.findAll('calendar_events')
   *   // fetch triggered
   *   => [event1, event2, event3]
   *   store.findAll('calendar_events')
   *   // no fetch triggered
   *   => [event1, event2, event3]
   *
   * passing `fromServer` as an option will always trigger a fetch if `true` and never trigger a fetch if `false`.
   * Otherwise, it will trigger the default behavior
   *
   *   store.findAll('calendar_events', { fromServer: false })
   *   // no fetch triggered
   *   => []
   *
   *   store.findAll('calendar_events')
   *   // fetch triggered
   *   => [event1, event2, event3]
   *
   *   // async stuff happens on the server
   *   store.findAll('calendar_events')
   *   // no fetch triggered
   *   => [event1, event2, event3]
   *
   *   store.findAll('calendar_events', { fromServer: true })
   *   // fetch triggered
   *   => [event1, event2, event3, event4]
   *
   * Query params can be passed as part of the options hash. The response will be cached, so the next time `findAll`
   * is called with identical params and values, the store will first look for the local result (unless `fromServer` is `true`)
   *
   *   store.findAll('calendar_events', {
   *     queryParams: { start_time: moment(), end_time: moment() }
   *   })
   *
   * @method findAll
   * @param {String} type the type to find
   * @param {Object} options
   */

  /**
   * Clears the store of a given type, or clears all if no type given
   *
   *   store.reset('calendar_events')
   *   // removes all calendar_events from store
   *   store.reset()
   *   // clears store
   *
   * @method reset
   */

  /**
   * @method ping
   * @return {String} 'pong'
   */
  ping () {
    return 'pong'
  }
}

export default Store
