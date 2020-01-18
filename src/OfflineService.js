/* global fetch */
import { observable } from 'mobx'
/**
 * Class that enqueus requests and retries them when
 * network becomes available again
 *
 * @class Schema
 */
export default class OfflineService {
    timer = null
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
    request = ({ url, options }, cb) => {
        if (this.isFlushing) {
            this.pending.push(
                {
                    cb,
                    fullRequest: {
                        url,
                        options
                    }
                }
            )
        } else {
            fetch(url, { ...options }).then((res, err) => {
                let data = res.json()
                if (data.ok) {
                    cb(null, data)
                } else {
                    this.pending.push({ cb: cb, fullRequest: { url, options } })
                    this.offlineRetry()
                    cb(null, { error: 'There was an error' })
                }
            })
        }
    }

    offlineRetry () {
        this.isFlushing = true
        this.timer = setTimeout(this.flush, 1000)
    }

    stopTimer = () => {
        clearInterval(this.timer)
        this.timer = null
        this.isFlushing = false
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
    flush () {
        console.log('this.pending', this.pending.length)

        if (this.pending.length === 0) {
            this.stopTimer()
        }
        return this.pending.reduce((acc, request, index) => {
            const { url, options } = request.fullRequest
            fetch(url, { ...options }).then(incomingData => {
                let res = incomingData.json()
                if (res.ok) {
                    this.pending.splice(index, index + 1)
                    if (!this.pending.length) {
                        this.stopTimer()
                    }
                    request.cb(null, res)
                }
                request.cb({error: 'Request failed', status: 'offline'}, { data: null })
            })
        }, [])
    }

    handleResponse = () => {

    }
}
