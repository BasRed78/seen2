'use client'

import { useEffect, useState } from 'react'
import { t } from '@/lib/i18n'

// Light palette matching the letter admin for visual consistency. This page
// is admin-only and uses fixed light styling rather than the user theme.
const palette = {
  bg: '#faf8f5',
  surface: '#ffffff',
  text: '#1a1a2e',
  muted: 'rgba(26,26,46,0.65)',
  dim: 'rgba(26,26,46,0.45)',
  line: 'rgba(26,26,46,0.08)',
  accent: '#4ECDC4',
  accentDeep: '#2BA39B',
  shadow: '0 2px 8px rgba(26,26,46,0.04)',
}

interface TesterRow {
  id: string
  user_id: string
  invite_code: string
  recipient_name: string
  recipient_email: string | null
  notes: string | null
  invited_at: string
  nda_accepted_at: string | null
  onboarded_at: string | null
  last_active_at: string | null
  revoked_at: string | null
}

function statusLabel(t_: TesterRow): string {
  if (t_.revoked_at) return 'Revoked'
  if (t_.last_active_at && t_.onboarded_at) return t('tester.admin.statusActive')
  if (t_.onboarded_at) return t('tester.admin.statusOnboarded')
  if (t_.nda_accepted_at) return t('tester.admin.statusAcceptedNda')
  return t('tester.admin.statusInvited')
}

function fmt(when: string | null): string {
  if (!when) return t('common.unknown')
  return new Date(when).toLocaleString('en-GB')
}

export default function TesterAdmin() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [testers, setTesters] = useState<TesterRow[]>([])
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const [origin, setOrigin] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') setOrigin(window.location.origin)
  }, [])

  const load = async (pw: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/testers', { headers: { 'X-Admin-Password': pw } })
      if (!res.ok) {
        setError(t('tester.admin.wrongPassword'))
        setAuthed(false)
        return
      }
      const data = await res.json()
      setTesters(data.testers || [])
      setAuthed(true)
    } finally {
      setLoading(false)
    }
  }

  const createTester = async () => {
    if (!name.trim()) return
    setCreating(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/testers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Admin-Password': password },
        body: JSON.stringify({
          recipient_name: name,
          recipient_email: email || undefined,
          notes: notes || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      setName('')
      setEmail('')
      setNotes('')
      await load(password)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setCreating(false)
    }
  }

  const revoke = async (id: string) => {
    if (!confirm('Revoke this invite? The tester loses access immediately.')) return
    await fetch('/api/admin/testers', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'X-Admin-Password': password },
      body: JSON.stringify({ id }),
    })
    await load(password)
  }

  const copyLink = async (code: string) => {
    const link = `${origin}/tester/${code}`
    await navigator.clipboard.writeText(link)
    setCopied(code)
    setTimeout(() => setCopied(null), 1500)
  }

  if (!authed) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: palette.bg,
        color: palette.text,
        fontFamily: 'Inter Tight, system-ui, sans-serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{ width: 360, padding: 24 }}>
          <h1 style={{
            fontFamily: 'Fraunces, Georgia, serif',
            fontWeight: 300,
            fontSize: '1.5rem',
            marginTop: 0,
          }}>{t('tester.admin.signInTitle')}</h1>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder={t('tester.admin.passwordPlaceholder')}
            onKeyDown={e => { if (e.key === 'Enter') load(password) }}
            style={{
              width: '100%',
              padding: '0.7rem 1rem',
              borderRadius: 10,
              border: `1px solid ${palette.line}`,
              marginBottom: 12,
              fontSize: '0.9rem',
              boxSizing: 'border-box',
            }}
          />
          <button
            onClick={() => load(password)}
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.7rem 1rem',
              borderRadius: 10,
              backgroundColor: palette.accent,
              color: '#fff',
              border: 'none',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {loading ? t('tester.admin.signingIn') : t('tester.admin.signIn')}
          </button>
          {error && <p style={{ color: '#c0392b', fontSize: '0.85rem', marginTop: 12 }}>{error}</p>}
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: palette.bg,
      color: palette.text,
      fontFamily: 'Inter Tight, system-ui, sans-serif',
      padding: '2rem 1.5rem',
    }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <h1 style={{
          fontFamily: 'Fraunces, Georgia, serif',
          fontWeight: 300,
          fontSize: '2rem',
          margin: '0 0 0.25rem',
        }}>{t('tester.admin.title')}</h1>
        <p style={{ color: palette.muted, fontSize: '0.9rem', marginTop: 0, marginBottom: '2rem' }}>
          {t('tester.admin.subtitle')}
        </p>

        {/* Create new tester */}
        <div style={{
          background: palette.surface,
          border: `1px solid ${palette.line}`,
          borderRadius: 14,
          padding: '1.5rem',
          marginBottom: '2rem',
          boxShadow: palette.shadow,
        }}>
          <h2 style={{ margin: '0 0 1rem', fontSize: '1.1rem', fontWeight: 600 }}>
            {t('tester.admin.createTitle')}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder={t('tester.admin.namePlaceholder')}
              style={{ padding: '0.6rem 0.85rem', borderRadius: 8, border: `1px solid ${palette.line}`, fontSize: '0.9rem' }}
            />
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={t('tester.admin.emailPlaceholder')}
              style={{ padding: '0.6rem 0.85rem', borderRadius: 8, border: `1px solid ${palette.line}`, fontSize: '0.9rem' }}
            />
          </div>
          <input
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder={t('tester.admin.notesPlaceholder')}
            style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: 8, border: `1px solid ${palette.line}`, fontSize: '0.9rem', marginBottom: 12, boxSizing: 'border-box' }}
          />
          <button
            onClick={createTester}
            disabled={!name.trim() || creating}
            style={{
              padding: '0.6rem 1.25rem',
              borderRadius: 8,
              background: palette.accent,
              color: '#fff',
              border: 'none',
              fontWeight: 600,
              cursor: !name.trim() || creating ? 'default' : 'pointer',
              opacity: !name.trim() || creating ? 0.5 : 1,
            }}
          >
            {creating ? t('tester.admin.creating') : t('tester.admin.createButton')}
          </button>
          {error && <p style={{ color: '#c0392b', fontSize: '0.85rem', marginTop: 8 }}>{error}</p>}
        </div>

        {/* List */}
        <div style={{
          background: palette.surface,
          border: `1px solid ${palette.line}`,
          borderRadius: 14,
          padding: '1.5rem',
          boxShadow: palette.shadow,
        }}>
          <h2 style={{ margin: '0 0 1rem', fontSize: '1.1rem', fontWeight: 600 }}>
            {t('tester.admin.listTitle')} ({testers.length})
          </h2>

          {testers.length === 0 && (
            <p style={{ color: palette.muted }}>{t('tester.admin.listEmpty')}</p>
          )}

          {testers.map(tester => {
            const link = `${origin}/tester/${tester.invite_code}`
            const isRevoked = !!tester.revoked_at
            return (
              <div key={tester.id} style={{ borderTop: `1px solid ${palette.line}`, padding: '1rem 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontWeight: 600 }}>
                      {tester.recipient_name}
                      {isRevoked && <span style={{ color: '#c0392b', fontSize: '0.75rem', marginLeft: 8 }}>REVOKED</span>}
                    </p>
                    {tester.recipient_email && (
                      <p style={{ margin: '2px 0 0', color: palette.muted, fontSize: '0.85rem' }}>{tester.recipient_email}</p>
                    )}
                    {tester.notes && (
                      <p style={{ margin: '2px 0 0', color: palette.dim, fontSize: '0.8rem', fontStyle: 'italic' }}>{tester.notes}</p>
                    )}
                    <p style={{ margin: '6px 0 0', fontSize: '0.75rem', color: palette.dim }}>
                      {t('tester.admin.invitedAt', { when: fmt(tester.invited_at) })}
                    </p>
                    <div style={{
                      marginTop: 8,
                      padding: '8px 12px',
                      background: palette.bg,
                      borderRadius: 8,
                      fontSize: '0.8rem',
                      fontFamily: 'monospace',
                      wordBreak: 'break-all',
                    }}>
                      {link}
                    </div>
                    <button
                      onClick={() => copyLink(tester.invite_code)}
                      style={{
                        marginTop: 6,
                        padding: '4px 10px',
                        fontSize: '0.75rem',
                        background: 'transparent',
                        border: `1px solid ${palette.line}`,
                        borderRadius: 6,
                        cursor: 'pointer',
                      }}
                    >
                      {copied === tester.invite_code ? t('common.copied') : t('tester.admin.copyLink')}
                    </button>
                  </div>
                  <div style={{ minWidth: 180, textAlign: 'right' }}>
                    <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: isRevoked ? '#c0392b' : palette.accentDeep }}>
                      {statusLabel(tester)}
                    </p>
                    {tester.nda_accepted_at && (
                      <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: palette.dim }}>
                        NDA: {fmt(tester.nda_accepted_at)}
                      </p>
                    )}
                    {tester.onboarded_at && (
                      <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: palette.dim }}>
                        Onboarded: {fmt(tester.onboarded_at)}
                      </p>
                    )}
                    {tester.last_active_at && (
                      <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: palette.dim }}>
                        {t('tester.admin.lastActive', { when: fmt(tester.last_active_at) })}
                      </p>
                    )}
                    {!isRevoked && (
                      <button
                        onClick={() => revoke(tester.id)}
                        style={{
                          marginTop: 8,
                          padding: '4px 10px',
                          fontSize: '0.75rem',
                          background: 'transparent',
                          border: '1px solid #c0392b',
                          color: '#c0392b',
                          borderRadius: 6,
                          cursor: 'pointer',
                        }}
                      >
                        Revoke
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
