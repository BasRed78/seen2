'use client'

import { useState, useEffect } from 'react'
import { Users, BookOpen, ChevronRight, Plus, Trash2, UserPlus } from 'lucide-react'

interface User {
  id: string
  name: string
  email: string | null
  pattern_type: string | null
  stage: string
  invite_code: string
  created_at: string
}

type ActiveSection = null | 'create-user' | 'manage-users'

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState<ActiveSection>(null)
  const [creating, setCreating] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    patternType: '',
    patternDescription: '',
  })
  const [sendWelcome, setSendWelcome] = useState(true)
  const [createdCode, setCreatedCode] = useState<string | null>(null)
  const [emailSent, setEmailSent] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      const data = await response.json()
      setUsers(data.users || [])
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Delete ${userName} and all their check-in data? This cannot be undone.`)) {
      return
    }
    setDeleting(userId)
    try {
      const response = await fetch('/api/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      })
      if (response.ok) {
        fetchUsers()
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to delete user')
      }
    } catch (error) {
      console.error('Failed to delete user:', error)
      alert('Failed to delete user')
    } finally {
      setDeleting(null)
    }
  }

  const createUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newUser.name) return
    setCreating(true)
    setCreatedCode(null)
    setEmailSent(false)
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newUser, sendWelcome: sendWelcome && !!newUser.email }),
      })
      const data = await response.json()
      if (response.ok) {
        setCreatedCode(data.inviteCode)
        setEmailSent(data.emailSent || false)
        setNewUser({ name: '', email: '', patternType: '', patternDescription: '' })
        fetchUsers()
      } else {
        alert(data.error || 'Failed to create user')
      }
    } catch (error) {
      console.error('Failed to create user:', error)
      alert('Failed to create user')
    } finally {
      setCreating(false)
    }
  }

  const patternTypes = [
    { value: 'stress_connector', label: 'Stress Connector - Seeks connection when overwhelmed' },
    { value: 'stress_escaper', label: 'Stress Escaper - Uses substances/activities to escape' },
    { value: 'stress_avoider', label: 'Stress Avoider - Withdraws and isolates' },
    { value: 'stress_controller', label: 'Stress Controller - Becomes controlling/rigid' },
    { value: 'stress_pleaser', label: 'Stress Pleaser - Over-accommodates others' },
  ]

  const toggleSection = (section: ActiveSection) => {
    setActiveSection(prev => prev === section ? null : section)
  }

  return (
    <main className="min-h-screen p-6 max-w-4xl mx-auto" style={{ backgroundColor: '#0f0f1a' }}>
      <h1 className="text-3xl font-bold mb-1">Admin</h1>
      <p className="text-cream/50 mb-8 text-sm">Manage users, content, and settings</p>

      <div className="space-y-3">
        {/* ===== Create Test User ===== */}
        <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
          <button
            onClick={() => toggleSection('create-user')}
            className="w-full flex items-center gap-4 p-5 hover:bg-white/[0.02] transition-all text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-[#ff6b5b]/15 flex items-center justify-center flex-shrink-0">
              <UserPlus size={20} className="text-[#ff6b5b]" />
            </div>
            <div className="flex-1">
              <p className="font-semibold">Create Test User</p>
              <p className="text-sm text-cream/50">Generate invite codes for new testers</p>
            </div>
            <ChevronRight
              size={18}
              className="text-cream/30 transition-transform"
              style={{ transform: activeSection === 'create-user' ? 'rotate(90deg)' : 'none' }}
            />
          </button>

          {activeSection === 'create-user' && (
            <div className="px-5 pb-5 border-t border-white/5">
              <form onSubmit={createUser} className="space-y-4 pt-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-cream/80">Name *</label>
                    <input
                      type="text"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      placeholder="Enter name"
                      className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-cream placeholder:text-cream/30 focus:outline-none focus:border-coral/50"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-cream/80">Email (optional)</label>
                    <input
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      placeholder="Enter email"
                      className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-cream placeholder:text-cream/30 focus:outline-none focus:border-coral/50"
                    />
                    {newUser.email && (
                      <label className="flex items-center gap-2 mt-2 text-sm text-cream/60 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={sendWelcome}
                          onChange={(e) => setSendWelcome(e.target.checked)}
                          className="rounded border-white/20 bg-white/5 text-coral focus:ring-coral/50"
                        />
                        Send welcome email with invite code
                      </label>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-cream/80">Pattern Type</label>
                  <select
                    value={newUser.patternType}
                    onChange={(e) => setNewUser({ ...newUser, patternType: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-cream focus:outline-none focus:border-coral/50"
                  >
                    <option value="">Select a pattern (optional)</option>
                    {patternTypes.map((type) => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-cream/80">Pattern Description</label>
                  <textarea
                    value={newUser.patternDescription}
                    onChange={(e) => setNewUser({ ...newUser, patternDescription: e.target.value })}
                    placeholder="Describe their specific pattern in plain language"
                    rows={2}
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-cream placeholder:text-cream/30 focus:outline-none focus:border-coral/50 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!newUser.name || creating}
                  className="px-6 py-2 rounded-lg bg-coral text-cream font-medium hover:bg-coral-light disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {creating ? 'Creating...' : 'Create User & Generate Invite Code'}
                </button>
              </form>

              {createdCode && (
                <div className="mt-4 p-4 bg-cyan/20 rounded-lg border border-cyan/30">
                  <p className="text-sm text-cream/80 mb-1">User created! Share this invite code:</p>
                  <p className="text-2xl font-mono font-bold tracking-widest text-cyan">{createdCode}</p>
                  {emailSent && (
                    <p className="text-sm text-cream/60 mt-2">Welcome email sent!</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ===== Manage Test Users ===== */}
        <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
          <button
            onClick={() => toggleSection('manage-users')}
            className="w-full flex items-center gap-4 p-5 hover:bg-white/[0.02] transition-all text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-[#4ECDC4]/15 flex items-center justify-center flex-shrink-0">
              <Users size={20} className="text-[#4ECDC4]" />
            </div>
            <div className="flex-1">
              <p className="font-semibold">Test Users</p>
              <p className="text-sm text-cream/50">
                {loading ? 'Loading...' : `${users.length} user${users.length !== 1 ? 's' : ''}`}
              </p>
            </div>
            <ChevronRight
              size={18}
              className="text-cream/30 transition-transform"
              style={{ transform: activeSection === 'manage-users' ? 'rotate(90deg)' : 'none' }}
            />
          </button>

          {activeSection === 'manage-users' && (
            <div className="px-5 pb-5 border-t border-white/5">
              {loading ? (
                <p className="text-cream/60 pt-4">Loading...</p>
              ) : users.length === 0 ? (
                <p className="text-cream/60 pt-4">No users yet.</p>
              ) : (
                <div className="space-y-2 pt-4">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm truncate">{user.name}</p>
                        <p className="text-xs text-cream/50 truncate">
                          {user.email || 'No email'} · {user.pattern_type || 'No pattern'} · {user.stage}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                        <div className="text-right">
                          <p className="font-mono text-sm text-coral">{user.invite_code}</p>
                          <p className="text-xs text-cream/30">
                            {new Date(user.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={() => deleteUser(user.id, user.name)}
                          disabled={deleting === user.id}
                          className="p-1.5 rounded-lg bg-red-500/10 text-red-400/60 hover:bg-red-500/20 hover:text-red-400 disabled:opacity-50 transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ===== Exercises (links to sub-page) ===== */}
        <a
          href="/admin/exercises"
          className="block bg-white/5 rounded-2xl border border-white/10 overflow-hidden"
        >
          <div className="flex items-center gap-4 p-5 hover:bg-white/[0.02] transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#ff6b5b]/15 flex items-center justify-center flex-shrink-0">
              <BookOpen size={20} className="text-[#ff6b5b]" />
            </div>
            <div className="flex-1">
              <p className="font-semibold">Exercises</p>
              <p className="text-sm text-cream/50">Create, edit, and manage practice exercises</p>
            </div>
            <ChevronRight size={18} className="text-cream/30" />
          </div>
        </a>
      </div>

      {/* Back link */}
      <div className="mt-8 text-center">
        <a href="/" className="text-cream/40 hover:text-cream/60 transition-colors text-sm">
          ← Back to landing page
        </a>
      </div>
    </main>
  )
}
