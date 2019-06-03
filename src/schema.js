/**
 * Utility class used to store the schema
 * of model attribute definitions
 *
 * @class Schema
 */
class Schema {
  structure = {}

  addAttribute ({ type, property, dataType, defaultValue }) {
    this.structure[type] = this.structure[type] || {}
    this.structure[type][property] = {
      defaultValue, dataType
    }
  }
}

const schema = new Schema()

export default schema
