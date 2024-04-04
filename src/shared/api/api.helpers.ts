import Cookies from 'js-cookie'

import { EnumTokens } from './api.types'

export const getContentType = () => ({
    'Content-Type': 'application/json',
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const errorCatch = (error: any): string => {
    const message = error?.response?.data?.message
    return message
        ? typeof error.response.data.message === 'object'
            ? message[0]
            : message
        : error.message
}

export const getAccessToken = () => {
    const accessToken = Cookies.get(EnumTokens.ACCESS_TOKEN)
    return accessToken || null
}

export const saveTokenStorage = (accessToken: string) => {
    Cookies.set(EnumTokens.ACCESS_TOKEN, accessToken, {
        domain: process.env.NEXT_PUBLIC_CLIENT_HOST,
        sameSite: 'strict',
        expires: 1,
    })
}

export const removeFromStorage = () => {
    Cookies.remove(EnumTokens.ACCESS_TOKEN)
}
