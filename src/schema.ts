export interface ISchema<S, R> {
  structure: S
  relations: R
}

/**
 * Utility class used to store the schema
 * of model attribute definitions
 *
 * @class Schema
 */
export class Schema<S, R> implements ISchema<S, R> {
  structure: S
  relations: R

  constructor(structure: S, relations: R) {
    this.structure = structure
    this.relations = relations
  }

  addAttribute ({ type, property, dataType, defaultValue }: { type: string, property: string, dataType: string, defaultValue: string}): void {
    // this.structure[type as keyof S] = this.structure[type as keyof S]
    // this.structure[type as keyof S] = this.structure[property] = {
    //   defaultValue, dataType
    // }
    this.structure = {
      ...this.structure,
      [type]: {
        [property]: { defaultValue, dataType }
      }
    }
  }

  addRelationship ({ type, property, dataType }: { type: string, property: string, dataType: string}): void {
    // this.relations[type as keyof R] = this.relations[type as keyof R]
    // this.relations[type as keyof R][property] = {
    //   dataType
    // }
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
  addValidation ({ type, property, validator }: { type: string, property: string, validator: () => void }): void {
    // if (this.structure[type][property]) {
    //   this.structure[type][property].validator = validator
    // } else {
    //   this.relations[type as keyof object][property].validator = validator
    // }
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
