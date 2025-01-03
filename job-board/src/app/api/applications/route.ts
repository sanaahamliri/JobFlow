import { NextResponse } from 'next/server'
import dbConnect from '../../../lib/dbConnect'
import User from '../../../models/User'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"

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

