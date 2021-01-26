import Model from '../Model';
export declare function relatedToMany(targetOrModelKlass: any, property?: any, descriptor?: any): void | any;
/**
 * Syntactic sugar of relatedToMany relationship. Basically
 * everything the same except it only returns a single record.
 *
 * @method relatedToOne
 */
export declare function relatedToOne(targetOrModelKlass: any, property?: any, descriptor?: any): void | any;
/**
 * Handles getting polymorphic records or only a specific
 * type if specified.
 *
 * @method getRelatedRecords
 * @param {Object} record the record with the relationship
 * @param {String} property the related property to set
 * @param {String} modelType an override of the modelType
 */
export declare function getRelatedRecords(record: any, property: any, modelType?: null): RelatedRecordsArray;
/**
 * Handles getting polymorphic has_one/belong_to.
 *
 * @method getRelatedRecord
 */
export declare function getRelatedRecord(record: any, property: any, modelType?: any): any;
/**
 * Handles setting polymorphic has_one/belong_to.
 * - Validates the related record to make sure it inherits from `Model` class
 * - Sets the relationship
 * - Attempts to find an inverse relationship, and if successful adds it as well
 *
 * @method setRelatedRecord
 * @param {Object} record the record with the relationship
 * @param {Object} relatedRecord the record that will be related
 * @param {String} property the related property to set
 * @param {String} modelType an override of the modelType
 */
export declare function setRelatedRecord(record: any, relatedRecord: any, property: any, modelType?: null): any;
/**
 * An array that allows for updating store references and relationships
 * @class RelatedRecordsArray
 * @constructor
 * @param {Array} array the array to extend
 * @param {Object} record the record with the referenced array
 * @param {String} property the property on the record that references the array
 */
export declare class RelatedRecordsArray extends Array {
    property: any;
    record: any;
    constructor(array: any, record: any, property: any);
    static get [Symbol.species](): ArrayConstructor;
    /**
     * Adds a record to the array, and updates references in the store, as well as inverse references
     * @method add
     * @param {Object} relatedRecord the record to add to the array
     * @return {Object} the original relatedRecord
     */
    add: (relatedRecord: any) => Model;
    /**
     * Removes a record from the array, and updates references in the store, as well as inverse references
     * @method remove
     * @param {Object} relatedRecord the record to remove from the array
     * @return {Object} the original relatedRecord
     */
    remove: (relatedRecord: any) => any;
    replace: (array: any) => void;
}
