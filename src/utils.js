import uuidv1 from 'uuid/v1'
import jqueryParam from 'jquery-param'

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
