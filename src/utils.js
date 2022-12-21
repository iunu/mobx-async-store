/* global fetch */
import { v1 as uuidv1 } from 'uuid'
import pluralize from 'pluralize'
import dig from 'lodash/get'
import flattenDeep from 'lodash/flattenDeep'
import { toJS } from 'mobx'
import qs from 'qs'

const pending = {}
const counter = {}
export const URL_MAX_LENGTH = 1024
const ENCODED_COMMA = encodeURIComponent(',')

export const arrayType = (value) => toJS(value)
export const objectType = (value) => toJS(value)
export const dateType = (value) => makeDate(value).toISOString()
export const stringType = (value) => value.toString()
export const numberType = (value) => Number(value)

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

 * @param {string} recordType type of record
 * @returns {string}
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

 * @returns {string} formatted url string
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

export function idOrNewId (id) {
  return id || newId()
}

/**
 * Avoids making racing requests by blocking a request if an identical one is
 * already in-flight. Blocked requests will be resolved when the initial request
 * resolves by cloning the response.
 *

 * @param {string} key the unique key for the request
 * @param {Function} fn the function the generates the promise
 * @returns {Promise}
 */
export function combineRacedRequests (key, fn) {
  const incrementBlocked = incrementor(key)
  const decrementBlocked = decrementor(key)

  // keep track of the number of callers waiting for this promise to resolve
  incrementBlocked()

  // Add the current call to our pending list in case another request comes in
  // before it resolves. If there is a request already pending, we'll use the
  // existing one instead
  if (!pending[key]) { pending[key] = fn.call() }

  return pending[key]
    .finally(() => {
      const count = decrementBlocked()
      // if there are no more callers waiting for this promise to resolve (i.e. if
      // this is the last one), we can remove the reference to the pending promise
      // allowing subsequent requests to proceed unblocked.
      if (count === 0) delete pending[key]
    })
    .then(
      // if there are other callers waiting for this request to resolve, clone the
      // response before returning so that we can re-use it for the remaining callers
      response => response.clone(),
      // Bubble the error up to be handled by the consuming code
      error => Promise.reject(error)
    )
}

export function fetchWithRetry (url, fetchOptions, attempts, delay) {
  const key = JSON.stringify({ url, fetchOptions })

  return combineRacedRequests(key, () => fetch(url, fetchOptions))
    .catch(error => {
      const attemptsRemaining = attempts - 1
      if (!attemptsRemaining) { throw error }
      return new Promise((resolve) => setTimeout(resolve, delay))
        .then(() => fetchWithRetry(url, fetchOptions, attemptsRemaining, delay))
    })
}

/**
 * convert a value into a date, pass Date or Moment instances thru
 * untouched

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

 * @param {*} obj
 * @param {Function} iteratee
 * @param {string} prefix
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

 * @param {object} a
 * @param {object} b
 * @return Array<String>
 */
export function diff (a = {}, b = {}) {
  return flattenDeep(walk(a, (prevValue, path) => {
    const currValue = dig(b, path)
    return prevValue === currValue ? undefined : path
  })).filter((x) => x)
}

/**
 * Parses JSONAPI error objects from a fetch response.
 * If the response's body is undefined or is not formatted with a top-level `errors` key
 * containing an array of errors, it builds a JSONAPI error object from the response status
 * and a `errorMessages` configuration.
 *
 * Errors that are returned which contain a status also have their `detail` overridden with
 * values from this configuration.
 *

 * @param {object} response
 *   a fetch response
 * @param {object} errorMessages
 *   store configuration of error messages corresponding to HTTP status codes
 * @return Array<Object> An array of JSONAPI errors
 */
export async function parseErrors (response, errorMessages) {
  let json = {}
  try {
    json = await response.json()
  } catch (error) {
    // server doesn't return a parsable response
    const statusError = {
      detail: errorMessages[response.status] || errorMessages.default,
      status: response.status
    }
    return [statusError]
  }

  if (!json.errors) {
    const statusError = {
      detail: errorMessages[response.status] || errorMessages.default,
      status: response.status
    }
    return [statusError]
  }

  if (!Array.isArray(json.errors)) {
    const statusError = {
      detail: 'Top level errors in response are not an array.',
      status: response.status
    }
    return [statusError]
  }

  return json.errors.map((error) => {
    // override or add the configured error message based on response status
    if (error.status && errorMessages[error.status]) {
      error.detail = errorMessages[error.status]
    }
    return error
  })
}

/**
 * Parses the pointer of the error to retrieve the index of the
 * record the error belongs to and the full path to the attribute
 * which will serve as the key for the error.
 *
 * If there is no parsed index, then assume the payload was for
 * a single record and default to 0.
 *
 * ex.
 *   error = {
 *     detail: "Foo can't be blank",
 *     source: { pointer: '/data/1/attributes/options/foo' },
 *     title: 'Invalid foo'
 *   }
 *
 * parsePointer(error)
 * > {
 *     index: 1,
 *     key: 'options.foo'
 *   }
 *

 * @param {object} error
 * @returns {object} the matching parts of the pointer
 */
export function parseErrorPointer (error = {}) {
  const regex = /\/data\/(?<index>\d+)?\/?attributes\/(?<key>.*)$/
  const match = dig(error, 'source.pointer', '').match(regex)
  const { index = 0, key } = match?.groups || {}

  return {
    index: parseInt(index),
    key: key?.replace(/\//g, '.')
  }
}

/**
 * Splits an array of ids into a series of strings that can be used to form
 * queries that conform to a max length of URL_MAX_LENGTH. This is to prevent 414 errors.

 * @param {Array} ids an array of ids that will be used in the string
 * @param {string} restOfUrl the additional text URL that will be passed to the server
 */

export function deriveIdQueryStrings (ids, restOfUrl = '') {
  const maxLength = URL_MAX_LENGTH - restOfUrl.length - encodeURIComponent('filter[ids]=,,').length

  ids = ids.map(String)
  const firstId = ids.shift()

  const encodedIds = ids.reduce((nestedArray, id) => {
    const workingString = nestedArray[nestedArray.length - 1]
    const longerString = `${workingString}${ENCODED_COMMA}${id}`

    if (longerString.length < maxLength) {
      nestedArray[nestedArray.length - 1] = longerString
    } else {
      nestedArray.push(id)
    }

    return nestedArray
  }, [firstId])

  return encodedIds.map(decodeURIComponent)
}

export const isEmptyString = (data) => typeof data === 'string' && data.trim().length === 0

/**
 * returns `true` as long as the `value` is not `null`, `undefined`, or `''`
 * @method validatePresence
 * @param value
 */
export const validatesPresence = (value) => {
  return {
    isValid: (value) => value != null && value !== '',
    errors: [{
      key: 'blank',
      message: 'can\'t be blank'
    }]
  }
}

export const validatesString = (property) => {
  return {
    isValid: !isEmptyString(property),
    errors: [{
      key: 'blank',
      message: "can't be blank"
    }]
  }
}

export const validatesArray = (property) => {
  return {
    isValid: Array.isArray(property),
    errors: [{
      key: 'must_be_an_array',
      message: 'must be an array'
    }]
  }
}

export const validatesArrayPresence = (property) => {
  return {
    isValid: Array.isArray(property) && property.length > 0,
    errors: [{
      key: 'empty',
      message: 'must have at least one record'
    }]
  }
}

export const validatesOptions = (property, target) => {
  const errors = []

  if (target.requiredOptions) {
    target.requiredOptions.forEach(optionKey => {
      if (!property[optionKey]) {
        errors.push({
          key: 'blank',
          message: 'can\t be blank',
          data: { optionKey }
        })
      }
    })
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * An object with default `parse` and `stringify` functions from qs
 */
export const QueryString = {
  parse: (str) => qs.parse(str, { ignoreQueryPrefix: true }),
  stringify: (str) => qs.stringify(str, { arrayFormat: 'brackets' })
}
