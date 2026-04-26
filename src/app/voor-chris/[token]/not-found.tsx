import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#faf8f5',
      color: '#1a1a2e',
      fontFamily: 'Inter Tight, system-ui, -apple-system, sans-serif',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
    }}>
      <div style={{ maxWidth: 480, textAlign: 'center' }}>
        <p style={{
          fontSize: '0.72rem',
          fontWeight: 500,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: '#4ECDC4',
          margin: '0 0 1rem',
        }}>
          Link niet geldig
        </p>
        <h1 style={{
          fontFamily: 'Fraunces, Georgia, serif',
          fontSize: '1.75rem',
          fontWeight: 300,
          margin: '0 0 1rem',
        }}>
          Deze link werkt niet (meer).
        </h1>
        <p style={{ color: 'rgba(26,26,46,0.65)', lineHeight: 1.6 }}>
          De link die je gebruikte is verlopen of ongeldig. Neem contact op met Bas voor een nieuwe link.
        </p>
      </div>
    </div>
  )
}
