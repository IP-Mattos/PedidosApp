import { Egreso } from '@/types/index'
import EgresoCard from '@/components/egreso/components/EgresoCard'

interface EgresoListProps {
  egresos: Egreso[]
}

export default function EgresoList({ egresos }: EgresoListProps) {
  if (egresos.length === 0) {
    return (
      <div className='text-center mt-8 text-gray-600'>
        <h2 className='text-lg sm:text-xl font-semibold'>No hay egresos disponibles para el día de hoy.</h2>
      </div>
    )
  }

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
      {egresos.map((egreso) => (
        <EgresoCard key={egreso._id} egreso={egreso} />
      ))}
    </div>
  )
}
