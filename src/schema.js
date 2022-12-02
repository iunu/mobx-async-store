/**
 * Utility class used to store the schema
 * of model attribute definitions
 *
 * @class Schema
 */
export class Schema {
  relations = {}

  addRelationship ({ type, property, dataType }) {
    this.relations[type] = this.relations[type] || {}
    this.relations[type][property] = {
      dataType
    }
  }

  /**
   * Adds a validation to either the schema `structure` (for attributes) or `relations` (for relationships)
   * @method addValidation
   * @param {Object} options includes `type`, `property`, and `validator`
   */
  addValidation ({ type, property, validator }) {
      this.relations[type][property].validator = validator
  }
}

const schema = new Schema()

export default schema
