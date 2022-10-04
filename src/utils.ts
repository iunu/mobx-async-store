/* global fetch */
import { v1 as uuidv1 } from 'uuid'
import QueryString from './QueryString'
import pluralize from 'pluralize'
import dig from 'lodash/get'
import { isMoment, Moment } from 'moment'
import flattenDeep from 'lodash/flattenDeep'
import { ErrorMessageProps } from './interfaces/global'

const pending: object = {}
const counter: object = {}
export const URL_MAX_LENGTH = 1024
const ENCODED_COMMA = encodeURIComponent(',')

const incrementor = (key: string) => (): number => {
  const count: number = (counter[key as keyof object] || 0) + 1
  Object.assign(counter, { [key]: count })
  return count
}

const decrementor = (key: string) => (): number => {
  const count = (counter[key as keyof object] || 0) - 1
  Object.assign(counter, { [key]: count })
  return count
}

/**
 * Singularizes record type
 * @method singularizeType
 * @param {string} recordType type of record
 * @return {string}
 */
export function singularizeType (recordType: string): string {
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
 * @return {string} formatted url string
 */
export function requestUrl (baseUrl: string, endpoint: string, queryParams: { [k: string]: string }, id: number | string): string {
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

export function newId (): string {
  return `tmp-${uuidv1()}`
}

export function idOrNewId (id?: string): string {
  return id || newId()
}

/**
 * Avoids making racing requests by blocking a request if an identical one is
 * already in-flight. Blocked requests will be resolved when the initial request
 * resolves by cloning the response.
 *
 * @method combineRacedRequests
 * @param {string} key the unique key for the request
 * @param {Function} fn the function the generates the promise
 * @return {Promise}
 */
export function combineRacedRequests<T> (key: string, fn: Function): Promise<T> {
  const incrementBlocked = incrementor(key)
  const decrementBlocked = decrementor(key)

  // keep track of the number of callers waiting for this promise to resolve
  incrementBlocked()

  // Add the current call to our pending list in case another request comes in
  // before it resolves. If there is a request already pending, we'll use the
  // existing one instead
  if (!pending[key as keyof object]) { Object.assign(pending, { [key]: fn.call(fn) }) }

  return pending[key as keyof object]
    .finally(() => {
      const count = decrementBlocked()
      // if there are no more callers waiting for this promise to resolve (i.e. if
      // this is the last one), we can remove the reference to the pending promise
      // allowing subsequent requests to proceed unblocked.
      if (count === 0) delete pending[key as keyof object]
    })
    .then(
      // if there are other callers waiting for this request to resolve, clone the
      // response before returning so that we can re-use it for the remaining callers
      (response: Response) => response.clone(),
      // Bubble the error up to be handled by the consuming code
      (error: Error) => Promise.reject(error)
    )
}

export function fetchWithRetry<T> (url: RequestInfo | URL, fetchOptions: RequestInit, attempts: number, delay: number): Promise<T> {
  const key = JSON.stringify({ url, fetchOptions })

  return combineRacedRequests<T>(key, () => fetch(url, fetchOptions))
    .catch((error: Error) => {
      const attemptsRemaining = attempts - 1
      if (!attemptsRemaining) { throw error }
      return new Promise((resolve) => setTimeout(resolve, delay))
        .then(() => fetchWithRetry(url, fetchOptions, attemptsRemaining, delay))
    })
}

/**
 * Convert a value into a date, pass Date or Moment instances through untouched
 * @method makeDate
 * @param {string|Date} value
 * @return {Date|Moment}
 */
export function makeDate (value: string | Date): Date | Moment {
  if (value instanceof Date || isMoment(value)) return value
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
type WalkReturnProps = Array<string | WalkReturnProps>
export function walk (obj: object, iteratee: Function, prefix?: string): WalkReturnProps {
  if (obj != null && typeof obj === 'object') {
    return Object.keys(obj).map((prop) => {
      return walk(obj[prop as keyof object], iteratee, [prefix, prop].filter(x => x).join('.'))
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
export function diff (a = {}, b = {}): string[] {
  return flattenDeep(walk(a, (prevValue: string, path: string) => {
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
 * @method parseErrors
 * @param {Object} response
 *   a fetch response
 * @param {Object} errorMessages
 *   store configuration of error messages corresponding to HTTP status codes
 * @return Array<Object> An array of JSONAPI errors
 */
export async function parseErrors (response: Response, errorMessages: ErrorMessageProps) {
  const json = await response.json()
    .catch (() => {
    // server doesn't return a parsable response
    const statusError = {
      detail: errorMessages[response.status as keyof object] || errorMessages.default,
      status: response.status
    }
    return [statusError]
  })

  if (!json.errors) {
    const statusError = {
      detail: errorMessages[response.status as keyof object] || errorMessages.default,
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

  return json.errors.map((error: ErrorMessageProps) => {
    // override or add the configured error message based on response status
    if (error.status && errorMessages[error.status as keyof object]) {
      error.detail = errorMessages[error.status as keyof object]
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
 * @method parseErrorPointer
 * @param {Object} error
 * @return {Object} the matching parts of the pointer
 */
export function parseErrorPointer (error: Error): { index: number; key: string } {
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
 * queries that conform to a max length of {URL_MAX_LENGTH}. This is to prevent 414 errors.
 * @method deriveIdQueryStrings
 * @param {Array<String>} ids an array of ids that will be used in the string
 * @param {String} restOfUrl the additional text URL that will be passed to the server
 */

export function deriveIdQueryStrings (ids: string[] | number[], restOfUrl: string): string[] {
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

  return encodedIds.map((id) => decodeURIComponent(id as string))
}
