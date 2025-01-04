import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import Job from '../../../models/Job';

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
