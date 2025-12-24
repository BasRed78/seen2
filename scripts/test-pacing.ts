/**
 * Automated Pacing Test
 * 
 * Simulates conversations and checks for premature closings
 * Run with: npx ts-node scripts/test-pacing.ts
 */

const BASE_URL = 'http://localhost:3000'

interface TestResult {
  messageNumber: number
  userInput: string
  assistantResponse: string
  hasPrematureClosing: boolean
  hasQuestion: boolean
  issues: string[]
}

const CLOSING_PHRASES = [
  'see you tomorrow',
  'take care',
  'until next time',
  'until tomorrow',
  'talk tomorrow',
  'catch you tomorrow',
  "i'll see you",
  'see you then',
  'see you soon',
  'goodbye',
  'bye for now'
]

const FORBIDDEN_PHRASES = [
  'therapy',
  'therapist', 
  'therapy session',
  'i understand how you feel',
  "i'm proud of you"
]

function checkForIssues(response: string, messageNumber: number): string[] {
  const issues: string[] = []
  const responseLower = response.toLowerCase()
  
  // Check for premature closing (before message 6)
  if (messageNumber < 6) {
    for (const phrase of CLOSING_PHRASES) {
      if (responseLower.includes(phrase)) {
        issues.push(`PREMATURE CLOSING: "${phrase}" found at message ${messageNumber}`)
      }
    }
  }
  
  // Check for forbidden phrases
  for (const phrase of FORBIDDEN_PHRASES) {
    if (responseLower.includes(phrase)) {
      issues.push(`FORBIDDEN PHRASE: "${phrase}"`)
    }
  }
  
  // Check if there's no question when there should be one (early conversation)
  if (messageNumber < 6 && !response.includes('?')) {
    issues.push(`NO QUESTION: Response at message ${messageNumber} has no follow-up question`)
  }
  
  return issues
}

async function createTestUser(): Promise<{ id: string; name: string }> {
  const testName = `PacingTest_${Date.now()}`
  
  const response = await fetch(`${BASE_URL}/api/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: testName,
      pattern_type: 'stress_regulator',
      pattern_description: 'Uses social media scrolling to avoid stress',
      stage: 'precontemplation'
    })
  })
  
  const data = await response.json()
  return { id: data.user.id, name: testName }
}

async function sendMessage(userId: string, message: string, checkinId?: string): Promise<{
  response: string
  checkinId: string
  isComplete: boolean
}> {
  const res = await fetch(`${BASE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId,
      message,
      checkinId
    })
  })
  
  const data = await res.json()
  return {
    response: data.message,
    checkinId: data.checkinId,
    isComplete: data.isComplete || false
  }
}

async function runConversationTest(userId: string, userMessages: string[]): Promise<TestResult[]> {
  const results: TestResult[] = []
  
  // Start the conversation
  console.log('\n🚀 Starting conversation...\n')
  const start = await sendMessage(userId, '[START_CHECKIN]')
  let checkinId = start.checkinId
  
  console.log(`Assistant (opening): ${start.response}\n`)
  
  // Track message count (opening = 1)
  let messageNumber = 1
  
  // Send each user message
  for (const userInput of userMessages) {
    messageNumber++ // User message
    console.log(`User: ${userInput}`)
    
    const { response, isComplete } = await sendMessage(userId, userInput, checkinId)
    messageNumber++ // Assistant response
    
    console.log(`Assistant (msg ${messageNumber}): ${response}\n`)
    
    const issues = checkForIssues(response, messageNumber)
    
    results.push({
      messageNumber,
      userInput,
      assistantResponse: response,
      hasPrematureClosing: issues.some(i => i.includes('PREMATURE CLOSING')),
      hasQuestion: response.includes('?'),
      issues
    })
    
    if (isComplete) {
      console.log('📍 Conversation marked as complete\n')
      break
    }
  }
  
  return results
}

async function main() {
  console.log('='.repeat(60))
  console.log('SEEN PACING TEST')
  console.log('='.repeat(60))
  
  // Test 1: First check-in with short responses
  console.log('\n' + '-'.repeat(60))
  console.log('TEST 1: First check-in (short responses)')
  console.log('-'.repeat(60))
  
  const user1 = await createTestUser()
  console.log(`Created user: ${user1.name}`)
  
  const shortResponses = [
    'Stressed',
    'Work stuff',
    'Yeah',
    'I guess so',
    'Not sure'
  ]
  
  const results1 = await runConversationTest(user1.id, shortResponses)
  
  // Test 2: Simulate a returning user (user with completed check-in)
  // We'll create a new user and manually mark a previous check-in complete
  console.log('\n' + '-'.repeat(60))
  console.log('TEST 2: Returning user simulation (second check-in)')
  console.log('-'.repeat(60))
  
  const user2 = await createTestUser()
  console.log(`Created user: ${user2.name}`)
  
  // First, do a quick check-in to completion
  console.log('Completing a first check-in to simulate returning user...')
  let firstCheckin = await sendMessage(user2.id, '[START_CHECKIN]')
  for (let i = 0; i < 5; i++) {
    const { isComplete, checkinId } = await sendMessage(user2.id, 'Test response ' + i, firstCheckin.checkinId)
    if (isComplete) break
  }
  
  // Force complete via direct API would be better, but for now just run the real test
  // The issue is both check-ins happen on same day... 
  // For now, let's just test the second conversation pattern
  console.log('\nNow testing with short responses as "returning" user:')
  
  const returningResponses = [
    'Same as yesterday',
    'Still stressed',
    'Work again'
  ]
  
  // This will continue the same check-in, but that's okay for testing the pacing
  const results2 = await runConversationTest(user2.id, returningResponses)
  
  // Summary
  console.log('\n' + '='.repeat(60))
  console.log('TEST RESULTS SUMMARY')
  console.log('='.repeat(60))
  
  const allResults = [...results1, ...results2]
  let totalIssues = 0
  
  for (const result of allResults) {
    if (result.issues.length > 0) {
      totalIssues += result.issues.length
      console.log(`\n❌ Message ${result.messageNumber}:`)
      console.log(`   User said: "${result.userInput}"`)
      console.log(`   Assistant: "${result.assistantResponse.substring(0, 100)}..."`)
      for (const issue of result.issues) {
        console.log(`   🔴 ${issue}`)
      }
    }
  }
  
  if (totalIssues === 0) {
    console.log('\n✅ All pacing checks passed!')
  } else {
    console.log(`\n⚠️  ${totalIssues} issue(s) found - see above`)
  }
  
  console.log('\n' + '='.repeat(60))
}

main().catch(console.error)
