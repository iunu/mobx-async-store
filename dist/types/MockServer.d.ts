/**
 * A backend "server" to be used for creating jsonapi-compliant responses.
 */
declare class MockServer {
    /**
     * Sets properties needed internally
     *   - factoryFarm: a pre-existing factory to use on this server
     *   - responseOverrides: An array of alternative responses that can be used to override the ones that would be served
     *     from the internal store.
     *
     * @param {object} options currently `responseOverrides` and `factoriesForTypes`
     */
    constructor(options?: {});
    /**
     * Adds a response override to the server
     *
     * @param {object} options path, method, status, and response to override
     *   - path
     *   - method: defaults to GET
     *   - status: defaults to 200
     *   - response: a method that takes the server as an argument and returns the body of the response
     */
    respond(options: any): void;
    /**
     * Sets up fetch mocking to intercept requests. It will then either use overrides, or use its own
     * internal store to simulate serving JSON responses of new data.
     *   - responseOverrides: An array of alternative responses that can be used to override the ones that would be served
     *     from the internal store.
     *   - factoriesForTypes: A key map that can be used to build factories if a queried id does not exist
     *
     * @param {object} options currently `responseOverrides` and `factoriesForTypes`
     */
    start(options?: {}): void;
    /**
     * Clears mocks and the store
     */
    stop(): void;
    /**
     * Alias for `this._backendFactoryFarm.build`
     *
     * @param {string} factoryName the name of the factory to use
     * @param {object} overrideOptions overrides for the factory
     * @param {number} numberOfRecords optional number of models to build
     * @returns {*} Object or Array
     */
    build(factoryName: any, overrideOptions: any, numberOfRecords: any): any;
    /**
     * Alias for `this._backendFactoryFarm.define`
     *
     * @param {string} name the name to use for the factory
     * @param {object} options options for defining a factory
     * @returns {*} Object or Array
     */
    define(name: any, options: any): any;
    /**
     * Alias for `this._backendFactoryFarm.add`
     *
     * @param {string} name the name to use for the factory
     * @param {object} options properties and other options for adding a model to the store
     * @returns {*} Object or Array
     */
    add(name: any, options: any): any;
    /**
     * Based on a request, simulates building a response, either using found data
     * or a factory.
     *
     * @param {object} req a method, url and body
     * @param {object} factoriesForTypes allows an override for a particular type
     * @returns {object} the found or built store record(s)
     * @private
     */
    _findFromStore(req: any, factoriesForTypes?: {}): any;
}
export default MockServer;
//# sourceMappingURL=MockServer.d.ts.map