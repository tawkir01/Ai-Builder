import mongoose, { Schema, Document } from 'mongoose';

export interface IAssessment extends Document {
  userId: string;
  field: string;
  score: number;
  totalQuestions: number;
  questions: {
    question: string;
    selectedAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
  }[];
  createdAt: Date;
}

const AssessmentSchema: Schema = new Schema({
  userId: { type: String, required: true },
  field: { type: String, required: true },
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  questions: [
    {
      question: { type: String, required: true },
      selectedAnswer: { type: String, required: true },
      correctAnswer: { type: String, required: true },
      isCorrect: { type: Boolean, required: true },
    }
  ],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Assessment || mongoose.model<IAssessment>('Assessment', AssessmentSchema);
