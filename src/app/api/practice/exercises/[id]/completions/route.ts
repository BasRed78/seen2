import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

// POST: Start an exercise (create completion row with started_at)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    const supabase = createServerClient()

    const { data, error } = await supabase
      .from('exercise_completions')
      .insert({
        user_id: userId,
        exercise_id: params.id,
        started_at: new Date().toISOString(),
      })
      .select('id')
      .single()

    if (error) {
      console.error('[EXERCISE START] Failed:', error)
      return NextResponse.json(
        { error: 'Failed to start exercise' },
        { status: 500 }
      )
    }

    return NextResponse.json({ completionId: data.id })
  } catch (error) {
    console.error('[EXERCISE START] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH: Complete an exercise (set completed_at, optional reflection + rating)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { completionId, reflectionText, selfRating } = await request.json()

    if (!completionId) {
      return NextResponse.json(
        { error: 'completionId is required' },
        { status: 400 }
      )
    }

    const supabase = createServerClient()

    const updateData: Record<string, unknown> = {
      completed_at: new Date().toISOString(),
    }
    if (reflectionText) updateData.reflection_text = reflectionText
    if (selfRating && selfRating >= 1 && selfRating <= 5) {
      updateData.self_rating = selfRating
    }

    const { error } = await supabase
      .from('exercise_completions')
      .update(updateData)
      .eq('id', completionId)
      .eq('exercise_id', params.id)

    if (error) {
      console.error('[EXERCISE COMPLETE] Failed:', error)
      return NextResponse.json(
        { error: 'Failed to complete exercise' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[EXERCISE COMPLETE] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
