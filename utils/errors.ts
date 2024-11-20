import type { ErrorResponseData } from '~/types/errors'


export const getErrorCodes = (data?: ErrorResponseData | null): string[] => {
  if (!data || !data.errors) {
    return []
  }
  return data.errors.map(({ code }) => code)
}
