import { NextRequest, NextResponse } from 'next/server'
import { findToken, logEvent, getClientIp } from '@/lib/letterAuth'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()
    if (!token || typeof token !== 'string') {
      return NextResponse.json({ error: 'Missing token' }, { status: 400 })
    }

    const tokenRow = await findToken(token)
    if (!tokenRow) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 404 })
    }

    await logEvent(
      tokenRow.id,
      'nda_accepted',
      getClientIp(request),
      request.headers.get('user-agent')
    )

    const response = NextResponse.json({ success: true, redirect: `/letter/${tokenRow.letter_id}` })
    response.cookies.set('letter_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    })
    return response
  } catch (err) {
    console.error('[LETTER-ACCEPT] Error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
