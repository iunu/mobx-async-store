

export interface ISchemaDefinition {
  validator: () => boolean
  defaultValue: string
  dataType: string
}

export interface IStructure {
  [k: string]: {
    [l: string]: ISchemaDefinition
  }
}

export interface ISchema {
  structure: IStructure,
  relations: IStructure
}

/**
 * Utility class used to store the schema
 * of model attribute definitions
 *
 * @class Schema
 */
export class Schema implements ISchema {
  structure = {}
  relations = {}

  addAttribute ({ type, property, dataType, defaultValue }: { type: string, property: object, dataType: string, defaultValue: string}): void {
    this.structure[type as keyof IStructure] = this.structure[type as keyof object] || {}
    this.structure[type as keyof IStructure][property as keyof object] = {
      defaultValue, dataType
    }
  }

  addRelationship ({ type, property, dataType }: { type: string, property: string, dataType: string}): void {
    this.relations[type as keyof IStructure] = this.relations[type as keyof object] || {}
    this.relations[type as keyof IStructure][property as keyof object] = {
      dataType
    }
  }

  /**
   * Adds a validation to either the schema `structure` (for attributes) or `relations` (for relationships)
   * @method addValidation
   * @param {Object} options includes `type`, `property`, and `validator`
   */
  addValidation ({ type, property, validator }: { type: string, property: string, validator: string }): void {
    if (this.structure[type as keyof object][property]) {
      this.structure[type as keyof object][property].validator = validator
    } else {
      this.relations[type as keyof object][property].validator = validator
    }
  }
}

const schema = new Schema()

export default schema
