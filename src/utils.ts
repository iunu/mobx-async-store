/* global fetch */
import { v1 as uuidv1 } from 'uuid'
import dig from 'lodash/get'
import { isMoment, Moment } from 'moment'
import flattenDeep from 'lodash/flattenDeep'
import { toJS } from 'mobx'
import qs, { ParsedQs } from 'qs'
import { JSONAPIErrorObject, IErrorMessages, IQueryParams, ValidationResult } from './interfaces/global'

type WalkReturnProps = Array<string | WalkReturnProps>

const pending: Record<string, Promise<Response>> = {}
const counter: object = {}
export const URL_MAX_LENGTH = 1024
const ENCODED_COMMA = encodeURIComponent(',')

/**
 * Strips observers and returns a plain JS array
 *
 * @param {Array} array the array to transform
 * @returns {Array} the "clean array"
 */
export const arrayType = (array: any[]): any[] => toJS(array)

/**
 * Strips observers and returns a plain JS object
 *
 * @param {object} object the object to transform
 * @returns {object} the "clean object"
 */
export const objectType = (object: object): object => toJS(object)

/**
 * Coerces a string or date to a date
 *
 * @param {Date|string|Moment} date the date to transform
 * @returns {Date} a date
 */
export const dateType = (date: Date|string|Moment): string => makeDate(date).toISOString()

/**
 * Coerces a value to a string
 *
 * @param {number|string} value the value to transform
 * @returns {string} a string
 */
export const stringType = (value: number|string): string => value.toString()

/**
 * Coerces a value to a number
 *
 * @param {number|string} value the value to transform
 * @returns {number} a number
 */
export const numberType = (value: number|string): number => Number(value)

/**
 * Increments a counter by 1
 *
 * @param {string} key the counter to increment
 * @returns {number} the current count
 */
const incrementor = (key: string) => (): number => {
  const count: number = (counter[key as keyof object] || 0) + 1
  Object.assign(counter, { [key]: count })
  return count
}

/**
 * Decreases a counter by 1
 *
 * @param {string} key the counter to decreases
 * @returns {number} the current count
 */
const decrementor = (key: string) => (): number => {
  const count = (counter[key as keyof object] || 0) - 1
  Object.assign(counter, { [key]: count })
  return count
}

/**
 * Build request url from base url, endpoint, query params, and ids.
 *
 * @param {string} baseUrl the base url
 * @param {string} endpoint the endpoint of the url
 * @param {object} queryParams query params to add
 * @param {string} id the id of the the model
 * @returns {string} formatted url string
 */
export function requestUrl (baseUrl: string, endpoint: string, queryParams: IQueryParams = {}, id?: string): string {
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

/**
 * Generates a temporary id to be used for reference in the store
 *
 * @returns {string} a uuidv1 string prefixed with `tmp`
 */
export function newId (): string {
  return `tmp-${uuidv1()}`
}

/**
 * Avoids making racing requests by blocking a request if an identical one is
 * already in-flight. Blocked requests will be resolved when the initial request
 * resolves by cloning the response.
 *
 * @param {string} key the unique key for the request
 * @param {Function} fn the function the generates the promise
 * @returns {Promise} the request
 */
export function combineRacedRequests (key: string, fn: () => Promise<Response>): Promise<Response> {
  const incrementBlocked = incrementor(key)
  const decrementBlocked = decrementor(key)

  // keep track of the number of callers waiting for this promise to resolve
  incrementBlocked()

  // Add the current call to our pending list in case another request comes in
  // before it resolves. If there is a request already pending, we'll use the
  // existing one instead
  if (!pending[key as keyof object]) { pending[key] = fn() }

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
      (error: Error) => {
        throw error
      }
    )
}

/**
 * Implements a retry in case a fetch fails
 *
 * @param {string} url the request url
 * @param {object} fetchOptions headers etc to use for the request
 * @param {number} attempts number of attempts to try
 * @param {number} delay time between attempts
 * @returns {Promise} the fetch
 */
export function fetchWithRetry (url: RequestInfo | URL, fetchOptions: RequestInit, attempts: number = 1, delay?: number): Promise<Response> {
  const key = JSON.stringify({ url, fetchOptions })

  return combineRacedRequests(key, () => fetch(url, fetchOptions))
    .catch((error) => {
      const attemptsRemaining = attempts - 1
      if (!attemptsRemaining) { throw error }
      return new Promise((resolve) => setTimeout(resolve, delay))
        .then(() => fetchWithRetry(url, fetchOptions, attemptsRemaining, delay))
    })
}

/**
 * Convert a value into a date, pass Date or Moment instances through untouched
 *
 * @param {string|Date} value
 * @returns {Date|Moment}
 */
export function makeDate (value: string | Date | Moment): Date | Moment {
  if (value instanceof Date || isMoment(value)) return value
  return new Date(Date.parse(value))
}

/**
 * recursively walk an object and call the `iteratee` function for
 * each property. returns an array of results of calls to the iteratee.
 
 * @param {object} obj the object to analyze
 * @param {Function} iteratee the iterator to use
 * @param {string} prefix the prefix
 * @returns {Array} the result of iteratee calls
 */
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
 
 * @param {object} a the first object
 * @param {object} b the second object
 * @returns {string[]} the path to differences
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
 * @param {object} response  a fetch response
 * @param {object} errorMessages store configuration of error messages corresponding to HTTP status codes
 * @returns {object[]} An array of JSONAPI errors
 */
export async function parseErrors (response: Response, errorMessages: IErrorMessages): Promise<JSONAPIErrorObject[]> {
  const json = await response.json()
    .catch (() => {
    // server doesn't return a parsable response
    const statusError = {
      detail: errorMessages[response.status as keyof object] || errorMessages.defaultMessage || 'Unknown error',
      status: response.status
    }
    return [statusError]
  })

  if (!json.errors) {
    const statusError = {
      detail: errorMessages[response.status as keyof object] || errorMessages.defaultMessage || 'Unknown error',
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

  return json.errors.map((error: JSONAPIErrorObject) => {
    // override or add the configured error message based on response status
    if (error.status && errorMessages[error.status as keyof object]) {
      error.detail = errorMessages[error.status as keyof object] || ''
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
 * @param {object} error the error object to parse
 * @returns {object} the matching parts of the pointer
 */
export function parseErrorPointer (error: JSONAPIErrorObject): { index: number, key: string } {
  const regex = /\/data\/(?<index>\d+)?\/?attributes\/(?<key>.*)$/
  const match = dig(error, 'source.pointer', '').match(regex)
  const { index = '0', key } = match?.groups || {}

  return {
    index: parseInt(index),
    key: key?.replace(/\//g, '.')
  }
}

/**
 * Splits an array of ids into a series of strings that can be used to form
 * queries that conform to a max length of URL_MAX_LENGTH. This is to prevent 414 errors.
 *
 * @param {string[]} ids an array of ids that will be used in the string
 * @param {string} restOfUrl the additional text URL that will be passed to the server
 * @returns {string[]} an array of strings of ids
 */
export function deriveIdQueryStrings (ids: Array<string|number>, restOfUrl = ''): string[] {
  if (ids.length < 1) { return [] }

  const maxLength = URL_MAX_LENGTH - restOfUrl.length - encodeURIComponent('filter[ids]=,,').length

  const idsToParse: string[] = ids.map(String)
  const firstId: string = idsToParse.shift() || ''

  const encodedIds: string[] = idsToParse.reduce((nestedArray: string[], id: string): string[] => {
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

/**
 * Returns true if the value is an empty string
 *
 * @param {any} value the value to check
 * @returns {boolean} true if the value is an empty string
 */
export const isEmptyString = (value: string): boolean => typeof value === 'string' && value.trim().length === 0

/**
 * returns `true` as long as the `value` is not `null`, `undefined`, or `''`
 *
 * @function validatePresence
 * @param value the value to validate
 * @returns {ValidationResult} a validation object
 */
export const validatesPresence = (value: any): ValidationResult => {
  return {
    isValid: value != null && value !== '',
    errors: [{
      key: 'blank',
      message: 'can\'t be blank'
    }]
  }
}

/**
 * Is valid if the value is not an empty string
 *
 * @param {string} value the value to check
 * @returns {ValidationResult} a validation object
 */
export const validatesString = (value: any): ValidationResult => {
  return {
    isValid: !isEmptyString(value),
    errors: [{
      key: 'blank',
      message: "can't be blank"
    }]
  }
}

/**
 * Returns valid if the value is an array
 *
 * @param {any} value the value to check
 * @returns {ValidationResult} a validation object
 */
export const validatesArray = (value: any): ValidationResult => {
  return {
    isValid: Array.isArray(value),
    errors: [{
      key: 'must_be_an_array',
      message: 'must be an array'
    }]
  }
}

/**
 * Is valid if the array has at least one object
 *
 * @param {Array} array the array to check
 * @returns {ValidationResult} a validation object
 */
export const validatesArrayPresence = (array: any[]): ValidationResult => {
  return {
    isValid: Array.isArray(array) && array.length > 0,
    errors: [{
      key: 'empty',
      message: 'must have at least one record'
    }]
  }
}

/**
 * An object with default `parse` and `stringify` functions from qs
 */
export const QueryString = {
  /**
   * Parses a string and returns query params
   *
   * @param {string} str the url to parse
   * @returns {object} a query object
   */
  parse: (str: string): ParsedQs => qs.parse(str, { ignoreQueryPrefix: true }),
  /**
   * Changes an object to a string of query params
   *
   * @param {object} obj object to stringify
   * @returns {string} the encoded params
   */
  stringify: (obj: IQueryParams): string => qs.stringify(obj, { arrayFormat: 'brackets' })
}

/**
 * Converts a value to a string.
 *
 * @param {string | number} text - The value to be converted to a string.
 * @returns {string} The string representation of the value.
 */
export const toString = (text: string | number): string => String(text)

/**
 * Converts a value to a Date object.
 *
 * @param {Date | string} date - The value to be converted to a Date object.
 * @returns {Date} The Date representation of the value.
 */
export const toDate = (date: Date | string): Date => new Date(date);
