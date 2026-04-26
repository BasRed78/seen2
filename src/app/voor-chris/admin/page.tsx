'use client'

import { useEffect, useMemo, useState } from 'react'

interface TokenRow {
  id: string
  token: string
  letter_id: string
  recipient_name: string
  recipient_email: string | null
  notes: string | null
  created_at: string
  revoked_at: string | null
}

interface LogRow {
  id: string
  token_id: string
  event: 'visit' | 'nda_accepted'
  occurred_at: string
  ip: string | null
  user_agent: string | null
}

const palette = {
  bg: '#faf8f5',
  surface: '#ffffff',
  text: '#1a1a2e',
  muted: 'rgba(26,26,46,0.65)',
  dim: 'rgba(26,26,46,0.45)',
  line: 'rgba(26,26,46,0.08)',
  accent: '#4ECDC4',
  shadow: '0 2px 8px rgba(26,26,46,0.04)',
}

export default function LetterAdmin() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [tokens, setTokens] = useState<TokenRow[]>([])
  const [logs, setLogs] = useState<LogRow[]>([])
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [notes, setNotes] = useState('')
  const [letterId, setLetterId] = useState('voor-chris')
  const [error, setError] = useState<string | null>(null)
  const [origin, setOrigin] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') setOrigin(window.location.origin)
  }, [])

  const load = async (pw: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/letter-admin', { headers: { 'X-Admin-Password': pw } })
      if (!res.ok) {
        setError('Wrong password')
        setAuthed(false)
        return
      }
      const data = await res.json()
      setTokens(data.tokens)
      setLogs(data.logs)
      setAuthed(true)
    } finally {
      setLoading(false)
    }
  }

  const createToken = async () => {
    if (!name.trim()) return
    setCreating(true)
    setError(null)
    try {
      const res = await fetch('/api/letter-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Admin-Password': password },
        body: JSON.stringify({ recipient_name: name, recipient_email: email || undefined, notes: notes || undefined, letter_id: letterId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      setName(''); setEmail(''); setNotes('')
      await load(password)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setCreating(false)
    }
  }

  const revoke = async (id: string) => {
    if (!confirm('Revoke this link? They lose access immediately.')) return
    await fetch('/api/letter-admin', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'X-Admin-Password': password },
      body: JSON.stringify({ id }),
    })
    await load(password)
  }

  const logsByToken = useMemo(() => {
    const map: Record<string, LogRow[]> = {}
    for (const l of logs) {
      if (!map[l.token_id]) map[l.token_id] = []
      map[l.token_id].push(l)
    }
    return map
  }, [logs])

  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: palette.bg, color: palette.text, fontFamily: 'Inter Tight, system-ui, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 360, padding: 24 }}>
          <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 300, fontSize: '1.5rem', marginTop: 0 }}>Letter admin</h1>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Admin password"
            onKeyDown={e => { if (e.key === 'Enter') load(password) }}
            style={{
              width: '100%', padding: '0.7rem 1rem', borderRadius: 10,
              border: `1px solid ${palette.line}`, marginBottom: 12, fontSize: '0.9rem', boxSizing: 'border-box',
            }}
          />
          <button
            onClick={() => load(password)}
            disabled={loading}
            style={{
              width: '100%', padding: '0.7rem 1rem', borderRadius: 10,
              backgroundColor: palette.accent, color: '#fff', border: 'none',
              fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer',
            }}
          >
            {loading ? 'Loading...' : 'Sign in'}
          </button>
          {error && <p style={{ color: '#c0392b', fontSize: '0.85rem', marginTop: 12 }}>{error}</p>}
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: palette.bg, color: palette.text, fontFamily: 'Inter Tight, system-ui, sans-serif', padding: '2rem 1.5rem' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 300, fontSize: '2rem', margin: '0 0 0.25rem' }}>Letter admin</h1>
        <p style={{ color: palette.muted, fontSize: '0.9rem', marginTop: 0, marginBottom: '2rem' }}>Manage per-recipient access tokens and review the access log.</p>

        {/* Create new token */}
        <div style={{ background: palette.surface, border: `1px solid ${palette.line}`, borderRadius: 14, padding: '1.5rem', marginBottom: '2rem', boxShadow: palette.shadow }}>
          <h2 style={{ margin: '0 0 1rem', fontSize: '1.1rem', fontWeight: 600 }}>Create new link</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Recipient name (e.g. Chris)" style={{ padding: '0.6rem 0.85rem', borderRadius: 8, border: `1px solid ${palette.line}`, fontSize: '0.9rem' }} />
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email (optional)" style={{ padding: '0.6rem 0.85rem', borderRadius: 8, border: `1px solid ${palette.line}`, fontSize: '0.9rem' }} />
          </div>
          <input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notes (optional)" style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: 8, border: `1px solid ${palette.line}`, fontSize: '0.9rem', marginBottom: 12, boxSizing: 'border-box' }} />
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <input value={letterId} onChange={e => setLetterId(e.target.value)} style={{ width: 160, padding: '0.6rem 0.85rem', borderRadius: 8, border: `1px solid ${palette.line}`, fontSize: '0.9rem' }} />
            <button onClick={createToken} disabled={!name.trim() || creating} style={{ padding: '0.6rem 1.25rem', borderRadius: 8, background: palette.accent, color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer', opacity: !name.trim() || creating ? 0.5 : 1 }}>
              {creating ? 'Creating...' : 'Create link'}
            </button>
          </div>
          {error && <p style={{ color: '#c0392b', fontSize: '0.85rem', marginTop: 8 }}>{error}</p>}
        </div>

        {/* Tokens table */}
        <div style={{ background: palette.surface, border: `1px solid ${palette.line}`, borderRadius: 14, padding: '1.5rem', boxShadow: palette.shadow }}>
          <h2 style={{ margin: '0 0 1rem', fontSize: '1.1rem', fontWeight: 600 }}>Tokens ({tokens.length})</h2>
          {tokens.length === 0 && <p style={{ color: palette.muted }}>No tokens yet. Create one above.</p>}
          {tokens.map(t => {
            const tLogs = logsByToken[t.id] || []
            const visits = tLogs.filter(l => l.event === 'visit')
            const accepted = tLogs.find(l => l.event === 'nda_accepted')
            const link = `${origin}/voor-chris/${t.token}`
            return (
              <div key={t.id} style={{ borderTop: `1px solid ${palette.line}`, padding: '1rem 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontWeight: 600 }}>
                      {t.recipient_name}
                      {t.revoked_at && <span style={{ color: '#c0392b', fontSize: '0.75rem', marginLeft: 8 }}>REVOKED</span>}
                    </p>
                    {t.recipient_email && <p style={{ margin: '2px 0 0', color: palette.muted, fontSize: '0.85rem' }}>{t.recipient_email}</p>}
                    {t.notes && <p style={{ margin: '2px 0 0', color: palette.dim, fontSize: '0.8rem', fontStyle: 'italic' }}>{t.notes}</p>}
                    <p style={{ margin: '6px 0 0', fontSize: '0.75rem', color: palette.dim }}>
                      Letter: <strong style={{ color: palette.muted }}>{t.letter_id}</strong> · created {new Date(t.created_at).toLocaleString('en-GB')}
                    </p>
                    <div style={{ marginTop: 8, padding: '8px 12px', background: palette.bg, borderRadius: 8, fontSize: '0.8rem', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                      {link}
                    </div>
                    <button
                      onClick={() => navigator.clipboard.writeText(link)}
                      style={{ marginTop: 6, padding: '4px 10px', fontSize: '0.75rem', background: 'transparent', border: `1px solid ${palette.line}`, borderRadius: 6, cursor: 'pointer' }}
                    >
                      Copy link
                    </button>
                  </div>
                  <div style={{ minWidth: 180, textAlign: 'right' }}>
                    <p style={{ margin: 0, fontSize: '0.85rem' }}>
                      <strong>{visits.length}</strong> visit{visits.length === 1 ? '' : 's'}
                    </p>
                    <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: accepted ? palette.accent : palette.dim }}>
                      {accepted ? `NDA accepted ${new Date(accepted.occurred_at).toLocaleString('en-GB')}` : 'NDA not yet accepted'}
                    </p>
                    {visits[0] && (
                      <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: palette.dim }}>
                        Last visit: {new Date(visits[0].occurred_at).toLocaleString('en-GB')}
                      </p>
                    )}
                    {!t.revoked_at && (
                      <button onClick={() => revoke(t.id)} style={{ marginTop: 8, padding: '4px 10px', fontSize: '0.75rem', background: 'transparent', border: '1px solid #c0392b', color: '#c0392b', borderRadius: 6, cursor: 'pointer' }}>
                        Revoke
                      </button>
                    )}
                  </div>
                </div>

                {tLogs.length > 0 && (
                  <details style={{ marginTop: 8 }}>
                    <summary style={{ cursor: 'pointer', fontSize: '0.8rem', color: palette.dim }}>Activity log ({tLogs.length})</summary>
                    <div style={{ marginTop: 8, fontSize: '0.78rem', color: palette.muted, fontFamily: 'monospace' }}>
                      {tLogs.map(l => (
                        <div key={l.id} style={{ padding: '3px 0', borderBottom: `1px dotted ${palette.line}` }}>
                          {new Date(l.occurred_at).toLocaleString('en-GB')} · <strong>{l.event}</strong> · {l.ip || '-'} · {l.user_agent?.slice(0, 80) || '-'}
                        </div>
                      ))}
                    </div>
                  </details>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
