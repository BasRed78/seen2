// Get user's insight summary (for dashboard)

import { NextResponse } from 'next/server';
import { getExtractionSummary } from '@/lib/extraction-handler';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const days = parseInt(searchParams.get('days') || '30', 10);

  if (!userId) {
    return NextResponse.json({ error: 'userId required' }, { status: 400 });
  }

  try {
    const summary = await getExtractionSummary(userId, days);
    return NextResponse.json(summary);

  } catch (error) {
    console.error('[API:INSIGHTS] Error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
