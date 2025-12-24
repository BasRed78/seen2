// Generates weekly reflections for all users
// Trigger: Every Sunday at 9:00 AM via Vercel cron

import { NextResponse } from 'next/server';
import { generateAllWeeklySummaries } from '@/lib/weekly-aggregation';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await generateAllWeeklySummaries();
    
    return NextResponse.json({
      message: 'Weekly reflections generated',
      ...result
    });

  } catch (error) {
    console.error('[CRON:WEEKLY] Error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
