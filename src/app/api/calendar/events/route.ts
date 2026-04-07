import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

interface ScheduleEntry {
  exerciseId?: string
  customTitle?: string
  scheduledAt: string
  durationMinutes: number
}

export async function POST(request: NextRequest) {
  try {
    const { userId, exercises, postSessionCheckinId } = await request.json() as {
      userId: string
      exercises: ScheduleEntry[]
      postSessionCheckinId?: string
    }

    if (!userId || !exercises || exercises.length === 0) {
      return NextResponse.json({ error: 'userId and exercises are required' }, { status: 400 })
    }

    const supabase = createServerClient()
    const results: Array<{ id: string }> = []

    for (const exercise of exercises) {
      const { data: scheduled, error: dbError } = await supabase
        .from('scheduled_exercises')
        .insert({
          user_id: userId,
          exercise_id: exercise.exerciseId || null,
          custom_title: exercise.customTitle || null,
          scheduled_at: exercise.scheduledAt,
          duration_minutes: exercise.durationMinutes,
          post_session_checkin_id: postSessionCheckinId || null,
        })
        .select('id')
        .single()

      if (dbError) {
        console.error('[CALENDAR] DB error:', dbError)
      } else if (scheduled) {
        results.push({ id: scheduled.id })
      }
    }

    return NextResponse.json({ scheduled: results })
  } catch (error) {
    console.error('[CALENDAR] Event creation error:', error)
    return NextResponse.json({ error: 'Failed to schedule exercises' }, { status: 500 })
  }
}
