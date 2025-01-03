import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../lib/dbConnect'
import Application from '../../../models/Application'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect()
  const session = await getServerSession(req, res, authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (req.method === 'GET') {
    const { page = '1', size = '10' } = req.query

    const applications = await Application.find()
      .skip((Number(page) - 1) * Number(size))
      .limit(Number(size))
      .populate('user', 'name email')
      .populate('job', 'title company')
      .sort({ createdAt: -1 })

    const totalCount = await Application.countDocuments()

    res.json({
      applications,
      totalPages: Math.ceil(totalCount / Number(size)),
      currentPage: Number(page),
    })
  } else if (req.method === 'PUT') {
    const { id, status, notes } = req.body

    const updatedApplication = await Application.findByIdAndUpdate(
      id,
      { status, notes },
      { new: true }
    )

    res.json(updatedApplication)
  } else {
    res.setHeader('Allow', ['GET', 'PUT'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

