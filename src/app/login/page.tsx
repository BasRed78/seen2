'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// Star icon component
const StarIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 0L13.5 10.5L24 12L13.5 13.5L12 24L10.5 13.5L0 12L10.5 10.5L12 0Z" />
  </svg>
)

export default function Login() {
  const [inviteCode, setInviteCode] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inviteCode, email: email || undefined }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Invalid invite code')
        setLoading(false)
        return
      }

      // Store user in localStorage (simple auth for MVP)
      localStorage.setItem('seen_user', JSON.stringify(data.user))
      
      // Redirect to chat
      router.push('/chat')
    } catch (err) {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      {/* Background gradient */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 30% 20%, rgba(194, 84, 65, 0.15) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(91, 143, 143, 0.1) 0%, transparent 50%)',
        }}
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center justify-center gap-3 mb-4 hover:opacity-80 transition-opacity">
            <StarIcon size={32} className="text-coral animate-pulse-soft" />
            <h1 className="text-4xl font-black tracking-tight">Seen</h1>
          </Link>
          <p className="text-cream/60">Your daily check-in companion</p>
        </div>

        {/* Login form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="inviteCode" className="block text-sm font-medium mb-2 text-cream/80">
              Enter your invite code
            </label>
            <input
              type="text"
              id="inviteCode"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              placeholder="XXXXXX"
              maxLength={6}
              className="w-full px-4 py-4 rounded-xl bg-white/5 border border-white/10 text-cream text-center text-2xl tracking-[0.3em] font-mono placeholder:text-cream/30 focus:outline-none focus:border-coral/50 focus:ring-2 focus:ring-coral/20 transition-all"
              autoComplete="off"
              autoFocus
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2 text-cream/80">
              Your email <span className="text-cream/40">(for daily reminders)</span>
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-cream placeholder:text-cream/30 focus:outline-none focus:border-coral/50 focus:ring-2 focus:ring-coral/20 transition-all"
              autoComplete="email"
            />
            <p className="text-xs text-cream/40 mt-1">Optional - we'll send a gentle nudge each day</p>
          </div>

          {error && (
            <p className="text-coral text-sm text-center animate-fade-in">{error}</p>
          )}

          <button
            type="submit"
            disabled={inviteCode.length !== 6 || loading}
            className="w-full py-4 rounded-xl font-semibold text-lg transition-all bg-coral text-cream hover:bg-coral-light disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Signing in...
              </span>
            ) : (
              'Start Check-in'
            )}
          </button>
        </form>

        {/* Footer note */}
        <p className="text-center text-sm text-cream/40 mt-8">
          Don't have a code? <Link href="/" className="text-coral hover:underline">Learn more about Seen</Link>
        </p>
      </div>
    </main>
  )
}
