'use client'
import { Form } from '@/components/form'
import { useAuthFetch } from '@/hooks/useAuthFetch'
import { useLoading } from '@/hooks/useLoading'
import { useCheckAuth } from '@/hooks/useAuth'

export default function LoginPage() {
  const { isLoading, startLoading, finishLoading } = useLoading()
  const authFetch = useAuthFetch()

  // Utiliza el hook para verificar la autenticación
  useCheckAuth()

  const login = async (formData: any) => {
    startLoading()
    try {
      await authFetch({
        endpoint: 'login',
        redirectRoute: '/home',
        formData
      })
    } catch (error) {
      console.error('Error durante el inicio de sesión:', error)
    }
    finishLoading()
  }

  return (
    <div className='min-h-screen flex flex-col items-center justify-center p-2'>
      <Form onSubmit={login} title='Ingresar' description={'Egresos App'}>
        <div className='my-[10px] flex flex-col gap-4'>
          <Form.Input label='Email' name='email' placeholder='Email...' type='text' />
          <Form.Input label='Contraseña' name='password' placeholder='Contraseña...' type='password' />
        </div>
        <Form.SubmitButton buttonText='Login' isLoading={isLoading} />
      </Form>
    </div>
  )
}
