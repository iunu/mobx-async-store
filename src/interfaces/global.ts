export type ErrorMessageProps = {
  status: number
  detail: {
    [k: number]: string
  }
  default?: string
}
