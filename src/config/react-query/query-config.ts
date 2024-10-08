/* eslint-disable @typescript-eslint/no-explicit-any */
import type { DefaultOptions, UseMutationOptions, UseQueryOptions } from '@tanstack/react-query'
import { QueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'

const queryConfig: DefaultOptions = {
  queries: {
    throwOnError: false,
    refetchOnWindowFocus: false,
    retry: false,
  },
}

export const queryClient = new QueryClient({ defaultOptions: queryConfig })

export type ExtractFnReturnType<FnType extends (...args: any) => any> = Awaited<ReturnType<FnType>>

export type QueryConfig<QueryFnType extends (...args: any) => any> = Omit<
  UseQueryOptions<ExtractFnReturnType<QueryFnType>>,
  'queryKey' | 'queryFn'
>

export type MutationConfig<MutationFnType extends (...args: any) => any> = UseMutationOptions<
  ExtractFnReturnType<MutationFnType>,
  AxiosError,
  Parameters<MutationFnType>[0]
>

export const getQueryParamsFrom = (data?: any): string => {
  if (!data) return ''
  const params = new URLSearchParams()

  for (const key in data) {
    if (data[key] instanceof Date) {
      params.append(key, data[key].toISOString())
    } else if (typeof data[key] === 'object') {
      for (const subKey in data[key]) {
        if (data[key][subKey] !== '' && data[key][subKey] !== undefined) {
          params.append(key, data[key][subKey])
        }
      }
    } else if (data[key] !== undefined && data[key] !== '') {
      params.append(key, data[key])
    }
  }

  return `?${params.toString()}`
}
