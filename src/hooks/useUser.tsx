'use client'
import { useState, useEffect } from 'react'

export interface User {
  _id: string
  email: string
  nombre: string
  apellido: string
  createdAt: string
  updatedAt: string
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/user', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include' // Para incluir la cookie de autenticación
        })

        if (!response.ok) {
          throw new Error('Failed to fetch user data')
        }

        const data = await response.json()
        setUser(data.user)
      } catch (error: any) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  return { user, loading, error }
}
