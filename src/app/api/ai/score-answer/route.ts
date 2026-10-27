import { NextResponse } from 'next/server';
import { scoreStudyAnswer } from '@/services/ai/scoringService';

export async function POST(req: Request) {
  try {
    const { question, userAnswer, sampleSolution, careerPath } = await req.json();

    if (!question || !userAnswer || !sampleSolution) {
      return NextResponse.json(
        { error: 'Missing question, userAnswer, or sampleSolution' },
        { status: 400 }
      );
    }

    const result = await scoreStudyAnswer(
      question,
      userAnswer,
      sampleSolution,
      careerPath || 'Software Engineer'
    );

    return NextResponse.json({ result });
  } catch (error: any) {
    console.error('Error in score-answer API:', error);
    return NextResponse.json({ error: 'Failed to score answer.' }, { status: 500 });
  }
}
