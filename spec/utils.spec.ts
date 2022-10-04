/* global fetch */
import QueryString from '../src/QueryString'
import { deriveIdQueryStrings, fetchWithRetry, URL_MAX_LENGTH } from '../src/utils'
import fetchMock from 'jest-fetch-mock'

describe('deriveIdQueryStrings', () => {
  const shortIds = [1, 2, 3]
  const longIds = Array.from({ length: 1000 }, (_, index) => 1000 + index)
  const baseUrl = 'https://example.com/todos'

  it('splits ids into an expected length', () => {
    const idQueryStrings = deriveIdQueryStrings(longIds, baseUrl)
    expect(idQueryStrings).toHaveLength(8)
    expect(longIds.join()).toEqual(idQueryStrings.join().split('').join())
    idQueryStrings.forEach(ids => {
      expect(baseUrl.length + QueryString.stringify({ filter: { ids } }).length).toBeLessThan(URL_MAX_LENGTH)
    })
  })

  it("doesn't split short arrays", () => {
    const idQueryStrings = deriveIdQueryStrings(shortIds, baseUrl)
    expect(idQueryStrings).toHaveLength(1)
    expect(idQueryStrings[0].length + baseUrl.length).toBeLessThan(URL_MAX_LENGTH)
  })
})

// function fetchWithRetry (url, fetchOptions, retryAttempts, delay, handleResponse) {
describe('fetchWithRetry', () => {
  let url: string, fetchOptions: RequestInit | undefined

  beforeEach(() => {
    url = 'https://example.com'
    fetchOptions = {}
    fetchMock.resetMocks()
  })

  it('will retry the request if there is a fetch failure', async () => {
    fetchMock.mockRejectOnce('network error')
    await fetchWithRetry(url, fetchOptions, 2, 0)
    expect(fetch.mock.calls.length).toEqual(2)
  })

  it('makes as many requests as the attempts argument calls for', async () => {
    expect.assertions(1)

    fetchMock.mockReject('network error')
    await fetchWithRetry(url, fetchOptions, 5, 0).catch((_error) => {
      expect(fetch.mock.calls.length).toEqual(5)
    })
  })

  it('stops retrying once it gets a successful response', async () => {
    expect.assertions(2)

    fetchMock.mockRejectOnce('network error')
    fetchMock.mockResponseOnce('success')
    const result = await fetchWithRetry(url, fetchOptions, 5, 0)
    expect(result.body.toString()).toEqual('success')
    expect(fetchMock.mock.calls.length).toEqual(2)
  })
})
