import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createServerClient } from '@/lib/supabase'
import { buildSystemPrompt, detectCrisis, getCrisisResponse } from '@/lib/prompts'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// CORS headers helper
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

// Handle CORS preflight
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  })
}

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export async function POST(request: NextRequest) {
  console.log('========================================')
  console.log('[CHAT API] Version 2 - Pacing safeguards active')
  console.log('========================================')
  
  try {
    const { userId, message, checkinId } = await request.json()

    if (!userId || !message) {
      return NextResponse.json(
        { error: 'userId and message are required' },
        { status: 400, headers: corsHeaders }
      )
    }

    const supabase = createServerClient()

    // Get user context
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404, headers: corsHeaders }
      )
    }

    // Get or create today's check-in
    let currentCheckinId = checkinId
    
    if (!currentCheckinId) {
      const today = new Date().toISOString().split('T')[0]
      
      // Check if there's already an INCOMPLETE check-in today
      // (Completed check-ins shouldn't be reused - user gets one per day)
      const { data: existingCheckin } = await supabase
        .from('checkins')
        .select('id, completed')
        .eq('user_id', userId)
        .eq('date', today)
        .eq('completed', false)  // Only reuse incomplete check-ins
        .single()

      if (existingCheckin) {
        currentCheckinId = existingCheckin.id
        console.log(`[CHECKIN] Resuming incomplete check-in: ${currentCheckinId}`)
      } else {
        // Create new check-in
        const { data: newCheckin, error: checkinError } = await supabase
          .from('checkins')
          .insert({ user_id: userId, date: today })
          .select('id')
          .single()

        if (checkinError) {
          console.error('Error creating check-in:', checkinError)
          return NextResponse.json(
            { error: 'Failed to create check-in' },
            { status: 500, headers: corsHeaders }
          )
        }
        currentCheckinId = newCheckin.id
        console.log(`[CHECKIN] Created new check-in: ${currentCheckinId}`)
      }
    }

    // Get conversation history for this check-in
    const { data: messages } = await supabase
      .from('messages')
      .select('role, content')
      .eq('checkin_id', currentCheckinId)
      .order('created_at', { ascending: true })

    // Get recent check-ins for context (last 5 completed ones)
    const { data: recentCheckins } = await supabase
      .from('checkins')
      .select('date, insights, completed')
      .eq('user_id', userId)
      .eq('completed', true)
      .order('date', { ascending: false })
      .limit(5)

    // Count total completed check-ins for this user
    const { count: totalCheckins } = await supabase
      .from('checkins')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('completed', true)

    // Current message count in this check-in
    const currentMessageCount = (messages || []).length

    // Calculate days since start
    const createdAt = new Date(user.created_at)
    const now = new Date()
    const daysSinceStart = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24))
    
    // Calculate days since last check-in
    let daysSinceLastCheckin: number | undefined
    if (recentCheckins && recentCheckins.length > 0) {
      const lastCheckinDate = new Date(recentCheckins[0].date)
      const today = new Date()
      // Reset to start of day for accurate day calculation
      lastCheckinDate.setHours(0, 0, 0, 0)
      today.setHours(0, 0, 0, 0)
      daysSinceLastCheckin = Math.floor((today.getTime() - lastCheckinDate.getTime()) / (1000 * 60 * 60 * 24))
    }

    // Build system prompt with user context
    const systemPrompt = buildSystemPrompt({
      name: user.name,
      patternType: user.pattern_type,
      patternDescription: user.pattern_description,
      stage: user.stage || 'precontemplation',
      daysInProgram: daysSinceStart,
      totalCheckins: totalCheckins || 0,
      currentMessageCount,
      recentCheckins: (recentCheckins || []).map(c => ({
        date: c.date,
        insights: c.insights,
        completed: c.completed,
      })),
      lastBehaviorDate: null, // TODO: track this
      daysSinceLastCheckin,
    })

    // Build conversation history for Claude
    const conversationHistory = (messages || []).map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }))

    // Handle START_CHECKIN trigger - this starts a new conversation
    const isStarting = message === '[START_CHECKIN]'
    
    if (!isStarting) {
      // Add the new user message
      conversationHistory.push({
        role: 'user',
        content: message,
      })

      // Save user message to database
      await supabase.from('messages').insert({
        checkin_id: currentCheckinId,
        role: 'user',
        content: message,
      })
    } else {
      // For starting, we add a system-level instruction
      conversationHistory.push({
        role: 'user',
        content: 'Please start the daily check-in with a warm greeting and ask how I\'m feeling today.',
      })
    }

    // Check if we need to force a closing message (after 8 messages = 4 exchanges)
    const shouldForceClose = currentMessageCount >= 8
    
    console.log(`[FLOW] currentMessageCount: ${currentMessageCount}`)
    console.log(`[FLOW] shouldForceClose: ${shouldForceClose}`)
    console.log(`[FLOW] isStarting: ${isStarting}`)

    // CRISIS DETECTION - Check before normal response
    if (!isStarting && detectCrisis(message)) {
      const crisisResponse = getCrisisResponse()
      
      // Save crisis response to database
      await supabase.from('messages').insert({
        checkin_id: currentCheckinId,
        role: 'assistant',
        content: crisisResponse,
      })

      // Don't mark as complete - they can continue when ready
      return NextResponse.json({
        message: crisisResponse,
        checkinId: currentCheckinId,
        isComplete: false,
        isCrisis: true,
      }, { headers: corsHeaders })
    }

    let assistantMessage = ''

    if (shouldForceClose && !isStarting) {
      console.log('[FLOW] Entering FORCED CLOSE branch')
      // Format conversation for closing context
      const conversationText = conversationHistory
        .map(m => `${m.role === 'assistant' ? 'Seen' : 'User'}: ${m.content}`)
        .join('\n\n')

      // Different closing prompt for first check-in vs. subsequent
      const isFirstCheckin = (totalCheckins || 0) === 0
      
      // Vary closing style based on check-in count
      const closingVariation = (totalCheckins || 0) % 4
      
      const closingPrompt = isFirstCheckin 
        ? `Write a warm closing for this user's FIRST check-in with Seen.

RULES:
- 3-4 complete sentences
- NO questions (no question marks)
- Acknowledge ONE specific thing they shared (use their words, don't assume feelings)
- Affirm their courage for taking this first step
- Explain you'll remember this and build on it tomorrow
- End warmly

STRUCTURE:
1. Reflect something specific they shared
2. Affirm them for starting this process
3. Explain continuity: "I'll remember what you shared today, and we'll build on it tomorrow"
4. Warm goodbye

Write the closing now:`
        : closingVariation === 0
        ? `Write a warm closing with a REFLECTION PROMPT for this check-in.

RULES:
- 2-3 sentences
- NO questions
- Include a gentle noticing prompt: "Between now and tomorrow, you might notice [specific thing from conversation]. No need to change anything - just notice."
- Use their actual words, don't assume feelings

Write the closing now:`
        : closingVariation === 1
        ? `Write a simple, warm closing for this check-in.

RULES:
- 1-2 sentences only
- NO questions
- Brief acknowledgment of what they shared
- End with "See you tomorrow."

Keep it short and natural. Write the closing now:`
        : closingVariation === 2
        ? `Write a warm closing with an AFFIRMATION for this check-in.

RULES:
- 2-3 sentences
- NO questions
- Affirm their honesty or effort (e.g., "The way you're looking at this honestly takes strength")
- Use their words, don't assume feelings

Write the closing now:`
        : `Write a warm closing with an OBSERVATION for this check-in.

RULES:
- 2-3 sentences
- NO questions
- Make a gentle observation: "It sounds like [pattern or theme you noticed]"
- End warmly

Write the closing now:`

      const closingResponse = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 150,
        system: closingPrompt,
        messages: [{
          role: 'user',
          content: `Here's the conversation to close:\n\n${conversationText}`
        }],
      })

      assistantMessage = closingResponse.content[0].type === 'text' 
        ? closingResponse.content[0].text 
        : ''
      
      // HARD FALLBACK: Strip any sentences containing question marks
      if (assistantMessage.includes('?')) {
        const sentences = assistantMessage.split(/(?<=[.!])\s+/)
        const nonQuestions = sentences.filter(s => !s.includes('?'))
        assistantMessage = nonQuestions.join(' ').trim()
        
        // If we stripped everything or it's too short, use a generic close
        if (assistantMessage.length < 20) {
          assistantMessage = `Thanks for sharing today, ${user.name}. See you tomorrow.`
        }
      }
      
      // Ensure it ends with a closing phrase
      if (!assistantMessage.toLowerCase().includes('tomorrow') && !assistantMessage.toLowerCase().includes('take care')) {
        assistantMessage += ' See you tomorrow.'
      }
    } else {
      console.log('[FLOW] Entering NORMAL RESPONSE branch (not forced close)')
      // Normal response
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 500,
        system: systemPrompt,
        messages: conversationHistory,
      })

      assistantMessage = response.content[0].type === 'text' 
        ? response.content[0].text 
        : ''
      
      // SERVER-SIDE SAFEGUARD: Prevent premature closing
      // If we're below minimum message count, FORCE continuation
      const minimumBeforeClose = 6
      
      console.log(`[PACING] Message count: ${currentMessageCount}, minimum: ${minimumBeforeClose}`)
      
      if (currentMessageCount < minimumBeforeClose) {
        console.log(`[PACING] Below minimum - checking for premature closing`)
        console.log(`[PACING] Original message: ${assistantMessage}`)
        
        // List of closing phrases to strip - be very broad
        const closingPhrases = [
          'see you tomorrow',
          'take care',
          'until next time',
          'until tomorrow',
          'talk tomorrow',
          'catch you tomorrow',
          'i\'ll see you',
          'see you then',
          'see you soon',
          'goodbye',
          'bye for now'
        ]
        
        // Check each sentence
        const sentences = assistantMessage.split(/(?<=[.!?])\s+/)
        const filteredSentences = sentences.filter(sentence => {
          const sentenceLower = sentence.toLowerCase()
          const hasClosing = closingPhrases.some(phrase => sentenceLower.includes(phrase))
          if (hasClosing) {
            console.log(`[PACING] Stripping sentence: ${sentence}`)
          }
          return !hasClosing
        })
        
        assistantMessage = filteredSentences.join(' ').trim()
        console.log(`[PACING] After stripping: ${assistantMessage}`)
        
        // ALWAYS ensure there's a follow-up question if we're in early conversation
        if (!assistantMessage.includes('?')) {
          console.log(`[PACING] No question found - adding follow-up`)
          // Add a contextual follow-up question
          const followUps = [
            " What's that like for you?",
            " What do you think is behind that?",
            " Can you tell me more about what's going on?",
            " What's been happening that's bringing this up?",
            " How does that show up for you?",
          ]
          const randomFollowUp = followUps[Math.floor(Math.random() * followUps.length)]
          assistantMessage += randomFollowUp
          console.log(`[PACING] Final message: ${assistantMessage}`)
        }
      }
    }

    // Save assistant message to database
    await supabase.from('messages').insert({
      checkin_id: currentCheckinId,
      role: 'assistant',
      content: assistantMessage,
    })

    // Check if this is a closing message
    // Only allow closing after at least 6 messages (3 full exchanges)
    const minimumMessagesBeforeClose = 6
    const closingPhrases = [
      'see you tomorrow',
      'take care',
      'until next time',
      'until tomorrow',
      'talk tomorrow',
      'catch you tomorrow',
      'thanks for sharing today',
      'thank you for sharing today',
      'good chatting',
      'chat tomorrow'
    ]
    const messageLower = assistantMessage.toLowerCase()
    const hasClosingPhrase = closingPhrases.some(phrase => messageLower.includes(phrase))
    
    // Only close if we have enough messages OR forced close triggered
    const canClose = currentMessageCount >= minimumMessagesBeforeClose || shouldForceClose
    const isClosing = canClose && (hasClosingPhrase || shouldForceClose)

    if (isClosing) {
      // Mark check-in as completed
      await supabase
        .from('checkins')
        .update({ completed: true })
        .eq('id', currentCheckinId)

      // Format conversation for analysis
      const conversationText = conversationHistory
        .map(m => `${m.role === 'assistant' ? 'Seen' : 'User'}: ${m.content}`)
        .join('\n\n')

      // Generate and save insights from this conversation
      try {
        const insightPrompt = `You are a note-taker. Analyze the following check-in conversation and extract KEY LEARNINGS about the user's stress-response pattern.

Write 2-3 factual sentences (plain text, no markdown/formatting) summarizing what was learned about:
- Their triggers (what causes the behavior)
- The behavior itself (what they do, how long, etc.)
- The function (what need it meets)
- The aftermath (how they feel after)

Only include things actually discussed. Be concise and specific. Do not use bullet points or bold text.

Example: "Work and family pressure trigger smoking breaks. User smokes to get a moment to detach and breathe when feeling overwhelmed. Duration and aftermath not yet explored."`

        const insightResponse = await anthropic.messages.create({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 200,
          system: insightPrompt,
          messages: [{
            role: 'user',
            content: `Analyze this conversation:\n\n${conversationText}`
          }],
        })

        let insight = insightResponse.content[0].type === 'text' 
          ? insightResponse.content[0].text 
          : ''
        
        // Strip markdown formatting (bold, headers, etc.)
        insight = insight
          .replace(/\*\*/g, '')  // Remove bold
          .replace(/\*/g, '')    // Remove italic
          .replace(/^#+\s*/gm, '') // Remove headers
          .replace(/^-\s*/gm, '')  // Remove list markers
          .trim()

        // Save insight to check-in
        await supabase
          .from('checkins')
          .update({ insights: insight })
          .eq('id', currentCheckinId)

        // Also update the user's pattern_description if we learned something new
        if (insight && (!user.pattern_description || user.pattern_description === 'Still being explored')) {
          await supabase
            .from('users')
            .update({ pattern_description: insight })
            .eq('id', userId)
        }
      } catch (insightError) {
        console.error('Failed to generate insight:', insightError)
      }

      // Extract stress level and detect stage progression
      try {
        const analysisPrompt = `Analyze this check-in conversation and extract:

1. STRESS_LEVEL: Did the user explicitly state a stress level number?
   - If they said a specific number (e.g. "I'm at an 8", "about a 6"), use that number
   - If they did NOT give an explicit number, respond with "none"
   - Do NOT infer or estimate - only capture explicit numbers from the user

2. STAGE_PROGRESSION: The user's current stage is "${user.stage || 'precontemplation'}". 
   Based on this conversation, should they move to the next stage?
   
   Stages in order: precontemplation → contemplation → preparation → action → maintenance
   
   Signals for moving forward:
   - precontemplation → contemplation: "Maybe this is a problem", expressing costs/downsides, wanting something different
   - contemplation → preparation: "I want to change", asking for strategies, "I'm tired of this"
   - preparation → action: "I tried something different", reports of attempts
   - action → maintenance: sustained change, "it's getting easier"

Respond in this EXACT format (no other text):
STRESS_LEVEL: [number 1-10 OR "none" if not explicitly stated]
NEW_STAGE: [next stage name OR "none" if no change]
STAGE_REASON: [brief reason OR "n/a" if no change]`

        const analysisResponse = await anthropic.messages.create({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 150,
          system: analysisPrompt,
          messages: [{
            role: 'user',
            content: conversationText
          }],
        })

        const analysisText = analysisResponse.content[0].type === 'text' 
          ? analysisResponse.content[0].text 
          : ''

        console.log('[ANALYSIS] Extraction result:', analysisText)

        // Parse stress level - only saves if user gave explicit number
        const stressMatch = analysisText.match(/STRESS_LEVEL:\s*(\d+)/i)
        if (stressMatch) {
          const stressLevel = parseInt(stressMatch[1], 10)
          if (stressLevel >= 1 && stressLevel <= 10) {
            await supabase
              .from('checkins')
              .update({ stress_level: stressLevel })
              .eq('id', currentCheckinId)
            console.log(`[ANALYSIS] Saved stress level: ${stressLevel}`)
          }
        } else {
          console.log('[ANALYSIS] No explicit stress level given - not saving')
        }

        // Parse stage progression
        const stageMatch = analysisText.match(/NEW_STAGE:\s*(\w+)/i)
        const reasonMatch = analysisText.match(/STAGE_REASON:\s*(.+)/i)
        
        if (stageMatch && stageMatch[1].toLowerCase() !== 'none') {
          const newStage = stageMatch[1].toLowerCase()
          const validStages = ['precontemplation', 'contemplation', 'preparation', 'action', 'maintenance']
          
          if (validStages.includes(newStage) && newStage !== user.stage) {
            await supabase
              .from('users')
              .update({ stage: newStage })
              .eq('id', userId)
            console.log(`[ANALYSIS] Updated stage: ${user.stage} → ${newStage}`)
            if (reasonMatch) {
              console.log(`[ANALYSIS] Reason: ${reasonMatch[1]}`)
            }
          }
        }
      } catch (analysisError) {
        console.error('Failed to extract stress/stage:', analysisError)
      }

      // Trigger structured extraction for insight system (runs in background)
      try {
        const { extractFromCheckin } = await import('@/lib/extraction-handler')
        extractFromCheckin(currentCheckinId).catch(err => {
          console.error('[CHAT] Background extraction failed:', err)
        })
        console.log(`[EXTRACTION] Triggered for check-in: ${currentCheckinId}`)
      } catch (extractError) {
        console.error('[EXTRACTION] Failed to import extraction handler:', extractError)
      }
    }

    console.log('========================================')
    console.log('[RESPONSE] Final message being sent:')
    console.log(assistantMessage)
    console.log('========================================')

    return NextResponse.json({
      message: assistantMessage,
      checkinId: currentCheckinId,
      isComplete: isClosing,
    }, { headers: corsHeaders })
  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500, headers: corsHeaders }
    )
  }
}
