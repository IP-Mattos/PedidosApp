import { messages } from '@/utils/message'
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import jwt from 'jsonwebtoken'
import { connectMongoDB } from '@/libs/mongodb'
import User from '@/models/User'

export async function GET() {
  try {
    const headerList = headers()
    const token = headerList.get('authorization')?.replace('Bearer ', '') // Ajuste para obtener el token del encabezado

    // Validar token
    if (!token) {
      return NextResponse.json(
        {
          message: messages.error.notAuthorized
        },
        {
          status: 401
        }
      )
    }

    try {
      const decoded = jwt.verify(token, 'secret') as { data: { _id: string } } // Ajuste para el tipo de token decodificado

      await connectMongoDB()
      const userFind = await User.findById(decoded.data._id)

      // Validar Usuario
      if (!userFind) {
        return NextResponse.json(
          {
            message: messages.error.userNotFound
          },
          {
            status: 404
          }
        )
      }

      return NextResponse.json(
        {
          isAuthorized: true,
          message: messages.success.authorized
        },
        {
          status: 200
        }
      )
    } catch (error) {
      return NextResponse.json(
        {
          message: messages.error.tokenNotValid
        },
        {
          status: 401
        }
      )
    }
  } catch (error) {
    return NextResponse.json(
      {
        message: messages.error.default
      },
      {
        status: 500
      }
    )
  }
}
