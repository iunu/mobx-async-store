import qs from 'qs';
export declare const URL_MAX_LENGTH = 1024;
/**
 * Strips observers and returns a plain JS array
 *
 * @param {Array} array the array to transform
 * @returns {Array} the "clean array"
 */
export declare const arrayType: (array: any) => any;
/**
 * Strips observers and returns a plain JS object
 *
 * @param {object} object the object to transform
 * @returns {object} the "clean object"
 */
export declare const objectType: (object: any) => any;
/**
 * Coerces a string or date to a date
 *
 * @param {Date|string} date the date to transform
 * @returns {Date} a date
 */
export declare const dateType: (date: any) => any;
/**
 * Coerces a value to a string
 *
 * @param {number|string} value the value to transform
 * @returns {string} a string
 */
export declare const stringType: (value: any) => any;
/**
 * Coerces a value to a number
 *
 * @param {number|string} value the value to transform
 * @returns {number} a number
 */
export declare const numberType: (value: any) => number;
/**
 * Build request url from base url, endpoint, query params, and ids.
 *
 * @param {string} baseUrl the base url
 * @param {string} endpoint the endpoint of the url
 * @param {object} queryParams query params to add
 * @param {string} id the id of the the model
 * @returns {string} formatted url string
 */
export declare function requestUrl(baseUrl: any, endpoint: any, queryParams: {} | undefined, id: any): string;
/**
 * Generates a temporary id to be used for reference in the store
 *
 * @returns {string} a uuidv1 string prefixed with `tmp`
 */
export declare function newId(): string;
/**
 * Avoids making racing requests by blocking a request if an identical one is
 * already in-flight. Blocked requests will be resolved when the initial request
 * resolves by cloning the response.
 *
 
 * @param {string} key the unique key for the request
 * @param {Function} fn the function the generates the promise
 * @returns {Promise} the request
 */
export declare function combineRacedRequests(key: any, fn: any): any;
/**
 * Implements a retry in case a fetch fails
 *
 * @param {string} url the request url
 * @param {object} fetchOptions headers etc to use for the request
 * @param {number} attempts number of attempts to try
 * @param {number} delay time between attempts
 * @returns {Promise} the fetch
 */
export declare function fetchWithRetry(url: any, fetchOptions: any, attempts: any, delay: any): any;
/**
 * convert a value into a date, pass Date or Moment instances thru
 * untouched
 
 * @param {Date|string} value a date-like object
 * @returns {Date} a date object
 */
export declare function makeDate(value: any): any;
/**
 * recursively walk an object and call the `iteratee` function for
 * each property. returns an array of results of calls to the iteratee.
 
 * @param {object} obj the object to analyze
 * @param {Function} iteratee the iterator to use
 * @param {string} prefix the prefix
 * @returns {Array} the result of iteratee calls
 */
export declare function walk(obj: any, iteratee: any, prefix: any): any;
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
export declare function diff(a?: {}, b?: {}): unknown[];
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
export declare function parseErrors(response: any, errorMessages: any): Promise<any>;
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
export declare function parseErrorPointer(error?: {}): {
    index: number;
    key: string;
};
/**
 * Splits an array of ids into a series of strings that can be used to form
 * queries that conform to a max length of URL_MAX_LENGTH. This is to prevent 414 errors.
 *
 * @param {Array} ids an array of ids that will be used in the string
 * @param {string} restOfUrl the additional text URL that will be passed to the server
 * @returns {string[]} an array of strings of ids
 */
export declare function deriveIdQueryStrings(ids: any, restOfUrl?: string): any;
/**
 * Returns true if the value is an empty string
 *
 * @param {any} value the value to check
 * @returns {boolean} true if the value is an empty string
 */
export declare const isEmptyString: (value: any) => boolean;
/**
 * returns `true` as long as the `value` is not `null`, `undefined`, or `''`
 *
 * @function validatePresence
 * @returns {object} a validation object
 */
export declare const validatesPresence: () => {
    /**
     * Returns `true` if the value is truthy
     *
     * @param {any} value the value to check
     * @returns {boolean} true if the value is present
     */
    isValid: (value: any) => boolean;
    errors: {
        key: string;
        message: string;
    }[];
};
/**
 * Is valid if the value is not an empty string
 *
 * @param {string} value the value to check
 * @returns {object} a validation object
 */
export declare const validatesString: (value: any) => {
    isValid: boolean;
    errors: {
        key: string;
        message: string;
    }[];
};
/**
 * Returns valid if the value is an array
 *
 * @param {any} value the value to check
 * @returns {object} a validation object
 */
export declare const validatesArray: (value: any) => {
    isValid: boolean;
    errors: {
        key: string;
        message: string;
    }[];
};
/**
 * Is valid if the array has at least one object
 *
 * @param {Array} array the array to check
 * @returns {object} a validation object
 */
export declare const validatesArrayPresence: (array: any) => {
    isValid: boolean;
    errors: {
        key: string;
        message: string;
    }[];
};
/**
 * Valid if target options are not blank
 *
 * @param {string} property the options key to check
 * @param {object} target the object
 * @returns {object} a validation object
 */
export declare const validatesOptions: (property: any, target: any) => {
    isValid: boolean;
    errors: any[];
};
/**
 * An object with default `parse` and `stringify` functions from qs
 */
export declare const QueryString: {
    /**
     * Parses a string and returns query params
     *
     * @param {string} str the url to parse
     * @returns {object} a query object
     */
    parse: (str: any) => qs.ParsedQs;
    /**
     * Changes an object to a string of query params
     *
     * @param {object} params object to stringify
     * @returns {string} the encoded params
     */
    stringify: (params: any) => string;
};
//# sourceMappingURL=utils.d.ts.map