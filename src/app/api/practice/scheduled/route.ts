import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

// GET: Fetch upcoming scheduled exercises
export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 })
  }

  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('scheduled_exercises')
    .select('id, exercise_id, custom_title, scheduled_at, duration_minutes, status, exercise:exercises(title, description)')
    .eq('user_id', userId)
    .eq('status', 'scheduled')
    .gte('scheduled_at', new Date().toISOString())
    .order('scheduled_at', { ascending: true })
    .limit(20)

  if (error) {
    console.error('[SCHEDULED] Fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch scheduled exercises' }, { status: 500 })
  }

  const exercises = (data || []).map((item: Record<string, unknown>) => {
    const exercise = item.exercise as Record<string, string> | null
    return {
      id: item.id,
      exercise_id: item.exercise_id,
      title: item.custom_title || exercise?.title || 'Exercise',
      description: exercise?.description || null,
      scheduled_at: item.scheduled_at,
      duration_minutes: item.duration_minutes,
      status: item.status,
    }
  })

  return NextResponse.json({ exercises })
}

// PATCH: Update status of a scheduled exercise
export async function PATCH(request: NextRequest) {
  try {
    const { id, status } = await request.json()

    if (!id || !status) {
      return NextResponse.json({ error: 'id and status are required' }, { status: 400 })
    }

    const supabase = createServerClient()

    const updateData: Record<string, unknown> = { status }
    if (status === 'completed') {
      updateData.completed_at = new Date().toISOString()
    }

    const { error } = await supabase
      .from('scheduled_exercises')
      .update(updateData)
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
