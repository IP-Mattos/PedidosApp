'use client'
import { useRouter } from 'next/navigation'
import { useAuthFetch } from '@/hooks/useAuthFetch'

export default function LogoutPage() {
  const authFetch = useAuthFetch()
  const router = useRouter()

  const logout = async () => {
    try {
      await authFetch({
        endpoint: 'logout', // Asegúrate de que este endpoint esté configurado en tu backend
        redirectRoute: '/' // Redirige a la página de inicio de sesión después del logout
      })
    } catch (error) {
      console.error('Logout failed', error)
    } finally {
      router.push('/') // Redirige al usuario a la página de inicio de sesión
    }
  }

  return (
    <div>
      <button
        onClick={logout}
        className='text-gray-600 hover:text-red lg:text-xl -500 text-base block px-3 py-2 rounded-md  font-medium transition-colors duration-300 w-full text-center'
      >
        Cerrar Session
      </button>
    </div>
  )
}
