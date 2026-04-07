import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { status, userId } = await request.json()
    const intentionId = params.id

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    if (!['completed', 'skipped'].includes(status)) {
      return NextResponse.json(
        { error: 'status must be "completed" or "skipped"' },
        { status: 400 }
      )
    }

    const supabase = createServerClient()

    const updateData: Record<string, any> = { status }
    if (status === 'completed') {
      updateData.completed_at = new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('practice_intentions')
      .update(updateData)
      .eq('id', intentionId)
      .eq('user_id', userId)
      .select('id, status, completed_at')
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
