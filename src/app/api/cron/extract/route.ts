// DIAGNOSTIC KILL SWITCH ENABLED
// This route was suspected of being hit by an external scheduler despite not
// being listed in vercel.json. It is short-circuited so the source of traffic
// can be identified via Vercel logs. Restore the original implementation
// (see git history) once the caller is known and dealt with.

import { diagnosticKillSwitchResponse } from '@/lib/diagnostic-kill-switch'

export async function GET(request: Request) {
  return diagnosticKillSwitchResponse(request, 'cron/extract')
}
