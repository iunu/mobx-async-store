"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mobx_1 = require("mobx");
const utils_1 = require("./utils");
const ObjectPromiseProxy_1 = __importDefault(require("./ObjectPromiseProxy"));
const schema_1 = __importDefault(require("./schema"));
const cloneDeep_1 = __importDefault(require("lodash/cloneDeep"));
const isEqual_1 = __importDefault(require("lodash/isEqual"));
const isObject_1 = __importDefault(require("lodash/isObject"));
const findLast_1 = __importDefault(require("lodash/findLast"));
mobx_1.configure({
    enforceActions: "never",
});
/**
 * Maps the passed-in property names through and runs validations against those properties
 * @method validateProperties
 * @param {Object} model the model to check
 * @param {Array} propertyNames the names of the model properties to check
 * @param {Object} propertyDefinitions a hash map containing validators by property
 * @return {Array} an array of booleans representing results of validations
 */
function validateProperties(model, propertyNames, propertyDefinitions) {
    return propertyNames.map((property) => {
        const { validator } = propertyDefinitions[property];
        if (!validator)
            return true;
        const validationResult = validator(model[property], model);
        if (!validationResult.isValid) {
            model.errors[property] = validationResult.errors;
        }
        return validationResult.isValid;
    });
}
function stringifyIds(obj) {
    Object.keys(obj).forEach(key => {
        const property = obj[key];
        if (typeof property === 'object') {
            if (property.id) {
                property.id = String(property.id);
            }
            stringifyIds(property);
        }
    });
}
/**
 @class Model
 */
class Model {
    /**
     * Initializer for model
     *
     * @method constructor
     */
    constructor(initialAttributes = {}) {
        /**
          * has this object been destroyed?
          * @property _disposed
          * @default false
          */
        this._disposed = false;
        /**
          * set of relationships which have changed since last snapshot
          * @property _dirtyRelationships
          */
        this._dirtyRelationships = new Set();
        /**
          * set of attributes which have changed since last snapshot
          * @property _dirtyAttributes
          */
        this._dirtyAttributes = new Set();
        /**
         * True if the instance is coming from / going to the server
         * ```
         * kpi = store.find('kpis', 5)
         * // fetch started
         * kpi.isInFlight
         * => true
         * // fetch finished
         * kpi.isInFlight
         * => false
         * ```
         * @property isInFlight
         * @default false
         */
        this.isInFlight = false;
        /**
         * A hash of errors from the server
         * ```
         * kpi = store.find('kpis', 5)
         * kpi.errors
         * => { authorization: "You do not have access to this resource" }
         * ```
         * @property errors
         * @default {}
         */
        this.errors = {};
        /**
         * a list of snapshots that have been taken since the record was either last persisted or since it was instantiated
         *
         * @property snapshots
         * @default []
         */
        this._snapshots = [];
        mobx_1.makeObservable(this);
        this._makeObservable(initialAttributes);
        this._takeSnapshot({ persisted: !this.isNew });
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
     * kpi = store.add('kpis', { name: 'A good thing to measure' })
     * kpi.isDirty
     * => true
     * kpi.name
     * => "A good thing to measure"
     * await kpi.save()
     * kpi.isDirty
     * => false
     * kpi.name = "Another good thing to measure"
     * kpi.isDirty
     * => true
     * await kpi.save()
     * kpi.isDirty
     * => false
     * ```
     * @property isDirty
     */
    get isDirty() {
        return this._dirtyAttributes.size > 0 || this._dirtyRelationships.size > 0;
    }
    /**
     * have any changes been made since this record was last persisted?
     * @property hasUnpersistedChanges
     */
    get hasUnpersistedChanges() {
        return this.isDirty || !this.previousSnapshot.persisted;
    }
    /**
     * True if the model has not been sent to the store
     * @property isNew
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
     * restores data to its last snapshot state
     * ```
     * kpi = store.find('kpis', 5)
     * kpi.name
     * => "A good thing to measure"
     * kpi.name = "Another good thing to measure"
     * kpi.rollback()
     * kpi.name
     * => "A good thing to measure"
     * ```
     * @method rollback
     */
    rollback() {
        this._applySnapshot(this.previousSnapshot);
    }
    /**
     * restores data to its last persisted state or the oldest snapshot
     * state if the model was never persisted
     * @method rollbackToPersisted
     */
    rollbackToPersisted() {
        this._applySnapshot(this.persistedSnapshot);
        this._takeSnapshot({ persisted: true });
    }
    /**
     * creates or updates a record.
     * @method save
     * @param {Object} options
     */
    save(options = {}) {
        if (!options.skip_validations && !this.validate()) {
            const errorString = JSON.stringify(this.errors);
            return Promise.reject(new Error(errorString));
        }
        const { queryParams, relationships, attributes } = options;
        const { constructor, id, isNew } = this;
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
        return ObjectPromiseProxy_1.default(response, this);
    }
    /**
     * Checks all validations, adding errors where necessary and returning `false` if any are not valid
     * Default is to check all validations, but they can be selectively run via options:
     *  - attributes - an array of names of attributes to validate
     *  - relationships - an array of names of relationships to validate
     *
     * @method validate
     * @param {Object} options
     * @return {Boolean}
     */
    validate(options = {}) {
        this.errors = {};
        const { attributeDefinitions, relationshipDefinitions } = this;
        const attributeNames = options.attributes || this.attributeNames;
        const relationshipNames = options.relationships || this.relationshipNames;
        const validAttributes = validateProperties(this, attributeNames, attributeDefinitions);
        const validRelationships = validateProperties(this, relationshipNames, relationshipDefinitions);
        return validAttributes.concat(validRelationships).every(value => value);
    }
    /**
     * deletes a record from the store and server
     * @method destroy
     * @return {Promise} an empty promise with any success/error status
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
        const _this = this;
        _this.errors = {};
        return promise.then(function (response) {
            return __awaiter(this, void 0, void 0, function* () {
                _this.isInFlight = false;
                if ([200, 202, 204].includes(response.status)) {
                    if (!skipRemove) {
                        _this.store.remove(type, id);
                    }
                    let json;
                    try {
                        json = yield response.json();
                        if (json.data && json.data.attributes) {
                            Object.keys(json.data.attributes).forEach(key => {
                                mobx_1.set(_this, key, json.data.attributes[key]);
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
                        _this.store.createModelsFromData(json.included);
                    }
                    _this.dispose();
                    return _this;
                }
                else {
                    _this.errors = { status: response.status };
                    return _this;
                }
            });
        }, function (error) {
            // TODO: Handle error states correctly
            _this.isInFlight = false;
            _this.errors = error;
            throw error;
        });
    }
    /* Private Methods */
    /**
     * Magic method that makes changes to records
     * observable
     *
     * @method _makeObservable
     */
    _makeObservable(initialAttributes) {
        const { defaultAttributes } = this;
        mobx_1.extendObservable(this, Object.assign(Object.assign({}, defaultAttributes), initialAttributes), { deep: true });
        this._listenForChanges();
    }
    /**
     * sets up a reaction for each top-level attribute so we can compare
     * values after each mutation and keep track of dirty attr states
     * if an attr is different than the last snapshot, add it to the
     * _dirtyAttributes set
     * if it's the same as the last snapshot, make sure it's _not_ in the
     * _dirtyAttributes set
     * @method _listenForChanges
     */
    _listenForChanges() {
        this._disposers = Object.keys(this.attributes).map((attr) => {
            return mobx_1.reaction(() => this.attributes[attr], (value) => {
                const previousValue = this.previousSnapshot.attributes[attr];
                if (isEqual_1.default(previousValue, value)) {
                    this._dirtyAttributes.delete(attr);
                }
                else if (isObject_1.default(value)) { // handles Objects and Arrays
                    // clear out any dirty attrs that start with this attr prefix
                    // then we can reset them if they are still (or newly) dirty
                    Array.from(this._dirtyAttributes).forEach((path) => {
                        if (path.indexOf(`${attr}.`) === 0) {
                            this._dirtyAttributes.delete(path);
                        }
                    });
                    utils_1.diff(previousValue, value).forEach((property) => {
                        this._dirtyAttributes.add(`${attr}.${property}`);
                    });
                }
                else {
                    this._dirtyAttributes.add(attr);
                }
            });
        });
    }
    /**
     * call this when destroying an object to make sure that we clean up
     * any event listeners and don't leak memory
     * @method dispose
     */
    dispose() {
        this._disposed = true;
        this._disposers.forEach((dispose) => dispose());
    }
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
     * @method snapshot
     * @return {Object} current attributes
     */
    get snapshot() {
        return {
            attributes: this.attributes,
            relationships: mobx_1.toJS(this.relationships)
        };
    }
    /**
     * Sets previous snapshot to current snapshot
     *
     * @method setPreviousSnapshot
     */
    setPreviousSnapshot() {
        this._takeSnapshot();
    }
    /**
     * the latest snapshot
     *
     * @method previousSnapshot
     */
    get previousSnapshot() {
        const length = this._snapshots.length;
        if (length === 0)
            throw new Error('Invariant violated: model has no snapshots');
        return this._snapshots[length - 1];
    }
    /**
     * the latest persisted snapshot or the first snapshot if the model was never persisted
     *
     * @method previousSnapshot
     */
    get persistedSnapshot() {
        return findLast_1.default(this._snapshots, (ss) => ss.persisted) || this._snapshots[0];
    }
    /**
     * take a snapshot of the current model state.
     * if persisted, clear the stack and push this snapshot to the top
     * if not persisted, push this snapshot to the top of the stack
     * @method _takeSnapshot
     * @param {Object} options
     */
    _takeSnapshot(options = {}) {
        const persisted = options.persisted || false;
        this._dirtyRelationships.clear();
        this._dirtyAttributes.clear();
        const { attributes, relationships } = this.snapshot;
        const snapshot = {
            persisted,
            attributes,
            relationships
        };
        if (persisted) {
            this._snapshots = [];
        }
        this._snapshots.push(snapshot);
    }
    /**
     * set the current attributes and relationships to the attributes
     * and relationships of the snapshot to be applied. also reset errors
     * @method _applySnapshot
     * @param {Object} snapshot
     */
    _applySnapshot(snapshot) {
        if (!snapshot)
            throw new Error('Invariant violated: tried to apply undefined snapshot');
        mobx_1.transaction(() => {
            this.attributeNames.forEach((key) => {
                this[key] = snapshot.attributes[key];
            });
            this.relationships = snapshot.relationships;
            this.errors = {};
        });
    }
    /**
     * a list of any property paths which have been changed since the previous
     * snapshot
     * ```
     * const todo = new Todo({ title: 'Buy Milk' })
     * todo.dirtyAttributes
     * => []
     * todo.title = 'Buy Cheese'
     * todo.dirtyAttributes
     * => ['title']
     * todo.note = note1
     * todo.dirtyAttributes
     * => ['title', 'relationships.note']
     * ```
     * @method dirtyAttributes
     * @return {Array} dirty attribute paths
     */
    get dirtyAttributes() {
        const relationships = Array.from(this._dirtyRelationships).map((property) => `relationships.${property}`);
        const attributes = Array.from(this._dirtyAttributes);
        return [...relationships, ...attributes];
    }
    /**
     * shortcut to get the static
     *
     * @method type
     * @return {String} current attributes
    */
    get type() {
        return this.constructor.type;
    }
    /**
     * current attributes of record
     *
     * @method attributes
     * @return {Object} current attributes
     */
    get attributes() {
        return this.attributeNames.reduce((attributes, key) => {
            const value = mobx_1.toJS(this[key]);
            if (value == null) {
                delete attributes[key];
            }
            else {
                attributes[key] = value;
            }
            return attributes;
        }, {});
    }
    /**
     * Getter find the attribute definition for the model type.
     *
     * @method attributeDefinitions
     * @return {Object}
     */
    get attributeDefinitions() {
        const { type } = this.constructor;
        return schema_1.default.structure[type] || {};
    }
    /**
     * Getter find the relationship definitions for the model type.
     *
     * @method relationshipDefinitions
     * @return {Object}
     */
    get relationshipDefinitions() {
        const { type } = this.constructor;
        return schema_1.default.relations[type] || {};
    }
    /**
     * Getter to check if the record has errors.
     *
     * @method hasErrors
     * @return {Boolean}
     */
    get hasErrors() {
        return Object.keys(this.errors).length > 0;
    }
    /**
     * Getter to check if the record has errors.
     *
     * @method hasErrors
     * @return {Boolean}
     */
    errorForKey(key) {
        return this.errors[key];
    }
    /**
     * Getter to just get the names of a records attributes.
     *
     * @method attributeNames
     * @return {Array}
     */
    get attributeNames() {
        return Object.keys(this.attributeDefinitions);
    }
    /**
     * Getter to just get the names of a records relationships.
     *
     * @method relationshipNames
     * @return {Array}
     */
    get relationshipNames() {
        return Object.keys(this.relationshipDefinitions);
    }
    /**
     * getter method to get the default attributes
     *
     * @method defaultAttributes
     * @return {Object}
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
     * @method jsonapi
     * @return {Object} data in JSON::API format
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
            const value = this[key];
            if (value) {
                const { dataType: DataType } = attributeDefinitions[key];
                let attr;
                // @ts-ignore
                if (typeof value === 'Array' || typeof value === 'Object') {
                    attr = mobx_1.toJS(value);
                }
                else if (value instanceof Date) {
                    attr = utils_1.makeDate(value).toISOString();
                }
                else {
                    attr = DataType(value);
                }
                attrs[key] = attr;
            }
            else {
                attrs[key] = value;
            }
            return attrs;
        }, {});
        const data = {
            type,
            attributes,
            id: String(id)
        };
        if (options.relationships) {
            filteredRelationshipNames = Object.keys(this.relationships)
                .filter(name => options.relationships.includes(name));
            const relationships = filteredRelationshipNames.reduce((rels, key) => {
                rels[key] = mobx_1.toJS(this.relationships[key]);
                stringifyIds(rels[key]);
                return rels;
            }, {});
            data.relationships = relationships;
        }
        if (meta) {
            data['meta'] = meta;
        }
        if (String(id).match(/tmp/)) {
            delete data.id;
        }
        return data;
    }
    updateAttributes(attributes) {
        mobx_1.transaction(() => {
            Object.keys(attributes).forEach(key => {
                this[key] = attributes[key];
            });
        });
    }
    // TODO: this shares a lot of functionality with Store.createOrUpdateModel
    // Perhaps that shared code
    updateAttributesFromResponse(data, included) {
        const tmpId = this.id;
        const { id, attributes, relationships } = data;
        mobx_1.transaction(() => {
            mobx_1.set(this, 'id', id);
            Object.keys(attributes).forEach(key => {
                mobx_1.set(this, key, attributes[key]);
            });
            if (relationships) {
                Object.keys(relationships).forEach(key => {
                    if (!relationships[key].hasOwnProperty('meta')) {
                        // todo: throw error if relationship is not defined in model
                        mobx_1.set(this.relationships, key, relationships[key]);
                    }
                });
            }
            if (included) {
                this.store.createModelsFromData(included);
            }
        });
        // Update target isInFlight
        this.isInFlight = false;
        this._takeSnapshot({ persisted: true });
        mobx_1.transaction(() => {
            // NOTE: This resolves an issue where a record is persisted but the
            // index key is still a temp uuid. We can't simply remove the temp
            // key because there may be associated records that have the temp
            // uuid id as its only reference to the newly persisted record.
            // TODO: Figure out a way to update associated records to use the
            // newly persisted id.
            this.store.data[this.type].records.set(String(tmpId), this);
            this.store.data[this.type].records.set(String(this.id), this);
        });
    }
    clone() {
        const attributes = cloneDeep_1.default(this.snapshot.attributes);
        const relationships = cloneDeep_1.default(this.snapshot.relationships);
        return this.store.createModel(this.type, this.id, { attributes, relationships });
    }
    /**
     * Comparison by value
     * returns `true` if this object has the same attrs and relationships
     * as the "other" object, ignores differences in internal state like
     * attribute "dirtyness" or errors
     *
     * @method isEqual
     * @param {Object} other
     * @return {Object}
     */
    isEqual(other) {
        if (!other)
            return false;
        return isEqual_1.default(this.attributes, other.attributes) && isEqual_1.default(this.relationships, other.relationships);
    }
    /**
     * Comparison by identity
     * returns `true` if this object has the same type and id as the
     * "other" object, ignores differences in attrs and relationships
     *
     * @method isSame
     * @param {Object} other
     * @return {Boolean}
     */
    isSame(other) {
        if (!other)
            return false;
        return this.type === other.type && this.id === other.id;
    }
}
__decorate([
    mobx_1.observable
], Model.prototype, "_disposed", void 0);
__decorate([
    mobx_1.observable
], Model.prototype, "_dirtyRelationships", void 0);
__decorate([
    mobx_1.observable
], Model.prototype, "_dirtyAttributes", void 0);
__decorate([
    mobx_1.computed
], Model.prototype, "isNew", null);
__decorate([
    mobx_1.observable
], Model.prototype, "errors", void 0);
exports.default = Model;
//# sourceMappingURL=Model.js.map