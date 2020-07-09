import uuidv1 from 'uuid/v1'
import QueryString from './QueryString'
import pluralize from 'pluralize'
import dig from 'lodash/get'
import flattenDeep from 'lodash/flattenDeep'

const pending = {}
const counter = {}
export const URL_MAX_LENGTH = 1024

const incrementor = (key) => () => {
  const count = (counter[key] || 0) + 1
  counter[key] = count
  return count
}

const decrementor = (key) => () => {
  const count = (counter[key] || 0) - 1
  counter[key] = count
  return count
}

/**
 * Singularizes record type
 * @method singularizeType
 * @param {String} recordType type of record
 * @return {String}
 */
export function singularizeType (recordType) {
  let typeParts = recordType.split('_')
  let endPart = typeParts[typeParts.length - 1]

  typeParts = typeParts.slice(0, -1)
  endPart = pluralize.singular(endPart)

  return [...typeParts, endPart].join('_')
}

/**
 * Build request url from base url, endpoint, query params, and ids.
 *
 * @method requestUrl
 * @return {String} formatted url string
 */
export function requestUrl (baseUrl, endpoint, queryParams = {}, id) {
  let queryParamString = ''
  if (Object.keys(queryParams).length > 0) {
    queryParamString = `?${QueryString.stringify(queryParams)}`
  }
  let idForPath = ''
  if (id) {
    idForPath = `/${id}`
  }
  // Return full url
  return `${baseUrl}/${endpoint}${idForPath}${queryParamString}`
}

export function newId () {
  return `tmp-${uuidv1()}`
}

export function dbOrNewId (properties) {
  return properties.id || newId()
}

/**
 * Avoids making racing requests by blocking a request if an identical one is
 * already in-flight. Blocked requests will be resolved when the initial request
 * resolves by cloning the response.
 *
 * @method combineRacedRequests
 * @param {String} key the unique key for the request
 * @param {Function} fn the function the generates the promise
 * @return {Promise}
 */
export function combineRacedRequests (key, fn) {
  const incrementBlocked = incrementor(key)
  const decrementBlocked = decrementor(key)

  // keep track of the number of callers waiting for this promise to resolve
  incrementBlocked()

  function handleResponse (response) {
    const count = decrementBlocked()
    // if there are other callers waiting for this request to resolve, we should
    // clone the response before returning so that we can re-use it for the
    // remaining callers
    if (count > 0) return response.clone()
    // if there are no more callers waiting for this promise to resolve (i.e. if
    // this is the last one), we can remove the reference to the pending promise
    // allowing subsequent requests to proceed unblocked.
    delete pending[key]
    return response
  }

  // Return pending promise if one already exists
  if (pending[key]) return pending[key].then(handleResponse)
  // Otherwise call the method and on resolution
  // clear out the pending promise for the key
  pending[key] = fn.call()

  return pending[key].then(handleResponse)
}

/**
 * Reducer function for filtering out duplicate records
 * by a key provided. Returns a function that has a accumulator and
 * current record per Array.reduce.
 *
 * @method uniqueByReducer
 * @param {Array} key
 * @return {Function}
 */
export function uniqueByReducer (key) {
  return function (accumulator, current) {
    return accumulator.some(item => item[key] === current[key])
      ? accumulator
      : [...accumulator, current]
  }
}

/**
 * Returns objects unique by key provided
 *
 * @method uniqueBy
 * @param {Array} array
 * @param {String} key
 * @return {Array}
 */
export function uniqueBy (array, key) {
  return array.reduce(uniqueByReducer(key), [])
}

export function stringifyIds (object) {
  Object.keys(object).forEach(key => {
    const property = object[key]

    if (typeof property === 'object') {
      if (property.id) {
        property.id = String(property.id)
      }

      stringifyIds(property)
    }
  })
}

/**
 * convert a value into a date, pass Date or Moment instances thru
 * untouched
 * @method makeDate
 * @param {*} value
 * @return {Date|Moment}
 */
export function makeDate (value) {
  if (value instanceof Date || value._isAMomentObject) return value
  return new Date(Date.parse(value))
}

/**
 * recursively walk an object and call the `iteratee` function for
 * each property. returns an array of results of calls to the iteratee.
 * @method walk
 * @param {*} obj
 * @param {Function} iteratee
 * @param {String} prefix
 * @return Array
 */
export function walk (obj, iteratee, prefix) {
  if (obj != null && typeof obj === 'object') {
    return Object.keys(obj).map((prop) => {
      return walk(obj[prop], iteratee, [prefix, prop].filter(x => x).join('.'))
    })
  }
  return iteratee(obj, prefix)
}

/**
 * deeply compare objects a and b and return object paths for attributes
 * which differ. it is important to note that this comparison is biased
 * toward object a. object a is walked and compared against values in
 * object b. if a property exists in object b, but not in object a, it
 * will not be counted as a difference.
 * @method diff
 * @param {Object} a
 * @param {Object} b
 * @return Array<String>
 */
export function diff (a = {}, b = {}) {
  return flattenDeep(walk(a, (prevValue, path) => {
    const currValue = dig(b, path)
    return prevValue === currValue ? undefined : path
  })).filter((x) => x)
}

/**
 * A naive way of extracting errors from the server.
 * This needs some real work. Please don't track down the original author
 * of the code (it's DEFINITELY not the person writing this documentation).
 * Currently it only extracts the message from the first error, but not only
 * can multiple errors be returned, they will correspond to different records
 * in the case of a bulk JSONAPI response.
 *
 * @method parseApiErrors
 * @param {Array} a request to the API
 * @param {String} default error message
 */
export function parseApiErrors (errors, defaultMessage) {
  return (errors[0].detail.length === 0) ? defaultMessage : errors[0].detail[0]
}

/**
 * Splits an array of ids into a series of strings that can be used to form
 * queries that conform to a max length of URL_MAX_LENGTH. This is to prevent 414 errors.
 * @method deriveIdQueryStrings
 * @param {Array} ids an array of ids that will be used in the string
 * @param {String} restOfUrl the additional text URL that will be passed to the server
 */

export function deriveIdQueryStrings (ids, restOfUrl = '') {
  const idLength = Math.max(...ids.map(id => String(id).length))
  const maxLength = URL_MAX_LENGTH - restOfUrl.length - encodeURIComponent('filter[ids]=,,').length

  const encodedIds = encodeURIComponent(ids.join(','))
  if (encodedIds.length <= maxLength) {
    return [ids.join(',')]
  }

  const minLength = maxLength - idLength

  const regexp = new RegExp(`.{${minLength},${maxLength}}%2C`, 'g')
  // the matches
  const matched = encodedIds.match(regexp)
  // everything that doesn't match, ie the last of the ids
  const tail = encodedIds.replace(regexp, '')

  // we manually strip the ',' at the end because javascript's non-capturing regex groups are hard to manage
  return [...matched, tail].map(decodeURIComponent).map(string => string.replace(/,$/, ''))
}
