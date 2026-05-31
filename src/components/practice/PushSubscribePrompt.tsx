'use client'

import { useState, useEffect, useCallback } from 'react'
import { Bell, X } from 'lucide-react'
import { useTheme } from '@/lib/theme'

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ''
const DISMISSED_KEY = 'seen_push_dismissed'

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = window.atob(base64)
  const out = new Uint8Array(raw.length)
  for (let i = 0; i < raw.length; ++i) out[i] = raw.charCodeAt(i)
  return out
}

interface Props {
  userId: string
  /** Only show when the user has at least one scheduled exercise — otherwise
   *  there's nothing to remind them about and the prompt feels unearned. */
  hasScheduled: boolean
}

/**
 * Soft prompt that asks the user to allow notifications for upcoming
 * exercises. Shows as a small floating card in the bottom-right, only:
 *   - if the browser supports push
 *   - if VAPID keys are configured
 *   - if the user hasn't already subscribed
 *   - if the user hasn't dismissed the prompt before
 *   - if the user has at least one scheduled exercise
 *
 * If permission is already granted but no subscription exists, we
 * auto-subscribe silently (no UI prompt needed).
 */
export function PushSubscribePrompt({ userId, hasScheduled }: Props) {
  const theme = useTheme()
  const [show, setShow] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const [working, setWorking] = useState(false)

  const subscribe = useCallback(async () => {
    if (working) return
    setWorking(true)
    try {
      const registration = await navigator.serviceWorker.register('/sw.js')
      await navigator.serviceWorker.ready

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY) as unknown as BufferSource,
      })

      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, subscription: subscription.toJSON() }),
      })

      setSubscribed(true)
      setShow(false)
    } catch (err) {
      console.error('[PUSH] Subscription failed:', err)
      setShow(false)
    } finally {
      setWorking(false)
    }
  }, [userId, working])

  const check = useCallback(async () => {
    if (typeof window === 'undefined') return
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return
    if (!VAPID_PUBLIC_KEY) return
    if (!hasScheduled) return
    if (localStorage.getItem(DISMISSED_KEY)) return

    const registration = await navigator.serviceWorker.getRegistration('/sw.js')
    if (registration) {
      const existing = await registration.pushManager.getSubscription()
      if (existing) {
        setSubscribed(true)
        return
      }
    }

    if (Notification.permission === 'denied') return
    if (Notification.permission === 'granted') {
      await subscribe()
      return
    }

    setTimeout(() => setShow(true), 2500)
  }, [hasScheduled, subscribe])

  useEffect(() => {
    check()
  }, [check])

  const dismiss = () => {
    localStorage.setItem(DISMISSED_KEY, '1')
    setShow(false)
  }

  if (!show || subscribed) return null

  return (
    <div
      role="dialog"
      aria-label="Enable notifications"
      style={{
        position: 'fixed',
        bottom: 90,
        right: 16,
        zIndex: 35,
        width: 'min(320px, calc(100vw - 32px))',
        backgroundColor: theme.card,
        border: `1px solid ${theme.border}`,
        borderRadius: 14,
        padding: '14px 16px',
        boxShadow: '0 10px 28px rgba(0,0,0,0.12)',
      }}
    >
      <button
        onClick={dismiss}
        aria-label="Dismiss"
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          background: 'transparent',
          border: 'none',
          color: theme.textMuted,
          cursor: 'pointer',
          padding: 4,
          display: 'flex',
        }}
      >
        <X size={14} />
      </button>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: `${theme.cyan}20`,
            color: theme.cyanDeep,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
          aria-hidden="true"
        >
          <Bell size={16} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              margin: '0 0 4px',
              color: theme.text,
              fontSize: '0.92rem',
              fontWeight: 600,
            }}
          >
            Reminders on?
          </p>
          <p style={{ margin: '0 0 10px', color: theme.textMuted, fontSize: '0.8rem', lineHeight: 1.4 }}>
            We&apos;ll nudge you a few minutes before each scheduled exercise.
          </p>
          <button
            onClick={subscribe}
            disabled={working}
            style={{
              padding: '7px 14px',
              borderRadius: 9,
              backgroundColor: theme.cyan,
              color: '#fff',
              border: 'none',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: working ? 'default' : 'pointer',
              opacity: working ? 0.6 : 1,
            }}
          >
            {working ? 'One moment...' : 'Turn on'}
          </button>
        </div>
      </div>
    </div>
  )
}
