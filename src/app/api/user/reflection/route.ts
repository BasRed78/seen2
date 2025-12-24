// Get current user's weekly reflection (for in-app display)

import { NextResponse } from 'next/server';
import { getWeeklyReflection } from '@/lib/weekly-aggregation';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'userId required' }, { status: 400 });
  }

  try {
    const reflection = await getWeeklyReflection(userId);
    
    if (!reflection.found) {
      return NextResponse.json({ 
        hasReflection: false,
        message: 'No reflection for this week yet'
      });
    }

    return NextResponse.json({
      hasReflection: true,
      reflection: reflection.reflection,
      stats: reflection.data?.stats,
      breakthroughs: reflection.data?.breakthroughs_this_week,
      periodStart: reflection.periodStart,
      periodEnd: reflection.periodEnd
    });

  } catch (error) {
    console.error('[API:REFLECTION] Error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
