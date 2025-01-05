import { NextResponse } from 'next/server'
import dbConnect from '../../../../lib/dbConnect'
import Application from '../../../../models/Application'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"

/**
 * @swagger
 * tags:
 *   name: Applications
 *   description: Application operations
 */

/**
 * @swagger
 * /applications/{id}:
 *   get:
 *     tags: [Applications]
 *     summary: Retrieve an application by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: An application object
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
 *       404:
 *         description: Application not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /applications/{id}:
 *   put:
 *     tags: [Applications]
 *     summary: Update an application by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: accepted
 *               notes:
 *                 type: string
 *                 example: Application reviewed.
 *     responses:
 *       200:
 *         description: Application updated successfully
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
 *       404:
 *         description: Application not found
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /applications/{id}:
 *   delete:
 *     tags: [Applications]
 *     summary: Delete an application by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Application deleted successfully
 *       404:
 *         description: Application not found
 *       500:
 *         description: Server error
 */

export async function GET(request: Request, { params }: { params: { id: string } }) {
  await dbConnect()

  try {
    const application = await Application.findById(params.id)
    if (!application) {
      return NextResponse.json({ message: 'Application not found' }, { status: 404 })
    }
    return NextResponse.json(application)
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  await dbConnect()
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const application = await Application.findByIdAndUpdate(params.id, body, { new: true })
    if (!application) {
      return NextResponse.json({ message: 'Application not found' }, { status: 404 })
    }
    return NextResponse.json(application)
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await dbConnect()

  try {
    const application = await Application.findByIdAndDelete(params.id)
    if (!application) {
      return NextResponse.json({ message: 'Application not found' }, { status: 404 })
    }
    return NextResponse.json({ message: 'Application deleted successfully' }, { status: 204 })
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}

