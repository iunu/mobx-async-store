/**
 * Utility class used to store the schema
 * of model attribute definitions
 *
 * @class Schema
 */
class Schema {
  structure = {}
  relations = {}

  addAttribute ({ type, property, dataType, defaultValue }) {
    this.structure[type] = this.structure[type] || {}
    this.structure[type][property] = {
      defaultValue, dataType
    }
  }

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
    if (this.structure[type][property]) {
      this.structure[type][property].validator = validator
    } else {
      this.relations[type][property].validator = validator
    }
  }
}

const schema = new Schema()

export default schema
