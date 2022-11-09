export type ErrorMessageProps = {
  status: number
  detail: {
    [k: number]: string
  }
  default?: string
}

export type NestedKeyOf<ObjectType extends object> =
  {[Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    // @ts-ignore
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`
  }[keyof ObjectType & (string | number)];

export type IObjectWithStringOrNumber  = {[key: string]: string | number }
export type IObjectWithString = {[key: string]: string }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type IObjectWithAny = {[key: string]: any }
