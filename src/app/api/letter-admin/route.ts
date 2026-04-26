import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { randomBytes } from 'crypto'

export const dynamic = 'force-dynamic'

function checkAdmin(request: NextRequest): boolean {
  const expected = process.env.LETTER_ADMIN_PASSWORD || 'change-me-in-env'
  const provided = request.headers.get('x-admin-password') || request.nextUrl.searchParams.get('admin')
  return provided === expected
}

// GET: list tokens with their visit/acceptance counts and latest activity
export async function GET(request: NextRequest) {
  if (!checkAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServerClient()
  const { data: tokens } = await supabase
    .from('letter_tokens')
    .select('*')
    .order('created_at', { ascending: false })

  const { data: logs } = await supabase
    .from('letter_access_log')
    .select('*')
    .order('occurred_at', { ascending: false })
    .limit(500)

  return NextResponse.json({ tokens: tokens || [], logs: logs || [] })
}

// POST: create a new token
export async function POST(request: NextRequest) {
  if (!checkAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const recipientName: string = body.recipient_name?.trim()
  const recipientEmail: string | undefined = body.recipient_email?.trim() || undefined
  const letterId: string = body.letter_id?.trim() || 'voor-chris'
  const notes: string | undefined = body.notes?.trim() || undefined

  if (!recipientName) {
    return NextResponse.json({ error: 'recipient_name is required' }, { status: 400 })
  }

  const slug = recipientName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  const random = randomBytes(8).toString('hex')
  const token = `${slug}-${random}`

  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('letter_tokens')
    .insert({
      token,
      letter_id: letterId,
      recipient_name: recipientName,
      recipient_email: recipientEmail,
      notes,
    })
    .select('*')
    .single()

  if (error) {
    console.error('[LETTER-ADMIN] Insert error:', error)
    return NextResponse.json({ error: 'Could not create token' }, { status: 500 })
  }

  return NextResponse.json({ token: data })
}

// PATCH: revoke a token
export async function PATCH(request: NextRequest) {
  if (!checkAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await request.json()
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  const supabase = createServerClient()
  const { error } = await supabase
    .from('letter_tokens')
    .update({ revoked_at: new Date().toISOString() })
    .eq('id', id)
  if (error) return NextResponse.json({ error: 'Could not revoke' }, { status: 500 })
  return NextResponse.json({ success: true })
}
