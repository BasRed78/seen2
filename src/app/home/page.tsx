'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { colors } from '@/lib/constants/colors'
import { StarIcon } from '@/components/StarIcon'
import { FixedHeader } from '@/components/FixedHeader'
import { BottomNav } from '@/components/BottomNav'
import { AwarenessHome } from '@/components/home/AwarenessHome'
import { PracticeHome } from '@/components/home/PracticeHome'

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
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const phase = user?.current_phase || 'phase1'

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
      const response = await fetch(`/api/user/home-summary?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        setHomeSummary(data)
      }
    } catch (error) {
      console.error('Failed to fetch home summary:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !user) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.dark }}>
        <div className="text-center">
          <StarIcon size={40} className="animate-pulse mx-auto mb-4" style={{ color: phase === 'phase2' ? colors.cyan : colors.coral }} />
          <p style={{ color: colors.cream, opacity: 0.6 }}>Loading...</p>
        </div>
      </main>
    )
  }

  const firstName = user.name?.split(' ')[0] || 'there'

  return (
    <main className="min-h-screen pb-24" style={{ backgroundColor: colors.dark }}>
      <FixedHeader phase={phase} />

      {phase === 'phase2' ? (
        <PracticeHome userName={firstName} summary={homeSummary} />
      ) : (
        <AwarenessHome userName={firstName} insights={insights} />
      )}

      <BottomNav currentPage="home" phase={phase} />
    </main>
  )
}
