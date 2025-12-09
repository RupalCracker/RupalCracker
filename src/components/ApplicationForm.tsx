'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Link from 'next/link';
import axios from 'axios';

interface ApplicationFormData {
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
}

export default function ApplicationForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [applicationId, setApplicationId] = useState<string | null>(null);

  const { control, handleSubmit, formState: { errors } } = useForm<ApplicationFormData>({
    defaultValues: {
      documentsUploaded: {
        pan: false,
        aadhar: false,
        gst: false,
        bankStatements: false,
        taxReturns: false,
        businessProof: false,
        propertyDeed: false,
      },
    },
  });

  const onSubmit = async (data: ApplicationFormData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post('/api/applications', data);
      setSuccess('Application submitted successfully!');
      setApplicationId(response.data.data._id);
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
        'Failed to submit application. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (success && applicationId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Application Submitted
            </h2>
            <p className="text-gray-600 mb-6">
              Your SME loan pre-screening application has been received.
            </p>
            <Link
              href={`/applications/${applicationId}`}
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
            >
              View Results
            </Link>
            <div className="text-sm text-gray-500 pt-4 border-t">
              <p>Application ID: {applicationId}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8">
            <h1 className="text-3xl font-bold text-white">
              SME Loan Pre-Screening Application
            </h1>
            <p className="text-blue-100 mt-2">
              Complete this form for quick eligibility assessment
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* Business Information Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b">
                Business Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Company Name"
                  type="text"
                  placeholder="Enter your company name"
                  register={(field) => (
                    <input
                      type="text"
                      placeholder="Enter your company name"
                      {...field}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  )}
                  error={errors.companyName?.message}
                />

                <FormField
                  label="Business Type"
                  register={(field) => (
                    <select
                      {...field}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select business type</option>
                      <option value="sole-proprietor">Sole Proprietor</option>
                      <option value="partnership">Partnership</option>
                      <option value="pvt-limited">Pvt Limited</option>
                      <option value="llp">LLP</option>
                    </select>
                  )}
                  error={errors.businessType?.message}
                />

                <FormField
                  label="Annual Revenue (₹)"
                  type="number"
                  placeholder="1000000"
                  register={(field) => (
                    <input
                      type="number"
                      placeholder="1000000"
                      {...field}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  )}
                  error={errors.annualRevenue?.message}
                />

                <FormField
                  label="Years in Business"
                  type="number"
                  placeholder="5"
                  register={(field) => (
                    <input
                      type="number"
                      placeholder="5"
                      {...field}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  )}
                  error={errors.yearsInBusiness?.message}
                />

                <FormField
                  label="Employee Count"
                  type="number"
                  placeholder="10"
                  register={(field) => (
                    <input
                      type="number"
                      placeholder="10"
                      {...field}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  )}
                  error={errors.employeeCount?.message}
                />

                <FormField
                  label="Business Address"
                  type="text"
                  placeholder="Enter business address"
                  register={(field) => (
                    <input
                      type="text"
                      placeholder="Enter business address"
                      {...field}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  )}
                  error={errors.businessAddress?.message}
                />
              </div>
            </div>

            {/* Director Information Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b">
                Director/Owner Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Director Name"
                  type="text"
                  placeholder="Enter director name"
                  register={(field) => (
                    <input
                      type="text"
                      placeholder="Enter director name"
                      {...field}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  )}
                  error={errors.directorName?.message}
                />

                <FormField
                  label="Director Age"
                  type="number"
                  placeholder="45"
                  register={(field) => (
                    <input
                      type="number"
                      placeholder="45"
                      {...field}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  )}
                  error={errors.directorAge?.message}
                />

                <FormField
                  label="Credit Score"
                  type="number"
                  placeholder="750"
                  register={(field) => (
                    <input
                      type="number"
                      placeholder="750"
                      {...field}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  )}
                  error={errors.directorCreditScore?.message}
                />
              </div>
            </div>

            {/* Contact Information Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b">
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Email"
                  type="email"
                  placeholder="info@company.com"
                  register={(field) => (
                    <input
                      type="email"
                      placeholder="info@company.com"
                      {...field}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  )}
                  error={errors.email?.message}
                />

                <FormField
                  label="Phone (10 digits)"
                  type="text"
                  placeholder="9876543210"
                  register={(field) => (
                    <input
                      type="text"
                      placeholder="9876543210"
                      {...field}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  )}
                  error={errors.phone?.message}
                />
              </div>
            </div>

            {/* Loan Information Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b">
                Loan Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Loan Amount (₹)"
                  type="number"
                  placeholder="500000"
                  register={(field) => (
                    <input
                      type="number"
                      placeholder="500000"
                      {...field}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  )}
                  error={errors.loanAmount?.message}
                />

                <FormField
                  label="Loan Purpose"
                  register={(field) => (
                    <select
                      {...field}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select purpose</option>
                      <option value="working-capital">Working Capital</option>
                      <option value="expansion">Expansion</option>
                      <option value="equipment">Equipment</option>
                      <option value="inventory">Inventory</option>
                      <option value="other">Other</option>
                    </select>
                  )}
                  error={errors.loanPurpose?.message}
                />
              </div>
            </div>

            {/* Documents Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b">
                Documents Ready for Upload
              </h2>
              <p className="text-gray-600 text-sm mb-4">
                Check which documents you have ready. Missing documents may affect your eligibility.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: 'pan', label: 'PAN Card (Required)', critical: true },
                  { key: 'aadhar', label: 'Aadhar Card (Required)', critical: true },
                  { key: 'gst', label: 'GST Certificate' },
                  { key: 'bankStatements', label: 'Bank Statements (6 months)' },
                  { key: 'taxReturns', label: 'Income Tax Returns' },
                  { key: 'businessProof', label: 'Business Registration Proof' },
                  { key: 'propertyDeed', label: 'Property Deed' },
                ].map((doc) => (
                  <label
                    key={doc.key}
                    className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <Controller
                      name={`documentsUploaded.${doc.key as keyof ApplicationFormData['documentsUploaded']}`}
                      control={control}
                      render={({ field }) => (
                        <input
                          type="checkbox"
                          {...field}
                          checked={field.value as any}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                      )}
                    />
                    <span className="ml-3 text-gray-700">
                      {doc.label}
                      {doc.critical && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition"
              >
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

interface FormFieldProps {
  label: string;
  type?: string;
  placeholder?: string;
  register: (field: any) => React.ReactNode;
  error?: string;
}

function FormField({
  label,
  register,
  error,
}: FormFieldProps) {
  return (
    <div>
      <label className="block text-gray-700 font-medium mb-2">
        {label}
      </label>
      {register({} as any)}
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
}
