import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IRoadmapTask {
  _id?: mongoose.Types.ObjectId;
  title: string;
  description: string;
  type: 'LEARN' | 'BUILD' | 'APPLY';
  completed: boolean;
  resourceLink?: string;
}

export interface IRoadmap extends Document {
  userId: mongoose.Types.ObjectId;
  careerPath: string;
  weeks: Array<{
    weekNumber: number;
    tasks: IRoadmapTask[];
  }>;
  progressPercentage: number;
  createdAt: Date;
}

const TaskSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ['LEARN', 'BUILD', 'APPLY'], required: true },
  completed: { type: Boolean, default: false },
  resourceLink: { type: String }
});

const RoadmapSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  careerPath: { type: String, required: true },
  weeks: [{
    weekNumber: { type: Number, required: true },
    tasks: [TaskSchema]
  }],
  progressPercentage: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export const Roadmap: Model<IRoadmap> = mongoose.models.Roadmap || mongoose.model<IRoadmap>('Roadmap', RoadmapSchema);
