-- ============================================================
-- SEEN Phase 2: Seed exercise library
-- 2-3 exercises per category, 20 total
-- All content is ORIGINAL. Methodology is internal-only.
-- ============================================================

-- Category 1: Awareness & pattern logging (CBT-informed)
INSERT INTO exercises (title, description, instructions, theme_id, category, exercise_type, duration_minutes, pattern_relevance, methodology, display_order, is_active)
VALUES
(
  'Thought Awareness Journal',
  'Notice what your mind does when stress shows up. Write down the situation, the thought, and how it made you feel.',
  '{"intro": "When we are stressed, our minds often react automatically. This exercise helps you slow down and observe what is actually happening inside.", "steps": [{"order": 1, "text": "Think of a recent moment when you felt stressed, anxious, or emotionally reactive. It does not need to be dramatic — even small moments count.", "type": "instruction"}, {"order": 2, "text": "Describe the situation briefly. What was happening? Where were you? Who was involved?", "type": "prompt"}, {"order": 3, "text": "What thought went through your mind in that moment? Try to capture the exact words.", "type": "prompt"}, {"order": 4, "text": "What emotion did you feel? Name it as precisely as you can — not just angry or sad, but perhaps overlooked, dismissed, or overwhelmed.", "type": "prompt"}, {"order": 5, "text": "Looking at this thought now, does it feel like fact or interpretation? You do not need to change it — just notice.", "type": "reflection"}], "closing": "You have just practiced observing your own thought patterns. Over time, this awareness creates a small gap between the trigger and your response — and that gap is where change happens."}',
  (SELECT id FROM practice_themes WHERE name = 'Awareness & pattern logging'),
  'awareness', 'journaling', 10,
  ARRAY['approval_chasing', 'withdrawal_avoidance', 'achievement_hiding'],
  'CBT', 1, true
),
(
  'Trigger Chain Mapping',
  'Trace the path from a trigger to a behavior. See how one thing leads to another — and where you might have choices.',
  '{"intro": "Our patterns follow a chain: something happens, we feel something, an urge appears, and we act. Mapping this chain helps us see the links we usually miss.", "steps": [{"order": 1, "text": "Choose a recent moment where you fell into an old pattern — something you did that you later wished you had not.", "type": "instruction"}, {"order": 2, "text": "What triggered it? What happened just before the urge appeared?", "type": "prompt"}, {"order": 3, "text": "What emotion came up? Where did you feel it in your body?", "type": "prompt"}, {"order": 4, "text": "What was the urge? What did you want to do?", "type": "prompt"}, {"order": 5, "text": "What did you actually do? What was the behavior?", "type": "prompt"}, {"order": 6, "text": "What happened next? How did you feel afterward?", "type": "prompt"}, {"order": 7, "text": "Looking at this chain now, is there a link where you might have made a different choice? You do not need to know what — just notice where.", "type": "reflection"}], "closing": "Every chain has links. You cannot always control the trigger or the emotion, but noticing the urge before acting on it is a powerful skill."}',
  (SELECT id FROM practice_themes WHERE name = 'Awareness & pattern logging'),
  'awareness', 'reflection', 12,
  ARRAY['substance_soothing', 'compulsive_spending', 'intimacy_seeking'],
  'CBT', 2, true
),

-- Category 2: Mindfulness & grounding (MBSR-informed)
(
  'Arriving in the Present',
  'A short breath-focused exercise to bring you out of your head and into the here and now.',
  '{"intro": "When stress pulls us into the future or the past, the breath is always available as an anchor to the present moment.", "steps": [{"order": 1, "text": "Find a comfortable position. You can sit or stand — whatever feels right. Let your eyes close or soften your gaze.", "type": "instruction"}, {"order": 2, "text": "Take three slow breaths. Do not try to control them — just notice the air moving in and out.", "type": "instruction", "duration_minutes": 1}, {"order": 3, "text": "Now bring your attention to where you feel the breath most clearly. It might be your nostrils, your chest, or your belly. Rest your attention there.", "type": "instruction", "duration_minutes": 2}, {"order": 4, "text": "Your mind will wander. That is completely normal. When you notice it has wandered, gently bring your attention back to the breath. No judgment.", "type": "instruction", "duration_minutes": 3}, {"order": 5, "text": "Take one final deep breath. Open your eyes. Notice how you feel right now compared to when you started.", "type": "reflection"}], "closing": "Even a few minutes of this practice can shift how you relate to whatever is happening. The goal is not to empty your mind — it is to be present with it."}',
  (SELECT id FROM practice_themes WHERE name = 'Mindfulness & grounding'),
  'mindfulness', 'grounding', 7,
  ARRAY['substance_soothing', 'withdrawal_avoidance'],
  'MBSR', 3, true
),
(
  'Five Senses Check-in',
  'Ground yourself by noticing what is around you right now — through sight, sound, touch, smell, and taste.',
  '{"intro": "When you feel overwhelmed or disconnected, your senses can bring you back. This exercise takes you through each one.", "steps": [{"order": 1, "text": "Pause and look around. Name five things you can see right now. Say them quietly to yourself.", "type": "prompt"}, {"order": 2, "text": "Now listen. Name four things you can hear — even subtle sounds like the hum of a room or your own breathing.", "type": "prompt"}, {"order": 3, "text": "Notice three things you can physically feel right now. The texture of your clothes, the temperature of the air, your feet on the ground.", "type": "prompt"}, {"order": 4, "text": "Identify two things you can smell. If nothing is obvious, move closer to something — your sleeve, a cup, the air outside.", "type": "prompt"}, {"order": 5, "text": "Finally, notice one thing you can taste. Even if it is just the inside of your mouth.", "type": "prompt"}, {"order": 6, "text": "Take a breath. You are here. How does it feel to be in this moment right now?", "type": "reflection"}], "closing": "You just moved your attention from wherever it was stuck and placed it firmly in the present. You can do this anywhere, any time."}',
  (SELECT id FROM practice_themes WHERE name = 'Mindfulness & grounding'),
  'mindfulness', 'grounding', 5,
  ARRAY['substance_soothing', 'compulsive_spending', 'withdrawal_avoidance'],
  'MBSR', 4, true
),

-- Category 3: Defusion & acceptance (ACT-informed)
(
  'Noticing Your Thoughts',
  'Practice seeing your thoughts as events in your mind — not as facts you have to believe or act on.',
  '{"intro": "We often treat our thoughts as truth. This exercise helps you step back and observe them with a bit of distance.", "steps": [{"order": 1, "text": "Bring to mind a thought that has been bothering you recently. Something your mind keeps returning to.", "type": "instruction"}, {"order": 2, "text": "Now say to yourself: I notice I am having the thought that... and add the thought. For example: I notice I am having the thought that I am not good enough.", "type": "prompt"}, {"order": 3, "text": "Say it again, but this time add: My mind is telling me that... For example: My mind is telling me that I am not good enough.", "type": "prompt"}, {"order": 4, "text": "Notice what happens. Does the thought feel different when you frame it this way? You do not need to change it — just observe.", "type": "reflection", "duration_minutes": 1}, {"order": 5, "text": "Try this with one or two more thoughts that have been on your mind. Just practice the framing.", "type": "prompt"}], "closing": "You are not your thoughts. You are the one noticing them. This small shift — from being inside a thought to observing it — can change how much power it has over you."}',
  (SELECT id FROM practice_themes WHERE name = 'Defusion & acceptance'),
  'defusion', 'reflection', 8,
  ARRAY['approval_chasing', 'achievement_hiding'],
  'ACT', 5, true
),
(
  'Sitting with Discomfort',
  'Practice making space for a difficult feeling without trying to push it away or fix it.',
  '{"intro": "Our instinct with uncomfortable feelings is to avoid them, numb them, or push them away. This exercise is about doing something different — making room.", "steps": [{"order": 1, "text": "Think of something that has been causing you emotional discomfort. Not the most overwhelming thing — something manageable.", "type": "instruction"}, {"order": 2, "text": "Where do you feel it in your body? Your chest, stomach, throat, shoulders? Place your attention there.", "type": "prompt"}, {"order": 3, "text": "Describe the physical sensation. Is it tight, heavy, hot, sharp, dull? Give it shape and texture if you can.", "type": "prompt"}, {"order": 4, "text": "Now, instead of trying to make it go away, imagine breathing into that area. Not to fix it — just to give it some space.", "type": "instruction", "duration_minutes": 2}, {"order": 5, "text": "If you notice an urge to distract yourself or shut this down, just name it: There is the urge to escape. Then come back to the feeling.", "type": "instruction"}, {"order": 6, "text": "What do you notice? Has the feeling changed at all? Or has your relationship to it shifted?", "type": "reflection"}], "closing": "Making room for discomfort is not the same as enjoying it. It is about learning that you can feel something difficult without it breaking you — and without needing to run from it."}',
  (SELECT id FROM practice_themes WHERE name = 'Defusion & acceptance'),
  'defusion', 'grounding', 10,
  ARRAY['substance_soothing', 'intimacy_seeking', 'compulsive_spending'],
  'ACT', 6, true
),

-- Category 4: Values & direction (ACT-informed)
(
  'What Matters Most',
  'Clarify your values — the qualities you want to bring to your life, regardless of what is happening around you.',
  '{"intro": "Values are not goals you achieve — they are directions you move toward. This exercise helps you get clearer about what yours are.", "steps": [{"order": 1, "text": "Imagine you are at a gathering where the people who matter most to you are describing the kind of person you are. What would you want them to say?", "type": "prompt"}, {"order": 2, "text": "From that image, what qualities stand out? Examples might be: honest, present, courageous, kind, reliable, creative.", "type": "prompt"}, {"order": 3, "text": "Pick the two or three that feel most important to you right now. Not what you think you should value — what actually resonates.", "type": "prompt"}, {"order": 4, "text": "For each one, think of a small moment this week where you lived that value, even briefly. It does not need to be big.", "type": "prompt"}, {"order": 5, "text": "Now think of a moment where you moved away from that value. What pulled you off course?", "type": "reflection"}, {"order": 6, "text": "What is one small thing you could do tomorrow that would be a step toward one of these values?", "type": "prompt"}], "closing": "Values are a compass, not a destination. Even when you drift, you can always turn back toward them. The turning is the practice."}',
  (SELECT id FROM practice_themes WHERE name = 'Values & direction'),
  'values', 'reflection', 12,
  ARRAY['approval_chasing', 'achievement_hiding', 'withdrawal_avoidance'],
  'ACT', 7, true
),
(
  'Choice Point',
  'When you feel an urge, pause and notice: which direction am I about to move — toward or away from what I care about?',
  '{"intro": "Between a trigger and a response, there is a moment of choice. This exercise helps you find that moment and use it.", "steps": [{"order": 1, "text": "Think of a situation coming up this week where you might face a familiar urge or pattern.", "type": "prompt"}, {"order": 2, "text": "What is the urge likely to be? What will your autopilot want to do?", "type": "prompt"}, {"order": 3, "text": "If you follow that urge, where does it take you? What happens in the minutes, hours, or days after?", "type": "prompt"}, {"order": 4, "text": "Now imagine a different response — one that moves you toward something you care about. What would that look like?", "type": "prompt"}, {"order": 5, "text": "What might make it hard to choose that direction? What could help?", "type": "reflection"}], "closing": "You do not need to be perfect at this. You just need to notice the choice point. Every time you pause and notice, you are building a new skill — even if you still go with the old pattern sometimes."}',
  (SELECT id FROM practice_themes WHERE name = 'Values & direction'),
  'values', 'behavioral', 8,
  ARRAY['substance_soothing', 'compulsive_spending', 'intimacy_seeking'],
  'ACT', 8, true
),

-- Category 5: Emotion regulation (DBT-informed)
(
  'Name It to Tame It',
  'Practice naming your emotions with precision. The more accurately you can name a feeling, the less overwhelming it becomes.',
  '{"intro": "Research shows that putting a precise name on what you feel actually reduces its intensity. This exercise builds that skill.", "steps": [{"order": 1, "text": "Check in with yourself right now. How are you feeling? Start with whatever word comes first.", "type": "prompt"}, {"order": 2, "text": "Now try to be more specific. If you said anxious, is it more like nervous, uneasy, apprehensive, or dread? If you said sad, is it more like disappointed, lonely, grieving, or empty?", "type": "prompt"}, {"order": 3, "text": "Rate the intensity from 1 to 10. How strong is this feeling right now?", "type": "prompt"}, {"order": 4, "text": "Where do you feel it in your body? Point your attention there without trying to change anything.", "type": "prompt"}, {"order": 5, "text": "Has the feeling shifted at all since you started naming it? What do you notice?", "type": "reflection"}], "closing": "Emotions are information, not instructions. Naming them precisely helps you respond rather than react. The feeling is still there — but you are relating to it differently."}',
  (SELECT id FROM practice_themes WHERE name = 'Emotion regulation'),
  'emotion_regulation', 'reflection', 7,
  ARRAY['substance_soothing', 'withdrawal_avoidance', 'intimacy_seeking'],
  'DBT', 9, true
),
(
  'Self-Soothing with Senses',
  'Use your five senses to calm your nervous system when emotions feel overwhelming.',
  '{"intro": "When emotions are running high, your body needs calming signals. Your senses are the fastest way to send them.", "steps": [{"order": 1, "text": "Sight: Look at something that feels calming or beautiful. It could be a photo, a view from a window, or even a color you like. Spend a moment really looking at it.", "type": "instruction", "duration_minutes": 1}, {"order": 2, "text": "Sound: Put on a piece of music, listen to nature sounds, or just listen to the ambient sounds around you. Let the sound wash over you.", "type": "instruction", "duration_minutes": 1}, {"order": 3, "text": "Touch: Hold something with an interesting texture — a soft blanket, a smooth stone, or run your hands under warm water. Focus on the sensation.", "type": "instruction", "duration_minutes": 1}, {"order": 4, "text": "Smell: Smell something pleasant — coffee, soap, fresh air, a candle. Breathe it in slowly.", "type": "instruction", "duration_minutes": 1}, {"order": 5, "text": "Taste: Take a small sip of something or eat something slowly. Notice the flavor, temperature, and texture.", "type": "instruction", "duration_minutes": 1}, {"order": 6, "text": "How do you feel now compared to when you started? Which sense was most effective for you?", "type": "reflection"}], "closing": "Self-soothing is not avoidance — it is giving your nervous system what it needs so you can think clearly again. Knowing which senses work best for you is a tool you can use any time."}',
  (SELECT id FROM practice_themes WHERE name = 'Emotion regulation'),
  'emotion_regulation', 'grounding', 8,
  ARRAY['substance_soothing', 'compulsive_spending'],
  'DBT', 10, true
),

-- Category 6: Behavioral experiments (CBT-informed)
(
  'Testing an Assumption',
  'Pick a belief you hold about yourself or others, and design a small experiment to see if it is actually true.',
  '{"intro": "We all carry assumptions that feel like facts. This exercise helps you test one of them — gently and curiously.", "steps": [{"order": 1, "text": "What is something you believe about yourself or about how others see you? For example: If I say no, people will be angry. Or: I cannot handle difficult conversations.", "type": "prompt"}, {"order": 2, "text": "How sure are you this is true? Rate your belief from 0 to 100 percent.", "type": "prompt"}, {"order": 3, "text": "What would a small, safe experiment look like to test this? Something you could try this week. For example: Say no to one small request and observe what actually happens.", "type": "prompt"}, {"order": 4, "text": "What do you predict will happen if you run this experiment?", "type": "prompt"}, {"order": 5, "text": "What would you need to pay attention to in order to know whether your prediction was accurate?", "type": "prompt"}, {"order": 6, "text": "Are you willing to try this experiment before your next session? What might get in the way?", "type": "reflection"}], "closing": "Behavioral experiments are not about proving yourself wrong. They are about gathering real data instead of relying on assumptions. Whatever happens, you learn something."}',
  (SELECT id FROM practice_themes WHERE name = 'Behavioral experiments'),
  'behavioral', 'behavioral', 10,
  ARRAY['approval_chasing', 'withdrawal_avoidance', 'achievement_hiding'],
  'CBT', 11, true
),
(
  'Trying a Different Response',
  'Identify a situation where you usually react on autopilot, and plan an alternative response to try.',
  '{"intro": "Patterns feel automatic, but they are not inevitable. This exercise helps you plan a different response — before the moment arrives.", "steps": [{"order": 1, "text": "Think of a recurring situation where you tend to react in a way you later regret. Describe it briefly.", "type": "prompt"}, {"order": 2, "text": "What is your usual response? Be specific about what you do, not just how you feel.", "type": "prompt"}, {"order": 3, "text": "What would a different response look like? Not the perfect response — just a different one.", "type": "prompt"}, {"order": 4, "text": "Imagine yourself in that situation, using the different response. Walk through it in your mind. What happens?", "type": "instruction", "duration_minutes": 1}, {"order": 5, "text": "What might make it hard to use the different response in the real moment? What could help you remember?", "type": "reflection"}], "closing": "You do not need to get it right every time. Even attempting a different response — and noticing what happens — is building a new pathway."}',
  (SELECT id FROM practice_themes WHERE name = 'Behavioral experiments'),
  'behavioral', 'behavioral', 8,
  ARRAY['intimacy_seeking', 'substance_soothing', 'compulsive_spending'],
  'CBT', 12, true
),

-- Category 7: Reflection & journaling (Cross-model)
(
  'Session Unpacking',
  'Process what came up in your therapy session while it is still fresh. Capture insights before they fade.',
  '{"intro": "The window right after a therapy session is valuable. Thoughts and feelings are close to the surface. This exercise helps you capture them.", "steps": [{"order": 1, "text": "What is the one thing from today''s session that stuck with you most? The moment, phrase, or realization that stands out.", "type": "prompt"}, {"order": 2, "text": "How did that make you feel? Not how you think you should feel — how you actually feel right now.", "type": "prompt"}, {"order": 3, "text": "Was there anything that surprised you? Something you had not thought about before, or saw from a new angle?", "type": "prompt"}, {"order": 4, "text": "Is there something you want to remember from today? Write it down in your own words.", "type": "prompt"}, {"order": 5, "text": "What feels unfinished? Is there something you want to come back to next session?", "type": "reflection"}], "closing": "Insights from therapy can fade quickly. Writing them down — even briefly — helps them stick. You can look back at these notes before your next session."}',
  (SELECT id FROM practice_themes WHERE name = 'Reflection & journaling'),
  'reflection', 'journaling', 10,
  ARRAY['approval_chasing', 'withdrawal_avoidance', 'achievement_hiding', 'substance_soothing', 'compulsive_spending', 'intimacy_seeking'],
  'cross-model', 13, true
),
(
  'Progress Check',
  'Pause and look at how far you have come. It is easy to forget progress when you are focused on what is still hard.',
  '{"intro": "Growth is rarely dramatic. It happens in small shifts that are easy to miss. This exercise helps you see them.", "steps": [{"order": 1, "text": "Think back to when you first started therapy — or to the version of yourself from a few months ago. What was different then?", "type": "prompt"}, {"order": 2, "text": "What is something you handle differently now, even slightly? A situation, a relationship, a thought pattern.", "type": "prompt"}, {"order": 3, "text": "What have you learned about yourself that you did not know before?", "type": "prompt"}, {"order": 4, "text": "What is still hard? Name it honestly — not to judge yourself, but to acknowledge that it takes time.", "type": "prompt"}, {"order": 5, "text": "If a friend described this same progress to you, what would you say to them?", "type": "reflection"}], "closing": "Progress is not a straight line. Recognizing where you have grown — even while acknowledging what is still difficult — is an important part of the work."}',
  (SELECT id FROM practice_themes WHERE name = 'Reflection & journaling'),
  'reflection', 'journaling', 8,
  ARRAY['approval_chasing', 'achievement_hiding', 'withdrawal_avoidance'],
  'cross-model', 14, true
),
(
  'Letter to Yourself',
  'Write a short, honest letter to yourself — with the compassion you would offer a friend.',
  '{"intro": "We are often harder on ourselves than we would ever be on someone we care about. This exercise is about directing some of that kindness inward.", "steps": [{"order": 1, "text": "Imagine a close friend came to you with exactly the struggles you are dealing with right now. What would you say to them?", "type": "prompt"}, {"order": 2, "text": "Now write a few sentences to yourself, using that same tone. Start with: Dear me...", "type": "prompt"}, {"order": 3, "text": "Include something you want to acknowledge — something you have been carrying, trying, or enduring.", "type": "prompt"}, {"order": 4, "text": "Include something you want to remind yourself of — a truth that is easy to forget when things are hard.", "type": "prompt"}, {"order": 5, "text": "Read it back to yourself. How does it feel to receive these words?", "type": "reflection"}], "closing": "Self-compassion is not self-indulgence. It is the foundation that makes real change possible. You can come back to this letter whenever you need it."}',
  (SELECT id FROM practice_themes WHERE name = 'Reflection & journaling'),
  'reflection', 'journaling', 10,
  ARRAY['approval_chasing', 'achievement_hiding'],
  'cross-model', 15, true
),

-- Category 8: Self-assessment & mapping (Recovery-informed)
(
  'Three Circles',
  'Map your behaviors into three zones: what to stop, what to be careful with, and what to build more of.',
  '{"intro": "This exercise helps you get clear about your own boundaries by sorting behaviors into three circles — not by what anyone else thinks, but by what you know about yourself.", "steps": [{"order": 1, "text": "Inner circle (stop): What are the behaviors you want to stop? These are the ones that cause real harm — to you or to others. Be specific and honest.", "type": "prompt"}, {"order": 2, "text": "Middle circle (boundary): What are the behaviors that are risky for you? They are not harmful on their own, but they can lead you toward your inner circle if you are not careful.", "type": "prompt"}, {"order": 3, "text": "Outer circle (build): What are the healthy behaviors, relationships, and activities you want more of in your life? The things that help you feel grounded and whole.", "type": "prompt"}, {"order": 4, "text": "Look at your three circles. Does anything surprise you? Is there something in one circle that maybe belongs in another?", "type": "reflection"}, {"order": 5, "text": "Pick one thing from your outer circle. What is one small step you could take this week to do more of it?", "type": "prompt"}], "closing": "These circles are not fixed. They change as you change. The point is not perfection — it is clarity about where you stand right now."}',
  (SELECT id FROM practice_themes WHERE name = 'Self-assessment & mapping'),
  'self_assessment', 'mapping', 15,
  ARRAY['substance_soothing', 'compulsive_spending', 'intimacy_seeking'],
  '12-step', 16, true
),
(
  'Where Am I Now?',
  'Take a step back and assess where you are in your own journey. Not where you should be — where you actually are.',
  '{"intro": "It is easy to lose perspective when you are in the middle of the work. This exercise creates a moment of honest self-assessment.", "steps": [{"order": 1, "text": "On a scale of 1 to 10, how would you rate your overall wellbeing right now? Go with your gut.", "type": "prompt"}, {"order": 2, "text": "What is contributing to that number being as high as it is? What is going well?", "type": "prompt"}, {"order": 3, "text": "What is keeping it from being higher? What is weighing on you?", "type": "prompt"}, {"order": 4, "text": "What would it take to move one point higher? Not to a 10 — just one step up from where you are.", "type": "prompt"}, {"order": 5, "text": "Is there something you need right now that you have not asked for — from yourself or from someone else?", "type": "reflection"}], "closing": "Honest self-assessment is not about judgment. It is about knowing where you stand so you can make choices from that reality — not from where you think you should be."}',
  (SELECT id FROM practice_themes WHERE name = 'Self-assessment & mapping'),
  'self_assessment', 'reflection', 8,
  ARRAY['withdrawal_avoidance', 'achievement_hiding', 'approval_chasing'],
  '12-step', 17, true
);

-- Mark Three Circles as an onboarding exercise
UPDATE exercises SET is_onboarding = true WHERE title = 'Three Circles';
