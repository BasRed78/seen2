import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Seen - Daily Check-ins',
  description: 'See your patterns. Change your life.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-dark text-cream">
        {children}
      </body>
    </html>
  )
}
