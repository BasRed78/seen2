import { NextResponse } from 'next/server';
import { generateWeeklySummary } from '@/lib/weekly-aggregation';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'Provide ?userId=uuid' }, { status: 400 });
  }

  try {
    console.log('[DEBUG] Generating weekly summary for:', userId);
    const result = await generateWeeklySummary(userId);
    console.log('[DEBUG] Weekly result:', result);
    return NextResponse.json(result);
  } catch (error) {
    console.error('[DEBUG] Weekly error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
