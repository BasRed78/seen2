'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// ============================================
// DESIGN SYSTEM - Matching pitch deck
// ============================================
const ds = {
  bg: '#0f0f1a',
  surface: '#1a1a2e',
  surfaceLight: '#252542',
  coral: '#e85a4f',
  cream: '#faf8f5',
  cyan: '#5B8F8F',
  muted: 'rgba(250,248,245,0.5)',
  subtle: 'rgba(250,248,245,0.12)',
};

// ============================================
// ICONS - Inline SVGs for reliability
// ============================================
const ArrowRight = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);

const ArrowLeft = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 19l-7-7 7-7"/>
  </svg>
);

const Heart = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

const Shield = ({ size = 24, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const Lock = ({ size = 24, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const Wine = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 22h8M12 18v4M12 18a7 7 0 0 0 7-7c0-2-1-3-1-5H6c0 2-1 3-1 5a7 7 0 0 0 7 7z"/>
  </svg>
);

const ShoppingBag = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0"/>
  </svg>
);

const Briefcase = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
  </svg>
);

const Users = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const Moon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

const Brain = ({ size = 24, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/><path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/><path d="M3.477 10.896a4 4 0 0 1 .585-.396"/><path d="M19.938 10.5a4 4 0 0 1 .585.396"/><path d="M6 18a4 4 0 0 1-1.967-.516"/><path d="M19.967 17.484A4 4 0 0 1 18 18"/>
  </svg>
);

const Check = ({ size = 24, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const AlertCircle = ({ size = 24, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

const ExternalLink = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
);

const ChevronDown = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

const ChevronUp = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="18 15 12 9 6 15"/>
  </svg>
);

const Star = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={ds.coral}>
    <path d="M12 0L13.5 10.5L24 12L13.5 13.5L12 24L10.5 13.5L0 12L10.5 10.5L12 0Z" />
  </svg>
);

// ============================================
// ANIMATION COMPONENTS
// ============================================
const Orb = ({ color = ds.coral, size = 500, x = '50%', y = '50%', opacity = 0.08 }: { color?: string; size?: number; x?: string; y?: string; opacity?: number }) => (
  <div style={{ 
    position: 'absolute', 
    width: size, 
    height: size, 
    left: x, 
    top: y, 
    transform: 'translate(-50%, -50%)', 
    background: `radial-gradient(circle, ${color} 0%, transparent 70%)`, 
    opacity, 
    pointerEvents: 'none' 
  }} />
);

const AccentLine = () => <div style={{ width: 60, height: 4, backgroundColor: ds.coral, borderRadius: 2 }} />;

// ============================================
// REFLECTION BLOCKS - Personalized content based on answers
// ============================================
interface ReflectionBlock {
  id: string;
  prose: string;
  researchContext: string;
  researchLink: string;
  researchCitation: string;
  closingLine: string;
}

const reflectionBlocks: Record<string, ReflectionBlock> = {
  long_hauler_alone_trying: {
    id: 'long_hauler_alone_trying',
    prose: "So this has been going on for a while — years, not months. And you've tried to stop before, more than once. But no one in your life knows about it.",
    researchContext: "There's research showing that patterns get harder to change the longer they've been running — not because you're weak, but because your brain has literally worn grooves into certain pathways. It takes more to redirect something that's been flowing the same way for years.",
    researchLink: "https://doi.org/10.1037/0022-3514.85.2.348",
    researchCitation: "Gross & John, 2003",
    closingLine: "You've been carrying this alone for a long time. That's exhausting in a way that's hard to explain."
  },
  long_hauler_alone_never_tried: {
    id: 'long_hauler_alone_never_tried',
    prose: "This goes way back. And you've never really tried to change it — maybe thought about it, but that's different from actually trying. And no one knows.",
    researchContext: "There's research on why people don't try to change things they know might be a problem. Often it's not about motivation — it's about not knowing where to start, or the gap between 'knowing' and 'doing' being wider than people realize.",
    researchLink: "https://doi.org/10.1016/j.cpr.2009.11.004",
    researchCitation: "Aldao et al., 2010",
    closingLine: "You're looking at it now. That's already a shift."
  },
  early_catch_feeling_cost: {
    id: 'early_catch_feeling_cost',
    prose: "You're catching this pretty early — this is recent for you. And you're already noticing that you feel worse after, not better. Or maybe better for a moment, then worse.",
    researchContext: "That's actually a well-documented pattern. Researchers call it the 'post-regulation affect dip' — behaviors that provide short-term relief often leave people feeling worse within 20-30 minutes. Your brain is already picking up on that signal.",
    researchLink: "https://doi.org/10.1037/0022-3514.80.1.53",
    researchCitation: "Tice et al., 2001",
    closingLine: "The fact that you're paying attention to the aftermath — that's awareness most people don't have this early."
  },
  automatic_pilot: {
    id: 'automatic_pilot',
    prose: "This has been happening for a long time, and you said you don't always see the triggers — it just happens. Like autopilot.",
    researchContext: "There's a reason it feels that way. When a behavior repeats over years, it can shift from conscious decision to something more automatic. The brain likes efficiency — it moves repeated actions out of the 'thinking' parts and into faster, less conscious pathways.",
    researchLink: "https://doi.org/10.1037/0022-006X.64.6.1152",
    researchCitation: "Hayes et al., 1996",
    closingLine: "You're trying to interrupt something that's had years to get grooved in. That's harder than people realize."
  },
  frustrated_repeater: {
    id: 'frustrated_repeater',
    prose: "You've tried to change this before. More than once. And it hasn't stuck — you said you feel frustrated with yourself.",
    researchContext: "That frustration makes sense. But here's something worth knowing: research on behavior change shows that most people try multiple times before something shifts. What looks like failure is often just part of the process — each attempt builds something, even when it doesn't feel that way.",
    researchLink: "https://doi.org/10.1037/0022-006X.51.3.390",
    researchCitation: "Prochaska & DiClemente, 1983",
    closingLine: "You're still trying. That says something."
  },
  shame_carrier: {
    id: 'shame_carrier',
    prose: "You said you feel ashamed of this. And you're carrying it mostly alone — no one knows, or almost no one.",
    researchContext: "Shame and secrecy tend to travel together. Research shows they can create a loop: the more shame we feel, the more we hide; the more we hide, the more shame grows. Not because hiding is wrong, but because shame needs silence to survive.",
    researchLink: "https://doi.org/10.1037/0033-2909.130.3.392",
    researchCitation: "Crocker & Park, 2004",
    closingLine: "You're naming it now. Shame doesn't do as well in the light."
  },
  tired_of_cycle: {
    id: 'tired_of_cycle',
    prose: "You said you're tired of the cycle. And this isn't occasional — it shows up almost every time you're stressed. That's exhausting.",
    researchContext: "Repetitive patterns have a wearing quality that's hard to explain to someone who hasn't lived it. Each time feels like starting over. Research on self-regulation shows that resisting impulses actually depletes a limited resource — the tiredness you're feeling isn't weakness; it's a signal.",
    researchLink: "https://doi.org/10.1037/0022-3514.74.5.1252",
    researchCitation: "Baumeister et al., 1998",
    closingLine: "The exhaustion is telling you something. You're here because you're listening."
  },
  here_because_someone_noticed: {
    id: 'here_because_someone_noticed',
    prose: "You're here because someone suggested you look at this. That's a different starting point than choosing it yourself — and it's worth being honest about that.",
    researchContext: "Research on motivation shows that 'external' reasons for change — doing it because someone else wants you to — can work, but they often don't stick as well as internal ones. That doesn't mean this is pointless. Sometimes someone else sees something before we do. The question is whether any part of you agrees with them.",
    researchLink: "https://doi.org/10.1037/0003-066X.55.1.68",
    researchCitation: "Ryan & Deci, 2000",
    closingLine: "You took the quiz. That's at least curiosity. That counts."
  },
  wants_to_stop_hurting: {
    id: 'wants_to_stop_hurting',
    prose: "You said you want to stop hurting yourself — or others. And this is affecting your life in real ways. That's a heavy combination to carry.",
    researchContext: "When a pattern starts to hurt the people around us, it adds a layer of guilt on top of everything else. Research shows that guilt can actually be useful — it means you care about the impact you're having. Shame says 'I am bad.' Guilt says 'I did something that doesn't fit who I want to be.'",
    researchLink: "https://doi.org/10.1037/0033-2909.115.2.243",
    researchCitation: "Tangney et al., 1992",
    closingLine: "You're here because it matters to you. Not just abstractly — it's affecting things you care about."
  },
  curious_not_urgent: {
    id: 'curious_not_urgent',
    prose: "You're not here in crisis. You said you're curious about this pattern — you want to understand yourself better. That's a different energy than 'I need to fix this right now.'",
    researchContext: "Curiosity is actually a solid starting point. Research on self-reflection shows that approaching yourself with interest rather than judgment activates different brain pathways — less defensive, more open to actually seeing what's there.",
    researchLink: "https://doi.org/10.1111/j.1467-9280.2007.01916.x",
    researchCitation: "Lieberman et al., 2007",
    closingLine: "You're exploring. That's allowed."
  },
  not_hidden_but_conflicted: {
    id: 'not_hidden_but_conflicted',
    prose: "This isn't something you hide — people in your life know about it. But you're still here, still looking at it. You said you feel conflicted.",
    researchContext: "Ambivalence gets a bad reputation, but it's actually meaningful. Research shows that feeling two ways about something is often what precedes change — part of you is attached to the pattern, part of you is done with it. Both can be true at the same time.",
    researchLink: "https://doi.org/10.1037/0022-006X.51.3.390",
    researchCitation: "Prochaska & DiClemente, 1983",
    closingLine: "You don't have to resolve it today. Noticing the conflict is enough for now."
  },
  pattern_feels_like_identity: {
    id: 'pattern_feels_like_identity',
    prose: "This has been part of your life as long as you can remember. And you said you feel accepting of it — it is what it is.",
    researchContext: "When something's been there that long, it can start to feel less like a behavior and more like just... who you are. Researchers have a term for this: 'ego-syntonic' — when a pattern feels like self rather than something you're doing. That doesn't mean it can't change. It just means the first step is separating the two: this is something I do, not something I am.",
    researchLink: "https://doi.org/10.1016/j.cpr.2009.11.004",
    researchCitation: "Aldao et al., 2010",
    closingLine: "You're here, which suggests at least some part of you is curious whether 'it is what it is' is the full story."
  },
  fallback: {
    id: 'fallback',
    prose: "Based on what you shared, you're aware this pattern exists — that's already more than a lot of people get to. You've looked at how often it happens, how long it's been going on, what it's costing you.",
    researchContext: "There's research showing that just naming something — putting words to a pattern — changes your relationship with it. It activates different parts of the brain, creating a small gap between you and the automatic behavior.",
    researchLink: "https://doi.org/10.1111/j.1467-9280.2007.01916.x",
    researchCitation: "Lieberman et al., 2007",
    closingLine: "You named it. That's where it starts."
  }
};

// ============================================
// QUIZ DATA - 14 QUESTIONS TOTAL
// ============================================
const warmupQuestions = [
  {
    id: 1,
    text: "When you're stressed or overwhelmed, are you usually aware of it in the moment?",
    options: ["Yes, I notice right away", "Sometimes, depends on the situation", "Not really — I realize it later", "I'm not sure"],
  },
  {
    id: 2,
    text: "After a stressful day, how do you typically feel by evening?",
    options: ["I've processed it and feel okay", "Still carrying some tension", "Exhausted and wanting escape", "Numb or disconnected"],
  },
  {
    id: 3,
    text: "When something difficult happens, what's your first instinct?",
    options: ["Talk to someone about it", "Distract myself with activities", "Try to fix it immediately", "Withdraw and process alone"],
  }
];

const branchingQuestion = {
  id: 4,
  text: "When you're stressed, anxious, or emotionally overwhelmed, which of these feels most familiar?",
  options: [
    "Reaching for connection — texting past connections, seeking attention, craving intensity",
    "Reaching for a substance — alcohol, food, cannabis, something to change how I feel",
    "Reaching for my wallet — buying things, browsing shops, retail therapy",
    "Reaching for work — staying busy, being productive, proving myself",
    "Reaching for reassurance — checking if people like me, seeking approval",
    "Reaching for escape — sleeping, avoiding, numbing out with screens",
    "Reaching for intensity — sex, romance, dating apps, the thrill of something new",
    "A mix of several of these"
  ],
};

// Universal follow-up questions (after branching) - Questions 5-14
const universalQuestions = [
  {
    id: 5,
    text: "How often does this pattern show up when you're stressed?",
    options: ["Almost every time", "More often than not", "Sometimes", "Rarely"],
  },
  {
    id: 6,
    text: "After engaging in this behavior, how do you typically feel?",
    options: ["Worse than before", "Temporarily better, then worse", "Conflicted or confused", "Actually relieved"],
  },
  {
    id: 7,
    text: "Has this pattern affected other areas of your life?",
    options: ["Yes, significantly", "Somewhat", "A little", "Not really"],
  },
  {
    id: 8,
    text: "When did you first notice this pattern?",
    options: ["Recently (past few months)", "Past 1-2 years", "Several years ago", "As long as I can remember"],
  },
  {
    id: 9,
    text: "Do you recognize what triggers this behavior?",
    options: ["Yes, I can usually identify triggers", "Sometimes I notice them", "Rarely — it feels automatic", "I haven't thought about it"],
  },
  {
    id: 10,
    text: "Have you tried to change this pattern before?",
    options: ["Yes, multiple times", "Once or twice", "I've thought about it but haven't tried", "No"],
  },
  {
    id: 11,
    text: "Who knows about this pattern?",
    options: ["No one", "One or two people", "A few close people", "It's not something I hide"],
  },
  {
    id: 12,
    text: "How do you feel about this pattern?",
    options: ["Ashamed or embarrassed", "Frustrated with myself", "Curious about why I do it", "Accepting — it is what it is"],
  },
  {
    id: 13,
    text: "What brings you here today?",
    options: ["I want to stop hurting myself or others", "I'm tired of the cycle", "I want to understand myself better", "Someone suggested I look at this"],
  },
  {
    id: 14,
    text: "How ready do you feel to look at this pattern honestly?",
    options: ["Very ready — I want to understand", "Ready but nervous", "Curious but unsure", "Not sure I want to go deeper"],
  }
];

const patterns: Record<string, { title: string; subtitle: string; description: string; mechanism: string; note: string; icon: JSX.Element; color: string; citation: string }> = {
  intimacy_seeking: {
    title: "Intimacy Seeking",
    subtitle: "You reach for connection when things get hard",
    description: "When stress hits, you look for closeness — sometimes in places that create more problems than they solve. Texting someone you shouldn't, seeking intensity when you need stability, or craving the feeling of being wanted as a way to escape what you're actually feeling.",
    mechanism: "Your brain learned that connection equals safety. Under stress, it reaches for that signal — often before you've consciously decided anything. The problem isn't wanting connection. It's that the brain doesn't always pick connections that actually help.",
    note: "Research shows that when you can name what you're actually feeling underneath the urge, it loses some of its grip. That's not willpower. That's how the brain works.",
    icon: <Heart size={48} />,
    color: ds.coral,
    citation: "Weinstein et al., 2015; Lewczuk et al., 2024"
  },
  substance_soothing: {
    title: "Substance Soothing",
    subtitle: "You reach for something to change how you feel",
    description: "When things get hard, you reach for something external — alcohol, food, cannabis, something — to shift your internal state. It works, at least in the moment. That's why it keeps happening.",
    mechanism: "Your brain found something that reliably changes how you feel, fast. Under stress, speed matters more than wisdom. So the brain keeps suggesting the same solution, even when you know the cost.",
    note: "The behavior isn't the problem — it's the solution your brain found. The real question is what feeling becomes unbearable enough that you reach for relief.",
    icon: <Wine size={48} />,
    color: ds.coral,
    citation: "Koob & Volkow, 2016; Sinha, 2008"
  },
  compulsive_spending: {
    title: "Compulsive Spending",
    subtitle: "You spend to escape or feel in control",
    description: "When everything feels chaotic, buying something feels like control. The anticipation, the decision, the purchase — it's a complete distraction from whatever you're actually avoiding.",
    mechanism: "Shopping activates reward pathways in the brain — anticipation, novelty, choice. Under stress, your brain looks for reliable sources of those signals. The problem comes after, when the high fades and the consequences arrive.",
    note: "Spending often increases during times of uncertainty — it's a way of asserting control when everything else feels out of your hands.",
    icon: <ShoppingBag size={48} />,
    color: ds.coral,
    citation: "Dittmar, 2005; Müller et al., 2019"
  },
  achievement_hiding: {
    title: "Achievement Hiding",
    subtitle: "You work harder when you should rest",
    description: "When stress hits, you don't slow down — you speed up. More work, more productivity, more proof that you're handling it. Except you're not handling it. You're hiding in accomplishment.",
    mechanism: "Productivity feels like control. And society rewards it, which makes it harder to see as a coping mechanism. But there's a difference between working because you want to and working because you can't stop.",
    note: "The things you're avoiding stay right where you left them. Exhaustion catches up eventually.",
    icon: <Briefcase size={48} />,
    color: ds.coral,
    citation: "Schaufeli et al., 2009; Killinger, 2006"
  },
  approval_chasing: {
    title: "Approval Chasing",
    subtitle: "You look outward for reassurance",
    description: "When you're stressed, you check — Am I okay? Am I doing enough? Do people still like me? The validation helps, briefly. Then you need to check again.",
    mechanism: "Your brain learned to use external feedback as a gauge for internal states. Under stress, it seeks that feedback more intensely. But the relief never lasts, because the question you're really asking can't be answered by anyone else.",
    note: "The need for validation often masks deeper questions about self-worth that external approval can't answer.",
    icon: <Users size={48} />,
    color: ds.coral,
    citation: "Leary & Baumeister, 2000; Crocker & Park, 2004"
  },
  withdrawal_avoidance: {
    title: "Withdrawal & Avoidance",
    subtitle: "You retreat when things get hard",
    description: "When stress hits, you pull back — more sleep, more screens, less everything else. It feels like self-care, but it functions more like hiding. The world keeps moving while you're not in it.",
    mechanism: "Withdrawal reduces immediate overwhelm. Your brain learns that less input means less stress — so it keeps suggesting retreat. The problem is that avoidance tends to make things pile up.",
    note: "Rest is essential. But avoidance disguised as rest doesn't actually restore you.",
    icon: <Moon size={48} />,
    color: ds.coral,
    citation: "Nolen-Hoeksema et al., 2008; Sirois & Pychyl, 2013"
  },
  complex_mixed: {
    title: "Mixed Pattern",
    subtitle: "You use multiple strategies depending on the situation",
    description: "Your stress responses don't fit neatly into one category — you might reach for connection one day and isolation the next. You may cycle through several patterns in a single week.",
    mechanism: "Most people have layered coping mechanisms that developed over time. Different triggers activate different responses. The challenge is figuring out which patterns cause the most harm.",
    note: "Having multiple patterns isn't unusual — it just means there's more to untangle.",
    icon: <Brain size={48} />,
    color: ds.cyan,
    citation: "Folkman & Moskowitz, 2004"
  }
};

const preambleSteps = [
  {
    title: "Your brain has a go-to move when things get hard.",
    content: "It's automatic. You probably don't even think about it. When stress hits, your brain says 'do this' — and you do it."
  },
  {
    title: "Everyone has a pattern.",
    content: "For some people, it's reaching out to someone from the past. For others, it's shutting everyone out. Some people spend money, some stop eating, some pick fights, some work themselves to exhaustion."
  },
  {
    title: "There's no good or bad here.",
    content: "Your brain is just trying to cope the best way it knows how. This quiz helps you see your pattern. Not to shame it — just to name it."
  },
  {
    title: "You're not alone in this.",
    content: "Whatever your pattern looks like, thousands of people share some version of it. Seeing it clearly is the first step toward understanding yourself better."
  }
];

// ============================================
// MAIN COMPONENT
// ============================================
// Reveal component - defined outside to prevent recreation on every render
const Reveal = ({ children, delay = 0, y = 40, className = '', animKey }: { children: React.ReactNode; delay?: number; y?: number; className?: string; animKey: number }) => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(false);
    const t = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(t);
  }, [animKey, delay]);
  return (
    <div className={className} style={{ 
      opacity: show ? 1 : 0, 
      transform: show ? 'translateY(0)' : `translateY(${y}px)`, 
      transition: 'opacity 0.8s ease-out, transform 0.8s ease-out' 
    }}>
      {children}
    </div>
  );
};

export default function StressPatternQuiz() {
  const router = useRouter();
  const [stage, setStage] = useState<'landing' | 'story' | 'preamble' | 'consent' | 'quiz' | 'crisis' | 'results'>('landing');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [email, setEmail] = useState('');
  const [pattern, setPattern] = useState<string | null>(null);
  const [preambleStep, setPreambleStep] = useState(0);
  const [resultsStep, setResultsStep] = useState(0);
  const [consentChecks, setConsentChecks] = useState([false, false]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showSources, setShowSources] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  // Reset animation key on stage/step change
  useEffect(() => {
    setAnimKey(k => k + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [stage, currentQuestion, preambleStep, resultsStep]);

  // Determine reflection block based on answers
  // Answer indices: Q5=4, Q6=5, Q7=6, Q8=7, Q9=8, Q10=9, Q11=10, Q12=11, Q13=12, Q14=13
  const getReflectionBlock = (): ReflectionBlock => {
    const frequency = answers[4] ?? 0;      // Q5: How often
    const aftermath = answers[5] ?? 0;       // Q6: How you feel after
    const impact = answers[6] ?? 0;          // Q7: Affected other areas
    const duration = answers[7] ?? 0;        // Q8: When first noticed
    const triggers = answers[8] ?? 0;        // Q9: Recognize triggers
    const changeAttempts = answers[9] ?? 0;  // Q10: Tried to change
    const secrecy = answers[10] ?? 0;        // Q11: Who knows
    const feelings = answers[11] ?? 0;       // Q12: How you feel about it
    const motivation = answers[12] ?? 0;     // Q13: What brings you here
    const readiness = answers[13] ?? 0;      // Q14: How ready

    // Block 1: Long-hauler, alone, still trying
    if (duration >= 2 && secrecy === 0 && changeAttempts <= 1) {
      return reflectionBlocks.long_hauler_alone_trying;
    }

    // Block 2: Long-hauler, alone, never tried
    if (duration >= 2 && secrecy === 0 && changeAttempts >= 2) {
      return reflectionBlocks.long_hauler_alone_never_tried;
    }

    // Block 3: Early catch, feeling the cost
    if (duration === 0 && aftermath <= 1) {
      return reflectionBlocks.early_catch_feeling_cost;
    }

    // Block 4: Automatic pilot
    if (triggers >= 2 && duration >= 2) {
      return reflectionBlocks.automatic_pilot;
    }

    // Block 5: Frustrated repeater
    if (changeAttempts === 0 && feelings === 1) {
      return reflectionBlocks.frustrated_repeater;
    }

    // Block 6: Shame carrier
    if (feelings === 0 && secrecy <= 1) {
      return reflectionBlocks.shame_carrier;
    }

    // Block 7: Tired of the cycle
    if (motivation === 1 && frequency <= 1) {
      return reflectionBlocks.tired_of_cycle;
    }

    // Block 8: Here because someone noticed
    if (motivation === 3) {
      return reflectionBlocks.here_because_someone_noticed;
    }

    // Block 9: Wants to stop hurting others
    if (motivation === 0 && impact === 0) {
      return reflectionBlocks.wants_to_stop_hurting;
    }

    // Block 10: Curious, not urgent
    if (feelings === 2 && motivation === 2 && readiness >= 1) {
      return reflectionBlocks.curious_not_urgent;
    }

    // Block 11: Not hidden, but conflicted
    if (secrecy === 3 && (feelings === 2 || aftermath === 2)) {
      return reflectionBlocks.not_hidden_but_conflicted;
    }

    // Block 12: Pattern feels like identity
    if (duration === 3 && feelings === 3) {
      return reflectionBlocks.pattern_feels_like_identity;
    }

    // Fallback
    return reflectionBlocks.fallback;
  };

  const totalQuestions = 14;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    
    setTimeout(() => {
      const updatedAnswers = { ...answers, [currentQuestion]: answerIndex };
      setAnswers(updatedAnswers);

      // Determine pattern on branching question (Q4, index 3)
      if (currentQuestion === 3) {
        if (answerIndex === 0 || answerIndex === 6) setPattern('intimacy_seeking');
        else if (answerIndex === 1) setPattern('substance_soothing');
        else if (answerIndex === 2) setPattern('compulsive_spending');
        else if (answerIndex === 3) setPattern('achievement_hiding');
        else if (answerIndex === 4) setPattern('approval_chasing');
        else if (answerIndex === 5) setPattern('withdrawal_avoidance');
        else setPattern('complex_mixed');
      }

      // Crisis check after Q3
      if (currentQuestion === 2 && updatedAnswers[0] === 3 && updatedAnswers[1] === 3 && updatedAnswers[2] === 3) {
        setSelectedAnswer(null);
        setStage('crisis');
        return;
      }

      setSelectedAnswer(null);
      if (currentQuestion < totalQuestions - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setStage('results');
        setResultsStep(0);
      }
    }, 250);
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else if (stage === 'quiz') {
      setStage('consent');
    }
  };

  const getQuestion = () => {
    if (currentQuestion < 3) return warmupQuestions[currentQuestion];
    if (currentQuestion === 3) return branchingQuestion;
    return universalQuestions[currentQuestion - 4];
  };

  const patternData = patterns[pattern || 'complex_mixed'];
  const reflectionBlock = getReflectionBlock();

  // ============================================
  // LANDING STAGE
  // ============================================
  if (stage === 'landing') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: ds.bg }}>
        <div className="max-w-xl w-full text-center relative">
          <Orb size={600} x="50%" y="40%" opacity={0.1} />
          
          <Reveal animKey={animKey} delay={0}>
            <div className="flex items-center justify-center gap-4 mb-8">
              <Star size={40} />
              <h1 style={{ color: ds.cream, fontSize: '4rem', fontWeight: 900, letterSpacing: '-0.04em' }}>Seen</h1>
            </div>
          </Reveal>
          
          <Reveal animKey={animKey} delay={150}>
            <h2 style={{ color: ds.cream, fontSize: '1.75rem', fontWeight: 700, marginBottom: 16, lineHeight: 1.3 }}>
              What's your stress pattern?
            </h2>
          </Reveal>
          
          <Reveal animKey={animKey} delay={300}>
            <p style={{ color: ds.muted, fontSize: '1.1rem', marginBottom: 40, lineHeight: 1.6 }}>
              When life gets hard, your brain has a go-to move. A way to cope, escape, or just get through. Most people don't see the pattern until something breaks.
            </p>
          </Reveal>

          <Reveal animKey={animKey} delay={450}>
            <button
              onClick={() => setStage('preamble')}
              className="px-8 py-4 rounded-xl font-semibold text-lg flex items-center gap-3 mx-auto transition-all hover:scale-105"
              style={{ backgroundColor: ds.coral, color: ds.cream }}
            >
              Take the quiz <ArrowRight size={20} />
            </button>
          </Reveal>

          <Reveal animKey={animKey} delay={600}>
            <p style={{ color: ds.muted, fontSize: '0.9rem', marginTop: 16 }}>
              3 minutes · Completely private
            </p>
          </Reveal>
        </div>
      </div>
    );
  }

  // ============================================
  // FOUNDER STORY
  // ============================================
  if (stage === 'story') {
    return (
      <div className="min-h-screen flex items-center p-6" style={{ backgroundColor: ds.bg }}>
        <div className="max-w-xl mx-auto relative">
          <Orb size={400} x="80%" y="30%" opacity={0.08} />
          
          <Reveal animKey={animKey} delay={0}><AccentLine /></Reveal>
          
          <Reveal animKey={animKey} delay={100}>
            <p style={{ color: ds.muted, fontSize: '0.9rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: 24, marginBottom: 32 }}>
              Why I built this
            </p>
          </Reveal>
          
          <Reveal animKey={animKey} delay={200}>
            <p style={{ color: ds.cream, fontSize: '1.35rem', fontWeight: 600, marginBottom: 24, lineHeight: 1.4 }}>
              I spent years in a gap I couldn't see.
            </p>
          </Reveal>
          
          <Reveal animKey={animKey} delay={350}>
            <p style={{ color: ds.muted, fontSize: '1.1rem', marginBottom: 20, lineHeight: 1.6 }}>
              I had a pattern — a way I coped when things got hard. I didn't recognize it as a pattern. I just thought it was who I was.
            </p>
          </Reveal>
          
          <Reveal animKey={animKey} delay={500}>
            <p style={{ color: ds.muted, fontSize: '1.1rem', marginBottom: 32, lineHeight: 1.6 }}>
              It took everything falling apart before I finally got help. I want to help people see it earlier.
            </p>
          </Reveal>
          
          <Reveal animKey={animKey} delay={650}>
            <p style={{ color: ds.coral, fontSize: '1.25rem', fontWeight: 600, marginBottom: 40, lineHeight: 1.4 }}>
              — Bas
            </p>
          </Reveal>

          <Reveal animKey={animKey} delay={800}>
            <div className="flex gap-4">
              <button
                onClick={() => setStage('landing')}
                className="px-6 py-3 rounded-xl font-semibold transition-all"
                style={{ backgroundColor: ds.subtle, color: ds.cream }}
              >
                <ArrowLeft size={20} />
              </button>
              <button
                onClick={() => setStage('preamble')}
                className="flex-1 px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all hover:scale-105"
                style={{ backgroundColor: ds.coral, color: ds.cream }}
              >
                Take the quiz <ArrowRight size={20} />
              </button>
            </div>
          </Reveal>
        </div>
      </div>
    );
  }

  // ============================================
  // PREAMBLE
  // ============================================
  if (stage === 'preamble') {
    const step = preambleSteps[preambleStep];
    
    return (
      <div className="min-h-screen flex items-center p-6" style={{ backgroundColor: ds.bg }}>
        <div className="max-w-xl mx-auto w-full relative">
          <Orb size={500} x="50%" y="50%" opacity={0.08} />
          
          {/* Progress dots - no animation */}
          <div className="flex justify-center gap-2 mb-12">
            {preambleSteps.map((_, idx) => (
              <div 
                key={idx}
                style={{ 
                  width: idx === preambleStep ? 24 : 8, 
                  height: 8, 
                  borderRadius: 4, 
                  backgroundColor: idx === preambleStep ? ds.coral : ds.subtle,
                  transition: 'all 0.3s'
                }}
              />
            ))}
          </div>

          {/* Content area with crossfade */}
          <div style={{ position: 'relative', minHeight: 200 }}>
            {preambleSteps.map((s, idx) => (
              <div 
                key={idx}
                style={{ 
                  position: idx === preambleStep ? 'relative' : 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  opacity: idx === preambleStep ? 1 : 0,
                  transform: idx === preambleStep ? 'translateX(0)' : idx < preambleStep ? 'translateX(-30px)' : 'translateX(30px)',
                  transition: 'opacity 0.4s ease, transform 0.4s ease',
                  pointerEvents: idx === preambleStep ? 'auto' : 'none',
                }}
              >
                <h2 style={{ color: ds.cream, fontSize: '1.75rem', fontWeight: 800, marginBottom: 20, lineHeight: 1.3, textAlign: 'center' }}>
                  {s.title}
                </h2>
                <p style={{ color: ds.muted, fontSize: '1.1rem', marginBottom: 48, lineHeight: 1.6, textAlign: 'center' }}>
                  {s.content}
                </p>
              </div>
            ))}
          </div>

          {/* Buttons - always visible, no animation */}
          <div className="flex justify-center gap-4">
            {preambleStep > 0 && (
              <button
                onClick={() => setPreambleStep(preambleStep - 1)}
                className="px-6 py-3 rounded-xl font-semibold transition-all"
                style={{ backgroundColor: ds.subtle, color: ds.cream }}
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <button
              onClick={() => {
                if (preambleStep < preambleSteps.length - 1) {
                  setPreambleStep(preambleStep + 1);
                } else {
                  setStage('consent');
                }
              }}
              className="px-8 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all hover:scale-105"
              style={{ backgroundColor: ds.coral, color: ds.cream }}
            >
              {preambleStep < preambleSteps.length - 1 ? 'Continue' : 'Start'} <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // CONSENT
  // ============================================
  if (stage === 'consent') {
    return (
      <div className="min-h-screen flex items-center p-6" style={{ backgroundColor: ds.bg }}>
        <div className="max-w-xl mx-auto w-full">
          <Reveal animKey={animKey} delay={0}>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 rounded-xl" style={{ backgroundColor: ds.subtle }}>
                <Shield size={24} color={ds.coral} />
              </div>
              <h2 style={{ color: ds.cream, fontSize: '1.5rem', fontWeight: 700 }}>Before we start</h2>
            </div>
            
            <div className="rounded-xl p-6 mb-6" style={{ backgroundColor: ds.surface }}>
              <p style={{ color: ds.cream, opacity: 0.85, lineHeight: 1.6, marginBottom: 16 }}>
                This assessment helps you see patterns — it's not therapy, not a diagnosis, and not a substitute for professional support. Think of it as a mirror, not a prescription.
              </p>
              
              <div className="p-4 rounded-lg" style={{ backgroundColor: `${ds.coral}15`, borderLeft: `3px solid ${ds.coral}` }}>
                <p style={{ color: ds.coral, fontWeight: 600, marginBottom: 8 }}>If you're in crisis right now:</p>
                <p style={{ color: ds.cream, opacity: 0.8, fontSize: '0.9rem', marginBottom: 8 }}>
                  This isn't the right place. Please reach out:
                </p>
                <p style={{ color: ds.cream, opacity: 0.7, fontSize: '0.85rem' }}>
                  <strong>Netherlands:</strong> 113 Zelfmoordpreventie (0900-0113) · De Luisterlijn (088-0767000)
                </p>
                <p style={{ color: ds.cream, opacity: 0.7, fontSize: '0.85rem' }}>
                  <strong>International:</strong> findahelpline.com
                </p>
              </div>
            </div>

            <div className="space-y-3 mb-8">
              {[
                "I understand this is for self-reflection, not diagnosis or treatment",
                "I'm not currently in crisis"
              ].map((text, idx) => (
                <label key={idx} className="flex items-start gap-3 cursor-pointer group p-3 rounded-lg transition-colors" style={{ backgroundColor: consentChecks[idx] ? ds.subtle : 'transparent' }}>
                  <input 
                    type="checkbox"
                    checked={consentChecks[idx]}
                    onChange={() => {
                      const newChecks = [...consentChecks];
                      newChecks[idx] = !newChecks[idx];
                      setConsentChecks(newChecks);
                    }}
                    className="mt-1 w-5 h-5 rounded" 
                    style={{ accentColor: ds.coral }}
                  />
                  <span style={{ color: ds.cream, opacity: 0.8, fontSize: '0.95rem' }}>
                    {text}
                  </span>
                </label>
              ))}
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStage('preamble')}
                className="px-6 py-4 rounded-xl font-semibold transition-all"
                style={{ backgroundColor: ds.subtle, color: ds.cream }}
              >
                <ArrowLeft size={20} />
              </button>
              <button
                onClick={() => setStage('quiz')}
                disabled={!consentChecks.every(Boolean)}
                className="flex-1 px-6 py-4 rounded-xl font-semibold transition-all"
                style={{ 
                  backgroundColor: consentChecks.every(Boolean) ? ds.coral : ds.subtle,
                  color: ds.cream,
                  opacity: consentChecks.every(Boolean) ? 1 : 0.5,
                  cursor: consentChecks.every(Boolean) ? 'pointer' : 'not-allowed'
                }}
              >
                I understand, continue
              </button>
            </div>
          </Reveal>
        </div>
      </div>
    );
  }

  // ============================================
  // CRISIS
  // ============================================
  if (stage === 'crisis') {
    return (
      <div className="min-h-screen flex items-center p-6" style={{ backgroundColor: ds.bg }}>
        <div className="max-w-xl mx-auto w-full">
          <Reveal animKey={animKey} delay={0}>
            <div className="flex items-center gap-3 mb-6">
              <AlertCircle size={28} color={ds.coral} />
              <h2 style={{ color: ds.cream, fontSize: '1.5rem', fontWeight: 700 }}>Let's pause here</h2>
            </div>
          </Reveal>
          
          <Reveal animKey={animKey} delay={150}>
            <div className="rounded-xl p-6 mb-6" style={{ backgroundColor: ds.surface }}>
              <p style={{ color: ds.cream, lineHeight: 1.6, marginBottom: 20 }}>
                Based on your responses, it sounds like you might be going through a particularly difficult time. This quiz is designed for self-reflection, but what you're experiencing may benefit from professional support.
              </p>
              
              <div className="p-4 rounded-lg mb-4" style={{ backgroundColor: ds.bg }}>
                <p style={{ color: ds.cream, fontWeight: 600, marginBottom: 8 }}>Netherlands</p>
                <p style={{ color: ds.muted, fontSize: '0.9rem' }}>113 Zelfmoordpreventie: 0900-0113 (24/7)</p>
                <p style={{ color: ds.muted, fontSize: '0.9rem' }}>De Luisterlijn: 088-0767000 (24/7)</p>
              </div>
              
              <div className="p-4 rounded-lg" style={{ backgroundColor: ds.bg }}>
                <p style={{ color: ds.cream, fontWeight: 600, marginBottom: 8 }}>International</p>
                <p style={{ color: ds.muted, fontSize: '0.9rem' }}>findahelpline.com</p>
              </div>
            </div>
          </Reveal>

          <Reveal animKey={animKey} delay={300}>
            <button
              onClick={() => {
                setStage('quiz');
                setCurrentQuestion(0);
                setAnswers({});
              }}
              className="w-full px-6 py-4 rounded-xl font-semibold transition-all"
              style={{ backgroundColor: ds.coral, color: ds.cream }}
            >
              I'm okay, continue quiz
            </button>
          </Reveal>
        </div>
      </div>
    );
  }

  // ============================================
  // QUIZ
  // ============================================
  if (stage === 'quiz') {
    const question = getQuestion();

    return (
      <div className="min-h-screen p-6 py-12" style={{ backgroundColor: ds.bg }}>
        <div className="max-w-xl mx-auto relative">
          <Orb size={400} x="80%" y="30%" opacity={0.06} />
          
          {/* Header - no animation */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={handleBack}
              className="p-2 rounded-lg transition-all"
              style={{ backgroundColor: currentQuestion === 0 ? 'transparent' : ds.subtle, color: ds.cream, opacity: currentQuestion === 0 ? 0.3 : 1 }}
              disabled={currentQuestion === 0}
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ backgroundColor: ds.surface }}>
              <Lock size={14} color={ds.coral} />
              <span style={{ color: ds.cream, fontSize: '0.85rem' }}>Private</span>
            </div>
          </div>

          {/* Progress - no animation */}
          <div className="mb-10">
            <div className="flex justify-between text-sm mb-3">
              <span style={{ color: ds.muted }}>Question {currentQuestion + 1} of {totalQuestions}</span>
              <span style={{ color: ds.coral, fontWeight: 600 }}>{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-1 rounded-full" style={{ backgroundColor: ds.subtle }}>
              <div 
                className="h-1 rounded-full transition-all duration-500"
                style={{ width: `${progress}%`, backgroundColor: ds.coral }}
              />
            </div>
          </div>

          {/* Question - fade only, no slide */}
          <Reveal animKey={animKey} delay={0} y={0}>
            <h2 style={{ color: ds.cream, fontSize: '1.35rem', fontWeight: 700, marginBottom: 32, lineHeight: 1.4 }}>
              {question.text}
            </h2>
          
            {/* Options - single fade, no stagger */}
            <div className="space-y-3">
              {question.options.map((option, idx) => {
                const isSelected = selectedAnswer === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => selectedAnswer === null && handleAnswer(idx)}
                    disabled={selectedAnswer !== null}
                    className="w-full text-left p-5 rounded-xl font-medium transition-all"
                    style={{ 
                      backgroundColor: isSelected ? ds.coral : ds.surface,
                      color: ds.cream,
                      transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                      border: `1px solid ${isSelected ? ds.coral : ds.subtle}`,
                      cursor: selectedAnswer !== null ? 'default' : 'pointer',
                    }}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </Reveal>
        </div>
      </div>
    );
  }

  // ============================================
  // RESULTS - Multi-step reveal
  // ============================================
  if (stage === 'results') {
    
    // Step 0: Acknowledgment
    if (resultsStep === 0) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: ds.bg }}>
          <div className="max-w-xl w-full text-center relative">
            <Orb size={500} x="50%" y="50%" opacity={0.1} />
            
            <Reveal animKey={animKey} delay={0}>
              <h1 style={{ color: ds.cream, fontSize: '2rem', fontWeight: 800, marginBottom: 16, lineHeight: 1.3 }}>
                That took honesty.
              </h1>
            </Reveal>
            
            <Reveal animKey={animKey} delay={200}>
              <p style={{ color: ds.muted, fontSize: '1.15rem', marginBottom: 48, lineHeight: 1.6 }}>
                Most people don't look at this stuff. You just did.
              </p>
            </Reveal>

            <Reveal animKey={animKey} delay={400}>
              <button
                onClick={() => setResultsStep(1)}
                className="px-8 py-4 rounded-xl font-semibold text-lg flex items-center gap-2 mx-auto transition-all hover:scale-105"
                style={{ backgroundColor: ds.coral, color: ds.cream }}
              >
                See your pattern <ArrowRight size={20} />
              </button>
            </Reveal>
          </div>
        </div>
      );
    }

    // Step 1: Pattern Reveal
    if (resultsStep === 1) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: ds.bg }}>
          <div className="max-w-xl w-full text-center relative">
            <Orb size={600} x="50%" y="50%" opacity={0.1} color={patternData.color} />
            
            <Reveal animKey={animKey} delay={0}>
              <p style={{ color: ds.muted, fontSize: '0.9rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 24 }}>
                Your Pattern
              </p>
            </Reveal>
            
            <Reveal animKey={animKey} delay={150}>
              <div className="flex justify-center mb-6" style={{ color: patternData.color }}>
                {patternData.icon}
              </div>
            </Reveal>

            <Reveal animKey={animKey} delay={300}>
              <h1 style={{ color: ds.cream, fontSize: '2.5rem', fontWeight: 800, marginBottom: 12 }}>
                {patternData.title}
              </h1>
            </Reveal>
            
            <Reveal animKey={animKey} delay={450}>
              <p style={{ color: ds.muted, fontSize: '1.15rem', marginBottom: 48 }}>
                {patternData.subtitle}
              </p>
            </Reveal>

            <Reveal animKey={animKey} delay={600}>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setResultsStep(0)}
                  className="px-6 py-3 rounded-xl font-semibold transition-all"
                  style={{ backgroundColor: ds.subtle, color: ds.cream }}
                >
                  <ArrowLeft size={20} />
                </button>
                <button
                  onClick={() => setResultsStep(2)}
                  className="px-8 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all hover:scale-105"
                  style={{ backgroundColor: ds.coral, color: ds.cream }}
                >
                  What this means <ArrowRight size={20} />
                </button>
              </div>
            </Reveal>
          </div>
        </div>
      );
    }

    // Step 2: Understanding
    if (resultsStep === 2) {
      return (
        <div className="min-h-screen p-6 py-12" style={{ backgroundColor: ds.bg }}>
          <div className="max-w-2xl mx-auto">
            <Reveal animKey={animKey} delay={0}>
              <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: ds.surface }}>
                <div className="p-6 text-center" style={{ backgroundColor: patternData.color }}>
                  <div className="flex justify-center mb-2" style={{ color: ds.cream }}>
                    {patternData.icon}
                  </div>
                  <h1 style={{ color: ds.cream, fontSize: '1.5rem', fontWeight: 700 }}>
                    {patternData.title}
                  </h1>
                </div>

                <div className="p-8">
                  <p style={{ color: ds.cream, fontSize: '1.1rem', lineHeight: 1.7, marginBottom: 32 }}>
                    {patternData.description}
                  </p>
                  
                  <div style={{ borderTop: `1px solid ${ds.subtle}`, paddingTop: 24, marginBottom: 24 }}>
                    <p style={{ color: ds.cyan, fontSize: '0.9rem', fontWeight: 600, marginBottom: 12 }}>
                      Why this happens
                    </p>
                    <p style={{ color: ds.cream, opacity: 0.85, lineHeight: 1.6, marginBottom: 16 }}>
                      {patternData.mechanism}
                    </p>
                    <p style={{ color: ds.cream, opacity: 0.85, lineHeight: 1.6 }}>
                      {patternData.note}
                    </p>
                  </div>

                  <p style={{ color: ds.muted, fontSize: '0.8rem' }}>
                    Research: {patternData.citation}
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal animKey={animKey} delay={200}>
              <div className="flex gap-4 justify-center mt-8">
                <button
                  onClick={() => setResultsStep(1)}
                  className="px-6 py-3 rounded-xl font-semibold transition-all"
                  style={{ backgroundColor: ds.subtle, color: ds.cream }}
                >
                  <ArrowLeft size={20} />
                </button>
                <button
                  onClick={() => setResultsStep(3)}
                  className="px-8 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all hover:scale-105"
                  style={{ backgroundColor: ds.coral, color: ds.cream }}
                >
                  What you shared <ArrowRight size={20} />
                </button>
              </div>
            </Reveal>
          </div>
        </div>
      );
    }

    // Step 3: What You Shared (personalized reflection)
    if (resultsStep === 3) {
      return (
        <div className="min-h-screen p-6 py-12" style={{ backgroundColor: ds.bg }}>
          <div className="max-w-2xl mx-auto">
            <Reveal animKey={animKey} delay={0}>
              <p style={{ color: ds.muted, fontSize: '0.9rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 }}>
                What you shared
              </p>
            </Reveal>

            <Reveal animKey={animKey} delay={150}>
              <div className="rounded-2xl p-8" style={{ backgroundColor: ds.surface }}>
                <p style={{ color: ds.cream, fontSize: '1.1rem', lineHeight: 1.7, marginBottom: 24 }}>
                  {reflectionBlock.prose}
                </p>

                <div style={{ borderTop: `1px solid ${ds.subtle}`, paddingTop: 24, marginBottom: 24 }}>
                  <p style={{ color: ds.cream, opacity: 0.85, lineHeight: 1.6, marginBottom: 16 }}>
                    {reflectionBlock.researchContext}
                  </p>
                  <p style={{ color: ds.muted, fontSize: '0.9rem' }}>
                    Source:{' '}
                    <a 
                      href={reflectionBlock.researchLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1"
                      style={{ color: ds.cyan }}
                    >
                      {reflectionBlock.researchCitation} <ExternalLink size={12} />
                    </a>
                  </p>
                </div>

                <p style={{ color: ds.cream, fontSize: '1.1rem', lineHeight: 1.6 }}>
                  {reflectionBlock.closingLine}
                </p>
              </div>
            </Reveal>

            <Reveal animKey={animKey} delay={300}>
              <div className="flex gap-4 justify-center mt-8">
                <button
                  onClick={() => setResultsStep(2)}
                  className="px-6 py-3 rounded-xl font-semibold transition-all"
                  style={{ backgroundColor: ds.subtle, color: ds.cream }}
                >
                  <ArrowLeft size={20} />
                </button>
                <button
                  onClick={() => setResultsStep(4)}
                  className="px-8 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all hover:scale-105"
                  style={{ backgroundColor: ds.coral, color: ds.cream }}
                >
                  What's next <ArrowRight size={20} />
                </button>
              </div>
            </Reveal>
          </div>
        </div>
      );
    }

    // Step 4: What SEEN Is
    if (resultsStep === 4) {
      return (
        <div className="min-h-screen p-6 py-12" style={{ backgroundColor: ds.bg }}>
          <div className="max-w-2xl mx-auto relative">
            <Orb size={400} x="80%" y="20%" opacity={0.08} />
            
            <Reveal animKey={animKey} delay={0}>
              <div className="text-center mb-10">
                <h1 style={{ color: ds.cream, fontSize: '1.75rem', fontWeight: 700, marginBottom: 8, lineHeight: 1.3 }}>
                  What you just saw is a glimpse.
                </h1>
                <p style={{ color: ds.muted, fontSize: '1.1rem' }}>
                  Your pattern didn't form overnight. Understanding it won't either.
                </p>
              </div>
            </Reveal>

            <Reveal animKey={animKey} delay={200}>
              <div className="rounded-2xl p-8" style={{ backgroundColor: ds.surface }}>
                <p style={{ color: ds.cream, fontSize: '1.1rem', lineHeight: 1.6, marginBottom: 24 }}>
                  Think of it like health tracking — but for your patterns.
                </p>
                
                <div className="space-y-5">
                  <p style={{ color: ds.cream, opacity: 0.85, lineHeight: 1.6 }}>
                    SEEN is an app that lives on your phone. It reaches out to you. A few quick questions, 30 seconds, done.
                  </p>

                  <p style={{ color: ds.cream, opacity: 0.85, lineHeight: 1.6 }}>
                    Over time, it spots what you can't see yourself: which days are hardest, what triggers what, how your stress and your behavior connect.
                  </p>

                  <p style={{ color: ds.coral, fontWeight: 500, lineHeight: 1.6 }}>
                    Completely anonymous. No account required. No real name. Just a private mirror that gets sharper the more honest you are with it.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal animKey={animKey} delay={400}>
              <div className="flex gap-4 justify-center mt-8">
                <button
                  onClick={() => setResultsStep(3)}
                  className="px-6 py-3 rounded-xl font-semibold transition-all"
                  style={{ backgroundColor: ds.subtle, color: ds.cream }}
                >
                  <ArrowLeft size={20} />
                </button>
                <button
                  onClick={() => setResultsStep(5)}
                  className="px-8 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all hover:scale-105"
                  style={{ backgroundColor: ds.coral, color: ds.cream }}
                >
                  Why I'm building this <ArrowRight size={20} />
                </button>
              </div>
            </Reveal>
          </div>
        </div>
      );
    }

    // Step 5: Founder Story + Gap
    if (resultsStep === 5) {
      return (
        <div className="min-h-screen p-6 py-12" style={{ backgroundColor: ds.bg }}>
          <div className="max-w-2xl mx-auto">
            <Reveal animKey={animKey} delay={0}>
              <div className="text-center mb-10">
                <h1 style={{ color: ds.cream, fontSize: '1.75rem', fontWeight: 700 }}>
                  Why I'm building SEEN
                </h1>
              </div>
            </Reveal>

            <Reveal animKey={animKey} delay={150}>
              <div className="rounded-2xl p-8" style={{ backgroundColor: ds.surface }}>
                <div className="space-y-5 mb-8">
                  <p style={{ color: ds.cream, fontSize: '1.1rem', lineHeight: 1.6 }}>
                    I spent years stuck in my own pattern without seeing it clearly.
                  </p>

                  <p style={{ color: ds.cream, opacity: 0.85, lineHeight: 1.6 }}>
                    I knew something was off. I kept doing things I said I wouldn't. But I wasn't in crisis — not obviously — so I told myself it was fine. By the time I got help, a lot had already broken.
                  </p>

                  <p style={{ color: ds.cream, opacity: 0.85, lineHeight: 1.6 }}>
                    When I finally started talking about it, I realized I wasn't unique. So many people are stuck in this same gap — knowing something's wrong, but not enough to do anything about it.
                  </p>
                </div>

                <div style={{ borderTop: `1px solid ${ds.subtle}`, paddingTop: 24, marginBottom: 24 }}>
                  <p style={{ color: ds.cyan, fontSize: '0.9rem', fontWeight: 600, marginBottom: 16 }}>
                    The gap is real
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <span style={{ color: ds.coral, fontSize: '2rem', fontWeight: 800, lineHeight: 1 }}>11</span>
                      <div>
                        <p style={{ color: ds.cream, opacity: 0.85 }}>
                          <span style={{ fontWeight: 600 }}>years</span> — average time between first symptoms and getting help
                        </p>
                        <p style={{ color: ds.muted, fontSize: '0.8rem', marginTop: 4 }}>
                          World Health Organization, 2022
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <span style={{ color: ds.coral, fontSize: '2rem', fontWeight: 800, lineHeight: 1 }}>70%</span>
                      <div>
                        <p style={{ color: ds.cream, opacity: 0.85 }}>
                          of people who need mental health support <span style={{ fontWeight: 600 }}>never receive it</span>
                        </p>
                        <p style={{ color: ds.muted, fontSize: '0.8rem', marginTop: 4 }}>
                          World Health Organization, Global Mental Health Report
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <p style={{ color: ds.cream, opacity: 0.85, lineHeight: 1.6 }}>
                    There's almost nothing for that gap. Meditation apps don't touch it. Therapy is a big step. Most people just... wait. Until something breaks.
                  </p>
                  <p style={{ color: ds.cream, fontSize: '1.1rem', lineHeight: 1.6 }}>
                    That's what SEEN is for. Not to replace therapy — but to help you see clearly enough to know what you actually need.
                  </p>
                </div>
                
                <p style={{ color: ds.muted, fontStyle: 'italic', marginTop: 32 }}>
                  — Bas
                </p>
              </div>
            </Reveal>

            <Reveal animKey={animKey} delay={300}>
              <div className="flex gap-4 justify-center mt-8">
                <button
                  onClick={() => setResultsStep(4)}
                  className="px-6 py-3 rounded-xl font-semibold transition-all"
                  style={{ backgroundColor: ds.subtle, color: ds.cream }}
                >
                  <ArrowLeft size={20} />
                </button>
                <button
                  onClick={() => setResultsStep(6)}
                  className="px-8 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all hover:scale-105"
                  style={{ backgroundColor: ds.coral, color: ds.cream }}
                >
                  Stay in touch <ArrowRight size={20} />
                </button>
              </div>
            </Reveal>
          </div>
        </div>
      );
    }

    // Step 6: Sign Up
    if (resultsStep === 6) {
      return (
        <div className="min-h-screen p-6 py-12" style={{ backgroundColor: ds.bg }}>
          <div className="max-w-2xl mx-auto">
            <Reveal animKey={animKey} delay={0}>
              <div className="rounded-2xl p-8 text-center relative overflow-hidden" style={{ backgroundColor: ds.coral }}>
                <Orb color={ds.cream} size={200} x="80%" y="20%" opacity={0.1} />
                
                <h2 style={{ color: ds.cream, fontSize: '1.5rem', fontWeight: 700, marginBottom: 8 }}>
                  Get your results + updates
                </h2>
                <p style={{ color: ds.cream, opacity: 0.85, marginBottom: 24 }}>
                  We'll send you a summary of your pattern and let you know when we launch.
                </p>

                <div className="space-y-4 text-left mb-8 max-w-md mx-auto">
                  {[
                    "A few emails about your specific pattern — what drives it, what helps",
                    "My story — why I built this and what I learned",
                    "First access when SEEN is ready",
                    "Founding member pricing (first 100 signups)"
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <Check size={18} color={ds.cream} />
                      <span style={{ color: ds.cream, fontSize: '0.95rem' }}>{item}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="flex-1 px-4 py-3 rounded-xl"
                    style={{ backgroundColor: ds.cream, color: ds.bg }}
                  />
                  <button
                    className="px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105"
                    style={{ backgroundColor: ds.bg, color: ds.cream }}
                  >
                    Send results
                  </button>
                </div>
                
                <p style={{ color: ds.cream, opacity: 0.6, fontSize: '0.8rem', marginTop: 16 }}>
                  Use any email you're comfortable with — anonymous is fine. Unsubscribe anytime.
                </p>
              </div>
            </Reveal>

            {/* Tester login */}
            <Reveal animKey={animKey} delay={200}>
              <div className="mt-8 p-6 rounded-xl text-center" style={{ backgroundColor: ds.surface }}>
                <p style={{ color: ds.muted, marginBottom: 12 }}>
                  Already have tester access?
                </p>
                <button
                  onClick={() => router.push('/login')}
                  className="px-6 py-2 rounded-lg font-medium transition-all"
                  style={{ backgroundColor: ds.subtle, color: ds.cream }}
                >
                  Log in
                </button>
              </div>
            </Reveal>

            {/* Research sources - no Reveal to prevent re-animation on toggle */}
            <div className="mt-8 rounded-xl" style={{ backgroundColor: ds.surface }}>
              <button
                onClick={() => setShowSources(!showSources)}
                className="w-full p-4 flex items-center justify-between font-medium"
                style={{ color: ds.cream }}
              >
                <span className="flex items-center gap-2">
                  <Brain size={18} color={ds.cyan} />
                  Research sources
                </span>
                {showSources ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              
              {showSources && (
                <div className="px-4 pb-4" style={{ borderTop: `1px solid ${ds.subtle}` }}>
                  <div className="pt-4 space-y-3">
                    {[
                      { cite: "Gross & John, 2003", title: "Emotion regulation", url: "https://doi.org/10.1037/0022-3514.85.2.348" },
                      { cite: "Aldao et al., 2010", title: "Emotion-regulation strategies", url: "https://doi.org/10.1016/j.cpr.2009.11.004" },
                      { cite: "Prochaska & DiClemente, 1983", title: "Stages of change", url: "https://doi.org/10.1037/0022-006X.51.3.390" },
                      { cite: "Tice et al., 2001", title: "Emotional distress regulation", url: "https://doi.org/10.1037/0022-3514.80.1.53" },
                    ].map((source, idx) => (
                      <a
                        key={idx}
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-3 rounded-lg transition-all"
                        style={{ backgroundColor: ds.bg }}
                      >
                        <p style={{ color: ds.cream, fontSize: '0.9rem', fontWeight: 500 }}>
                          {source.cite}
                        </p>
                        <p style={{ color: ds.muted, fontSize: '0.8rem' }}>
                          {source.title}
                        </p>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Back button */}
            <Reveal animKey={animKey} delay={300}>
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => setResultsStep(5)}
                  className="px-6 py-3 rounded-xl font-semibold transition-all"
                  style={{ backgroundColor: ds.subtle, color: ds.cream }}
                >
                  <ArrowLeft size={20} />
                </button>
              </div>
            </Reveal>
          </div>
        </div>
      );
    }
  }

  return null;
}
