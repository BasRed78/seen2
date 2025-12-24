// Combined weekly cron: generate reflections + send emails
// Runs Sunday at 9 AM

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { generateAllWeeklySummaries } from '@/lib/weekly-aggregation'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const results = {
    generation: { total: 0, successful: 0, failed: 0 },
    emails: { sent: 0, skipped: 0, failed: 0 }
  }

  // ========== PART 1: GENERATE REFLECTIONS ==========
  try {
    const genResult = await generateAllWeeklySummaries()
    results.generation = genResult
    console.log(`[WEEKLY-JOBS] Generated: ${genResult.successful}/${genResult.total} reflections`)
  } catch (error) {
    console.error('[WEEKLY-JOBS] Generation error:', error)
  }

  // ========== PART 2: SEND EMAILS ==========
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Get this week's start date
    const now = new Date()
    const day = now.getDay()
    const diffToMonday = day === 0 ? -6 : 1 - day
    const weekStart = new Date(now)
    weekStart.setDate(now.getDate() + diffToMonday)
    const weekStartStr = weekStart.toISOString().split('T')[0]

    // Find users with reflections to send
    const { data: aggregations } = await supabase
      .from('aggregations')
      .select(`
        id,
        summary_text,
        user_id,
        users!inner (
          id,
          name,
          email,
          email_reflections
        )
      `)
      .eq('type', 'weekly_summary')
      .eq('period_start', weekStartStr)

    if (aggregations && aggregations.length > 0) {
      for (const agg of aggregations) {
        const user = agg.users as any

        // Skip if user doesn't want emails or has no email
        if (!user.email || user.email_reflections === false) {
          results.emails.skipped++
          continue
        }

        // Check if already sent
        const { data: existing } = await supabase
          .from('delivery_log')
          .select('id')
          .eq('aggregation_id', agg.id)
          .eq('type', 'weekly_reflection')
          .eq('status', 'sent')
          .single()

        if (existing) {
          results.emails.skipped++
          continue
        }

        // Log the attempt
        const { data: logEntry } = await supabase
          .from('delivery_log')
          .insert({
            user_id: user.id,
            aggregation_id: agg.id,
            type: 'weekly_reflection',
            channel: 'email',
            status: 'pending'
          })
          .select('id')
          .single()

        try {
          await resend.emails.send({
            from: 'SEEN <onboarding@resend.dev>',
            to: user.email,
            subject: 'Your Weekly Reflection',
            html: generateReflectionEmail(user.name, agg.summary_text)
          })

          await supabase
            .from('delivery_log')
            .update({ status: 'sent', sent_at: new Date().toISOString() })
            .eq('id', logEntry?.id)

          results.emails.sent++
        } catch (emailError) {
          console.error(`[WEEKLY-JOBS] Email failed for ${user.email}:`, emailError)
          
          await supabase
            .from('delivery_log')
            .update({ 
              status: 'failed', 
              error_message: emailError instanceof Error ? emailError.message : 'Unknown error'
            })
            .eq('id', logEntry?.id)

          results.emails.failed++
        }
      }
    }
    console.log(`[WEEKLY-JOBS] Emails: ${results.emails.sent} sent, ${results.emails.skipped} skipped, ${results.emails.failed} failed`)
  } catch (error) {
    console.error('[WEEKLY-JOBS] Email error:', error)
  }

  return NextResponse.json({
    message: 'Weekly jobs completed',
    results
  })
}

function generateReflectionEmail(name: string, reflection: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #FDF9F6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <tr>
      <td>
        <table width="100%" style="margin-bottom: 30px;">
          <tr>
            <td align="center">
              <span style="font-size: 28px; font-weight: 800; color: #2D2A26;">SEEN</span>
            </td>
          </tr>
        </table>
        
        <p style="margin: 0 0 24px; font-size: 18px; color: #2D2A26;">Hey ${name},</p>
        
        <table width="100%" style="background-color: #F5F0E8; border-radius: 16px; margin-bottom: 30px;">
          <tr>
            <td style="padding: 28px;">
              <p style="margin: 0 0 16px; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #F06B5D;">
                Your Week in Reflection
              </p>
              <div style="font-size: 16px; line-height: 1.7; color: #2D2A26;">
                ${reflection.split('\n\n').map(p => `<p style="margin: 0 0 16px;">${p}</p>`).join('')}
              </div>
            </td>
          </tr>
        </table>
        
        <table width="100%" style="margin-bottom: 30px;">
          <tr>
            <td align="center">
              <a href="https://seen2.vercel.app/chat" 
                 style="display: inline-block; padding: 14px 32px; background-color: #F06B5D; color: #FDF9F6; text-decoration: none; font-weight: 600; border-radius: 12px;">
                Start Today's Check-in
              </a>
            </td>
          </tr>
        </table>
        
        <p style="margin: 0; font-size: 13px; color: #2D2A26; opacity: 0.5; text-align: center;">
          You're receiving this because you use SEEN.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}
