import { NextRequest, NextResponse } from 'next/server'
import { connectMongoDB } from '@/libs/mongodb'
import Cashier from '@/models/Cashier'

export async function POST(request: NextRequest) {
  try {
    await connectMongoDB()
    const body = await request.json()
    const { cashier, surname, totalAmount, cheques, dollars, counter } = body

    // Validar campos obligatorios
    if (!cashier || !surname || !totalAmount) {
      return NextResponse.json({ message: 'Cajero, Apellido y Monto Total son requeridos' }, { status: 400 })
    }

    // Validar tipos de datos
    if (typeof totalAmount !== 'number' || isNaN(totalAmount)) {
      return NextResponse.json({ message: 'Cantidad Total debe ser un número válido' }, { status: 400 })
    }

    if (dollars !== undefined && (typeof dollars !== 'number' || isNaN(dollars))) {
      return NextResponse.json({ message: 'Dólares debe ser un número válido' }, { status: 400 })
    }

    // Crear nuevo cajero
    const newCashier = new Cashier({
      name: cashier,
      surname: surname,
      totalAmount: totalAmount,
      date: new Date(),
      dollars: dollars !== undefined ? dollars : 0,
      counter: counter,
      cheques: cheques
        ? cheques.map(
            (cheque: {
              name: string
              amount: number
              phoneNumber: number
              deliveryDate: string | number | Date
              expiryDate: string | number | Date
            }) => ({
              chequeName: cheque.name,
              chequePhoneNumber: cheque.phoneNumber ? Number(cheque.phoneNumber) : 0,
              chequeAmount: Number(cheque.amount),
              deliveryDate: new Date(cheque.deliveryDate),
              expiryDate: new Date(cheque.expiryDate)
            })
          )
        : []
    })

    await newCashier.save()

    return NextResponse.json(
      {
        newCashier: newCashier,
        message: 'Egreso creado exitosamente'
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating cashier:', error)
    return NextResponse.json({ message: 'Error al crear egreso' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectMongoDB()

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '10', 10)
    const cajero = searchParams.get('cajero') || ''
    let date = searchParams.get('date') || ''

    // Validar los parámetros de paginación
    if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
      return NextResponse.json({ message: 'Parámetros de paginación no válidos' }, { status: 400 })
    }

    // Si la fecha está definida, sumar un día

    const skip = (page - 1) * limit

    // Crear el filtro para el cajero y la fecha
    let filter: any = {}
    if (cajero) {
      filter.name = cajero
    }
    if (date) {
      // Definir el inicio y el fin del día en formato ISO
      const startDate = new Date(date)
      startDate.setHours(0, 0, 0, 0) // Inicio del día

      // Establecer el final del intervalo del día adicional
      const endDate = new Date(date)
      endDate.setHours(0, 0, 0, 0) // Inicio del siguiente día (a medianoche)
      endDate.setDate(endDate.getDate() + 1) // Sumar un día

      filter.date = { $gte: startDate, $lt: endDate }
    }

    // Mostrar la consulta completa para depuración

    // Obtener los egresos con paginación y filtros
    const egresos = await Cashier.find(filter).sort({ date: -1 }).skip(skip).limit(limit)

    const totalEgresos = await Cashier.countDocuments(filter)

    // Verificar si hay egresos
    if (egresos.length === 0) {
      return NextResponse.json({ message: 'No se encontraron egresos' }, { status: 404 })
    }

    // Responder con los egresos y la información de paginación
    return NextResponse.json(
      {
        egresos,
        totalPages: Math.ceil(totalEgresos / limit),
        currentPage: page,
        message: 'Éxito'
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching egresos:', error)
    return NextResponse.json({ message: 'Ocurrió un error al obtener los egresos' }, { status: 500 })
  }
}
