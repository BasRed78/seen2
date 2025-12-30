'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';

// Design system
const colors = {
  bg: '#0f0f1a',
  dark: '#1a1a2e',
  darkLight: '#252542',
  coral: '#ff6b5b',
  coralDark: '#e85a4f',
  cyan: '#5B8F8F',
  cream: '#faf8f5',
  muted: 'rgba(250,248,245,0.4)',
};

// Star icon
const StarIcon = ({ size = 24, style = {} }: { size?: number; style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={{ color: colors.coral, ...style }}>
    <path d="M12 0L13.5 10.5L24 12L13.5 13.5L12 24L10.5 13.5L0 12L10.5 10.5L12 0Z" />
  </svg>
);

// Gradient orb decoration
const Orb = ({ color = colors.coral, size = 500, className = "" }: { color?: string; size?: number; className?: string }) => (
  <div 
    className={`absolute pointer-events-none ${className}`}
    style={{ 
      width: size, 
      height: size, 
      background: `radial-gradient(circle, ${color} 0%, transparent 70%)`, 
      filter: 'blur(80px)',
      opacity: 0.15 
    }} 
  />
);

// Chat message component
const ChatMessage = ({ msg, isAi }: { msg: string; isAi: boolean }) => (
  <div className={isAi ? '' : 'flex justify-end'}>
    <div 
      className={`px-3 py-2 rounded-xl ${isAi ? 'rounded-tl-sm' : 'rounded-tr-sm'}`}
      style={{ 
        backgroundColor: isAi ? colors.dark : colors.coral, 
        maxWidth: isAi ? '90%' : '85%',
        color: colors.cream,
        fontSize: '0.8rem',
        lineHeight: 1.4
      }}
    >
      {msg}
    </div>
  </div>
);

// Hook for intersection observer
function useInView(threshold = 0.3) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

// Section 1: Check-in Animation
function CheckInSection() {
  const { ref, inView } = useInView(0.2);
  const [step, setStep] = useState(0);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const conversation = [
    { type: 'ai', text: 'Hey, how are you feeling today?' },
    { type: 'user', text: 'Tired. Didn\'t sleep well.' },
    { type: 'ai', text: 'What kept you up?' },
    { type: 'user', text: 'Just my mind racing. Work stuff mostly.' },
    { type: 'ai', text: 'That sounds exhausting. Does that happen a lot?' },
    { type: 'user', text: 'More than I\'d like. Especially Sunday nights.' },
    { type: 'ai', text: 'When your mind races like that, what do you usually do?' },
    { type: 'user', text: 'Scroll my phone. Or text people I shouldn\'t.' },
    { type: 'ai', text: 'People you shouldn\'t?' },
    { type: 'user', text: 'Yeah. Exes. People from my past. It\'s stupid.' },
  ];

  const closing = "Doesn't sound stupid. Sounds like you're looking for something when your mind won't quiet down.";

  useEffect(() => {
    if (!inView) return;
    
    const timers: NodeJS.Timeout[] = [];
    timers.push(setTimeout(() => setStep(1), 300));
    for (let i = 2; i <= 11; i++) {
      timers.push(setTimeout(() => setStep(i), 300 + (i - 1) * 1400));
    }
    timers.push(setTimeout(() => setStep(12), 15000));
    timers.push(setTimeout(() => setStep(13), 17000));

    return () => timers.forEach(t => clearTimeout(t));
  }, [inView]);

  useEffect(() => {
    if (chatContainerRef.current && step > 1) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [step]);

  return (
    <section 
      ref={ref}
      className="min-h-screen flex items-center py-20 px-6 relative overflow-hidden"
      style={{ backgroundColor: colors.dark }}
    >
      <Orb size={500} className="-top-40 -right-40" />
      
      <div className="max-w-5xl mx-auto w-full">
        <div 
          className="text-center mb-12"
          style={{ 
            opacity: step >= 1 ? 1 : 0, 
            transform: step >= 1 ? 'translateY(0)' : 'translateY(30px)', 
            transition: 'all 0.6s ease' 
          }}
        >
          <p 
            className="text-sm font-bold uppercase tracking-widest mb-4"
            style={{ color: colors.coral }}
          >
            Step 1
          </p>
          <h2 
            className="text-3xl md:text-4xl font-bold"
            style={{ color: colors.cream }}
          >
            Seen checks in
          </h2>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-12 items-center justify-center">
          {/* iPhone Frame */}
          <div 
            style={{ 
              backgroundColor: '#1c1c1e', 
              borderRadius: 40, 
              padding: 12,
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
              opacity: step >= 1 ? 1 : 0, 
              transform: step >= 1 ? 'translateY(0)' : 'translateY(40px)', 
              transition: 'all 0.8s ease'
            }}
          >
            <div 
              className="flex flex-col overflow-hidden" 
              style={{ 
                backgroundColor: colors.darkLight, 
                borderRadius: 32,
                width: 280,
                height: 520,
              }}
            >
              {/* Dynamic Island */}
              <div className="flex justify-center pt-3 pb-2">
                <div style={{ backgroundColor: '#000', width: 90, height: 28, borderRadius: 20 }} />
              </div>
              
              {/* App Header */}
              <div 
                className="flex items-center justify-between px-4 pb-3 flex-shrink-0" 
                style={{ borderBottom: `1px solid rgba(255,255,255,0.1)` }}
              >
                <div className="flex items-center gap-2">
                  <StarIcon size={14} />
                  <span style={{ color: colors.cream, fontSize: '0.85rem', fontWeight: 600 }}>Daily Check-in</span>
                </div>
                <span style={{ color: colors.cream, fontSize: '0.7rem', opacity: 0.5 }}>Day 3</span>
              </div>
              
              {/* Messages */}
              <div 
                ref={chatContainerRef}
                className="px-4 py-3 flex-1 space-y-3" 
                style={{ overflowY: 'auto', scrollbarWidth: 'none' }}
              >
                {conversation.map((msg, i) => (
                  step >= i + 1 ? (
                    <div 
                      key={i}
                      style={{
                        opacity: step >= i + 1 ? 1 : 0,
                        transform: step >= i + 1 ? 'translateY(0)' : 'translateY(10px)',
                        transition: 'all 0.4s ease'
                      }}
                    >
                      <ChatMessage msg={msg.text} isAi={msg.type === 'ai'} />
                    </div>
                  ) : null
                ))}
                {step >= 12 && (
                  <div style={{ opacity: 1, transition: 'all 0.4s ease' }}>
                    <ChatMessage msg={closing} isAi={true} />
                  </div>
                )}
              </div>
              
              {/* Home indicator */}
              <div className="flex justify-center py-3">
                <div style={{ backgroundColor: 'rgba(255,255,255,0.3)', width: 100, height: 5, borderRadius: 3 }} />
              </div>
            </div>
          </div>
          
          {/* Narrative */}
          <div 
            className="text-center lg:text-left max-w-sm"
            style={{ 
              opacity: step >= 13 ? 1 : 0, 
              transform: step >= 13 ? 'translateY(0)' : 'translateY(30px)', 
              transition: 'all 0.8s ease' 
            }}
          >
            <p 
              className="text-xl md:text-2xl font-medium mb-4"
              style={{ color: colors.cream, lineHeight: 1.5 }}
            >
              Lives on your phone. Checks in daily — you don't have to remember.
            </p>
            <p 
              className="text-lg"
              style={{ color: colors.cream, opacity: 0.7, lineHeight: 1.5 }}
            >
              2-3 minutes. Like texting a friend who asks the right questions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// Section 2: Pattern Tracking
function TrackingSection() {
  const { ref, inView } = useInView(0.3);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!inView) return;
    
    const timers: NodeJS.Timeout[] = [];
    timers.push(setTimeout(() => setStep(1), 300));
    timers.push(setTimeout(() => setStep(2), 800));
    timers.push(setTimeout(() => setStep(3), 1400));
    timers.push(setTimeout(() => setStep(4), 2000));
    timers.push(setTimeout(() => setStep(5), 2800));

    return () => timers.forEach(t => clearTimeout(t));
  }, [inView]);

  return (
    <section 
      ref={ref}
      className="min-h-screen flex items-center py-20 px-6 relative overflow-hidden"
      style={{ backgroundColor: colors.darkLight }}
    >
      <Orb size={400} color={colors.cyan} className="-bottom-40 -left-40" />
      
      <div className="max-w-5xl mx-auto w-full">
        <div 
          className="text-center mb-12"
          style={{ 
            opacity: step >= 1 ? 1 : 0, 
            transform: step >= 1 ? 'translateY(0)' : 'translateY(30px)', 
            transition: 'all 0.6s ease' 
          }}
        >
          <p 
            className="text-sm font-bold uppercase tracking-widest mb-4"
            style={{ color: colors.cyan }}
          >
            Step 2
          </p>
          <h2 
            className="text-3xl md:text-4xl font-bold"
            style={{ color: colors.cream }}
          >
            Every conversation builds on the last
          </h2>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-12 items-center justify-center">
          {/* Visuals */}
          <div className="space-y-4" style={{ width: 340, maxWidth: '100%' }}>
            {/* Week tracker */}
            <div 
              className="p-5 rounded-2xl" 
              style={{ 
                backgroundColor: colors.dark, 
                opacity: step >= 2 ? 1 : 0, 
                transform: step >= 2 ? 'translateY(0)' : 'translateY(20px)', 
                transition: 'all 0.5s ease' 
              }}
            >
              <p 
                className="text-xs font-semibold uppercase tracking-widest mb-3"
                style={{ color: colors.cream, opacity: 0.5 }}
              >
                This Week
              </p>
              <div className="flex justify-between gap-2">
                {['M','T','W','T','F','S','S'].map((d, i) => (
                  <div 
                    key={i} 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold" 
                    style={{ 
                      backgroundColor: i < 5 ? colors.coral : 'rgba(255,255,255,0.1)', 
                      color: colors.cream 
                    }}
                  >
                    {i < 5 ? '✓' : d}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Stats */}
            <div 
              className="grid grid-cols-3 gap-3" 
              style={{ 
                opacity: step >= 3 ? 1 : 0, 
                transform: step >= 3 ? 'translateY(0)' : 'translateY(20px)', 
                transition: 'all 0.5s ease' 
              }}
            >
              {[
                { v: '12', l: 'Check-ins' },
                { v: '3', l: 'Patterns' },
                { v: '5d', l: 'Streak' }
              ].map((s, i) => (
                <div key={i} className="p-4 rounded-xl text-center" style={{ backgroundColor: colors.dark }}>
                  <p style={{ color: colors.coral, fontSize: '1.75rem', fontWeight: 800, lineHeight: 1 }}>{s.v}</p>
                  <p style={{ color: colors.cream, fontSize: '0.7rem', fontWeight: 600, marginTop: 6, opacity: 0.7 }}>{s.l}</p>
                </div>
              ))}
            </div>
            
            {/* Top triggers */}
            <div 
              className="p-5 rounded-2xl" 
              style={{ 
                backgroundColor: colors.dark, 
                opacity: step >= 4 ? 1 : 0, 
                transform: step >= 4 ? 'translateY(0)' : 'translateY(20px)', 
                transition: 'all 0.5s ease' 
              }}
            >
              <p 
                className="text-xs font-semibold uppercase tracking-widest mb-4"
                style={{ color: colors.cream, opacity: 0.5 }}
              >
                Top Triggers
              </p>
              {[
                { trigger: 'Conflict', count: 4 },
                { trigger: 'Work pressure', count: 3 },
                { trigger: 'Loneliness', count: 2 }
              ].map((t, i) => (
                <div key={i} className="flex justify-between items-center mb-3 last:mb-0">
                  <span style={{ color: colors.cream, fontSize: '1rem' }}>{t.trigger}</span>
                  <span style={{ color: colors.coral, fontSize: '0.9rem', fontWeight: 700 }}>{t.count}×</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Narrative */}
          <div 
            className="text-center lg:text-left max-w-sm"
            style={{ 
              opacity: step >= 5 ? 1 : 0, 
              transform: step >= 5 ? 'translateY(0)' : 'translateY(30px)', 
              transition: 'all 0.8s ease' 
            }}
          >
            <p 
              className="text-xl md:text-2xl font-medium mb-4"
              style={{ color: colors.cream, lineHeight: 1.5 }}
            >
              What you said Tuesday connects to what's happening today.
            </p>
            <p 
              className="text-lg"
              style={{ color: colors.cream, opacity: 0.7, lineHeight: 1.5 }}
            >
              Patterns surface. Triggers become visible. Progress you can actually see.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// Section 3: Insights
function InsightsSection() {
  const { ref, inView } = useInView(0.3);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!inView) return;
    
    const timers: NodeJS.Timeout[] = [];
    timers.push(setTimeout(() => setStep(1), 300));
    timers.push(setTimeout(() => setStep(2), 800));
    timers.push(setTimeout(() => setStep(3), 1400));
    timers.push(setTimeout(() => setStep(4), 2000));
    timers.push(setTimeout(() => setStep(5), 2600));
    timers.push(setTimeout(() => setStep(6), 3200));
    timers.push(setTimeout(() => setStep(7), 4000));

    return () => timers.forEach(t => clearTimeout(t));
  }, [inView]);

  return (
    <section 
      ref={ref}
      className="min-h-screen flex items-center py-20 px-6 relative overflow-hidden"
      style={{ backgroundColor: colors.dark }}
    >
      <Orb size={400} className="-top-20 -right-40" />
      
      <div className="max-w-5xl mx-auto w-full">
        <div 
          className="text-center mb-12"
          style={{ 
            opacity: step >= 1 ? 1 : 0, 
            transform: step >= 1 ? 'translateY(0)' : 'translateY(30px)', 
            transition: 'all 0.6s ease' 
          }}
        >
          <p 
            className="text-sm font-bold uppercase tracking-widest mb-4"
            style={{ color: colors.coral }}
          >
            Step 3
          </p>
          <h2 
            className="text-3xl md:text-4xl font-bold"
            style={{ color: colors.cream }}
          >
            Spots what you'd miss on your own
          </h2>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-12 items-center justify-center">
          {/* Insight Card */}
          <div 
            className="rounded-2xl overflow-hidden" 
            style={{ 
              backgroundColor: colors.darkLight, 
              width: 380, 
              maxWidth: '100%',
              opacity: step >= 2 ? 1 : 0, 
              transform: step >= 2 ? 'translateY(0)' : 'translateY(30px)', 
              transition: 'all 0.6s ease',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)'
            }}
          >
            {/* Card header */}
            <div 
              className="px-5 py-4 flex items-center justify-between" 
              style={{ backgroundColor: colors.coral }}
            >
              <div className="flex items-center gap-2">
                <StarIcon size={14} />
                <span 
                  className="text-xs font-semibold uppercase tracking-widest"
                  style={{ color: colors.cream }}
                >
                  Pattern Detected
                </span>
              </div>
              <span style={{ color: colors.cream, fontSize: '0.75rem', opacity: 0.8 }}>This week</span>
            </div>
            
            {/* Card body */}
            <div className="p-5">
              {/* Trigger chain */}
              <div className="flex items-center justify-center gap-2 mb-6 flex-wrap">
                <span 
                  className="px-4 py-2 rounded-full text-sm font-semibold" 
                  style={{ 
                    backgroundColor: colors.dark, 
                    color: colors.coral, 
                    border: `2px solid ${colors.coral}`, 
                    opacity: step >= 3 ? 1 : 0, 
                    transition: 'all 0.4s ease' 
                  }}
                >
                  Work stress
                </span>
                <span style={{ color: colors.cream, fontSize: '1rem', opacity: step >= 3 ? 0.5 : 0, transition: 'all 0.4s ease' }}>→</span>
                <span 
                  className="px-4 py-2 rounded-full text-sm font-semibold" 
                  style={{ 
                    backgroundColor: colors.dark, 
                    color: colors.cream, 
                    opacity: step >= 4 ? 1 : 0, 
                    transition: 'all 0.4s ease' 
                  }}
                >
                  Anxiety
                </span>
                <span style={{ color: colors.cream, fontSize: '1rem', opacity: step >= 4 ? 0.5 : 0, transition: 'all 0.4s ease' }}>→</span>
                <span 
                  className="px-4 py-2 rounded-full text-sm font-semibold" 
                  style={{ 
                    backgroundColor: colors.dark, 
                    color: colors.cream, 
                    opacity: step >= 5 ? 1 : 0, 
                    transition: 'all 0.4s ease' 
                  }}
                >
                  Seeking escape
                </span>
              </div>
              
              {/* Frequency visual */}
              <div 
                className="mb-5 p-4 rounded-xl" 
                style={{ 
                  backgroundColor: colors.dark, 
                  opacity: step >= 5 ? 1 : 0, 
                  transition: 'all 0.5s ease' 
                }}
              >
                <div className="flex justify-between items-center mb-3">
                  <span 
                    className="text-xs uppercase tracking-widest"
                    style={{ color: colors.cream, opacity: 0.5 }}
                  >
                    Occurrences
                  </span>
                  <span style={{ color: colors.coral, fontSize: '0.9rem', fontWeight: 700 }}>4× this week</span>
                </div>
                <div className="flex gap-2">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => {
                    const heights = [1, 3, 0, 2, 0, 0, 1];
                    return (
                      <div key={i} className="flex-1 text-center">
                        <div 
                          className="mx-auto rounded-sm mb-2" 
                          style={{ 
                            width: 20, 
                            height: heights[i] > 0 ? heights[i] * 10 + 6 : 6,
                            backgroundColor: heights[i] > 0 ? colors.coral : 'rgba(255,255,255,0.1)',
                            opacity: heights[i] > 0 ? 1 : 0.3
                          }} 
                        />
                        <span style={{ color: colors.cream, fontSize: '0.65rem', opacity: 0.5 }}>{day}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Insight */}
              <div 
                className="p-4 rounded-xl" 
                style={{ 
                  backgroundColor: colors.dark, 
                  borderLeft: `4px solid ${colors.coral}`, 
                  opacity: step >= 6 ? 1 : 0, 
                  transform: step >= 6 ? 'translateY(0)' : 'translateY(10px)', 
                  transition: 'all 0.5s ease' 
                }}
              >
                <p style={{ color: colors.cream, fontSize: '1rem', lineHeight: 1.5, fontStyle: 'italic' }}>
                  "Each time after 9pm, following a high-stress day at work."
                </p>
              </div>
            </div>
          </div>
          
          {/* Narrative */}
          <div 
            className="text-center lg:text-left max-w-sm"
            style={{ 
              opacity: step >= 7 ? 1 : 0, 
              transform: step >= 7 ? 'translateY(0)' : 'translateY(30px)', 
              transition: 'all 0.8s ease' 
            }}
          >
            <p 
              className="text-xl md:text-2xl font-medium mb-4"
              style={{ color: colors.cream, lineHeight: 1.5 }}
            >
              The stress that precedes the behavior. The feelings underneath.
            </p>
            <p 
              className="text-lg"
              style={{ color: colors.cream, opacity: 0.7, lineHeight: 1.5 }}
            >
              Weekly reflections that show you what's actually happening — not what you tell yourself is happening.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.bg }}>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4" style={{ backgroundColor: `${colors.bg}ee`, backdropFilter: 'blur(10px)' }}>
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <StarIcon size={24} />
            <span className="font-black text-xl" style={{ color: colors.cream }}>Seen</span>
          </Link>
          <Link 
            href="/"
            className="flex items-center gap-2 text-sm font-medium transition-all hover:gap-3"
            style={{ color: colors.cream, opacity: 0.7 }}
          >
            <ArrowLeft size={16} /> Back
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-16 px-6 text-center">
        <p 
          className="text-lg font-bold uppercase tracking-widest mb-4"
          style={{ color: colors.coral }}
        >
          How it works
        </p>
        <h1 
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
          style={{ color: colors.cream }}
        >
          From blind spot to clarity
        </h1>
        <p 
          className="text-xl max-w-2xl mx-auto"
          style={{ color: colors.cream, opacity: 0.7 }}
        >
          Three steps. Daily practice. Patterns you couldn't see before.
        </p>
      </section>

      {/* Animated sections */}
      <CheckInSection />
      <TrackingSection />
      <InsightsSection />

      {/* CTA Section */}
      <section className="py-24 px-6 text-center" style={{ backgroundColor: colors.coral }}>
        <h2 
          className="text-3xl md:text-4xl font-bold mb-4"
          style={{ color: colors.cream }}
        >
          Ready to see your pattern?
        </h2>
        <p 
          className="text-xl mb-10"
          style={{ color: colors.cream, opacity: 0.85 }}
        >
          Take the free quiz. 2 minutes. Completely private.
        </p>
        <Link 
          href="/quiz"
          className="px-10 py-5 rounded-full font-bold text-lg inline-flex items-center gap-3 transition-all hover:scale-105"
          style={{ backgroundColor: colors.cream, color: colors.coral }}
        >
          Take the Quiz <ArrowRight size={22} />
        </Link>
      </section>

{/* Footer */}
      <footer className="px-6 py-8 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <StarIcon size={18} style={{ color: colors.coral }} />
              <span className="font-bold" style={{ color: colors.cream }}>Seen</span>
            </div>
            <div className="flex items-center gap-6 text-xs" style={{ color: colors.cream, opacity: 0.4 }}>
              <Link href="/story" className="hover:opacity-100 transition-opacity">Story</Link>
              <Link href="/faq" className="hover:opacity-100 transition-opacity">FAQ</Link>
              <Link href="/" className="hover:opacity-100 transition-opacity">Home</Link>
            </div>
          </div>
          <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
            <div className="flex items-center gap-6 text-xs" style={{ color: colors.cream, opacity: 0.3 }}>
              <Link href="/terms" className="hover:opacity-100 transition-opacity">Terms</Link>
              <Link href="/privacy" className="hover:opacity-100 transition-opacity">Privacy</Link>
              <Link href="/cookies" className="hover:opacity-100 transition-opacity">Cookies</Link>
            </div>
            <span className="text-xs" style={{ color: colors.cream, opacity: 0.3 }}>© 2025 Seen</span>
          </div>
        </div>
      </footer>
