import Store from './Store';
/**
 * The base class for data records
 */
declare class Model {
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
    constructor(initialProperties?: {}, store?: Store, options?: {});
    /**
     * True if model attributes and relationships have been initialized
     *
     * @type {boolean}
     */
    initialized: boolean;
    /**
     * The type of the model. Defined on the class. Defaults to the underscored version of the class name
     * (eg 'calendar_events').
     *
     * @type {string}
     * @static
     */
    static type: string;
    /**
     * The canonical path to the resource on the server. Defined on the class.
     * Defaults to the underscored version of the class name
     *
     * @type {string}
     * @static
     */
    static endpoint: string;
    /**
     * The unique document identifier. Should not change except when persisted.
     *
     * @type {string}
     */
    id: any;
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
    relationships: {};
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
    get isDirty(): boolean;
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
    get dirtyAttributes(): never[] | Set<unknown>;
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
    get dirtyRelationships(): Set<unknown>;
    /**
     * Have any changes been made since this record was last persisted?
     *
     * @type {boolean}
     */
    get hasUnpersistedChanges(): boolean;
    /**
     * True if the model has not been sent to the store
     *
     * @type {boolean}
     */
    get isNew(): boolean;
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
    isInFlight: boolean;
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
    errors: {};
    /**
     * a list of snapshots that have been taken since the record was either last persisted or since it was instantiated
     *
     * @type {Array}
     * @default []
     */
    _snapshots: never[];
    /**
     * Initializes observable attributes and relationships
     *
     * @param {object} initialProperties attributes
     */
    initialize(initialProperties: any): void;
    /**
     * Sets initial attribute properties
     *
     * @param {object} overrides data that will be set over defaults
     */
    initializeAttributes(overrides: any): void;
    /**
     * Initializes relationships based on the `relationships` hash.
     */
    initializeRelationships(): void;
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
    rollback(): void;
    /**
     * restores data to its last state
     * state if the model was never persisted
     */
    undo(): void;
    /**
     * creates or updates a record.
     *
     * @param {object} options query params and sparse fields to use
     * @returns {Promise} the persisted record
     */
    save(options?: {}): Promise<any>;
    /**
     * Replaces the record with the canonical version from the server.
     *
     * @param {object} options props to use for the fetch
     * @returns {Promise} the refreshed record
     */
    reload(options?: {}): any;
    /**
     * Checks all validations, adding errors where necessary and returning `false` if any are not valid
     * Default is to check all validations, but they can be selectively run via options:
     *  - attributes - an array of names of attributes to validate
     *  - relationships - an array of names of relationships to validate
     *
     * @param {object} options attributes and relationships to use for the validation
     * @returns {boolean} key / value of attributes and relationship validations
     */
    validate(options?: {}): any;
    /**
     * deletes a record from the store and server
     *
     * @param {object} options params and option to skip removal from the store
     * @returns {Promise} an empty promise with any success/error status
     */
    destroy(options?: {}): any;
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
    get snapshot(): {
        attributes: {};
        relationships: {};
    };
    /**
     * the latest snapshot
     *
     * @type {object}
     */
    get previousSnapshot(): never;
    /**
     * the latest persisted snapshot or the first snapshot if the model was never persisted
     *
     * @type {object}
     */
    get persistedOrFirstSnapshot(): number | {
        (...items: ConcatArray<never>[]): never[];
        (...items: ConcatArray<never>[]): never[];
    } | ((...items: never[]) => number) | ((separator?: string | undefined) => string) | ((callbackfn: (value: never, index: number, array: never[]) => void, thisArg?: any) => void) | ((value: never, start?: number | undefined, end?: number | undefined) => never[]) | ((index: number) => undefined);
    /**
     * take a snapshot of the current model state.
     * if persisted, clear the stack and push this snapshot to the top
     * if not persisted, push this snapshot to the top of the stack
     *
     * @param {object} options options to use to set the persisted state
     */
    takeSnapshot(options?: {}): void;
    /**
     * Sets `_snapshots` to an empty array
     */
    clearSnapshots(): void;
    /**
     * set the current attributes and relationships to the attributes
     * and relationships of the snapshot to be applied. also reset errors
     *
     * @param {object} snapshot the snapshot to apply
     */
    _applySnapshot(snapshot: any): void;
    /**
     * shortcut to get the static
     *
     * @type {string}
     */
    get type(): any;
    /**
     * current attributes of record
     *
     * @type {object}
     */
    get attributes(): {};
    /**
     * Getter find the attribute definition for the model type.
     *
     * @type {object}
     */
    get attributeDefinitions(): any;
    /**
     * Getter find the relationship definitions for the model type.
     *
     * @type {object}
     */
    get relationshipDefinitions(): any;
    /**
     * Getter to check if the record has errors.
     *
     * @type {boolean}
     */
    get hasErrors(): boolean;
    /**
     * Getter to check if the record has errors.
     *
     * @param {string} key the key to check
     * @returns {string} the error text
     */
    errorForKey(key: any): any;
    /**
     * Getter to just get the names of a records attributes.
     *
     * @returns {Array} the keys of the attribute definitions
     */
    get attributeNames(): string[];
    /**
     * Getter to just get the names of a records relationships.
     *
     * @returns {Array} the keys of the relationship definitions
     */
    get relationshipNames(): string[];
    /**
     * getter method to get the default attributes
     *
     * @returns {object} key / value of attributes and defaults
     */
    get defaultAttributes(): {
        relationships: {};
    };
    /**
     * getter method to get data in api compliance format
     * TODO: Figure out how to handle unpersisted ids
     *
     * @param {object} options serialization options
     * @returns {object} data in JSON::API format
     */
    jsonapi(options?: {}): {
        type: any;
        attributes: {};
        id: string;
    };
    /**
     * Updates attributes of this record via a key / value hash
     *
     * @param {object} attributes the attributes to update
     */
    updateAttributes(attributes: any): void;
    /**
     * Comparison by identity
     * returns `true` if this object has the same type and id as the
     * "other" object, ignores differences in attrs and relationships
     *
     * @param {object} other other model object
     * @returns {boolean} if this object has the same type and id
     */
    isSame(other: any): boolean;
}
export default Model;
//# sourceMappingURL=Model.d.ts.map