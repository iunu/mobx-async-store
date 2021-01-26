export declare const URL_MAX_LENGTH = 1024;
/**
 * Singularizes record type
 * @method singularizeType
 * @param {String} recordType type of record
 * @return {String}
 */
export declare function singularizeType(recordType: string): string;
/**
 * Build request url from base url, endpoint, query params, and ids.
 *
 * @method requestUrl
 * @return {String} formatted url string
 */
export declare function requestUrl(baseUrl: any, endpoint: any, queryParams?: any, id?: any): string;
export declare function newId(): string;
export declare function dbOrNewId(properties: {
    id: any;
}): any;
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
export declare function combineRacedRequests(key: string, fn: {
    (): Promise<any>;
    call?: any;
}): any;
/**
 * Reducer function for filtering out duplicate records
 * by a key provided. Returns a function that has a accumulator and
 * current record per Array.reduce.
 *
 * @method uniqueByReducer
 * @param {Array} key
 * @return {Function}
 */
export declare function uniqueByReducer(key: string | number): (accumulator: any[], current: {
    [x: string]: any;
}) => any[];
/**
 * Returns objects unique by key provided
 *
 * @method uniqueBy
 * @param {Array} array
 * @param {String} key
 * @return {Array}
 */
export declare function uniqueBy(array: any[], key: string): any;
export declare function stringifyIds(object: {
    [x: string]: any;
}): void;
/**
 * convert a value into a date, pass Date or Moment instances thru
 * untouched
 * @method makeDate
 * @param {*} value
 * @return {Date|Moment}
 */
export declare function makeDate(value: any): any;
/**
 * recursively walk an object and call the `iteratee` function for
 * each property. returns an array of results of calls to the iteratee.
 * @method walk
 * @param {*} obj
 * @param {Function} iteratee
 * @param {String} prefix
 * @return Array
 */
export declare function walk(obj: {
    [x: string]: any;
}, iteratee: {
    (prevValue: any, path: any): any;
    (arg0: any, arg1: any): any;
}, prefix: string): any;
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
export declare function diff(a?: {}, b?: {}): any;
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
export declare function parseErrorPointer(error?: {}): {
    index: number;
    key: any;
};
/**
 * Splits an array of ids into a series of strings that can be used to form
 * queries that conform to a max length of URL_MAX_LENGTH. This is to prevent 414 errors.
 * @method deriveIdQueryStrings
 * @param {Array} ids an array of ids that will be used in the string
 * @param {String} restOfUrl the additional text URL that will be passed to the server
 */
export declare function deriveIdQueryStrings(ids: any[], restOfUrl?: string): string[];
