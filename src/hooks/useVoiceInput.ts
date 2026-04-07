'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

const isIOS =
  typeof navigator !== 'undefined' &&
  (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1))

function getSR(): (new () => SpeechRecognition) | null {
  if (typeof window === 'undefined') return null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any
  return w.SpeechRecognition || w.webkitSpeechRecognition || null
}

interface UseVoiceInputOptions {
  lang?: string
  onTranscript?: (fullText: string) => void
  onEnd?: () => void
}

export default function useVoiceInput(options: UseVoiceInputOptions = {}) {
  const { lang = 'en-US', onTranscript, onEnd } = options
  const [listening, setListening] = useState(false)
  const [supported, setSupported] = useState(false)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const prefixRef = useRef('')

  // Keep callbacks in refs
  const onTranscriptRef = useRef(onTranscript)
  const onEndRef = useRef(onEnd)
  const langRef = useRef(lang)
  useEffect(() => { onTranscriptRef.current = onTranscript }, [onTranscript])
  useEffect(() => { onEndRef.current = onEnd }, [onEnd])
  useEffect(() => { langRef.current = lang }, [lang])

  // Check support on mount
  useEffect(() => {
    setSupported(!!getSR())
  }, [])

  const start = useCallback(() => {
    const SR = getSR()
    if (!SR) return

    // Stop any existing instance first
    if (recognitionRef.current) {
      try { recognitionRef.current.abort() } catch { /* */ }
      recognitionRef.current = null
    }

    // Create fresh instance in user gesture context (critical for iOS)
    try {
      const rec = new SR()
      rec.continuous = false
      rec.interimResults = true
      rec.lang = langRef.current

      rec.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join('')

        const full = [prefixRef.current, transcript]
          .filter(Boolean)
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim()

        onTranscriptRef.current?.(full)
      }

      rec.onend = () => {
        setListening(false)
        recognitionRef.current = null
        onEndRef.current?.()
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      rec.onerror = (e: any) => {
        setListening(false)
        recognitionRef.current = null
      }

      rec.start()
      recognitionRef.current = rec
      setListening(true)
    } catch (e) {
      setListening(false)
    }
  }, [])

  const stop = useCallback(() => {
    if (!recognitionRef.current) return
    try {
      recognitionRef.current.stop()
    } catch { /* */ }
    setListening(false)
    recognitionRef.current = null
  }, [])

  const toggle = useCallback(() => {
    if (listening) {
      stop()
    } else {
      start()
    }
  }, [listening, start, stop])

  const setPrefix = useCallback((text: string) => {
    prefixRef.current = text
  }, [])

  return { listening, supported, start, stop, toggle, setPrefix }
}
