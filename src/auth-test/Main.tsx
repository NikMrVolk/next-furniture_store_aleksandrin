'use client'

import { FormEvent, useEffect, useState } from 'react'

import { Providers } from '@/shared/api/api.types'
import { authService, IAuthResponse, IUser } from '@/shared/api/auth.service'

export default function Main() {
    const [users, setUsers] = useState<IUser[]>([])
    const [data, setData] = useState<IAuthResponse>()
    const [value, setValue] = useState({
        email: '',
        password: '',
        name: '',
    })
    const [oAuthPopup, setOAuthPopup] = useState<{
        popup: null | Window
        provider: Providers | null
    }>({ popup: null, provider: null })

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        authService.main('registration', value).then(d => setData(d.data))
    }

    const handleWindowOpen = (provider: Providers) => {
        const width = 600
        const height = 700
        const left = window.screen.width / 2 - width / 2
        const top = window.screen.height / 2 - height / 2

        const popup = window.open(
            `http://localhost:4000/api/oauth2/${provider}`,
            'oAuth',
            `height=${height}, width=${width}, top=${top}, left=${left}`,
        )
        setOAuthPopup({ popup, provider })
    }

    const handleOAuthComplete = async () => {
        if (oAuthPopup?.popup?.location.href.includes('?token=')) {
            const urlParams = new URLSearchParams(oAuthPopup?.popup?.location.search)
            const token = urlParams.get('token')

            if (token) {
                setOAuthPopup({ popup: null, provider: null })
                oAuthPopup?.popup.close()
                const response = await authService.oAuth({
                    provider: oAuthPopup.provider as Providers,
                    token,
                    name: urlParams.get('name'),
                    surname: urlParams.get('surname'),
                    phone: urlParams.get('phone'),
                })
                setData(response.data)
            }
        }
    }

    useEffect(() => {
        if (oAuthPopup) {
            const timer = setInterval(async () => {
                try {
                    await handleOAuthComplete()
                } catch (e) {
                    const message = (e as Error).message
                    if (!message.includes('href')) {
                        console.error(message)
                    }
                }
            }, 500)

            return () => clearInterval(timer)
        }
    }, [oAuthPopup])

    return (
        <section className="flex min-h-svh flex-col items-center justify-center gap-10">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    value={value.email}
                    onChange={e => setValue({ ...value, email: e.target.value })}
                    type="email"
                    className="border"
                    placeholder="email"
                />
                <input
                    value={value.name}
                    onChange={e => setValue({ ...value, name: e.target.value })}
                    type="text"
                    className="border"
                    placeholder="name optional"
                />
                <input
                    value={value.password}
                    onChange={e => setValue({ ...value, password: e.target.value })}
                    type="password"
                    className="border"
                    placeholder="password"
                />
                <button className="border" type="submit">
                    submit
                </button>
            </form>
            <button
                className="border"
                onClick={() => {
                    handleWindowOpen(Providers.GOOGLE)
                }}
            >
                google
            </button>
            <button
                className="border"
                onClick={() => {
                    handleWindowOpen(Providers.YANDEX)
                }}
            >
                yandex
            </button>
            <button
                className="border"
                onClick={() => {
                    handleWindowOpen(Providers.MAILRU)
                }}
            >
                mailru
            </button>
            <div className="flex flex-col">
                {data?.name}
                <button
                    className="border"
                    onClick={() => {
                        authService.logout('user')
                    }}
                >
                    logout
                </button>
            </div>
            <div>
                <button
                    className="border"
                    onClick={() => {
                        authService
                            .users()
                            .then(el => setUsers(el.data))
                            .catch(e => console.log(e))
                    }}
                >
                    Get users
                </button>
                <ul>{users && users.map(el => <li key={el.email}>{el.email}</li>)}</ul>
            </div>
        </section>
    )
}
