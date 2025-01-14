'use client'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { Egreso } from '@/types/index'
import EgresoSummary from '@/components/egreso/components/EgresoSummary'
import CajeroSelector from '@/components/egreso/components/CajeroSelector'
import EgresoList from '@/components/egreso/components/EgresoList'
import Pagination from '@/components/egreso/components/Pagination'
import moment from 'moment-timezone'
interface Cajero {
  name: string
  surname: string
  telefono: string
  cajero: string
}

export default function ViewEgreso() {
  const [egresos, setEgresos] = useState<Egreso[]>([])
  const [allEgresos, setAllEgresos] = useState<Egreso[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedCajero, setSelectedCajero] = useState<string>('')
  const [totalGeneralPesos, setTotalGeneralPesos] = useState(0)
  const [totalGeneralDolares, setTotalGeneralDolares] = useState(0)
  const [totalCajeroPesos, setTotalCajeroPesos] = useState(0)
  const [totalCajeroDolares, setTotalCajeroDolares] = useState(0)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [uniqueCajeros, setUniqueCajeros] = useState<Cajero[]>([])

  // Fetch all cashiers only once
  useEffect(() => {
    const fetchAllCashiers = async () => {
      try {
        const response = await fetch('/api/cashiers')
        if (!response.ok) throw new Error('Network response was not ok')
        const data = await response.json()
        setUniqueCajeros(data.cashiers)
      } catch (error) {
        console.error('Error fetching cashiers:', error)
      }
    }

    fetchAllCashiers()
  }, [])

  // Fetch egresos and calculate totals whenever dependencies change
  const fetchEgresos = useCallback(async (page: number, cajero: string, date: string) => {
    setIsLoading(true)
    try {
      const timezone = 'America/Argentina/Buenos_Aires'
      const formattedDate = date ? moment(date).tz(timezone).format('YYYY-MM-DD') : ''

      const query = `/api/egreso?page=${page}&limit=7&cajero=${cajero}&date=${formattedDate}`
      const response = await fetch(query)
      if (!response.ok) throw new Error('Network response was not ok')
      const data = await response.json()

      if (Array.isArray(data.egresos)) {
        const adjustedEgresos = data.egresos.map((egreso: Egreso) => ({
          ...egreso,
          date: moment.utc(egreso.date).tz(timezone).format('YYYY-MM-DD')
        }))

        const sortedEgresos = adjustedEgresos.sort((a: Egreso, b: Egreso) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        })

        setEgresos(sortedEgresos)
        setTotalPages(data.totalPages)
        setCurrentPage(data.currentPage)
      } else {
        throw new Error('Data format is incorrect')
      }
    } catch (error) {
      console.error('Error fetching egresos:', error)
      setEgresos([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchEgresos(currentPage, selectedCajero, selectedDate)
  }, [currentPage, selectedCajero, selectedDate, fetchEgresos])

  useEffect(() => {
    const fetchAllEgresos = async () => {
      try {
        const response = await fetch(`/api/egreso?page=1&limit=1000`)
        if (!response.ok) throw new Error('Network response was not ok')
        const data = await response.json()

        if (Array.isArray(data.egresos)) {
          const timezone = 'America/Argentina/Buenos_Aires'
          const adjustedEgresos = data.egresos.map((egreso: Egreso) => ({
            ...egreso,
            date: moment.utc(egreso.date).tz(timezone).format('YYYY-MM-DD')
          }))

          setAllEgresos(adjustedEgresos)
        } else {
          throw new Error('Data format is incorrect')
        }
      } catch (error) {
        console.error('Error fetching all egresos:', error)
      }
    }
    fetchAllEgresos()
  }, [])

  useEffect(() => {
    const calculateTotals = () => {
      let filteredEgresos = allEgresos

      const timezone = 'America/Argentina/Buenos_Aires'
      const today = moment().tz(timezone).format('YYYY-MM-DD')

      if (selectedDate) {
        filteredEgresos = filteredEgresos.filter((egreso) => egreso.date.startsWith(selectedDate))
      } else {
        filteredEgresos = filteredEgresos.filter((egreso) => egreso.date.startsWith(today))
      }

      if (selectedCajero) {
        filteredEgresos = filteredEgresos.filter((egreso) => egreso.name === selectedCajero)
      }

      const totalPesos = filteredEgresos.reduce((sum, egreso) => sum + (egreso.totalAmount || 0), 0)
      const totalDolares = filteredEgresos.reduce((sum, egreso) => sum + (egreso.dollars || 0), 0)

      setTotalGeneralPesos(totalPesos)
      setTotalGeneralDolares(totalDolares)

      if (selectedCajero) {
        setTotalCajeroPesos(totalPesos)
        setTotalCajeroDolares(totalDolares)
      } else {
        setTotalCajeroPesos(0)
        setTotalCajeroDolares(0)
      }
    }

    calculateTotals()
  }, [selectedCajero, selectedDate, allEgresos])

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timezone = 'America/Argentina/Buenos_Aires'
    const dateValue = e.target.value
    const selectedDate = dateValue ? moment.tz(dateValue, timezone).format('YYYY-MM-DD') : ''
    setSelectedDate(selectedDate)
  }

  return (
    <div className='min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8'>
      <h1 className='text-2xl sm:text-3xl lg:text-4xl font-light text-gray-800 mb-8 mt-20 text-center'>Egresos</h1>
      <Link
        href='/home'
        className='block w-full max-w-md px-6 py-3 mb-8 mx-auto bg-blue-500 text-white font-semibold rounded-md text-center transition-transform duration-300 hover:bg-blue-600'
      >
        Crear Egreso
      </Link>

      <EgresoSummary
        totalGeneralPesos={totalGeneralPesos}
        totalGeneralDolares={totalGeneralDolares}
        selectedCajero={selectedCajero}
        totalCajeroPesos={totalCajeroPesos}
        totalCajeroDolares={totalCajeroDolares}
      />
      <div className='flex flex-col md:flex-row justify-between items-center mb-4 w-full md:w-1/2 mx-auto'>
        <CajeroSelector
          selectedCajero={selectedCajero}
          setSelectedCajero={setSelectedCajero}
          uniqueCajeros={uniqueCajeros}
          setCurrentPage={setCurrentPage}
        />
        <div className='flex items-center gap-4 mt-4 md:mt-0'>
          <label htmlFor='date' className='block text-gray-700 font-semibold'>
            Filtrar por fecha:
          </label>
          <input
            type='date'
            id='date'
            value={selectedDate}
            onChange={handleDateChange}
            className='p-2 border border-gray-300 rounded-md'
          />
        </div>
      </div>

      {isLoading ? (
        <div className='flex justify-center items-center h-64'>
          <div className='animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900'></div>
        </div>
      ) : (
        <>
          <EgresoList egresos={egresos} />
          <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
        </>
      )}
    </div>
  )
}
