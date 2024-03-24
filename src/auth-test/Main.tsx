'use client'

import { FormEvent, useState } from 'react'

import { authService, IAuthResponse, IUser } from '@/shared/api/auth.service'

export default function Main() {
    const [users, setUsers] = useState<IUser[]>([])
    const [data, setData] = useState<IAuthResponse>()
    const [value, setValue] = useState({
        email: '',
        password: '',
        name: '',
    })

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        authService.main('registration', value).then(d => setData(d.data))
    }
    console.log(data)

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
            <div className="flex flex-col">
                {data?.name}
                <button
                    className="border"
                    onClick={() => {
                        authService.logout()
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
