'use client'

import { useState } from 'react'

const palette = {
  bg: '#faf8f5',
  surface: '#ffffff',
  text: '#1a1a2e',
  muted: 'rgba(26,26,46,0.65)',
  dim: 'rgba(26,26,46,0.45)',
  line: 'rgba(26,26,46,0.08)',
  accent: '#4ECDC4',
  accentDeep: '#2BA39B',
}

interface Props {
  token: string
  recipientName: string
}

export function NdaGate({ token, recipientName }: Props) {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const accept = async () => {
    if (submitting) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/letter-accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
      const data = await res.json()
      if (!res.ok || !data.redirect) {
        throw new Error(data.error || 'Onbekende fout')
      }
      // Hard navigation so the cookie is sent on next request
      window.location.href = data.redirect
    } catch (err) {
      console.error(err)
      setError('Er ging iets mis. Probeer het opnieuw of neem contact op met Bas.')
      setSubmitting(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: palette.bg,
        color: palette.text,
        fontFamily: 'Inter Tight, system-ui, -apple-system, sans-serif',
        padding: '4rem 1.25rem',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300..600&family=Inter+Tight:wght@400..600&display=swap');
      `}</style>

      <div style={{ maxWidth: 560, width: '100%' }}>
        {/* Wordmark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '2.5rem' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill={palette.accent} aria-hidden="true">
            <path d="M12 0L13.5 10.5L24 12L13.5 13.5L12 24L10.5 13.5L0 12L10.5 10.5L12 0Z" />
          </svg>
          <span style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '1.05rem', letterSpacing: '-0.01em' }}>Seen</span>
        </div>

        {/* Eyebrow + heading */}
        <p style={{ fontSize: '0.72rem', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: palette.accent, margin: '0 0 1.1rem' }}>
          Vertrouwelijk · voor {recipientName}
        </p>
        <h1 style={{
          fontFamily: 'Fraunces, Georgia, serif',
          fontWeight: 300,
          fontSize: '2.25rem',
          lineHeight: 1.1,
          letterSpacing: '-0.025em',
          margin: '0 0 1.75rem',
        }}>
          Voor je verder leest.
        </h1>

        {/* Body */}
        <div style={{ color: palette.muted, fontSize: '1.0625rem', lineHeight: 1.65 }}>
          <p style={{ margin: '0 0 1rem' }}>
            Wat hierna volgt is een persoonlijk overzicht van Seen Fase 2, een product dat nog in ontwikkeling is en nog niet publiekelijk is gelanceerd. Het bevat ontwerp, productrichting en ideeën die niet voor breder publiek bedoeld zijn.
          </p>
          <p style={{ margin: '0 0 1rem', color: palette.text, fontWeight: 500 }}>
            Door op &lsquo;Akkoord en doorlezen&rsquo; te klikken, bevestig je dat:
          </p>
          <ul style={{ margin: '0 0 1.5rem', paddingLeft: '1.25rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>Je deze inhoud vertrouwelijk behandelt.</li>
            <li style={{ marginBottom: '0.5rem' }}>Je geen schermafbeeldingen, citaten of teksten deelt zonder voorafgaande toestemming van Bas.</li>
            <li style={{ marginBottom: '0.5rem' }}>Je eventuele feedback of vragen rechtstreeks aan Bas terugkoppelt.</li>
          </ul>
          <p style={{ margin: '0 0 2rem' }}>
            Dit is een uitnodiging tot meedenken, geen openbare communicatie. Bedankt voor je discretie.
          </p>
        </div>

        {/* Action */}
        <button
          type="button"
          onClick={accept}
          disabled={submitting}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.55rem',
            padding: '0.85rem 1.5rem',
            background: palette.accent,
            color: '#fff',
            border: 'none',
            borderRadius: 999,
            fontFamily: 'Inter Tight, system-ui, -apple-system, sans-serif',
            fontSize: '0.95rem',
            fontWeight: 600,
            cursor: submitting ? 'default' : 'pointer',
            opacity: submitting ? 0.6 : 1,
            transition: 'background 0.15s ease, transform 0.15s ease',
            boxShadow: '0 4px 14px rgba(78,205,196,0.25)',
          }}
        >
          {submitting ? 'Een moment...' : 'Akkoord en doorlezen →'}
        </button>

        {error && (
          <p style={{ marginTop: '1rem', color: '#c0392b', fontSize: '0.9rem' }}>{error}</p>
        )}

        <p style={{ marginTop: '3rem', color: palette.dim, fontSize: '0.8rem' }}>
          Deze link is persoonlijk aan jou gekoppeld. Bezoeken worden vastgelegd voor Bas.
        </p>
      </div>
    </div>
  )
}
