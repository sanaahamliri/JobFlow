import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../lib/dbConnect'
import Job from '../../../models/Job'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect()

  if (req.method === 'GET') {
    const { page = '1', size = '10', search = '', type = '' } = req.query

    const query: any = {}
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ]
    }
    if (type) {
      query.type = type
    }

    const jobs = await Job.find(query)
      .skip((Number(page) - 1) * Number(size))
      .limit(Number(size))
      .sort({ createdAt: -1 })

    const totalCount = await Job.countDocuments(query)

    res.json({
      jobs,
      totalPages: Math.ceil(totalCount / Number(size)),
      currentPage: Number(page),
    })
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

