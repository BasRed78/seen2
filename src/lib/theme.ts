'use client'

import { useEffect, useState } from 'react'

// Unified palette shape used by Phase 2 surfaces.
// Phase 1 keeps using the raw `colors` object directly.
export interface Theme {
  bg: string            // page background
  card: string          // surface for cards
  cardHover: string     // nested/inset surfaces, pills
  text: string          // primary text
  textMuted: string     // secondary text
  textFaint: string     // tertiary text
  border: string        // subtle borders
  subtle: string        // alias for border
  cyan: string          // primary accent
  cyanLight: string     // softer cyan variant
  cyanDeep: string      // darker cyan for small text on light bg
  coral: string         // secondary accent (not used in Phase 2 much)
  gold: string          // warning / upcoming
  shadow: string        // standard card shadow
  isDark: boolean
}

export const darkTheme: Theme = {
  bg: '#0f0f1a',
  card: '#1a1a2e',
  cardHover: '#252542',
  text: '#faf8f5',
  textMuted: 'rgba(250,248,245,0.6)',
  textFaint: 'rgba(250,248,245,0.4)',
  border: 'rgba(255,255,255,0.08)',
  subtle: 'rgba(255,255,255,0.08)',
  cyan: '#4ECDC4',
  cyanLight: '#7EDED6',
  cyanDeep: '#4ECDC4',
  coral: '#e85a4f',
  gold: '#FFD93D',
  shadow: 'none',
  isDark: true,
}

export const lightTheme: Theme = {
  bg: '#faf8f5',
  card: '#ffffff',
  cardHover: '#f3ede4',
  text: '#1a1a2e',
  textMuted: 'rgba(26,26,46,0.6)',
  textFaint: 'rgba(26,26,46,0.4)',
  border: 'rgba(26,26,46,0.08)',
  subtle: 'rgba(26,26,46,0.08)',
  cyan: '#4ECDC4',
  cyanLight: '#7EDED6',
  cyanDeep: '#2BA39B',
  coral: '#e85a4f',
  gold: '#F2B800',
  shadow: '0 2px 8px rgba(26,26,46,0.04)',
  isDark: false,
}

/**
 * Returns the active Phase 2 theme based on system preference.
 * Defaults to light theme. Switches to dark when system `prefers-color-scheme: dark`.
 *
 * Phase 1 does not use this hook — it keeps its hardcoded dark/coral palette.
 */
export function useTheme(): Theme {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    setIsDark(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches)
    if (mq.addEventListener) {
      mq.addEventListener('change', handler)
      return () => mq.removeEventListener('change', handler)
    }
    // Safari < 14 fallback
    mq.addListener(handler)
    return () => mq.removeListener(handler)
  }, [])

  return isDark ? darkTheme : lightTheme
}
