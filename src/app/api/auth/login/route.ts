import { NextRequest, NextResponse } from 'next/server'
import { connectMongoDB } from '@/libs/mongodb'
import User, { IUser } from '@/models/User'
import { messages } from '@/utils/message'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function POST(request: NextRequest) {
  try {
    // Conectar a la base de datos
    await connectMongoDB()

    // Obtener datos del cuerpo de la solicitud
    const body: IUser = await request.json()
    const { email, password } = body

    // Validar los campos
    if (!email || !password) {
      return NextResponse.json(
        {
          message: messages.error.needProps
        },
        {
          status: 400
        }
      )
    }

    // Buscar al usuario por correo electrónico
    const userFind = await User.findOne({ email })
    if (!userFind) {
      return NextResponse.json(
        {
          message: messages.error.userNotFound
        },
        {
          status: 401 // Código de estado para autenticación fallida
        }
      )
    }

    // Comparar las contraseñas
    const isCorrect = await bcrypt.compare(password, userFind.password)
    if (!isCorrect) {
      return NextResponse.json(
        {
          message: messages.error.incorrectPassword
        },
        {
          status: 401 // Código de estado para autenticación fallida
        }
      )
    }

    // Eliminar la contraseña del usuario antes de responder
    const { password: userPass, ...rest } = userFind._doc

    // Crear el token JWT con el rol del usuario
    const token = jwt.sign({ data: rest }, process.env.JWT_SECRET || 'default_secret', {
      expiresIn: '24h'
    })

    // Configurar la respuesta
    const response = NextResponse.json(
      { userLogged: rest, message: messages.success.loginSuccess, token },
      {
        status: 200
      }
    )

    // Configurar la cookie de autenticación
    response.cookies.set('auth_cookie', token, {
      secure: process.env.NODE_ENV === 'production', // Solo en producción
      sameSite: 'strict',
      maxAge: 86400, // 24 horas en segundos
      path: '/'
    })

    // Configurar la cookie de rol
    response.cookies.set('user_role', userFind.rol, {
      secure: process.env.NODE_ENV === 'production', // Solo en producción
      sameSite: 'strict',
      maxAge: 86400, // 24 horas en segundos
      path: '/'
    })
    return response
  } catch (error) {
    console.error('Login Error:', error) // Registrar errores para depuración
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
