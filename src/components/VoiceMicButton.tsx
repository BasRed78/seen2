'use client'

import { Mic } from 'lucide-react'
import { colors } from '@/lib/constants/colors'

interface VoiceMicButtonProps {
  listening: boolean
  onToggle: () => void
  accent?: string
  size?: number
}

export function VoiceMicButton({
  listening,
  onToggle,
  accent = colors.cyan,
  size = 18,
}: VoiceMicButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="p-2 rounded-full transition-all"
      style={{
        backgroundColor: listening ? `${accent}30` : 'rgba(255,255,255,0.05)',
        color: listening ? accent : colors.creamMuted,
        animation: listening ? 'pulse 1.5s ease-in-out infinite' : 'none',
      }}
      title={listening ? 'Stop listening' : 'Voice input'}
    >
      <Mic size={size} />
    </button>
  )
}
