import { NextRequest, NextResponse } from 'next/server'
import { messages } from '@/utils/message'

export async function POST(request: NextRequest) {
  try {
    // Elimina la cookie de autenticación
    const response = NextResponse.json({ message: messages.success.logoutSuccess }, { status: 200 })

    response.cookies.set('auth_cookie', '', {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: -1, // Establece una fecha en el pasado para eliminar la cookie
      path: '/'
    })

    return response
  } catch (error) {
    return NextResponse.json({ message: messages.error.default }, { status: 500 })
  }
}
