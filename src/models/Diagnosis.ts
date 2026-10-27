import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDiagnosis extends Document {
  userId: mongoose.Types.ObjectId;
  resumeText?: string;
  questionnaireAnswers: Record<string, string>;
  suggestedPaths: Array<{ pathName: string; confidence: number; justification: string }>;
  selectedPath?: string;
  createdAt: Date;
}

const DiagnosisSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  resumeText: { type: String },
  questionnaireAnswers: { type: Map, of: String, default: {} },
  suggestedPaths: [{
    pathName: { type: String, required: true },
    confidence: { type: Number, required: true },
    justification: { type: String }
  }],
  selectedPath: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const Diagnosis: Model<IDiagnosis> = mongoose.models.Diagnosis || mongoose.model<IDiagnosis>('Diagnosis', DiagnosisSchema);
