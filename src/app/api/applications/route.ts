import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Application } from '@/models/Application';
import { calculateEligibility } from '@/lib/eligibility';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    // Create new application
    const application = new Application(body);

    // Calculate eligibility
    const eligibilityResult = calculateEligibility(application);
    application.eligibilityStatus = eligibilityResult.status;
    application.eligibilityReason = eligibilityResult.reason;
    application.eligibilityScore = eligibilityResult.score;
    application.missingDocuments = eligibilityResult.missingDocuments;

    // Save to database
    await application.save();

    return NextResponse.json(
      {
        success: true,
        data: application,
        eligibility: {
          status: eligibilityResult.status,
          score: eligibilityResult.score,
          reason: eligibilityResult.reason,
          missingDocuments: eligibilityResult.missingDocuments,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating application:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to create application',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const applications = await Application.find().sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        data: applications,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch applications',
      },
      { status: 500 }
    );
  }
}
