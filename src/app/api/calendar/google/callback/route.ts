import { NextRequest } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')
  const state = request.nextUrl.searchParams.get('state') // userId
  const error = request.nextUrl.searchParams.get('error')

  // Render a minimal HTML page that communicates back to the opener
  const renderPage = (message: string, success: boolean) => {
    return new Response(
      `<!DOCTYPE html>
<html>
<head><title>SEEN - Calendar</title></head>
<body style="background:#0f0f1a;color:#faf8f5;font-family:system-ui;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;">
<div style="text-align:center;padding:24px;">
  <p style="font-size:1.1rem;">${message}</p>
  <p style="opacity:0.6;font-size:0.9rem;">This window will close automatically.</p>
</div>
<script>
  if (window.opener) {
    window.opener.postMessage({ type: '${success ? 'google-calendar-connected' : 'google-calendar-error'}' }, '*');
  }
  setTimeout(() => window.close(), 2000);
</script>
</body>
</html>`,
      { headers: { 'Content-Type': 'text/html' } }
    )
  }

  if (error || !code || !state) {
    return renderPage('Could not connect to Google Calendar. Please try again.', false)
  }

  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  const redirectUri = process.env.GOOGLE_CALENDAR_REDIRECT_URI

  if (!clientId || !clientSecret || !redirectUri) {
    return renderPage('Google Calendar is not configured.', false)
  }

  try {
    // Exchange authorization code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    })

    const tokenData = await tokenResponse.json()

    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error('[CALENDAR] Token exchange failed:', tokenData)
      return renderPage('Failed to connect. Please try again.', false)
    }

    const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000)

    // Store tokens in Supabase (upsert on user_id + provider)
    const supabase = createServerClient()

    const { error: dbError } = await supabase
      .from('user_calendar_connections')
      .upsert(
        {
          user_id: state,
          provider: 'google',
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token,
          token_expires_at: expiresAt.toISOString(),
          connected_at: new Date().toISOString(),
          disconnected_at: null,
        },
        { onConflict: 'user_id,provider' }
      )

    if (dbError) {
      console.error('[CALENDAR] DB error storing tokens:', dbError)
      return renderPage('Failed to save connection. Please try again.', false)
    }

    return renderPage('Google Calendar connected!', true)
  } catch (err) {
    console.error('[CALENDAR] OAuth callback error:', err)
    return renderPage('Something went wrong. Please try again.', false)
  }
}
