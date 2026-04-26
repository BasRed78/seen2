import { notFound, redirect } from 'next/navigation'
import { headers, cookies } from 'next/headers'
import { findToken, hasAcceptedNda, logEvent } from '@/lib/letterAuth'
import { NdaGate } from './NdaGate'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ token: string }>
}

export default async function LetterTokenPage({ params }: PageProps) {
  const { token } = await params
  const tokenRow = await findToken(token)

  if (!tokenRow) {
    notFound()
  }

  // Log this visit
  const h = await headers()
  const ip = h.get('x-forwarded-for')?.split(',')[0].trim() || h.get('x-real-ip') || null
  const ua = h.get('user-agent') || null
  await logEvent(tokenRow.id, 'visit', ip, ua)

  // If they've already accepted the NDA AND have a valid cookie matching this token,
  // skip the gate and send them straight to the letter.
  const cookieStore = await cookies()
  const cookieToken = cookieStore.get('letter_token')?.value
  if (cookieToken === token) {
    const accepted = await hasAcceptedNda(tokenRow.id)
    if (accepted) {
      redirect(`/letter/${tokenRow.letter_id}`)
    }
  }

  return <NdaGate token={token} recipientName={tokenRow.recipient_name} />
}
