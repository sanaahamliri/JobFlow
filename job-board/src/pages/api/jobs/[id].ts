import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../lib/dbConnect'
import Job from '../../../models/Job'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect()

  const { id } = req.query

  if (req.method === 'GET') {
    try {
      const job = await Job.findById(id)

      if (!job) {
        return res.status(404).json({ message: 'Job not found' })
      }

      res.json(job)
    } catch (error) {
      res.status(500).json({ message: 'Error fetching job', error })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

