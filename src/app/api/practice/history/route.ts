import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const period = searchParams.get('period') || '30d'

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    const supabase = createServerClient()

    // Calculate date filter
    let dateFilter: string | null = null
    if (period === '7d') {
      dateFilter = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    } else if (period === '30d') {
      dateFilter = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    }

    // Build queries in parallel
    let checkinsQuery = supabase
      .from('post_session_checkins')
      .select('id, created_at, emotional_state, selected_theme_id, reflection_text, practice_intention')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(100)

    let completionsQuery = supabase
      .from('exercise_completions')
      .select('id, exercise_id, started_at, completed_at, self_rating, reflection_text')
      .eq('user_id', userId)
      .not('completed_at', 'is', null)
      .order('completed_at', { ascending: false })
      .limit(100)

    let intentionsQuery = supabase
      .from('practice_intentions')
      .select('id, intention_text, theme_id, created_at, target_date, status, completed_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(100)

    if (dateFilter) {
      checkinsQuery = checkinsQuery.gte('created_at', dateFilter)
      completionsQuery = completionsQuery.gte('completed_at', dateFilter)
      intentionsQuery = intentionsQuery.gte('created_at', dateFilter)
    }

    // Also fetch theme names and exercise titles for display
    const [checkinsRes, completionsRes, intentionsRes, themesRes, exercisesRes] = await Promise.all([
      checkinsQuery,
      completionsQuery,
      intentionsQuery,
      supabase.from('practice_themes').select('id, name'),
      supabase.from('exercises').select('id, title, category'),
    ])

    // Build lookup maps
    const themeMap = new Map((themesRes.data || []).map(t => [t.id, t.name]))
    const exerciseMap = new Map((exercisesRes.data || []).map(e => [e.id, { title: e.title, category: e.category }]))

    // Enrich checkins with theme names
    const checkins = (checkinsRes.data || []).map(c => ({
      id: c.id,
      created_at: c.created_at,
      emotional_state: c.emotional_state,
      theme_name: c.selected_theme_id ? themeMap.get(c.selected_theme_id) || null : null,
      reflection_text: c.reflection_text,
      practice_intention: c.practice_intention,
    }))

    // Enrich completions with exercise info
    const completions = (completionsRes.data || []).map(c => {
      const exercise = exerciseMap.get(c.exercise_id)
      const durationMs = c.completed_at && c.started_at
        ? new Date(c.completed_at).getTime() - new Date(c.started_at).getTime()
        : null
      return {
        id: c.id,
        exercise_title: exercise?.title || 'Unknown exercise',
        exercise_category: exercise?.category || 'unknown',
        started_at: c.started_at,
        completed_at: c.completed_at,
        self_rating: c.self_rating,
        duration_minutes: durationMs ? Math.round(durationMs / 60000) : null,
      }
    })

    // Enrich intentions with theme names
    const intentions = (intentionsRes.data || []).map(i => ({
      id: i.id,
      intention_text: i.intention_text,
      theme_name: i.theme_id ? themeMap.get(i.theme_id) || null : null,
      target_date: i.target_date,
      status: i.status,
      created_at: i.created_at,
      completed_at: i.completed_at,
    }))

    // Compute stats
    const completedIntentions = intentions.filter(i => i.status === 'completed')
    const ratings = completions.filter(c => c.self_rating != null).map(c => c.self_rating!)
    const emotionalStates = checkins.filter(c => c.emotional_state != null).map(c => c.emotional_state)

    const stats = {
      total_checkins: checkins.length,
      total_exercises_completed: completions.length,
      avg_self_rating: ratings.length > 0
        ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10
        : null,
      avg_emotional_state: emotionalStates.length > 0
        ? Math.round((emotionalStates.reduce((a, b) => a + b, 0) / emotionalStates.length) * 10) / 10
        : null,
      intentions_completed: completedIntentions.length,
      intentions_total: intentions.length,
    }

    return NextResponse.json({
      checkins,
      completions,
      intentions,
      stats,
    })
  } catch (error) {
    console.error('[PRACTICE-HISTORY] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
