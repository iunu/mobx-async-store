/**
 * Utility class used to store the schema
 * of model attribute definitions
 *
 * @class Schema
 */
declare class Schema {
    structure: {};
    relations: {};
    addAttribute({ type, property, dataType, defaultValue }: {
        type: any;
        property: any;
        dataType: any;
        defaultValue: any;
    }): void;
    addRelationship({ type, property, dataType }: {
        type: any;
        property: any;
        dataType: any;
    }): void;
    /**
     * Adds a validation to either the schema `structure` (for attributes) or `relations` (for relationships)
     * @method addValidation
     * @param {Object} options includes `type`, `property`, and `validator`
     */
    addValidation({ type, property, validator }: {
        type: any;
        property: any;
        validator: any;
    }): void;
}
declare const schema: Schema;
export default schema;
