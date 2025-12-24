'use client'

import { useState, useEffect } from 'react'

interface User {
  id: string
  name: string
  email: string | null
  pattern_type: string | null
  stage: string
  invite_code: string
  created_at: string
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
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

  return (
    <main className="min-h-screen p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Admin: Test Users</h1>
      <p className="text-cream/60 mb-8">Create and manage test users for friends & family testing</p>

      {/* Create new user form */}
      <div className="bg-white/5 rounded-2xl p-6 mb-8 border border-white/10">
        <h2 className="text-xl font-semibold mb-4">Create New Test User</h2>
        
        <form onSubmit={createUser} className="space-y-4">
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
              placeholder="Describe their specific pattern in plain language (e.g., 'Reaches out to ex-partners when feeling overwhelmed at work')"
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
          <div className="mt-4 p-4 bg-cyan/20 rounded-lg border border-cyan/30 animate-fade-in">
            <p className="text-sm text-cream/80 mb-1">✨ User created! Share this invite code:</p>
            <p className="text-2xl font-mono font-bold tracking-widest text-cyan">{createdCode}</p>
            {emailSent && (
              <p className="text-sm text-cream/60 mt-2">📧 Welcome email sent!</p>
            )}
          </div>
        )}
      </div>

      {/* Users list */}
      <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
        <h2 className="text-xl font-semibold mb-4">Existing Test Users</h2>
        
        {loading ? (
          <p className="text-cream/60">Loading...</p>
        ) : users.length === 0 ? (
          <p className="text-cream/60">No users yet. Create your first test user above.</p>
        ) : (
          <div className="space-y-3">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
              >
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-cream/60">
                    {user.email || 'No email'} · {user.pattern_type || 'No pattern'} · Stage: {user.stage}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-mono text-lg text-coral">{user.invite_code}</p>
                    <p className="text-xs text-cream/40">
                      Created {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteUser(user.id, user.name)}
                    disabled={deleting === user.id}
                    className="px-3 py-1 text-sm rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 disabled:opacity-50 transition-all"
                  >
                    {deleting === user.id ? '...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Back link */}
      <div className="mt-6 text-center">
        <a href="/" className="text-cream/60 hover:text-cream transition-colors">
          ← Back to login
        </a>
      </div>
    </main>
  )
}
