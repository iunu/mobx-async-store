export interface ModelInterface {
    store?: any;
    id?: string;
    _disposers?: any;
    meta?: any;
    relationships: any[];
}
interface JSONApiStruct {
    id?: string;
    type?: string;
    persisted?: boolean;
    attributes: any;
    relationships: any[];
}
/**
 @class Model
 */
declare class Model {
    store: any;
    id: string;
    _disposers: any;
    relationships: any[];
    meta: any;
    options: any;
    /**
     * Initializer for model
     *
     * @method constructor
     */
    constructor(initialAttributes?: {});
    /**
      * has this object been destroyed?
      * @property _disposed
      * @default false
      */
    _disposed: Boolean;
    /**
      * set of relationships which have changed since last snapshot
      * @property _dirtyRelationships
      */
    _dirtyRelationships: Set<any>;
    /**
      * set of attributes which have changed since last snapshot
      * @property _dirtyAttributes
      */
    _dirtyAttributes: Set<any>;
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
    get isDirty(): Boolean;
    /**
     * have any changes been made since this record was last persisted?
     * @property hasUnpersistedChanges
     */
    get hasUnpersistedChanges(): Boolean;
    /**
     * True if the model has not been sent to the store
     * @property isNew
     */
    get isNew(): Boolean;
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
    isInFlight: Boolean;
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
    errors: any;
    /**
     * a list of snapshots that have been taken since the record was either last persisted or since it was instantiated
     *
     * @property snapshots
     * @default []
     */
    _snapshots: JSONApiStruct[];
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
    rollback(): void;
    /**
     * restores data to its last persisted state or the oldest snapshot
     * state if the model was never persisted
     * @method rollbackToPersisted
     */
    rollbackToPersisted(): void;
    /**
     * creates or updates a record.
     * @method save
     * @param {Object} options
     */
    save(options?: any): Promise<any>;
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
    validate(options?: any): Boolean;
    /**
     * deletes a record from the store and server
     * @method destroy
     * @return {Promise} an empty promise with any success/error status
     */
    destroy(options?: any): Promise<any> | any;
    /**
     * Magic method that makes changes to records
     * observable
     *
     * @method _makeObservable
     */
    _makeObservable(initialAttributes: any): void;
    /**
     * sets up a reaction for each top-level attribute so we can compare
     * values after each mutation and keep track of dirty attr states
     * if an attr is different than the last snapshot, add it to the
     * _dirtyAttributes set
     * if it's the same as the last snapshot, make sure it's _not_ in the
     * _dirtyAttributes set
     * @method _listenForChanges
     */
    _listenForChanges(): void;
    /**
     * call this when destroying an object to make sure that we clean up
     * any event listeners and don't leak memory
     * @method dispose
     */
    dispose(): void;
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
    get snapshot(): JSONApiStruct;
    /**
     * Sets previous snapshot to current snapshot
     *
     * @method setPreviousSnapshot
     */
    setPreviousSnapshot(): void;
    /**
     * the latest snapshot
     *
     * @method previousSnapshot
     */
    get previousSnapshot(): JSONApiStruct;
    /**
     * the latest persisted snapshot or the first snapshot if the model was never persisted
     *
     * @method previousSnapshot
     */
    get persistedSnapshot(): JSONApiStruct;
    /**
     * take a snapshot of the current model state.
     * if persisted, clear the stack and push this snapshot to the top
     * if not persisted, push this snapshot to the top of the stack
     * @method _takeSnapshot
     * @param {Object} options
     */
    _takeSnapshot(options?: any): void;
    /**
     * set the current attributes and relationships to the attributes
     * and relationships of the snapshot to be applied. also reset errors
     * @method _applySnapshot
     * @param {Object} snapshot
     */
    _applySnapshot(snapshot: JSONApiStruct): void | Error;
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
    get dirtyAttributes(): any[];
    /**
     * shortcut to get the static
     *
     * @method type
     * @return {String} current attributes
    */
    get type(): string;
    /**
     * current attributes of record
     *
     * @method attributes
     * @return {Object} current attributes
     */
    get attributes(): any;
    /**
     * Getter find the attribute definition for the model type.
     *
     * @method attributeDefinitions
     * @return {Object}
     */
    get attributeDefinitions(): any;
    /**
     * Getter find the relationship definitions for the model type.
     *
     * @method relationshipDefinitions
     * @return {Object}
     */
    get relationshipDefinitions(): any;
    /**
     * Getter to check if the record has errors.
     *
     * @method hasErrors
     * @return {Boolean}
     */
    get hasErrors(): boolean;
    /**
     * Getter to check if the record has errors.
     *
     * @method hasErrors
     * @return {Boolean}
     */
    errorForKey(key: string | number): boolean;
    /**
     * Getter to just get the names of a records attributes.
     *
     * @method attributeNames
     * @return {Array}
     */
    get attributeNames(): any[];
    /**
     * Getter to just get the names of a records relationships.
     *
     * @method relationshipNames
     * @return {Array}
     */
    get relationshipNames(): any[];
    /**
     * getter method to get the default attributes
     *
     * @method defaultAttributes
     * @return {Object}
     */
    get defaultAttributes(): any;
    /**
     * getter method to get data in api compliance format
     * TODO: Figure out how to handle unpersisted ids
     *
     * @method jsonapi
     * @return {Object} data in JSON::API format
     */
    jsonapi(options?: any): any;
    updateAttributes(attributes: any): void;
    updateAttributesFromResponse(data: JSONApiStruct, included: any[]): void;
    clone(): any;
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
    isEqual(other: JSONApiStruct): any;
    /**
     * Comparison by identity
     * returns `true` if this object has the same type and id as the
     * "other" object, ignores differences in attrs and relationships
     *
     * @method isSame
     * @param {Object} other
     * @return {Boolean}
     */
    isSame(other: JSONApiStruct): boolean;
}
export default Model;
