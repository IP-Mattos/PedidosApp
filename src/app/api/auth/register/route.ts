import { NextRequest, NextResponse } from 'next/server'
import { isValidEmail } from '@/utils/isValidEmail'
import User, { IUserSchema } from '@/models/User'
import { connectMongoDB } from '@/libs/mongodb'
import { messages } from '@/utils/message'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    await connectMongoDB()
    const body = await request.json()
    const { nombre, apellido, email, password, confirmPassword } = body

    // Validar campos
    if (!nombre || !apellido || !email || !password || !confirmPassword) {
      return NextResponse.json({ message: messages.error.needProps }, { status: 400 })
    }

    // Validar Email
    if (!isValidEmail(email)) {
      return NextResponse.json(
        {
          message: messages.error.emailNotValid
        },
        {
          status: 400
        }
      )
    }

    // Validar Password
    if (password !== confirmPassword) {
      return NextResponse.json(
        {
          message: messages.error.passwordNotMatch
        },
        {
          status: 400
        }
      )
    }

    // Verificar si el usuario ya existe
    const userFind = await User.findOne({ email })
    if (userFind) {
      return NextResponse.json(
        {
          message: messages.error.emailExist
        },
        {
          status: 400
        }
      )
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10)

    // Crear el nuevo usuario con el rol "admin"
    const newUser: IUserSchema = new User({
      nombre,
      apellido,
      email,
      password: hashedPassword,
      rol: 'admin' // Añadir el campo rol con valor "admin"
    })

    const { password: UserPass, ...rest } = newUser._doc

    // Guardar el usuario en la base de datos
    await newUser.save()

    // Generar un token JWT
    const token = jwt.sign({ data: rest }, 'secret', {
      expiresIn: 86400
    })

    // Crear la respuesta
    const response = NextResponse.json(
      {
        newUser: rest,
        message: messages.success.userCreated
      },
      {
        status: 200
      }
    )

    // Configurar la cookie de autenticación
    response.cookies.set('auth_cookie', token, {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400,
      path: '/'
    })

    return response
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

export async function PUT(request: NextRequest) {
  try {
    await connectMongoDB()
    const body = await request.json()
    const { email, rol } = body

    // Validar campos
    if (!email || !rol) {
      return NextResponse.json({ message: messages.error.needProps }, { status: 400 })
    }

    // Buscar el usuario por email
    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json(
        {
          message: messages.error.userNotFound
        },
        {
          status: 404
        }
      )
    }

    // Actualizar solo el campo rol
    user.rol = rol
    await user.save()

    return NextResponse.json(
      {
        message: messages.success,
        user
      },
      {
        status: 200
      }
    )
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
