import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient()

    // Fetch exercise WITHOUT methodology (internal-only field)
    const { data, error } = await supabase
      .from('exercises')
      .select('id, title, description, instructions, theme_id, category, exercise_type, duration_minutes, pattern_relevance, is_onboarding, display_order, is_active')
      .eq('id', params.id)
      .eq('is_active', true)
      .single()

    if (error || !data) {
      console.error('[EXERCISE DETAIL] Not found:', error)
      return NextResponse.json(
        { error: 'Exercise not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ exercise: data })
  } catch (error) {
    console.error('[EXERCISE DETAIL] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
