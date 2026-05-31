import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { status, userId, intention_text, target_date } = body
    const intentionId = params.id

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    const updateData: Record<string, any> = {}

    if (status !== undefined) {
      if (!['active', 'completed', 'skipped'].includes(status)) {
        return NextResponse.json(
          { error: 'status must be "active", "completed", or "skipped"' },
          { status: 400 }
        )
      }
      updateData.status = status
      if (status === 'completed') {
        updateData.completed_at = new Date().toISOString()
      } else if (status === 'active') {
        // Reactivating clears any previous completion timestamp
        updateData.completed_at = null
      }
    }

    if (intention_text !== undefined) {
      const trimmed = String(intention_text).trim()
      if (!trimmed) {
        return NextResponse.json(
          { error: 'intention_text cannot be empty' },
          { status: 400 }
        )
      }
      updateData.intention_text = trimmed
    }

    if (target_date !== undefined) {
      // Allow null to clear, or a YYYY-MM-DD string
      updateData.target_date = target_date || null
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No updatable fields provided' },
        { status: 400 }
      )
    }

    const supabase = createServerClient()

    const { data, error } = await supabase
      .from('practice_intentions')
      .update(updateData)
      .eq('id', intentionId)
      .eq('user_id', userId)
      .select('id, intention_text, target_date, status, completed_at')
      .single()

    if (error) {
      console.error('[INTENTIONS] Update error:', error)
      return NextResponse.json({ error: 'Failed to update intention' }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: 'Intention not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, intention: data })
  } catch (error) {
    console.error('[INTENTIONS] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
