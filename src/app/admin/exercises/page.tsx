'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Pencil, Trash2, ChevronDown, ChevronUp, Save, X } from 'lucide-react'

interface PracticeTheme {
  id: string
  name: string
}

interface ExerciseStep {
  order: number
  text: string
  type?: 'instruction' | 'prompt' | 'pause' | 'reflection'
  duration_minutes?: number
}

interface Exercise {
  id: string
  title: string
  description: string | null
  instructions: {
    intro?: string
    steps: ExerciseStep[]
    closing?: string
  } | null
  theme_id: string | null
  category: string
  exercise_type: string
  duration_minutes: number | null
  pattern_relevance: string[] | null
  methodology: string | null
  is_onboarding: boolean
  display_order: number
  is_active: boolean
}

const categories = [
  { value: 'awareness', label: 'Awareness' },
  { value: 'mindfulness', label: 'Mindfulness' },
  { value: 'defusion', label: 'Defusion' },
  { value: 'values', label: 'Values' },
  { value: 'emotion_regulation', label: 'Emotion Regulation' },
  { value: 'behavioral', label: 'Behavioral' },
  { value: 'reflection', label: 'Reflection' },
  { value: 'self_assessment', label: 'Self-Assessment' },
]

const exerciseTypes = [
  { value: 'reflection', label: 'Reflection' },
  { value: 'journaling', label: 'Journaling' },
  { value: 'behavioral', label: 'Behavioral' },
  { value: 'grounding', label: 'Grounding' },
  { value: 'psychoeducation', label: 'Psychoeducation' },
  { value: 'mapping', label: 'Mapping' },
]

const stepTypes = ['instruction', 'prompt', 'pause', 'reflection'] as const

const patterns = [
  'intimacy_seeking',
  'substance_soothing',
  'compulsive_spending',
  'achievement_hiding',
  'approval_chasing',
  'withdrawal_avoidance',
]

const emptyExercise: Omit<Exercise, 'id'> = {
  title: '',
  description: '',
  instructions: { intro: '', steps: [{ order: 1, text: '', type: 'instruction' }], closing: '' },
  theme_id: null,
  category: 'awareness',
  exercise_type: 'reflection',
  duration_minutes: 10,
  pattern_relevance: [],
  methodology: '',
  is_onboarding: false,
  display_order: 99,
  is_active: true,
}

export default function AdminExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [themes, setThemes] = useState<PracticeTheme[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [editingExercise, setEditingExercise] = useState<(Exercise | Omit<Exercise, 'id'>) | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [exRes, thRes] = await Promise.all([
        fetch('/api/admin/exercises'),
        fetch('/api/practice/themes'),
      ])
      const exData = await exRes.json()
      const thData = await thRes.json()
      setExercises(exData.exercises || [])
      setThemes(thData.themes || [])
    } catch (err) {
      console.error('Failed to load:', err)
    } finally {
      setLoading(false)
    }
  }

  const startNew = () => {
    setEditingExercise({ ...emptyExercise, instructions: { intro: '', steps: [{ order: 1, text: '', type: 'instruction' }], closing: '' } })
    setIsNew(true)
    setExpandedId(null)
  }

  const startEdit = (ex: Exercise) => {
    setEditingExercise(JSON.parse(JSON.stringify(ex)))
    setIsNew(false)
    setExpandedId(null)
  }

  const cancelEdit = () => {
    setEditingExercise(null)
    setIsNew(false)
  }

  const saveExercise = async () => {
    if (!editingExercise || saving) return
    setSaving(true)
    try {
      const method = isNew ? 'POST' : 'PUT'
      const res = await fetch('/api/admin/exercises', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingExercise),
      })
      if (res.ok) {
        setEditingExercise(null)
        setIsNew(false)
        loadData()
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to save')
      }
    } catch (err) {
      console.error('Save failed:', err)
      alert('Failed to save exercise')
    } finally {
      setSaving(false)
    }
  }

  const deleteExercise = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    setDeleting(id)
    try {
      const res = await fetch('/api/admin/exercises', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (res.ok) {
        loadData()
      } else {
        alert('Failed to delete')
      }
    } catch (err) {
      console.error('Delete failed:', err)
    } finally {
      setDeleting(null)
    }
  }

  const toggleActive = async (ex: Exercise) => {
    try {
      await fetch('/api/admin/exercises', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...ex, is_active: !ex.is_active }),
      })
      loadData()
    } catch (err) {
      console.error('Toggle failed:', err)
    }
  }

  // Step management helpers
  const addStep = () => {
    if (!editingExercise?.instructions) return
    const steps = [...editingExercise.instructions.steps]
    steps.push({ order: steps.length + 1, text: '', type: 'instruction' })
    setEditingExercise({
      ...editingExercise,
      instructions: { ...editingExercise.instructions, steps },
    })
  }

  const removeStep = (index: number) => {
    if (!editingExercise?.instructions) return
    const steps = editingExercise.instructions.steps.filter((_, i) => i !== index).map((s, i) => ({ ...s, order: i + 1 }))
    setEditingExercise({
      ...editingExercise,
      instructions: { ...editingExercise.instructions, steps },
    })
  }

  const updateStep = (index: number, field: string, value: string | number | undefined) => {
    if (!editingExercise?.instructions) return
    const steps = [...editingExercise.instructions.steps]
    steps[index] = { ...steps[index], [field]: value }
    setEditingExercise({
      ...editingExercise,
      instructions: { ...editingExercise.instructions, steps },
    })
  }

  const togglePattern = (pattern: string) => {
    if (!editingExercise) return
    const current = editingExercise.pattern_relevance || []
    const updated = current.includes(pattern)
      ? current.filter(p => p !== pattern)
      : [...current, pattern]
    setEditingExercise({ ...editingExercise, pattern_relevance: updated })
  }

  const inputClass = "w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-[#faf8f5] placeholder:text-[#faf8f5]/30 focus:outline-none focus:border-[#ff6b5b]/50 text-sm"
  const labelClass = "block text-xs font-medium mb-1 text-[#faf8f5]/70"

  if (loading) {
    return (
      <main className="min-h-screen p-6 max-w-4xl mx-auto">
        <p className="text-[#faf8f5]/60">Loading exercises...</p>
      </main>
    )
  }

  // ========== EDIT / NEW FORM ==========
  if (editingExercise) {
    return (
      <main className="min-h-screen p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#faf8f5]">
            {isNew ? 'New Exercise' : `Edit: ${(editingExercise as Exercise).title || ''}`}
          </h1>
          <button onClick={cancelEdit} className="p-2 rounded-lg hover:bg-white/10 transition-all">
            <X size={20} className="text-[#faf8f5]/60" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Basic info */}
          <div className="bg-white/5 rounded-2xl p-5 border border-white/10 space-y-4">
            <h2 className="text-sm font-semibold text-[#faf8f5]/80 uppercase tracking-wider">Basic Info</h2>
            <div>
              <label className={labelClass}>Title *</label>
              <input
                className={inputClass}
                value={editingExercise.title}
                onChange={e => setEditingExercise({ ...editingExercise, title: e.target.value })}
                placeholder="Exercise title"
              />
            </div>
            <div>
              <label className={labelClass}>Description</label>
              <textarea
                className={`${inputClass} resize-none`}
                rows={2}
                value={editingExercise.description || ''}
                onChange={e => setEditingExercise({ ...editingExercise, description: e.target.value })}
                placeholder="Short description shown in the exercise list"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Category</label>
                <select
                  className={inputClass}
                  value={editingExercise.category}
                  onChange={e => setEditingExercise({ ...editingExercise, category: e.target.value })}
                >
                  {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Exercise Type</label>
                <select
                  className={inputClass}
                  value={editingExercise.exercise_type}
                  onChange={e => setEditingExercise({ ...editingExercise, exercise_type: e.target.value })}
                >
                  {exerciseTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Theme</label>
                <select
                  className={inputClass}
                  value={editingExercise.theme_id || ''}
                  onChange={e => setEditingExercise({ ...editingExercise, theme_id: e.target.value || null })}
                >
                  <option value="">None</option>
                  {themes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Duration (min)</label>
                <input
                  type="number"
                  className={inputClass}
                  value={editingExercise.duration_minutes || ''}
                  onChange={e => setEditingExercise({ ...editingExercise, duration_minutes: e.target.value ? parseInt(e.target.value) : null })}
                />
              </div>
              <div>
                <label className={labelClass}>Display Order</label>
                <input
                  type="number"
                  className={inputClass}
                  value={editingExercise.display_order}
                  onChange={e => setEditingExercise({ ...editingExercise, display_order: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Methodology (internal)</label>
                <input
                  className={inputClass}
                  value={editingExercise.methodology || ''}
                  onChange={e => setEditingExercise({ ...editingExercise, methodology: e.target.value })}
                  placeholder="e.g. CBT, ACT, DBT"
                />
              </div>
              <div className="flex items-end gap-4">
                <label className="flex items-center gap-2 text-sm text-[#faf8f5]/70 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingExercise.is_onboarding}
                    onChange={e => setEditingExercise({ ...editingExercise, is_onboarding: e.target.checked })}
                    className="rounded"
                  />
                  Onboarding exercise
                </label>
                <label className="flex items-center gap-2 text-sm text-[#faf8f5]/70 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingExercise.is_active}
                    onChange={e => setEditingExercise({ ...editingExercise, is_active: e.target.checked })}
                    className="rounded"
                  />
                  Active
                </label>
              </div>
            </div>

            {/* Pattern relevance */}
            <div>
              <label className={labelClass}>Pattern Relevance</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {patterns.map(p => (
                  <button
                    key={p}
                    onClick={() => togglePattern(p)}
                    className="px-3 py-1 rounded-full text-xs transition-all"
                    style={{
                      backgroundColor: (editingExercise.pattern_relevance || []).includes(p) ? '#5B8F8F30' : 'rgba(255,255,255,0.05)',
                      color: (editingExercise.pattern_relevance || []).includes(p) ? '#5B8F8F' : 'rgba(250,248,245,0.5)',
                      border: `1px solid ${(editingExercise.pattern_relevance || []).includes(p) ? '#5B8F8F50' : 'rgba(255,255,255,0.08)'}`,
                    }}
                  >
                    {p.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-white/5 rounded-2xl p-5 border border-white/10 space-y-4">
            <h2 className="text-sm font-semibold text-[#faf8f5]/80 uppercase tracking-wider">Instructions</h2>

            <div>
              <label className={labelClass}>Intro Text</label>
              <textarea
                className={`${inputClass} resize-none`}
                rows={2}
                value={editingExercise.instructions?.intro || ''}
                onChange={e => setEditingExercise({
                  ...editingExercise,
                  instructions: { ...editingExercise.instructions!, intro: e.target.value },
                })}
                placeholder="Introduction shown before the exercise begins"
              />
            </div>

            {/* Steps */}
            <div>
              <label className={labelClass}>Steps</label>
              <div className="space-y-3 mt-2">
                {(editingExercise.instructions?.steps || []).map((step, i) => (
                  <div key={i} className="bg-white/5 rounded-lg p-3 border border-white/5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-[#faf8f5]/50">Step {i + 1}</span>
                      <div className="flex items-center gap-2">
                        <select
                          className="px-2 py-1 rounded bg-white/5 border border-white/10 text-[#faf8f5] text-xs focus:outline-none"
                          value={step.type || 'instruction'}
                          onChange={e => updateStep(i, 'type', e.target.value)}
                        >
                          {stepTypes.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <input
                          type="number"
                          className="w-16 px-2 py-1 rounded bg-white/5 border border-white/10 text-[#faf8f5] text-xs focus:outline-none"
                          value={step.duration_minutes || ''}
                          onChange={e => updateStep(i, 'duration_minutes', e.target.value ? parseInt(e.target.value) : undefined)}
                          placeholder="min"
                        />
                        {(editingExercise.instructions?.steps || []).length > 1 && (
                          <button onClick={() => removeStep(i)} className="text-red-400/60 hover:text-red-400">
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                    <textarea
                      className={`${inputClass} resize-none`}
                      rows={2}
                      value={step.text}
                      onChange={e => updateStep(i, 'text', e.target.value)}
                      placeholder="Step text..."
                    />
                  </div>
                ))}
              </div>
              <button
                onClick={addStep}
                className="mt-2 flex items-center gap-1 text-xs text-[#5B8F8F] hover:text-[#7ab5b5] transition-all"
              >
                <Plus size={14} /> Add step
              </button>
            </div>

            <div>
              <label className={labelClass}>Closing Text</label>
              <textarea
                className={`${inputClass} resize-none`}
                rows={2}
                value={editingExercise.instructions?.closing || ''}
                onChange={e => setEditingExercise({
                  ...editingExercise,
                  instructions: { ...editingExercise.instructions!, closing: e.target.value },
                })}
                placeholder="Closing message shown after completing all steps"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={saveExercise}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#ff6b5b] text-[#faf8f5] font-medium hover:bg-[#ff8a7a] transition-all"
              style={{ opacity: saving ? 0.7 : 1 }}
            >
              <Save size={16} />
              {saving ? 'Saving...' : isNew ? 'Create Exercise' : 'Save Changes'}
            </button>
            <button
              onClick={cancelEdit}
              className="px-6 py-2.5 rounded-lg bg-white/5 text-[#faf8f5]/60 hover:bg-white/10 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </main>
    )
  }

  // ========== EXERCISE LIST ==========
  return (
    <main className="min-h-screen p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Link href="/admin" className="text-[#faf8f5]/40 hover:text-[#faf8f5]/60 transition-all">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-2xl font-bold text-[#faf8f5]">Admin: Exercises</h1>
          </div>
          <p className="text-[#faf8f5]/50 text-sm ml-8">{exercises.length} exercises</p>
        </div>
        <button
          onClick={startNew}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#ff6b5b] text-[#faf8f5] font-medium text-sm hover:bg-[#ff8a7a] transition-all"
        >
          <Plus size={16} /> New Exercise
        </button>
      </div>

      <div className="space-y-2">
        {exercises.map(ex => {
          const theme = themes.find(t => t.id === ex.theme_id)
          const isExpanded = expandedId === ex.id
          return (
            <div
              key={ex.id}
              className="bg-white/5 rounded-xl border border-white/10 overflow-hidden"
            >
              {/* Row */}
              <div
                className="flex items-center gap-3 p-4 cursor-pointer hover:bg-white/[0.02] transition-all"
                onClick={() => setExpandedId(isExpanded ? null : ex.id)}
              >
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: ex.is_active ? '#4ade80' : '#f87171' }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-[#faf8f5] truncate">{ex.title}</p>
                  <p className="text-xs text-[#faf8f5]/40">
                    {categories.find(c => c.value === ex.category)?.label} · {theme?.name || 'No theme'} · {ex.duration_minutes || '?'} min
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {ex.is_onboarding && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#5B8F8F]/20 text-[#5B8F8F]">Onboarding</span>
                  )}
                  <span className="text-xs text-[#faf8f5]/30">#{ex.display_order}</span>
                  {isExpanded ? <ChevronUp size={16} className="text-[#faf8f5]/40" /> : <ChevronDown size={16} className="text-[#faf8f5]/40" />}
                </div>
              </div>

              {/* Expanded detail */}
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-white/5">
                  <div className="pt-3 space-y-2">
                    {ex.description && (
                      <p className="text-sm text-[#faf8f5]/60">{ex.description}</p>
                    )}
                    <p className="text-xs text-[#faf8f5]/40">
                      Type: {ex.exercise_type} · Methodology: {ex.methodology || 'none'} · Steps: {ex.instructions?.steps?.length || 0}
                    </p>
                    {ex.pattern_relevance && ex.pattern_relevance.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {ex.pattern_relevance.map(p => (
                          <span key={p} className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-[#faf8f5]/40">
                            {p.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); startEdit(ex) }}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 text-[#faf8f5]/70 text-xs hover:bg-white/10 transition-all"
                      >
                        <Pencil size={12} /> Edit
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleActive(ex) }}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 text-[#faf8f5]/70 text-xs hover:bg-white/10 transition-all"
                      >
                        {ex.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteExercise(ex.id, ex.title) }}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400/70 text-xs hover:bg-red-500/20 transition-all"
                      >
                        <Trash2 size={12} /> {deleting === ex.id ? '...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Back link */}
      <div className="mt-6 text-center">
        <Link href="/admin" className="text-[#faf8f5]/40 hover:text-[#faf8f5]/60 transition-colors text-sm">
          ← Back to Admin
        </Link>
      </div>
    </main>
  )
}
