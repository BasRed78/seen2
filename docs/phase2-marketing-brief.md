# Seen Phase 2: Practice — Marketing Brief

A comprehensive overview of Seen's Phase 2 for use in marketing work. Covers what has been built, what is in progress, and the user experience that ties it together.

---

## The one-line pitch

**Seen Phase 2 is a therapy companion that supports the 167 hours between therapy sessions, so the work your therapist does with you actually sticks.**

---

## Who it is for

People who are currently in therapy. Not a replacement for therapy, not a way to start therapy — a tool for the person who already has a therapist and wants to get more out of the process.

---

## The problem

Therapy happens for roughly one hour a week. The remaining 167 hours are where change is actually supposed to take hold, and it is exactly those 167 hours where people get stuck.

- The insight from Monday's session fades by Wednesday.
- The homework doesn't happen. Life takes over.
- You walk into the next session and can't remember what felt so important.
- Therapists see it constantly: compliance problems with between-session work happen in over half of cases (Helbig & Fehm, 2004).

No existing product solves this. Meditation apps (Calm, Headspace) give generic content disconnected from your therapy. Online therapy platforms (BetterHelp, Talkspace) replace the therapist — redundant if you already have one. CBT chatbots (Woebot, Wysa) use pre-scripted exercises with no memory of your story or your therapist's approach.

Phase 2 is the first product designed to slot in next to a real therapy relationship and amplify it.

---

## The user experience: a week in Sarah's life

Sarah is in therapy working on boundaries. Here is what Phase 2 looks like for her across a typical week.

### Monday evening, right after her session

Sarah opens Seen and taps **I had a session**. A six-step flow walks her through:

1. **How are you feeling right now?** — rate 1 to 10
2. **What came up?** — pick the themes from her session (Boundaries, Self-worth)
3. **What stood out most?** — a free-text reflection, with voice input if she prefers talking
4. **Something to practice this week?** — an intention ("Say no to one request this week without explaining why"), with a target date
5. **Exercises to practice** — a shortlist matched to her session themes (Setting a boundary, Values check-in) plus the option to browse the full library or add something custom. She picks two, schedules each into her calendar, and hits Add to calendar which downloads an .ics file that imports into Google, Apple, or Outlook.
6. **Review** — a single-screen summary she can save.

Two minutes. Everything captured while it was fresh.

### Tuesday through Friday, daily

Each day Sarah gets a check-in conversation with the Seen AI. It is not a generic wellness chat. It knows her:

- That she reflected on boundaries after her last session
- That her active intention is to say no to one request
- That she has Setting a boundary scheduled for Wednesday at 9 AM
- That she completed Values check-in on Thursday and rated it 4 stars

So the AI asks specifically: "You mentioned wanting to practice saying no. Was this conversation related?" When Sarah says yes and describes the moment, the AI reflects it back and — crucially — suggests she bring it to her therapist: "The fear was bigger than the actual consequence. That might be worth bringing up with your therapist."

This is the core intelligence: a daily conversation that carries forward context from her therapy, not a pre-scripted chatbot.

### Wednesday morning, 8:45 AM

Sarah opens the app. On her Practice Home, the Setting a boundary exercise has a gold "Soon" badge and a prominent gold **Start now** button. She taps it. A guided flow walks her through four steps alternating between guidance ("Think of a recent situation where you said yes when you wanted to say no") and reflection prompts. At the end she rates the exercise and writes a short reflection. The scheduled row is automatically marked complete. She is back on her home screen fifteen minutes later.

### Sunday evening, prepping for her next session

Sarah taps **Prepare for session** on her home. A single scrollable page:

- **Since your last session: 5 days ago** — stat tiles showing 4 check-ins, 3 exercises completed, 1 of 2 intentions done
- **What came up last time** — her session themes and the reflection she wrote
- **Practice intention** — with a note about how many times she actually tried it
- **What you practiced** — each completed exercise with her star rating and the reflection she wrote after doing it
- **Notes to bring up** — a text area for anything she wants to raise, saved on her device

Sarah scans it in three minutes and walks into her Monday session with the week's standouts in mind.

---

## Full feature map

### Built and live today

**Entry and onboarding**
- Quiz includes a therapy question that routes users already in therapy directly into Phase 2
- Phase activation from onboarding preserves quiz context

**Daily AI check-ins**
- Phase-aware system prompt that knows the user is in Phase 2
- Pulls in recent exercise completions, active intentions, recent post-session reflections, available exercise library, completed exercises
- Five opening variations including intention check-in and therapy reflection follow-up
- Recognises when to suggest exercises from the user's matched library
- Recognises when to nudge the user to bring something to their therapist
- Tightened boundaries: no diagnosis, no clinical advice, no "I recommend" or "based on what you are describing" type phrasing
- Voice input throughout
- Automatic insight extraction from the conversation

**Post-session reflection flow**
- Six steps, two to three minutes
- Emotional state, themes, free reflection, practice intention, exercise selection, scheduling, review
- Voice input on free-text fields
- Writes to the database and into the AI's context for subsequent check-ins

**Exercise library**
- 17 seeded exercises across eight categories: Mindfulness and grounding, Defusion and acceptance, Values and direction, Emotion regulation, Behavioural experiments, Reflection and journaling, Self-assessment and mapping, Awareness and pattern logging
- Grounded in CBT, ACT, DBT, MBSR, and 12-step methodologies
- Each exercise has structured instructions with intro, step-by-step guidance, prompts, and closing
- Browseable by category or theme

**Guided exercise flow**
- Intro screen with duration and step count
- Step-by-step navigation with type labels (Guide, Reflect, Journal, Pause)
- Optional reflection input at each step
- Progress bar
- Completion screen with star rating and post-exercise reflection
- Voice input for reflections

**Calendar scheduling and integration**
- Exercise scheduling built into the post-session flow
- Downloads .ics files that work with Google, Apple, and Outlook calendars
- Saves internal records so the app can nudge the user in-app too

**Practice Home dashboard**
- Time-of-day greeting
- Daily check-in CTA
- Prepare for session CTA
- Large "I had a session" post-session entry point
- Active practice intentions with target dates
- Upcoming scheduled exercises with "Soon" badge if within one hour
- Prominent Start now button (gold for approaching exercises) and secondary Mark done for offline completion
- Recommended exercises matched to user themes
- Progress summary with link to deeper insights
- Clinical disclaimer

**Scheduled exercise bridge**
- Tap Start now on the home card to launch the guided exercise with scheduling context
- Completing the exercise automatically closes the scheduled row
- Returns user to home to see the item cleared

**Session prep page**
- Scoped intelligently: "since your last post-session reflection" with a 14-day fallback
- Hero card with stat tiles (check-ins, exercises, intentions)
- Last session themes and reflection
- Active and completed intentions side by side
- Every completed exercise with its star rating and the user's own post-exercise reflection quoted
- Notes area for personal prep, saved to the device

### Planned and coming

**AI-generated session summary** — a one-paragraph narrative overlaid on the session prep data ("Here is what stood out this week...")

**In-app nudges for approaching exercises** — push-style notification when a scheduled exercise is about to start, in addition to the calendar reminder

**Session notes flow from daily check-ins** — during a check-in, if the user says something significant, offer "add to session notes" that persists to the next prep page

**Session notes to database** — notes currently live in device storage only; move them to the database for cross-device access and historical review

**Progress over time** — visualisation of theme shifts, emotional baseline trends, exercise completion rates, and practice consistency over weeks and months

**Therapist dashboard** — optional sharing so a therapist can see their client's reflections, completed exercises, and intentions before the next session. Built in partnership with licensed therapists.

**Phase 3: Maintenance** — the next phase entirely, for when therapy ends. Trigger tracking, milestone celebrations, gentle pattern-recognition check-ins that step down from daily to weekly to as-needed.

---

## What makes it distinct

**Context-aware, not generic.** Every conversation and every suggestion references the user's own therapy themes, intentions, and exercises. This is not a chatbot with memory of a single thread — it is a product that actively carries forward what came up in therapy.

**Therapist-first by design.** The AI actively encourages users to bring things to their therapist. It never diagnoses, interprets, or gives clinical advice. Every piece of content is framed as support for reflection and practice, not as therapy itself.

**Intelligence that compounds.** Each post-session reflection feeds into the next week of check-ins. Each completed exercise adjusts recommendations. Each intention tracked shows up in the prep summary. The value grows with every interaction.

**Proactive, not passive.** The app reaches out with daily check-ins, nudges users about approaching exercises, surfaces weekly prep without being asked, and suggests (without prescribing) exercises at the right moments.

**Evidence-based content.** 17 exercises grounded in peer-reviewed modalities, not wellness-influencer opinion. Every exercise has methodology tags that can be surfaced for therapists who want to verify the approach.

**Privacy-first.** Built in Amsterdam under GDPR. No selling data. Session prep notes stay on the device. The user controls everything.

---

## Key positioning phrases

Short phrases suitable for marketing copy, landing pages, and conversation.

- Support between therapy sessions
- 167 hours of support for every 1 hour of therapy
- Your therapist leads. Seen carries the work forward.
- See the pattern. Practice the change.
- A therapy companion, not a therapy replacement
- Walk into every session prepared
- Every conversation builds on the last

---

## What to keep in mind when writing

- Never position Seen as therapy or as a replacement for therapy
- Never make clinical claims ("treats anxiety", "reduces depression")
- Always respect the therapist's role
- Avoid em dashes in copy (house style)
- Avoid AI-typical emoji icons as decoration (house style)
- Speak in the user's voice where possible, not in features-and-benefits abstraction
- The tone is warm and direct, not corporate or clinical
