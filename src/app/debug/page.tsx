'use client'

import { useState, useEffect } from 'react'

interface Message {
  id: string
  checkin_id: string
  role: string
  content: string
  created_at: string
}

interface Checkin {
  id: string
  user_id: string
  date: string
  stress_level: number | null
  mood: string[] | null
  completed: boolean
  insights: string | null
  created_at: string
  messages?: Message[]
}

interface User {
  id: string
  name: string
  pattern_type: string | null
  pattern_description: string | null
  stage: string
  invite_code: string
  created_at: string
}

export default function DebugPage() {
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [checkins, setCheckins] = useState<Checkin[]>([])
  const [loading, setLoading] = useState(true)
  const [systemPrompt, setSystemPrompt] = useState<string>('')

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    if (selectedUser) {
      fetchCheckins(selectedUser)
    }
  }, [selectedUser])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      const data = await response.json()
      setUsers(data.users || [])
      if (data.users?.length > 0) {
        setSelectedUser(data.users[0].id)
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCheckins = async (userId: string) => {
    try {
      const response = await fetch(`/api/debug/checkins?userId=${userId}`)
      const data = await response.json()
      setCheckins(data.checkins || [])
      setSystemPrompt(data.systemPrompt || '')
    } catch (error) {
      console.error('Failed to fetch checkins:', error)
    }
  }

  const selectedUserData = users.find(u => u.id === selectedUser)

  return (
    <main className="min-h-screen p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Debug: Conversation Viewer</h1>
      <p className="text-cream/60 mb-8">View all check-ins and the system prompt being sent to Claude</p>

      {/* User selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Select User:</label>
        <select
          value={selectedUser || ''}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-cream"
        >
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name} ({user.invite_code})
            </option>
          ))}
        </select>
      </div>

      {selectedUserData && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left column: User info & System Prompt */}
          <div className="space-y-6">
            {/* User Info */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h2 className="font-bold mb-3 text-coral">User Info</h2>
              <div className="text-sm space-y-1">
                <p><span className="text-cream/60">Name:</span> {selectedUserData.name}</p>
                <p><span className="text-cream/60">Stage:</span> {selectedUserData.stage}</p>
                <p><span className="text-cream/60">Pattern Type:</span> {selectedUserData.pattern_type || 'Not set'}</p>
                <p><span className="text-cream/60">Pattern Description:</span></p>
                <p className="bg-white/5 p-2 rounded text-xs">{selectedUserData.pattern_description || 'Not set'}</p>
              </div>
            </div>

            {/* System Prompt */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h2 className="font-bold mb-3 text-coral">Current System Prompt</h2>
              <p className="text-xs text-cream/60 mb-2">This is what Claude sees at the start of each message:</p>
              <pre className="bg-black/30 p-3 rounded text-xs overflow-auto max-h-96 whitespace-pre-wrap">
                {systemPrompt || 'Select a user to see the system prompt'}
              </pre>
            </div>
          </div>

          {/* Right column: Conversations */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <h2 className="font-bold mb-3 text-coral">Check-in History ({checkins.length})</h2>
            
            {checkins.length === 0 ? (
              <p className="text-cream/60 text-sm">No check-ins yet</p>
            ) : (
              <div className="space-y-6 max-h-[600px] overflow-auto">
                {checkins.map((checkin, idx) => (
                  <div key={checkin.id} className="border-b border-white/10 pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">
                        Check-in #{checkins.length - idx} - {checkin.date}
                      </h3>
                      <div className="flex items-center gap-2">
                        {checkin.completed ? (
                          <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded">Completed</span>
                        ) : (
                          <span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded">In Progress</span>
                        )}
                        {checkin.stress_level && (
                          <span className="text-xs px-2 py-1 bg-white/10 rounded">Stress: {checkin.stress_level}/10</span>
                        )}
                      </div>
                    </div>

                    {/* Insights */}
                    {checkin.insights ? (
                      <div className="mb-2 p-2 bg-cyan/10 rounded text-xs">
                        <span className="text-cyan font-medium">Insight:</span> {checkin.insights}
                      </div>
                    ) : (
                      <div className="mb-2 p-2 bg-yellow-500/10 rounded text-xs text-yellow-400">
                        ⚠️ No insights saved for this check-in
                      </div>
                    )}

                    {/* Messages */}
                    <div className="space-y-2">
                      {checkin.messages?.map((msg, msgIdx) => (
                        <div
                          key={msg.id}
                          className={`text-xs p-2 rounded ${
                            msg.role === 'assistant'
                              ? 'bg-white/5 border-l-2 border-cyan'
                              : 'bg-coral/10 border-l-2 border-coral'
                          }`}
                        >
                          <span className="font-medium text-cream/60">
                            {msg.role === 'assistant' ? 'AI' : 'User'}:
                          </span>{' '}
                          {msg.content}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Back link */}
      <div className="mt-6 text-center">
        <a href="/admin" className="text-cream/60 hover:text-cream transition-colors mr-4">
          ← Admin
        </a>
        <a href="/" className="text-cream/60 hover:text-cream transition-colors">
          ← Login
        </a>
      </div>
    </main>
  )
}
