import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { inviteCode, email } = await request.json()

    if (!inviteCode) {
      return NextResponse.json(
        { error: 'Invite code is required' },
        { status: 400 }
      )
    }

    const supabase = createServerClient()

    // Look up user by invite code
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('invite_code', inviteCode.toUpperCase())
      .single()

    if (error || !user) {
      return NextResponse.json(
        { error: 'Invalid invite code' },
        { status: 401 }
      )
    }

    // If email provided and user doesn't have one, save it
    if (email && !user.email) {
      const { data: updatedUser, error: updateError } = await supabase
        .from('users')
        .update({ email })
        .eq('id', user.id)
        .select()
        .single()

      if (!updateError && updatedUser) {
        return NextResponse.json({ user: updatedUser })
      }
    }

    // Return user data (in production, you'd set a session cookie)
    return NextResponse.json({ user })
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
}
