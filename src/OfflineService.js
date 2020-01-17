/* global fetch */
import { observable, observe } from 'mobx'
/**
 * Class that enqueus requests and retries them when
 * network becomes available again
 *
 * @class Schema
 */
export default class OfflineService {
    /**
     * The queue for all requests needing to be retried
     * when network becomes available again
     *
     * @property pending
     * @type {Array}
     * @default []
    */
    @observable pending = []

    /**
     * The queue for all requests needing to be retried
     * when network becomes available again
     *
     * @property offline
     * @type {Boolean}
     * @default false
    */
    @observable offlineStatus = {
        offline: false
    }

    constructor () {
        this.pending = []
        this.flush = this.flush.bind(this)
        observe(this.offlineStatus, this.handleOfflineChange, false)
    }

    setOffline (value) {
        this.offlineStatus.offline = value
    }

    /**
     * handles the change from offline to online again
     * in order to trigger the queue to start flushing
     * @method handleOfflineChange
     * @return {}
     * @param {Object} change
   */
    handleOfflineChange = (change) => {
        const { name, object } = change

        // if offline is false
        if (!object[name].offline && this.pending.length) {
            this.flush()
        }
    }

    /**
     * We don't want all models to be accessible while offline
     * this can double check that only paths we want can be
     * be queued while offline
     *
     * @property WHITE_LISTED_ENDPOINTS
     * @type {Array}
     * @default []
    */
    request = (methodName, incomingUrl, { method, body }) => {
        if (this.offlineStatus.offline) this.pending.push({methodName, fullRequest: fetch(incomingUrl, { method, body })})
        let data = fetch(incomingUrl, { method, body })
        return {
            methodName,
            data
        }
    }

    flush () {
        return this.pending.reduce((request, index) => {
            return request.fullRequest().then(res => {
                if (res.ok) {
                    this.pending.splice(index, index + 1)
                    return res
                }
                return {
                    method: request.methodName,
                    data: res.json()
                }
            })
        }, [])
    }

    handleResponse = () => {

    }
}
