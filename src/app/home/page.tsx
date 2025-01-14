'use client'

import { useEffect, useState } from 'react'
import EgresoForm from '@/components/egreso/EgresoForm'

interface User {
  _id: string
  email: string
  nombre: string
  apellido: string
  createdAt: string
  updatedAt: string
}

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/users', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include'
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

  return (
    <main className='min-h-screen flex flex-col items-center justify-center p-4 mt-40 '>
      <EgresoForm user={user} />
    </main>
  )
}
