// Combined daily cron: reminders + extraction backup
// Runs daily at 9 AM

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { sendCheckinReminder } from '@/lib/email'
import { extractFromCheckin } from '@/lib/extraction-handler'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const results = {
    reminders: { sent: 0, failed: 0 },
    extractions: { processed: 0, successful: 0, failed: 0 }
  }

  const supabase = createServerClient()

  // ========== PART 1: SEND REMINDERS ==========
  try {
    const today = new Date().toISOString().split('T')[0]
    
    const { data: users } = await supabase
      .from('users')
      .select('id, name, email')
      .not('email', 'is', null)

    if (users && users.length > 0) {
      const { data: todaysCheckins } = await supabase
        .from('checkins')
        .select('user_id')
        .eq('date', today)
        .eq('completed', true)

      const completedUserIds = new Set((todaysCheckins || []).map(c => c.user_id))
      const usersToNotify = users.filter(u => !completedUserIds.has(u.id) && u.email)

      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://seen2.vercel.app'

      for (const user of usersToNotify) {
        const result = await sendCheckinReminder(user.email!, user.name, baseUrl)
        if (result.success) {
          results.reminders.sent++
        } else {
          results.reminders.failed++
        }
      }
    }
    console.log(`[DAILY-JOBS] Reminders: ${results.reminders.sent} sent, ${results.reminders.failed} failed`)
  } catch (error) {
    console.error('[DAILY-JOBS] Reminder error:', error)
  }

  // ========== PART 2: BACKUP EXTRACTION ==========
  try {
    // Find completed check-ins from yesterday that weren't extracted
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]

    const { data: checkins } = await supabase
      .from('checkins')
      .select('id')
      .eq('completed', true)
      .or('extracted.is.null,extracted.eq.false')
      .gte('date', yesterdayStr)
      .limit(50)

    if (checkins && checkins.length > 0) {
      results.extractions.processed = checkins.length

      for (const checkin of checkins) {
        const result = await extractFromCheckin(checkin.id)
        if (result.success) {
          results.extractions.successful++
        } else {
          results.extractions.failed++
        }
      }
    }
    console.log(`[DAILY-JOBS] Extractions: ${results.extractions.successful}/${results.extractions.processed} successful`)
  } catch (error) {
    console.error('[DAILY-JOBS] Extraction error:', error)
  }

  return NextResponse.json({
    message: 'Daily jobs completed',
    results
  })
}
