// /api/users.ts

import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import User from '@/models/User'
import { connectMongoDB } from '@/libs/mongodb'

export async function GET(request: NextRequest) {
  try {
    await connectMongoDB()
    const token = request.cookies.get('auth_cookie')?.value

    if (!token) {
      return NextResponse.json({ message: 'No token provided' }, { status: 401 })
    }

    const decoded: any = jwt.verify(token, 'secret')
    const user = await User.findById(decoded.data._id).select('-password') // Excluye el password

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ user }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: 'Authentication failed' }, { status: 401 })
  }
}
