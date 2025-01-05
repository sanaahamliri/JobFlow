import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/dbConnect';
import Job from '../../../../models/Job';

/**
 * @swagger
 * tags:
 *   name: Jobs
 *   description: Job operations
 */

/**
 * @swagger
 * /jobs/{id}:
 *   get:
 *     tags: [Jobs]
 *     summary: Retrieve a job by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A job object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *       404:
 *         description: Job not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /jobs/{id}:
 *   put:
 *     tags: [Jobs]
 *     summary: Update a job by ID
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
 *               title:
 *                 type: string
 *                 example: Updated Job Title
 *               description:
 *                 type: string
 *                 example: Updated job description.
 *     responses:
 *       200:
 *         description: Job updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *       404:
 *         description: Job not found
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /jobs/{id}:
 *   delete:
 *     tags: [Jobs]
 *     summary: Delete a job by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Job deleted successfully
 *       404:
 *         description: Job not found
 *       500:
 *         description: Server error
 */

export async function GET(request: Request, { params }: { params: { id: string } }) {
    await dbConnect();

    try {
        const job = await Job.findById(params.id);
        if (!job) {
            return NextResponse.json({ message: 'Job not found' }, { status: 404 });
        }
        return NextResponse.json(job);
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    await dbConnect();
    try {
        const body = await request.json();
        const job = await Job.findByIdAndUpdate(params.id, body, { new: true });
        if (!job) {
            return NextResponse.json({ message: 'Job not found' }, { status: 404 });
        }
        return NextResponse.json(job);
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 400 });
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    await dbConnect();

    try {
        const job = await Job.findByIdAndDelete(params.id);
        if (!job) {
            return NextResponse.json({ message: 'Job not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Job deleted successfully' }, { status: 204 });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
