/**
 * Utility class used to store the schema
 * of model attribute definitions
 *
 * @class Schema
 */
export class Schema {
  public static relations: object
  public static structure: object

  static addAttribute ({ type, property, dataType, defaultValue }: { type: string, property: string, dataType: string, defaultValue: string}): void {
    this.structure = {
      ...this.structure,
      [type]: {
        [property]: { defaultValue, dataType }
      }
    }
  }

  static addRelationship ({ type, property, dataType }: { type: string, property: string, dataType: string}): void {
    this.relations = {
      ...this.relations,
      [type]: {
        [property]: { dataType }
      }
    }
  }

  /**
   * Adds a validation to either the schema `structure` (for attributes) or `relations` (for relationships)
   * @method addValidation
   * @param {Object} options includes `type`, `property`, and `validator`
   */
  static addValidation ({ type, property, validator }: { type: string, property: string, validator: () => void }): void {
    this.structure = {
      ...this.structure,
      [type]: {
        [property]: { validator }
      }
    }
  }
}

const schema = Schema

export default schema
