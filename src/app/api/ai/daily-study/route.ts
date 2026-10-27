import { NextResponse } from 'next/server';
import { fetchDailyStudy } from '@/services/ai/dailyStudyService';

export async function POST(req: Request) {
  try {
    const { careerPath } = await req.json();

    if (!careerPath) {
      return NextResponse.json({ error: 'Missing careerPath' }, { status: 400 });
    }

    const challenge = await fetchDailyStudy(careerPath);

    return NextResponse.json({ challenge });
  } catch (error: any) {
    console.error('Error in daily-study API:', error);
    return NextResponse.json({ error: 'Failed to fetch daily study challenge.' }, { status: 500 });
  }
}
