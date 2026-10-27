import { NextResponse } from 'next/server';
import { formatResume } from '@/services/ai/resumeService';

export async function POST(req: Request) {
  try {
    const { jobTitle, rawExperience } = await req.json();

    if (!jobTitle) {
      return NextResponse.json({ error: 'Missing jobTitle' }, { status: 400 });
    }

    const resume = await formatResume(jobTitle, rawExperience || '');
    return NextResponse.json({ resume });
  } catch (error: any) {
    console.error('Error in resume API:', error);
    return NextResponse.json({ error: 'Failed to format resume.' }, { status: 500 });
  }
}
