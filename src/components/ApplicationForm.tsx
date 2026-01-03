'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import axios from 'axios';

const validationSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  businessType: z.string().min(1, 'Business type is required'),
  annualRevenue: z.coerce.number().min(1, 'Annual revenue is required'),
  yearsInBusiness: z.coerce.number().min(1, 'Years in business is required'),
  businessAddress: z.string().min(1, 'Business address is required'),
  directorName: z.string().min(1, 'Director name is required'),
  directorAge: z.coerce.number().min(21, 'Age must be at least 21').max(65, 'Age must be 65 or less'),
  directorCreditScore: z.coerce.number().min(300, 'Credit score must be at least 300').max(900, 'Credit score must not exceed 900'),
  employeeCount: z.coerce.number().min(0, 'Employee count must be 0 or more'),
  email: z.string().email('Valid email is required'),
  phone: z.string().regex(/^\d{10}$/, 'Phone must be 10 digits'),
  loanAmount: z.coerce.number().min(1, 'Loan amount is required'),
  loanPurpose: z.string().min(1, 'Loan purpose is required'),
  documentsUploaded: z.object({
    pan: z.boolean(),
    aadhar: z.boolean(),
    gst: z.boolean(),
    bankStatements: z.boolean(),
    taxReturns: z.boolean(),
    businessProof: z.boolean(),
    propertyDeed: z.boolean(),
  }),
});

type ApplicationFormData = z.infer<typeof validationSchema>;

export default function ApplicationForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [applicationId, setApplicationId] = useState<string | null>(null);

  const { control, handleSubmit, register, formState: { errors } } = useForm<ApplicationFormData>({
    resolver: zodResolver(validationSchema),
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-6 sm:py-12 px-3 sm:px-4 md:px-6 lg:px-8">
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border border-white/20 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 sm:px-6 py-6 sm:py-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              SME Loan Pre-Screening
            </h1>
            <p className="text-blue-100 mt-2 text-sm sm:text-base">
              Complete this form for quick eligibility assessment
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded text-sm sm:text-base">
                {error}
              </div>
            )}

            {/* Business Information Section */}
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 pb-2 border-b">
                Business Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your company name"
                    {...register('companyName')}
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  />
                  {errors.companyName && (
                    <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.companyName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                    Business Type *
                  </label>
                  <select
                    {...register('businessType')}
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  >
                    <option value="">Select business type</option>
                    <option value="sole-proprietor">Sole Proprietor</option>
                    <option value="partnership">Partnership</option>
                    <option value="pvt-limited">Pvt Limited</option>
                    <option value="llp">LLP</option>
                  </select>
                  {errors.businessType && (
                    <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.businessType.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                    Annual Revenue (₹) *
                  </label>
                  <input
                    type="number"
                    placeholder="1000000"
                    {...register('annualRevenue')}
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  />
                  {errors.annualRevenue && (
                    <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.annualRevenue.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                    Years in Business *
                  </label>
                  <input
                    type="number"
                    placeholder="5"
                    {...register('yearsInBusiness')}
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  />
                  {errors.yearsInBusiness && (
                    <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.yearsInBusiness.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                    Employee Count *
                  </label>
                  <input
                    type="number"
                    placeholder="10"
                    {...register('employeeCount')}
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  />
                  {errors.employeeCount && (
                    <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.employeeCount.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                    Business Address *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter business address"
                    {...register('businessAddress')}
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  />
                  {errors.businessAddress && (
                    <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.businessAddress.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Director Information Section */}
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 pb-2 border-b">
                Director/Owner Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                    Director Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter director name"
                    {...register('directorName')}
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  />
                  {errors.directorName && (
                    <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.directorName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                    Director Age (21-65) *
                  </label>
                  <input
                    type="number"
                    placeholder="45"
                    {...register('directorAge')}
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  />
                  {errors.directorAge && (
                    <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.directorAge.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                    Credit Score (300-900) *
                  </label>
                  <input
                    type="number"
                    placeholder="750"
                    {...register('directorCreditScore')}
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  />
                  {errors.directorCreditScore && (
                    <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.directorCreditScore.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 pb-2 border-b">
                Contact Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                    Email *
                  </label>
                  <input
                    type="email"
                    placeholder="info@company.com"
                    {...register('email')}
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                    Phone (10 digits) *
                  </label>
                  <input
                    type="text"
                    placeholder="9876543210"
                    {...register('phone')}
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.phone.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Loan Information Section */}
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 pb-2 border-b">
                Loan Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                    Loan Amount (₹) *
                  </label>
                  <input
                    type="number"
                    placeholder="500000"
                    {...register('loanAmount')}
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  />
                  {errors.loanAmount && (
                    <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.loanAmount.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                    Loan Purpose *
                  </label>
                  <select
                    {...register('loanPurpose')}
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  >
                    <option value="">Select purpose</option>
                    <option value="working-capital">Working Capital</option>
                    <option value="expansion">Expansion</option>
                    <option value="equipment">Equipment</option>
                    <option value="inventory">Inventory</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.loanPurpose && (
                    <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.loanPurpose.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Documents Section */}
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 pb-2 border-b">
                Documents Ready for Upload
              </h2>
              <p className="text-gray-600 text-xs sm:text-sm mb-4">
                Check which documents you have ready. Missing documents may affect your eligibility.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
                    className="flex items-center p-2 sm:p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 text-sm sm:text-base"
                  >
                    <Controller
                      name={`documentsUploaded.${doc.key as keyof ApplicationFormData['documentsUploaded']}`}
                      control={control}
                      render={({ field }) => (
                        <input
                          type="checkbox"
                          checked={field.value as boolean}
                          onChange={(e) => field.onChange(e.target.checked)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                      )}
                    />
                    <span className="ml-2 sm:ml-3 text-gray-700">
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
            <div className="pt-4 sm:pt-6 border-t">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2.5 sm:py-3 px-4 rounded-lg transition text-sm sm:text-base"
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
