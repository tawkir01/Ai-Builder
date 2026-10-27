import { NextResponse } from 'next/server';
import { generateOutreach } from '@/services/ai/outreachService';

export async function POST(req: Request) {
  try {
    const { careerPath, skills, companyName, jobDescription } = await req.json();

    if (!careerPath || !skills || !companyName || !jobDescription) {
      return NextResponse.json({ error: 'Missing required fields: careerPath, skills, companyName, or jobDescription' }, { status: 400 });
    }

    const outreach = await generateOutreach({
      careerPath,
      skills,
      companyName,
      jobDescription
    });

    return NextResponse.json({ outreach });
  } catch (error: any) {
    console.error('Error in outreach API:', error);
    return NextResponse.json({ error: 'Failed to generate outreach templates.' }, { status: 500 });
  }
}
