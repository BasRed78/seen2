import { NextResponse } from 'next/server';
import { extractFromCheckin } from '@/lib/extraction-handler';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const checkinId = searchParams.get('id');

  if (!checkinId) {
    return NextResponse.json({ error: 'Provide ?id=checkin-uuid' }, { status: 400 });
  }

  try {
    console.log('[DEBUG] Starting extraction for:', checkinId);
    const result = await extractFromCheckin(checkinId);
    console.log('[DEBUG] Extraction result:', result);
    return NextResponse.json(result);
  } catch (error) {
    console.error('[DEBUG] Extraction error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
