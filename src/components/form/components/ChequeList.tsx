'use client'

import { useContext } from 'react'
import { FormContext } from '../index'

interface ICheque {
  name: string
  phoneNumber: string
  deliveryDate: string
  expiryDate: string
  amount: string
}

export function ChequeList() {
  const { formValues, setFormValues } = useContext(FormContext)!

  // Asegúrate de que formValues.cheques sea un arreglo
  const cheques: ICheque[] = Array.isArray(formValues.cheques) ? formValues.cheques : []

  const addCheque = () => {
    setFormValues((prevValues) => ({
      ...prevValues,
      cheques: [...cheques, { name: '', deliveryDate: '', expiryDate: '', amount: '', phoneNumber: '' }]
    }))
  }

  const removeCheque = (index: number) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      cheques: cheques.filter((_, i: number) => i !== index)
    }))
  }

  const handleChequeChange = (index: number, field: keyof ICheque, value: string) => {
    // Si el campo es 'amount', verifica que el valor sea numérico
    if (field === 'amount' && value && isNaN(Number(value))) {
      alert('Cantidad del cheque debe ser numérica')
      return
    }

    const updatedCheques = cheques.map((cheque, i) => (i === index ? { ...cheque, [field]: value } : cheque))
    setFormValues((prevValues) => ({
      ...prevValues,
      cheques: updatedCheques
    }))
  }

  return (
    <div className='p-4 bg-white shadow-md rounded-lg'>
      <h3 className='text-lg font-semibold mb-4'>Cheques:</h3>
      {cheques.map((cheque, index) => (
        <div key={index} className='flex flex-col gap-3 mb-4 p-4 border border-gray-300 rounded-md'>
          <input
            type='text'
            placeholder='Nombre'
            value={cheque.name}
            onChange={(e) => handleChequeChange(index, 'name', e.target.value)}
            className='border border-gray-300 rounded-md p-2 w-full'
          />

          <input
            type='text'
            placeholder='Número'
            value={cheque.phoneNumber}
            onChange={(e) => handleChequeChange(index, 'phoneNumber', e.target.value)}
            className='border border-gray-300 rounded-md p-2 w-full'
          />
          <span>Fecha de Entrega:</span>
          <input
            type='date'
            value={cheque.deliveryDate}
            onChange={(e) => handleChequeChange(index, 'deliveryDate', e.target.value)}
            className='border border-gray-300 rounded-md p-2 w-full'
          />
          <span>Fecha de Vencimiento:</span>

          <input
            type='date'
            value={cheque.expiryDate}
            onChange={(e) => handleChequeChange(index, 'expiryDate', e.target.value)}
            className='border border-gray-300 rounded-md p-2 w-full'
          />
          <input
            type='number'
            placeholder='Cantidad'
            value={cheque.amount}
            onChange={(e) => handleChequeChange(index, 'amount', e.target.value)}
            className='border border-gray-300 rounded-md p-2 w-full'
          />
          <button
            type='button'
            onClick={() => removeCheque(index)}
            className='mt-2 bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded'
          >
            Eliminar
          </button>
        </div>
      ))}
      <button
        type='button'
        onClick={addCheque}
        className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded'
      >
        Añadir Cheque
      </button>
    </div>
  )
}
