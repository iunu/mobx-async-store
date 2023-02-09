import Model, { IModel } from "Model"

export type NestedKeyOf<ObjectType extends object> =
  {[Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    // @ts-ignore
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`
  }[keyof ObjectType & (string | number)]

export type IObjectWithStringOrNumber  = {[key: string]: string | number }
export type IObjectWithString = {[key: string]: string }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type IObjectWithAny = {[key: string]: any }

export interface IErrorMessage {
  key: string
  message: string
}

export interface ValidationResult {
  isValid: boolean
  errors: IErrorMessage[]
}

export interface JSONAPIErrorObject {
  id?: string
  links?: { [key: string]: string }
  status?: number
  code?: string
  title?: string
  detail: string
  source?: {
    pointer?: string
    parameter?: string
  }
  default?: string
  meta?: { [key: string]: any }
}

interface BaseJSONAPIDataObject {
  type: string
  attributes?: { [key: string]: any }
  relationships?: { [key: string]: { data: JSONAPIRelationshipReference } | null }
  links?: { [key: string]: string }
  meta?: { [key: string]: any }
}

export interface JSONAPIDataObject extends BaseJSONAPIDataObject {
  id: string
}

export interface IDOptionalJSONAPIDataObject extends BaseJSONAPIDataObject {
  id?: string
}

export interface JSONAPIRelationshipObject {
  links?: {
    self?: string
    related?: string
  }
  data?: JSONAPIDataObject | JSONAPIDataObject[]
  meta?: IObjectWithAny
}

export interface JSONAPIBaseDocument {
  data?: JSONAPIDataObject | JSONAPIDataObject[]
  errors?: { [key: string]: JSONAPIErrorObject[] }
  meta?: { [key: string]: any }
  jsonapi?: { version: string }
  links?: { [key: string]: string }
  included?: JSONAPIDataObject[]
}

export interface JSONAPIDocument extends JSONAPIBaseDocument {
  id: string
  type: string
  data?: JSONAPIDataObject
}

export interface JSONAPISingleDocument extends JSONAPIBaseDocument {
  data?: JSONAPIDataObject
}

export interface JSONAPIMultiDocument extends JSONAPIBaseDocument {
  data?: JSONAPIDataObject[]
}

export interface IRecordObject {
  id?: string
  [key: string]: any
}

export interface IQueryParams {
  filter?: IObjectWithString
  [key: string]: IObjectWithString | string | undefined
}

export interface IRequestParamsOpts {
  queryParams?: IQueryParams
  extensions?: string[]
  queryTag?: string
  attributes?: string[]
  relationships?: string[]
}

export interface IErrorMessages {
  defaultMessage?: string
  [key: string]: string | void
}

export interface JSONAPIDocumentReference {
  type: string
  id: string
}

export type JSONAPIRelationshipReference = JSONAPIDocumentReference | JSONAPIDocumentReference[]

export type ModelClass = IModel | InstanceType<typeof Model>

export interface ModelClassArray extends Array<ModelClass> {
  meta?: IObjectWithAny
}

export interface IRelatedRecordsArray extends Array<ModelClass> {
  add(relatedRecord: ModelClass): ModelClass | void
  add(relatedRecord: ModelClass[]): ModelClass[]
  add(relatedRecord: ModelClass | ModelClass[]): ModelClass | void | (ModelClass | void)[]
  remove(relatedRecord: ModelClass): ModelClass
  replace(array: ModelClass[] | ModelClassArray): ModelClass[]
}
