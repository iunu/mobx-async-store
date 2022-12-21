/* global fetch */
import { QueryString, deriveIdQueryStrings, fetchWithRetry, URL_MAX_LENGTH } from '../src/utils'

describe('QueryString', () => {
  const queryString = 'fields[articles][]=title&fields[articles][]=body&fields[people]=name'
  const params = { fields: { articles: ['title', 'body'], people: 'name' } }

  describe('stringify', () => {
    it('stringifies a deeply nested param object', () => {
      expect(decodeURI(QueryString.stringify(params))).toBe(queryString)
    })
  })

  describe('parse', () => {
    it('parses a deeply nested query string', () => {
      expect(QueryString.parse(queryString)).toEqual(params)
    })

    it('ignores leading ?', () => {
      expect(QueryString.parse(`?${queryString}`)).toEqual(params)
    })
  })
})

describe('deriveIdQueryStrings', () => {
  const shortIds = [1, 2, 3]
  const longIds = Array.from({ length: 1000 }, (_, index) => 1000 + index)
  const baseUrl = 'https://example.com/todos'

  it('splits ids into an expected length', () => {
    const idQueryStrings = deriveIdQueryStrings(longIds, baseUrl)
    expect(idQueryStrings).toHaveLength(8)
    expect(longIds.join()).toEqual(idQueryStrings.join().split().join())
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
  let url, fetchOptions

  beforeEach(() => {
    url = 'https://example.com'
    fetchOptions = {}
    fetch.resetMocks()
  })

  it('will retry the request if there is a fetch failure', async () => {
    fetch.mockRejectOnce('network error')
    await fetchWithRetry(url, fetchOptions, 2, 0)
    expect(fetch.mock.calls.length).toEqual(2)
  })

  it('makes as many requests as the attempts arguement calls for', async () => {
    expect.assertions(1)

    fetch.mockReject('network error')
    await fetchWithRetry(url, fetchOptions, 5, 0).catch((_error) => {
      expect(fetch.mock.calls.length).toEqual(5)
    })
  })

  it('stops retrying once it gets a successful response', async () => {
    expect.assertions(2)

    fetch.mockRejectOnce('network error')
    fetch.mockResponseOnce('success')
    const result = await fetchWithRetry(url, fetchOptions, 5, 0)
    expect(result.body.toString()).toEqual('success')
    expect(fetch.mock.calls.length).toEqual(2)
  })
})
