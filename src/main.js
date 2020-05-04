import Model from './Model'
import Store from './Store'
import { attribute, validates } from './decorators/attributes'
import { relatedToMany, relatedToOne } from './decorators/relationships'
import ObjectPromiseProxy from './ObjectPromiseProxy'

export {
  Model,
  Store,
  attribute,
  relatedToMany,
  relatedToOne,
  validates,
  ObjectPromiseProxy,
}
