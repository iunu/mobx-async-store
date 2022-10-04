import qs, { ParsedQs } from 'qs'

const QueryString = {
  parse: (str: string): ParsedQs => qs.parse(str, { ignoreQueryPrefix: true }),
  stringify: (str: string): string => qs.stringify(str, { arrayFormat: 'brackets' })
}

export default QueryString
