import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const themeId = searchParams.get('themeId')
    const category = searchParams.get('category')

    const supabase = createServerClient()

    let query = supabase
      .from('exercises')
      .select('id, title, description, theme_id, category, exercise_type, duration_minutes, pattern_relevance, is_onboarding, display_order')
      .eq('is_active', true)
      .order('display_order', { ascending: true })

    if (themeId) {
      query = query.eq('theme_id', themeId)
    }
    if (category) {
      query = query.eq('category', category)
    }

    const { data, error } = await query

    if (error) {
      console.error('[EXERCISES] Failed to fetch exercises:', error)
      return NextResponse.json(
        { error: 'Failed to fetch exercises' },
        { status: 500 }
      )
    }

    return NextResponse.json({ exercises: data })
  } catch (error) {
    console.error('[EXERCISES] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
