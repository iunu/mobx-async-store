/* global fetch */  
import OfflineService from '../src/OfflineService'

const mockFetchPromise = Promise.resolve({ // 3
    json: () => { return { status: true } }
})

jest.spyOn(global, 'fetch').mockImplementation(() => mockFetchPromise)

describe('Test suite for Offline service/Queue class', () => {
    let offlineService
    beforeEach(() => {
        offlineService = new OfflineService([])
    })
    it('Should instantiate', () => {
        expect(offlineService).toBeTruthy()
    })

    it('Should allow offline status to be updated', () => {
        expect(offlineService).toBeTruthy()
        expect(offlineService.offlineStatus.offline).toBe(false)
        offlineService.setOffline(true)
        expect(offlineService.offlineStatus.offline).toBe(true)
    })

    it('Should not call flush if no pending and offline status changes from false to true', () => {
        offlineService.flush = jest.fn()
        offlineService.setOffline(true)
        offlineService.setOffline(false)
        expect(offlineService.flush).not.toHaveBeenCalled()
    })

    it('Should call flush if pending and offline status changes from false to true', () => {
        offlineService.flush = jest.fn()
        expect(offlineService.offlineStatus.offline).toBe(false)
        offlineService.setOffline(true)
        offlineService.pending = [1]
        offlineService.setOffline(false)
        expect(offlineService.flush).toHaveBeenCalledTimes(1)
    })

    it('Flush should resolve all pending items', () => {
        expect(offlineService.offlineStatus.offline).toBe(false)
        offlineService.setOffline(true)
        offlineService.pending = [fetch('https://google.com/a', { method: 'GET' })]
        offlineService.setOffline(false)
        expect(global.fetch).toHaveBeenCalledTimes(1)
        expect(global.fetch.mock.calls[0]).toEqual(["https://google.com/a", {"method": "GET"}])
        
    })
})
