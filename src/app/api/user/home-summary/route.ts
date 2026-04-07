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

    // Fetch in parallel: active intentions, recent completions, recommended exercises, today's check-in
    const today = new Date().toISOString().split('T')[0]

    const [intentionsRes, completionsRes, exercisesRes, checkinRes] = await Promise.all([
      // Active practice intentions
      supabase
        .from('practice_intentions')
        .select('id, intention_text, target_date, status, created_at')
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(3),

      // Recent exercise completions
      supabase
        .from('exercise_completions')
        .select('id, exercise_id, started_at, completed_at, self_rating')
        .eq('user_id', userId)
        .not('completed_at', 'is', null)
        .order('completed_at', { ascending: false })
        .limit(5),

      // Recommended exercises (active, ordered by display_order)
      supabase
        .from('exercises')
        .select('id, title, description, category, duration_minutes, is_onboarding')
        .eq('is_active', true)
        .order('display_order', { ascending: true })
        .limit(20),

      // Check if user has checked in today
      supabase
        .from('checkins')
        .select('id')
        .eq('user_id', userId)
        .gte('created_at', `${today}T00:00:00`)
        .lte('created_at', `${today}T23:59:59`)
        .limit(1),
    ])

    // Get IDs of recently completed exercises to avoid re-recommending
    const completedExerciseIds = new Set(
      (completionsRes.data || []).map(c => c.exercise_id)
    )

    // Filter exercises: prioritize onboarding, then ones not recently completed
    const allExercises = exercisesRes.data || []
    const recommended = allExercises
      .filter(e => !completedExerciseIds.has(e.id))
      .sort((a, b) => {
        if (a.is_onboarding && !b.is_onboarding) return -1
        if (!a.is_onboarding && b.is_onboarding) return 1
        return 0
      })
      .slice(0, 3)

    return NextResponse.json({
      activeIntentions: intentionsRes.data || [],
      recentCompletions: completionsRes.data || [],
      recommendedExercises: recommended,
      exercisesCompleted: completionsRes.data?.length || 0,
      hasCheckedInToday: (checkinRes.data || []).length > 0,
    })
  } catch (error) {
    console.error('[HOME-SUMMARY] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
