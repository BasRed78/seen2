'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowRight, Check, Shield, Smartphone } from 'lucide-react'
import { t } from '@/lib/i18n'

// Fixed light palette — testers see the same warm, clinical look regardless
// of their (yet-to-exist) personal theme preference. Matches the Chris letter.
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

interface TesterSummary {
  id: string
  user_id: string
  recipient_name: string
  invite_code: string
  nda_accepted_at: string | null
  onboarded_at: string | null
}

interface AppUser {
  id: string
  name: string
  email: string | null
  current_phase: string | null
  is_tester: boolean
  locale: string
}

type Phase = 'loading' | 'invalid' | 'revoked' | 'nda' | 'onboarding' | 'done'

const STEPS = ['welcome', 'what', 'install', 'name'] as const
type Step = typeof STEPS[number]

function detectPlatform(): 'ios' | 'android' | 'desktop' {
  if (typeof navigator === 'undefined') return 'desktop'
  const ua = navigator.userAgent
  if (/iPad|iPhone|iPod/.test(ua)) return 'ios'
  if (/Android/.test(ua)) return 'android'
  return 'desktop'
}

export default function TesterFlow() {
  const router = useRouter()
  const params = useParams()
  const code = params.code as string

  const [phase, setPhase] = useState<Phase>('loading')
  const [tester, setTester] = useState<TesterSummary | null>(null)
  const [user, setUser] = useState<AppUser | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [working, setWorking] = useState(false)

  // Onboarding wizard state
  const [stepIndex, setStepIndex] = useState(0)
  const [preferredName, setPreferredName] = useState('')
  const platform = typeof window !== 'undefined' ? detectPlatform() : 'desktop'

  // Resolve the invite code on mount
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch(`/api/tester/resolve?code=${encodeURIComponent(code)}`)
        if (cancelled) return
        if (res.status === 404) {
          setPhase('invalid')
          return
        }
        if (res.status === 410) {
          setPhase('revoked')
          return
        }
        if (!res.ok) {
          setPhase('invalid')
          return
        }
        const data = await res.json()
        const t_: TesterSummary = data.tester
        setTester(t_)
        setPreferredName(t_.recipient_name)

        // Skip ahead if they've already accepted / onboarded
        if (t_.onboarded_at) {
          // Already done — just log them in and redirect home.
          await acceptAndStash(t_)
          router.push('/home')
          return
        }
        setPhase(t_.nda_accepted_at ? 'onboarding' : 'nda')
      } catch (err) {
        if (!cancelled) {
          console.error('[TESTER] Resolve failed:', err)
          setPhase('invalid')
        }
      }
    })()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code])

  // Helper: accept-and-stash user in localStorage so the rest of the app
  // recognises them as logged in.
  const acceptAndStash = async (t_: TesterSummary): Promise<AppUser | null> => {
    const res = await fetch('/api/tester/accept', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: t_.invite_code }),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(data.error || 'Accept failed')
    }
    const data = await res.json()
    const u: AppUser = data.user
    localStorage.setItem('seen_user', JSON.stringify(u))
    setUser(u)
    return u
  }

  const handleAcceptNda = async () => {
    if (!tester || working) return
    setWorking(true)
    setError(null)
    try {
      await acceptAndStash(tester)
      setPhase('onboarding')
    } catch (err) {
      console.error(err)
      setError(t('tester.nda.error'))
    } finally {
      setWorking(false)
    }
  }

  const finishOnboarding = async () => {
    if (!tester || !user || working) return
    setWorking(true)
    setError(null)
    try {
      const res = await fetch('/api/tester/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testerId: tester.id,
          userId: user.id,
          preferredName: preferredName.trim() || tester.recipient_name,
        }),
      })
      if (!res.ok) throw new Error('Could not save')
      const data = await res.json()
      if (data.user) localStorage.setItem('seen_user', JSON.stringify(data.user))
      router.push('/home')
    } catch (err) {
      console.error(err)
      setError(t('tester.onboarding.errorTitle'))
      setWorking(false)
    }
  }

  // ============ RENDER ============

  if (phase === 'loading') {
    return (
      <Shell>
        <p style={{ color: palette.muted, fontSize: '0.9rem' }}>...</p>
      </Shell>
    )
  }

  if (phase === 'invalid' || phase === 'revoked') {
    return (
      <Shell>
        <h1 style={titleStyle}>
          {phase === 'revoked' ? 'Invite revoked.' : 'Invite not found.'}
        </h1>
        <p style={{ color: palette.muted, fontSize: '1.05rem', lineHeight: 1.6 }}>
          {phase === 'revoked' ? t('tester.login.revoked') : t('tester.login.invalidCode')}
        </p>
      </Shell>
    )
  }

  if (phase === 'nda' && tester) {
    return (
      <Shell>
        <p style={eyebrowStyle}>{t('tester.nda.eyebrow', { name: tester.recipient_name })}</p>
        <h1 style={titleStyle}>{t('tester.nda.title')}</h1>

        <div style={{ color: palette.muted, fontSize: '1.0625rem', lineHeight: 1.65 }}>
          <p style={{ margin: '0 0 1rem' }}>{t('tester.nda.intro')}</p>
          <p style={{ margin: '0 0 1rem', color: palette.text, fontWeight: 500 }}>
            {t('tester.nda.confirmIntro')}
          </p>
          <ul style={{ margin: '0 0 1.5rem', paddingLeft: '1.25rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>{t('tester.nda.point1')}</li>
            <li style={{ marginBottom: '0.5rem' }}>{t('tester.nda.point2')}</li>
            <li style={{ marginBottom: '0.5rem' }}>{t('tester.nda.point3')}</li>
          </ul>
          <p style={{ margin: '0 0 2rem' }}>{t('tester.nda.outro')}</p>
        </div>

        <button
          onClick={handleAcceptNda}
          disabled={working}
          style={ctaStyle(working)}
        >
          {working ? t('tester.nda.submitting') : (
            <>
              {t('tester.nda.button')}
              <ArrowRight size={16} />
            </>
          )}
        </button>

        {error && <p style={errorStyle}>{error}</p>}

        <p style={{ marginTop: '3rem', color: palette.dim, fontSize: '0.8rem' }}>
          {t('tester.nda.privacyNote')}
        </p>
      </Shell>
    )
  }

  if (phase === 'onboarding' && tester) {
    const step: Step = STEPS[stepIndex]
    const isLast = stepIndex === STEPS.length - 1
    const canAdvance = step !== 'name' || preferredName.trim().length > 0

    return (
      <Shell>
        {/* Progress */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 28 }}>
          {STEPS.map((_, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: 3,
                borderRadius: 2,
                backgroundColor: i <= stepIndex ? palette.accent : palette.line,
              }}
            />
          ))}
        </div>

        {step === 'welcome' && (
          <>
            <h1 style={titleStyle}>{t('tester.onboarding.welcome.title')}</h1>
            <p style={bodyStyle}>{t('tester.onboarding.welcome.body')}</p>
          </>
        )}

        {step === 'what' && (
          <>
            <h1 style={titleStyle}>{t('tester.onboarding.what.title')}</h1>
            <p style={bodyStyle}>{t('tester.onboarding.what.body')}</p>
          </>
        )}

        {step === 'install' && (
          <>
            <h1 style={titleStyle}>
              <Smartphone size={26} style={{ verticalAlign: 'middle', marginRight: 12, color: palette.accentDeep }} />
              {t('tester.onboarding.install.title')}
            </h1>
            <p style={bodyStyle}>
              {platform === 'ios' && t('tester.onboarding.install.bodyIos')}
              {platform === 'android' && t('tester.onboarding.install.bodyAndroid')}
              {platform === 'desktop' && t('tester.onboarding.install.bodyDesktop')}
            </p>
          </>
        )}

        {step === 'name' && (
          <>
            <h1 style={titleStyle}>{t('tester.onboarding.name.title')}</h1>
            <input
              type="text"
              value={preferredName}
              onChange={e => setPreferredName(e.target.value)}
              placeholder={t('tester.onboarding.name.placeholder')}
              autoFocus
              style={{
                width: '100%',
                padding: '0.85rem 1rem',
                borderRadius: 10,
                border: `1px solid ${palette.line}`,
                fontSize: '1rem',
                marginTop: '1rem',
                boxSizing: 'border-box',
                outline: 'none',
              }}
            />
          </>
        )}

        <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
          {stepIndex > 0 && (
            <button
              onClick={() => setStepIndex(i => i - 1)}
              style={{
                padding: '0.85rem 1.25rem',
                borderRadius: 999,
                background: 'transparent',
                color: palette.text,
                border: `1px solid ${palette.line}`,
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {t('common.back')}
            </button>
          )}
          <button
            onClick={() => {
              if (isLast) finishOnboarding()
              else if (canAdvance) setStepIndex(i => i + 1)
            }}
            disabled={!canAdvance || working}
            style={{
              ...ctaStyle(!canAdvance || working),
              marginTop: 0,
              flex: 1,
            }}
          >
            {isLast ? (
              working ? t('tester.onboarding.name.saving') : (
                <>
                  {t('tester.onboarding.name.cta')}
                  <Check size={16} />
                </>
              )
            ) : (
              <>
                {step === 'welcome' && t('tester.onboarding.welcome.cta')}
                {step === 'what' && t('tester.onboarding.what.cta')}
                {step === 'install' && t('tester.onboarding.install.cta')}
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>

        {error && <p style={errorStyle}>{error}</p>}
      </Shell>
    )
  }

  return null
}

// ---------- shared styles ----------

const titleStyle: React.CSSProperties = {
  fontFamily: 'Fraunces, Georgia, serif',
  fontWeight: 300,
  fontSize: '2.25rem',
  lineHeight: 1.1,
  letterSpacing: '-0.025em',
  margin: '0 0 1.5rem',
  color: palette.text,
}

const eyebrowStyle: React.CSSProperties = {
  fontSize: '0.72rem',
  fontWeight: 500,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: palette.accentDeep,
  margin: '0 0 1.1rem',
}

const bodyStyle: React.CSSProperties = {
  color: palette.muted,
  fontSize: '1.0625rem',
  lineHeight: 1.65,
  margin: '0 0 1rem',
}

const errorStyle: React.CSSProperties = {
  marginTop: '1rem',
  color: '#c0392b',
  fontSize: '0.9rem',
}

function ctaStyle(disabled: boolean): React.CSSProperties {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.55rem',
    padding: '0.85rem 1.5rem',
    background: palette.accent,
    color: '#fff',
    border: 'none',
    borderRadius: 999,
    fontFamily: 'Inter Tight, system-ui, sans-serif',
    fontSize: '0.95rem',
    fontWeight: 600,
    cursor: disabled ? 'default' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    boxShadow: '0 4px 14px rgba(78,205,196,0.25)',
    marginTop: '1rem',
  }
}

// ---------- shell ----------

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: palette.bg,
        color: palette.text,
        fontFamily: 'Inter Tight, system-ui, sans-serif',
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
          <span
            style={{
              fontFamily: 'Fraunces, Georgia, serif',
              fontSize: '1.05rem',
              letterSpacing: '-0.01em',
            }}
          >
            Seen
          </span>
          <span
            style={{
              fontSize: '0.65rem',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: palette.dim,
              marginLeft: 'auto',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <Shield size={11} /> Tester
          </span>
        </div>

        {children}
      </div>
    </div>
  )
}
