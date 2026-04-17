'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'

type User = {
  id: string
  username: string
  name?: string | null
  image?: string | null
  createdAt?: string | Date | null
}

type AuthContext = {
  user: User | null
  loading: boolean
  login: (username: string, password: string) => Promise<{ error?: string }>
  register: (username: string, password: string, name?: string) => Promise<{ error?: string }>
  logout: () => Promise<void>
}

const AuthCtx = createContext<AuthContext>({
  user: null,
  loading: true,
  login: async () => ({}),
  register: async () => ({}),
  logout: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Check session on mount
  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.data?.user) setUser(data.data.user)
      })
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (username: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    const data = await res.json()
    if (!res.ok) return { error: data.error || 'Giriş başarısız' }
    setUser(data.data.user)

    // localStorage → DB sync after successful login
    if (typeof window !== 'undefined') {
      try {
        const localData = localStorage.getItem('onepiece-watched')
        if (localData) {
          const episodes = JSON.parse(localData)
          await fetch('/api/progress/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ episodes }),
          })
          localStorage.removeItem('onepiece-watched')
        }
      } catch (e) {
        console.error('Failed to sync watch progress:', e)
      }
    }

    return {}
  }, [])

  const register = useCallback(async (username: string, password: string, name?: string) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, name }),
    })
    const data = await res.json()
    if (!res.ok) return { error: data.error || 'Kayıt başarısız' }
    setUser(data.data.user)

    // localStorage → DB sync after successful registration
    if (typeof window !== 'undefined') {
      try {
        const localData = localStorage.getItem('onepiece-watched')
        if (localData) {
          const episodes = JSON.parse(localData)
          await fetch('/api/progress/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ episodes }),
          })
          localStorage.removeItem('onepiece-watched')
        }
      } catch (e) {
        console.error('Failed to sync watch progress:', e)
      }
    }

    return {}
  }, [])

  const logout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
  }, [])

  return (
    <AuthCtx.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthCtx.Provider>
  )
}

export function useAuth() {
  return useContext(AuthCtx)
}
