import { NextResponse } from 'next/server';
import { fetchOpportunities } from '@/services/ai/opportunitiesService';

export async function POST(req: Request) {
  try {
    const { careerPath, level } = await req.json();

    if (!careerPath || typeof level !== 'number') {
      return NextResponse.json({ error: 'Missing careerPath or level' }, { status: 400 });
    }

    const opportunities = await fetchOpportunities(careerPath, level);
    return NextResponse.json({ opportunities });
  } catch (error: any) {
    console.error('Error in opportunities API:', error);
    return NextResponse.json({ error: 'Failed to fetch opportunities.' }, { status: 500 });
  }
}
