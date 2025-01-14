'use client'

import { useState } from 'react'
import { Form } from '@/components/form'
import { useAuthFetch } from '@/hooks/useAuthFetch'
import { useLoading } from '@/hooks/useLoading'
import { ChequeList } from '@/components/form/components/ChequeList'
import { Console } from 'console'

const cajeros: { [key: string]: { telefono: string; surname: string } } = {
  Agustin: { telefono: '+59892721314', surname: 'Barboza' },
  Ivan: { telefono: '+59897199995', surname: 'Peña' },
  Martin: { telefono: '+59892204604', surname: 'Ramon' },
  Veronica: { telefono: '+59892527224', surname: 'Moreno' },
  Daniel: { telefono: '+59899762236', surname: 'Chapas' },
  'Juan Manuel': { telefono: '+59898668066', surname: 'Rodriguez' },
  Virginia: { telefono: '+59891249515', surname: 'Pérez' },
  'Virginia I': { telefono: '+59894724104', surname: 'Irureta' }, // Diferenciar por la inicial
  Juanse: { telefono: '+59898042604', surname: 'Rodriguez' }, // No proporcionaste apellido
  Lourdes: { telefono: '+59895935413', surname: 'Fuentes' },
  Eugenia: { telefono: '+59898301426', surname: 'Soba' },
  Estefani: { telefono: '+59895447205', surname: 'Cambio' }
}
  
interface EgresoFormProps {
  user: {
    nombre: string
    apellido: string
  } | null
}

export default function EgresoForm({ user }: EgresoFormProps) {
  const { isLoading, startLoading, finishLoading } = useLoading()
  const authFetch = useAuthFetch()
  const [resetForm, setResetForm] = useState(false)
  const [showWhatsAppOption, setShowWhatsAppOption] = useState(false)
  const [whatsappLink, setWhatsappLink] = useState('')
  const [whatsappLink2, setWhatsappLink2] = useState('')

  const CreateEgreso = async (formData: any) => {
    const totalAmount = Number(formData.totalAmount)
    const dollars = formData.dollars ? Number(formData.dollars) : 0

    if (isNaN(totalAmount) || totalAmount <= 0) {
      alert('Cantidad Total debe ser un número válido y mayor a cero.')
      return
    }

    startLoading()
    try {
      const [cashierName, cashierSurname] = formData.cashier.split(' ')
      await authFetch({
        endpoint: 'egreso',
        redirectRoute: '/home',
        formData: {
          ...formData,
          totalAmount,
          dollars,
          cashier: cashierName,
          surname: cashierSurname,
          counter: user ? `${user.nombre} ${user.apellido}` : '' // Corrección aquí
        }
      })

      generateWhatsAppLink(formData)
      setShowWhatsAppOption(true)
    } catch (error) {
      console.error('Error al crear egreso', error)
      alert('Error al crear el egreso. Por favor, intente nuevamente.')
    } finally {
      finishLoading()
      setResetForm(true)
      setTimeout(() => setResetForm(false), 100)
    }
  }

  const generateWhatsAppLink = (formData: any) => {
    const egreso = { ...formData }

    const splitName = (fullName: string) => {
      const parts = fullName.trim().split(' ')
      if (parts.length > 1) {
        const surname = parts.pop()
        const name = parts.join(' ')
        return { name, surname }
      }
      return { name: fullName, surname: '' }
    }

    const { name: cashierName, surname: cashierSurname } = splitName(egreso.cashier)
    egreso.cashier = cashierName
    egreso.surname = cashierSurname
    const telefono = cajeros[cashierName]?.telefono
    if (telefono) {
      let message =
        `Se ha creado un nuevo egreso:\n` +
        `Cantidad: ${egreso.totalAmount} pesos\n` +
        `Cajero: ${egreso.cashier} ${egreso.surname}\n` +
        `Contador: ${user?.nombre + ' ' + user?.apellido}\n`

      if (egreso.dollars > 0) {
        message += `Dólares: ${egreso.dollars}\n`
      }

      if (egreso.cheques && egreso.cheques.length > 0) {
        // @ts-ignore
        message += `Cheques: \n ${egreso.cheques
          .map(
            (cheque: any) =>
              `Nombre: ${cheque.name} \n ` +
              `Cantidad: $ ${cheque.amount}\n ` +
              `Fecha Entrega: ${cheque.deliveryDate} \n ` +
              `Fecha de Vencimiento: ${cheque.expiryDate}`
          )
          .join(', ')}\n`
      }

      const encodedMessage = encodeURIComponent(message)
      const link = `https://wa.me/${telefono}?text=${encodedMessage}`
      const telefono2 = '+59891098170'
      const link2 = `https://wa.me/${telefono2}?text=${encodedMessage}`

      setWhatsappLink(link)
      setWhatsappLink2(link2)
    } else {
      setWhatsappLink('')
      setWhatsappLink2('')
    }
  }

  const sendWhatsAppMessage = () => {
    if (whatsappLink) {
      window.open(whatsappLink, '_blank')
    }
  }
  const sendWhatsAppMessage2 = () => {
    if (whatsappLink2) {
      window.open(whatsappLink2, '_blank')
    }
  }

  return (
    <div className='min-h-screen flex flex-col items-center justify-center lg:w-2/3 w-full px-4 mt-[-50px]'>
      {showWhatsAppOption ? (
        <div className='mb-8 text-center'>
          <h2 className='text-xl md:text-2xl font-bold mb-4'>Egreso creado exitosamente</h2>
          <div className='flex flex-col lg:flex-row justify-between w-full'>
            <button
              onClick={sendWhatsAppMessage}
              className='bg-green-500 hover:bg-green-600 text-white m-2 font-bold py-2 px-4 rounded'
            >
              Cajero
            </button>
            <button
              onClick={sendWhatsAppMessage2}
              className='bg-green-500 hover:bg-green-600 text-white m-2 font-bold py-2 px-4 rounded'
            >
              Anna
            </button>
          </div>
          <button
            onClick={() => setShowWhatsAppOption(false)}
            className='mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded'
          >
            Crear otro egreso
          </button>
        </div>
      ) : (
        <div>
          <h2 className='mb-4 text-lg font-bold text-center '>
            {user && <div>Bievenido, {user ? `${user.nombre} ${user.apellido}` : 'Guest'}!</div>}
          </h2>
          <Form
            onSubmit={CreateEgreso}
            title='Crear Egreso'
            description={'Completa los detalles del egreso'}
            reset={resetForm}
          >
            <div className='my-4 flex flex-col gap-4'>
              <Form.Select label='Cajero' name='cashier' required>
                <option value=''>Seleccionar un cajero</option>
                {Object.keys(cajeros).map((name) => (
                  <option key={name} value={`${name} ${cajeros[name].surname}`}>
                    {name} {cajeros[name].surname}
                  </option>
                ))}
              </Form.Select>
              <Form.Input
                label='Contador'
                name='counter'
                placeholder='Nombre del contador...'
                type='text'
                required
                defaultValue={user ? `${user.nombre} ${user.apellido}` : ''}
                readonly
              />
              <Form.Input
                label='Cantidad (Pesos)'
                name='totalAmount'
                placeholder='Cantidad en pesos...'
                type='number'
                required
              />
              <Form.Input label='Dólares' name='dollars' placeholder='Cantidad en dólares...' type='number' />
            </div>
            <ChequeList />
            <Form.SubmitButton buttonText='Crear' isLoading={isLoading} />
          </Form>
        </div>
      )}
    </div>
  )
}
