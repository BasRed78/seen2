import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { userId, action } = await request.json()

    if (!userId || !action) {
      return NextResponse.json(
        { error: 'userId and action are required' },
        { status: 400 }
      )
    }

    if (action !== 'activate' && action !== 'deactivate') {
      return NextResponse.json(
        { error: 'action must be "activate" or "deactivate"' },
        { status: 400 }
      )
    }

    const supabase = createServerClient()

    // Verify user exists
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, phase2_activated_at')
      .eq('id', userId)
      .single()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    if (action === 'activate') {
      // Update user record
      const updateFields: Record<string, unknown> = {
        current_phase: 'phase2',
        in_therapy: true,
      }
      // Preserve original activation timestamp
      if (!user.phase2_activated_at) {
        updateFields.phase2_activated_at = new Date().toISOString()
      }

      const { error: updateError } = await supabase
        .from('users')
        .update(updateFields)
        .eq('id', userId)

      if (updateError) {
        console.error('[PHASE] Failed to update user:', updateError)
        return NextResponse.json(
          { error: 'Failed to activate Phase 2' },
          { status: 500 }
        )
      }

      // Log phase transition
      const { error: logError } = await supabase
        .from('user_phase_status')
        .insert({
          user_id: userId,
          phase: 'phase2',
          status: 'active',
        })

      if (logError) {
        console.error('[PHASE] Failed to log phase transition:', logError)
      }

    } else {
      // Deactivate: revert to phase1
      const { error: updateError } = await supabase
        .from('users')
        .update({
          current_phase: 'phase1',
          in_therapy: false,
        })
        .eq('id', userId)

      if (updateError) {
        console.error('[PHASE] Failed to update user:', updateError)
        return NextResponse.json(
          { error: 'Failed to deactivate Phase 2' },
          { status: 500 }
        )
      }

      // Mark existing active phase2 status as inactive
      const { error: logError } = await supabase
        .from('user_phase_status')
        .update({
          status: 'inactive',
          deactivated_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .eq('phase', 'phase2')
        .eq('status', 'active')

      if (logError) {
        console.error('[PHASE] Failed to update phase status:', logError)
      }
    }

    // Return updated user
    const { data: updatedUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (fetchError || !updatedUser) {
      return NextResponse.json(
        { error: 'Failed to fetch updated user' },
        { status: 500 }
      )
    }

    return NextResponse.json({ user: updatedUser })

  } catch (error) {
    console.error('[PHASE] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
