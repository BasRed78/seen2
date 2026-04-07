export const colors = {
  coral: '#ff6b5b',
  coralLight: '#ff8a7a',
  coralDark: '#e85a4f',
  dark: '#0f0f1a',
  darkCard: '#1a1a2e',
  darkCardHover: '#252542',
  cream: '#faf8f5',
  creamMuted: 'rgba(250, 248, 245, 0.6)',
  cyan: '#4ECDC4',
  cyanLight: '#7EDED6',
  gold: '#FFD93D',
}

export function phaseAccent(phase: string): string {
  return phase === 'phase2' ? colors.cyan : colors.coral
}
