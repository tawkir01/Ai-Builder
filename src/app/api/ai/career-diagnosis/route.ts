import { NextResponse } from 'next/server';
import { processCareerDiagnosis } from '@/services/ai/careerDiagnosisService';

export async function POST(req: Request) {
  try {
    const { resumeText, questionnaire } = await req.json();

    if (!questionnaire) {
      return NextResponse.json({ error: 'Missing questionnaire' }, { status: 400 });
    }

    const paths = await processCareerDiagnosis(resumeText || '', questionnaire);

    return NextResponse.json({ paths });
  } catch (error: any) {
    console.error('Error in career diagnosis API:', error);
    return NextResponse.json({ error: 'Failed to process career diagnosis.' }, { status: 500 });
  }
}
