import webpush from 'web-push'
import { createServerClient } from '@/lib/supabase'

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ''
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || ''
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || 'mailto:bas@ffortitude.nl'

let configured = false
function configure() {
  if (configured) return
  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) return
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY)
  configured = true
}

export interface PushPayload {
  title: string
  body: string
  url?: string
  tag?: string
}

interface SubscriptionRow {
  id: string
  endpoint: string
  keys_p256dh: string
  keys_auth: string
}

/**
 * Send a single push to one user. If the user has multiple subscriptions
 * (e.g. iPhone PWA + desktop browser), all of them are notified.
 *
 * Expired or invalid subscriptions (HTTP 404 or 410) are pruned from the
 * database so we don't keep retrying dead endpoints.
 */
export async function sendPushToUser(userId: string, payload: PushPayload) {
  configure()
  if (!configured) {
    console.warn('[PUSH] VAPID keys not configured, skipping')
    return { sent: 0, failed: 0 }
  }

  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('push_subscriptions')
    .select('id, endpoint, keys_p256dh, keys_auth')
    .eq('user_id', userId)

  if (error) {
    console.error('[PUSH] Fetch subscriptions error:', error)
    return { sent: 0, failed: 0 }
  }

  const subscriptions = (data || []) as SubscriptionRow[]
  if (subscriptions.length === 0) return { sent: 0, failed: 0 }

  let sent = 0
  let failed = 0

  for (const sub of subscriptions) {
    try {
      await webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: { p256dh: sub.keys_p256dh, auth: sub.keys_auth },
        },
        JSON.stringify(payload)
      )
      sent++
    } catch (err: unknown) {
      const status = (err as { statusCode?: number })?.statusCode
      if (status === 404 || status === 410) {
        await supabase.from('push_subscriptions').delete().eq('id', sub.id)
      }
      failed++
    }
  }

  return { sent, failed }
}
