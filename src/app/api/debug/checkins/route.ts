import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { buildSystemPrompt } from '@/lib/prompts'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    const supabase = createServerClient()

    // Get user
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get all check-ins for this user
    const { data: checkins } = await supabase
      .from('checkins')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })

    // Get messages for each check-in
    const checkinsWithMessages = await Promise.all(
      (checkins || []).map(async (checkin) => {
        const { data: messages } = await supabase
          .from('messages')
          .select('*')
          .eq('checkin_id', checkin.id)
          .order('created_at', { ascending: true })

        return {
          ...checkin,
          messages: messages || [],
        }
      })
    )

    // Get recent check-ins for context (same as chat route)
    const { data: recentCheckins } = await supabase
      .from('checkins')
      .select('date, insights, completed')
      .eq('user_id', userId)
      .eq('completed', true)
      .order('date', { ascending: false })
      .limit(5)

    // Count total completed check-ins
    const { count: totalCheckins } = await supabase
      .from('checkins')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('completed', true)

    // Calculate days since start
    const createdAt = new Date(user.created_at)
    const now = new Date()
    const daysSinceStart = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24))
    
    // Calculate days since last check-in
    let daysSinceLastCheckin: number | undefined
    if (recentCheckins && recentCheckins.length > 0) {
      const lastCheckinDate = new Date(recentCheckins[0].date)
      const today = new Date()
      lastCheckinDate.setHours(0, 0, 0, 0)
      today.setHours(0, 0, 0, 0)
      daysSinceLastCheckin = Math.floor((today.getTime() - lastCheckinDate.getTime()) / (1000 * 60 * 60 * 24))
    }

    // Build the system prompt so we can show what Claude sees
    const systemPrompt = buildSystemPrompt({
      name: user.name,
      patternType: user.pattern_type,
      patternDescription: user.pattern_description,
      stage: user.stage || 'precontemplation',
      daysInProgram: daysSinceStart,
      totalCheckins: totalCheckins || 0,
      currentMessageCount: 0, // Start of conversation
      recentCheckins: (recentCheckins || []).map(c => ({
        date: c.date,
        insights: c.insights,
        completed: c.completed,
      })),
      lastBehaviorDate: null,
      daysSinceLastCheckin,
    })

    return NextResponse.json({
      checkins: checkinsWithMessages,
      systemPrompt,
      userContext: {
        name: user.name,
        stage: user.stage,
        patternType: user.pattern_type,
        patternDescription: user.pattern_description,
        daysSinceStart,
        totalCheckins: totalCheckins || 0,
        recentCheckins: recentCheckins || [],
        daysSinceLastCheckin,
      },
    })
  } catch (error) {
    console.error('Debug API error:', error)
    return NextResponse.json({ error: 'Failed to fetch debug data' }, { status: 500 })
  }
}
