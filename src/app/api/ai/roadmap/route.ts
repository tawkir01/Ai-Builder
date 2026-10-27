import { NextResponse } from 'next/server';
import { generateRoadmapBlocks } from '@/services/ai/roadmapEngineService';

export async function POST(req: Request) {
  try {
    const { careerPath, level } = await req.json();

    if (!careerPath || typeof level !== 'number') {
      return NextResponse.json({ error: 'Missing careerPath or level' }, { status: 400 });
    }

    const roadmap = await generateRoadmapBlocks(careerPath, level);

    return NextResponse.json({ roadmap });
  } catch (error: any) {
    console.error('Error in roadmap API:', error);
    return NextResponse.json({ error: 'Failed to generate roadmap.' }, { status: 500 });
  }
}
