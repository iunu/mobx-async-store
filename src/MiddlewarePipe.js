export default class MiddlewarePipe {
    stack = []
    reversed = false
    constructor (options) {
        this.reversed = options && options.reversed
    }

    use (fn) {
        if (Array.isArray(fn)) {
            this.stack = fn.map((item, index) => {
                console.log('index', index)
                return {
                    index,
                    fn: item
                }
            })
        } else {
            this.stack.push({ index: this.stack.length, fn })
        }
    }

    async process (raw_request) {
        let inbound_data = raw_request
        const limit = 100
        if (!this.stack.length) {
            return Promise.resolve(inbound_data)
        }

        // if a pipe needs to be first in line for process
        const currStack = this.reversed ? this.stack.reverse() : this.stack
        for (let i = 0; i < currStack.length; i++) {
            try {
                inbound_data = await currStack[i].fn(inbound_data)
            } catch (err) {
                throw new Error(err)
            }
            if (i >= limit) {
                break
            }
        }
        return Promise.resolve(inbound_data)
    }
}
