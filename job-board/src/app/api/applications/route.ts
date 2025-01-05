import { NextResponse } from 'next/server'
import dbConnect from '../../../lib/dbConnect'
import User from '../../../models/User'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import Application from '@/src/models/Application'

/**
 * @swagger
 * tags:
 *   name: Applications
 *   description: Application operations
 */

/**
 * @swagger
 * /applications:
 *   post:
 *     tags: [Applications]
 *     summary: Create a new application
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               jobId:
 *                 type: string
 *                 example: jobId123
 *     responses:
 *       201:
 *         description: Application created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 jobId:
 *                   type: string
 *                 userId:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Error creating application
 */

export async function POST(request: Request) {
  await dbConnect()
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { jobId } = await request.json()

  try {
    const application = await Application.create({
      userId: session.user.id,
      jobId: jobId,
    })

    return NextResponse.json(application, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: 'Error creating application', error }, { status: 500 })
  }
}

