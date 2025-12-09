import { IApplication } from '@/models/Application';

interface EligibilityResult {
  status: 'approved' | 'rejected' | 'conditional';
  score: number;
  reason: string;
  missingDocuments: string[];
}

const REQUIRED_DOCUMENTS = [
  'pan',
  'aadhar',
  'gst',
  'bankStatements',
  'taxReturns',
];

const CRITICAL_DOCUMENTS = ['pan', 'aadhar'];

export function calculateEligibility(
  application: Partial<IApplication>
): EligibilityResult {
  let score = 0;
  const missingDocuments: string[] = [];
  const reasons: string[] = [];

  // Check critical documents
  const hasCriticalDocs =
    application.documentsUploaded?.pan &&
    application.documentsUploaded?.aadhar;

  if (!hasCriticalDocs) {
    const missing = [];
    if (!application.documentsUploaded?.pan) {
      missing.push('PAN');
      missingDocuments.push('pan');
    }
    if (!application.documentsUploaded?.aadhar) {
      missing.push('Aadhar');
      missingDocuments.push('aadhar');
    }
    reasons.push(`Missing critical documents: ${missing.join(', ')}`);
  } else {
    score += 20;
  }

  // Check all required documents
  const requiredDocs = REQUIRED_DOCUMENTS.filter(
    (doc) =>
      !application.documentsUploaded?.[doc as keyof typeof application.documentsUploaded]
  );

  if (requiredDocs.length > 0) {
    missingDocuments.push(...requiredDocs);
  }

  if (requiredDocs.length > 0) {
    score += (REQUIRED_DOCUMENTS.length - requiredDocs.length) * 5;
    reasons.push(
      `Missing supporting documents: ${requiredDocs.join(', ')}`
    );
  } else {
    score += 25;
  }

  // Check revenue criteria
  if (
    application.annualRevenue &&
    application.annualRevenue >= 10000000
  ) {
    score += 20;
  } else if (application.annualRevenue && application.annualRevenue >= 5000000) {
    score += 10;
  } else if (application.annualRevenue && application.annualRevenue < 1000000) {
    reasons.push('Annual revenue below minimum threshold (₹10 lakhs)');
  } else {
    score += 5;
  }

  // Check years in business
  if (application.yearsInBusiness && application.yearsInBusiness >= 3) {
    score += 15;
  } else if (application.yearsInBusiness && application.yearsInBusiness >= 1) {
    score += 5;
    reasons.push('Business is relatively new');
  } else {
    reasons.push('Business has been operating for less than 1 year');
  }

  // Check credit score
  if (application.directorCreditScore && application.directorCreditScore >= 750) {
    score += 20;
  } else if (
    application.directorCreditScore &&
    application.directorCreditScore >= 650
  ) {
    score += 10;
  } else if (
    application.directorCreditScore &&
    application.directorCreditScore < 600
  ) {
    reasons.push('Credit score below acceptable threshold');
  } else {
    score += 5;
  }

  // Check director age
  if (
    application.directorAge &&
    application.directorAge >= 25 &&
    application.directorAge <= 60
  ) {
    score += 10;
  } else if (application.directorAge) {
    reasons.push('Director age outside optimal range');
  }

  // Determine eligibility status
  let status: 'approved' | 'rejected' | 'conditional';

  if (!hasCriticalDocs || reasons.length > 2) {
    status = 'rejected';
  } else if (score >= 75 && missingDocuments.length === 0) {
    status = 'approved';
  } else {
    status = 'conditional';
  }

  return {
    status,
    score: Math.min(100, score),
    reason: reasons.length > 0 ? reasons.join('; ') : 'Application meets all criteria',
    missingDocuments,
  };
}
