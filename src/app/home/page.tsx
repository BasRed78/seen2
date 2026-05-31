'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { colors } from '@/lib/constants/colors'
import { StarIcon } from '@/components/StarIcon'
import { FixedHeader } from '@/components/FixedHeader'
import { BottomNav } from '@/components/BottomNav'
import { AwarenessHome } from '@/components/home/AwarenessHome'
import { PracticeHome } from '@/components/home/PracticeHome'
import { useTheme, darkTheme } from '@/lib/theme'

interface User {
  id: string
  name: string
  pattern_type: string | null
  pattern_description: string | null
  stage: string
  current_phase?: string
}

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null)
  const [insights, setInsights] = useState<any>(null)
  const [homeSummary, setHomeSummary] = useState<any>(null)
  const [upcomingExercises, setUpcomingExercises] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const phase = user?.current_phase || 'phase1'
  const themed = useTheme()
  const theme = phase === 'phase2' ? themed : darkTheme

  useEffect(() => {
    const storedUser = localStorage.getItem('seen_user')
    if (!storedUser) {
      router.push('/login')
      return
    }

    const parsedUser = JSON.parse(storedUser)
    setUser(parsedUser)

    const currentPhase = parsedUser.current_phase || 'phase1'

    if (currentPhase === 'phase2') {
      fetchHomeSummary(parsedUser.id)
    } else {
      fetchInsights(parsedUser.id)
    }
  }, [router])

  const fetchInsights = async (userId: string) => {
    try {
      const response = await fetch(`/api/user/insights?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        setInsights(data)
      } else {
        setInsights({
          streak: 0,
          totalCheckins: 0,
          weeksActive: 1,
          hasCheckedInToday: false,
        })
      }
    } catch (error) {
      console.error('Failed to fetch insights:', error)
      setInsights({
        streak: 0,
        totalCheckins: 0,
        weeksActive: 1,
        hasCheckedInToday: false,
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchHomeSummary = async (userId: string) => {
    try {
      const [summaryRes, scheduledRes] = await Promise.all([
        fetch(`/api/user/home-summary?userId=${userId}`),
        fetch(`/api/practice/scheduled?userId=${userId}`),
      ])

      if (summaryRes.ok) {
        setHomeSummary(await summaryRes.json())
      }
      if (scheduledRes.ok) {
        const scheduledData = await scheduledRes.json()
        setUpcomingExercises(scheduledData.exercises || [])
      }
    } catch (error) {
      console.error('Failed to fetch home summary:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkDone = async (scheduledId: string) => {
    try {
      await fetch('/api/practice/scheduled', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: scheduledId, status: 'completed' }),
      })
      setUpcomingExercises(prev => prev.filter(e => e.id !== scheduledId))
    } catch (error) {
      console.error('Failed to mark done:', error)
    }
  }

  if (loading || !user) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.bg }}>
        <div className="text-center">
          <StarIcon size={40} className="animate-pulse mx-auto mb-4" style={{ color: phase === 'phase2' ? theme.cyan : colors.coral }} />
          <p style={{ color: theme.text, opacity: 0.6 }}>Loading...</p>
        </div>
      </main>
    )
  }

  const firstName = user.name?.split(' ')[0] || 'there'

  return (
    <main className="min-h-screen pb-24" style={{ backgroundColor: theme.bg }}>
      <FixedHeader phase={phase} />

      {phase === 'phase2' ? (
        <PracticeHome
          userId={user.id}
          userName={firstName}
          summary={homeSummary}
          upcomingExercises={upcomingExercises}
          onMarkDone={handleMarkDone}
          onIntentionUpdated={(updated) => {
            setHomeSummary((prev: any) => {
              if (!prev) return prev
              const next = { ...prev }
              // If still active, update in place. Otherwise remove from active list.
              if (updated.status === 'active') {
                next.activeIntentions = (prev.activeIntentions || []).map((i: any) =>
                  i.id === updated.id
                    ? { ...i, intention_text: updated.intention_text, target_date: updated.target_date }
                    : i
                )
              } else {
                next.activeIntentions = (prev.activeIntentions || []).filter((i: any) => i.id !== updated.id)
              }
              return next
            })
          }}
        />
      ) : (
        <AwarenessHome userName={firstName} insights={insights} />
      )}

      <BottomNav currentPage="home" phase={phase} />
    </main>
  )
}
