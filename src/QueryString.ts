import qs from 'qs'

const QueryString = {
  parse: (str: string) => qs.parse(str, { ignoreQueryPrefix: true }),
  stringify: (str: string) => qs.stringify(str, { arrayFormat: 'brackets' })
}

export default QueryString
