import QueryString from '../src/QueryString'

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
