/* global fetch */
import { observable } from 'mobx'
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

    @observable isFlushing = false

    constructor () {
        this.flush = this.flush.bind(this)
        this.offlineRetry = this.offlineRetry.bind(this)
    }

    /**
     * Request is the function that fires the request or pushes
     * that request to the queue.
     * @method request
     * @param {String} methodName
     * @param {String} url
     * @param {String} body
     * @param {Function} cb
     * @return {Object} { method, body }
    */
    request = ({ url, options }) => {
        if (this.isFlushing) {
            this.pending.push(
                {
                    fullRequest: {
                        url,
                        options
                    }
                }
            )
        } else {
            return fetch(url, { ...options }).then(async (res, err) => {
                let data = await res.json()
                if (data.ok) {
                    return data
                } else {
                    this.pending.push({ fullRequest: { url, options } })
                    return this.offlineRetry()
                }
            })
        }
    }

    offlineRetry () {
        this.isFlushing = true
        return this.flush()
    }

    /**
     * Request is the function that fires the request or pushes
     * that request to the queue.
     * @method request
     * @param {String} methodName
     * @param {String} url the properties to use
     * @param {Object} methodName
     * @return {Object} { method, body }
    */
    async flush () {
        let len = this.pending.length
        let failed = false
        let results = []

        for (let i = 0; i < len && !failed; i++) {
            let request = this.pending[i]
            const { url, options } = request.fullRequest
            results.push(fetch(url, { ...options }).then(incomingData => {
                let res = incomingData.json()
                if (res.ok) {
                    this.pending.splice(i, i + 1)
                    return res
                } else {
                    // need to handle failed auth here, status code
                    // hash would be helpful?
                    failed = true
                    return {error: res.statusText, status: 'offline', data: null}
                }
            }).catch(() => {
                failed = true
                return {error: 'Request failed', status: 'offline', data: null}
            }))
        }

        if (failed) {
            setTimeout(this.flush, 1000)
        } else {
            this.isFlushing = false
            return Promise.all(results)
        }
    }
}
