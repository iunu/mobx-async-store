"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RelatedRecordsArray = exports.setRelatedRecord = exports.getRelatedRecord = exports.getRelatedRecords = exports.relatedToOne = exports.relatedToMany = void 0;
var mobx_1 = require("mobx");
var Model_1 = __importDefault(require("../Model"));
var schema_1 = __importDefault(require("../schema"));
var utils_1 = require("../utils");
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
                dataType: Array
            });
            return {
                get: function () {
                    var type = targetOrModelKlass.type;
                    return getRelatedRecords(this, property2, type);
                }
            };
        };
    }
    else {
        schema_1.default.addRelationship({
            type: targetOrModelKlass.constructor.type,
            property: property,
            dataType: Array
        });
        return {
            get: function () {
                return getRelatedRecords(this, property);
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
                dataType: Object
            });
            return {
                get: function () {
                    var type = targetOrModelKlass.type;
                    return getRelatedRecord(this, property2, type);
                },
                set: function (record) {
                    var type = targetOrModelKlass.type;
                    return setRelatedRecord(this, record, property2, type);
                }
            };
        };
    }
    else {
        schema_1.default.addRelationship({
            type: targetOrModelKlass.constructor.type,
            property: property,
            dataType: Object
        });
        return {
            get: function () {
                return getRelatedRecord(this, property);
            },
            set: function (record) {
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
function getRelatedRecords(record, property, modelType) {
    var _a;
    if (modelType === void 0) { modelType = null; }
    var relationships = record.relationships;
    var relationType = modelType || property;
    var references = relationships && relationships[relationType];
    var relatedRecords = [];
    // NOTE: If the record doesn't have a matching references for the relation type
    // fall back to looking up records by a foreign id i.e record.related_record_id
    if (references && references.data) {
        // Ignore any records of unknown types
        relatedRecords = references.data.filter(function (ref) { return record.store.getType(ref.type); }).map(function (ref) {
            var recordType = ref.type;
            return record.store.getRecord(recordType, ref.id);
        });
    }
    else {
        var foreignId_1 = utils_1.singularizeType(record.type) + "_id";
        if (record.store.getType(relationType)) {
            var allRecords = record.store.getRecords(relationType);
            if ((_a = allRecords === null || allRecords === void 0 ? void 0 : allRecords[0]) === null || _a === void 0 ? void 0 : _a[foreignId_1]) {
                console.warn("Support for including non-canonical jsonapi references will be removed in future versions. Record type: " + record.type + ". Reference: " + foreignId_1);
                relatedRecords = allRecords.filter(function (rel) { return String(rel[foreignId_1]) === String(record.id); });
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
function getRelatedRecord(record, property, modelType) {
    if (modelType === void 0) { modelType = null; }
    // Get relationships
    var relationships = record.relationships;
    // Short circuit if no relationships are present
    if (!relationships)
        return;
    // Use property name unless model type is provided
    var relationType = modelType ? utils_1.singularizeType(modelType) : property;
    var reference = relationships[relationType];
    // Short circuit if matching reference is not found
    if (!reference || !reference.data)
        return;
    var _a = reference.data, id = _a.id, type = _a.type;
    var recordType = modelType || type;
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
function setRelatedRecord(record, relatedRecord, property, modelType) {
    if (modelType === void 0) { modelType = null; }
    if (relatedRecord && !(relatedRecord instanceof Model_1.default)) {
        throw new Error('Related record must be a valid Model object');
    }
    var relationships = record.relationships, _dirtyRelationships = record._dirtyRelationships;
    var relationType = modelType || property;
    var referenceRecord = relatedRecord || getRelatedRecord(record, relationType);
    if (!referenceRecord) {
        return;
    }
    var id = referenceRecord.id;
    var type = referenceRecord.constructor.type;
    var data = relationships[relationType] && relationships[relationType].data;
    if (!relatedRecord) {
        delete relationships[relationType];
        _dirtyRelationships.add(relationType);
    }
    else if (!data || !(data.type === type && data.id === id)) {
        relationships[relationType] = { data: { id: id, type: type } };
        _dirtyRelationships.add(relationType);
    }
    else {
        return relatedRecord;
    }
    // hack we don't have a reference to the inverse name so we just use the record type.
    // this may cause problems with polymorphic relationships
    var inverseRelatedToMany = getRelatedRecords(referenceRecord, null, record.constructor.type);
    if (inverseRelatedToMany) {
        var inverseMethod = relatedRecord ? 'add' : 'remove';
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
var RelatedRecordsArray = /** @class */ (function (_super) {
    __extends(RelatedRecordsArray, _super);
    function RelatedRecordsArray(array, record, property) {
        var _this = _super.apply(this, array) || this;
        /**
         * Adds a record to the array, and updates references in the store, as well as inverse references
         * @method add
         * @param {Object} relatedRecord the record to add to the array
         * @return {Object} the original relatedRecord
         */
        _this.add = function (relatedRecord) {
            var _a = _this, record = _a.record, property = _a.property;
            var recordType = record.constructor.type;
            var id = relatedRecord.id, type = relatedRecord.constructor.type;
            if (!relatedRecord || !(relatedRecord instanceof Model_1.default)) {
                throw new Error('Related record must be a valid Model object');
            }
            if (!record.relationships) {
                record.relationships = {};
            }
            var relationships = record.relationships;
            if (!relationships[property]) {
                relationships[property] = {};
            }
            if (!relationships[property].data) {
                relationships[property].data = [];
            }
            var existingRelationships = relationships[property];
            var alreadyThere = existingRelationships && existingRelationships.data.find(function (model) { return model.id === id && model.type === type; });
            if (!alreadyThere) {
                relationships[property].data.push({ id: id, type: type });
                _this.push(relatedRecord);
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
        _this.remove = function (relatedRecord) {
            var _a = _this, record = _a.record, property = _a.property;
            var relationships = record.relationships, recordType = record.constructor.type;
            var id = relatedRecord.id, type = relatedRecord.constructor.type;
            if (relationships && relationships[property] && relatedRecord) {
                var referenceIndexToRemove = relationships[property].data.findIndex(function (model) { return model.id.toString() === id.toString() && model.type === type; });
                if (referenceIndexToRemove >= 0)
                    relationships[property].data.splice(referenceIndexToRemove, 1);
                var recordIndexToRemove = _this.findIndex(function (model) { return model.id.toString() === id.toString() && model.type === type; });
                if (recordIndexToRemove >= 0)
                    _this.splice(recordIndexToRemove, 1);
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
        _this.replace = function (array) {
            var _a = _this, record = _a.record, property = _a.property;
            var relationships = record.relationships;
            mobx_1.transaction(function () {
                relationships[property] = { data: [] };
                array.forEach(function (object) { return _this.add(object); });
                record._dirtyRelationships.add(property);
            });
        };
        _this.property = property;
        _this.record = record;
        return _this;
    }
    Object.defineProperty(RelatedRecordsArray, Symbol.species, {
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
        get: function () {
            return Array;
        },
        enumerable: false,
        configurable: true
    });
    return RelatedRecordsArray;
}(Array));
exports.RelatedRecordsArray = RelatedRecordsArray;
//# sourceMappingURL=relationships.js.map