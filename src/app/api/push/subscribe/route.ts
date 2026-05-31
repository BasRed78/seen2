import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

// Save a new Web Push subscription against a user. Upserts on
// (user_id, endpoint) so re-subscribing on the same device refreshes
// the keys instead of creating duplicates.
export async function POST(req: NextRequest) {
  try {
    const { userId, subscription } = await req.json()

    if (!userId || !subscription?.endpoint || !subscription?.keys) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
    }

    const supabase = createServerClient()

    const { error } = await supabase.from('push_subscriptions').upsert(
      {
        user_id: userId,
        endpoint: subscription.endpoint,
        keys_p256dh: subscription.keys.p256dh,
        keys_auth: subscription.keys.auth,
      },
      { onConflict: 'user_id,endpoint' }
    )

    if (error) {
      console.error('[PUSH-SUBSCRIBE] Save error:', error)
      return NextResponse.json({ error: 'Could not save subscription' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[PUSH-SUBSCRIBE] Error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

// Remove subscription(s) for a user. If endpoint is provided, only that
// device is removed; otherwise all subscriptions for the user are removed.
export async function DELETE(req: NextRequest) {
  try {
    const { userId, endpoint } = await req.json()
    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    const supabase = createServerClient()
    if (endpoint) {
      await supabase
        .from('push_subscriptions')
        .delete()
        .eq('user_id', userId)
        .eq('endpoint', endpoint)
    } else {
      await supabase.from('push_subscriptions').delete().eq('user_id', userId)
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
