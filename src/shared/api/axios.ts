/* eslint-disable react-func/max-lines-per-function */
/* eslint-disable complexity */
import axios, { CreateAxiosDefaults } from 'axios'

import { errorCatch, getAccessToken, getContentType } from './api.helpers'
import { authService } from './auth.service'

const axiosOptions: CreateAxiosDefaults = {
    baseURL: process.env.API_URL || 'http://localhost:4000/api',
    headers: getContentType(),
    withCredentials: true,
}

export const axiosClassic = axios.create(axiosOptions)

export const instance = axios.create(axiosOptions)

instance.interceptors.request.use(config => {
    const accessToken = getAccessToken()

    if (config?.headers && accessToken) config.headers.Authorization = `Bearer ${accessToken}`

    return config
})

instance.interceptors.response.use(
    config => config,
    async error => {
        const originalRequest = error.config
        if (
            (error?.response?.status === 401 ||
                errorCatch(error) === 'jwt expired' ||
                errorCatch(error) === 'jwt must be provided') &&
            error.config &&
            !error.config._isRetry
        ) {
            originalRequest._isRetry = true

            try {
                await authService.getNewTokens()
                return instance.request(originalRequest)
            } catch (e) {
                if (
                    errorCatch(e) === 'Invalid refresh token' ||
                    errorCatch(e) === 'Refresh token not passed'
                )
                    authService.logout('auto')
            }
        }
        throw error
    },
)
