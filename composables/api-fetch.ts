import type { UseFetchOptions } from "nuxt/app"

export function useApi<T>(
  url: string | (() => string),
  options?: UseFetchOptions<T>,
) {
  const config = useRuntimeConfig()

  return useFetch(url, {
    ...options,
    baseURL: config.public.apiBaseUrl,
  })
}
