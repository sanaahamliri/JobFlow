import { NextResponse } from 'next/server'
import dbConnect from '../../../../lib/dbConnect'
import User from '../../../../models/User'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  await dbConnect()

  const { name, email, password } = await request.json()

  try {
    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    })

    return NextResponse.json({ message: 'User created successfully', userId: user._id.toString() }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: 'Error creating user', error }, { status: 500 })
  }
}

