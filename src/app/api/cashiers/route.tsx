// pages/api/cashiers.ts

import { connectMongoDB } from '@/libs/mongodb'
import Cajero from '@/models/Cajero'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    await connectMongoDB()

    // Obtener todos los cajeros desde el modelo Cajero
    const cashiers = await Cajero.find({}).select('name surname telefono -_id')

    return NextResponse.json({ cashiers }, { status: 200 })
  } catch (error) {
    console.error('Error fetching cashiers:', error)
    return NextResponse.json({ message: 'Error fetching cashiers' }, { status: 500 })
  }
}
