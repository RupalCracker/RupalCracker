import mongoose, { Schema, Document } from 'mongoose';

export interface IApplication extends Document {
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
  eligibilityReason: string;
  eligibilityScore: number;
  missingDocuments: string[];
  createdAt: Date;
  updatedAt: Date;
}

const applicationSchema = new Schema<IApplication>(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      match: /.+\@.+\..+/,
    },
    phone: {
      type: String,
      required: true,
      match: /^[0-9]{10}$/,
    },
    businessType: {
      type: String,
      enum: ['sole-proprietor', 'partnership', 'pvt-limited', 'llp'],
      required: true,
    },
    annualRevenue: {
      type: Number,
      required: true,
      min: 0,
    },
    yearsInBusiness: {
      type: Number,
      required: true,
      min: 0,
    },
    businessAddress: {
      type: String,
      required: true,
    },
    directorName: {
      type: String,
      required: true,
    },
    directorAge: {
      type: Number,
      required: true,
      min: 21,
      max: 65,
    },
    directorCreditScore: {
      type: Number,
      required: true,
      min: 300,
      max: 900,
    },
    employeeCount: {
      type: Number,
      required: true,
      min: 1,
    },
    loanAmount: {
      type: Number,
      required: true,
      min: 100000,
    },
    loanPurpose: {
      type: String,
      enum: ['working-capital', 'expansion', 'equipment', 'inventory', 'other'],
      required: true,
    },
    documentsUploaded: {
      pan: { type: Boolean, default: false },
      aadhar: { type: Boolean, default: false },
      gst: { type: Boolean, default: false },
      bankStatements: { type: Boolean, default: false },
      taxReturns: { type: Boolean, default: false },
      businessProof: { type: Boolean, default: false },
      propertyDeed: { type: Boolean, default: false },
    },
    eligibilityStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'conditional'],
      default: 'pending',
    },
    eligibilityReason: {
      type: String,
      default: '',
    },
    eligibilityScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    missingDocuments: [{
      type: String,
    }],
  },
  {
    timestamps: true,
  }
);

export const Application =
  mongoose.models.Application ||
  mongoose.model<IApplication>('Application', applicationSchema);
