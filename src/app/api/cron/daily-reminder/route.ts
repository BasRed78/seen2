import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { sendCheckinReminder } from '@/lib/email'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// This endpoint is called by Vercel Cron
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret (optional but recommended for security)
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      // In development or if no secret set, allow the request
      if (process.env.CRON_SECRET) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    const supabase = createServerClient()
    
    // Get all users with email addresses who haven't completed a check-in today
    const today = new Date().toISOString().split('T')[0]
    
    // Get all users with emails
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, name, email')
      .not('email', 'is', null)
    
    if (usersError) {
      console.error('Error fetching users:', usersError)
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
    }

    if (!users || users.length === 0) {
      return NextResponse.json({ message: 'No users with emails found', sent: 0 })
    }

    // Get today's completed check-ins
    const { data: todaysCheckins } = await supabase
      .from('checkins')
      .select('user_id')
      .eq('date', today)
      .eq('completed', true)

    const completedUserIds = new Set((todaysCheckins || []).map(c => c.user_id))

    // Filter to users who haven't checked in today
    const usersToNotify = users.filter(u => !completedUserIds.has(u.id) && u.email)

    // Get base URL from environment or request
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
                    request.headers.get('origin') || 
                    'https://seen-checkins.vercel.app'

    // Send emails
    const results = await Promise.all(
      usersToNotify.map(async (user) => {
        const result = await sendCheckinReminder(
          user.email!,
          user.name,
          baseUrl
        )
        return { userId: user.id, name: user.name, ...result }
      })
    )

    const sent = results.filter(r => r.success).length
    const failed = results.filter(r => !r.success)

    console.log(`[CRON] Sent ${sent} reminder emails, ${failed.length} failed`)
    if (failed.length > 0) {
      console.log('[CRON] Failed emails:', failed)
    }

    return NextResponse.json({
      message: `Sent ${sent} reminder emails`,
      sent,
      failed: failed.length,
      details: results
    })
  } catch (error) {
    console.error('Cron job error:', error)
    return NextResponse.json({ error: 'Failed to send notifications' }, { status: 500 })
  }
}
