import { removeFromStorage, saveTokenStorage } from './api.helpers'
import { Providers } from './api.types'
import { axiosClassic, instance } from './axios'

export interface IUser {
    id: number
    name?: string
    email: string
}

export interface IAuthResponse extends IUser {
    accessToken: string
}

export interface IAuthFormData {
    email: string
    name?: string
    password: string
    confirmedPassword?: string
}

export const authService = {
    async main(type: 'login' | 'registration', data: IAuthFormData) {
        const response = await axiosClassic.post<IAuthResponse>(`/auth/${type}`, data)

        if (response.data.accessToken) saveTokenStorage(response.data.accessToken)

        return response
    },

    async getNewTokens() {
        const response = await axiosClassic.post<IAuthResponse>('/auth/login/access-token')

        if (response.data.accessToken) saveTokenStorage(response.data.accessToken)

        return response
    },

    async logout(type: 'auto' | 'user') {
        const axios = type === 'auto' ? axiosClassic : instance

        const response = await axios.post<string>(`/auth/${type}-logout`)

        if (response.data === '') removeFromStorage()

        return response
    },

    async users() {
        return instance.get<IUser[]>(`/auth`)
    },

    async oAuth({
        provider,
        token,
        name,
        surname,
        phone,
    }: {
        provider: Providers
        token: string
        name: string | null
        surname: string | null
        phone: string | null
    }) {
        const response = await axiosClassic.get<IAuthResponse>(`/oauth2/${provider}/success`, {
            params: { token, name, surname, phone },
        })

        if (response.data.accessToken) saveTokenStorage(response.data.accessToken)

        return response
    },
}
