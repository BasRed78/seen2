// Exercise nudge cron — sends Web Push notifications a few minutes before
// each scheduled exercise starts.
//
// Schedule: every 10 minutes via GitHub Actions (.github/workflows/exercise-nudges.yml).
// Auth: requires `Authorization: Bearer <CRON_SECRET>` header.
//
// Behaviour:
//   - Finds scheduled_exercises with scheduled_at in [now, now + 15 min],
//     status='scheduled', and nudge_sent_at IS NULL.
//   - Sends one push per user (we group by user_id so a user with two
//     exercises in the window gets one combined notification, not two).
//   - Marks each scheduled_exercises row's nudge_sent_at to prevent
//     double-sending if the cron fires twice within the window.

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { sendPushToUser } from '@/lib/push'

export const dynamic = 'force-dynamic'

const LOOKAHEAD_MIN = 15

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServerClient()

  const now = new Date()
  const upper = new Date(now.getTime() + LOOKAHEAD_MIN * 60_000)

  const { data: rows, error } = await supabase
    .from('scheduled_exercises')
    .select('id, user_id, custom_title, scheduled_at, exercise_id, exercise:exercises(title)')
    .eq('status', 'scheduled')
    .is('nudge_sent_at', null)
    .gte('scheduled_at', now.toISOString())
    .lte('scheduled_at', upper.toISOString())

  if (error) {
    console.error('[NUDGE-CRON] Fetch error:', error)
    return NextResponse.json({ error: 'Fetch failed' }, { status: 500 })
  }

  if (!rows || rows.length === 0) {
    return NextResponse.json({ processed: 0, sent: 0 })
  }

  // Group by user so each user gets at most one notification this run
  const byUser = new Map<string, typeof rows>()
  for (const row of rows) {
    const list = byUser.get(row.user_id) || []
    list.push(row)
    byUser.set(row.user_id, list)
  }

  let totalSent = 0
  let totalFailed = 0
  const markIds: string[] = []

  for (const [userId, userRows] of Array.from(byUser.entries())) {
    // Sort by soonest, take the first as the notification anchor
    userRows.sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime())
    const next = userRows[0]
    const others = userRows.length - 1

    const exerciseTitle =
      next.custom_title ||
      (next.exercise as { title?: string } | null)?.title ||
      'Your exercise'

    const minutes = Math.max(
      1,
      Math.round((new Date(next.scheduled_at).getTime() - now.getTime()) / 60_000)
    )

    const body =
      others > 0
        ? `${exerciseTitle} in ${minutes} min · +${others} more today`
        : `${exerciseTitle} in ${minutes} min`

    const url = next.exercise_id
      ? `/practice/exercises/${next.exercise_id}?scheduled=${next.id}`
      : '/home'

    const result = await sendPushToUser(userId, {
      title: 'Coming up',
      body,
      url,
      tag: `seen-exercise-${next.id}`,
    })

    totalSent += result.sent
    totalFailed += result.failed

    // Mark all rows in this user's batch so we don't re-notify
    for (const r of userRows) markIds.push(r.id)
  }

  if (markIds.length > 0) {
    const { error: markError } = await supabase
      .from('scheduled_exercises')
      .update({ nudge_sent_at: now.toISOString() })
      .in('id', markIds)
    if (markError) {
      console.error('[NUDGE-CRON] Mark error:', markError)
    }
  }

  return NextResponse.json({
    processed: rows.length,
    users: byUser.size,
    sent: totalSent,
    failed: totalFailed,
  })
}
