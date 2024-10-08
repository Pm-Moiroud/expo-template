import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import Axios, { AxiosError } from 'axios'
import { router } from 'expo-router'
import { Platform } from 'react-native'

export const axios = Axios.create({
  baseURL: 'http://localhost:4000/api',
})

export interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  isWeb?: boolean
}

/** Add access_token to all request */
const authRequestInterceptor = async (config: CustomAxiosRequestConfig) => {
  config.headers['Timezone'] = new Intl.DateTimeFormat().resolvedOptions().timeZone
  if (!config?.isWeb) {
    config.headers.Platform = Platform.OS === 'android' ? 'Android' : 'IOS'
  }
  try {
    return config
  } catch (error: any) {
    return config
  }
}

const successResponseInterceptor = (response: AxiosResponse<any, any>) => {
  if (response.config.responseType === 'blob') return response
  return response.data
}

const errorResponseInterceptor = async (error: any): Promise<any> => {
  const originalConfig = error.config

  console.error('errorResponseInterceptor', error)
  if (error.response?.status === 401 && !originalConfig._retry) {
    originalConfig._retry = true
    return axios(originalConfig)
  }

  return error instanceof AxiosError ? Promise.reject(error) : Promise.reject(new Error(error))
}

axios.interceptors.request.use(authRequestInterceptor)
axios.interceptors.response.use(successResponseInterceptor, errorResponseInterceptor)
