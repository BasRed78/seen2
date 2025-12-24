// Runs extraction on recently completed check-ins
// Trigger: Every 15 minutes via Vercel cron

import { NextResponse } from 'next/server';
import { extractFromCheckin } from '@/lib/extraction-handler';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
  // Verify cron secret (Vercel adds this automatically)
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    // Find completed check-ins that haven't been extracted
    const { data: checkins, error } = await supabase
      .from('checkins')
      .select('id')
      .eq('completed', true)
      .or('extracted.is.null,extracted.eq.false')
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('[CRON:EXTRACT] Failed to fetch check-ins:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    if (!checkins || checkins.length === 0) {
      return NextResponse.json({ message: 'No check-ins to process' });
    }

    let successful = 0;
    let failed = 0;

    for (const checkin of checkins) {
      const result = await extractFromCheckin(checkin.id);
      if (result.success) {
        successful++;
      } else {
        failed++;
        console.error(`[CRON:EXTRACT] Failed for ${checkin.id}: ${result.error}`);
      }
    }

    return NextResponse.json({ 
      processed: checkins.length,
      successful,
      failed
    });

  } catch (error) {
    console.error('[CRON:EXTRACT] Error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
