// DIAGNOSTIC KILL SWITCH ENABLED
// Public endpoint with no auth that invokes Anthropic via generateWeeklySummary.
// Short-circuited so unknown callers can be identified via Vercel logs.
// See git history for the original implementation.

import { diagnosticKillSwitchResponse } from '@/lib/diagnostic-kill-switch'

export async function GET(request: Request) {
  return diagnosticKillSwitchResponse(request, 'debug/weekly-test')
}
