export interface Error {
  code: string
  detail: string
  attr?: string
}

export interface ErrorResponseData {
  type: string
  errors: Error[]
}
