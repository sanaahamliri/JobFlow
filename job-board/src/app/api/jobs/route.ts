import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import Job from '../../../models/Job';

/**
 * @swagger
 * tags:
 *   name: Jobs
 *   description: Job operations
 */

/**
 * @swagger
 * /jobs:
 *   get:
 *     tags: [Jobs]
 *     summary: Retrieve a list of jobs
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: size
 *         required: false
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: A list of jobs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                 jobs:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       description:
 *                         type: string
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /jobs:
 *   post:
 *     tags: [Jobs]
 *     summary: Create a new job
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Software Engineer
 *               description:
 *                 type: string
 *                 example: Responsible for developing applications.
 *     responses:
 *       201:
 *         description: Job created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 job:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     title:
 *                       type: string
 *                     description:
 *                       type: string
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */

export async function GET(request: Request) {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const size = parseInt(searchParams.get('size') || '10', 10);

    try {
        const jobs = await Job.find()
            .skip((page - 1) * size)
            .limit(size);
        const total = await Job.countDocuments();
        return NextResponse.json({ total, jobs });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    await dbConnect();

    try {
        const body = await request.json();
        const job = new Job(body);
        await job.save();
        return NextResponse.json(job, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 400 });
    }
}
