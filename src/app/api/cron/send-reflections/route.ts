// Sends weekly reflections via email
// Trigger: Every Sunday at 10:00 AM (after generation)

import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    // Get this week's start date
    const now = new Date();
    const day = now.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() + diffToMonday);
    const weekStartStr = weekStart.toISOString().split('T')[0];

    // Find users with reflections to send
    const { data: aggregations, error } = await supabase
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
      .eq('period_start', weekStartStr);

    if (error) {
      console.error('[CRON:SEND] Failed to fetch aggregations:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    if (!aggregations || aggregations.length === 0) {
      return NextResponse.json({ message: 'No reflections to send' });
    }

    let sent = 0;
    let skipped = 0;
    let failed = 0;

    for (const agg of aggregations) {
      const user = agg.users as any;
      
      // Skip if user doesn't want emails or has no email
      if (!user.email || !user.email_reflections) {
        skipped++;
        continue;
      }

      // Check if already sent
      const { data: existing } = await supabase
        .from('delivery_log')
        .select('id')
        .eq('aggregation_id', agg.id)
        .eq('type', 'weekly_reflection')
        .eq('status', 'sent')
        .single();

      if (existing) {
        skipped++;
        continue;
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
        .single();

      try {
        // Send the email
        await resend.emails.send({
          from: 'SEEN <hello@tryseen.app>',
          to: user.email,
          subject: 'Your Weekly Reflection',
          html: generateReflectionEmail(user.name, agg.summary_text)
        });

        // Update log
        await supabase
          .from('delivery_log')
          .update({ 
            status: 'sent', 
            sent_at: new Date().toISOString() 
          })
          .eq('id', logEntry?.id);

        sent++;

      } catch (emailError) {
        console.error(`[CRON:SEND] Failed to send to ${user.email}:`, emailError);
        
        await supabase
          .from('delivery_log')
          .update({ 
            status: 'failed', 
            error_message: emailError instanceof Error ? emailError.message : 'Unknown error'
          })
          .eq('id', logEntry?.id);

        failed++;
      }
    }

    return NextResponse.json({ sent, skipped, failed });

  } catch (error) {
    console.error('[CRON:SEND] Error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

function generateReflectionEmail(name: string, reflection: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Your Weekly Reflection</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #FDF9F6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <tr>
      <td>
        <!-- Header -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
          <tr>
            <td align="center">
              <span style="font-size: 28px; font-weight: 800; color: #2D2A26; letter-spacing: -0.5px;">SEEN</span>
            </td>
          </tr>
        </table>
        
        <!-- Greeting -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
          <tr>
            <td>
              <p style="margin: 0; font-size: 18px; color: #2D2A26;">Hey ${name},</p>
            </td>
          </tr>
        </table>
        
        <!-- Reflection content -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F5F0E8; border-radius: 16px; margin-bottom: 30px;">
          <tr>
            <td style="padding: 28px;">
              <p style="margin: 0 0 16px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #F06B5D;">
                Your Week in Reflection
              </p>
              <div style="font-size: 16px; line-height: 1.7; color: #2D2A26;">
                ${reflection.split('\n\n').map(p => `<p style="margin: 0 0 16px 0;">${p}</p>`).join('')}
              </div>
            </td>
          </tr>
        </table>
        
        <!-- CTA -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
          <tr>
            <td align="center">
              <a href="https://tryseen.app/checkin" 
                 style="display: inline-block; padding: 14px 32px; background-color: #F06B5D; color: #FDF9F6; text-decoration: none; font-weight: 600; border-radius: 12px; font-size: 16px;">
                Start Today's Check-in
              </a>
            </td>
          </tr>
        </table>
        
        <!-- Footer -->
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center" style="padding-top: 20px; border-top: 1px solid #E5E0D8;">
              <p style="margin: 0; font-size: 13px; color: #2D2A26; opacity: 0.5;">
                You're receiving this because you use SEEN.<br>
                <a href="https://tryseen.app/settings" style="color: #F06B5D;">Manage email preferences</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}
