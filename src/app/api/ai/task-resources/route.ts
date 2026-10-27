import { NextResponse } from 'next/server';
import { fetchTaskResources } from '@/services/ai/resourcesService';

export async function POST(req: Request) {
  try {
    const { taskTitle, taskDesc } = await req.json();

    if (!taskTitle) {
      return NextResponse.json({ error: 'Missing taskTitle' }, { status: 400 });
    }

    const resources = await fetchTaskResources(taskTitle, taskDesc || '');

    return NextResponse.json({ resources });
  } catch (error: any) {
    console.error('Error in task-resources API:', error);
    return NextResponse.json({ error: 'Failed to fetch task resources.' }, { status: 500 });
  }
}
