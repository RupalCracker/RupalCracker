import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Application } from '@/models/Application';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const application = await Application.findById(id);

    if (!application) {
      return NextResponse.json(
        { success: false, error: 'Application not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: application,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching application:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch application',
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    const application = await Application.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );

    if (!application) {
      return NextResponse.json(
        { success: false, error: 'Application not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: application,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating application:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to update application',
      },
      { status: 500 }
    );
  }
}
