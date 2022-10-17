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
