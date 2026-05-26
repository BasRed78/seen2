// DIAGNOSTIC KILL SWITCH ENABLED
// Not listed in vercel.json but route comment claims a Sunday 9 AM schedule.
// Short-circuited so unknown callers can be identified via Vercel logs.
// See git history for the original implementation.

import { diagnosticKillSwitchResponse } from '@/lib/diagnostic-kill-switch'

export async function GET(request: Request) {
  return diagnosticKillSwitchResponse(request, 'cron/weekly-reflections')
}
