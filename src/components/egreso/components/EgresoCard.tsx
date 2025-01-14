import { useState } from 'react'
import { Egreso } from '@/types/index'
import { formatNumber, formatDate } from '@/utils/formatters'

interface EgresoCardProps {
  egreso: Egreso
}

export default function EgresoCard({ egreso }: EgresoCardProps) {
  const [expandedCheques, setExpandedCheques] = useState(false)

  const toggleCheques = () => {
    setExpandedCheques(!expandedCheques)
  }

  return (
    <div className='bg-white rounded-lg p-6 shadow-md border border-gray-200 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 '>
      <div className='flex-cols justify-between items-start mb-4 xl:flex '>
        <h2 className='text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800'>{egreso.name}</h2>
        <span className='text-sm sm:text-base text-gray-500 '>{formatDate(egreso.date)}</span>
      </div>

      <div className='space-y-2'>
        {egreso.totalAmount !== null && (
          <p className='text-lg sm:text-xl lg:text-2xl font-bold text-gray-700'>
            Pesos: ${formatNumber(egreso.totalAmount)}
          </p>
        )}
        {egreso.dollars !== null && (
          <p className='text-lg sm:text-xl lg:text-2xl font-bold text-gray-700'>
            Dólares: ${formatNumber(egreso.dollars)}
          </p>
        )}
        {egreso.counter?.length > 0 && (
          <p className='text-lg sm:text-xl lg:text-2xl font-bold text-gray-700'>Contador: {egreso.counter}</p>
        )}
        <div className='mt-4'>
          {egreso.cheques.length > 0 && (
            <>
              <button className='text-blue-500 underline' onClick={toggleCheques}>
                {expandedCheques ? 'Ocultar Cheques' : 'Mostrar Cheques'}
              </button>
              {expandedCheques && (
                <ul className='mt-2 space-y-2'>
                  {egreso.cheques.map((cheque, index) => (
                    <li key={index} className='p-4 border border-gray-200 rounded-md'>
                      <p className='text-md sm:text-lg lg:text-xl font-semibold text-gray-800'>
                        Nombre: {cheque.chequeName}
                      </p>
                      {cheque.chequePhoneNumber ? (
                        <p className='text-sm sm:text-base text-gray-600'>Telefono: {cheque.chequePhoneNumber}</p>
                      ) : null}
                      <p className='text-sm sm:text-base text-gray-600'>Monto: ${formatNumber(cheque.chequeAmount)}</p>
                      <p className='text-sm sm:text-base text-gray-600'>
                        Fecha de Entrega: {formatDate(cheque.deliveryDate)}
                      </p>
                      <p className='text-sm sm:text-base text-gray-600'>
                        Fecha de Expiración: {formatDate(cheque.expiryDate)}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
