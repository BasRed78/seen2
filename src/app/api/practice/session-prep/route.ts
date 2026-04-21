import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    const supabase = createServerClient()

    // 1. Find the most recent post-session check-in to define the window
    const { data: lastSessionRows } = await supabase
      .from('post_session_checkins')
      .select('id, created_at, emotional_state, selected_theme_id, reflection_text, practice_intention')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)

    const lastSession = lastSessionRows && lastSessionRows.length > 0 ? lastSessionRows[0] : null

    // Window start: most recent post-session, or 14 days ago as fallback
    const fallbackStart = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
    const windowStart = lastSession?.created_at || fallbackStart

    // 2. Fetch data scoped to the window, in parallel
    const [
      completionsRes,
      intentionsRes,
      checkinsRes,
      themesRes,
      exercisesRes,
    ] = await Promise.all([
      supabase
        .from('exercise_completions')
        .select('id, exercise_id, started_at, completed_at, self_rating, reflection_text')
        .eq('user_id', userId)
        .not('completed_at', 'is', null)
        .gte('completed_at', windowStart)
        .order('completed_at', { ascending: false }),
      supabase
        .from('practice_intentions')
        .select('id, intention_text, theme_id, created_at, target_date, status, completed_at, post_session_checkin_id')
        .eq('user_id', userId)
        .gte('created_at', windowStart)
        .order('created_at', { ascending: false }),
      supabase
        .from('checkins')
        .select('id, date, completed, checkin_type')
        .eq('user_id', userId)
        .eq('completed', true)
        .gte('date', windowStart.slice(0, 10))
        .order('date', { ascending: false }),
      supabase.from('practice_themes').select('id, name'),
      supabase.from('exercises').select('id, title, category'),
    ])

    const themeMap = new Map((themesRes.data || []).map(t => [t.id, t.name]))
    const exerciseMap = new Map((exercisesRes.data || []).map(e => [e.id, { title: e.title, category: e.category }]))

    const completions = (completionsRes.data || []).map(c => {
      const exercise = exerciseMap.get(c.exercise_id)
      return {
        id: c.id,
        exercise_title: exercise?.title || 'Exercise',
        exercise_category: exercise?.category || null,
        completed_at: c.completed_at,
        self_rating: c.self_rating,
        reflection_text: c.reflection_text,
      }
    })

    const intentions = (intentionsRes.data || []).map(i => ({
      id: i.id,
      intention_text: i.intention_text,
      theme_name: i.theme_id ? themeMap.get(i.theme_id) || null : null,
      target_date: i.target_date,
      status: i.status,
      created_at: i.created_at,
    }))

    // Filter check-ins to daily only (exclude post-session)
    const dailyCheckins = (checkinsRes.data || []).filter(
      c => c.checkin_type === 'daily' || !c.checkin_type
    )

    // Compute days since last session
    const daysSinceSession = lastSession
      ? Math.floor((Date.now() - new Date(lastSession.created_at).getTime()) / (1000 * 60 * 60 * 24))
      : null

    // Post-session summary
    const postSession = lastSession
      ? {
          id: lastSession.id,
          created_at: lastSession.created_at,
          emotional_state: lastSession.emotional_state,
          theme_name: lastSession.selected_theme_id
            ? themeMap.get(lastSession.selected_theme_id) || null
            : null,
          reflection_text: lastSession.reflection_text,
          practice_intention: lastSession.practice_intention,
        }
      : null

    // Stats
    const ratings = completions.filter(c => c.self_rating != null).map(c => c.self_rating!)
    const activeIntentions = intentions.filter(i => i.status === 'active')
    const completedIntentions = intentions.filter(i => i.status === 'completed')

    const stats = {
      days_since_session: daysSinceSession,
      checkins_count: dailyCheckins.length,
      exercises_completed: completions.length,
      avg_self_rating:
        ratings.length > 0
          ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10
          : null,
      intentions_active: activeIntentions.length,
      intentions_completed: completedIntentions.length,
    }

    return NextResponse.json({
      post_session: postSession,
      completions,
      intentions,
      stats,
      window_start: windowStart,
      used_fallback: !lastSession,
    })
  } catch (error) {
    console.error('[SESSION-PREP] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
