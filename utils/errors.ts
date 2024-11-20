import type { ErrorResponseData } from '~/types/errors'


export const getErrorCodes = ({ errors }: ErrorResponseData): string[] => {
  return errors.map(({ code }) => code)
}
