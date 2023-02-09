/**
 * Encodes models into full compliant JSONAPI payload, as if it were being sent with all
 * relevant relationships and inclusions. The resulting payload will look like
 * {
 *   data: {
 *     id: '1',
 *     type: 'zones',
 *     attributes: {},
 *     relationships: {},
 *   },
 *   included: []
 * }
 *
 * @param {object|Array} modelOrArray the data being encoded
 * @returns {string} JSON encoded data
 */
export declare const serverResponse: (modelOrArray: any) => string;
//# sourceMappingURL=testUtils.d.ts.map