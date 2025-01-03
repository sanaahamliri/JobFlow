import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../lib/dbConnect'
import User from '../../../models/User'
import bcrypt from 'bcryptjs'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    await dbConnect()

    const { name, email, password } = req.body

    try {
      const existingUser = await User.findOne({ email })

      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' })
      }

      const hashedPassword = await bcrypt.hash(password, 10)

      const user = await User.create({
        name,
        email,
        password: hashedPassword,
      })

      res.status(201).json({ message: 'User created successfully', userId: user._id.toString() })
    } catch (error) {
      res.status(500).json({ message: 'Error creating user', error })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

