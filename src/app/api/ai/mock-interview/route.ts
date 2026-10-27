import { NextResponse } from 'next/server';
import { getNextInterviewQuestion } from '@/services/ai/mockInterviewService';

export async function POST(req: Request) {
  try {
    const { pathName, chatHistory, evaluate = false } = await req.json();

    if (!pathName || !Array.isArray(chatHistory)) {
      return NextResponse.json({ error: 'Missing pathName or chatHistory' }, { status: 400 });
    }

    const nextResult = await getNextInterviewQuestion(pathName, chatHistory, evaluate);

    return NextResponse.json({ reply: nextResult });
  } catch (error: any) {
    console.error('Error in mock interview API:', error);
    return NextResponse.json({ error: 'Failed to generate interview question.' }, { status: 500 });
  }
}
