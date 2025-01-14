import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_cookie')?.value
    const rol = request.cookies.get('user_role')?.value

    if (!token) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    const res = await fetch('https://egreso-party.vercel.app/api/auth/check', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      credentials: 'include'
    })

    const data = await res.json()

    if (!data.isAuthorized) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    const requestedPath = request.nextUrl.pathname

    if (rol === 'admin') {
      // Admin puede acceder a todas las rutas
      if (requestedPath === '/login') {
        return NextResponse.redirect(new URL('/home', request.url))
      }
      return NextResponse.next()
    } else if (rol === 'contador') {
      // Contador solo puede acceder a /home
      if (requestedPath === '/home') {
        return NextResponse.next()
      } else {
        return NextResponse.redirect(new URL('/home', request.url))
      }
    } else {
      // Si el rol no está definido o no es reconocido, redirigir a la página de inicio
      return NextResponse.redirect(new URL('/', request.url))
    }
  } catch (error) {
    console.error('Middleware Error:', error)
    return NextResponse.redirect(new URL('/', request.url))
  }
}

export const config = {
  matcher: ['/home', '/login', '/home/:path*'] // Protege /home y todas sus subrutas
}
