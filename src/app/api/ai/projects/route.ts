import { NextResponse } from 'next/server';
import { generateProjects } from '@/services/ai/projectService';

export async function POST(req: Request) {
  try {
    const { careerPath, level } = await req.json();

    if (!careerPath || typeof level !== 'number') {
      return NextResponse.json({ error: 'Missing careerPath or level' }, { status: 400 });
    }

    const projects = await generateProjects(careerPath, level);
    return NextResponse.json({ projects });
  } catch (error: any) {
    console.error('Error in projects API:', error);
    return NextResponse.json({ error: 'Failed to generate projects.' }, { status: 500 });
  }
}
