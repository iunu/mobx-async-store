import MiddlewarePipe from '../src/MiddlewarePipe'

let fakeJsonResponseData = {
    path: '/todos',
    type: 'todos',
    loading: false,
    errors: null,
    data: {
        id: 1,
        text: 'This is a todo'
    },
    responseHeaders: {
        status: '200'
    }
}

describe('This tests the middleware pipeline', () => {
    it('should return data un changed if no normalizers are in place', async () => {
        let srn = new MiddlewarePipe()

        let result = await srn.process(fakeJsonResponseData)

        expect(result).toEqual(fakeJsonResponseData)
    })

    it('should return data with no headers if normalizer is in place', async () => {
        let srn = new MiddlewarePipe()
        srn.use(async (data) => {
            data.responseHeaders = null
            return data
        })
        let result = await srn.process(fakeJsonResponseData)
        expect(result.responseHeaders).toBe(null)
    })

    it('should add multiple functions and apply them in kind', async () => {
        let srn = new MiddlewarePipe()
        srn.use((data) => {
            data.responseHeaders = null
            return data
        })

        srn.use((data) => {
            data.data = null
            return data
        })
        let result = await srn.process(fakeJsonResponseData)
        expect(result.responseHeaders).toBe(null)
        expect(result.data).toBe(null)
        expect(result.path).toBe('/todos')
    })

    it('should accept an array of functions and apply them in kind', async () => {
        let srn = new MiddlewarePipe()
        let removeHeader = (data) => {
            data.responseHeaders = null
            return data
        }
        let removeData = (data) => {
            data.data = null
            return data
        }

        srn.use([removeHeader, removeData])

        let result = await srn.process(fakeJsonResponseData)
        expect(result.responseHeaders).toBe(null)
        expect(result.data).toBe(null)
    })
})
