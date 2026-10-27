import { NextResponse } from 'next/server';
import { generateMCQs } from '@/services/ai/assessmentService';
import connectDB from '@/lib/mongoose';
import Assessment from '@/models/Assessment';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const field = searchParams.get('field') || 'Software Engineer';
  const count = parseInt(searchParams.get('count') || '5');

  try {
    const questions = await generateMCQs(field, count);
    return NextResponse.json(questions);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate MCQs' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const db = await connectDB();
  const body = await request.json();
  const { userId, field, score, totalQuestions, questions } = body;

  if (!db) {
    console.warn("Skipping assessment save: No database connection available.");
    return NextResponse.json({ message: 'Assessment completed but not saved (offline mode)' });
  }

  try {
    const assessment = await Assessment.create({
      userId: userId || 'anonymous',
      field,
      score,
      totalQuestions,
      questions,
    });
    return NextResponse.json(assessment);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save assessment' }, { status: 500 });
  }
}
