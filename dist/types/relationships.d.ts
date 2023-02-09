/**
 * Gets only the relationships from one direction, ie 'toOne' or 'toMany'
 *
 * @param {object} model the model with the relationship
 * @param {string} direction the direction of the relationship
 */
export declare const definitionsByDirection: (model: any, direction: any) => [string, unknown][];
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
export declare const defineToOneRelationships: (record: any, store: any, toOneDefinitions: any) => any;
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
export declare const defineToManyRelationships: (record: any, store: any, toManyDefinitions: any) => any;
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
export declare const setRelatedRecord: (relationshipName: any, record: any, relatedRecord: any, store: any, inverse: any) => any;
/**
 * Removes a record from an array of related records, removing both the object and the reference.
 *
 * @param {string} relationshipName the name of the relationship
 * @param {object} record the record with the relationship
 * @param {object} relatedRecord the related record being removed from the relationship
 * @param {object} inverse the definition of the inverse relationship
 * @returns {object} the removed record
 */
export declare const removeRelatedRecord: (relationshipName: any, record: any, relatedRecord: any, inverse: any) => any;
/**
 * Adds a record to a related array and updates the jsonapi reference in the relationships
 *
 * @param {string} relationshipName the name of the relationship
 * @param {object} record the record with the relationship
 * @param {object} relatedRecord the related record being added to the relationship
 * @param {object} inverse the definition of the inverse relationship
 * @returns {object} the added record
 */
export declare const addRelatedRecord: (relationshipName: any, record: any, relatedRecord: any, inverse: any) => any;
/**
 * Takes any object with { id, type } properties and gets an object from the store with that structure.
 * Useful for allowing objects to be serialized in real time, saving overhead, while at the same time
 * always returning an object of the same type.
 *
 * @param {object} store the store with the reference
 * @param {object} record the potential record
 * @returns {object} the store object
 */
export declare const coerceDataToExistingRecord: (store: any, record: any) => any;
/**
 * An array that allows for updating store references and relationships
 */
export declare class RelatedRecordsArray extends Array {
    /**
     * Extends an array to create an enhanced array.
     *
     * @param {object} record the record with the referenced array
     * @param {string} property the property on the record that references the array
     * @param {Array} array the array to extend
     */
    constructor(record: any, property: any, array?: never[]);
    /**
     * Adds a record to the array, and updates references in the store, as well as inverse references
     *
     * @param {object} relatedRecord the record to add to the array
     * @returns {object} a model record reflecting the original relatedRecord
     */
    add: (relatedRecord: any) => any;
    /**
     * Removes a record from the array, and updates references in the store, as well as inverse references
     *
     * @param {object} relatedRecord the record to remove from the array
     * @returns {object} a model record reflecting the original relatedRecord
     */
    remove: (relatedRecord: any) => any;
    /**
     * Replaces the internal array of objects with a new one, including inverse relationships
     *
     * @param {Array} array the array of objects that will replace the existing one
     * @returns {Array} this internal array
     */
    replace: (array?: never[]) => undefined;
    static get [Symbol.species](): ArrayConstructor;
}
//# sourceMappingURL=relationships.d.ts.map