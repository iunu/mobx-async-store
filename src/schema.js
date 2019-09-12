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

  addValidation ({ type, property, validator }) {
    this.structure[type][property].validator = validator
  }
}

const schema = new Schema()

export default schema
