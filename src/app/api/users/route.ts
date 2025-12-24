import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { generateInviteCode } from '@/lib/prompts'
import { sendWelcomeEmail } from '@/lib/email'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// CORS headers helper
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

// Handle CORS preflight
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  })
}

// POST - Create a new user (for admin/testing)
export async function POST(request: NextRequest) {
  try {
    const { name, email, patternType, patternDescription, notificationTime, sendWelcome } = await request.json()

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400, headers: corsHeaders }
      )
    }

    const supabase = createServerClient()

    // Generate unique invite code
    let inviteCode = generateInviteCode()
    
    // Make sure it's unique
    let attempts = 0
    while (attempts < 5) {
      const { data: existing } = await supabase
        .from('users')
        .select('id')
        .eq('invite_code', inviteCode)
        .single()
      
      if (!existing) break
      inviteCode = generateInviteCode()
      attempts++
    }

    // Create user
    const { data: user, error } = await supabase
      .from('users')
      .insert({
        name,
        email: email || null,
        pattern_type: patternType || null,
        pattern_description: patternDescription || null,
        notification_time: notificationTime || '09:00:00',
        invite_code: inviteCode,
        stage: 'precontemplation',
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating user:', error)
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500, headers: corsHeaders }
      )
    }

    // Send welcome email if requested and email provided
    let emailSent = false
    if (sendWelcome && email) {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://seen-checkins.vercel.app'
      const result = await sendWelcomeEmail(email, name, inviteCode, baseUrl)
      emailSent = result.success
      if (!result.success) {
        console.error('Failed to send welcome email:', result.error)
      }
    }

    return NextResponse.json({ 
      user,
      inviteCode,
      emailSent,
      message: `User created! Invite code: ${inviteCode}${emailSent ? ' (welcome email sent)' : ''}`
    }, { headers: corsHeaders })
  } catch (error) {
    console.error('Create user error:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500, headers: corsHeaders }
    )
  }
}

// GET - List all users (for admin/testing)
export async function GET() {
  try {
    const supabase = createServerClient()

    const { data: users, error } = await supabase
      .from('users')
      .select('id, name, email, pattern_type, stage, invite_code, created_at')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch users' },
        { status: 500, headers: corsHeaders }
      )
    }

    return NextResponse.json({ users }, { headers: corsHeaders })
  } catch (error) {
    console.error('Get users error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500, headers: corsHeaders }
    )
  }
}

// DELETE - Remove a user and all their data
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400, headers: corsHeaders }
      )
    }

    const supabase = createServerClient()

    // Delete messages first (foreign key constraint)
    const { data: checkins } = await supabase
      .from('checkins')
      .select('id')
      .eq('user_id', userId)

    if (checkins && checkins.length > 0) {
      const checkinIds = checkins.map(c => c.id)
      await supabase
        .from('messages')
        .delete()
        .in('checkin_id', checkinIds)
    }

    // Delete checkins
    await supabase
      .from('checkins')
      .delete()
      .eq('user_id', userId)

    // Delete user
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId)

    if (error) {
      console.error('Error deleting user:', error)
      return NextResponse.json(
        { error: 'Failed to delete user' },
        { status: 500, headers: corsHeaders }
      )
    }

    return NextResponse.json({ success: true, message: 'User deleted' }, { headers: corsHeaders })
  } catch (error) {
    console.error('Delete user error:', error)
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500, headers: corsHeaders }
    )
  }
}
