import NotificationContext from '@/context/NotificationContext'
import axios, { AxiosRequestConfig } from 'axios'
import { useRouter } from 'next/navigation'
import { useContext } from 'react'

interface AuthFetchProps {
  endpoint: string
  redirectRoute?: string
  formData?: any
  options?: AxiosRequestConfig<any>
}

export function useAuthFetch() {
  const { showNotification } = useContext(NotificationContext)
  const router = useRouter()

  const authRouter = async ({ endpoint, formData, redirectRoute, options }: AuthFetchProps) => {
    try {
      // Asegurarse de que dollars sea 0 si no está definido o es NaN
      if (formData) {
        formData.dollars =
          formData.dollars !== undefined && !isNaN(Number(formData.dollars)) ? Number(formData.dollars) : 0
      }

      const method = endpoint === 'logout' ? 'post' : 'post' // Usualmente POST para logout, pero podría variar
      const url = endpoint === 'egreso' ? `/api/${endpoint}` : `/api/auth/${endpoint}`

      const { data } = await axios.request({
        url,
        method,
        data: formData,
        ...options
      })

      showNotification({
        msj: data.message,
        open: true,
        status: 'success'
      })

      if (redirectRoute) router.push(redirectRoute)
    } catch (error: any) {
      showNotification({
        msj: error.response?.data?.message || 'An error occurred',
        open: true,
        status: 'error'
      })
    }
  }

  return authRouter
}
