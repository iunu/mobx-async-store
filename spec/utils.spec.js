import QueryString from '../src/QueryString'
import { deriveIdQueryStrings, URL_MAX_LENGTH } from '../src/utils'

describe('deriveIdQueryStrings', () => {
  const shortIds = [1, 2, 3]
  const longIds = Array.from({length: 1000}, (_, index) => 1000 + index)
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
