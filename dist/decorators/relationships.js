"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RelatedRecordsArray = exports.setRelatedRecord = exports.getRelatedRecord = exports.getRelatedRecords = exports.relatedToOne = exports.relatedToMany = void 0;
const mobx_1 = require("mobx");
const Model_1 = __importDefault(require("../Model"));
const schema_1 = __importDefault(require("../schema"));
const utils_1 = require("../utils");
/*
 * Defines a one-to-many relationship. Defaults to the class with camelized singular name of the property
 * An optional argument specifies the data model, if different from the property name
 * ```
 * class CropVariety extends Model {
 *   @relatedToMany growth_cycles
 * }
 *
 * class Crop extends Model {
 *   @relatedToMany(CropVariety) varieties
 * }
 * ```
 * @method relatedToMany
 */
function relatedToMany(targetOrModelKlass, property, descriptor) {
    if (typeof targetOrModelKlass === 'function') {
        return function (target2, property2, descriptor2) {
            schema_1.default.addRelationship({
                type: target2.constructor.type,
                property: property2,
                dataType: []
            });
            return {
                get() {
                    const { type } = targetOrModelKlass;
                    return getRelatedRecords(this, property2, type) || [];
                }
            };
        };
    }
    else {
        schema_1.default.addRelationship({
            type: targetOrModelKlass.constructor.type,
            property,
            dataType: []
        });
        return {
            get() {
                return getRelatedRecords(this, property) || [];
            }
        };
    }
}
exports.relatedToMany = relatedToMany;
/**
 * Syntactic sugar of relatedToMany relationship. Basically
 * everything the same except it only returns a single record.
 *
 * @method relatedToOne
 */
function relatedToOne(targetOrModelKlass, property, descriptor) {
    if (typeof targetOrModelKlass === 'function') {
        return function (target2, property2, descriptor2) {
            schema_1.default.addRelationship({
                type: target2.constructor.type,
                property: property2,
                dataType: {}
            });
            return {
                get() {
                    const { type } = targetOrModelKlass;
                    return getRelatedRecord(this, property2, type);
                },
                set(record) {
                    const { type } = targetOrModelKlass;
                    return setRelatedRecord(this, record, property2, type);
                }
            };
        };
    }
    else {
        schema_1.default.addRelationship({
            type: targetOrModelKlass.constructor.type,
            property,
            dataType: {}
        });
        return {
            get() {
                return getRelatedRecord(this, property);
            },
            set(record) {
                return setRelatedRecord(this, record, property);
            }
        };
    }
}
exports.relatedToOne = relatedToOne;
/**
 * Handles getting polymorphic records or only a specific
 * type if specified.
 *
 * @method getRelatedRecords
 * @param {Object} record the record with the relationship
 * @param {String} property the related property to set
 * @param {String} modelType an override of the modelType
 */
function getRelatedRecords(record, property, modelType = null) {
    var _a;
    const { relationships } = record;
    const relationType = modelType || property;
    const references = relationships && relationships[relationType];
    let relatedRecords = [];
    // NOTE: If the record doesn't have a matching references for the relation type
    // fall back to looking up records by a foreign id i.e record.related_record_id
    if (references && references.data) {
        // Ignore any records of unknown types
        relatedRecords = references.data.filter((ref) => record.store.getType(ref.type)).map((ref) => {
            const recordType = ref.type;
            return record.store.getRecord(recordType, ref.id);
        });
    }
    else {
        const foreignId = `${utils_1.singularizeType(record.type)}_id`;
        if (record.store.getType(relationType)) {
            const allRecords = record.store.getRecords(relationType);
            // TODO: this is the inverse relationship issue that causes performance issues
            if ((_a = allRecords === null || allRecords === void 0 ? void 0 : allRecords[0]) === null || _a === void 0 ? void 0 : _a[foreignId]) {
                console.warn(`Support for including non-canonical jsonapi references will be removed in future versions. Record type: ${record.type}. Reference: ${foreignId}`);
                relatedRecords = allRecords.filter((rel) => String(rel[foreignId]) === String(record.id));
            }
        }
    }
    return new RelatedRecordsArray(relatedRecords, record, relationType);
}
exports.getRelatedRecords = getRelatedRecords;
/**
 * Handles getting polymorphic has_one/belong_to.
 *
 * @method getRelatedRecord
 */
function getRelatedRecord(record, property, modelType = null) {
    // Get relationships
    const { relationships } = record;
    // Short circuit if no relationships are present
    if (!relationships)
        return;
    // Use property name unless model type is provided
    const relationType = modelType ? utils_1.singularizeType(modelType) : property;
    const reference = relationships[relationType];
    // Short circuit if matching reference is not found
    if (!reference || !reference.data)
        return;
    const { id, type } = reference.data;
    const recordType = modelType || type;
    return record.store.getRecord(recordType, id);
}
exports.getRelatedRecord = getRelatedRecord;
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
function setRelatedRecord(record, relatedRecord, property, modelType = null) {
    if (relatedRecord && !(relatedRecord instanceof Model_1.default)) {
        throw new Error('Related record must be a valid Model object');
    }
    const { relationships, _dirtyRelationships } = record;
    const relationType = modelType || property;
    const referenceRecord = relatedRecord || getRelatedRecord(record, relationType);
    if (!referenceRecord) {
        return;
    }
    const { id } = referenceRecord;
    const { type } = referenceRecord.constructor;
    const data = relationships[relationType] && relationships[relationType].data;
    if (!relatedRecord) {
        delete relationships[relationType];
        _dirtyRelationships.add(relationType);
    }
    else if (!data || !(data.type === type && data.id === id)) {
        relationships[relationType] = { data: { id, type } };
        _dirtyRelationships.add(relationType);
    }
    else {
        return relatedRecord;
    }
    // hack we don't have a reference to the inverse name so we just use the record type.
    // this may cause problems with polymorphic relationships
    const inverseRelatedToMany = getRelatedRecords(referenceRecord, null, record.constructor.type);
    if (inverseRelatedToMany) {
        const inverseMethod = relatedRecord ? 'add' : 'remove';
        inverseRelatedToMany[inverseMethod](record);
    }
    return relatedRecord;
}
exports.setRelatedRecord = setRelatedRecord;
/**
 * An array that allows for updating store references and relationships
 * @class RelatedRecordsArray
 * @constructor
 * @param {Array} array the array to extend
 * @param {Object} record the record with the referenced array
 * @param {String} property the property on the record that references the array
 */
class RelatedRecordsArray extends Array {
    constructor(array, record, property) {
        super(...array);
        /**
         * Adds a record to the array, and updates references in the store, as well as inverse references
         * @method add
         * @param {Object} relatedRecord the record to add to the array
         * @return {Object} the original relatedRecord
         */
        this.add = (relatedRecord) => {
            const { record, property } = this;
            const { constructor: { type: recordType } } = record;
            const { id, constructor: { type } } = relatedRecord;
            if (!relatedRecord || !(relatedRecord instanceof Model_1.default)) {
                throw new Error('Related record must be a valid Model object');
            }
            if (!record.relationships) {
                record.relationships = {};
            }
            const { relationships } = record;
            if (!relationships[property]) {
                relationships[property] = {};
            }
            if (!relationships[property].data) {
                relationships[property].data = [];
            }
            const existingRelationships = relationships[property];
            const alreadyThere = existingRelationships && existingRelationships.data.find((model) => model.id === id && model.type === type);
            if (!alreadyThere) {
                relationships[property].data.push({ id, type });
                this.push(relatedRecord);
                record._dirtyRelationships.add(property);
                // setting the inverse - hack this will only work with singularized relationships.
                setRelatedRecord(relatedRecord, record, recordType.slice(0, recordType.length - 1));
            }
            return relatedRecord;
        };
        /**
         * Removes a record from the array, and updates references in the store, as well as inverse references
         * @method remove
         * @param {Object} relatedRecord the record to remove from the array
         * @return {Object} the original relatedRecord
         */
        this.remove = (relatedRecord) => {
            const { record, property } = this;
            const { relationships, constructor: { type: recordType } } = record;
            const { id, constructor: { type } } = relatedRecord;
            if (relationships && relationships[property] && relatedRecord) {
                const referenceIndexToRemove = relationships[property].data.findIndex((model) => model.id.toString() === id.toString() && model.type === type);
                if (referenceIndexToRemove >= 0)
                    relationships[property].data.splice(referenceIndexToRemove, 1);
                const recordIndexToRemove = this.findIndex((model) => model.id.toString() === id.toString() && model.type === type);
                if (recordIndexToRemove >= 0)
                    this.splice(recordIndexToRemove, 1);
                if (!relationships[property].data.length) {
                    delete relationships[property];
                }
                if (!Object.keys(record.relationships).length) {
                    delete record.relationships;
                }
                record._dirtyRelationships.add(property);
                // hack this will only work with singularized relationships.
                setRelatedRecord(relatedRecord, null, recordType.slice(0, recordType.length - 1));
            }
            return relatedRecord;
        };
        this.replace = (array) => {
            const { record, property } = this;
            const { relationships } = record;
            mobx_1.transaction(() => {
                relationships[property] = { data: [] };
                array.forEach(object => this.add(object));
                record._dirtyRelationships.add(property);
            });
        };
        this.property = property;
        this.record = record;
    }
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
exports.RelatedRecordsArray = RelatedRecordsArray;
//# sourceMappingURL=relationships.js.map