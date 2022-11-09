import { IObjectWithStringOrNumber } from 'interfaces/global'
import qs, { ParsedQs } from 'qs'

const QueryString = {
  parse: (str: string): ParsedQs => qs.parse(str, { ignoreQueryPrefix: true }),
  stringify: (obj: IObjectWithStringOrNumber): string => qs.stringify(obj, { arrayFormat: 'brackets' })
}

export default QueryString
