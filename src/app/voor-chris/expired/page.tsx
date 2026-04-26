export default function Expired() {
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
        <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '1.75rem', fontWeight: 300, margin: '0 0 1rem' }}>
          Sessie verlopen.
        </h1>
        <p style={{ color: 'rgba(26,26,46,0.65)', lineHeight: 1.6 }}>
          Open de oorspronkelijke link opnieuw om verder te lezen.
        </p>
      </div>
    </div>
  )
}
