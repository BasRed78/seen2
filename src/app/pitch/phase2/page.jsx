'use client';

import React, { useState, useEffect, useRef } from 'react';

// Icons as simple SVG components
const ArrowRight = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);

const ArrowLeft = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 19l-7-7 7-7"/>
  </svg>
);

const Clock = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);

const Brain = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.5 2A5.5 5.5 0 0 0 4 7.5c0 1.12.33 2.16.9 3.03A5.5 5.5 0 0 0 7 16.5V22h4V2z"/>
    <path d="M14.5 2A5.5 5.5 0 0 1 20 7.5c0 1.12-.33 2.16-.9 3.03A5.5 5.5 0 0 1 17 16.5V22h-4V2z"/>
  </svg>
);

const Calendar = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const MessageCircle = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
  </svg>
);

const Target = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
  </svg>
);

const BookOpen = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>
);

const Heart = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

const CheckCircle = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

const Shield = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const Compass = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
  </svg>
);

// Design system - cyan accent for Phase 2
const ds = {
  bg: '#0f0f1a',
  surface: '#1a1a2e',
  surfaceLight: '#252542',
  cyan: '#4ECDC4',
  cyanDark: '#3BA89F',
  cream: '#faf8f5',
  muted: 'rgba(250,248,245,0.4)',
  subtle: 'rgba(250,248,245,0.12)',
  coral: '#e85a4f',
  gold: '#FFD93D',
};

const ChatMessage = ({ msg, isAi }) => (
  <div>
    {isAi ? (
      <div className="px-4 py-3 rounded-xl rounded-tl-sm" style={{ backgroundColor: ds.bg, maxWidth: '90%' }}>
        <p style={{ color: ds.cream, fontSize: '0.85rem', lineHeight: 1.4 }}>{msg}</p>
      </div>
    ) : (
      <div className="px-4 py-3 rounded-xl rounded-tr-sm ml-auto" style={{ backgroundColor: ds.cyan, maxWidth: '85%' }}>
        <p style={{ color: ds.cream, fontSize: '0.85rem', lineHeight: 1.4 }}>{msg}</p>
      </div>
    )}
  </div>
);

export default function Phase2Pitch() {
  const [slide, setSlide] = useState(0);
  const [key, setKey] = useState(0);
  const [gapStep, setGapStep] = useState(0);
  const [forgetStep, setForgetStep] = useState(0);
  const [statsStep, setStatsStep] = useState(0);
  const [notStep, setNotStep] = useState(0);
  const [functionalStep, setFunctionalStep] = useState(0);
  const [funcSubStep, setFuncSubStep] = useState(0);
  const [bridgeStep, setBridgeStep] = useState(0);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current && funcSubStep >= 6 && functionalStep === 0) {
      const timer = setTimeout(() => {
        const container = chatContainerRef.current;
        if (container) {
          container.scrollTop = container.scrollHeight - container.clientHeight;
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [funcSubStep, functionalStep]);

  const totalSlides = 14;

  const goTo = (n) => {
    setSlide(n);
    setKey(k => k + 1);
    if (n !== 2) setGapStep(0);
    if (n !== 3) setForgetStep(0);
    if (n !== 4) setStatsStep(0);
    if (n !== 6) setNotStep(0);
    if (n !== 8) setFunctionalStep(0);
    if (n !== 11) setBridgeStep(0);
  };

  const handleNext = () => {
    if (slide === 2 && gapStep < 2) setGapStep(s => s + 1);
    else if (slide === 3 && forgetStep < 3) setForgetStep(s => s + 1);
    else if (slide === 4 && statsStep < 2) setStatsStep(s => s + 1);
    else if (slide === 6 && notStep < 3) setNotStep(s => s + 1);
    else if (slide === 8 && functionalStep < 2) setFunctionalStep(s => s + 1);
    else if (slide === 11 && bridgeStep < 2) setBridgeStep(s => s + 1);
    else if (slide < totalSlides - 1) goTo(slide + 1);
  };

  const handlePrev = () => {
    if (slide === 2 && gapStep > 0) setGapStep(s => s - 1);
    else if (slide === 3 && forgetStep > 0) setForgetStep(s => s - 1);
    else if (slide === 4 && statsStep > 0) setStatsStep(s => s - 1);
    else if (slide === 6 && notStep > 0) setNotStep(s => s - 1);
    else if (slide === 8 && functionalStep > 0) setFunctionalStep(s => s - 1);
    else if (slide === 11 && bridgeStep > 0) setBridgeStep(s => s - 1);
    else if (slide > 0) goTo(slide - 1);
  };

  const Reveal = ({ children, delay = 0, y = 40, className = '' }) => {
    const [show, setShow] = useState(false);
    useEffect(() => {
      setShow(false);
      const t = setTimeout(() => setShow(true), delay);
      return () => clearTimeout(t);
    }, [key, delay]);
    return (
      <div className={className} style={{ opacity: show ? 1 : 0, transform: show ? 'translateY(0)' : `translateY(${y}px)`, transition: 'opacity 0.8s ease-out, transform 0.8s ease-out' }}>
        {children}
      </div>
    );
  };

  // Animation for FunctionalSlide sub-steps
  useEffect(() => {
    if (slide === 8) {
      setFuncSubStep(0);
      const timers = [];

      if (functionalStep === 0) {
        // Beat 0: Post-session reflection flow
        timers.push(setTimeout(() => setFuncSubStep(1), 800));
        timers.push(setTimeout(() => setFuncSubStep(2), 2200));
        timers.push(setTimeout(() => setFuncSubStep(3), 3600));
        timers.push(setTimeout(() => setFuncSubStep(4), 5000));
        timers.push(setTimeout(() => setFuncSubStep(5), 6400));
        timers.push(setTimeout(() => setFuncSubStep(6), 7800));
        timers.push(setTimeout(() => setFuncSubStep(7), 9200));
        timers.push(setTimeout(() => setFuncSubStep(8), 10600));
        timers.push(setTimeout(() => setFuncSubStep(9), 12000));
        timers.push(setTimeout(() => setFuncSubStep(10), 13400));
      } else if (functionalStep === 1) {
        // Beat 1: Exercise selection + scheduling
        timers.push(setTimeout(() => setFuncSubStep(1), 800));
        timers.push(setTimeout(() => setFuncSubStep(2), 1800));
        timers.push(setTimeout(() => setFuncSubStep(3), 2800));
        timers.push(setTimeout(() => setFuncSubStep(4), 4000));
      } else if (functionalStep === 2) {
        // Beat 2: AI check-in conversation
        timers.push(setTimeout(() => setFuncSubStep(1), 800));
        timers.push(setTimeout(() => setFuncSubStep(2), 2200));
        timers.push(setTimeout(() => setFuncSubStep(3), 3600));
        timers.push(setTimeout(() => setFuncSubStep(4), 5000));
        timers.push(setTimeout(() => setFuncSubStep(5), 6400));
        timers.push(setTimeout(() => setFuncSubStep(6), 7800));
        timers.push(setTimeout(() => setFuncSubStep(7), 9200));
        timers.push(setTimeout(() => setFuncSubStep(8), 10400));
      }

      return () => timers.forEach(t => clearTimeout(t));
    }
  }, [slide, functionalStep]);

  const Orb = ({ color = ds.cyan, size = 500, x = '50%', y = '50%', opacity = 0.08 }) => (
    <div style={{ position: 'absolute', width: size, height: size, left: x, top: y, transform: 'translate(-50%, -50%)', background: `radial-gradient(circle, ${color} 0%, transparent 70%)`, opacity, pointerEvents: 'none' }} />
  );

  const Star = ({ size = 28 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={ds.cyan}>
      <path d="M12 0L13.5 10.5L24 12L13.5 13.5L12 24L10.5 13.5L0 12L10.5 10.5L12 0Z" />
    </svg>
  );

  const AccentLine = () => <div style={{ width: 60, height: 4, backgroundColor: ds.cyan, borderRadius: 2 }} />;

  // SLIDES

  // 0 — Title
  const TitleSlide = () => (
    <div className="text-center relative">
      <Orb size={700} x="60%" y="40%" opacity={0.1} />
      <Reveal delay={0}>
        <div className="flex items-center justify-center gap-4 mb-6">
          <Star size={52} />
          <h1 style={{ color: ds.cream, fontSize: '5rem', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 0.9 }}>Seen</h1>
        </div>
      </Reveal>
      <Reveal delay={200}>
        <p style={{ color: ds.cyan, fontSize: '1.5rem', fontWeight: 700 }}>Phase 2: Practice</p>
      </Reveal>
      <Reveal delay={400}>
        <p style={{ color: ds.muted, fontSize: '1.15rem', marginTop: 12 }}>Support between therapy sessions.</p>
      </Reveal>
    </div>
  );

  // 1 — Context: Phase 1 recap
  const ContextSlide = () => (
    <div className="relative max-w-xl">
      <Orb size={400} x="80%" y="60%" opacity={0.08} />
      <Reveal delay={0}><AccentLine /></Reveal>
      <Reveal delay={100}><p style={{ color: ds.muted, fontSize: '0.9rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: 24, marginBottom: 32 }}>Where Phase 1 ends</p></Reveal>
      <Reveal delay={200}><p style={{ color: ds.cream, fontSize: '1.4rem', fontWeight: 600, marginBottom: 24, lineHeight: 1.4 }}>Phase 1 helps people see the pattern. That awareness changes everything.</p></Reveal>
      <Reveal delay={350}><p style={{ color: ds.muted, fontSize: '1.15rem', marginBottom: 24, lineHeight: 1.5 }}>But seeing it clearly is often the thing that pushes someone to get help. They start therapy.</p></Reveal>
      <Reveal delay={500}><p style={{ color: ds.muted, fontSize: '1.15rem', marginBottom: 32, lineHeight: 1.5 }}>And then they discover a new gap.</p></Reveal>
      <Reveal delay={700}><p style={{ color: ds.cyan, fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.3 }}>Therapy works. But only if you do.</p></Reveal>
    </div>
  );

  // 2 — The 167 hour gap
  const GapSlide = () => (
    <div className="relative text-center" style={{ height: 300 }}>
      <Orb size={600} x="50%" y="50%" opacity={0.08} />
      <p style={{ color: ds.muted, fontSize: '0.9rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 24 }}>The therapy gap</p>
      <div style={{ position: 'relative', height: 180 }}>
        {[
          { stat: '1 hr', desc: 'with your therapist each week' },
          { stat: '167 hrs', desc: 'on your own between sessions' },
          { stat: '99.4%', desc: 'of your week is spent without support' },
        ].map((item, i) => (
          <div key={i} style={{ position: 'absolute', width: '100%', top: 0, transition: 'opacity 0.5s ease, transform 0.5s ease', opacity: gapStep === i ? 1 : 0, transform: gapStep === i ? 'translateY(0)' : 'translateY(30px)' }}>
            <h2 style={{ color: ds.cyan, fontSize: '6rem', fontWeight: 900, lineHeight: 0.85, letterSpacing: '-0.04em' }}>{item.stat}</h2>
            <p style={{ color: ds.cream, fontSize: '1.25rem', fontWeight: 700, marginTop: 16, lineHeight: 1.2 }}>{item.desc}</p>
          </div>
        ))}
      </div>
      <p style={{ position: 'absolute', bottom: 0, left: 0, right: 0, color: ds.muted, fontSize: '0.8rem', opacity: gapStep < 2 ? 1 : 0 }}>{gapStep < 2 ? 'Click \u2192 to continue' : ''}</p>
    </div>
  );

  // 3 — What happens between sessions
  const ForgetSlide = () => (
    <div className="relative text-center">
      <Orb size={400} x="50%" y="50%" opacity={0.08} />
      <div className="flex justify-center mb-5"><AccentLine /></div>
      <h2 style={{ color: ds.cream, fontSize: '2rem', fontWeight: 800, marginBottom: 40 }}>What happens between sessions?</h2>
      <div style={{ height: 170, position: 'relative', overflow: 'hidden' }}>
        {[
          { quote: 'The insight fades', explain: "By Wednesday, the breakthrough from Monday's session feels distant.", cite: 'Kazantzis et al., 2016 \u2014 Cognitive Behaviour Therapy' },
          { quote: 'The homework doesn\'t happen', explain: "Life takes over. Good intentions stay on the therapist's notepad.", cite: 'Helbig & Fehm, 2004 \u2014 therapy homework compliance' },
          { quote: '"What did we even talk about?"', explain: "You walk into the next session and can't remember what felt so important.", cite: 'Tang & DeRubeis, 1999 \u2014 session recall' },
        ].map((item, i) => (
          <div key={i} style={{ position: 'absolute', width: '100%', transition: 'all 0.6s ease', transform: forgetStep === i ? 'translateY(0)' : forgetStep > i ? 'translateY(-100px)' : 'translateY(100px)', opacity: forgetStep === i ? 1 : 0 }}>
            <p style={{ color: ds.cyan, fontSize: '2.25rem', fontWeight: 800, lineHeight: 1.2, marginBottom: 12 }}>{item.quote}</p>
            <p style={{ color: ds.muted, fontSize: '1.1rem', maxWidth: 450, margin: '0 auto', lineHeight: 1.4 }}>{item.explain}</p>
            <p style={{ color: ds.cyan, fontSize: '0.75rem', marginTop: 12, opacity: 0.6 }}>{item.cite}</p>
          </div>
        ))}
        <div style={{ position: 'absolute', width: '100%', transition: 'all 0.6s ease', transform: forgetStep === 3 ? 'translateY(0)' : 'translateY(100px)', opacity: forgetStep === 3 ? 1 : 0 }}>
          <p style={{ color: ds.cyan, fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.4, maxWidth: 480, margin: '0 auto' }}>The work between sessions is where change actually happens. But no one supports it.</p>
        </div>
      </div>
    </div>
  );

  // 4 — Research stats
  const StatsSlide = () => (
    <div className="relative text-center" style={{ height: 320 }}>
      <Orb size={500} x="50%" y="40%" opacity={0.08} />
      <p style={{ color: ds.muted, fontSize: '0.9rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 24 }}>What the research says</p>
      <div style={{ height: 240, position: 'relative' }}>
        {[
          { stat: '50%', highlight: 'of therapy homework', desc: 'is never completed. The assignments that could accelerate progress go undone.', cite: 'Kazantzis, Deane & Ronan, 2000' },
          { stat: '2\u00d7', highlight: 'faster progress', desc: 'when clients do engage with between-session work. Therapy homework doubles the rate of improvement.', cite: 'Mausbach et al., 2010 \u2014 meta-analysis' },
          { stat: '80%', highlight: 'of therapeutic gains', desc: 'happen outside the therapy room. The session plants the seed \u2014 practice grows it.', cite: 'Scheel et al., 2004' },
        ].map((item, i) => (
          <div key={i} style={{ position: 'absolute', width: '100%', top: 0, transition: 'all 0.5s ease', opacity: statsStep === i ? 1 : 0, transform: statsStep === i ? 'translateY(0)' : 'translateY(30px)' }}>
            <h2 style={{ color: ds.cyan, fontSize: '5rem', fontWeight: 900, lineHeight: 0.9, letterSpacing: '-0.04em' }}>{item.stat}</h2>
            <p style={{ color: ds.cream, fontSize: '1.25rem', fontWeight: 700, marginTop: 16, lineHeight: 1.3 }}>{item.highlight}</p>
            <p style={{ color: ds.muted, fontSize: '1.05rem', marginTop: 12, maxWidth: 480, margin: '12px auto 0', lineHeight: 1.5 }}>{item.desc}</p>
            <p style={{ color: ds.cyan, fontSize: '0.75rem', marginTop: 12, opacity: 0.5 }}>{item.cite}</p>
          </div>
        ))}
      </div>
      <p style={{ position: 'absolute', bottom: 0, left: 0, right: 0, color: ds.muted, fontSize: '0.8rem', opacity: statsStep < 2 ? 1 : 0 }}>{statsStep < 2 ? 'Click \u2192 to continue' : ''}</p>
    </div>
  );

  // 5 — What Phase 2 is
  const WhatSlide = () => (
    <div className="text-center relative">
      <Orb size={600} x="50%" y="50%" opacity={0.08} />
      <Reveal delay={0}><p style={{ color: ds.muted, fontSize: '1.1rem', marginBottom: 32 }}>This is the space between</p></Reveal>
      <Reveal delay={150}><h2 style={{ color: ds.cyan, fontSize: '2.25rem', fontWeight: 800 }}>"I had a great session"</h2></Reveal>
      <Reveal delay={300}>
        <div className="flex items-center justify-center gap-4 my-5">
          <div style={{ width: 40, height: 2, backgroundColor: ds.subtle }} />
          <p style={{ color: ds.muted, fontSize: '0.9rem', fontStyle: 'italic' }}>and</p>
          <div style={{ width: 40, height: 2, backgroundColor: ds.subtle }} />
        </div>
      </Reveal>
      <Reveal delay={450}><h2 style={{ color: ds.cyan, fontSize: '2.25rem', fontWeight: 800, marginBottom: 40 }}>"What did we even talk about?"</h2></Reveal>
      <Reveal delay={650}><p style={{ color: ds.cream, fontSize: '1.5rem', fontWeight: 700 }}>Phase 2 fills that space.</p></Reveal>
    </div>
  );

  // 6 — What Phase 2 is NOT
  const NotSlide = () => {
    const items = ['A replacement for therapy', 'A diagnosis tool', 'Clinical advice'];
    return (
      <div className="text-center relative" style={{ height: 380 }}>
        <Orb size={500} x="50%" y="50%" opacity={0.06} />
        <p style={{ color: ds.muted, fontSize: '0.9rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 20 }}>Important</p>
        <div className="flex items-center justify-center gap-3 mb-12">
          <span style={{ color: ds.cream, fontSize: '2.5rem', fontWeight: 800 }}>Phase 2 is</span>
          <span style={{ color: ds.cyan, fontSize: '2.5rem', fontWeight: 800 }}>not</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          {items.map((item, i) => (
            <div
              key={i}
              style={{
                opacity: notStep > i ? 1 : 0,
                transform: notStep > i ? 'translateY(0)' : 'translateY(20px)',
                transition: 'all 0.5s ease'
              }}
            >
              <span style={{ color: ds.muted, fontSize: '2rem', fontWeight: 600 }}>{item}</span>
            </div>
          ))}
        </div>
        <div style={{ opacity: notStep >= 3 ? 1 : 0, transform: notStep >= 3 ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s ease', marginTop: 32 }}>
          <p style={{ color: ds.cyan, fontSize: '1.3rem', fontWeight: 700, lineHeight: 1.5 }}>
            Your therapist leads. Seen supports the work in between.
          </p>
        </div>
      </div>
    );
  };

  // 7 — How it works overview
  const HowSlide = () => {
    const [howStep, setHowStep] = useState(0);
    const steps = [
      { icon: <Heart size={22} />, title: 'Reflect after your session', desc: 'Capture what came up, how you feel, and what resonated \u2014 while it\'s fresh.' },
      { icon: <BookOpen size={22} />, title: 'Choose exercises to practice', desc: 'Matched to the themes from your session. Or pick your own.' },
      { icon: <Calendar size={22} />, title: 'Plan them into your week', desc: 'Schedule exercises into your calendar. Seen nudges you when they\'re coming up.' },
      { icon: <MessageCircle size={22} />, title: 'Daily check-ins that remember', desc: 'Conversations that know your therapy context. Not generic \u2014 personal.' },
    ];

    useEffect(() => {
      setHowStep(0);
      const timers = [
        setTimeout(() => setHowStep(1), 500),
        setTimeout(() => setHowStep(2), 1100),
        setTimeout(() => setHowStep(3), 1700),
        setTimeout(() => setHowStep(4), 2300),
        setTimeout(() => setHowStep(5), 3000),
      ];
      return () => timers.forEach(t => clearTimeout(t));
    }, [slide]);

    return (
      <div className="relative max-w-2xl mx-auto">
        <Orb size={500} x="70%" y="30%" opacity={0.08} />
        <div style={{ opacity: howStep >= 0 ? 1 : 0, transform: howStep >= 0 ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s ease' }}>
          <div className="flex items-center gap-2 mb-3">
            <Star size={16} />
            <p style={{ color: ds.muted, fontSize: '0.9rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase' }}>How it works</p>
          </div>
          <h2 style={{ color: ds.cream, fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.15, marginBottom: 32 }}>
            <span style={{ color: ds.cyan }}>167 hours</span> of support.
          </h2>
        </div>

        <div className="space-y-4">
          {steps.map((s, i) => (
            <div
              key={i}
              className="p-5 rounded-xl flex items-start gap-4"
              style={{
                backgroundColor: ds.surface,
                opacity: howStep >= i + 1 ? 1 : 0,
                transform: howStep >= i + 1 ? 'translateX(0)' : 'translateX(-30px)',
                transition: 'all 0.5s ease'
              }}
            >
              <div className="p-2 rounded-lg flex-shrink-0" style={{ backgroundColor: ds.bg, color: ds.cyan }}>
                {s.icon}
              </div>
              <div>
                <p style={{ color: ds.cyan, fontSize: '1.1rem', fontWeight: 700, marginBottom: 4 }}>{s.title}</p>
                <p style={{ color: ds.muted, fontSize: '1rem', lineHeight: 1.5 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ opacity: howStep >= 5 ? 1 : 0, transform: howStep >= 5 ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.8s ease', marginTop: 32 }}>
          <p style={{ color: ds.cyan, fontSize: '1.3rem', fontWeight: 700, lineHeight: 1.4 }}>
            Every hour of therapy, amplified.
          </p>
        </div>
      </div>
    );
  };

  // 8 — Functional demo (3 beats)
  const FunctionalSlide = () => {
    const reflectionSteps = [
      { label: 'How are you feeling?', type: 'scale', value: '7' },
      { label: 'What came up?', type: 'themes', values: ['Boundaries', 'Self-worth'] },
      { label: 'Reflection', type: 'text', value: 'I realised I keep saying yes to things that drain me because I\'m afraid of being seen as difficult. My therapist helped me see this isn\'t about being nice \u2014 it\'s about avoiding conflict.' },
      { label: 'Practice intention', type: 'intention', value: 'Say no to one request this week without explaining why' },
    ];

    const checkInConversation = [
      { type: 'ai', text: 'Hey Sarah, how are you doing today?' },
      { type: 'user', text: 'Better actually. Had a tough conversation at work.' },
      { type: 'ai', text: 'That sounds significant. You mentioned wanting to practice saying no. Was this related?' },
      { type: 'user', text: 'Yeah. Someone asked me to cover their shift and I said I couldn\'t. My heart was racing.' },
      { type: 'ai', text: 'That takes real courage, especially given what you reflected on after your session. How did it feel afterwards?' },
      { type: 'user', text: 'Scary but... good? They were fine with it. I was the one making it a big deal.' },
      { type: 'ai', text: 'That\u2019s a really important realisation. The fear was bigger than the actual consequence. That might be worth bringing to your therapist.' },
    ];

    return (
      <div className="relative">
        <Orb size={400} x="80%" y="20%" opacity={0.08} />

        {/* Beat 0: Post-session reflection */}
        <div style={{ opacity: functionalStep === 0 ? 1 : 0, position: functionalStep === 0 ? 'relative' : 'absolute', transition: 'opacity 0.6s ease', pointerEvents: functionalStep === 0 ? 'auto' : 'none' }}>
          <div className="text-center mb-6" style={{ opacity: funcSubStep >= 0 ? 1 : 0, transform: funcSubStep >= 0 ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.8s ease' }}>
            <p style={{ color: ds.muted, fontSize: '0.85rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>After your session</p>
            <h2 style={{ color: ds.cream, fontSize: '2.25rem', fontWeight: 800 }}>Capture it while it's fresh</h2>
          </div>

          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center justify-center">
            {/* iPhone Frame */}
            <div style={{
              backgroundColor: '#1c1c1e',
              borderRadius: 44,
              padding: 12,
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.1)',
              opacity: funcSubStep >= 1 ? 1 : 0,
              transform: funcSubStep >= 1 ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.8s ease'
            }}>
              <div className="flex flex-col" style={{
                backgroundColor: ds.surface,
                borderRadius: 32,
                width: 280,
                height: 520,
                overflow: 'hidden',
              }}>
                {/* Dynamic Island */}
                <div className="flex justify-center pt-3 pb-2">
                  <div style={{ backgroundColor: '#000', width: 90, height: 28, borderRadius: 20 }} />
                </div>
                {/* Header */}
                <div className="flex items-center justify-between px-4 pb-3 flex-shrink-0" style={{ borderBottom: `1px solid ${ds.subtle}` }}>
                  <div className="flex items-center gap-2">
                    <Star size={14} />
                    <span style={{ color: ds.cream, fontSize: '0.85rem', fontWeight: 600 }}>Post-Session Reflection</span>
                  </div>
                </div>
                {/* Content */}
                <div className="px-4 py-4 flex-1 overflow-hidden">
                  {/* Progress dots */}
                  <div className="flex justify-center gap-2 mb-5" style={{ opacity: funcSubStep >= 2 ? 1 : 0, transition: 'all 0.5s ease' }}>
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="rounded-full" style={{
                        width: 8, height: 8,
                        backgroundColor: funcSubStep >= (i * 2) ? ds.cyan : ds.surfaceLight,
                        transition: 'all 0.3s ease'
                      }} />
                    ))}
                  </div>

                  {/* Step 1: Emotional scale */}
                  {funcSubStep >= 2 && funcSubStep < 4 && (
                    <div style={{ opacity: 1, transition: 'all 0.5s ease' }}>
                      <p className="text-center mb-4" style={{ color: ds.cream, fontSize: '1rem', fontWeight: 600 }}>How are you feeling right now?</p>
                      <div className="flex justify-center gap-1.5 flex-wrap">
                        {[1,2,3,4,5,6,7,8,9,10].map(n => (
                          <div key={n} className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{
                            backgroundColor: n === 7 ? ds.cyan : ds.bg,
                            color: ds.cream,
                            border: n === 7 ? 'none' : `1px solid ${ds.subtle}`,
                          }}>{n}</div>
                        ))}
                      </div>
                      <div className="flex justify-between mt-2 px-1">
                        <span style={{ color: ds.muted, fontSize: '0.65rem' }}>Low</span>
                        <span style={{ color: ds.muted, fontSize: '0.65rem' }}>High</span>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Themes */}
                  {funcSubStep >= 4 && funcSubStep < 6 && (
                    <div style={{ opacity: 1, transition: 'all 0.5s ease' }}>
                      <p className="text-center mb-4" style={{ color: ds.cream, fontSize: '1rem', fontWeight: 600 }}>What came up in your session?</p>
                      <div className="space-y-2">
                        {['Boundaries', 'Self-worth', 'Relationships', 'Anxiety'].map((theme, i) => (
                          <div key={theme} className="p-3 rounded-xl" style={{
                            backgroundColor: i < 2 ? `${ds.cyan}15` : ds.bg,
                            border: i < 2 ? `1px solid ${ds.cyan}` : `1px solid ${ds.subtle}`,
                          }}>
                            <span style={{ color: i < 2 ? ds.cyan : ds.muted, fontSize: '0.85rem', fontWeight: 500 }}>{theme}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 3: Reflection text */}
                  {funcSubStep >= 6 && funcSubStep < 8 && (
                    <div style={{ opacity: 1, transition: 'all 0.5s ease' }}>
                      <p className="text-center mb-2" style={{ color: ds.cream, fontSize: '0.9rem', fontWeight: 600 }}>What stood out to you most?</p>
                      <div className="p-3 rounded-xl" style={{ backgroundColor: ds.bg, border: `1px solid ${ds.subtle}`, minHeight: 100 }}>
                        <p style={{ color: ds.cream, fontSize: '0.8rem', lineHeight: 1.5 }}>I realised I keep saying yes to things that drain me because I'm afraid of being seen as difficult...</p>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Practice intention */}
                  {funcSubStep >= 8 && (
                    <div style={{ opacity: 1, transition: 'all 0.5s ease' }}>
                      <p className="text-center mb-4" style={{ color: ds.cream, fontSize: '0.9rem', fontWeight: 600 }}>Something to practice this week?</p>
                      <div className="p-3 rounded-xl mb-3" style={{ backgroundColor: ds.bg, border: `1px solid ${ds.cyan}40` }}>
                        <p style={{ color: ds.cream, fontSize: '0.8rem', lineHeight: 1.5 }}>Say no to one request this week without explaining why</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg" style={{ backgroundColor: ds.bg, color: ds.cyan }}>
                          <Calendar size={12} />
                        </div>
                        <span style={{ color: ds.muted, fontSize: '0.75rem' }}>By Fri, 11 Apr</span>
                      </div>
                    </div>
                  )}
                </div>
                {/* Home indicator */}
                <div className="flex justify-center py-2">
                  <div style={{ backgroundColor: 'rgba(255,255,255,0.3)', width: 100, height: 4, borderRadius: 2 }} />
                </div>
              </div>
            </div>

            {/* Narrative */}
            <div className="text-center md:text-left" style={{ maxWidth: 280, opacity: funcSubStep >= 10 ? 1 : 0, transform: funcSubStep >= 10 ? 'translateY(0)' : 'translateY(20px)', transition: 'all 1s ease 0.3s' }}>
              <p style={{ color: ds.cream, fontSize: '1.15rem', lineHeight: 1.6, marginBottom: 16 }}>
                Walk out of your session. Open Seen. Two minutes to capture what matters.
              </p>
              <p style={{ color: ds.muted, fontSize: '1rem', lineHeight: 1.5 }}>
                Emotional state, themes, reflection, and an intention to carry forward.
              </p>
            </div>
          </div>
        </div>

        {/* Beat 1: Exercise scheduling */}
        <div style={{ opacity: functionalStep === 1 ? 1 : 0, position: functionalStep === 1 ? 'relative' : 'absolute', top: 0, width: '100%', transition: 'opacity 0.6s ease', pointerEvents: functionalStep === 1 ? 'auto' : 'none' }}>
          <div className="text-center mb-6" style={{ opacity: funcSubStep >= 0 ? 1 : 0, transform: funcSubStep >= 0 ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.8s ease' }}>
            <p style={{ color: ds.muted, fontSize: '0.85rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>Between sessions</p>
            <h2 style={{ color: ds.cream, fontSize: '2.25rem', fontWeight: 800 }}>Practice that fits your life</h2>
          </div>

          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center justify-center">
            <div className="space-y-3" style={{ width: 320 }}>
              {/* Recommended exercises */}
              <div className="p-4 rounded-xl" style={{ backgroundColor: ds.surface, opacity: funcSubStep >= 1 ? 1 : 0, transform: funcSubStep >= 1 ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.7s ease' }}>
                <p style={{ color: ds.muted, fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>Matched to your session</p>
                {[
                  { title: 'Setting a boundary', cat: 'Behavioural experiment', dur: '10 min' },
                  { title: 'Values check-in', cat: 'Self-reflection', dur: '5 min' },
                ].map((ex, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg mb-2" style={{ backgroundColor: ds.bg }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${ds.cyan}15` }}>
                      <BookOpen size={14} style={{ color: ds.cyan }} />
                    </div>
                    <div className="flex-1">
                      <p style={{ color: ds.cream, fontSize: '0.85rem', fontWeight: 600 }}>{ex.title}</p>
                      <p style={{ color: ds.muted, fontSize: '0.7rem' }}>{ex.dur} · {ex.cat}</p>
                    </div>
                    <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: ds.cyan + '30' }}>
                      <CheckCircle size={12} style={{ color: ds.cyan }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Schedule */}
              <div className="p-4 rounded-xl" style={{ backgroundColor: ds.surface, opacity: funcSubStep >= 2 ? 1 : 0, transform: funcSubStep >= 2 ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.7s ease' }}>
                <p style={{ color: ds.muted, fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>Scheduled this week</p>
                {[
                  { title: 'Setting a boundary', day: 'Wed', time: '9:00 AM', approaching: false },
                  { title: 'Values check-in', day: 'Fri', time: '7:00 PM', approaching: true },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg mb-2" style={{
                    backgroundColor: item.approaching ? `${ds.gold}10` : ds.bg,
                    border: item.approaching ? `1px solid ${ds.gold}30` : 'none',
                  }}>
                    <div>
                      <p style={{ color: ds.cream, fontSize: '0.85rem', fontWeight: 500 }}>{item.title}</p>
                      <p style={{ color: ds.muted, fontSize: '0.7rem' }}>{item.day} at {item.time}</p>
                    </div>
                    {item.approaching && (
                      <span className="px-2 py-1 rounded text-xs font-bold" style={{ backgroundColor: ds.gold, color: ds.bg }}>Soon</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Calendar export */}
              <div className="p-3 rounded-xl flex items-center gap-3" style={{
                backgroundColor: ds.surface,
                opacity: funcSubStep >= 3 ? 1 : 0,
                transform: funcSubStep >= 3 ? 'translateY(0)' : 'translateY(20px)',
                transition: 'all 0.7s ease',
                border: `1px solid ${ds.cyan}30`,
              }}>
                <Calendar size={16} style={{ color: ds.cyan }} />
                <p style={{ color: ds.cream, fontSize: '0.85rem' }}>Added to your calendar</p>
                <CheckCircle size={14} style={{ color: ds.cyan, marginLeft: 'auto' }} />
              </div>
            </div>

            {/* Narrative */}
            <div className="text-center md:text-left" style={{ maxWidth: 280, opacity: funcSubStep >= 4 ? 1 : 0, transform: funcSubStep >= 4 ? 'translateY(0)' : 'translateY(20px)', transition: 'all 1s ease 0.3s' }}>
              <p style={{ color: ds.cream, fontSize: '1.15rem', lineHeight: 1.6, marginBottom: 16 }}>
                Exercises matched to what came up in your session. Scheduled into your real life.
              </p>
              <p style={{ color: ds.muted, fontSize: '1rem', lineHeight: 1.5 }}>
                Goes straight into your calendar. Seen nudges you when it's time.
              </p>
            </div>
          </div>
        </div>

        {/* Beat 2: AI check-in that knows therapy context */}
        <div style={{ opacity: functionalStep === 2 ? 1 : 0, position: functionalStep === 2 ? 'relative' : 'absolute', top: 0, width: '100%', transition: 'opacity 0.6s ease', pointerEvents: functionalStep === 2 ? 'auto' : 'none' }}>
          <div className="text-center mb-6" style={{ opacity: funcSubStep >= 0 ? 1 : 0, transform: funcSubStep >= 0 ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.8s ease' }}>
            <p style={{ color: ds.muted, fontSize: '0.85rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>Every day</p>
            <h2 style={{ color: ds.cream, fontSize: '2.25rem', fontWeight: 800 }}>Check-ins that know your story</h2>
          </div>

          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center justify-center">
            {/* iPhone Frame */}
            <div style={{
              backgroundColor: '#1c1c1e',
              borderRadius: 44,
              padding: 12,
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.1)',
              opacity: funcSubStep >= 1 ? 1 : 0,
              transform: funcSubStep >= 1 ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.8s ease'
            }}>
              <div className="flex flex-col overflow-hidden" style={{
                backgroundColor: ds.surface,
                borderRadius: 32,
                width: 280,
                height: 520,
              }}>
                <div className="flex justify-center pt-3 pb-2">
                  <div style={{ backgroundColor: '#000', width: 90, height: 28, borderRadius: 20 }} />
                </div>
                <div className="flex items-center justify-between px-4 pb-3 flex-shrink-0" style={{ borderBottom: `1px solid ${ds.subtle}` }}>
                  <div className="flex items-center gap-2">
                    <Star size={14} />
                    <span style={{ color: ds.cream, fontSize: '0.85rem', fontWeight: 600 }}>Daily Check-in</span>
                  </div>
                  <span style={{ color: ds.muted, fontSize: '0.75rem' }}>Day 12</span>
                </div>
                <div ref={chatContainerRef} className="px-4 py-3 flex-1 hide-scrollbar" style={{ overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  <div className="space-y-3">
                    {checkInConversation.map((msg, i) => (
                      funcSubStep >= i + 1 ? (
                        <ChatMessage key={i} msg={msg.text} isAi={msg.type === 'ai'} />
                      ) : null
                    ))}
                  </div>
                </div>
                <div className="flex justify-center py-2">
                  <div style={{ backgroundColor: 'rgba(255,255,255,0.3)', width: 100, height: 4, borderRadius: 2 }} />
                </div>
              </div>
            </div>

            {/* Narrative */}
            <div className="text-center md:text-left" style={{ maxWidth: 280, opacity: funcSubStep >= 8 ? 1 : 0, transform: funcSubStep >= 8 ? 'translateY(0)' : 'translateY(20px)', transition: 'all 1s ease 0.3s' }}>
              <p style={{ color: ds.cream, fontSize: '1.15rem', lineHeight: 1.6, marginBottom: 16 }}>
                It remembers your session reflections, your intentions, your exercises.
              </p>
              <p style={{ color: ds.muted, fontSize: '1rem', lineHeight: 1.5 }}>
                And gently nudges you to bring things back to your therapist.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 9 — Therapist nudging
  const NudgeSlide = () => (
    <div className="relative max-w-xl">
      <Orb size={400} x="20%" y="40%" opacity={0.08} />
      <Reveal delay={0}><AccentLine /></Reveal>
      <Reveal delay={100}><p style={{ color: ds.muted, fontSize: '0.9rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: 24, marginBottom: 32 }}>The missing link</p></Reveal>
      <Reveal delay={200}><h2 style={{ color: ds.cream, fontSize: '2.25rem', fontWeight: 800, marginBottom: 24, lineHeight: 1.2 }}>Seen helps people <span style={{ color: ds.cyan }}>open up to their therapist.</span></h2></Reveal>
      <Reveal delay={400}><p style={{ color: ds.muted, fontSize: '1.15rem', marginBottom: 20, lineHeight: 1.5 }}>Many people hold back in therapy. They self-censor, minimise, or forget what they wanted to bring up.</p></Reveal>
      <Reveal delay={600}><p style={{ color: ds.muted, fontSize: '1.15rem', marginBottom: 20, lineHeight: 1.5 }}>Seen catches those moments in daily check-ins and encourages people to take them to their next session.</p></Reveal>
      <Reveal delay={800}>
        <div className="p-4 rounded-xl mt-6" style={{ backgroundColor: ds.surface, borderLeft: `3px solid ${ds.cyan}` }}>
          <p style={{ color: ds.cream, fontSize: '0.95rem', lineHeight: 1.5, fontStyle: 'italic' }}>
            "That sounds like something important to explore with your therapist. You don't have to have it all figured out \u2014 just bringing it is enough."
          </p>
        </div>
      </Reveal>
    </div>
  );

  // 10 — Exercise library
  const LibrarySlide = () => {
    const [libStep, setLibStep] = useState(0);
    const categories = [
      { name: 'Mindfulness & grounding', count: 8, icon: <Compass size={18} /> },
      { name: 'Emotion regulation', count: 6, icon: <Heart size={18} /> },
      { name: 'Behavioural experiments', count: 5, icon: <Target size={18} /> },
      { name: 'Values & direction', count: 7, icon: <Star size={18} /> },
      { name: 'Defusion & acceptance', count: 4, icon: <Brain size={18} /> },
      { name: 'Self-assessment', count: 3, icon: <CheckCircle size={18} /> },
    ];

    useEffect(() => {
      setLibStep(0);
      const timers = [
        setTimeout(() => setLibStep(1), 400),
        setTimeout(() => setLibStep(2), 700),
        setTimeout(() => setLibStep(3), 1000),
        setTimeout(() => setLibStep(4), 1300),
        setTimeout(() => setLibStep(5), 1600),
        setTimeout(() => setLibStep(6), 1900),
        setTimeout(() => setLibStep(7), 2600),
      ];
      return () => timers.forEach(t => clearTimeout(t));
    }, [slide]);

    return (
      <div className="relative max-w-2xl mx-auto">
        <Orb size={500} x="30%" y="70%" opacity={0.08} />
        <div style={{ opacity: libStep >= 0 ? 1 : 0, transform: libStep >= 0 ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s ease' }}>
          <div className="flex items-center gap-2 mb-3">
            <Star size={16} />
            <p style={{ color: ds.muted, fontSize: '0.9rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase' }}>The Library</p>
          </div>
          <h2 style={{ color: ds.cream, fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.15, marginBottom: 12 }}>
            Exercises grounded in <span style={{ color: ds.cyan }}>what works.</span>
          </h2>
          <p style={{ color: ds.muted, fontSize: '1.05rem', marginBottom: 32 }}>
            Drawn from CBT, ACT, DBT, and mindfulness-based approaches.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {categories.map((cat, i) => (
            <div
              key={i}
              className="p-4 rounded-xl"
              style={{
                backgroundColor: ds.surface,
                opacity: libStep >= i + 1 ? 1 : 0,
                transform: libStep >= i + 1 ? 'translateY(0)' : 'translateY(15px)',
                transition: 'all 0.4s ease',
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div style={{ color: ds.cyan }}>{cat.icon}</div>
                <span style={{ color: ds.cyan, fontSize: '0.75rem', fontWeight: 700 }}>{cat.count}</span>
              </div>
              <p style={{ color: ds.cream, fontSize: '0.9rem', fontWeight: 600 }}>{cat.name}</p>
            </div>
          ))}
        </div>

        <div style={{ opacity: libStep >= 7 ? 1 : 0, transform: libStep >= 7 ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.8s ease', marginTop: 28 }}>
          <p style={{ color: ds.muted, fontSize: '1rem', lineHeight: 1.5 }}>
            Plus the option to add your own \u2014 anything your therapist suggests, you can plan and track it here.
          </p>
        </div>
      </div>
    );
  };

  // 11 — The bridge metaphor
  const BridgeSlide = () => (
    <div className="text-center relative" style={{ height: 340 }}>
      <Orb size={500} x="50%" y="40%" opacity={0.08} />
      <div className="flex items-center justify-center gap-2 mb-3">
        <Star size={16} />
        <p style={{ color: ds.muted, fontSize: '0.9rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase' }}>The Impact</p>
      </div>
      <h2 style={{ color: ds.cream, fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.1, marginBottom: 32 }}>Therapy <span style={{ color: ds.cyan }}>amplified.</span></h2>
      <div style={{ height: 200, position: 'relative' }}>
        {[
          { title: 'For the person', desc: 'Progress that sticks. Sessions that build on each other. Exercises actually done. Breakthroughs remembered.' },
          { title: 'For the therapist', desc: 'Clients who come prepared. Who remember what happened. Who practice between sessions. Every therapist\'s dream.' },
          { title: 'For the relationship', desc: 'A client who arrives having reflected, practiced, and identified what to discuss. The therapeutic alliance deepens.' },
        ].map((item, i) => (
          <div key={i} style={{ position: 'absolute', width: '100%', top: 0, transition: 'all 0.5s ease', opacity: bridgeStep === i ? 1 : 0, transform: bridgeStep === i ? 'translateY(0)' : 'translateY(30px)' }}>
            <p style={{ color: ds.cyan, fontSize: '2rem', fontWeight: 800, marginBottom: 16 }}>{item.title}</p>
            <div className="p-5 rounded-2xl" style={{ backgroundColor: ds.surface, maxWidth: 500, margin: '0 auto' }}>
              <p style={{ color: ds.muted, fontSize: '1.05rem', lineHeight: 1.5 }}>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // 12 — Safety & boundaries
  const SafetySlide = () => {
    const [safeStep, setSafeStep] = useState(0);
    const points = [
      { icon: <Shield size={20} />, title: 'Never clinical', desc: 'Seen doesn\'t diagnose, prescribe, or interpret. It supports reflection and practice.' },
      { icon: <Heart size={20} />, title: 'Therapist-first', desc: 'Always encourages openness with the therapist. Never tries to be one.' },
      { icon: <Target size={20} />, title: 'Evidence-based exercises', desc: 'Every exercise grounded in peer-reviewed approaches. No self-help fads.' },
      { icon: <CheckCircle size={20} />, title: 'User in control', desc: 'Skip anything. No pressure. No streaks. Practice at your own pace.' },
    ];

    useEffect(() => {
      setSafeStep(0);
      const timers = [
        setTimeout(() => setSafeStep(1), 400),
        setTimeout(() => setSafeStep(2), 900),
        setTimeout(() => setSafeStep(3), 1400),
        setTimeout(() => setSafeStep(4), 1900),
        setTimeout(() => setSafeStep(5), 2600),
      ];
      return () => timers.forEach(t => clearTimeout(t));
    }, [slide]);

    return (
      <div className="text-center relative">
        <Orb size={600} x="50%" y="50%" opacity={0.08} />
        <div style={{ opacity: safeStep >= 0 ? 1 : 0, transform: safeStep >= 0 ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s ease' }}>
          <p style={{ color: ds.muted, fontSize: '0.9rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 }}>Safety</p>
          <h2 style={{ color: ds.cream, fontSize: '3rem', fontWeight: 800, marginBottom: 8 }}>Built with <span style={{ color: ds.cyan }}>care.</span></h2>
        </div>
        <div style={{ opacity: safeStep >= 1 ? 1 : 0, transform: safeStep >= 1 ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s ease' }}>
          <p style={{ color: ds.muted, fontSize: '1.1rem', marginBottom: 36, maxWidth: 440, margin: '0 auto 36px' }}>
            Phase 2 exists to support therapy, never to replace it. Every design decision reflects that.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 max-w-xl mx-auto">
          {points.map((p, i) => (
            <div
              key={i}
              className="p-5 rounded-xl text-left"
              style={{
                backgroundColor: ds.surface,
                opacity: safeStep >= i + 2 ? 1 : 0,
                transform: safeStep >= i + 2 ? 'translateY(0)' : 'translateY(20px)',
                transition: 'all 0.5s ease'
              }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg" style={{ backgroundColor: ds.bg, color: ds.cyan }}>{p.icon}</div>
                <p style={{ color: ds.cream, fontSize: '1rem', fontWeight: 700 }}>{p.title}</p>
              </div>
              <p style={{ color: ds.muted, fontSize: '0.85rem', lineHeight: 1.4 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // 13 — Close
  const CloseSlide = () => (
    <div className="text-center relative">
      <Orb size={700} x="50%" y="50%" opacity={0.1} />
      <Reveal delay={0}>
        <div className="flex items-center justify-center gap-4 mb-6">
          <Star size={36} />
          <h1 style={{ color: ds.cream, fontSize: '5rem', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 0.9 }}>Seen</h1>
        </div>
      </Reveal>
      <Reveal delay={200}><p style={{ color: ds.cyan, fontSize: '1.5rem', fontWeight: 700 }}>Phase 2: Practice</p></Reveal>
      <Reveal delay={350}><p style={{ color: ds.cream, fontSize: '1.3rem', marginTop: 16 }}>167 hours of support for every 1 hour of therapy.</p></Reveal>
      <Reveal delay={500}><p style={{ color: ds.muted, fontSize: '1.1rem', marginTop: 12 }}>Your therapist leads. Seen carries the work forward.</p></Reveal>
    </div>
  );

  const renderSlide = () => {
    switch (slide) {
      case 0: return <TitleSlide />;
      case 1: return <ContextSlide />;
      case 2: return <GapSlide />;
      case 3: return <ForgetSlide />;
      case 4: return <StatsSlide />;
      case 5: return <WhatSlide />;
      case 6: return <NotSlide />;
      case 7: return <HowSlide />;
      case 8: return <FunctionalSlide />;
      case 9: return <NudgeSlide />;
      case 10: return <LibrarySlide />;
      case 11: return <BridgeSlide />;
      case 12: return <SafetySlide />;
      case 13: return <CloseSlide />;
      default: return <TitleSlide />;
    }
  };

  return (
    <div style={{ backgroundColor: ds.bg, minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div className="min-h-screen flex items-center justify-center p-6 pb-20 overflow-hidden">
        <div className="max-w-3xl w-full relative">{renderSlide()}</div>
      </div>

      {/* Slide indicator */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full" style={{ backgroundColor: ds.surface }}>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4" style={{ backgroundColor: ds.bg }}>
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button onClick={handlePrev} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: slide === 0 ? 'transparent' : ds.subtle, color: slide === 0 ? ds.subtle : ds.cream, cursor: slide === 0 ? 'default' : 'pointer' }}>
            <ArrowLeft size={16} />
          </button>
          <div className="flex gap-1">
            {Array.from({ length: totalSlides }).map((_, i) => (
              <button key={i} onClick={() => goTo(i)} style={{ width: i === slide ? 20 : 5, height: 5, borderRadius: 3, backgroundColor: i === slide ? ds.cyan : ds.subtle, transition: 'all 0.3s' }} />
            ))}
          </div>
          <button onClick={handleNext} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: slide === totalSlides - 1 ? ds.subtle : ds.cyan, color: ds.cream, cursor: slide === totalSlides - 1 ? 'default' : 'pointer', opacity: slide === totalSlides - 1 ? 0.4 : 1 }}>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
