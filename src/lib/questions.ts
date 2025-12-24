// Complete Question Database - 250 questions organized by stage and category
// Based on Transtheoretical Model (Stages of Change) and Motivational Interviewing

export type Stage = 'precontemplation' | 'contemplation' | 'preparation' | 'action' | 'maintenance'

export interface Question {
  id: string
  text: string
  category: string
  stage: Stage
  followUpIf?: 'short_answer' | 'long_answer' | 'resistance' | 'shame'
}

export const questionDatabase: Record<Stage, Record<string, Question[]>> = {
  // ============================================
  // STAGE 1: PRECONTEMPLATION
  // User may not see behavior as problematic yet
  // Goal: Raise awareness without defensiveness
  // ============================================
  precontemplation: {
    opening: [
      { id: 'pre-open-1', text: "How are you feeling today?", category: 'opening', stage: 'precontemplation' },
      { id: 'pre-open-2', text: "What's on your mind right now?", category: 'opening', stage: 'precontemplation' },
      { id: 'pre-open-3', text: "What's your stress level like today, on a scale of 1-10?", category: 'opening', stage: 'precontemplation' },
      { id: 'pre-open-4', text: "Tell me about your day so far.", category: 'opening', stage: 'precontemplation' },
      { id: 'pre-open-5', text: "What's been weighing on you lately?", category: 'opening', stage: 'precontemplation' },
    ],
    
    awareness_raising: [
      { id: 'pre-aware-1', text: "When did you first notice this pattern in yourself?", category: 'awareness_raising', stage: 'precontemplation' },
      { id: 'pre-aware-2', text: "How long has this been part of your life?", category: 'awareness_raising', stage: 'precontemplation' },
      { id: 'pre-aware-3', text: "What was going on in your life when this pattern started?", category: 'awareness_raising', stage: 'precontemplation' },
      { id: 'pre-aware-4', text: "Have you noticed any situations that tend to trigger this?", category: 'awareness_raising', stage: 'precontemplation' },
      { id: 'pre-aware-5', text: "What patterns do you notice about when this happens?", category: 'awareness_raising', stage: 'precontemplation' },
    ],
    
    function_exploration: [
      { id: 'pre-func-1', text: "What does [behavior] do for you in the moment?", category: 'function_exploration', stage: 'precontemplation' },
      { id: 'pre-func-2', text: "When you [behavior], what are you hoping will happen?", category: 'function_exploration', stage: 'precontemplation' },
      { id: 'pre-func-3', text: "What feeling does [behavior] give you?", category: 'function_exploration', stage: 'precontemplation' },
      { id: 'pre-func-4', text: "What need does this meet for you?", category: 'function_exploration', stage: 'precontemplation' },
      { id: 'pre-func-5', text: "What would be missing if you couldn't do this?", category: 'function_exploration', stage: 'precontemplation' },
      { id: 'pre-func-6', text: "When does this behavior feel most necessary?", category: 'function_exploration', stage: 'precontemplation' },
      { id: 'pre-func-7', text: "What do you enjoy about [behavior]?", category: 'function_exploration', stage: 'precontemplation' },
      { id: 'pre-func-8', text: "How does [behavior] help you cope?", category: 'function_exploration', stage: 'precontemplation' },
    ],
    
    trigger_exploration: [
      { id: 'pre-trig-1', text: "What's usually happening right before you feel the urge?", category: 'trigger_exploration', stage: 'precontemplation' },
      { id: 'pre-trig-2', text: "What emotions tend to come up before this happens?", category: 'trigger_exploration', stage: 'precontemplation' },
      { id: 'pre-trig-3', text: "Are there certain times of day when this is more likely?", category: 'trigger_exploration', stage: 'precontemplation' },
      { id: 'pre-trig-4', text: "Are there specific places or situations where this tends to happen?", category: 'trigger_exploration', stage: 'precontemplation' },
      { id: 'pre-trig-5', text: "What's the first sign that the urge is coming?", category: 'trigger_exploration', stage: 'precontemplation' },
      { id: 'pre-trig-6', text: "When you think about the last few times this happened, what was similar?", category: 'trigger_exploration', stage: 'precontemplation' },
    ],
    
    aftermath_exploration: [
      { id: 'pre-after-1', text: "How do you usually feel right after [behavior]?", category: 'aftermath_exploration', stage: 'precontemplation' },
      { id: 'pre-after-2', text: "What about a few hours later - how do you feel then?", category: 'aftermath_exploration', stage: 'precontemplation' },
      { id: 'pre-after-3', text: "Does the feeling you were looking for last, or does it fade?", category: 'aftermath_exploration', stage: 'precontemplation' },
      { id: 'pre-after-4', text: "What thoughts come up after you [behavior]?", category: 'aftermath_exploration', stage: 'precontemplation' },
      { id: 'pre-after-5', text: "Is there anything about [behavior] that bothers you afterward?", category: 'aftermath_exploration', stage: 'precontemplation' },
    ],
    
    gentle_consequences: [
      { id: 'pre-conseq-1', text: "Has anyone ever expressed concern about this?", category: 'gentle_consequences', stage: 'precontemplation' },
      { id: 'pre-conseq-2', text: "What would your life look like without this pattern?", category: 'gentle_consequences', stage: 'precontemplation' },
      { id: 'pre-conseq-3', text: "Is there anything about this that concerns you, even a little?", category: 'gentle_consequences', stage: 'precontemplation' },
      { id: 'pre-conseq-4', text: "How does this fit with what matters most to you?", category: 'gentle_consequences', stage: 'precontemplation' },
      { id: 'pre-conseq-5', text: "If you imagined your life 5 years from now with this pattern, what would that look like?", category: 'gentle_consequences', stage: 'precontemplation' },
    ],
    
    closing: [
      { id: 'pre-close-1', text: "What's one thing you noticed about yourself today?", category: 'closing', stage: 'precontemplation' },
      { id: 'pre-close-2', text: "Is there anything else on your mind before we wrap up?", category: 'closing', stage: 'precontemplation' },
    ],
  },

  // ============================================
  // STAGE 2: CONTEMPLATION  
  // User is aware of problem, ambivalent about change
  // Goal: Explore ambivalence, develop discrepancy
  // ============================================
  contemplation: {
    opening: [
      { id: 'con-open-1', text: "How are you feeling today?", category: 'opening', stage: 'contemplation' },
      { id: 'con-open-2', text: "What's been on your mind since we last talked?", category: 'opening', stage: 'contemplation' },
      { id: 'con-open-3', text: "How's your stress level today?", category: 'opening', stage: 'contemplation' },
      { id: 'con-open-4', text: "What's been happening for you lately?", category: 'opening', stage: 'contemplation' },
    ],
    
    decisional_balance_pros: [
      { id: 'con-pros-1', text: "What are the good things about [behavior]?", category: 'decisional_balance_pros', stage: 'contemplation' },
      { id: 'con-pros-2', text: "What do you get from [behavior] that you'd miss if it stopped?", category: 'decisional_balance_pros', stage: 'contemplation' },
      { id: 'con-pros-3', text: "When does [behavior] actually work the way you want it to?", category: 'decisional_balance_pros', stage: 'contemplation' },
      { id: 'con-pros-4', text: "What need does [behavior] meet?", category: 'decisional_balance_pros', stage: 'contemplation' },
    ],
    
    decisional_balance_cons: [
      { id: 'con-cons-1', text: "What are the not-so-good things about [behavior]?", category: 'decisional_balance_cons', stage: 'contemplation' },
      { id: 'con-cons-2', text: "What does [behavior] cost you?", category: 'decisional_balance_cons', stage: 'contemplation' },
      { id: 'con-cons-3', text: "What concerns you about continuing [behavior]?", category: 'decisional_balance_cons', stage: 'contemplation' },
      { id: 'con-cons-4', text: "How does [behavior] affect your relationships?", category: 'decisional_balance_cons', stage: 'contemplation' },
      { id: 'con-cons-5', text: "What opportunities have you missed because of [behavior]?", category: 'decisional_balance_cons', stage: 'contemplation' },
      { id: 'con-cons-6', text: "How do you feel about yourself when you [behavior]?", category: 'decisional_balance_cons', stage: 'contemplation' },
    ],
    
    values_clarification: [
      { id: 'con-val-1', text: "What matters most to you in life?", category: 'values_clarification', stage: 'contemplation' },
      { id: 'con-val-2', text: "Who do you want to be as a person?", category: 'values_clarification', stage: 'contemplation' },
      { id: 'con-val-3', text: "What kind of relationships do you want?", category: 'values_clarification', stage: 'contemplation' },
      { id: 'con-val-4', text: "When you think about your future, what do you hope for?", category: 'values_clarification', stage: 'contemplation' },
      { id: 'con-val-5', text: "What would make you feel proud of yourself?", category: 'values_clarification', stage: 'contemplation' },
    ],
    
    discrepancy_development: [
      { id: 'con-disc-1', text: "You mentioned you value [X]. How does [behavior] fit with that?", category: 'discrepancy_development', stage: 'contemplation' },
      { id: 'con-disc-2', text: "On one hand you want [goal], on the other you're [behavior]. How do you make sense of that?", category: 'discrepancy_development', stage: 'contemplation' },
      { id: 'con-disc-3', text: "Does [behavior] move you toward what you want, or away from it?", category: 'discrepancy_development', stage: 'contemplation' },
      { id: 'con-disc-4', text: "What's the gap between who you are now and who you want to be?", category: 'discrepancy_development', stage: 'contemplation' },
      { id: 'con-disc-5', text: "If your future self could talk to you now, what would they say about [behavior]?", category: 'discrepancy_development', stage: 'contemplation' },
    ],
    
    change_talk_desire: [
      { id: 'con-desire-1', text: "What would you like to change about this situation?", category: 'change_talk_desire', stage: 'contemplation' },
      { id: 'con-desire-2', text: "What do you wish was different?", category: 'change_talk_desire', stage: 'contemplation' },
      { id: 'con-desire-3', text: "If you could wave a magic wand, what would change?", category: 'change_talk_desire', stage: 'contemplation' },
      { id: 'con-desire-4', text: "What part of this bothers you the most?", category: 'change_talk_desire', stage: 'contemplation' },
    ],
    
    change_talk_ability: [
      { id: 'con-ability-1', text: "What strengths do you have that could help you change?", category: 'change_talk_ability', stage: 'contemplation' },
      { id: 'con-ability-2', text: "What's worked for you in the past when you've made changes?", category: 'change_talk_ability', stage: 'contemplation' },
      { id: 'con-ability-3', text: "How have you successfully overcome challenges before?", category: 'change_talk_ability', stage: 'contemplation' },
      { id: 'con-ability-4', text: "Who in your life could support a change?", category: 'change_talk_ability', stage: 'contemplation' },
    ],
    
    change_talk_reasons: [
      { id: 'con-reason-1', text: "Why would you want to change [behavior]?", category: 'change_talk_reasons', stage: 'contemplation' },
      { id: 'con-reason-2', text: "What would be the benefits of changing?", category: 'change_talk_reasons', stage: 'contemplation' },
      { id: 'con-reason-3', text: "What would changing mean for your life?", category: 'change_talk_reasons', stage: 'contemplation' },
      { id: 'con-reason-4', text: "How would your relationships improve if you changed?", category: 'change_talk_reasons', stage: 'contemplation' },
    ],
    
    change_talk_need: [
      { id: 'con-need-1', text: "How important is it for you to change this? On a scale of 1-10?", category: 'change_talk_need', stage: 'contemplation' },
      { id: 'con-need-2', text: "What makes it that important?", category: 'change_talk_need', stage: 'contemplation' },
      { id: 'con-need-3', text: "Why not lower?", category: 'change_talk_need', stage: 'contemplation' },
      { id: 'con-need-4', text: "How urgent does this feel?", category: 'change_talk_need', stage: 'contemplation' },
    ],
    
    looking_forward: [
      { id: 'con-fwd-1', text: "If you decided to change, what would be your first step?", category: 'looking_forward', stage: 'contemplation' },
      { id: 'con-fwd-2', text: "What would your life look like 6 months after changing?", category: 'looking_forward', stage: 'contemplation' },
      { id: 'con-fwd-3', text: "How would you feel about yourself if you made this change?", category: 'looking_forward', stage: 'contemplation' },
      { id: 'con-fwd-4', text: "What would become possible if you weren't doing [behavior]?", category: 'looking_forward', stage: 'contemplation' },
    ],
    
    closing: [
      { id: 'con-close-1', text: "What's one thing you learned about yourself today?", category: 'closing', stage: 'contemplation' },
      { id: 'con-close-2', text: "What are you taking away from our conversation?", category: 'closing', stage: 'contemplation' },
    ],
  },

  // ============================================
  // STAGE 3: PREPARATION
  // User has decided to change, ready to plan
  // Goal: Build specific action plan, confidence
  // ============================================
  preparation: {
    opening: [
      { id: 'prep-open-1', text: "How are you feeling about making this change?", category: 'opening', stage: 'preparation' },
      { id: 'prep-open-2', text: "What's your energy like today around this?", category: 'opening', stage: 'preparation' },
      { id: 'prep-open-3', text: "How ready are you feeling?", category: 'opening', stage: 'preparation' },
    ],
    
    commitment_strengthening: [
      { id: 'prep-commit-1', text: "What makes you ready to change now?", category: 'commitment_strengthening', stage: 'preparation' },
      { id: 'prep-commit-2', text: "What's your goal with [behavior]?", category: 'commitment_strengthening', stage: 'preparation' },
      { id: 'prep-commit-3', text: "What would success look like for you?", category: 'commitment_strengthening', stage: 'preparation' },
      { id: 'prep-commit-4', text: "How committed are you to changing this? On a scale of 1-10?", category: 'commitment_strengthening', stage: 'preparation' },
      { id: 'prep-commit-5', text: "What would increase your commitment?", category: 'commitment_strengthening', stage: 'preparation' },
    ],
    
    action_planning: [
      { id: 'prep-plan-1', text: "What's your first step?", category: 'action_planning', stage: 'preparation' },
      { id: 'prep-plan-2', text: "When will you take that first step?", category: 'action_planning', stage: 'preparation' },
      { id: 'prep-plan-3', text: "What will you do differently starting today?", category: 'action_planning', stage: 'preparation' },
      { id: 'prep-plan-4', text: "What specific behavior will you change?", category: 'action_planning', stage: 'preparation' },
      { id: 'prep-plan-5', text: "How will you know you're making progress?", category: 'action_planning', stage: 'preparation' },
    ],
    
    alternative_coping: [
      { id: 'prep-alt-1', text: "When the urge hits, what could you do instead?", category: 'alternative_coping', stage: 'preparation' },
      { id: 'prep-alt-2', text: "What healthy alternatives could meet the same need?", category: 'alternative_coping', stage: 'preparation' },
      { id: 'prep-alt-3', text: "What's worked for you before when you resisted the urge?", category: 'alternative_coping', stage: 'preparation' },
      { id: 'prep-alt-4', text: "Who could you reach out to instead of [behavior]?", category: 'alternative_coping', stage: 'preparation' },
      { id: 'prep-alt-5', text: "What activities help you cope with stress?", category: 'alternative_coping', stage: 'preparation' },
      { id: 'prep-alt-6', text: "If [behavior] wasn't an option, what would you try?", category: 'alternative_coping', stage: 'preparation' },
    ],
    
    support_system: [
      { id: 'prep-supp-1', text: "Who in your life could support this change?", category: 'support_system', stage: 'preparation' },
      { id: 'prep-supp-2', text: "Have you told anyone about your plan to change?", category: 'support_system', stage: 'preparation' },
      { id: 'prep-supp-3', text: "Who could you call when you're struggling?", category: 'support_system', stage: 'preparation' },
      { id: 'prep-supp-4', text: "What kind of support would be most helpful?", category: 'support_system', stage: 'preparation' },
    ],
    
    confidence_building: [
      { id: 'prep-conf-1', text: "On a scale of 1-10, how confident are you that you can change?", category: 'confidence_building', stage: 'preparation' },
      { id: 'prep-conf-2', text: "What makes you that confident?", category: 'confidence_building', stage: 'preparation' },
      { id: 'prep-conf-3', text: "Why not lower?", category: 'confidence_building', stage: 'preparation' },
      { id: 'prep-conf-4', text: "What would move you from a [X] to a [X+1]?", category: 'confidence_building', stage: 'preparation' },
      { id: 'prep-conf-5', text: "What strengths can you draw on?", category: 'confidence_building', stage: 'preparation' },
      { id: 'prep-conf-6', text: "What have you accomplished in the past that was hard?", category: 'confidence_building', stage: 'preparation' },
    ],
    
    barrier_identification: [
      { id: 'prep-barrier-1', text: "What might get in the way of your plan?", category: 'barrier_identification', stage: 'preparation' },
      { id: 'prep-barrier-2', text: "What situations would be most challenging?", category: 'barrier_identification', stage: 'preparation' },
      { id: 'prep-barrier-3', text: "When are you most vulnerable to [behavior]?", category: 'barrier_identification', stage: 'preparation' },
      { id: 'prep-barrier-4', text: "What obstacles do you anticipate?", category: 'barrier_identification', stage: 'preparation' },
      { id: 'prep-barrier-5', text: "What's your biggest concern about changing?", category: 'barrier_identification', stage: 'preparation' },
    ],
    
    problem_solving: [
      { id: 'prep-solve-1', text: "If [barrier] happens, what's your backup plan?", category: 'problem_solving', stage: 'preparation' },
      { id: 'prep-solve-2', text: "How could you handle [high-risk situation]?", category: 'problem_solving', stage: 'preparation' },
      { id: 'prep-solve-3', text: "What would you need to overcome [obstacle]?", category: 'problem_solving', stage: 'preparation' },
      { id: 'prep-solve-4', text: "If your first strategy doesn't work, what's plan B?", category: 'problem_solving', stage: 'preparation' },
    ],
    
    if_then_planning: [
      { id: 'prep-ifthen-1', text: "If you feel [trigger], then what will you do instead?", category: 'if_then_planning', stage: 'preparation' },
      { id: 'prep-ifthen-2', text: "If it's [high-risk time], then what's your plan?", category: 'if_then_planning', stage: 'preparation' },
      { id: 'prep-ifthen-3', text: "If the urge is really strong, what's your emergency plan?", category: 'if_then_planning', stage: 'preparation' },
      { id: 'prep-ifthen-4', text: "If you slip up, then what will you do next?", category: 'if_then_planning', stage: 'preparation' },
    ],
    
    closing: [
      { id: 'prep-close-1', text: "What's one thing you're committing to before we talk again?", category: 'closing', stage: 'preparation' },
      { id: 'prep-close-2', text: "How are you feeling about your plan?", category: 'closing', stage: 'preparation' },
    ],
  },

  // ============================================
  // STAGE 4: ACTION
  // User is actively changing behavior
  // Goal: Reinforce new behaviors, prevent relapse
  // ============================================
  action: {
    opening: [
      { id: 'act-open-1', text: "How are you feeling today?", category: 'opening', stage: 'action' },
      { id: 'act-open-2', text: "What's your stress level like right now?", category: 'opening', stage: 'action' },
      { id: 'act-open-3', text: "How have things been going since we last talked?", category: 'opening', stage: 'action' },
    ],
    
    behavioral_tracking: [
      { id: 'act-track-1', text: "Did you [behavior] today?", category: 'behavioral_tracking', stage: 'action' },
      { id: 'act-track-2', text: "How many days is it now since your last [behavior]?", category: 'behavioral_tracking', stage: 'action' },
      { id: 'act-track-3', text: "Did you feel the urge today?", category: 'behavioral_tracking', stage: 'action' },
      { id: 'act-track-4', text: "How strong was the urge, on a scale of 1-10?", category: 'behavioral_tracking', stage: 'action' },
      { id: 'act-track-5', text: "Did you act on the urge, or did you try something different?", category: 'behavioral_tracking', stage: 'action' },
    ],
    
    trigger_assessment: [
      { id: 'act-trig-1', text: "What triggered the urge today?", category: 'trigger_assessment', stage: 'action' },
      { id: 'act-trig-2', text: "What was happening right before you felt the urge?", category: 'trigger_assessment', stage: 'action' },
      { id: 'act-trig-3', text: "What emotions were you feeling?", category: 'trigger_assessment', stage: 'action' },
      { id: 'act-trig-4', text: "Where were you when the urge hit?", category: 'trigger_assessment', stage: 'action' },
      { id: 'act-trig-5', text: "What time of day was it?", category: 'trigger_assessment', stage: 'action' },
    ],
    
    coping_assessment: [
      { id: 'act-cope-1', text: "What did you do instead of [behavior]?", category: 'coping_assessment', stage: 'action' },
      { id: 'act-cope-2', text: "Did your plan work today?", category: 'coping_assessment', stage: 'action' },
      { id: 'act-cope-3', text: "What helped you resist the urge?", category: 'coping_assessment', stage: 'action' },
      { id: 'act-cope-4', text: "What coping strategy did you use?", category: 'coping_assessment', stage: 'action' },
      { id: 'act-cope-5', text: "How effective was that strategy, on a scale of 1-10?", category: 'coping_assessment', stage: 'action' },
      { id: 'act-cope-6', text: "What made it work this time?", category: 'coping_assessment', stage: 'action' },
      { id: 'act-cope-7', text: "What would you try differently next time?", category: 'coping_assessment', stage: 'action' },
    ],
    
    success_reinforcement: [
      { id: 'act-success-1', text: "How did it feel to choose differently?", category: 'success_reinforcement', stage: 'action' },
      { id: 'act-success-2', text: "What did you learn about yourself today?", category: 'success_reinforcement', stage: 'action' },
      { id: 'act-success-3', text: "How do you feel about your progress?", category: 'success_reinforcement', stage: 'action' },
      { id: 'act-success-4', text: "What are you most proud of today?", category: 'success_reinforcement', stage: 'action' },
      { id: 'act-success-5', text: "How is your life different now compared to when you started?", category: 'success_reinforcement', stage: 'action' },
      { id: 'act-success-6', text: "What's working well for you?", category: 'success_reinforcement', stage: 'action' },
    ],
    
    relapse_prevention: [
      { id: 'act-relapse-1', text: "What's your highest risk situation coming up?", category: 'relapse_prevention', stage: 'action' },
      { id: 'act-relapse-2', text: "What's your plan for [known trigger]?", category: 'relapse_prevention', stage: 'action' },
      { id: 'act-relapse-3', text: "When are you most vulnerable?", category: 'relapse_prevention', stage: 'action' },
      { id: 'act-relapse-4', text: "What warning signs tell you you're struggling?", category: 'relapse_prevention', stage: 'action' },
      { id: 'act-relapse-5', text: "What's your plan if the urge feels overwhelming?", category: 'relapse_prevention', stage: 'action' },
    ],
    
    setback_processing: [
      { id: 'act-setback-1', text: "What happened right before the setback?", category: 'setback_processing', stage: 'action' },
      { id: 'act-setback-2', text: "What can you learn from this?", category: 'setback_processing', stage: 'action' },
      { id: 'act-setback-3', text: "What would you do differently next time?", category: 'setback_processing', stage: 'action' },
      { id: 'act-setback-4', text: "How can you get back on track?", category: 'setback_processing', stage: 'action' },
      { id: 'act-setback-5', text: "What does this setback teach you about your triggers?", category: 'setback_processing', stage: 'action' },
    ],
    
    closing: [
      { id: 'act-close-1', text: "What's one thing you're taking away from today?", category: 'closing', stage: 'action' },
      { id: 'act-close-2', text: "What's your focus for tomorrow?", category: 'closing', stage: 'action' },
    ],
  },

  // ============================================
  // STAGE 5: MAINTENANCE
  // User has sustained change for 6+ months
  // Goal: Consolidate gains, prevent relapse
  // ============================================
  maintenance: {
    opening: [
      { id: 'maint-open-1', text: "How are you doing today?", category: 'opening', stage: 'maintenance' },
      { id: 'maint-open-2', text: "How are things going with your progress?", category: 'opening', stage: 'maintenance' },
      { id: 'maint-open-3', text: "What's been on your mind lately?", category: 'opening', stage: 'maintenance' },
    ],
    
    progress_review: [
      { id: 'maint-prog-1', text: "How far have you come since you started?", category: 'progress_review', stage: 'maintenance' },
      { id: 'maint-prog-2', text: "What's different about your life now?", category: 'progress_review', stage: 'maintenance' },
      { id: 'maint-prog-3', text: "How do you feel about the changes you've made?", category: 'progress_review', stage: 'maintenance' },
      { id: 'maint-prog-4', text: "What are you most proud of in this journey?", category: 'progress_review', stage: 'maintenance' },
    ],
    
    identity_integration: [
      { id: 'maint-id-1', text: "How do you see yourself differently now?", category: 'identity_integration', stage: 'maintenance' },
      { id: 'maint-id-2', text: "What's different about who you are compared to when you started?", category: 'identity_integration', stage: 'maintenance' },
      { id: 'maint-id-3', text: "How has this change affected how you think about yourself?", category: 'identity_integration', stage: 'maintenance' },
      { id: 'maint-id-4', text: "What does this change mean for your identity?", category: 'identity_integration', stage: 'maintenance' },
    ],
    
    sustained_vigilance: [
      { id: 'maint-vig-1', text: "What keeps you on track now?", category: 'sustained_vigilance', stage: 'maintenance' },
      { id: 'maint-vig-2', text: "What's your plan if you face major stress?", category: 'sustained_vigilance', stage: 'maintenance' },
      { id: 'maint-vig-3', text: "What triggers still show up occasionally?", category: 'sustained_vigilance', stage: 'maintenance' },
      { id: 'maint-vig-4', text: "How do you handle moments of temptation now?", category: 'sustained_vigilance', stage: 'maintenance' },
      { id: 'maint-vig-5', text: "What would you do if [major trigger] happened?", category: 'sustained_vigilance', stage: 'maintenance' },
    ],
    
    lifestyle_integration: [
      { id: 'maint-life-1', text: "How have your relationships changed?", category: 'lifestyle_integration', stage: 'maintenance' },
      { id: 'maint-life-2', text: "What new habits have you built?", category: 'lifestyle_integration', stage: 'maintenance' },
      { id: 'maint-life-3', text: "What do you do now when you're stressed?", category: 'lifestyle_integration', stage: 'maintenance' },
      { id: 'maint-life-4', text: "How do you spend the time you used to spend on [behavior]?", category: 'lifestyle_integration', stage: 'maintenance' },
      { id: 'maint-life-5', text: "What healthy coping strategies are part of your routine now?", category: 'lifestyle_integration', stage: 'maintenance' },
    ],
    
    helping_others: [
      { id: 'maint-help-1', text: "What would you tell someone just starting this journey?", category: 'helping_others', stage: 'maintenance' },
      { id: 'maint-help-2', text: "What advice would you give to your past self?", category: 'helping_others', stage: 'maintenance' },
      { id: 'maint-help-3', text: "What's the most important thing you learned?", category: 'helping_others', stage: 'maintenance' },
      { id: 'maint-help-4', text: "What do you wish you'd known at the beginning?", category: 'helping_others', stage: 'maintenance' },
    ],
    
    continued_growth: [
      { id: 'maint-growth-1', text: "What are you working on now?", category: 'continued_growth', stage: 'maintenance' },
      { id: 'maint-growth-2', text: "What's your next area of growth?", category: 'continued_growth', stage: 'maintenance' },
      { id: 'maint-growth-3', text: "What other patterns have you noticed about yourself?", category: 'continued_growth', stage: 'maintenance' },
      { id: 'maint-growth-4', text: "Where do you want to go from here?", category: 'continued_growth', stage: 'maintenance' },
    ],
    
    closing: [
      { id: 'maint-close-1', text: "What are you grateful for in this process?", category: 'closing', stage: 'maintenance' },
      { id: 'maint-close-2', text: "What do you want to acknowledge about yourself?", category: 'closing', stage: 'maintenance' },
    ],
  },
}

// Crisis detection keywords
export const crisisKeywords = [
  'want to die',
  'kill myself',
  'end it all',
  'better off without me',
  'no point in living',
  'hurt myself',
  'self-harm',
  'suicide',
  'suicidal',
  'can\'t go on',
  'give up on life',
  'not worth living',
]

// Netherlands-specific crisis resources
export const crisisResources = {
  netherlands: {
    emergency: '112',
    crisisLine: '113 Zelfmoordpreventie (0900-0113)',
    crisisLineUrl: 'https://www.113.nl',
    chatSupport: 'Chat via 113.nl',
    textLine: 'Chat beschikbaar op 113.nl',
  },
  international: {
    emergency: '112 (EU) or 911 (US)',
    crisisLine: 'International Association for Suicide Prevention: https://www.iasp.info/resources/Crisis_Centres/',
  }
}

// Helper to get random questions from a category
export function getQuestionsFromCategory(
  stage: Stage, 
  category: string, 
  count: number = 1,
  excludeIds: string[] = []
): Question[] {
  const questions = questionDatabase[stage][category] || []
  const available = questions.filter(q => !excludeIds.includes(q.id))
  
  // Shuffle and take count
  const shuffled = available.sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

// Get all categories for a stage
export function getCategoriesForStage(stage: Stage): string[] {
  return Object.keys(questionDatabase[stage])
}
