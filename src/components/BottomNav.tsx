'use client'

import Link from 'next/link'
import { Home, MessageCircle, Heart, BarChart3 } from 'lucide-react'
import { phaseAccent } from '@/lib/constants/colors'
import { StarIcon } from '@/components/StarIcon'
import { useTheme, darkTheme } from '@/lib/theme'

interface BottomNavProps {
  currentPage: 'home' | 'checkin' | 'practice' | 'insights'
  phase: string
}

export function BottomNav({ currentPage, phase }: BottomNavProps) {
  const accent = phaseAccent(phase)
  const isPhase2 = phase === 'phase2'
  const themed = useTheme()
  const theme = isPhase2 ? themed : darkTheme

  const items = [
    { id: 'home' as const, href: '/home', icon: Home, label: 'Home' },
    { id: 'checkin' as const, href: '/chat', icon: MessageCircle, label: 'Check-in' },
    ...(isPhase2
      ? [{ id: 'practice' as const, href: '/practice', icon: Heart, label: 'Practice' }]
      : []),
    { id: 'insights' as const, href: '/insights', icon: BarChart3, label: 'Insights' },
  ]

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 px-6 py-3 z-20"
      style={{
        backgroundColor: theme.card,
        borderTop: `1px solid ${theme.border}`,
      }}
    >
      <div className="max-w-lg mx-auto flex justify-around">
        {items.map((item) => {
          const isActive = currentPage === item.id
          const itemColor = isActive ? accent : theme.textMuted
          const Icon = item.icon
          return (
            <Link
              key={item.id}
              href={item.href}
              className="flex flex-col items-center gap-1 py-2 px-4"
            >
              {item.id === 'home' && !isPhase2 ? (
                <StarIcon size={22} style={{ color: itemColor }} />
              ) : (
                <Icon size={22} style={{ color: itemColor }} />
              )}
              <span className="text-xs" style={{ color: itemColor }}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
