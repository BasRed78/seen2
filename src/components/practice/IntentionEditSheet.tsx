'use client'

import { useEffect, useState } from 'react'
import { X, Check, Calendar as CalendarIcon } from 'lucide-react'
import { useTheme } from '@/lib/theme'

export interface EditableIntention {
  id: string
  intention_text: string
  target_date: string | null
  status: string
}

interface Props {
  open: boolean
  intention: EditableIntention | null
  userId: string
  onClose: () => void
  onSaved: (updated: EditableIntention) => void
  onDeleted?: (id: string) => void
}

/**
 * Bottom-sheet style modal for editing a practice intention.
 * Lets the user change the text, the target date, or the status
 * (active / completed / skipped) all in one place.
 */
export function IntentionEditSheet({
  open,
  intention,
  userId,
  onClose,
  onSaved,
}: Props) {
  const theme = useTheme()
  const [text, setText] = useState('')
  const [targetDate, setTargetDate] = useState('')
  const [status, setStatus] = useState<'active' | 'completed' | 'skipped'>('active')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Reset form whenever a different intention is opened
  useEffect(() => {
    if (intention) {
      setText(intention.intention_text)
      setTargetDate(intention.target_date || '')
      setStatus((intention.status as any) || 'active')
      setError(null)
    }
  }, [intention])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open || !intention) return null

  const dirty =
    text.trim() !== intention.intention_text ||
    (targetDate || '') !== (intention.target_date || '') ||
    status !== intention.status

  const handleSave = async () => {
    if (!text.trim()) {
      setError('Geef de intentie een tekst.')
      return
    }
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`/api/practice/intentions/${intention.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          intention_text: text.trim(),
          target_date: targetDate || null,
          status,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Could not save')
      }
      const data = await res.json()
      onSaved(data.intention)
      onClose()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSaving(false)
    }
  }

  const statusOptions: { value: typeof status; label: string }[] = [
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
    { value: 'skipped', label: 'Skipped' },
  ]

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Edit intention"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        backgroundColor: 'rgba(0,0,0,0.45)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 520,
          backgroundColor: theme.card,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          padding: '20px 22px 28px',
          boxShadow: '0 -10px 40px rgba(0,0,0,0.2)',
          maxHeight: '85vh',
          overflowY: 'auto',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}>
          <p style={{
            margin: 0,
            color: theme.text,
            fontSize: '1.05rem',
            fontWeight: 700,
          }}>
            Edit intention
          </p>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: 'transparent',
              border: 'none',
              padding: 6,
              cursor: 'pointer',
              color: theme.textMuted,
              display: 'flex',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Text */}
        <label style={{ display: 'block', marginBottom: 16 }}>
          <span style={{
            display: 'block',
            color: theme.textMuted,
            fontSize: '0.75rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: 6,
          }}>
            Intention
          </span>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            placeholder="What do you want to practice this week?"
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: 12,
              border: `1px solid ${theme.border}`,
              backgroundColor: theme.bg,
              color: theme.text,
              fontSize: '0.95rem',
              lineHeight: 1.5,
              fontFamily: 'inherit',
              resize: 'vertical',
              outline: 'none',
              minHeight: 80,
              boxSizing: 'border-box',
            }}
          />
        </label>

        {/* Target date */}
        <label style={{ display: 'block', marginBottom: 18 }}>
          <span style={{
            display: 'block',
            color: theme.textMuted,
            fontSize: '0.75rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: 6,
          }}>
            Target date
          </span>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <CalendarIcon
                size={14}
                style={{
                  position: 'absolute',
                  left: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: theme.textMuted,
                  pointerEvents: 'none',
                }}
              />
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 34px',
                  borderRadius: 10,
                  border: `1px solid ${theme.border}`,
                  backgroundColor: theme.bg,
                  color: theme.text,
                  fontSize: '0.9rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  colorScheme: theme.isDark ? 'dark' : 'light',
                }}
              />
            </div>
            {targetDate && (
              <button
                onClick={() => setTargetDate('')}
                style={{
                  padding: '8px 12px',
                  borderRadius: 8,
                  background: 'transparent',
                  border: `1px solid ${theme.border}`,
                  color: theme.textMuted,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                }}
              >
                Clear
              </button>
            )}
          </div>
        </label>

        {/* Status */}
        <div style={{ marginBottom: 22 }}>
          <span style={{
            display: 'block',
            color: theme.textMuted,
            fontSize: '0.75rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: 8,
          }}>
            Status
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            {statusOptions.map((opt) => {
              const active = status === opt.value
              return (
                <button
                  key={opt.value}
                  onClick={() => setStatus(opt.value)}
                  style={{
                    flex: 1,
                    padding: '9px 10px',
                    borderRadius: 10,
                    backgroundColor: active ? `${theme.cyan}20` : theme.bg,
                    color: active ? theme.cyanDeep : theme.text,
                    border: `1px solid ${active ? theme.cyan : theme.border}`,
                    fontSize: '0.85rem',
                    fontWeight: active ? 600 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {opt.label}
                </button>
              )
            })}
          </div>
        </div>

        {error && (
          <p style={{
            color: '#c0392b',
            fontSize: '0.85rem',
            margin: '0 0 14px',
          }}>
            {error}
          </p>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: 12,
              backgroundColor: 'transparent',
              color: theme.text,
              border: `1px solid ${theme.border}`,
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!dirty || saving || !text.trim()}
            style={{
              flex: 2,
              padding: '12px 16px',
              borderRadius: 12,
              backgroundColor: theme.cyan,
              color: '#fff',
              border: 'none',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: !dirty || saving || !text.trim() ? 'default' : 'pointer',
              opacity: !dirty || saving || !text.trim() ? 0.55 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              boxShadow: theme.shadow,
              transition: 'opacity 0.15s ease',
            }}
          >
            {saving ? 'Saving...' : (
              <>
                <Check size={16} />
                Save changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
