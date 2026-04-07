import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = createServerClient()

    const { data: themes, error } = await supabase
      .from('practice_themes')
      .select('id, name, description, display_order')
      .eq('is_active', true)
      .order('display_order', { ascending: true })

    if (error) {
      console.error('[THEMES] Failed to fetch themes:', error)
      return NextResponse.json(
        { error: 'Failed to fetch themes' },
        { status: 500 }
      )
    }

    return NextResponse.json({ themes: themes || [] })
  } catch (error) {
    console.error('[THEMES] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
