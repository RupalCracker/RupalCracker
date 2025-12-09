'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';

interface ApplicationDetail {
  _id: string;
  companyName: string;
  email: string;
  phone: string;
  businessType: string;
  annualRevenue: number;
  yearsInBusiness: number;
  businessAddress: string;
  directorName: string;
  directorAge: number;
  directorCreditScore: number;
  employeeCount: number;
  loanAmount: number;
  loanPurpose: string;
  documentsUploaded: {
    pan: boolean;
    aadhar: boolean;
    gst: boolean;
    bankStatements: boolean;
    taxReturns: boolean;
    businessProof: boolean;
    propertyDeed: boolean;
  };
  eligibilityStatus: 'pending' | 'approved' | 'rejected' | 'conditional';
  eligibilityScore: number;
  eligibilityReason: string;
  missingDocuments: string[];
  createdAt: string;
}

export default function ApplicationDetail() {
  const params = useParams();
  const id = params.id as string;
  const [application, setApplication] = useState<ApplicationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchApplication();
  }, [id]);

  const fetchApplication = async () => {
    try {
      const response = await axios.get(`/api/applications/${id}`);
      setApplication(response.data.data);
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
        'Failed to fetch application'
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-600">Loading application...</p>
        </div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-red-600 mb-4">{error || 'Application not found'}</p>
            <Link
              href="/dashboard"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'from-green-500 to-green-600';
      case 'rejected':
        return 'from-red-500 to-red-600';
      case 'conditional':
        return 'from-yellow-500 to-yellow-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Congratulations! Your application has been approved.';
      case 'rejected':
        return 'Your application does not meet the eligibility criteria.';
      case 'conditional':
        return 'Your application has been flagged for manual review.';
      default:
        return 'Application is under review.';
    }
  };

  const documentLabels: Record<string, string> = {
    pan: 'PAN Card',
    aadhar: 'Aadhar Card',
    gst: 'GST Certificate',
    bankStatements: 'Bank Statements',
    taxReturns: 'Tax Returns',
    businessProof: 'Business Proof',
    propertyDeed: 'Property Deed',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Link */}
        <Link
          href="/dashboard"
          className="text-blue-600 hover:text-blue-800 font-medium mb-6 inline-block"
        >
          ← Back to Dashboard
        </Link>

        {/* Result Card */}
        <div
          className={`bg-gradient-to-r ${getStatusColor(
            application.eligibilityStatus
          )} rounded-lg shadow-lg p-8 text-white mb-6`}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {application.eligibilityStatus.charAt(0).toUpperCase() +
                  application.eligibilityStatus.slice(1)}
              </h1>
              <p className="text-lg opacity-90">
                {getStatusMessage(application.eligibilityStatus)}
              </p>
            </div>
            <div className="text-6xl font-bold opacity-30">
              {application.eligibilityScore}
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-white border-opacity-20">
            <p className="text-lg font-semibold mb-2">Eligibility Reason:</p>
            <p className="opacity-90">{application.eligibilityReason}</p>
          </div>

          <div className="mt-4">
            <p className="text-sm opacity-75">
              Eligibility Score: {application.eligibilityScore}/100
            </p>
          </div>
        </div>

        {/* Missing Documents Alert */}
        {application.missingDocuments.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-6 py-4 rounded-lg mb-6">
            <h3 className="font-semibold mb-2">Documents to Upload:</h3>
            <ul className="list-disc list-inside space-y-1">
              {application.missingDocuments.map((doc) => (
                <li key={doc}>
                  {documentLabels[doc] || doc}
                </li>
              ))}
            </ul>
            <p className="text-sm mt-3 opacity-75">
              Uploading these documents may improve your eligibility status.
            </p>
          </div>
        )}

        {/* Application Details */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Business Information */}
            <div className="border-r border-b md:border-b-0 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Business Information
              </h2>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600">Company Name</p>
                  <p className="font-medium text-gray-900">
                    {application.companyName}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Business Type</p>
                  <p className="font-medium text-gray-900 capitalize">
                    {application.businessType.replace('-', ' ')}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Annual Revenue</p>
                  <p className="font-medium text-gray-900">
                    ₹{application.annualRevenue.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Years in Business</p>
                  <p className="font-medium text-gray-900">
                    {application.yearsInBusiness} years
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Employee Count</p>
                  <p className="font-medium text-gray-900">
                    {application.employeeCount}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Business Address</p>
                  <p className="font-medium text-gray-900">
                    {application.businessAddress}
                  </p>
                </div>
              </div>
            </div>

            {/* Director Information */}
            <div className="border-b p-6 md:border-b-0">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Director Information
              </h2>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600">Director Name</p>
                  <p className="font-medium text-gray-900">
                    {application.directorName}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Age</p>
                  <p className="font-medium text-gray-900">
                    {application.directorAge} years
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Credit Score</p>
                  <p className="font-medium text-gray-900">
                    {application.directorCreditScore}
                  </p>
                </div>
              </div>
            </div>

            {/* Loan Information */}
            <div className="border-r border-b md:border-b-0 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Loan Information
              </h2>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600">Loan Amount</p>
                  <p className="font-medium text-gray-900">
                    ₹{application.loanAmount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Loan Purpose</p>
                  <p className="font-medium text-gray-900 capitalize">
                    {application.loanPurpose.replace('-', ' ')}
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Contact Information
              </h2>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600">Email</p>
                  <p className="font-medium text-gray-900">{application.email}</p>
                </div>
                <div>
                  <p className="text-gray-600">Phone</p>
                  <p className="font-medium text-gray-900">
                    {application.phone}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Application Date</p>
                  <p className="font-medium text-gray-900">
                    {new Date(application.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Documents Checklist */}
          <div className="border-t p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Documents Submitted
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(application.documentsUploaded).map(
                ([key, submitted]) => (
                  <div
                    key={key}
                    className={`flex items-center p-3 rounded border ${
                      submitted
                        ? 'bg-green-50 border-green-200'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div
                      className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                        submitted
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-300 text-white'
                      }`}
                    >
                      {submitted ? '✓' : '-'}
                    </div>
                    <span
                      className={`ml-3 font-medium ${
                        submitted
                          ? 'text-green-900'
                          : 'text-gray-600'
                      }`}
                    >
                      {documentLabels[key]}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Next Steps
          </h3>
          {application.eligibilityStatus === 'approved' && (
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Your application has been approved</li>
              <li>You will receive a call from our loan specialist within 24 hours</li>
              <li>Please keep your documents ready for verification</li>
              <li>Loan disbursement will follow after document verification</li>
            </ul>
          )}
          {application.eligibilityStatus === 'rejected' && (
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Your application does not meet current eligibility criteria</li>
              <li>You can reapply after improving the identified areas</li>
              <li>Contact our support team for detailed feedback</li>
            </ul>
          )}
          {application.eligibilityStatus === 'conditional' && (
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Your application requires manual review</li>
              <li>Please upload the missing documents listed above</li>
              <li>A loan officer will contact you within 2-3 business days</li>
              <li>Provide additional information if requested</li>
            </ul>
          )}
          {application.eligibilityStatus === 'pending' && (
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Your application is being reviewed</li>
              <li>You will receive updates via email</li>
              <li>We will contact you if we need any clarification</li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
