import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

// POST: a tester accepts the NDA. Marks nda_accepted_at on the tester row
// and returns the full user record so the client can stash it in localStorage
// as seen_user (same shape the rest of the app already uses).
export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()
    if (!code) {
      return NextResponse.json({ error: 'code is required' }, { status: 400 })
    }

    const supabase = createServerClient()

    const { data: tester, error: lookupErr } = await supabase
      .from('test_testers')
      .select('id, user_id, revoked_at')
      .eq('invite_code', code)
      .maybeSingle()

    if (lookupErr) {
      console.error('[TESTER-ACCEPT] Lookup error:', lookupErr)
      return NextResponse.json({ error: 'Lookup failed' }, { status: 500 })
    }
    if (!tester) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    if (tester.revoked_at) {
      return NextResponse.json({ error: 'Revoked' }, { status: 410 })
    }

    const now = new Date().toISOString()
    await supabase
      .from('test_testers')
      .update({ nda_accepted_at: now, last_active_at: now })
      .eq('id', tester.id)

    // Return the user record so the client can log itself in.
    const { data: user, error: userErr } = await supabase
      .from('users')
      .select('id, name, email, current_phase, is_tester, locale')
      .eq('id', tester.user_id)
      .single()

    if (userErr || !user) {
      console.error('[TESTER-ACCEPT] User fetch error:', userErr)
      return NextResponse.json({ error: 'User not found' }, { status: 500 })
    }

    return NextResponse.json({ user, testerId: tester.id })
  } catch (err) {
    console.error('[TESTER-ACCEPT] Error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
