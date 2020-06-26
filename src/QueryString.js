import qs from 'qs'

const QueryString = {
  parse: (str) => qs.parse(str, { ignoreQueryPrefix: true }),
  stringify: (str) => qs.stringify(str, { arrayFormat: 'brackets' })
}

export default QueryString
