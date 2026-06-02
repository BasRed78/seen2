import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

// POST: completes tester onboarding. Saves the tester's preferred display
// name (if changed) and marks them as fully onboarded so the admin dashboard
// reflects their progress.
export async function POST(request: NextRequest) {
  try {
    const { testerId, userId, preferredName } = await request.json()
    if (!testerId || !userId) {
      return NextResponse.json({ error: 'testerId and userId are required' }, { status: 400 })
    }

    const supabase = createServerClient()

    const now = new Date().toISOString()
    await supabase
      .from('test_testers')
      .update({ onboarded_at: now, last_active_at: now })
      .eq('id', testerId)

    if (preferredName && typeof preferredName === 'string' && preferredName.trim()) {
      await supabase
        .from('users')
        .update({ name: preferredName.trim() })
        .eq('id', userId)
    }

    // Return the (possibly renamed) user so the client can refresh localStorage.
    const { data: user } = await supabase
      .from('users')
      .select('id, name, email, current_phase, is_tester, locale')
      .eq('id', userId)
      .single()

    return NextResponse.json({ success: true, user })
  } catch (err) {
    console.error('[TESTER-ONBOARD] Error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
