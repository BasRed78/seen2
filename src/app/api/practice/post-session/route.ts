import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { userId, emotionalState, themeIds, reflectionText, intentionText, targetDate } =
      await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    if (!emotionalState || emotionalState < 1 || emotionalState > 10) {
      return NextResponse.json(
        { error: 'emotionalState must be between 1 and 10' },
        { status: 400 }
      )
    }

    const supabase = createServerClient()

    // Store the first selected theme in the FK column (DB supports single theme)
    // All selected theme IDs are preserved in the practice_intentions link
    const primaryThemeId = Array.isArray(themeIds) && themeIds.length > 0
      ? themeIds[0]
      : null

    // Create the post-session checkin
    const { data: checkin, error: checkinError } = await supabase
      .from('post_session_checkins')
      .insert({
        user_id: userId,
        emotional_state: emotionalState,
        selected_theme_id: primaryThemeId,
        reflection_text: reflectionText || null,
        practice_intention: intentionText || null,
        scheduled_practice_at: targetDate || null,
      })
      .select('id')
      .single()

    if (checkinError) {
      console.error('[POST-SESSION] Failed to create checkin:', checkinError)
      return NextResponse.json(
        { error: 'Failed to save check-in' },
        { status: 500 }
      )
    }

    // If intention was provided, create a practice_intentions row for tracking
    if (intentionText) {
      const { error: intentionError } = await supabase
        .from('practice_intentions')
        .insert({
          user_id: userId,
          post_session_checkin_id: checkin.id,
          intention_text: intentionText,
          theme_id: primaryThemeId,
          target_date: targetDate || null,
          status: 'active',
        })

      if (intentionError) {
        console.error('[POST-SESSION] Failed to create intention:', intentionError)
        // Non-fatal — the checkin was saved successfully
      }
    }

    return NextResponse.json({ checkinId: checkin.id })
  } catch (error) {
    console.error('[POST-SESSION] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
