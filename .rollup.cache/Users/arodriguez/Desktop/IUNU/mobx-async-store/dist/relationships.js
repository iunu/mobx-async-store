import { action, transaction } from 'mobx';
import Model from './Model';
/**
 * Gets only the relationships from one direction, ie 'toOne' or 'toMany'
 *
 * @param {object} model the model with the relationship
 * @param {string} direction the direction of the relationship
 */
export const definitionsByDirection = action((model, direction) => {
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
export const defineToOneRelationships = action((record, store, toOneDefinitions) => {
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
export const defineToManyRelationships = action((record, store, toManyDefinitions) => {
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
export const setRelatedRecord = action((relationshipName, record, relatedRecord, store, inverse) => {
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
export const removeRelatedRecord = action((relationshipName, record, relatedRecord, inverse) => {
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
export const addRelatedRecord = action((relationshipName, record, relatedRecord, inverse) => {
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
export const coerceDataToExistingRecord = action((store, record) => {
    var _a;
    if (record == null || !((_a = store === null || store === void 0 ? void 0 : store.data) === null || _a === void 0 ? void 0 : _a[record.type])) {
        return null;
    }
    if (record && !(record instanceof Model)) {
        const { id, type } = record;
        record = store.getOne(type, id) || store.add(type, { id }, { skipInitialization: true });
    }
    return record;
});
/**
 * An array that allows for updating store references and relationships
 */
export class RelatedRecordsArray extends Array {
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
//# sourceMappingURL=relationships.js.map