import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../lib/dbConnect'
import Application from '../../models/Application'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]/route"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect()
  const session = await getServerSession(req, res, authOptions)

  if (!session || !session.user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (req.method === 'POST') {
    const { jobId } = req.body

    try {
      const application = await Application.create({
        userId: session.user.id,
        jobId: jobId,
      })
      res.status(201).json(application)
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

