import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOpportunity extends Document {
  title: string;
  company: string;
  type: 'FREELANCE' | 'INTERNSHIP' | 'FULL_TIME';
  description: string;
  requiredSkills: string[];
  applyLink: string;
  salaryMin?: number;
  salaryMax?: number;
  createdAt: Date;
}

const OpportunitySchema: Schema = new Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  type: { type: String, enum: ['FREELANCE', 'INTERNSHIP', 'FULL_TIME'], required: true },
  description: { type: String, required: true },
  requiredSkills: [{ type: String }],
  applyLink: { type: String, required: true },
  salaryMin: { type: Number },
  salaryMax: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

export const Opportunity: Model<IOpportunity> = mongoose.models.Opportunity || mongoose.model<IOpportunity>('Opportunity', OpportunitySchema);
