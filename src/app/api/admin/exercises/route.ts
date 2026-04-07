import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

// GET: List all exercises (including methodology for admin)
export async function GET() {
  try {
    const supabase = createServerClient()

    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .order('display_order', { ascending: true })

    if (error) {
      console.error('[ADMIN EXERCISES] Fetch failed:', error)
      return NextResponse.json({ error: 'Failed to fetch exercises' }, { status: 500 })
    }

    return NextResponse.json({ exercises: data })
  } catch (error) {
    console.error('[ADMIN EXERCISES] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST: Create a new exercise
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const supabase = createServerClient()

    const { data, error } = await supabase
      .from('exercises')
      .insert({
        title: body.title,
        description: body.description || null,
        instructions: body.instructions || null,
        theme_id: body.theme_id || null,
        category: body.category,
        exercise_type: body.exercise_type,
        duration_minutes: body.duration_minutes || null,
        pattern_relevance: body.pattern_relevance || null,
        methodology: body.methodology || null,
        is_onboarding: body.is_onboarding || false,
        display_order: body.display_order || 99,
        is_active: body.is_active !== false,
      })
      .select('id')
      .single()

    if (error) {
      console.error('[ADMIN EXERCISES] Create failed:', error)
      return NextResponse.json({ error: 'Failed to create exercise' }, { status: 500 })
    }

    return NextResponse.json({ id: data.id })
  } catch (error) {
    console.error('[ADMIN EXERCISES] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT: Update an existing exercise
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    if (!body.id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }

    const supabase = createServerClient()

    const { error } = await supabase
      .from('exercises')
      .update({
        title: body.title,
        description: body.description || null,
        instructions: body.instructions || null,
        theme_id: body.theme_id || null,
        category: body.category,
        exercise_type: body.exercise_type,
        duration_minutes: body.duration_minutes || null,
        pattern_relevance: body.pattern_relevance || null,
        methodology: body.methodology || null,
        is_onboarding: body.is_onboarding || false,
        display_order: body.display_order || 99,
        is_active: body.is_active !== false,
      })
      .eq('id', body.id)

    if (error) {
      console.error('[ADMIN EXERCISES] Update failed:', error)
      return NextResponse.json({ error: 'Failed to update exercise' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[ADMIN EXERCISES] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE: Remove an exercise
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()
    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }

    const supabase = createServerClient()

    const { error } = await supabase
      .from('exercises')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('[ADMIN EXERCISES] Delete failed:', error)
      return NextResponse.json({ error: 'Failed to delete exercise' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[ADMIN EXERCISES] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
