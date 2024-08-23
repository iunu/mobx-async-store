import { toJS, makeObservable, runInAction, observable, action, transaction, extendObservable, computed } from 'mobx';
import { v1 } from 'uuid';
import dig from 'lodash/get';
import flattenDeep from 'lodash/flattenDeep';
import qs from 'qs';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import isObject from 'lodash/isObject';
import findLast from 'lodash/findLast';
import union from 'lodash/union';
import pick from 'lodash/pick';
import uniqBy from 'lodash/uniqBy';
import clone from 'lodash/clone';
import times from 'lodash/times';

/* global fetch */

const pending = {};
const counter = {};
const URL_MAX_LENGTH = 1024;
const ENCODED_COMMA = encodeURIComponent(',');

/**
 * Strips observers and returns a plain JS array
 *
 * @param {Array} array the array to transform
 * @returns {Array} the "clean array"
 */
const arrayType = (array) => toJS(array);

/**
 * Strips observers and returns a plain JS object
 *
 * @param {object} object the object to transform
 * @returns {object} the "clean object"
 */
const objectType = (object) => toJS(object);

/**
 * Coerces a string or date to a date
 *
 * @param {Date|string} date the date to transform
 * @returns {Date} a date
 */
const dateType = (date) => makeDate(date).toISOString();

/**
 * Coerces a value to a string
 *
 * @param {number|string} value the value to transform
 * @returns {string} a string
 */
const stringType = (value) => value.toString();

/**
 * Coerces a value to a number
 *
 * @param {number|string} value the value to transform
 * @returns {number} a number
 */
const numberType = (value) => Number(value);

/**
 * Increments a counter by 1
 *
 * @param {string} key the counter to increment
 * @returns {number} the current count
 */
const incrementor = (key) => () => {
  const count = (counter[key] || 0) + 1;
  counter[key] = count;
  return count
};

/**
 * Decreases a counter by 1
 *
 * @param {string} key the counter to decreases
 * @returns {number} the current count
 */
const decrementor = (key) => () => {
  const count = (counter[key] || 0) - 1;
  counter[key] = count;
  return count
};

/**
 * Build request url from base url, endpoint, query params, and ids.
 *
 * @param {string} baseUrl the base url
 * @param {string} endpoint the endpoint of the url
 * @param {object} queryParams query params to add
 * @param {string} id the id of the the model
 * @returns {string} formatted url string
 */
function requestUrl (baseUrl, endpoint, queryParams = {}, id) {
  let queryParamString = '';
  if (Object.keys(queryParams).length > 0) {
    queryParamString = `?${QueryString.stringify(queryParams)}`;
  }
  let idForPath = '';
  if (id) {
    idForPath = `/${id}`;
  }
  // Return full url
  return `${baseUrl}/${endpoint}${idForPath}${queryParamString}`
}

/**
 * Generates a temporary id to be used for reference in the store
 *
 * @returns {string} a uuidv1 string prefixed with `tmp`
 */
function newId () {
  return `tmp-${v1()}`
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
function combineRacedRequests (key, fn) {
  const incrementBlocked = incrementor(key);
  const decrementBlocked = decrementor(key);

  // keep track of the number of callers waiting for this promise to resolve
  incrementBlocked();

  // Add the current call to our pending list in case another request comes in
  // before it resolves. If there is a request already pending, we'll use the
  // existing one instead
  if (!pending[key]) { pending[key] = fn.call(); }

  return pending[key]
    .finally(() => {
      const count = decrementBlocked();
      // if there are no more callers waiting for this promise to resolve (i.e. if
      // this is the last one), we can remove the reference to the pending promise
      // allowing subsequent requests to proceed unblocked.
      if (count === 0) delete pending[key];
    })
    .then(
      // if there are other callers waiting for this request to resolve, clone the
      // response before returning so that we can re-use it for the remaining callers
      response => response.clone(),
      // Bubble the error up to be handled by the consuming code
      error => Promise.reject(error)
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
function fetchWithRetry (url, fetchOptions, attempts, delay) {
  const key = JSON.stringify({ url, fetchOptions });

  return combineRacedRequests(key, () => fetch(url, fetchOptions))
    .catch(error => {
      const attemptsRemaining = attempts - 1;
      if (!attemptsRemaining) { throw error }
      return new Promise((resolve) => setTimeout(resolve, delay))
        .then(() => fetchWithRetry(url, fetchOptions, attemptsRemaining, delay))
    })
}

/**
 * convert a value into a date, pass Date or Moment instances thru
 * untouched
 
 * @param {Date|string} value a date-like object
 * @returns {Date} a date object
 */
function makeDate (value) {
  if (value instanceof Date || value._isAMomentObject) return value
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
function walk (obj, iteratee, prefix) {
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
 
 * @param {object} a the first object
 * @param {object} b the second object
 * @returns {string[]} the path to differences
 */
function diff (a = {}, b = {}) {
  return flattenDeep(walk(a, (prevValue, path) => {
    const currValue = dig(b, path);
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
async function parseErrors (response, errorMessages) {
  let json = {};
  try {
    json = await response.json();
  } catch (error) {
    // server doesn't return a parsable response
    const statusError = {
      detail: errorMessages[response.status] || errorMessages.default,
      status: response.status
    };
    return [statusError]
  }

  if (!json.errors) {
    const statusError = {
      detail: errorMessages[response.status] || errorMessages.default,
      status: response.status
    };
    return [statusError]
  }

  if (!Array.isArray(json.errors)) {
    const statusError = {
      detail: 'Top level errors in response are not an array.',
      status: response.status
    };
    return [statusError]
  }

  return json.errors.map((error) => {
    // override or add the configured error message based on response status
    if (error.status && errorMessages[error.status]) {
      error.detail = errorMessages[error.status];
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
function parseErrorPointer (error = {}) {
  const regex = /\/data\/(?<index>\d+)?\/?attributes\/(?<key>.*)$/;
  const match = dig(error, 'source.pointer', '').match(regex);
  const { index = 0, key } = match?.groups || {};

  return {
    index: parseInt(index),
    key: key?.replace(/\//g, '.')
  }
}

/**
 * Splits an array of ids into a series of strings that can be used to form
 * queries that conform to a max length of URL_MAX_LENGTH. This is to prevent 414 errors.
 *
 * @param {Array} ids an array of ids that will be used in the string
 * @param {string} restOfUrl the additional text URL that will be passed to the server
 * @returns {string[]} an array of strings of ids
 */
function deriveIdQueryStrings (ids, restOfUrl = '') {
  const maxLength = URL_MAX_LENGTH - restOfUrl.length - encodeURIComponent('filter[ids]=,,').length;

  ids = ids.map(String);
  const firstId = ids.shift();

  const encodedIds = ids.reduce((nestedArray, id) => {
    const workingString = nestedArray[nestedArray.length - 1];
    const longerString = `${workingString}${ENCODED_COMMA}${id}`;

    if (longerString.length < maxLength) {
      nestedArray[nestedArray.length - 1] = longerString;
    } else {
      nestedArray.push(id);
    }

    return nestedArray
  }, [firstId]);

  return encodedIds.map(decodeURIComponent)
}

/**
 * An object with default `parse` and `stringify` functions from qs
 */
const QueryString = {
  /**
   * Parses a string and returns query params
   *
   * @param {string} str the url to parse
   * @returns {object} a query object
   */
  parse: (str) => qs.parse(str, { ignoreQueryPrefix: true }),
  /**
   * Changes an object to a string of query params
   *
   * @param {object} params object to stringify
   * @returns {string} the encoded params
   */
  stringify: (params) => qs.stringify(params, { arrayFormat: 'brackets' })
};

/**
 * Annotations for mobx observability. We can't use `makeAutoObservable` because we have subclasses.
 */
const mobxAnnotations$1 = {
    data: observable,
    lastResponseHeaders: observable,
    loadingStates: observable,
    loadedStates: observable,
    add: action,
    pickAttributes: action,
    pickRelationships: action,
    bulkSave: action,
    _bulkSave: action,
    bulkCreate: action,
    bulkUpdate: action,
    remove: action,
    getOne: action,
    fetchOne: action,
    findOne: action,
    getMany: action,
    fetchMany: action,
    findMany: action,
    fetchUrl: action,
    getAll: action,
    setLoadingState: action,
    deleteLoadingState: action,
    fetchAll: action,
    findAll: action,
    reset: action,
    init: action,
    initializeNetworkConfiguration: action,
    initializeModelIndex: action,
    initializeErrorMessages: action,
    fetch: action,
    getRecord: action,
    getRecords: action,
    getRecordsById: action,
    clearCache: action,
    getCachedRecord: action,
    getCachedRecords: action,
    getCachedIds: action,
    getCachedId: action,
    getKlass: action,
    createOrUpdateModelFromData: action,
    updateRecordFromData: action,
    createOrUpdateModelsFromData: action,
    createModelFromData: action,
    updateRecordsFromResponse: action
};
/**
 * Defines the Data Store class.
 */
class Store {
    /**
     * Initializer for Store class
     *
     * @param {object} options options to use for initialization
     */
    constructor(options) {
        /**
         * Stores data by type.
         * {
         *   todos: {
         *     records: observable.map(), // records by id
         *     cache: observable.map(), // cached ids by url
         *     meta: observable.map() // meta information by url
         *   }
         * }
         *
         * @type {object}
         * @default {}
         */
        this.data = {};
        /**
         * The most recent response headers according to settings specified as `headersOfInterest`
         *
         * @type {object}
         * @default {}
         */
        this.lastResponseHeaders = {};
        /**
         * Map of data that is in flight. This can be observed to know if a given type (or tag)
         * is still processing.
         * - Key is a tag that is either the model type or a custom value
         * - Falue is a Set of JSON-encoded objects with unique urls and queryParams
         *   Set[JSON.stringify({ url, type, queryParams, queryTag })]
         *
         * @type {Map}
         */
        this.loadingStates = new Map();
        /**
         * Map of data that has been loaded into the store. This can be observed to know if a given
         * type (or tag) has finished loading.
         * - Key is a tag that is either the model type or a custom value
         * - Falue is a Set of JSON-encoded objects with unique urls and queryParams
         *   Set[JSON.stringify({ url, type, queryParams, queryTag })]
         *
         * @type {Map}
         */
        this.loadedStates = new Map();
        /**
         * True if models in the store should stop taking snapshots. This is
         * useful when updating records without causing records to become
         * 'dirty', for example when initializing records using `add`
         *
         * @type {boolean}
         */
        this.pauseSnapshots = false;
        makeObservable(this, mobxAnnotations$1);
        this.init(options);
    }
    /**
     * Adds an instance or an array of instances to the store.
     * Adds the model to the type records index
     * Adds relationships explicitly. This is less efficient than adding via data if
     * there are also inverse relationships.
     *
     * ```
     * const todo = store.add('todos', { name: "A good thing to measure" })
     * todo.name
     * => "A good thing to measure"
     *
     * const todoArray = [{ name: "Another good thing to measure" }]
     * const [todo] = store.add('todos', [{ name: "Another good thing to measure" }])
     * todo.name
     * => "Another good thing to measure"
     * ```
     *
     * @param {string} type the model type
     * @param {object|Array} props the properties to use
     * @param {object} options currently supports `skipInitialization`
     * @returns {object|Array} the new record or records
     */
    add(type, props = {}, options) {
        if (props.constructor.name === 'Array') {
            return props.map((model) => this.add(type, model));
        }
        else {
            const id = String(props.id || newId());
            const attributes = cloneDeep(this.pickAttributes(props, type));
            const record = this.createModelFromData({ type, id, attributes }, options);
            // set separately to get inverses
            this.pauseSnapshots = true;
            Object.entries(this.pickRelationships(props, type)).forEach(([key, value]) => {
                record[key] = value;
            });
            this.pauseSnapshots = false;
            this.data[type].records.set(id, record);
            return record;
        }
    }
    /**
     * Given a set of properties and type, returns an object with only the properties
     * that are defined as attributes in the model for that type.
     * ```
     * properties = { title: 'Do laundry', unrelatedProperty: 'Do nothing' }
     * pickAttributes(properties, 'todos')
     * => { title: 'Do laundry' }
     * ```
     *
     * @param {object} properties a full list of properties that may or may not conform
     * @param {string} type the model type
     * @returns {object} the scrubbed attributes
     */
    pickAttributes(properties, type) {
        const attributeNames = Object.keys(this.getKlass(type).attributeDefinitions);
        return pick(properties, attributeNames);
    }
    /**
     * Given a set of properties and type, returns an object with only the properties
     * that are defined as relationships in the model for that type.
     * ```
     * properties = { notes: [note1, note2], category: cat1, title: 'Fold Laundry' }
     * pickRelationships(properties, 'todos')
     * => {
     *       notes: {
     *         data: [{ id: '1', type: 'notes' }, { id: '2', type: 'notes' }]
     *       },
     *       category: {
     *         data: { id: '1', type: 'categories' }
     *       }
     *    }
     * ```
     *
     * @param {object} properties a full list of properties that may or may not conform
     * @param {string} type the model type
     * @returns {object} the scrubbed relationships
     */
    pickRelationships(properties, type) {
        const definitions = this.getKlass(type).relationshipDefinitions;
        return definitions ? pick(properties, Object.keys(definitions)) : {};
    }
    /**
     * Saves a collection of records via a bulk-supported JSONApi endpoint.
     * All records need to be of the same type.
     *
     * @param {string} type the model type
     * @param {Array} records records that will be bulk saved
     * @param {object} options {queryParams, extensions}
     * @returns {Promise} the saved records
     */
    bulkSave(type, records, options = {}) {
        console.warn('bulkSave is deprecated. Please use either bulkCreate or bulkUpdate to be more precise about your request.');
        return this._bulkSave(type, records, options, 'POST');
    }
    /**
     * Saves a collection of records via a bulk-supported JSONApi endpoint.
     * All records need to be of the same type.
     * - gets url for record type
     * - converts records to an appropriate jsonapi attribute/relationship format
     * - builds a data payload
     * - builds the json api extension string
     * - sends request
     * - update records based on response
     *
     * @private
     * @param {string} type the model type
     * @param {Array} records records to be bulk saved
     * @param {object} options {queryParams, extensions}
     * @param {string} method http method
     * @returns {Promise} the saved records
     */
    _bulkSave(type, records, options = {}, method) {
        const { queryParams, extensions } = options;
        const url = this.fetchUrl(type, queryParams, null);
        const recordAttributes = records.map((record) => record.jsonapi(options));
        const body = JSON.stringify({ data: recordAttributes });
        const extensionStr = (extensions === null || extensions === void 0 ? void 0 : extensions.length)
            ? `ext="bulk,${extensions.join()}"`
            : 'ext="bulk"';
        const response = this.fetch(url, {
            headers: {
                ...this.defaultFetchOptions.headers,
                'Content-Type': `application/vnd.api+json; ${extensionStr}`
            },
            method,
            body
        });
        return this.updateRecordsFromResponse(response, records);
    }
    /**
     * Save a collection of new records via a bulk-supported JSONApi endpoint.
     * All records need to be of the same type and not have an existing id.
     *
     * @param {string} type the model type
     * @param {Array} records to be bulk created
     * @param {object} options {queryParams, extensions}
     * @returns {Promise} the created records
     */
    bulkCreate(type, records, options = {}) {
        if (records.some((record) => !record.isNew)) {
            throw new Error('Invariant violated: all records must be new records to perform a create');
        }
        return this._bulkSave(type, records, options, 'POST');
    }
    /**
     * Updates a collection of records via a bulk-supported JSONApi endpoint.
     * All records need to be of the same type and have an existing id.
     *
     * @param {string} type the model type
     * @param {Array} records array of records to be bulk updated
     * @param {object} options {queryParams, extensions}
     * @returns {Promise} the saved records
     */
    bulkUpdate(type, records, options = {}) {
        if (records.some((record) => record.isNew)) {
            throw new Error('Invariant violated: all records must have a persisted id to perform an update');
        }
        return this._bulkSave(type, records, options, 'PATCH');
    }
    /**
     * Removes a record from the store by deleting it from the
     * type's record map
     *
     * @param {string} type the model type
     * @param {string} id of record to remove
     */
    remove(type, id) {
        this.data[type].records.delete(String(id));
    }
    /**
     * Gets a record from the store. Will never fetch from the server.
     * If given queryParams, it will check the cache for the record.
     *
     * @param {string} type the type to find
     * @param {string} id the id of the record to get
     * @param {object} options { queryParams }
     * @returns {object} record
     */
    getOne(type, id, options = {}) {
        if (!id) {
            console.error(`No id given while calling 'getOne' on ${type}`);
            return undefined;
        }
        const { queryParams } = options;
        if (queryParams) {
            return this.getCachedRecord(type, id, queryParams);
        }
        else {
            return this.getRecord(type, id);
        }
    }
    /**
     * Fetches record by `id` from the server and returns a Promise.
     *
     * @async
     * @param {string} type the record type to fetch
     * @param {string} id the id of the record to fetch
     * @param {object} options { queryParams }
     * @returns {Promise} record result wrapped in a Promise
     */
    async fetchOne(type, id, options = {}) {
        if (!id) {
            console.error(`No id given while calling 'fetchOne' on ${type}`);
            return undefined;
        }
        const { queryParams } = options;
        const url = this.fetchUrl(type, queryParams, id);
        const state = this.setLoadingState({ ...options, type, id, url });
        const response = await this.fetch(url, { method: 'GET' });
        if (response.status === 200) {
            const { data, included } = await response.json();
            const record = this.createOrUpdateModelFromData(data);
            if (included) {
                this.createOrUpdateModelsFromData(included);
            }
            this.data[type].cache.set(url, [record.id]);
            this.deleteLoadingState(state);
            return record;
        }
        else {
            this.deleteLoadingState(state);
            const errors = await parseErrors(response, this.errorMessages);
            throw new Error(JSON.stringify(errors));
        }
    }
    /**
     * Finds a record by `id`, always returning a Promise.
     * If available in the store, it returns that record. Otherwise, it fetches the record from the server.
     *
     *   store.findOne('todos', 5)
     *   // fetch triggered
     *   => Promise(todo)
     *   store.findOne('todos', 5)
     *   // no fetch triggered
     *   => Promise(todo)
     *
     * @param {string} type the type to find
     * @param {string} id the id of the record to find
     * @param {object} options { queryParams }
     * @returns {Promise} a promise that will resolve to the record
     */
    findOne(type, id, options = {}) {
        if (!id) {
            console.error(`No id given while calling 'findOne' on ${type}`);
            return undefined;
        }
        const record = this.getOne(type, id, options);
        return (record === null || record === void 0 ? void 0 : record.id) ? record : this.fetchOne(type, id, options);
    }
    /**
     * Get all records with the given `type` and `ids` from the store. This will never fetch from the server.
     *
     * @param {string} type the type to get
     * @param {string} ids the ids of the records to get
     * @param {object} options { queryParams }
     * @returns {Array} array of records
     */
    getMany(type, ids, options = {}) {
        const idsToQuery = ids.slice().map(String);
        const records = this.getAll(type, options);
        return records.filter((record) => idsToQuery.includes(record.id));
    }
    /**
     * Fetch all records with the given `type` and `ids` from the server.
     *
     * @param {string} type the type to get
     * @param {string} ids the ids of the records to get
     * @param {object} options { queryParams }
     * @returns {Promise} Promise.resolve(records) or Promise.reject([Error: [{ detail, status }])
     */
    fetchMany(type, ids, options = {}) {
        const idsToQuery = ids.slice().map(String);
        const { queryParams = {}, queryTag } = options;
        queryParams.filter = queryParams.filter || {};
        const baseUrl = this.fetchUrl(type, queryParams);
        const idQueries = deriveIdQueryStrings(idsToQuery, baseUrl);
        const queries = idQueries.map((queryIds) => {
            const params = cloneDeep(queryParams);
            params.filter.ids = queryIds;
            return this.fetchAll(type, { queryParams: params, queryTag });
        });
        return Promise.all(queries)
            .then(records => [].concat(...records))
            .catch(err => Promise.reject(err));
    }
    /**
     * Finds multiple records of the given `type` with the given `ids` and returns them wrapped in a Promise.
     * If all records are in the store, it returns those.
     * If some records are in the store, it returns those plus fetches all other records.
     * Otherwise, it fetches all records from the server.
     *
     *   store.findMany('todos', [1, 2, 3])
     *   // fetch triggered
     *   => [todo1, todo2, todo3]
     *
     *   store.findMany('todos', [3, 2, 1])
     *   // no fetch triggered
     *   => [todo1, todo2, todo3]
     *
     * @param {string} type the type to find
     * @param {string} ids the ids of the records to find
     * @param {object} options { queryParams }
     * @returns {Promise} a promise that will resolve an array of records
     */
    async findMany(type, ids, options = {}) {
        ids = [...new Set(ids)].map(String);
        const existingRecords = this.getMany(type, ids, options);
        if (ids.length === existingRecords.length) {
            return existingRecords;
        }
        const existingIds = existingRecords.map(({ id }) => id);
        const idsToQuery = ids.filter((id) => !existingIds.includes(id));
        const { queryParams = {}, queryTag } = options;
        queryParams.filter = queryParams.filter || {};
        const baseUrl = this.fetchUrl(type, queryParams);
        const idQueries = deriveIdQueryStrings(idsToQuery, baseUrl);
        await Promise.all(idQueries.map((queryIds) => {
            queryParams.filter.ids = queryIds;
            return this.fetchAll(type, { queryParams, queryTag });
        }));
        return this.getMany(type, ids);
    }
    /**
     * Builds fetch url based on type, queryParams, id, and options
     *
     * @param {string} type the type to find
     * @param {object} queryParams params to be used in the fetch
     * @param {string} id a model id
     * @param {object} options options for fetching
     * @returns {string} a formatted url
     */
    fetchUrl(type, queryParams, id, options) {
        const { baseUrl } = this;
        const { endpoint } = this.getKlass(type);
        return requestUrl(baseUrl, endpoint, queryParams, id);
    }
    /**
     * Gets all records with the given `type` from the store. This will never fetch from the server.
     *
     * @param {string} type the type to find
     * @param {object} options options for fetching queryParams
     * @returns {Array} array of records
     */
    getAll(type, options = {}) {
        const { queryParams } = options;
        if (queryParams) {
            return this.getCachedRecords(type, queryParams);
        }
        else {
            return uniqBy(this.getRecords(type).filter((record) => record.initialized), 'id');
        }
    }
    /**
     * Sets a loading state when a fetch / deserialization is in flight. Loading states
     * are Sets inside of the `loadingStates` Map, so multiple loading states can be in flight
     * at the same time. An optional query tag can be passed to identify the particular query.
     *
     * const todos = store.fetchAll('todos', { queryTag: 'myTodos' })
     * store.loadingStates.get('myTodos')
     * => Set([JSON.stringify({ url, type, queryParams, queryTag })])
     *
     * @param {object} options options that can be used to build the loading state info
     * @param {string} options.url the url queried
     * @param {string} options.type the model type
     * @param {string} options.queryParams the query params used
     * @param {string} options.queryTag an optional tag to use in place of the type
     * @returns {object} the loading state that was added
     */
    setLoadingState({ url, type, queryParams, queryTag }) {
        queryTag = queryTag || type;
        const loadingStateInfo = { url, type, queryParams, queryTag };
        if (!this.loadingStates.get(queryTag)) {
            this.loadingStates.set(queryTag, new Set());
        }
        this.loadingStates.get(queryTag).add(JSON.stringify(loadingStateInfo));
        return loadingStateInfo;
    }
    /**
     * Removes a loading state. If that leaves an empty array for the map key in `loadingStates`,
     * will also delete the set. Also adds to loadedStates.
     *
     * @param {object} state the state to remove
     */
    deleteLoadingState(state) {
        const { loadingStates, loadedStates } = this;
        const { queryTag } = state;
        const encodedState = JSON.stringify(state);
        if (!loadedStates.get(queryTag)) {
            loadedStates.set(queryTag, new Set());
        }
        loadedStates.get(queryTag).add(encodedState);
        if (loadingStates.get(queryTag)) {
            loadingStates.get(queryTag).delete(encodedState);
            if (loadingStates.get(queryTag).size === 0) {
                loadingStates.delete(queryTag);
            }
        }
        else {
            console.warn(`no loadingState found for ${encodedState}`);
        }
    }
    /**
     * Finds all records with the given `type`. Always fetches from the server.
     *
     * @async
     * @param {string} type the type to find
     * @param {object} options query params and other options
     * @returns {Promise} Promise.resolve(records) or Promise.reject([Error: [{ detail, status }])
     */
    async fetchAll(type, options = {}) {
        const { queryParams } = options;
        const url = this.fetchUrl(type, queryParams);
        const state = this.setLoadingState({ ...options, type, url });
        const response = await this.fetch(url, { method: 'GET' });
        if (response.status === 200) {
            const { included, data, meta } = await response.json();
            let records;
            runInAction(() => {
                if (included) {
                    this.createOrUpdateModelsFromData(included);
                }
                records = this.createOrUpdateModelsFromData(data);
                const recordIds = records.map(({ id }) => id);
                this.data[type].cache.set(url, recordIds);
                this.deleteLoadingState(state);
            });
            if (meta) {
                records.meta = meta;
                this.data[type].meta.set(url, meta);
            }
            return records;
        }
        else {
            runInAction(() => {
                this.deleteLoadingState(state);
            });
            const errors = await parseErrors(response, this.errorMessages);
            throw new Error(JSON.stringify(errors));
        }
    }
    /**
     * Finds all records of the given `type`.
     * If any records from the given type from url are in the store, it returns those.
     * Otherwise, it fetches all records from the server.
     *
     *   store.findAll('todos')
     *   // fetch triggered
     *   => [todo1, todo2, todo3]
     *
     *   store.findAll('todos')
     *   // no fetch triggered
     *   => [todo1, todo2, todo3]
     *
     * Query params can be passed as part of the options hash.
     * The response will be cached, so the next time `findAll`
     * is called with identical params and values, the store will
     * first look for the local result.
     *
     *   store.findAll('todos', {
     *     queryParams: {
     *       filter: {
     *         start_time: '2020-06-01T00:00:00.000Z',
     *         end_time: '2020-06-02T00:00:00.000Z'
     *       }
     *     }
     *   })
     *
     * @param {string} type the type to find
     * @param {object} options { queryParams }
     * @returns {Promise} Promise.resolve(records) or Promise.reject([Error: [{ detail, status }])
     */
    findAll(type, options) {
        const records = this.getAll(type, options);
        if ((records === null || records === void 0 ? void 0 : records.length) > 0) {
            return Promise.resolve(records);
        }
        else {
            return this.fetchAll(type, options);
        }
    }
    /**
     * Clears the store of a given type, or clears all if no type given
     *
     *   store.reset('todos')
     *   // removes all todos from store
     *   store.reset()
     *   // clears store
     *
     * @param {string} type the model type
     */
    reset(type) {
        const types = type ? [type] : this.models.map(({ type }) => type);
        types.forEach((type) => {
            this.data[type] = {
                records: observable.map(),
                cache: observable.map(),
                meta: observable.map()
            };
        });
    }
    /**
     * Entry point for configuring the store
     *
     * @param {object} options passed to constructor
     */
    init(options = {}) {
        this.initializeNetworkConfiguration(options);
        this.initializeModelIndex(options.models);
        this.reset();
        this.initializeErrorMessages(options);
    }
    /**
     * Configures the store's network options
     *
     * @param {string} options the parameters that will be used to set up network requests
     * @param {string} options.baseUrl the API's root url
     * @param {object} options.defaultFetchOptions options that will be used when fetching
     * @param {Array} options.headersOfInterest an array of headers to watch
     * @param {object} options.retryOptions options for re-fetch attempts and interval
     */
    initializeNetworkConfiguration({ baseUrl = '', defaultFetchOptions = {}, headersOfInterest = [], retryOptions = { attempts: 1, delay: 0 } }) {
        this.baseUrl = baseUrl;
        this.defaultFetchOptions = defaultFetchOptions;
        this.headersOfInterest = headersOfInterest;
        this.retryOptions = retryOptions;
    }
    /**
     * Creates the key/value index of model types
     *
     * @param {object} models a fallback list of models
     */
    initializeModelIndex(models) {
        this.models = this.constructor.models || models;
    }
    /**
     * Configure the error messages returned from the store when API requests fail
     *
     * @param {object} options for initializing the store
     *   options for initializing error messages for different HTTP status codes
     */
    initializeErrorMessages(options = {}) {
        const errorMessages = { ...options.errorMessages };
        this.errorMessages = {
            default: 'Something went wrong.',
            ...errorMessages
        };
    }
    /**
     * Wrapper around fetch applies user defined fetch options
     *
     * @param {string} url the url to fetch
     * @param {object} options override options to use for fetching
     * @returns {Promise} the data from the server
     */
    async fetch(url, options = {}) {
        const { defaultFetchOptions, headersOfInterest, retryOptions } = this;
        const fetchOptions = { ...defaultFetchOptions, ...options };
        const { attempts, delay } = retryOptions;
        const response = await fetchWithRetry(url, fetchOptions, attempts, delay);
        if (headersOfInterest) {
            runInAction(() => {
                headersOfInterest.forEach(header => {
                    const value = response.headers.get(header);
                    // Only set if it has changed, to minimize observable changes
                    if (this.lastResponseHeaders[header] !== value)
                        this.lastResponseHeaders[header] = value;
                });
            });
        }
        return response;
    }
    /**
     * Gets individual record from store
     *
     * @param {string} type the model type
     * @param {number} id the model id
     * @returns {object} record
     */
    getRecord(type, id) {
        if (!this.data[type]) {
            throw new Error(`Could not find a collection for type '${type}'`);
        }
        const record = this.data[type].records.get(String(id));
        return (!record || record === 'undefined') ? undefined : record;
    }
    /**
     * Gets records for type of collection
     *
     * @param {string} type the model type
     * @returns {Array} array of objects
     */
    getRecords(type) {
        return Array.from(this.data[type].records.values());
    }
    /**
     * Get multiple records by id
     *
     * @param {string} type the model type
     * @param {Array} ids the ids to find
     * @returns {Array} array or records
     */
    getRecordsById(type, ids = []) {
        // NOTE: Is there a better way to do this?
        return ids
            .map((id) => this.getRecord(type, id))
            .filter((record) => record)
            .filter((record) => typeof record !== 'undefined');
    }
    /**
     * Clears the cache for provided record type
     *
     * @param {string} type the model type
     * @returns {Set} the cleared set
     */
    clearCache(type) {
        return this.data[type].cache.clear();
    }
    /**
     * Gets single from store based on cached query
     *
     * @param {string} type the model type
     * @param {string} id the model id
     * @param {object} queryParams the params to be searched
     * @returns {object} record
     */
    getCachedRecord(type, id, queryParams) {
        const cachedRecords = this.getCachedRecords(type, queryParams, id);
        return cachedRecords && cachedRecords[0];
    }
    /**
     * Gets records from store based on cached query and any previously requested ids
     *
     * @param {string} type type of records to get
     * @param {object} queryParams query params that were used for the query
     * @param {string} id optional param if only getting 1 cached record by id
     * @returns {Array} array of records
     */
    getCachedRecords(type, queryParams, id) {
        const url = this.fetchUrl(type, queryParams, id);
        const ids = this.getCachedIds(type, url);
        const meta = this.data[type].meta.get(url);
        const cachedRecords = this.getRecordsById(type, ids);
        if (meta)
            cachedRecords.meta = meta;
        return cachedRecords;
    }
    /**
     * Gets records from store based on cached query
     *
     * @param {string} type the model type
     * @param {string} url the url that was requested
     * @returns {Array} array of ids
     */
    getCachedIds(type, url) {
        const ids = this.data[type].cache.get(url);
        if (!ids)
            return [];
        const idsSet = new Set(toJS(ids));
        return Array.from(idsSet);
    }
    /**
     * Gets a record from store based on cached query
     *
     * @param {string} type the model type
     * @param {string} id the id to get
     * @returns {object} the cached object
     */
    getCachedId(type, id) {
        return this.data[type].cache.get(String(id));
    }
    /**
     * Helper to look up model class for type.
     *
     * @param {string} type the model type
     * @returns {Function} model constructor
     */
    getKlass(type) {
        return this.models.find((model) => model.type === type);
    }
    /**
     * Creates or updates a model
     *
     * @param {object} data the object will be used to update or create a model
     * @returns {object} the record
     */
    createOrUpdateModelFromData(data) {
        const { id, type } = data;
        let record = this.getRecord(type, id);
        if (record) {
            this.updateRecordFromData(record, data);
        }
        else {
            record = this.createModelFromData(data);
        }
        this.data[type].records.set(String(record.id), record);
        return record;
    }
    /**
     * Updates a record from a jsonapi hash
     *
     * @param {object} record a Model record
     * @param {object} data jsonapi-formatted data
     */
    updateRecordFromData(record, data) {
        const tmpId = record.id;
        const { id, type, attributes = {}, relationships = {} } = data;
        runInAction(() => {
            record.id = String(id);
            // records that are created as inverses are not initialized
            if (!record.initialized) {
                record.initialize(data);
            }
            Object.entries(attributes).forEach(([key, value]) => {
                record[key] = value;
            });
            Object.keys(relationships).forEach((relationshipName) => {
                if (relationships[relationshipName].included === false) {
                    delete relationships[relationshipName];
                }
            });
            record.relationships = { ...record.relationships, ...relationships };
        });
        record.isInFlight = false;
        record.takeSnapshot({ persisted: true });
        runInAction(() => {
            this.data[type].records.set(String(tmpId), record);
            this.data[type].records.set(String(id), record);
        });
    }
    /**
     * Create multiple models from an array of data. It will only build objects
     * with defined models, and ignore everything else in the data.
     *
     * @param {Array} data the array of jsonapi data
     * @returns {Array} an array of the models serialized
     */
    createOrUpdateModelsFromData(data) {
        return data.map((dataObject) => {
            if (this.data[dataObject.type]) {
                return this.createOrUpdateModelFromData(dataObject);
            }
            else {
                console.warn(`no type defined for ${dataObject.type}`);
                return null;
            }
        });
    }
    /**
     * Helper to create a new model
     *
     * @param {object} data id, type, attributes and relationships
     * @param {object} options currently supports `skipInitialization`
     * @returns {object} model instance
     */
    createModelFromData(data, options) {
        const { id, type, attributes = {}, relationships = {} } = data;
        const store = this;
        const ModelKlass = this.getKlass(type);
        if (!ModelKlass) {
            throw new Error(`Could not find a model for '${type}'`);
        }
        return new ModelKlass({ id, relationships, ...attributes }, store, options);
    }
    /**
     * Defines a resolution for an API call that will update a record or
     * set of records with the data returned from the API
     *
     * @param {Promise} promise a response from the API
     * @param {object|Array} records to be updated
     * @returns {Promise} a resolved promise after operations have been performed
     */
    updateRecordsFromResponse(promise, records) {
        // records may be a single record, if so wrap it in an array to make
        // iteration simpler
        const recordsArray = Array.isArray(records) ? records : [records];
        recordsArray.forEach((record) => {
            record.isInFlight = true;
        });
        return promise.then(async (response) => {
            const { status } = response;
            recordsArray.forEach((record) => {
                record.isInFlight = false;
            });
            if (status === 200 || status === 201) {
                const json = await response.json();
                const data = Array.isArray(json.data) ? json.data : [json.data];
                const { included } = json;
                if (data.length !== recordsArray.length) {
                    throw new Error('Invariant violated: API response data and records to update do not match');
                }
                recordsArray.forEach((record, i) => this.updateRecordFromData(record, data[i]));
                if (included) {
                    this.createOrUpdateModelsFromData(included);
                }
                // on success, return the original record(s).
                // again - this may be a single record so preserve the structure
                return records;
            }
            else {
                const errors = await parseErrors(response, this.errorMessages);
                runInAction(() => {
                    errors.forEach((error) => {
                        const { index, key } = parseErrorPointer(error);
                        if (key != null) {
                            // add the error to the record
                            const errors = recordsArray[index].errors[key] || [];
                            errors.push(error);
                            recordsArray[index].errors[key] = errors;
                        }
                    });
                });
                throw new Error(JSON.stringify(errors));
            }
        }, function (error) {
            // TODO: Handle error states correctly, including handling errors for multiple targets
            recordsArray.forEach((record) => {
                record.isInFlight = false;
            });
            recordsArray[0].errors = error;
            throw error;
        });
    }
}

/**
 * Gets only the relationships from one direction, ie 'toOne' or 'toMany'
 *
 * @param {object} model the model with the relationship
 * @param {string} direction the direction of the relationship
 */
const definitionsByDirection = action((model, direction) => {
    const { relationshipDefinitions = {} } = model;
    const definitionValues = Object.entries(relationshipDefinitions);
    return definitionValues.filter((definition) => definition[1].direction === direction);
});
/**
 * Takes the `toOne` definitions from a document type and creates getters and setters.
 * A getter finds a record from the store. The setter calls `setRelatedRecord`, which will
 * return an instance of a model and add it to the inverse relationship if necessary.
 * A definition will look something like this:
 *
 *    todo: {
 *      direction: 'toOne',
 *      inverse: {
 *        name: 'notes',
 *        direction: 'toMany'
 *      }
 *    }
 *
 * @param {object} record the record that will have the relationship
 * @param {object} store the data store
 * @param {object} toOneDefinitions an object with formatted definitions
 * @returns {object} an object with getters and setters based on the defintions
 */
const defineToOneRelationships = action((record, store, toOneDefinitions) => {
    return toOneDefinitions.reduce((object, [relationshipName, definition]) => {
        const { inverse } = definition;
        Object.defineProperty(object, relationshipName, {
            get() {
                var _a;
                const reference = (_a = record.relationships[relationshipName]) === null || _a === void 0 ? void 0 : _a.data;
                if (reference) {
                    return coerceDataToExistingRecord(store, reference);
                }
            },
            set(relatedReference) {
                return setRelatedRecord(relationshipName, record, relatedReference, store, inverse);
            }
        });
        return object;
    }, {});
});
/**
 * Takes the `toMany` definitions from a document type and creates getters and setters.
 * A getter finds records from the store, falling back to a lookup of the inverse records if
 * none are defined in the `relationships` hash.
 *
 * The setter will unset the previous inverse and set the current inverse.
 * Both return a `RelatedRecordsArray`, which is an array with added methods `add`, `remove`, and `replace`
 *
 * A definition will look like this:
 *
 *    categories: {
 *      direction: 'toMany',
 *      inverse: {
 *        name: 'organization',
 *        direction: 'toOne'
 *      }
 *    }
 *
 * @param {object} record the record that will have the relationship
 * @param {object} store the data store
 * @param {object} toManyDefinitions an object with formatted definitions
 * @returns {object} an object with getters and setters based on the defintions
 */
const defineToManyRelationships = action((record, store, toManyDefinitions) => {
    return toManyDefinitions.reduce((object, [relationshipName, definition]) => {
        const { inverse, types: relationshipTypes } = definition;
        Object.defineProperty(object, relationshipName, {
            get() {
                var _a;
                const references = (_a = record.relationships[relationshipName]) === null || _a === void 0 ? void 0 : _a.data;
                let relatedRecords;
                if (references) {
                    relatedRecords = references.filter((reference) => store.getKlass(reference.type)).map((reference) => coerceDataToExistingRecord(store, reference));
                }
                else if (inverse) {
                    const types = relationshipTypes || [relationshipName];
                    relatedRecords = types.map((type) => record.store.getAll(type)).flat().filter((potentialRecord) => {
                        var _a;
                        const reference = (_a = potentialRecord.relationships[inverse.name]) === null || _a === void 0 ? void 0 : _a.data;
                        return reference && (reference.type === record.type) && (String(reference.id) === record.id);
                    });
                }
                return new RelatedRecordsArray(record, relationshipName, relatedRecords);
            },
            set(relatedRecords) {
                var _a, _b, _c;
                const previousReferences = this.relationships[relationshipName];
                if (((_a = previousReferences === null || previousReferences === void 0 ? void 0 : previousReferences.data) === null || _a === void 0 ? void 0 : _a.length) === 0 && relatedRecords.length === 0) {
                    return this[relationshipName];
                }
                this.relationships[relationshipName] = { data: relatedRecords.map(({ id, type }) => ({ id, type })) };
                relatedRecords = relatedRecords.map((reference) => coerceDataToExistingRecord(store, reference));
                if ((inverse === null || inverse === void 0 ? void 0 : inverse.direction) === 'toOne') {
                    const { name: inverseName } = inverse;
                    const inferredType = ((_b = relatedRecords[0]) === null || _b === void 0 ? void 0 : _b.type) || ((_c = previousReferences === null || previousReferences === void 0 ? void 0 : previousReferences.data[0]) === null || _c === void 0 ? void 0 : _c.type);
                    const types = inverse.types || [inferredType];
                    const oldRelatedRecords = types.map((type) => record.store.getAll(type)).flat().filter((potentialRecord) => {
                        var _a;
                        const reference = (_a = potentialRecord.relationships[inverseName]) === null || _a === void 0 ? void 0 : _a.data;
                        return reference && (reference.type === record.type) && (reference.id === record.id);
                    });
                    oldRelatedRecords.forEach((oldRelatedRecord) => {
                        oldRelatedRecord.relationships[inverseName] = null;
                    });
                    relatedRecords.forEach((relatedRecord) => {
                        relatedRecord.relationships[inverseName] = { data: { id: record.id, type: record.type } };
                    });
                }
                record.takeSnapshot();
                return new RelatedRecordsArray(record, relationshipName, relatedRecords);
            }
        });
        return object;
    }, {});
});
/**
 * Sets a related record, as well as the inverse. Can also remove the record from a relationship.
 *
 * @param {string} relationshipName the name of the relationship
 * @param {object} record the object being set with a related record
 * @param {object} relatedRecord the related record
 * @param {object} store the store
 * @param {object} inverse the inverse object information
 * @returns {object} the related record
 */
const setRelatedRecord = action((relationshipName, record, relatedRecord, store, inverse) => {
    if (record == null) {
        return null;
    }
    if (relatedRecord != null) {
        relatedRecord = coerceDataToExistingRecord(store, relatedRecord);
        if ((inverse === null || inverse === void 0 ? void 0 : inverse.direction) === 'toOne') {
            setRelatedRecord(inverse.name, relatedRecord, record, store);
        }
        else if ((inverse === null || inverse === void 0 ? void 0 : inverse.direction) === 'toMany') {
            const previousRelatedRecord = record[relationshipName];
            removeRelatedRecord(inverse.name, previousRelatedRecord, record);
            addRelatedRecord(inverse.name, relatedRecord, record);
        }
        record.relationships[relationshipName] = { data: { id: relatedRecord.id, type: relatedRecord.type } };
    }
    else {
        if ((inverse === null || inverse === void 0 ? void 0 : inverse.direction) === 'toOne') {
            const previousRelatedRecord = record[relationshipName];
            setRelatedRecord(inverse.name, previousRelatedRecord, null, store);
        }
        else if ((inverse === null || inverse === void 0 ? void 0 : inverse.direction) === 'toMany') {
            const previousRelatedRecord = record[relationshipName];
            removeRelatedRecord(inverse.name, previousRelatedRecord, record);
        }
        record.relationships[relationshipName] = null;
    }
    record.takeSnapshot();
    return relatedRecord;
});
/**
 * Removes a record from an array of related records, removing both the object and the reference.
 *
 * @param {string} relationshipName the name of the relationship
 * @param {object} record the record with the relationship
 * @param {object} relatedRecord the related record being removed from the relationship
 * @param {object} inverse the definition of the inverse relationship
 * @returns {object} the removed record
 */
const removeRelatedRecord = action((relationshipName, record, relatedRecord, inverse) => {
    var _a;
    if (relatedRecord == null || record == null) {
        return relatedRecord;
    }
    const existingData = (((_a = record.relationships[relationshipName]) === null || _a === void 0 ? void 0 : _a.data) || []);
    const recordIndexToRemove = existingData.findIndex(({ id: comparedId, type: comparedType }) => {
        return comparedId === relatedRecord.id && comparedType === relatedRecord.type;
    });
    if (recordIndexToRemove > -1) {
        if ((inverse === null || inverse === void 0 ? void 0 : inverse.direction) === 'toOne') {
            setRelatedRecord(inverse.name, relatedRecord, null, record.store);
        }
        else if ((inverse === null || inverse === void 0 ? void 0 : inverse.direction) === 'toMany') {
            removeRelatedRecord(inverse.name, relatedRecord, record);
        }
        existingData.splice(recordIndexToRemove, 1);
    }
    record.takeSnapshot();
    return relatedRecord;
});
/**
 * Adds a record to a related array and updates the jsonapi reference in the relationships
 *
 * @param {string} relationshipName the name of the relationship
 * @param {object} record the record with the relationship
 * @param {object} relatedRecord the related record being added to the relationship
 * @param {object} inverse the definition of the inverse relationship
 * @returns {object} the added record
 */
const addRelatedRecord = action((relationshipName, record, relatedRecord, inverse) => {
    var _a, _b;
    if (Array.isArray(relatedRecord)) {
        return relatedRecord.map(singleRecord => addRelatedRecord(relationshipName, record, singleRecord, inverse));
    }
    if (relatedRecord == null || record == null || !((_a = record.store) === null || _a === void 0 ? void 0 : _a.getKlass(record.type))) {
        return relatedRecord;
    }
    const relatedRecordFromStore = coerceDataToExistingRecord(record.store, relatedRecord);
    if ((inverse === null || inverse === void 0 ? void 0 : inverse.direction) === 'toOne') {
        const previousRelatedRecord = relatedRecordFromStore[inverse.name];
        removeRelatedRecord(relationshipName, previousRelatedRecord, relatedRecordFromStore);
        setRelatedRecord(inverse.name, relatedRecordFromStore, record, record.store);
    }
    else if ((inverse === null || inverse === void 0 ? void 0 : inverse.direction) === 'toMany') {
        addRelatedRecord(inverse.name, relatedRecord, record);
    }
    if (!((_b = record.relationships[relationshipName]) === null || _b === void 0 ? void 0 : _b.data)) {
        record.relationships[relationshipName] = { data: [] };
    }
    const alreadyThere = record.relationships[relationshipName].data.some(({ id, type }) => id === relatedRecord.id && type === relatedRecord.type);
    if (!alreadyThere) {
        record.relationships[relationshipName].data.push({ id: relatedRecord.id, type: relatedRecord.type });
    }
    record.takeSnapshot();
    return relatedRecordFromStore;
});
/**
 * Takes any object with { id, type } properties and gets an object from the store with that structure.
 * Useful for allowing objects to be serialized in real time, saving overhead, while at the same time
 * always returning an object of the same type.
 *
 * @param {object} store the store with the reference
 * @param {object} record the potential record
 * @returns {object} the store object
 */
const coerceDataToExistingRecord = action((store, record) => {
    var _a;
    if (record == null || !((_a = store === null || store === void 0 ? void 0 : store.data) === null || _a === void 0 ? void 0 : _a[record.type])) {
        return null;
    }
    if (record && !(record instanceof Model$1)) {
        const { id, type } = record;
        record = store.getOne(type, id) || store.add(type, { id }, { skipInitialization: true });
    }
    return record;
});
/**
 * An array that allows for updating store references and relationships
 */
class RelatedRecordsArray extends Array {
    /**
     * Extends an array to create an enhanced array.
     *
     * @param {object} record the record with the referenced array
     * @param {string} property the property on the record that references the array
     * @param {Array} array the array to extend
     */
    constructor(record, property, array = []) {
        super(...array);
        /**
         * Adds a record to the array, and updates references in the store, as well as inverse references
         *
         * @param {object} relatedRecord the record to add to the array
         * @returns {object} a model record reflecting the original relatedRecord
         */
        this.add = (relatedRecord) => {
            const { inverse, record, property } = this;
            return addRelatedRecord(property, record, relatedRecord, inverse);
        };
        /**
         * Removes a record from the array, and updates references in the store, as well as inverse references
         *
         * @param {object} relatedRecord the record to remove from the array
         * @returns {object} a model record reflecting the original relatedRecord
         */
        this.remove = (relatedRecord) => {
            const { inverse, record, property } = this;
            return removeRelatedRecord(property, record, relatedRecord, inverse);
        };
        /**
         * Replaces the internal array of objects with a new one, including inverse relationships
         *
         * @param {Array} array the array of objects that will replace the existing one
         * @returns {Array} this internal array
         */
        this.replace = (array = []) => {
            const { inverse, record, property, store } = this;
            let newRecords;
            transaction(() => {
                if ((inverse === null || inverse === void 0 ? void 0 : inverse.direction) === 'toOne') {
                    this.forEach((relatedRecord) => {
                        setRelatedRecord(inverse.name, relatedRecord, null, store);
                    });
                }
                else if ((inverse === null || inverse === void 0 ? void 0 : inverse.direction) === 'toMany') {
                    this.forEach((relatedRecord) => {
                        removeRelatedRecord(inverse.name, relatedRecord, record);
                    });
                }
                record.relationships[property] = { data: [] };
                newRecords = array.map((relatedRecord) => addRelatedRecord(property, record, relatedRecord, inverse));
            });
            return newRecords;
        };
        this.property = property;
        this.record = record;
        this.store = record.store;
        this.inverse = record.relationshipDefinitions[this.property].inverse;
    }
    /* eslint-disable */
    /*
     * This method is used by Array internals to decide
     * which class to use for resulting derived objects from array manipulation methods
     * such as `map` or `filter`
     *
     * Without this, `RelatedRecordsArray.map` would return a `RelatedRecordsArray` instance
     * but such derived arrays should not maintain the behavior of the source `RelatedRecordsArray`
     *
     * For more details, see:
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/species
     */
    static get [Symbol.species]() {
        return Array;
    }
}

/**
 * Maps the passed-in property names through and runs validations against those properties
 *
 * @param {object} model the model to check
 * @param {Array} propertyNames the names of the model properties to check
 * @param {object} propertyDefinitions a hash map containing validators by property
 * @returns {Array} an array of booleans representing results of validations
 */
function validateProperties(model, propertyNames, propertyDefinitions) {
    return propertyNames.map((propertyName) => {
        if (propertyDefinitions) {
            const { validator } = propertyDefinitions[propertyName];
            if (!validator)
                return true;
            const validationResult = validator(model[propertyName], model, propertyName);
            if (!validationResult.isValid) {
                model.errors[propertyName] = validationResult.errors;
            }
            return validationResult.isValid;
        }
        else
            return true;
    });
}
/**
 * Coerces all ids to strings
 *
 * @param {object} object object to coerce
 */
function stringifyIds(object) {
    Object.keys(object).forEach(key => {
        const property = object[key];
        if (typeof property === 'object') {
            if (property.id) {
                property.id = String(property.id);
            }
            stringifyIds(property);
        }
    });
}
/**
 * Annotations for mobx observability. We can't use `makeAutoObservable` because we have subclasses.
 */
const mobxAnnotations = {
    isDirty: computed,
    dirtyAttributes: computed,
    dirtyRelationships: computed,
    hasUnpersistedChanges: computed,
    snapshot: computed,
    previousSnapshot: computed,
    persistedOrFirstSnapshot: computed,
    type: computed,
    attributes: computed,
    attributeDefinitions: computed,
    relationshipDefinitions: computed,
    hasErrors: computed,
    attributeNames: computed,
    relationshipNames: computed,
    defaultAttributes: computed,
    isInFlight: observable,
    errors: observable,
    relationships: observable,
    _snapshots: observable,
    initializeAttributes: action,
    initializeRelationships: action,
    rollback: action,
    undo: action,
    save: action,
    reload: action,
    validate: action,
    destroy: action,
    takeSnapshot: action,
    clearSnapshots: action,
    _applySnapshot: action,
    errorForKey: action,
    jsonapi: action,
    updateAttributes: action,
    isSame: action
};
/**
 * The base class for data records
 */
class Model {
    /**
     * - Sets the store and id.
     * - Sets jsonapi reference to relationships as a hash.
     * - Makes the predefined getters, setters and attributes observable
     * - Initializes relationships and sets attributes
     * - Takes a snapshot of the initial state
     *
     * @param {object} initialProperties attributes and relationships that will be set
     * @param {object} store the store that will define relationships
     * @param {object} options supports `skipInitialization`
     */
    constructor(initialProperties = {}, store = new Store({ models: [this.constructor] }), options = {}) {
        /**
         * True if model attributes and relationships have been initialized
         *
         * @type {boolean}
         */
        this.initialized = false;
        /**
         * The reference to relationships. Is observed and used to provide references to the objects themselves
         *
         * todo.relationships
         * => { tag: { data: { type: 'tags', id: '1' } } }
         * todo.tag
         * => Tag with id: '1'
         *
         * @type {object}
         */
        this.relationships = {};
        /**
         * True if the instance is coming from / going to the server
         * ```
         * todo = store.find('todos', 5)
         * // fetch started
         * todo.isInFlight
         * => true
         * // fetch finished
         * todo.isInFlight
         * => false
         * ```
         *
         * @type {boolean}
         * @default false
         */
        this.isInFlight = false;
        /**
         * A hash of errors from the server
         * ```
         * todo = store.find('todos', 5)
         * todo.errors
         * => { authorization: "You do not have access to this resource" }
         * ```
         *
         * @type {object}
         * @default {}
         */
        this.errors = {};
        /**
         * a list of snapshots that have been taken since the record was either last persisted or since it was instantiated
         *
         * @type {Array}
         * @default []
         */
        this._snapshots = [];
        const { id, relationships } = initialProperties;
        this.store = store;
        this.id = id != null ? String(id) : id;
        this.relationships = relationships;
        if (!options.skipInitialization) {
            this.initialize(initialProperties);
        }
    }
    /**
     * True if the instance has been modified from its persisted state
     *
     * NOTE that isDirty does _NOT_ track changes to the related objects
     * but it _does_ track changes to the relationships themselves.
     *
     * For example, adding or removing a related object will mark this record as dirty,
     * but changing a related object's properties will not mark this record as dirty.
     *
     * The caller is reponsible for asking related objects about their
     * own dirty state.
     *
     * ```
     * todo = store.add('todos', { name: 'A good thing to measure' })
     * todo.isDirty
     * => true
     * todo.name
     * => "A good thing to measure"
     * await todo.save()
     * todo.isDirty
     * => false
     * todo.name = "Another good thing to measure"
     * todo.isDirty
     * => true
     * await todo.save()
     * todo.isDirty
     * => false
     * ```
     *
     * @type {boolean}
     */
    get isDirty() {
        return this.dirtyAttributes.size > 0 || this.dirtyRelationships.size > 0;
    }
    /**
     * A list of any attribute paths which have been changed since the previous snapshot
     *
     * const todo = new Todo({ title: 'Buy Milk' })
     * todo.dirtyAttributes
     * => Set()
     * todo.title = 'Buy Cheese'
     * todo.dirtyAttributes
     * => Set('title')
     * todo.options = { variety: 'Cheddar' }
     * todo.dirtyAttributes
     * => Set('title', 'options.variety')
     *
     * @type {Set}
     * @readonly
     */
    get dirtyAttributes() {
        if (this._snapshots.length === 0) {
            return [];
        }
        return Object.keys(this.attributes).reduce((dirtyAccumulator, attr) => {
            const currentValue = this.attributes[attr];
            const previousValue = this.previousSnapshot.attributes[attr];
            if (isObject(currentValue)) {
                const currentToPreviousDiff = diff(currentValue, previousValue);
                const previousToCurrentDiff = diff(previousValue, currentValue);
                union(currentToPreviousDiff, previousToCurrentDiff).forEach((property) => {
                    dirtyAccumulator.add(`${attr}.${property}`);
                });
            }
            else if (!isEqual(previousValue, currentValue)) {
                dirtyAccumulator.add(attr);
            }
            return dirtyAccumulator;
        }, new Set());
    }
    /**
     * A list of any relationship paths which have been changed since the previous snapshot
     * We check changes to both ids and types in case there are polymorphic relationships
     *
     * const todo = new Todo({ title: 'Buy Milk' })
     * todo.dirtyRelationships
     * => Set()
     * todo.note = note1
     * todo.dirtyRelationships
     * => Set('note')
     *
     * @type {Set}
     */
    get dirtyRelationships() {
        if (this._snapshots.length === 0 || !this.relationshipDefinitions) {
            return new Set();
        }
        const { previousSnapshot, persistedOrFirstSnapshot, relationshipDefinitions } = this;
        return Object.entries(relationshipDefinitions || {}).reduce((relationshipSet, [relationshipName, definition]) => {
            var _a, _b, _c, _d;
            const { direction } = definition;
            let firstData = (_b = (_a = persistedOrFirstSnapshot.relationships) === null || _a === void 0 ? void 0 : _a[relationshipName]) === null || _b === void 0 ? void 0 : _b.data;
            let currentData = (_d = (_c = previousSnapshot.relationships) === null || _c === void 0 ? void 0 : _c[relationshipName]) === null || _d === void 0 ? void 0 : _d.data;
            let isDifferent;
            if (direction === 'toMany') {
                firstData = firstData || [];
                currentData = currentData || [];
                isDifferent = firstData.length !== (currentData === null || currentData === void 0 ? void 0 : currentData.length) || firstData.some(({ id, type }, i) => currentData[i].id !== id || currentData[i].type !== type);
            }
            else {
                isDifferent = (firstData === null || firstData === void 0 ? void 0 : firstData.id) !== (currentData === null || currentData === void 0 ? void 0 : currentData.id) || (firstData === null || firstData === void 0 ? void 0 : firstData.type) !== (currentData === null || currentData === void 0 ? void 0 : currentData.type);
            }
            if (isDifferent) {
                relationshipSet.add(relationshipName);
            }
            return relationshipSet;
        }, new Set());
    }
    /**
     * Have any changes been made since this record was last persisted?
     *
     * @type {boolean}
     */
    get hasUnpersistedChanges() {
        return this.isDirty || !this.previousSnapshot.persisted;
    }
    /**
     * True if the model has not been sent to the store
     *
     * @type {boolean}
     */
    get isNew() {
        const { id } = this;
        if (!id)
            return true;
        if (String(id).indexOf('tmp') === -1)
            return false;
        return true;
    }
    /**
     * Initializes observable attributes and relationships
     *
     * @param {object} initialProperties attributes
     */
    initialize(initialProperties) {
        const { ...attributes } = initialProperties;
        makeObservable(this, mobxAnnotations);
        this.initializeAttributes(attributes);
        this.initializeRelationships();
        this.takeSnapshot({ persisted: !this.isNew });
        this.initialized = true;
    }
    /**
     * Sets initial attribute properties
     *
     * @param {object} overrides data that will be set over defaults
     */
    initializeAttributes(overrides) {
        const { attributeDefinitions } = this;
        const attributes = Object.keys(attributeDefinitions).reduce((object, attributeName) => {
            object[attributeName] = overrides[attributeName] === undefined ? attributeDefinitions[attributeName].defaultValue : overrides[attributeName];
            return object;
        }, {});
        extendObservable(this, attributes);
    }
    /**
     * Initializes relationships based on the `relationships` hash.
     */
    initializeRelationships() {
        const { store } = this;
        const toOneDefinitions = definitionsByDirection(this, 'toOne');
        const toManyDefinitions = definitionsByDirection(this, 'toMany');
        const toOneRelationships = defineToOneRelationships(this, store, toOneDefinitions);
        const toManyRelationships = defineToManyRelationships(this, store, toManyDefinitions);
        extendObservable(this, toOneRelationships);
        extendObservable(this, toManyRelationships);
    }
    /**
     * restores data to its last persisted state or the oldest snapshot
     * state if the model was never persisted
     * ```
     * todo = store.find('todos', 5)
     * todo.name
     * => "A good thing to measure"
     * todo.name = "Another good thing to measure"
     * todo.rollback()
     * todo.name
     * => "A good thing to measure"
     * ```
     */
    rollback() {
        this._applySnapshot(this.persistedOrFirstSnapshot);
        this.takeSnapshot({ persisted: true });
    }
    /**
     * restores data to its last state
     * state if the model was never persisted
     */
    undo() {
        this._applySnapshot(this.previousSnapshot);
    }
    /**
     * creates or updates a record.
     *
     * @param {object} options query params and sparse fields to use
     * @returns {Promise} the persisted record
     */
    async save(options = {}) {
        if (!options.skip_validations && !this.validate(options)) {
            const errorString = JSON.stringify(this.errors);
            return Promise.reject(new Error(errorString));
        }
        const { queryParams, relationships, attributes } = options;
        const { constructor, id, isNew, dirtyRelationships, dirtyAttributes } = this;
        const hasAttributesToSave = dirtyAttributes.size > 0;
        const hasRelationshipsToSave = relationships && dirtyRelationships.size > 0;
        if (!isNew && !hasAttributesToSave && !hasRelationshipsToSave) {
            return Promise.resolve(this);
        }
        let requestId = id;
        let method = 'PATCH';
        if (isNew) {
            method = 'POST';
            requestId = null;
        }
        const url = this.store.fetchUrl(constructor.type, queryParams, requestId);
        const body = JSON.stringify({
            data: this.jsonapi({ relationships, attributes })
        });
        if (relationships) {
            relationships.forEach((rel) => {
                if (Array.isArray(this[rel])) {
                    this[rel].forEach((item, i) => {
                        if (item && item.isNew) {
                            throw new Error(`Invariant violated: tried to save a relationship to an unpersisted record: "${rel}[${i}]"`);
                        }
                    });
                }
                else if (this[rel] && this[rel].isNew) {
                    throw new Error(`Invariant violated: tried to save a relationship to an unpersisted record: "${rel}"`);
                }
            });
        }
        const response = this.store.fetch(url, { method, body });
        const result = await this.store.updateRecordsFromResponse(response, this);
        this.takeSnapshot({ persisted: true });
        return result;
    }
    /**
     * Replaces the record with the canonical version from the server.
     *
     * @param {object} options props to use for the fetch
     * @returns {Promise} the refreshed record
     */
    reload(options = {}) {
        const { constructor, id, isNew } = this;
        if (isNew) {
            return this.rollback();
        }
        else {
            return this.store.fetchOne(constructor.type, id, options);
        }
    }
    /**
     * Checks all validations, adding errors where necessary and returning `false` if any are not valid
     * Default is to check all validations, but they can be selectively run via options:
     *  - attributes - an array of names of attributes to validate
     *  - relationships - an array of names of relationships to validate
     *
     * @param {object} options attributes and relationships to use for the validation
     * @returns {boolean} key / value of attributes and relationship validations
     */
    validate(options = {}) {
        this.errors = {};
        const { attributeDefinitions, relationshipDefinitions } = this;
        const attributeNames = options.attributes || Object.keys(attributeDefinitions);
        const relationshipNames = options.relationships || this.relationshipNames;
        const validAttributes = validateProperties(this, attributeNames, attributeDefinitions);
        const validRelationships = validateProperties(this, relationshipNames, relationshipDefinitions);
        return validAttributes.concat(validRelationships).every(value => value);
    }
    /**
     * deletes a record from the store and server
     *
     * @param {object} options params and option to skip removal from the store
     * @returns {Promise} an empty promise with any success/error status
     */
    destroy(options = {}) {
        const { constructor: { type }, id, snapshot, isNew } = this;
        if (isNew) {
            this.store.remove(type, id);
            return snapshot;
        }
        const { params = {}, skipRemove = false } = options;
        const url = this.store.fetchUrl(type, params, id);
        this.isInFlight = true;
        const promise = this.store.fetch(url, { method: 'DELETE' });
        const record = this;
        record.errors = {};
        return promise.then(async function (response) {
            var _a;
            record.isInFlight = false;
            if ([200, 202, 204].includes(response.status)) {
                if (!skipRemove) {
                    record.store.remove(type, id);
                }
                let json;
                try {
                    json = await response.json();
                    if ((_a = json.data) === null || _a === void 0 ? void 0 : _a.attributes) {
                        runInAction(() => {
                            Object.entries(json.data.attributes).forEach(([key, value]) => {
                                record[key] = value;
                            });
                        });
                    }
                }
                catch (err) {
                    console.log(err);
                    // It is text, do you text handling here
                }
                // NOTE: If deleting a record changes other related model
                // You can return then in the delete response
                if (json && json.included) {
                    record.store.createOrUpdateModelsFromData(json.included);
                }
                return record;
            }
            else {
                const errors = await parseErrors(response, record.store.errorMessages);
                throw new Error(JSON.stringify(errors));
            }
        }, function (error) {
            // TODO: Handle error states correctly
            record.isInFlight = false;
            throw error;
        });
    }
    /* Private Methods */
    /**
     * The current state of defined attributes and relationships of the instance
     * Really just an alias for attributes
     * ```
     * todo = store.find('todos', 5)
     * todo.title
     * => "Buy the eggs"
     * snapshot = todo.snapshot
     * todo.title = "Buy the eggs and bacon"
     * snapshot.title
     * => "Buy the eggs and bacon"
     * ```
     *
     * @type {object}
     */
    get snapshot() {
        return {
            attributes: this.attributes,
            relationships: toJS(this.relationships)
        };
    }
    /**
     * the latest snapshot
     *
     * @type {object}
     */
    get previousSnapshot() {
        const length = this._snapshots.length;
        // if (length === 0) throw new Error('Invariant violated: model has no snapshots')
        return this._snapshots[length - 1];
    }
    /**
     * the latest persisted snapshot or the first snapshot if the model was never persisted
     *
     * @type {object}
     */
    get persistedOrFirstSnapshot() {
        return findLast(this._snapshots, (ss) => ss.persisted) || this._snapshots[0];
    }
    /**
     * take a snapshot of the current model state.
     * if persisted, clear the stack and push this snapshot to the top
     * if not persisted, push this snapshot to the top of the stack
     *
     * @param {object} options options to use to set the persisted state
     */
    takeSnapshot(options = {}) {
        const { store, _snapshots } = this;
        if (store.pauseSnapshots && _snapshots.length > 0) {
            return;
        }
        const persisted = options.persisted || false;
        const properties = cloneDeep(pick(this, ['attributes', 'relationships']));
        _snapshots.push({
            persisted,
            ...properties
        });
    }
    /**
     * Sets `_snapshots` to an empty array
     */
    clearSnapshots() {
        this._snapshots = [];
    }
    /**
     * set the current attributes and relationships to the attributes
     * and relationships of the snapshot to be applied. also reset errors
     *
     * @param {object} snapshot the snapshot to apply
     */
    _applySnapshot(snapshot) {
        if (!snapshot)
            throw new Error('Invariant violated: tried to apply undefined snapshot');
        runInAction(() => {
            this.attributeNames.forEach((key) => {
                this[key] = snapshot.attributes[key];
            });
            this.relationships = snapshot.relationships;
            this.errors = {};
        });
    }
    /**
     * shortcut to get the static
     *
     * @type {string}
     */
    get type() {
        return this.constructor.type;
    }
    /**
     * current attributes of record
     *
     * @type {object}
     */
    get attributes() {
        return this.attributeNames.reduce((attributes, key) => {
            const value = toJS(this[key]);
            if (value != null) {
                attributes[key] = value;
            }
            return attributes;
        }, {});
    }
    /**
     * Getter find the attribute definition for the model type.
     *
     * @type {object}
     */
    get attributeDefinitions() {
        return this.constructor.attributeDefinitions || {};
    }
    /**
     * Getter find the relationship definitions for the model type.
     *
     * @type {object}
     */
    get relationshipDefinitions() {
        return this.constructor.relationshipDefinitions || {};
    }
    /**
     * Getter to check if the record has errors.
     *
     * @type {boolean}
     */
    get hasErrors() {
        return Object.keys(this.errors).length > 0;
    }
    /**
     * Getter to check if the record has errors.
     *
     * @param {string} key the key to check
     * @returns {string} the error text
     */
    errorForKey(key) {
        return this.errors[key];
    }
    /**
     * Getter to just get the names of a records attributes.
     *
     * @returns {Array} the keys of the attribute definitions
     */
    get attributeNames() {
        return Object.keys(this.attributeDefinitions);
    }
    /**
     * Getter to just get the names of a records relationships.
     *
     * @returns {Array} the keys of the relationship definitions
     */
    get relationshipNames() {
        return Object.keys(this.relationshipDefinitions);
    }
    /**
     * getter method to get the default attributes
     *
     * @returns {object} key / value of attributes and defaults
     */
    get defaultAttributes() {
        const { attributeDefinitions } = this;
        return this.attributeNames.reduce((defaults, key) => {
            const { defaultValue } = attributeDefinitions[key];
            defaults[key] = defaultValue;
            return defaults;
        }, {
            relationships: {}
        });
    }
    /**
     * getter method to get data in api compliance format
     * TODO: Figure out how to handle unpersisted ids
     *
     * @param {object} options serialization options
     * @returns {object} data in JSON::API format
     */
    jsonapi(options = {}) {
        const { attributeDefinitions, attributeNames, meta, id, constructor: { type } } = this;
        let filteredAttributeNames = attributeNames;
        let filteredRelationshipNames = [];
        if (options.attributes) {
            filteredAttributeNames = attributeNames
                .filter(name => options.attributes.includes(name));
        }
        const attributes = filteredAttributeNames.reduce((attrs, key) => {
            let value = this[key];
            if (value) {
                if (attributeDefinitions[key].transformer) {
                    value = attributeDefinitions[key].transformer(value);
                }
            }
            attrs[key] = value;
            return attrs;
        }, {});
        const data = {
            type,
            attributes,
            id: String(id)
        };
        if (options.relationships) {
            filteredRelationshipNames = this.relationshipNames
                .filter(name => options.relationships.includes(name) && this.relationships[name]);
            const relationships = filteredRelationshipNames.reduce((rels, key) => {
                rels[key] = toJS(this.relationships[key]);
                stringifyIds(rels[key]);
                return rels;
            }, {});
            data.relationships = relationships;
        }
        if (meta) {
            data.meta = meta;
        }
        if (String(id).match(/tmp/)) {
            delete data.id;
        }
        return data;
    }
    /**
     * Updates attributes of this record via a key / value hash
     *
     * @param {object} attributes the attributes to update
     */
    updateAttributes(attributes) {
        const { attributeNames } = this;
        const validAttributes = pick(attributes, attributeNames);
        Object.entries(validAttributes).forEach(([key, value]) => (this[key] = value));
    }
    /**
     * Comparison by identity
     * returns `true` if this object has the same type and id as the
     * "other" object, ignores differences in attrs and relationships
     *
     * @param {object} other other model object
     * @returns {boolean} if this object has the same type and id
     */
    isSame(other) {
        if (!other)
            return false;
        return this.type === other.type && this.id === other.id;
    }
}
/**
 * The type of the model. Defined on the class. Defaults to the underscored version of the class name
 * (eg 'calendar_events').
 *
 * @type {string}
 * @static
 */
Model.type = '';
/**
 * The canonical path to the resource on the server. Defined on the class.
 * Defaults to the underscored version of the class name
 *
 * @type {string}
 * @static
 */
Model.endpoint = '';
var Model$1 = Model;

/**
 * A class to create and use factories
 *
 * @class FactoryFarm
 */
class FactoryFarm {
    /**
     * Sets up the store, and a private property to make it apparent the store is used
     * for a FactoryFarm
     *
     * @param {object} store the store to use under the hood
     */
    constructor(store) {
        /**
         * A hash of available factories. A factory is an object with a structure like:
         * { name, type, attributes, relationships }.
         *
         * @type {object}
         */
        this.factories = {};
        /**
         * A hash of singleton objects.
         *
         * @type {object}
         */
        this.singletons = {};
        /**
         * Alias for `this.store.add`
         *
         * @param  {...any} params attributes and relationships to be added to the store
         * @returns {*} object or array
         */
        this.add = (...params) => this.store.add(...params);
        /**
         * Verifies that the requested factory exists
         *
         * @param {string} factoryName the name of the factory
         * @private
         */
        this._verifyFactory = (factoryName) => {
            const factory = this.factories[factoryName];
            if (!factory) {
                throw new Error(`Factory ${factoryName} does not exist`);
            }
        };
        /**
         * Builds model properties that will be used for creating models. Since factories can use
         * functions to define relationships, it loops through properties and attempts to execute any functions.
         *
         * @param {string} factoryName the name of the factory
         * @param {object} properties properties to build the object
         * @param {number} index a number that can be used to build the object
         * @returns {object} an object of properties to be used.
         * @private
         */
        this._buildModel = (factoryName, properties, index = 0) => {
            properties = clone(properties);
            Object.keys(properties).forEach((key) => {
                if (Array.isArray(properties[key])) {
                    properties[key] = properties[key].map((propDefinition) => {
                        return this._callPropertyDefinition(propDefinition, index, factoryName, properties);
                    });
                }
                else {
                    properties[key] = this._callPropertyDefinition(properties[key], index, factoryName, properties);
                }
            });
            return properties;
        };
        /**
         * If `definition` is a function, calls the function. Otherwise, returns the definition.
         *
         * @param {*} definition a property or function
         * @param {number} index an index to be passed to the called function
         * @param {string} factoryName the name of the factory
         * @param {object} properties properties to be passed to the executed function
         * @returns {*} a definition or executed function
         */
        this._callPropertyDefinition = (definition, index, factoryName, properties) => {
            return typeof definition === 'function' ? definition.call(this, index, factoryName, properties) : definition;
        };
        this.store = store || new Store();
        this.store.__usedForFactoryFarm__ = true;
    }
    /**
     * Allows easy building of Store objects, including relationships.
     * Takes parameters `attributes` and `relationships` to use for building.
     *
     *   const batchAction = store.build('cropBatchAction')
     *   store.build('basilBatch', {
     *     arbitrary_id: 'new_id'
     *     zone: 'bay1',
     *     crop_batch_actions: [
     *       batchAction,
     *       store.build('batchAction')
     *     ]
     *   })
     *
     * @param {string} factoryName the name of the factory to use
     * @param {object} overrideOptions overrides for the factory
     * @param {number} numberOfRecords optional number of models to build
     * @returns {object} instance of an Store model
     */
    build(factoryName, overrideOptions = {}, numberOfRecords = 1) {
        const { store, factories, singletons, _verifyFactory, _buildModel } = this;
        _verifyFactory(factoryName);
        const { type, ...properties } = factories[factoryName];
        const newModelProperties = {
            /**
             * Increments the id for the type based on ids already present
             *
             * @param {number} i the number that will be used to create an id
             * @returns {number} an incremented number related to the latest id in the store
             */
            id: (i) => String(store.getAll(type).length + i + 1),
            ...properties,
            ...overrideOptions
        };
        let identity = false;
        if (newModelProperties.identity) {
            if (typeof newModelProperties.identity === 'string') {
                identity = newModelProperties.identity;
            }
            else {
                identity = factoryName;
            }
            delete newModelProperties.identity;
            if (numberOfRecords === 1) {
                if (singletons[identity])
                    return singletons[identity];
            }
        }
        let addProperties;
        if (numberOfRecords > 1) {
            addProperties = times(numberOfRecords, (i) => _buildModel(factoryName, newModelProperties, i));
        }
        else {
            addProperties = _buildModel(factoryName, newModelProperties);
        }
        const results = store.add(type, addProperties);
        if (identity) {
            singletons[identity] = results;
        }
        return results;
    }
    /**
     * Creates a factory with { name, type, parent, ...attributesAndRelationships }, which can be used for
     * building test data.
     * The factory is named, with a set of options to use to configure it.
     *   - parent - use another factory as a basis for this one
     *   - type - the type of model to use (for use if no parent)
     *   - identity - whether this factory should be a singleton
     * attributesAndRelationships - attributes and relationships. If properties are a function or an array of functions, they
     *   will be executed at runtime.
     *
     * @param {string} name the name to use for the factory
     * @param {object} options options that can be used to configure the factory
     */
    define(name, options = {}) {
        const { type, parent, ...properties } = options;
        let factory;
        if (parent) {
            const fromFactory = this.factories[parent];
            if (!fromFactory) {
                throw new Error(`Factory ${parent} does not exist`);
            }
            factory = {
                ...fromFactory,
                ...properties
            };
        }
        else {
            factory = {
                type,
                ...properties
            };
        }
        this.factories[name] = factory;
    }
}

/**
 * JSONAPI uses `included` only at the top level. To recursively add models to this array,
 * we preserve the top-level object and pass it in to the next round
 * Because objects can have multiple relationships, we do a check of the array to make sure
 * it's not already there.
 *
 * @param {object} store the data store
 * @param {object} encodedModel the the model
 * @param {Array} included data
 * @param {Array} allEncoded the previously encoded models
 */
const addIncluded = (store, encodedModel, included, allEncoded = [encodedModel]) => {
  const { relationships } = encodedModel;

  Object.keys(relationships).forEach((key) => {
    let { data } = relationships[key];
    if (!Array.isArray(data)) {
      data = [data];
    }

    const notAlreadyIncluded = data.filter(
      ({ id, type }) => !allEncoded.some((encodedModel) => encodedModel.type === type && encodedModel.id === id)
    );

    notAlreadyIncluded.forEach((relationship) => {
      const relatedModel = store.getOne(relationship.type, relationship.id);
      const encodedRelatedModel = toFullJsonapi(relatedModel);
      included.push(encodedRelatedModel);
      addIncluded(store, encodedRelatedModel, included, [...allEncoded, ...included, encodedModel]);
    });
  });
};

/**
 * Encodes models into full compliant JSONAPI payload, as if it were being sent with all
 * relevant relationships and inclusions. The resulting payload will look like
 * {
 *   data: {
 *     id: '1',
 *     type: 'zones',
 *     attributes: {},
 *     relationships: {},
 *   },
 *   included: []
 * }
 *
 * @param {object|Array} modelOrArray the data being encoded
 * @returns {string} JSON encoded data
 */

const serverResponse = function (modelOrArray) {
  let model;
  let array;
  let encodedData;

  if (modelOrArray == null) {
    throw new Error('Cannot encode a null reference')
  } else if (Array.isArray(modelOrArray)) {
    array = modelOrArray;
  } else {
    model = modelOrArray;
  }

  if (model) {
    encodedData = {
      data: toFullJsonapi(model),
      included: []
    };

    addIncluded(model.store, encodedData.data, encodedData.included);
  } else if (array.length > 0) {
    encodedData = {
      data: array.map(toFullJsonapi),
      included: []
    };
    encodedData.data.forEach((encodedModel) => {
      addIncluded(array[0].store, encodedModel, encodedData.included, [...encodedData.data, ...encodedData.included]);
    });
  } else {
    encodedData = { data: [] };
  }

  return JSON.stringify(encodedData)
};

/**
 * Encodes a model to a jsonapi document with all relationships
 *
 * @param {object} model the model to convert
 * @returns {object} the jsonapi encoded document
 */
const toFullJsonapi = (model) => {
  return model.jsonapi({ relationships: Object.keys(model.relationships) })
};

/* global fetch Response */
/**
 * Interpret a `POST` request
 *
 * @param {object} store the store
 * @param {string} type the type
 * @param {string} body json encoded response body
 * @returns {object|Array} a model or array created from the response
 */
const simulatePost = (store, type, body) => {
    const { data } = JSON.parse(body.toString());
    if (Array.isArray(data)) {
        const records = data.map((record) => {
            const { attributes, relationships = {} } = record;
            const id = String(store.getAll(type).length + 1);
            const properties = { ...attributes, ...relationships.data, id };
            return store.add(type, properties);
        });
        return records;
    }
    else {
        const { attributes, relationships = {} } = data;
        const id = String(store.getAll(type).length + 1);
        const properties = { ...attributes, ...relationships.data, id };
        return store.add(type, properties);
    }
};
/**
 * Interpret a `PATCH` request
 *
 * @param {object} store the store
 * @param {string} type the type
 * @param {string} body json encoded response body
 * @returns {object|Array} a model or array created from the response
 */
const simulatePatch = (store, type, body) => {
    const { data } = JSON.parse(body.toString());
    if (Array.isArray(data)) {
        return store.createOrUpdateModelsFromData(data);
    }
    else {
        return store.createOrUpdateModelFromData(data);
    }
};
/**
 * Finds or creates a model that will match an id. This is useful for
 * creating a response on the fly if no object already exists
 *
 * @param {object} _backendFactoryFarm the private factory farm
 * @param {object} factory the the factory to use
 * @param {string} type the model type
 * @param {string} id the id to find
 * @returns {object} a Model object
 */
const getOneFromFactory = (_backendFactoryFarm, factory, type, id) => {
    factory =
        factory ||
            Object.keys(_backendFactoryFarm.factories).find((factoryName) => _backendFactoryFarm.factories[factoryName].type === type);
    if (!factory) {
        throw new Error(`No default factory for ${type} exists`);
    }
    return _backendFactoryFarm.build(factory, { id });
};
/**
 * Will throw an error if `fetch` is called from the mockServer, usually due to a `POST` or `PATCH` called by a `save`
 *
 * @param {string} url the url that is attempted
 * @param {object} options options including the http method
 */
const circularFetchError = (url, options) => {
    throw new Error(`You tried to call fetch from MockServer with ${options.method} ${url}, which is circular and would call itself. This was caused by calling a method such as 'save' on a model that was created from MockServer. To fix the problem, use FactoryFarm without MockServer`);
};
/**
 * Throws an error if MockServer tries to `findOne` or `findAll` from itself.
 *
 * @param {string} type the model type
 * @param {string} id the model id
 */
const circularFindError = (type, id) => {
    const idText = id ? ` with id ${id}` : '';
    throw new Error(`You tried to find ${type}${idText} from MockServer which is circular and would call itself. To fix the problem, use FactoryFarm without MockServer`);
};
/**
 * Overrides store methods that could trigger a `fetch` to throw errors. MockServer should only provide data for fetches, never call a fetch itself.
 *
 * @param {object} store the internal store
 */
const disallowFetches = (store) => {
    store.fetch = circularFetchError;
    store.findOne = circularFindError;
    store.findAll = circularFindError;
    store.findMany = circularFindError;
    store.fetchOne = circularFindError;
    store.fetchAll = circularFindError;
    store.fetchMany = circularFindError;
};
/**
 * Wraps response JSON or object in a Response object that is itself wrapped in a
 * resolved Promise. If no status is given then it will fill in a default based on
 * the method.
 *
 * @param {string} response JSON string
 * @param {string} method the http method
 * @param {number} status the http status
 * @returns {Promise} a promise wrapping the response
 */
const wrapResponse = (response, method, status) => {
    if (!status) {
        status = method === 'POST' ? 201 : 200;
    }
    return Promise.resolve(new Response(response, { status }));
};
/**
 * A backend "server" to be used for creating jsonapi-compliant responses.
 */
class MockServer {
    /**
     * Sets properties needed internally
     *   - factoryFarm: a pre-existing factory to use on this server
     *   - responseOverrides: An array of alternative responses that can be used to override the ones that would be served
     *     from the internal store.
     *
     * @param {object} options currently `responseOverrides` and `factoriesForTypes`
     */
    constructor(options = {}) {
        this._backendFactoryFarm = options.factoryFarm || new FactoryFarm();
        this._backendFactoryFarm.__usedForMockServer__ = true;
        this._backendFactoryFarm.store.__usedForMockServer__ = true;
        this.responseOverrides = options.responseOverrides || [];
        disallowFetches(this._backendFactoryFarm.store);
    }
    /**
     * Adds a response override to the server
     *
     * @param {object} options path, method, status, and response to override
     *   - path
     *   - method: defaults to GET
     *   - status: defaults to 200
     *   - response: a method that takes the server as an argument and returns the body of the response
     */
    respond(options) {
        this.responseOverrides.push(options);
    }
    /**
     * Sets up fetch mocking to intercept requests. It will then either use overrides, or use its own
     * internal store to simulate serving JSON responses of new data.
     *   - responseOverrides: An array of alternative responses that can be used to override the ones that would be served
     *     from the internal store.
     *   - factoriesForTypes: A key map that can be used to build factories if a queried id does not exist
     *
     * @param {object} options currently `responseOverrides` and `factoriesForTypes`
     */
    start(options = {}) {
        const { factoriesForTypes } = options;
        const combinedOverrides = [...options.responseOverrides || [], ...this.responseOverrides || []];
        fetch.resetMocks();
        fetch.mockResponse((req) => {
            const foundQuery = combinedOverrides.find((definition) => {
                if (!(definition === null || definition === void 0 ? void 0 : definition.path)) {
                    throw new Error('No path defined for mock server override. Did you define a path?');
                }
                const method = definition.method || 'GET';
                return req.url.match(definition.path) && req.method.match(method);
            });
            const response = foundQuery
                ? foundQuery.response(this, req)
                : serverResponse(this._findFromStore(req, factoriesForTypes));
            return wrapResponse(response, req.method, foundQuery === null || foundQuery === void 0 ? void 0 : foundQuery.status);
        });
    }
    /**
     * Clears mocks and the store
     */
    stop() {
        fetch.resetMocks();
        this._backendFactoryFarm.store.reset();
    }
    /**
     * Alias for `this._backendFactoryFarm.build`
     *
     * @param {string} factoryName the name of the factory to use
     * @param {object} overrideOptions overrides for the factory
     * @param {number} numberOfRecords optional number of models to build
     * @returns {*} Object or Array
     */
    build(factoryName, overrideOptions, numberOfRecords) {
        return this._backendFactoryFarm.build(factoryName, overrideOptions, numberOfRecords);
    }
    /**
     * Alias for `this._backendFactoryFarm.define`
     *
     * @param {string} name the name to use for the factory
     * @param {object} options options for defining a factory
     * @returns {*} Object or Array
     */
    define(name, options) {
        return this._backendFactoryFarm.define(name, options);
    }
    /**
     * Alias for `this._backendFactoryFarm.add`
     *
     * @param {string} name the name to use for the factory
     * @param {object} options properties and other options for adding a model to the store
     * @returns {*} Object or Array
     */
    add(name, options) {
        return this._backendFactoryFarm.add(name, options);
    }
    /**
     * Based on a request, simulates building a response, either using found data
     * or a factory.
     *
     * @param {object} req a method, url and body
     * @param {object} factoriesForTypes allows an override for a particular type
     * @returns {object} the found or built store record(s)
     * @private
     */
    _findFromStore(req, factoriesForTypes = {}) {
        const { _backendFactoryFarm } = this;
        const { method, url, body } = req;
        const { store } = _backendFactoryFarm;
        const { pathname } = new URL(url, 'http://example.com');
        const type = Object.keys(store.data).find((model_type) => pathname.match(model_type));
        let id = pathname.match(/\d+$/);
        id = id && String(id);
        if (method === 'POST') {
            return simulatePost(store, type, body);
        }
        else if (method === 'PATCH') {
            return simulatePatch(store, type, body);
        }
        else if (id) {
            return store.getOne(type, id) || getOneFromFactory(_backendFactoryFarm, factoriesForTypes[type], type, id);
        }
        else {
            const records = store.getAll(type);
            return records.length > 0
                ? records
                : (factoriesForTypes[type] && [getOneFromFactory(_backendFactoryFarm, factoriesForTypes[type], type, '1')]) ||
                    [];
        }
    }
}

export { FactoryFarm, MockServer, Model$1 as Model, QueryString, Store, arrayType, dateType, numberType, objectType, serverResponse, stringType };
//# sourceMappingURL=mobx-async-store.esm.js.map
