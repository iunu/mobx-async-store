/**
 * A class to create and use factories
 *
 * @class FactoryFarm
 */
declare class FactoryFarm {
    /**
     * Sets up the store, and a private property to make it apparent the store is used
     * for a FactoryFarm
     *
     * @param {object} store the store to use under the hood
     */
    constructor(store: any);
    /**
     * A hash of available factories. A factory is an object with a structure like:
     * { name, type, attributes, relationships }.
     *
     * @type {object}
     */
    factories: {};
    /**
     * A hash of singleton objects.
     *
     * @type {object}
     */
    singletons: {};
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
    build(factoryName: any, overrideOptions?: {}, numberOfRecords?: number): any;
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
    define(name: any, options?: {}): void;
    /**
     * Alias for `this.store.add`
     *
     * @param  {...any} params attributes and relationships to be added to the store
     * @returns {*} object or array
     */
    add: (...params: any[]) => any;
    /**
     * Verifies that the requested factory exists
     *
     * @param {string} factoryName the name of the factory
     * @private
     */
    _verifyFactory: (factoryName: any) => void;
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
    _buildModel: (factoryName: any, properties: any, index?: number) => any;
    /**
     * If `definition` is a function, calls the function. Otherwise, returns the definition.
     *
     * @param {*} definition a property or function
     * @param {number} index an index to be passed to the called function
     * @param {string} factoryName the name of the factory
     * @param {object} properties properties to be passed to the executed function
     * @returns {*} a definition or executed function
     */
    _callPropertyDefinition: (definition: any, index: any, factoryName: any, properties: any) => any;
}
export default FactoryFarm;
//# sourceMappingURL=FactoryFarm.d.ts.map