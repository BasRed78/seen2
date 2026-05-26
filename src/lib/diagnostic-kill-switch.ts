// Diagnostic kill switch for routes suspected of generating unwanted Anthropic
// API charges. Logs caller details to Vercel logs and short-circuits the route
// so no billable work runs. Remove this file (and revert the GET handlers)
// once the source of unwanted traffic is identified.

import { NextResponse } from 'next/server'

export function diagnosticKillSwitchResponse(request: Request, routeName: string) {
  const h = request.headers
  const seen = {
    timestamp: new Date().toISOString(),
    route: routeName,
    method: request.method,
    url: request.url,
    ip: h.get('x-forwarded-for') || h.get('x-real-ip') || 'unknown',
    userAgent: h.get('user-agent') || 'none',
    authPresent: h.get('authorization') ? 'yes' : 'no',
    referer: h.get('referer') || 'none',
    vercelCronHeader: h.get('x-vercel-cron') || 'none',
  }

  console.log(`[KILL-SWITCH] ${JSON.stringify(seen)}`)

  return NextResponse.json(
    {
      disabled: true,
      message:
        'Diagnostic mode — request logged, no Anthropic work performed. See Vercel logs for [KILL-SWITCH] entries.',
      seen,
    },
    { status: 200 }
  )
}
