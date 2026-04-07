import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 })
  }

  const supabase = createServerClient()

  const { data } = await supabase
    .from('user_calendar_connections')
    .select('provider, connected_at, disconnected_at')
    .eq('user_id', userId)
    .is('disconnected_at', null)
    .single()

  return NextResponse.json({
    connected: !!data,
    provider: data?.provider || null,
  })
}
