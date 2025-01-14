import React from 'react'

interface Cajero {
  name: string
  surname: string
  telefono: string
  cajero: string
}

interface CajeroSelectorProps {
  selectedCajero: string
  setSelectedCajero: (cajero: string) => void
  uniqueCajeros: Cajero[]
  setCurrentPage: (page: number) => void
}

export default function CajeroSelector({
  selectedCajero,
  setSelectedCajero,
  uniqueCajeros,
  setCurrentPage
}: CajeroSelectorProps) {
  return (
    <div className='mb-8 text-center'>
      <label className='text-gray-800 font-medium mr-4' htmlFor='cajero-select'>
        Seleccionar Cajero:
      </label>
      <select
        id='cajero-select'
        className='p-2 border border-gray-300 rounded'
        value={selectedCajero}
        onChange={(e) => {
          setCurrentPage(1)
          setSelectedCajero(e.target.value)
        }}
      >
        <option value=''>Todos</option>
        {uniqueCajeros.map((cajero) => (
          <option key={cajero.cajero} value={cajero.name}>
            {cajero.name}
          </option>
        ))}
      </select>
    </div>
  )
}
