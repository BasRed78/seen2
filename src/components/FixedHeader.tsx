'use client'

import Link from 'next/link'
import { Heart, Settings } from 'lucide-react'
import { colors, phaseAccent } from '@/lib/constants/colors'
import { StarIcon } from '@/components/StarIcon'

interface FixedHeaderProps {
  phase: string
  title?: string
  showSettings?: boolean
}

export function FixedHeader({ phase, title, showSettings = true }: FixedHeaderProps) {
  const accent = phaseAccent(phase)
  const isPhase2 = phase === 'phase2'

  return (
    <header
      className="fixed top-0 left-0 right-0 z-30 px-6 py-4"
      style={{
        backgroundColor: colors.dark,
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      <div className="max-w-lg mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isPhase2 ? (
            <Heart size={16} style={{ color: accent }} />
          ) : (
            <StarIcon size={16} style={{ color: accent }} />
          )}
          <span className="font-bold" style={{ color: colors.cream }}>
            {title || 'Seen'}
          </span>
        </div>
        {showSettings && (
          <Link href="/settings">
            <Settings size={20} style={{ color: colors.cream, opacity: 0.5 }} />
          </Link>
        )}
      </div>
    </header>
  )
}
