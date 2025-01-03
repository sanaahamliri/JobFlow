import { NextResponse } from 'next/server'
import dbConnect from '../../../../lib/dbConnect'
import User from '../../../../models/User'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"

export async function GET(request: Request) {
  await dbConnect()
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const size = parseInt(searchParams.get('size') || '10')

  const applications = await Application.find()
    .skip((page - 1) * size)
    .limit(size)
    .populate('user', 'name email')
    .populate('job', 'title company')
    .sort({ createdAt: -1 })

  const totalCount = await Application.countDocuments()

  return NextResponse.json({
    applications,
    totalPages: Math.ceil(totalCount / size),
    currentPage: page,
  })
}

export async function PUT(request: Request) {
  await dbConnect()
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id, status, notes } = await request.json()

  try {
    const updatedApplication = await Application.findByIdAndUpdate(
      id,
      { status, notes },
      { new: true }
    )

    if (!updatedApplication) {
      return NextResponse.json({ message: 'Application not found' }, { status: 404 })
    }

    return NextResponse.json(updatedApplication)
  } catch (error) {
    return NextResponse.json({ message: 'Error updating application', error }, { status: 500 })
  }
}

