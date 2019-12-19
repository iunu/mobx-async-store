import uuidv1 from 'uuid/v1'
import jqueryParam from 'jquery-param'
import pluralize from 'pluralize'

const pending = {}
const counter = {}

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
    queryParamString = `?${jqueryParam(queryParams)}`
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
