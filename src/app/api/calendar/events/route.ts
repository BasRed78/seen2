import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

// Refresh a Google access token
async function refreshGoogleToken(supabase: ReturnType<typeof createServerClient>, userId: string) {
  const { data: connection } = await supabase
    .from('user_calendar_connections')
    .select('*')
    .eq('user_id', userId)
    .eq('provider', 'google')
    .is('disconnected_at', null)
    .single()

  if (!connection) return null

  // Check if token is still valid (with 60s buffer)
  if (new Date(connection.token_expires_at) > new Date(Date.now() + 60000)) {
    return connection.access_token
  }

  // Refresh the token
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      refresh_token: connection.refresh_token,
      grant_type: 'refresh_token',
    }),
  })

  const tokenData = await response.json()

  if (!response.ok || !tokenData.access_token) {
    console.error('[CALENDAR] Token refresh failed:', tokenData)
    return null
  }

  const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000)

  await supabase
    .from('user_calendar_connections')
    .update({
      access_token: tokenData.access_token,
      token_expires_at: expiresAt.toISOString(),
    })
    .eq('id', connection.id)

  return tokenData.access_token
}

interface ScheduleEntry {
  exerciseId?: string
  customTitle?: string
  exerciseTitle?: string
  description?: string
  scheduledAt: string
  durationMinutes: number
}

export async function POST(request: NextRequest) {
  try {
    const { userId, exercises, provider, postSessionCheckinId } = await request.json() as {
      userId: string
      exercises: ScheduleEntry[]
      provider: 'google' | 'ics' | 'none'
      postSessionCheckinId?: string
    }

    if (!userId || !exercises || exercises.length === 0) {
      return NextResponse.json({ error: 'userId and exercises are required' }, { status: 400 })
    }

    const supabase = createServerClient()
    const results: Array<{ id: string; calendarEventId?: string }> = []

    // Get Google access token if needed
    let accessToken: string | null = null
    if (provider === 'google') {
      accessToken = await refreshGoogleToken(supabase, userId)
      if (!accessToken) {
        return NextResponse.json({ error: 'Google Calendar not connected or token expired' }, { status: 401 })
      }
    }

    for (const exercise of exercises) {
      const title = exercise.customTitle || exercise.exerciseTitle || 'SEEN Exercise'
      let calendarEventId: string | null = null

      // Create Google Calendar event
      if (provider === 'google' && accessToken) {
        const startTime = new Date(exercise.scheduledAt)
        const endTime = new Date(startTime.getTime() + exercise.durationMinutes * 60 * 1000)

        const eventBody = {
          summary: `SEEN: ${title}`,
          description: exercise.description || `Exercise from your SEEN practice plan.`,
          start: { dateTime: startTime.toISOString(), timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone },
          end: { dateTime: endTime.toISOString(), timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone },
          reminders: {
            useDefault: false,
            overrides: [{ method: 'popup', minutes: 15 }],
          },
        }

        const calResponse = await fetch(
          'https://www.googleapis.com/calendar/v3/calendars/primary/events',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(eventBody),
          }
        )

        if (calResponse.ok) {
          const calData = await calResponse.json()
          calendarEventId = calData.id
        } else {
          console.error('[CALENDAR] Failed to create event:', await calResponse.text())
        }
      }

      // Store in scheduled_exercises table
      const { data: scheduled, error: dbError } = await supabase
        .from('scheduled_exercises')
        .insert({
          user_id: userId,
          exercise_id: exercise.exerciseId || null,
          custom_title: exercise.customTitle || null,
          scheduled_at: exercise.scheduledAt,
          duration_minutes: exercise.durationMinutes,
          calendar_provider: provider,
          calendar_event_id: calendarEventId,
          post_session_checkin_id: postSessionCheckinId || null,
        })
        .select('id')
        .single()

      if (dbError) {
        console.error('[CALENDAR] DB error:', dbError)
      } else if (scheduled) {
        results.push({ id: scheduled.id, calendarEventId: calendarEventId || undefined })
      }
    }

    return NextResponse.json({ scheduled: results })
  } catch (error) {
    console.error('[CALENDAR] Event creation error:', error)
    return NextResponse.json({ error: 'Failed to schedule exercises' }, { status: 500 })
  }
}
