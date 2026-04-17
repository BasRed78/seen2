'use client';

import React, { useState, useEffect, useRef } from 'react';

// Design system
const ds = {
  bg: '#0f0f1a',
  surface: '#1a1a2e',
  surfaceLight: '#252542',
  cyan: '#4ECDC4',
  cyanLight: '#7EDED6',
  cream: '#faf8f5',
  muted: 'rgba(250,248,245,0.4)',
  subtle: 'rgba(250,248,245,0.12)',
  coral: '#e85a4f',
  gold: '#FFD93D',
};

const Star = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={ds.cyan}>
    <path d="M12 0L13.5 10.5L24 12L13.5 13.5L12 24L10.5 13.5L0 12L10.5 10.5L12 0Z" />
  </svg>
);

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

const ChatMessage = ({ msg, isAi }) => (
  <div>
    {isAi ? (
      <div className="px-3 py-2.5 rounded-xl rounded-tl-sm" style={{ backgroundColor: ds.bg, maxWidth: '88%' }}>
        <p style={{ color: ds.cream, fontSize: '0.8rem', lineHeight: 1.4 }}>{msg}</p>
      </div>
    ) : (
      <div className="px-3 py-2.5 rounded-xl rounded-tr-sm ml-auto" style={{ backgroundColor: ds.cyan, maxWidth: '82%' }}>
        <p style={{ color: ds.cream, fontSize: '0.8rem', lineHeight: 1.4 }}>{msg}</p>
      </div>
    )}
  </div>
);

export default function Phase2Demo() {
  const [slide, setSlide] = useState(0);
  const [key, setKey] = useState(0);
  const [compareStep, setCompareStep] = useState(0);
  const [demoStep, setDemoStep] = useState(0);
  const [demoSubStep, setDemoSubStep] = useState(0);
  const chatRef = useRef(null);

  const totalSlides = 10;

  const goTo = (n) => {
    setSlide(n);
    setKey(k => k + 1);
    if (n !== 3) setCompareStep(0);
    if (n !== 5) { setDemoStep(0); setDemoSubStep(0); }
  };

  const handleNext = () => {
    if (slide === 3 && compareStep < 3) setCompareStep(s => s + 1);
    else if (slide === 5 && demoStep < 3) setDemoStep(s => s + 1);
    else if (slide < totalSlides - 1) goTo(slide + 1);
  };

  const handlePrev = () => {
    if (slide === 3 && compareStep > 0) setCompareStep(s => s - 1);
    else if (slide === 5 && demoStep > 0) setDemoStep(s => s - 1);
    else if (slide > 0) goTo(slide - 1);
  };

  // Keyboard nav
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); handleNext(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); handlePrev(); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  });

  const Reveal = ({ children, delay = 0, y = 30, className = '' }) => {
    const [show, setShow] = useState(false);
    useEffect(() => {
      setShow(false);
      const t = setTimeout(() => setShow(true), delay);
      return () => clearTimeout(t);
    }, [key, delay]);
    return (
      <div className={className} style={{ opacity: show ? 1 : 0, transform: show ? 'translateY(0)' : `translateY(${y}px)`, transition: 'opacity 0.7s ease-out, transform 0.7s ease-out' }}>
        {children}
      </div>
    );
  };

  // Demo slide animations
  useEffect(() => {
    if (slide === 5) {
      setDemoSubStep(0);
      const timers = [];

      if (demoStep === 0) {
        // Post-session reflection
        for (let i = 1; i <= 8; i++) {
          timers.push(setTimeout(() => setDemoSubStep(i), i * 1200));
        }
      } else if (demoStep === 1) {
        // Exercise scheduling
        for (let i = 1; i <= 4; i++) {
          timers.push(setTimeout(() => setDemoSubStep(i), i * 900));
        }
      } else if (demoStep === 2) {
        // AI check-in
        for (let i = 1; i <= 8; i++) {
          timers.push(setTimeout(() => setDemoSubStep(i), i * 1300));
        }
      } else if (demoStep === 3) {
        // Home screen
        for (let i = 1; i <= 4; i++) {
          timers.push(setTimeout(() => setDemoSubStep(i), i * 800));
        }
      }

      return () => timers.forEach(t => clearTimeout(t));
    }
  }, [slide, demoStep]);

  // Auto-scroll chat
  useEffect(() => {
    if (chatRef.current && demoStep === 2) {
      const timer = setTimeout(() => {
        if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [demoSubStep, demoStep]);

  const Orb = ({ color = ds.cyan, size = 500, x = '50%', y = '50%', opacity = 0.07 }) => (
    <div style={{ position: 'absolute', width: size, height: size, left: x, top: y, transform: 'translate(-50%, -50%)', background: `radial-gradient(circle, ${color} 0%, transparent 70%)`, opacity, pointerEvents: 'none' }} />
  );

  // iPhone shell
  const IPhone = ({ children, header }) => (
    <div style={{
      backgroundColor: '#1c1c1e',
      borderRadius: 40,
      padding: 10,
      boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.1)',
    }}>
      <div className="flex flex-col" style={{
        backgroundColor: ds.surface,
        borderRadius: 30,
        width: 260,
        height: 500,
        overflow: 'hidden',
      }}>
        <div className="flex justify-center pt-3 pb-1.5">
          <div style={{ backgroundColor: '#000', width: 80, height: 24, borderRadius: 16 }} />
        </div>
        {header && (
          <div className="flex items-center justify-between px-4 pb-2.5 flex-shrink-0" style={{ borderBottom: `1px solid ${ds.subtle}` }}>
            {header}
          </div>
        )}
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
        <div className="flex justify-center py-1.5">
          <div style={{ backgroundColor: 'rgba(255,255,255,0.3)', width: 90, height: 4, borderRadius: 2 }} />
        </div>
      </div>
    </div>
  );

  // ---- SLIDES ----

  // 0: Title
  const TitleSlide = () => (
    <div className="text-center relative">
      <Orb size={700} x="60%" y="40%" opacity={0.1} />
      <Reveal delay={0}>
        <div className="flex items-center justify-center gap-3 mb-5">
          <Star size={44} />
          <h1 style={{ color: ds.cream, fontSize: '4.5rem', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 0.9 }}>Seen</h1>
        </div>
      </Reveal>
      <Reveal delay={200}>
        <p style={{ color: ds.cyan, fontSize: '1.4rem', fontWeight: 700 }}>Phase 2: Practice</p>
      </Reveal>
      <Reveal delay={400}>
        <p style={{ color: ds.muted, fontSize: '1.1rem', marginTop: 12, maxWidth: 400, margin: '12px auto 0' }}>
          Support between therapy sessions. What we're building and why.
        </p>
      </Reveal>
      <Reveal delay={700}>
        <p style={{ color: ds.muted, fontSize: '0.85rem', marginTop: 40, opacity: 0.5 }}>
          Use arrow keys or tap to navigate
        </p>
      </Reveal>
    </div>
  );

  // 1: Quick context
  const ContextSlide = () => (
    <div className="relative max-w-xl">
      <Orb size={400} x="80%" y="60%" opacity={0.08} />
      <Reveal delay={0}>
        <p style={{ color: ds.muted, fontSize: '0.85rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 24 }}>Quick context</p>
      </Reveal>
      <Reveal delay={100}>
        <h2 style={{ color: ds.cream, fontSize: '1.8rem', fontWeight: 800, marginBottom: 20, lineHeight: 1.3 }}>
          Phase 1 helps people <span style={{ color: ds.coral }}>see the pattern.</span>
        </h2>
      </Reveal>
      <Reveal delay={250}>
        <p style={{ color: ds.muted, fontSize: '1.1rem', marginBottom: 16, lineHeight: 1.5 }}>
          Daily AI check-ins. Pattern tracking. Weekly insights. All designed to help someone recognise their coping mechanisms before things get worse.
        </p>
      </Reveal>
      <Reveal delay={400}>
        <p style={{ color: ds.muted, fontSize: '1.1rem', marginBottom: 28, lineHeight: 1.5 }}>
          Often, that awareness is exactly what pushes someone to start therapy.
        </p>
      </Reveal>
      <Reveal delay={600}>
        <h2 style={{ color: ds.cyan, fontSize: '1.8rem', fontWeight: 800, lineHeight: 1.3 }}>
          Phase 2 supports the work <span style={{ color: ds.cream }}>between sessions.</span>
        </h2>
      </Reveal>
    </div>
  );

  // 2: The problem
  const ProblemSlide = () => (
    <div className="text-center relative">
      <Orb size={600} x="50%" y="50%" opacity={0.08} />
      <Reveal delay={0}>
        <p style={{ color: ds.muted, fontSize: '0.85rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 32 }}>The problem</p>
      </Reveal>
      <Reveal delay={150}>
        <h2 style={{ color: ds.cyan, fontSize: '5rem', fontWeight: 900, letterSpacing: '-0.04em', marginBottom: 8 }}>167 hours</h2>
      </Reveal>
      <Reveal delay={300}>
        <p style={{ color: ds.cream, fontSize: '1.3rem', fontWeight: 700, marginBottom: 32 }}>between every therapy session</p>
      </Reveal>
      <Reveal delay={500}>
        <div className="max-w-md mx-auto text-left space-y-4">
          <div className="p-4 rounded-xl" style={{ backgroundColor: ds.surface }}>
            <p style={{ color: ds.cream, fontSize: '1rem', lineHeight: 1.5 }}>The insight from Monday's session fades by Wednesday.</p>
          </div>
          <div className="p-4 rounded-xl" style={{ backgroundColor: ds.surface }}>
            <p style={{ color: ds.cream, fontSize: '1rem', lineHeight: 1.5 }}>The homework doesn't happen. Life takes over.</p>
          </div>
          <div className="p-4 rounded-xl" style={{ backgroundColor: ds.surface }}>
            <p style={{ color: ds.cream, fontSize: '1rem', lineHeight: 1.5 }}>You walk into the next session and can't remember what felt so important.</p>
          </div>
        </div>
      </Reveal>
      <Reveal delay={800}>
        <p style={{ color: ds.cyan, fontSize: '1.15rem', fontWeight: 600, marginTop: 28 }}>
          No one supports those 167 hours. That's what Phase 2 does.
        </p>
      </Reveal>
    </div>
  );

  // 3: How it's different
  const CompareSlide = () => {
    const others = [
      {
        name: 'Calm / Headspace',
        what: 'Meditation & wellness apps',
        gap: 'Generic content. Not connected to your therapy. Doesn\'t know what you\'re working on.',
      },
      {
        name: 'BetterHelp / Talkspace',
        what: 'Online therapy platforms',
        gap: 'They replace the therapist. If you already have one, they\'re redundant.',
      },
      {
        name: 'Woebot / Wysa',
        what: 'CBT chatbots',
        gap: 'Pre-scripted exercises. No memory between sessions. Doesn\'t know your story or your therapist\'s approach.',
      },
    ];

    return (
      <div className="relative text-center">
        <Orb size={500} x="50%" y="50%" opacity={0.06} />
        <p style={{ color: ds.muted, fontSize: '0.85rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 16 }}>What's out there</p>
        <h2 style={{ color: ds.cream, fontSize: '2rem', fontWeight: 800, marginBottom: 32 }}>
          Good tools. <span style={{ color: ds.cyan }}>Different problem.</span>
        </h2>

        <div style={{ height: 280, position: 'relative' }}>
          {others.map((item, i) => (
            <div key={i} style={{
              position: 'absolute', width: '100%', top: 0,
              transition: 'all 0.5s ease',
              opacity: compareStep === i ? 1 : 0,
              transform: compareStep === i ? 'translateY(0)' : 'translateY(30px)',
            }}>
              <div className="max-w-lg mx-auto">
                <div className="p-6 rounded-2xl text-left" style={{ backgroundColor: ds.surface }}>
                  <p style={{ color: ds.cream, fontSize: '1.5rem', fontWeight: 800, marginBottom: 4 }}>{item.name}</p>
                  <p style={{ color: ds.muted, fontSize: '0.9rem', marginBottom: 16 }}>{item.what}</p>
                  <div className="p-4 rounded-xl" style={{ backgroundColor: ds.bg, borderLeft: `3px solid ${ds.coral}` }}>
                    <p style={{ color: ds.cream, fontSize: '0.95rem', lineHeight: 1.5 }}>{item.gap}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Seen difference */}
          <div style={{
            position: 'absolute', width: '100%', top: 0,
            transition: 'all 0.5s ease',
            opacity: compareStep === 3 ? 1 : 0,
            transform: compareStep === 3 ? 'translateY(0)' : 'translateY(30px)',
          }}>
            <div className="max-w-lg mx-auto">
              <div className="p-6 rounded-2xl text-left" style={{ backgroundColor: ds.surface, border: `2px solid ${ds.cyan}` }}>
                <div className="flex items-center gap-2 mb-2">
                  <Star size={18} />
                  <p style={{ color: ds.cream, fontSize: '1.5rem', fontWeight: 800 }}>Seen Phase 2</p>
                </div>
                <p style={{ color: ds.cyan, fontSize: '0.9rem', marginBottom: 16 }}>Therapy companion, not replacement</p>
                <div className="p-4 rounded-xl" style={{ backgroundColor: ds.bg, borderLeft: `3px solid ${ds.cyan}` }}>
                  <p style={{ color: ds.cream, fontSize: '0.95rem', lineHeight: 1.5 }}>
                    Knows what came up in your session. Matches exercises to your themes. Remembers your intentions in daily check-ins. Nudges you to bring things back to your therapist.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 4: What's built - overview
  const BuiltOverviewSlide = () => {
    const [bStep, setBStep] = useState(0);
    const features = [
      { title: 'Post-session reflection', desc: 'Guided flow after each therapy session. Emotional state, themes, free reflection, and a practice intention.', status: 'Built' },
      { title: 'Exercise library', desc: 'Exercises grounded in CBT, ACT, DBT, and mindfulness. Matched to session themes or chosen freely.', status: 'Built' },
      { title: 'Calendar scheduling', desc: 'Schedule exercises into your week. Downloads .ics files for Google, Apple, Outlook. In-app nudges.', status: 'Built' },
      { title: 'Therapy-aware AI check-ins', desc: 'Daily conversations that remember your reflections, intentions, and exercises. Encourages openness with your therapist.', status: 'Built' },
      { title: 'Practice home', desc: 'Dashboard showing upcoming exercises, active intentions, and your reflection history.', status: 'Built' },
    ];

    useEffect(() => {
      setBStep(0);
      const timers = features.map((_, i) =>
        setTimeout(() => setBStep(i + 1), 400 + i * 350)
      );
      return () => timers.forEach(t => clearTimeout(t));
    }, [slide]);

    return (
      <div className="relative max-w-2xl mx-auto">
        <Orb size={500} x="70%" y="30%" opacity={0.08} />
        <div className="flex items-center gap-2 mb-3">
          <Star size={16} />
          <p style={{ color: ds.muted, fontSize: '0.85rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase' }}>What's built</p>
        </div>
        <h2 style={{ color: ds.cream, fontSize: '2.25rem', fontWeight: 800, lineHeight: 1.15, marginBottom: 28 }}>
          This is <span style={{ color: ds.cyan }}>working today.</span>
        </h2>

        <div className="space-y-3">
          {features.map((f, i) => (
            <div
              key={i}
              className="p-4 rounded-xl flex items-start gap-4"
              style={{
                backgroundColor: ds.surface,
                opacity: bStep >= i + 1 ? 1 : 0,
                transform: bStep >= i + 1 ? 'translateX(0)' : 'translateX(-20px)',
                transition: 'all 0.4s ease',
              }}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p style={{ color: ds.cream, fontSize: '1rem', fontWeight: 700 }}>{f.title}</p>
                  <span className="px-2 py-0.5 rounded text-xs font-bold" style={{ backgroundColor: ds.cyan + '20', color: ds.cyan }}>{f.status}</span>
                </div>
                <p style={{ color: ds.muted, fontSize: '0.9rem', lineHeight: 1.4 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // 5: Live demo (4 beats)
  const DemoSlide = () => {
    const checkInMessages = [
      { type: 'ai', text: 'Hey Sarah, how are you doing today?' },
      { type: 'user', text: 'Better actually. Had a tough conversation at work.' },
      { type: 'ai', text: 'That sounds significant. You mentioned wanting to practice saying no. Was this related?' },
      { type: 'user', text: 'Yeah. Someone asked me to cover their shift and I said I couldn\'t.' },
      { type: 'ai', text: 'That takes real courage, especially given what you reflected on after your session. How did it feel?' },
      { type: 'user', text: 'Scary but good? They were fine with it.' },
      { type: 'ai', text: 'The fear was bigger than the actual consequence. That might be worth bringing to your therapist.' },
    ];

    const beatTitles = [
      'After your session',
      'Planning the week',
      'Daily check-ins',
      'Your practice home',
    ];

    return (
      <div className="relative">
        <Orb size={400} x="80%" y="20%" opacity={0.08} />

        {/* Beat indicator */}
        <div className="text-center mb-5">
          <p style={{ color: ds.muted, fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 6 }}>Demo</p>
          <div className="flex justify-center gap-3 mb-2">
            {beatTitles.map((t, i) => (
              <button
                key={i}
                onClick={() => setDemoStep(i)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                style={{
                  backgroundColor: demoStep === i ? ds.cyan : ds.surface,
                  color: demoStep === i ? ds.cream : ds.muted,
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Beat 0: Post-session reflection */}
        <div style={{ opacity: demoStep === 0 ? 1 : 0, position: demoStep === 0 ? 'relative' : 'absolute', top: 0, width: '100%', transition: 'opacity 0.5s ease', pointerEvents: demoStep === 0 ? 'auto' : 'none' }}>
          <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
            <div style={{ opacity: demoSubStep >= 1 ? 1 : 0, transform: demoSubStep >= 1 ? 'translateY(0)' : 'translateY(15px)', transition: 'all 0.6s ease' }}>
              <IPhone header={
                <div className="flex items-center gap-2">
                  <Star size={12} />
                  <span style={{ color: ds.cream, fontSize: '0.8rem', fontWeight: 600 }}>Post-Session</span>
                </div>
              }>
                <div className="px-4 py-3 overflow-hidden">
                  {/* Progress */}
                  <div className="flex justify-center gap-2 mb-4">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="rounded-full" style={{
                        width: 7, height: 7,
                        backgroundColor: demoSubStep >= (i * 2) ? ds.cyan : ds.surfaceLight,
                        transition: 'all 0.3s ease',
                      }} />
                    ))}
                  </div>

                  {/* Step 1: Emotional scale */}
                  {demoSubStep >= 2 && demoSubStep < 4 && (
                    <div>
                      <p className="text-center mb-3" style={{ color: ds.cream, fontSize: '0.9rem', fontWeight: 600 }}>How are you feeling?</p>
                      <div className="flex justify-center gap-1 flex-wrap">
                        {[1,2,3,4,5,6,7,8,9,10].map(n => (
                          <div key={n} className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{
                            backgroundColor: n === 7 ? ds.cyan : ds.bg,
                            color: ds.cream,
                            border: n === 7 ? 'none' : `1px solid ${ds.subtle}`,
                          }}>{n}</div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 2: Themes */}
                  {demoSubStep >= 4 && demoSubStep < 6 && (
                    <div>
                      <p className="text-center mb-3" style={{ color: ds.cream, fontSize: '0.9rem', fontWeight: 600 }}>What came up?</p>
                      <div className="space-y-2">
                        {['Boundaries', 'Self-worth', 'Relationships', 'Anxiety'].map((t, i) => (
                          <div key={t} className="p-2.5 rounded-lg" style={{
                            backgroundColor: i < 2 ? `${ds.cyan}15` : ds.bg,
                            border: i < 2 ? `1px solid ${ds.cyan}` : `1px solid ${ds.subtle}`,
                          }}>
                            <span style={{ color: i < 2 ? ds.cyan : ds.muted, fontSize: '0.8rem' }}>{t}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 3: Reflection */}
                  {demoSubStep >= 6 && demoSubStep < 8 && (
                    <div>
                      <p className="text-center mb-2" style={{ color: ds.cream, fontSize: '0.85rem', fontWeight: 600 }}>What stood out most?</p>
                      <div className="p-3 rounded-lg" style={{ backgroundColor: ds.bg, border: `1px solid ${ds.subtle}`, minHeight: 80 }}>
                        <p style={{ color: ds.cream, fontSize: '0.75rem', lineHeight: 1.5 }}>I keep saying yes to things that drain me because I'm afraid of being seen as difficult...</p>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Intention */}
                  {demoSubStep >= 8 && (
                    <div>
                      <p className="text-center mb-3" style={{ color: ds.cream, fontSize: '0.85rem', fontWeight: 600 }}>Something to practice?</p>
                      <div className="p-3 rounded-lg" style={{ backgroundColor: ds.bg, border: `1px solid ${ds.cyan}40` }}>
                        <p style={{ color: ds.cream, fontSize: '0.75rem', lineHeight: 1.5 }}>Say no to one request this week without explaining why</p>
                      </div>
                      <p className="mt-2" style={{ color: ds.muted, fontSize: '0.7rem' }}>By Fri, 18 Apr</p>
                    </div>
                  )}
                </div>
              </IPhone>
            </div>

            <div className="text-center md:text-left" style={{ maxWidth: 260, opacity: demoSubStep >= 6 ? 1 : 0, transform: demoSubStep >= 6 ? 'translateY(0)' : 'translateY(15px)', transition: 'all 0.8s ease' }}>
              <p style={{ color: ds.cream, fontSize: '1.05rem', lineHeight: 1.5, marginBottom: 12 }}>
                Walk out of your session. Open Seen. Two minutes.
              </p>
              <p style={{ color: ds.muted, fontSize: '0.9rem', lineHeight: 1.5 }}>
                Emotional state, themes, reflection, and a practice intention to carry into the week.
              </p>
            </div>
          </div>
        </div>

        {/* Beat 1: Exercise scheduling */}
        <div style={{ opacity: demoStep === 1 ? 1 : 0, position: demoStep === 1 ? 'relative' : 'absolute', top: 0, width: '100%', transition: 'opacity 0.5s ease', pointerEvents: demoStep === 1 ? 'auto' : 'none' }}>
          <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
            <div style={{ opacity: demoSubStep >= 1 ? 1 : 0, transform: demoSubStep >= 1 ? 'translateY(0)' : 'translateY(15px)', transition: 'all 0.6s ease' }}>
              <IPhone header={
                <div className="flex items-center gap-2">
                  <Star size={12} />
                  <span style={{ color: ds.cream, fontSize: '0.8rem', fontWeight: 600 }}>Schedule Exercises</span>
                </div>
              }>
                <div className="px-4 py-3">
                  <p style={{ color: ds.muted, fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Matched to your session</p>
                  {[
                    { title: 'Setting a boundary', dur: '10 min', cat: 'Behavioural' },
                    { title: 'Values check-in', dur: '5 min', cat: 'Self-reflection' },
                  ].map((ex, i) => (
                    <div key={i} className="flex items-center gap-2.5 p-2.5 rounded-lg mb-2" style={{
                      backgroundColor: ds.bg,
                      opacity: demoSubStep >= i + 1 ? 1 : 0,
                      transition: 'all 0.5s ease',
                    }}>
                      <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ backgroundColor: `${ds.cyan}15` }}>
                        <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={ds.cyan} strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                      </div>
                      <div className="flex-1">
                        <p style={{ color: ds.cream, fontSize: '0.8rem', fontWeight: 600 }}>{ex.title}</p>
                        <p style={{ color: ds.muted, fontSize: '0.65rem' }}>{ex.dur} · {ex.cat}</p>
                      </div>
                    </div>
                  ))}

                  <div style={{ opacity: demoSubStep >= 3 ? 1 : 0, transition: 'all 0.5s ease' }}>
                    <p style={{ color: ds.muted, fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 12, marginBottom: 8 }}>Scheduled</p>
                    {[
                      { title: 'Setting a boundary', day: 'Wed 9:00 AM' },
                      { title: 'Values check-in', day: 'Fri 7:00 PM' },
                    ].map((s, i) => (
                      <div key={i} className="flex items-center justify-between p-2.5 rounded-lg mb-2" style={{ backgroundColor: ds.bg }}>
                        <div>
                          <p style={{ color: ds.cream, fontSize: '0.8rem' }}>{s.title}</p>
                          <p style={{ color: ds.muted, fontSize: '0.65rem' }}>{s.day}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 p-2.5 rounded-lg mt-3" style={{
                    backgroundColor: ds.surface,
                    border: `1px solid ${ds.cyan}30`,
                    opacity: demoSubStep >= 4 ? 1 : 0,
                    transition: 'all 0.5s ease',
                  }}>
                    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={ds.cyan} strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    <p style={{ color: ds.cream, fontSize: '0.75rem' }}>Add to calendar</p>
                    <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={ds.cyan} strokeWidth="2" style={{ marginLeft: 'auto' }}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  </div>
                </div>
              </IPhone>
            </div>

            <div className="text-center md:text-left" style={{ maxWidth: 260, opacity: demoSubStep >= 3 ? 1 : 0, transform: demoSubStep >= 3 ? 'translateY(0)' : 'translateY(15px)', transition: 'all 0.8s ease' }}>
              <p style={{ color: ds.cream, fontSize: '1.05rem', lineHeight: 1.5, marginBottom: 12 }}>
                Exercises matched to your session themes. Scheduled into your real calendar.
              </p>
              <p style={{ color: ds.muted, fontSize: '0.9rem', lineHeight: 1.5 }}>
                Works with Google Calendar, Apple Calendar, Outlook. Seen nudges you in-app when one is coming up.
              </p>
            </div>
          </div>
        </div>

        {/* Beat 2: AI check-in */}
        <div style={{ opacity: demoStep === 2 ? 1 : 0, position: demoStep === 2 ? 'relative' : 'absolute', top: 0, width: '100%', transition: 'opacity 0.5s ease', pointerEvents: demoStep === 2 ? 'auto' : 'none' }}>
          <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
            <div style={{ opacity: demoSubStep >= 1 ? 1 : 0, transform: demoSubStep >= 1 ? 'translateY(0)' : 'translateY(15px)', transition: 'all 0.6s ease' }}>
              <IPhone header={
                <>
                  <div className="flex items-center gap-2">
                    <Star size={12} />
                    <span style={{ color: ds.cream, fontSize: '0.8rem', fontWeight: 600 }}>Check-in</span>
                  </div>
                  <span style={{ color: ds.muted, fontSize: '0.7rem' }}>Day 12</span>
                </>
              }>
                <div ref={chatRef} className="px-3 py-3 h-full" style={{ overflowY: 'auto', scrollbarWidth: 'none' }}>
                  <div className="space-y-2.5">
                    {checkInMessages.map((msg, i) => (
                      demoSubStep >= i + 1 ? (
                        <ChatMessage key={i} msg={msg.text} isAi={msg.type === 'ai'} />
                      ) : null
                    ))}
                  </div>
                </div>
              </IPhone>
            </div>

            <div className="text-center md:text-left" style={{ maxWidth: 260, opacity: demoSubStep >= 8 ? 1 : 0, transform: demoSubStep >= 8 ? 'translateY(0)' : 'translateY(15px)', transition: 'all 0.8s ease' }}>
              <p style={{ color: ds.cream, fontSize: '1.05rem', lineHeight: 1.5, marginBottom: 12 }}>
                It remembers what came up in your session, your practice intentions, your exercises.
              </p>
              <p style={{ color: ds.muted, fontSize: '0.9rem', lineHeight: 1.5 }}>
                And gently encourages you to bring things back to your therapist. Never tries to be one.
              </p>
            </div>
          </div>
        </div>

        {/* Beat 3: Practice home */}
        <div style={{ opacity: demoStep === 3 ? 1 : 0, position: demoStep === 3 ? 'relative' : 'absolute', top: 0, width: '100%', transition: 'opacity 0.5s ease', pointerEvents: demoStep === 3 ? 'auto' : 'none' }}>
          <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
            <div style={{ opacity: demoSubStep >= 1 ? 1 : 0, transform: demoSubStep >= 1 ? 'translateY(0)' : 'translateY(15px)', transition: 'all 0.6s ease' }}>
              <IPhone header={
                <div className="flex items-center gap-2">
                  <Star size={12} />
                  <span style={{ color: ds.cream, fontSize: '0.8rem', fontWeight: 600 }}>Practice</span>
                </div>
              }>
                <div className="px-4 py-3">
                  {/* Check-in streak */}
                  <div className="p-3 rounded-xl mb-3" style={{ backgroundColor: ds.bg, opacity: demoSubStep >= 1 ? 1 : 0, transition: 'all 0.5s ease' }}>
                    <div className="flex items-center justify-between mb-2">
                      <span style={{ color: ds.cream, fontSize: '0.8rem', fontWeight: 600 }}>This week</span>
                      <span style={{ color: ds.cyan, fontSize: '0.7rem', fontWeight: 700 }}>5 day streak</span>
                    </div>
                    <div className="flex gap-1">
                      {['M','T','W','T','F','S','S'].map((d, i) => (
                        <div key={i} className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{
                          backgroundColor: i < 5 ? ds.cyan : ds.surfaceLight,
                          color: ds.cream,
                          fontSize: '0.6rem',
                        }}>{i < 5 ? '\u2713' : d}</div>
                      ))}
                    </div>
                  </div>

                  {/* Upcoming exercises */}
                  <div style={{ opacity: demoSubStep >= 2 ? 1 : 0, transition: 'all 0.5s ease' }}>
                    <p style={{ color: ds.muted, fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>Upcoming</p>
                    <div className="p-2.5 rounded-lg mb-2" style={{ backgroundColor: `${ds.gold}10`, border: `1px solid ${ds.gold}30` }}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p style={{ color: ds.cream, fontSize: '0.8rem', fontWeight: 500 }}>Setting a boundary</p>
                          <p style={{ color: ds.muted, fontSize: '0.65rem' }}>Today at 9:00 AM</p>
                        </div>
                        <span className="px-1.5 py-0.5 rounded text-xs font-bold" style={{ backgroundColor: ds.gold, color: ds.bg, fontSize: '0.6rem' }}>Soon</span>
                      </div>
                    </div>
                    <div className="p-2.5 rounded-lg" style={{ backgroundColor: ds.bg }}>
                      <p style={{ color: ds.cream, fontSize: '0.8rem' }}>Values check-in</p>
                      <p style={{ color: ds.muted, fontSize: '0.65rem' }}>Fri at 7:00 PM</p>
                    </div>
                  </div>

                  {/* Active intention */}
                  <div className="p-3 rounded-xl mt-3" style={{
                    backgroundColor: ds.bg,
                    border: `1px solid ${ds.cyan}30`,
                    opacity: demoSubStep >= 3 ? 1 : 0,
                    transition: 'all 0.5s ease',
                  }}>
                    <p style={{ color: ds.muted, fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>Active intention</p>
                    <p style={{ color: ds.cream, fontSize: '0.75rem', lineHeight: 1.4 }}>Say no to one request without explaining why</p>
                    <p style={{ color: ds.cyan, fontSize: '0.65rem', marginTop: 4 }}>By Fri, 18 Apr</p>
                  </div>
                </div>
              </IPhone>
            </div>

            <div className="text-center md:text-left" style={{ maxWidth: 260, opacity: demoSubStep >= 4 ? 1 : 0, transform: demoSubStep >= 4 ? 'translateY(0)' : 'translateY(15px)', transition: 'all 0.8s ease' }}>
              <p style={{ color: ds.cream, fontSize: '1.05rem', lineHeight: 1.5, marginBottom: 12 }}>
                Everything in one place. Exercises, intentions, check-in history.
              </p>
              <p style={{ color: ds.muted, fontSize: '0.9rem', lineHeight: 1.5 }}>
                Gold highlight when an exercise is approaching. Tap "Done" when you've completed it.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 6: Safety & boundaries
  const SafetySlide = () => (
    <div className="relative max-w-xl">
      <Orb size={400} x="20%" y="40%" opacity={0.08} />
      <Reveal delay={0}>
        <p style={{ color: ds.muted, fontSize: '0.85rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 24 }}>Boundaries</p>
      </Reveal>
      <Reveal delay={100}>
        <h2 style={{ color: ds.cream, fontSize: '2rem', fontWeight: 800, marginBottom: 28, lineHeight: 1.2 }}>
          Seen is not a <span style={{ color: ds.cyan }}>therapist.</span>
        </h2>
      </Reveal>
      <Reveal delay={250}>
        <div className="space-y-3">
          {[
            'Never diagnoses or interprets',
            'Never gives clinical advice',
            'Always encourages openness with the therapist',
            'Exercises grounded in peer-reviewed approaches',
            'User controls everything. No pressure, no streaks to protect',
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ backgroundColor: ds.surface }}>
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={ds.cyan} strokeWidth="2" className="mt-0.5 flex-shrink-0"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              <p style={{ color: ds.cream, fontSize: '0.95rem', lineHeight: 1.4 }}>{item}</p>
            </div>
          ))}
        </div>
      </Reveal>
      <Reveal delay={500}>
        <p style={{ color: ds.muted, fontSize: '1rem', marginTop: 24, lineHeight: 1.5, fontStyle: 'italic' }}>
          Your therapist leads. Seen carries the work forward between sessions.
        </p>
      </Reveal>
    </div>
  );

  // 7: The flow
  const FlowSlide = () => {
    const [fStep, setFStep] = useState(0);
    const steps = [
      { label: 'Therapy session', color: ds.muted },
      { label: 'Post-session reflection', color: ds.cyan },
      { label: 'Choose exercises', color: ds.cyan },
      { label: 'Schedule into calendar', color: ds.cyan },
      { label: 'Daily check-ins', color: ds.cyan },
      { label: 'Nudged to bring things to therapist', color: ds.cyan },
      { label: 'Next therapy session', color: ds.muted },
    ];

    useEffect(() => {
      setFStep(0);
      const timers = steps.map((_, i) =>
        setTimeout(() => setFStep(i + 1), 400 + i * 400)
      );
      return () => timers.forEach(t => clearTimeout(t));
    }, [slide]);

    return (
      <div className="relative max-w-md mx-auto">
        <Orb size={500} x="50%" y="50%" opacity={0.06} />
        <div className="text-center mb-8">
          <p style={{ color: ds.muted, fontSize: '0.85rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>The cycle</p>
          <h2 style={{ color: ds.cream, fontSize: '2rem', fontWeight: 800 }}>Session to session</h2>
        </div>

        <div className="space-y-2">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-3" style={{
              opacity: fStep >= i + 1 ? 1 : 0,
              transform: fStep >= i + 1 ? 'translateX(0)' : 'translateX(-20px)',
              transition: 'all 0.4s ease',
            }}>
              <div className="flex flex-col items-center" style={{ width: 24 }}>
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
                {i < steps.length - 1 && <div style={{ width: 2, height: 20, backgroundColor: ds.subtle }} />}
              </div>
              <p style={{ color: i === 0 || i === steps.length - 1 ? ds.muted : ds.cream, fontSize: '1rem', fontWeight: i === 0 || i === steps.length - 1 ? 400 : 600 }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-8" style={{ opacity: fStep >= 7 ? 1 : 0, transition: 'all 0.6s ease' }}>
          <p style={{ color: ds.cyan, fontSize: '1.15rem', fontWeight: 700 }}>
            167 hours of support. Every week.
          </p>
        </div>
      </div>
    );
  };

  // 8: What's next
  const FutureSlide = () => {
    const [futStep, setFutStep] = useState(0);
    const items = [
      { title: 'Therapist dashboard', desc: 'Optional sharing so your therapist can see your reflections and exercises before the session. They come prepared too.' },
      { title: 'Session prep', desc: 'Before your next appointment, Seen surfaces what came up in check-ins that week. Walk in knowing what to discuss.' },
      { title: 'Progress over time', desc: 'Visualise how your themes shift, how your emotional baseline moves, how your practice builds. Proof that the work is working.' },
      { title: 'Phase 3: Maintenance', desc: 'After therapy ends. Trigger tracking, milestone celebrations, and a gentle tap on the shoulder when something looks familiar.' },
    ];

    useEffect(() => {
      setFutStep(0);
      const timers = items.map((_, i) =>
        setTimeout(() => setFutStep(i + 1), 500 + i * 500)
      );
      return () => timers.forEach(t => clearTimeout(t));
    }, [slide]);

    return (
      <div className="relative max-w-2xl mx-auto">
        <Orb size={500} x="30%" y="70%" opacity={0.08} />
        <div className="flex items-center gap-2 mb-3">
          <Star size={16} />
          <p style={{ color: ds.muted, fontSize: '0.85rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase' }}>What's next</p>
        </div>
        <h2 style={{ color: ds.cream, fontSize: '2.25rem', fontWeight: 800, lineHeight: 1.15, marginBottom: 28 }}>
          Where it's <span style={{ color: ds.cyan }}>going.</span>
        </h2>

        <div className="space-y-3">
          {items.map((item, i) => (
            <div
              key={i}
              className="p-5 rounded-xl"
              style={{
                backgroundColor: i === 3 ? ds.bg : ds.surface,
                border: i === 3 ? `1px solid ${ds.surface}` : 'none',
                opacity: futStep >= i + 1 ? 1 : 0,
                transform: futStep >= i + 1 ? 'translateY(0)' : 'translateY(15px)',
                transition: 'all 0.4s ease',
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <p style={{ color: i === 3 ? ds.muted : ds.cyan, fontSize: '1.05rem', fontWeight: 700 }}>{item.title}</p>
                {i < 3 && <span className="px-2 py-0.5 rounded text-xs font-bold" style={{ backgroundColor: ds.surface, color: ds.muted }}>Planned</span>}
                {i === 3 && <span className="px-2 py-0.5 rounded text-xs font-bold" style={{ backgroundColor: ds.surface, color: ds.muted }}>Future</span>}
              </div>
              <p style={{ color: ds.muted, fontSize: '0.9rem', lineHeight: 1.5 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // 9: Close
  const CloseSlide = () => (
    <div className="text-center relative">
      <Orb size={700} x="50%" y="50%" opacity={0.1} />
      <Reveal delay={0}>
        <div className="flex items-center justify-center gap-3 mb-5">
          <Star size={36} />
          <h1 style={{ color: ds.cream, fontSize: '4.5rem', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 0.9 }}>Seen</h1>
        </div>
      </Reveal>
      <Reveal delay={200}>
        <p style={{ color: ds.cyan, fontSize: '1.3rem', fontWeight: 700, marginBottom: 20 }}>Phase 2: Practice</p>
      </Reveal>
      <Reveal delay={350}>
        <p style={{ color: ds.cream, fontSize: '1.2rem', lineHeight: 1.5, maxWidth: 420, margin: '0 auto' }}>
          167 hours of support for every 1 hour of therapy.
        </p>
      </Reveal>
      <Reveal delay={500}>
        <p style={{ color: ds.muted, fontSize: '1rem', marginTop: 16 }}>Your therapist leads. Seen carries the work forward.</p>
      </Reveal>
      <Reveal delay={700}>
        <div className="mt-10 p-4 rounded-xl inline-block" style={{ backgroundColor: ds.surface }}>
          <p style={{ color: ds.muted, fontSize: '0.85rem' }}>Try it: <span style={{ color: ds.cyan, fontWeight: 600 }}>seen2.vercel.app</span></p>
        </div>
      </Reveal>
    </div>
  );

  const renderSlide = () => {
    switch (slide) {
      case 0: return <TitleSlide />;
      case 1: return <ContextSlide />;
      case 2: return <ProblemSlide />;
      case 3: return <CompareSlide />;
      case 4: return <BuiltOverviewSlide />;
      case 5: return <DemoSlide />;
      case 6: return <SafetySlide />;
      case 7: return <FlowSlide />;
      case 8: return <FutureSlide />;
      case 9: return <CloseSlide />;
      default: return <TitleSlide />;
    }
  };

  return (
    <div style={{ backgroundColor: ds.bg, minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
      <div className="min-h-screen flex items-center justify-center p-6 pb-20 overflow-hidden">
        <div className="max-w-3xl w-full relative">{renderSlide()}</div>
      </div>

      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full" style={{ backgroundColor: ds.surface }}>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 z-20" style={{ backgroundColor: ds.bg }}>
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
