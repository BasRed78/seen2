import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { randomBytes } from 'crypto'

export const dynamic = 'force-dynamic'

// Admin endpoints for managing testers. Auth is shared with the letter admin —
// same LETTER_ADMIN_PASSWORD env var, same header. One password, one admin role.
function checkAdmin(request: NextRequest): boolean {
  const expected = process.env.LETTER_ADMIN_PASSWORD || 'change-me-in-env'
  const provided =
    request.headers.get('x-admin-password') ||
    request.nextUrl.searchParams.get('admin')
  return provided === expected
}

interface TesterRow {
  id: string
  user_id: string
  invite_code: string
  recipient_name: string
  recipient_email: string | null
  notes: string | null
  invited_at: string
  nda_accepted_at: string | null
  onboarded_at: string | null
  last_active_at: string | null
  revoked_at: string | null
}

// GET: list all testers, newest first.
export async function GET(request: NextRequest) {
  if (!checkAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('test_testers')
    .select('id, user_id, invite_code, recipient_name, recipient_email, notes, invited_at, nda_accepted_at, onboarded_at, last_active_at, revoked_at')
    .order('invited_at', { ascending: false })

  if (error) {
    console.error('[TESTERS-ADMIN] List error:', error)
    return NextResponse.json({ error: 'Could not list testers' }, { status: 500 })
  }

  return NextResponse.json({ testers: (data || []) as TesterRow[] })
}

// POST: create a new tester invite.
// Also creates the corresponding `users` row immediately so the invite-code
// login flow can resolve straight to a user without any further setup.
export async function POST(request: NextRequest) {
  if (!checkAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const recipientName: string = body.recipient_name?.trim()
  const recipientEmail: string | undefined = body.recipient_email?.trim() || undefined
  const notes: string | undefined = body.notes?.trim() || undefined

  if (!recipientName) {
    return NextResponse.json({ error: 'recipient_name is required' }, { status: 400 })
  }

  // Slug + random — same shape as letter tokens, so URLs feel consistent.
  const slug = recipientName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  const inviteCode = `${slug || 'tester'}-${randomBytes(6).toString('hex')}`

  const supabase = createServerClient()

  // 1. Create the underlying user record. is_tester = true so we know they're
  //    test traffic. current_phase = phase2 so they land in Practice Home, which
  //    is what we want testers to evaluate.
  const { data: userRow, error: userErr } = await supabase
    .from('users')
    .insert({
      name: recipientName,
      email: recipientEmail || null,
      is_tester: true,
      current_phase: 'phase2',
      locale: 'en',
    })
    .select('id')
    .single()

  if (userErr || !userRow) {
    console.error('[TESTERS-ADMIN] User insert error:', userErr)
    return NextResponse.json({ error: 'Could not create tester user' }, { status: 500 })
  }

  // 2. Create the tester record linked to that user.
  const { data: testerRow, error: testerErr } = await supabase
    .from('test_testers')
    .insert({
      user_id: userRow.id,
      invite_code: inviteCode,
      recipient_name: recipientName,
      recipient_email: recipientEmail || null,
      notes: notes || null,
    })
    .select('*')
    .single()

  if (testerErr || !testerRow) {
    console.error('[TESTERS-ADMIN] Tester insert error:', testerErr)
    // Rollback the user we just made — keep the table clean.
    await supabase.from('users').delete().eq('id', userRow.id)
    return NextResponse.json({ error: 'Could not create tester record' }, { status: 500 })
  }

  return NextResponse.json({ tester: testerRow })
}

// PATCH: revoke a tester. Sets revoked_at so the invite code stops working
// and the row stays in the list for audit purposes.
export async function PATCH(request: NextRequest) {
  if (!checkAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await request.json()
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const supabase = createServerClient()
  const { error } = await supabase
    .from('test_testers')
    .update({ revoked_at: new Date().toISOString() })
    .eq('id', id)

  if (error) return NextResponse.json({ error: 'Could not revoke' }, { status: 500 })
  return NextResponse.json({ success: true })
}
