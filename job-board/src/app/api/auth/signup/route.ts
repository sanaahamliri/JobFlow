import { NextResponse } from 'next/server'
import dbConnect from '../../../../lib/dbConnect'
import User from '../../../../models/User'
import bcrypt from 'bcryptjs'

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication operations
 */

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     tags: [Auth]
 *     summary: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User created successfully
 *                 userId:
 *                   type: string
 *       400:
 *         description: User already exists
 *       500:
 *         description: Error creating user
 */

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

