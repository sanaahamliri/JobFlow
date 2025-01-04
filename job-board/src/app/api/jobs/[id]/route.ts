import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/dbConnect';
import Job from '../../../../models/Job';

export async function GET(request: Request, { params }: { params: { id: string } }) {
    await dbConnect(); // 

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
