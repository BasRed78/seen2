import { useState, useEffect, useCallback } from 'react'

interface UseGoogleCalendarOptions {
  userId: string | null
}

export default function useGoogleCalendar({ userId }: UseGoogleCalendarOptions) {
  const [isConnected, setIsConnected] = useState(false)
  const [loading, setLoading] = useState(true)

  // Check connection status on mount
  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    fetch(`/api/calendar/status?userId=${userId}`)
      .then(res => res.json())
      .then(data => {
        setIsConnected(data.connected)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [userId])

  // Listen for OAuth callback message from popup
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'google-calendar-connected') {
        setIsConnected(true)
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  // Open OAuth popup — must be called synchronously from a click handler
  const connect = useCallback(() => {
    if (!userId) return

    // Open popup immediately (synchronous, from user gesture)
    const popup = window.open('about:blank', 'google-calendar', 'width=500,height=600,left=200,top=100')

    // Then fetch the auth URL and redirect the popup
    fetch(`/api/calendar/google/authorize?userId=${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.url && popup) {
          popup.location.href = data.url
        }
      })
      .catch(() => {
        popup?.close()
      })
  }, [userId])

  return { isConnected, loading, connect }
}
