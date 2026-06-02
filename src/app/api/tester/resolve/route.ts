import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

// Resolve an invite code → tester summary. Called from the /tester/[code]
// page to render the welcome / NDA screen. Returns 404 for unknown codes
// and 410 for revoked invites — the page renders different copy for each.
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')
  if (!code) {
    return NextResponse.json({ error: 'code is required' }, { status: 400 })
  }

  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('test_testers')
    .select('id, user_id, recipient_name, invite_code, nda_accepted_at, onboarded_at, revoked_at')
    .eq('invite_code', code)
    .maybeSingle()

  if (error) {
    console.error('[TESTER-RESOLVE] Lookup error:', error)
    return NextResponse.json({ error: 'Lookup failed' }, { status: 500 })
  }
  if (!data) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  if (data.revoked_at) {
    return NextResponse.json({ error: 'Revoked' }, { status: 410 })
  }

  return NextResponse.json({ tester: data })
}
