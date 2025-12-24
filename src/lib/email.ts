import { Resend } from 'resend'

// Lazy initialization
function getResend() {
  return new Resend(process.env.RESEND_API_KEY)
}

// For now, use Resend's test domain. Later you'll add your own domain.
const FROM_EMAIL = 'Seen <onboarding@resend.dev>'

export async function sendCheckinReminder(
  to: string,
  name: string,
  checkinUrl: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await getResend().emails.send({
      from: FROM_EMAIL,
      to,
      subject: "Time for your daily check-in",
      html: `
        <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #205179; margin-bottom: 20px;">Hey ${name},</h2>
          
          <p style="color: #333; line-height: 1.6;">
            Just a gentle nudge - your daily check-in is waiting for you.
          </p>
          
          <p style="color: #333; line-height: 1.6;">
            It only takes 3-5 minutes, and every conversation helps you understand your patterns a little better.
          </p>
          
          <div style="margin: 30px 0;">
            <a href="${checkinUrl}" 
               style="background-color: #C25441; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
              Start Check-in
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px; line-height: 1.6;">
            No pressure if today doesn't work. Seen will be here when you're ready.
          </p>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            — Seen
          </p>
        </div>
      `,
    })

    if (error) {
      console.error('Resend error:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err) {
    console.error('Email send error:', err)
    return { success: false, error: 'Failed to send email' }
  }
}

export async function sendWelcomeEmail(
  to: string,
  name: string,
  inviteCode: string,
  checkinUrl: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await getResend().emails.send({
      from: FROM_EMAIL,
      to,
      subject: "Welcome to Seen",
      html: `
        <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #205179; margin-bottom: 20px;">Welcome to Seen, ${name}</h2>
          
          <p style="color: #333; line-height: 1.6;">
            You've taken the first step toward understanding your patterns. That takes courage.
          </p>
          
          <p style="color: #333; line-height: 1.6;">
            Your invite code is: <strong style="color: #C25441; font-size: 18px;">${inviteCode}</strong>
          </p>
          
          <p style="color: #333; line-height: 1.6;">
            Each day, we'll have a short conversation (3-5 minutes) to help you notice what's going on beneath the surface. No judgment, no fixing - just understanding.
          </p>
          
          <div style="margin: 30px 0;">
            <a href="${checkinUrl}" 
               style="background-color: #C25441; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
              Start Your First Check-in
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            — Seen
          </p>
        </div>
      `,
    })

    if (error) {
      console.error('Resend error:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err) {
    console.error('Email send error:', err)
    return { success: false, error: 'Failed to send email' }
  }
}
