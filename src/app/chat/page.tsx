'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

// Star icon component
const StarIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 0L13.5 10.5L24 12L13.5 13.5L12 24L10.5 13.5L0 12L10.5 10.5L12 0Z" />
  </svg>
)

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface User {
  id: string
  name: string
  pattern_type: string | null
  pattern_description: string | null
  stage: string
}

export default function ChatPage() {
  const [user, setUser] = useState<User | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [checkinId, setCheckinId] = useState<string | null>(null)
  const [isComplete, setIsComplete] = useState(false)
  const [initializing, setInitializing] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const hasStartedRef = useRef(false) // Prevent double-start in StrictMode
  const router = useRouter()

  // Load user from localStorage
  useEffect(() => {
    // Prevent double execution in React StrictMode
    if (hasStartedRef.current) return
    hasStartedRef.current = true

    const storedUser = localStorage.getItem('seen_user')
    if (!storedUser) {
      router.push('/login')
      return
    }
    
    const parsedUser = JSON.parse(storedUser)
    setUser(parsedUser)
    
    // Start the conversation with an opening message
    startConversation(parsedUser)
  }, [router])

  const startConversation = async (currentUser: User) => {
    setLoading(true)
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          message: '[START_CHECKIN]', // Special trigger to start
        }),
      })

      const data = await response.json()
      
      if (response.ok) {
        setMessages([{ role: 'assistant', content: data.message }])
        setCheckinId(data.checkinId)
      }
    } catch (error) {
      console.error('Failed to start conversation:', error)
    } finally {
      setLoading(false)
      setInitializing(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading || !user || isComplete) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          message: userMessage,
          checkinId,
        }),
      })

      const data = await response.json()
      
      if (response.ok) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.message }])
        setCheckinId(data.checkinId)
        if (data.isComplete) {
          setIsComplete(true)
        }
      }
    } catch (error) {
      console.error('Failed to send message:', error)
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm having trouble connecting right now. Please try again." 
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('seen_user')
    router.push('/')
  }

  if (initializing) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <StarIcon size={40} className="text-coral animate-pulse mx-auto mb-4" />
          <p className="text-cream/60">Starting your check-in...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col max-w-2xl mx-auto">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <StarIcon size={24} className="text-coral" />
          <div>
            <h1 className="font-bold">Daily Check-in</h1>
            <p className="text-xs text-cream/50">Hi, {user?.name}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-cream/50 hover:text-cream transition-colors"
        >
          Sign out
        </button>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex gap-3 animate-fade-in ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-cyan flex items-center justify-center flex-shrink-0">
                <StarIcon size={14} className="text-cream" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-coral text-cream rounded-tr-sm'
                  : 'bg-white/5 text-cream rounded-tl-sm'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex gap-3 animate-fade-in">
            <div className="w-8 h-8 rounded-full bg-cyan flex items-center justify-center flex-shrink-0">
              <StarIcon size={14} className="text-cream" />
            </div>
            <div className="bg-white/5 rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-cream/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-cream/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-cream/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10">
        {isComplete ? (
          <div className="text-center py-4">
            <p className="text-cream/60 mb-4">Check-in complete. See you tomorrow! ✨</p>
            <button
              onClick={() => router.push('/home')}
              className="px-6 py-2 rounded-lg bg-white/5 text-cream/80 hover:bg-white/10 transition-colors"
            >
              Back to Home
            </button>
          </div>
        ) : (
          <form onSubmit={sendMessage} className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your response..."
              className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-cream placeholder:text-cream/30 focus:outline-none focus:border-coral/50 transition-colors"
              disabled={loading}
              autoFocus
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="px-6 py-3 rounded-xl bg-coral text-cream font-medium hover:bg-coral-light disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Send
            </button>
          </form>
        )}
      </div>
    </main>
  )
}
