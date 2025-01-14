import { useState, useEffect } from 'react'
import { formatNumber, getCurrentDate } from '@/utils/formatters'

interface EgresoSummaryProps {
  totalGeneralPesos: number
  totalGeneralDolares: number
  selectedCajero: string
  totalCajeroPesos: number
  totalCajeroDolares: number
}

export default function EgresoSummary({
  totalGeneralPesos,
  totalGeneralDolares,
  selectedCajero,
  totalCajeroPesos,
  totalCajeroDolares
}: EgresoSummaryProps) {
  const [currentDate, setCurrentDate] = useState(getCurrentDate())

  useEffect(() => {
    setCurrentDate(getCurrentDate())
  }, [])

  return (
    <div className='text-center mt-8 mb-8'>
      <h2 className='text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800'>
        Total General de Egresos en Pesos: ${formatNumber(totalGeneralPesos)}
      </h2>
      <h2 className='text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800'>
        Total General de Egresos en Dólares: ${formatNumber(totalGeneralDolares)}
      </h2>
      {selectedCajero && (
        <>
          <h2 className='text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800 mt-4'>
            Egresos de {selectedCajero} en Pesos: ${formatNumber(totalCajeroPesos)}
          </h2>
          <h2 className='text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800'>
            Egresos de {selectedCajero} en Dólares: ${formatNumber(totalCajeroDolares)}
          </h2>
        </>
      )}
      <h2 className='text-md sm:text-lg text-gray-600 mt-4'>Fecha: {currentDate}</h2>
      <h2 className='text-md sm:text-lg text-gray-600'>Cajero: {selectedCajero || 'Todos'}</h2>
    </div>
  )
}
