import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function useCheckAuth() {
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Obtener el token de las cookies
        const token = document.cookie.split('; ').find((row) => row.startsWith('auth_cookie='))
        const tokenValue = token ? token.split('=')[1] : null

        if (tokenValue) {
          // Verifica la autenticación del usuario
          const res = await fetch('/api/auth/check', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${tokenValue}` // Enviar el token como Bearer Token
            },
            credentials: 'include' // Asegura que las cookies se envíen con la solicitud
          })

          if (res.ok) {
            const data = await res.json()
            if (data.isAuthorized) {
              router.push('/home')
            }
          } else {
            console.error('Error al verificar autenticación:', res.statusText)
          }
        }
      } catch (error) {
        console.error('Error al verificar autenticación:', error)
      }
    }

    checkAuth()
  }, [router])
}
