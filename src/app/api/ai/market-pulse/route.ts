import { NextResponse } from 'next/server';
import { fetchMarketPulse } from '@/services/ai/marketPulseService';

export async function POST(req: Request) {
  try {
    const { careerPath } = await req.json();

    if (!careerPath) {
      return NextResponse.json({ error: 'Missing careerPath' }, { status: 400 });
    }

    const marketPulse = await fetchMarketPulse(careerPath);

    return NextResponse.json({ marketPulse });
  } catch (error: any) {
    console.error('Error in market-pulse API:', error);
    return NextResponse.json({ error: 'Failed to fetch market pulse.' }, { status: 500 });
  }
}
