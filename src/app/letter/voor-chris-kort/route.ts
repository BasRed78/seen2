import { NextRequest, NextResponse } from 'next/server'
import { findToken, hasAcceptedNda } from '@/lib/letterAuth'
import { readFileSync } from 'fs'
import { join } from 'path'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  // Cookie set after NDA acceptance: "letter_token=<token>"
  const token = request.cookies.get('letter_token')?.value
  if (!token) {
    return NextResponse.redirect(new URL('/voor-chris/expired', request.url))
  }

  const tokenRow = await findToken(token)
  // Accept tokens issued for either the long letter or the short version
  if (!tokenRow || !tokenRow.letter_id.startsWith('voor-chris')) {
    return NextResponse.redirect(new URL('/voor-chris/expired', request.url))
  }

  const accepted = await hasAcceptedNda(tokenRow.id)
  if (!accepted) {
    return NextResponse.redirect(new URL(`/voor-chris/${token}`, request.url))
  }

  let html: string
  try {
    html = readFileSync(join(process.cwd(), 'data', 'voor-chris-kort.html'), 'utf8')
  } catch (err) {
    console.error('[LETTER] Failed to read short letter file:', err)
    return new NextResponse('Letter unavailable', { status: 500 })
  }

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  })
}
