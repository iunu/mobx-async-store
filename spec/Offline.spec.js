// eslint-disable-next-line no-unused-vars
/* global fetch */

import OfflineService from '../src/OfflineService'

const mockFetchPromise = Promise.resolve({ // 3
    json: () => {
        return {
                ok: true
        }
    }
})
const mockFailedPromise = Promise.resolve({ // 3
    json: () => {
        return {
                ok: false,
                statusText: '500 server error'
        }
    }
})

jest.useFakeTimers()
describe('Test suite for Offline service/Queue class', () => {
    let offlineService
    beforeEach(() => {
        offlineService = new OfflineService()
    })

    it('Should instantiate', () => {
        expect(offlineService).toBeTruthy()
    })

    it('Should fire a fetch to see if request was successfull', () => {
        jest.useFakeTimers()

        jest.spyOn(global, 'fetch').mockImplementation(() => mockFetchPromise)
        let fakeCb = jest.fn()

        let fullRequest = {
            url: 'https://google.com/a',
            options: {
                method: 'POST',
                body: { test: true }
            }
        }
        offlineService.request(fullRequest, fakeCb)
        expect(global.fetch).toHaveBeenCalled()
        expect(global.fetch).toHaveBeenLastCalledWith(fullRequest.url, { ...fullRequest.options })
    })

    it('Should add to pending if fetch was not successful', () => {
        jest.runAllTimers()

        jest.spyOn(global, 'fetch').mockImplementation(() => mockFailedPromise)

        let fakeCb = jest.fn()

        let fullRequest = {
            url: 'https://google.com/a',
            options: {
                method: 'POST',
                body: { test: true }
            }
        }
        offlineService.request(fullRequest, fakeCb)
        expect(global.fetch).toHaveBeenCalled()
        expect(global.fetch).toHaveBeenLastCalledWith(fullRequest.url, { ...fullRequest.options })
    })

    it('Should add to pending if flushing is true', async () => {
        jest.useFakeTimers()

        jest.spyOn(global, 'fetch').mockImplementation(() => mockFailedPromise)
        offlineService.offlineRetry = jest.fn()
        offlineService.isFlushing = true

        let fakeCb = jest.fn()

        let fullRequest = {
            url: 'https://google.com/a',
            options: {
                method: 'POST',
                body: { test: true }
            }
        }
        offlineService.request(fullRequest, fakeCb)
        offlineService.request(fullRequest, fakeCb)
        expect(offlineService.pending.length).toBe(2)
    })

    it('Should trigger a request when flushing', () => {
        jest.spyOn(global, 'fetch').mockImplementation(() => mockFetchPromise)

        offlineService.flush = jest.fn()
        jest.runAllTimers()
        let fakeCb = jest.fn()
        let fullRequest = {
            url: 'https://google.com/a',
            options: {
                method: 'POST',
                body: { test: true }
            }
        }
        offlineService.pending = [{ cb: fakeCb, fullRequest }]
        offlineService.offlineRetry()
        expect(global.fetch).toHaveBeenCalled()
        expect(global.fetch).toHaveBeenLastCalledWith(fullRequest.url, { ...fullRequest.options })
    })
})
