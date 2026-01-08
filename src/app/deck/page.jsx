'use client';

import React, { useState, useEffect } from 'react';

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

const Globe = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);

const Target = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
  </svg>
);

const TrendingUp = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
  </svg>
);

const Users = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const Check = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const X = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const Clock = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);

const Heart = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

const Zap = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);

const MessageCircle = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
  </svg>
);

const Shield = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const Wine = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 22h8M12 18v4M12 18a7 7 0 0 0 7-7c0-2-1-3-1-5H6c0 2-1 3-1 5a7 7 0 0 0 7 7z"/>
  </svg>
);

const ShoppingBag = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0"/>
  </svg>
);

const Briefcase = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
  </svg>
);

const Moon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

const MapPin = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);

// Design system - matching page.jsx exactly
const ds = {
  bg: '#0f0f1a',
  surface: '#1a1a2e',
  surfaceLight: '#252542',
  coral: '#e85a4f',
  cream: '#faf8f5',
  muted: 'rgba(250,248,245,0.4)',
  subtle: 'rgba(250,248,245,0.12)',
  cyan: '#5B8F8F',
};

export default function InvestorDeck() {
  const [slide, setSlide] = useState(0);
  const [key, setKey] = useState(0);
  const [problemStep, setProblemStep] = useState(0);
  const [marketStep, setMarketStep] = useState(0);
  const [competitorStep, setCompetitorStep] = useState(0);
  const [whyNowStep, setWhyNowStep] = useState(0);

  const totalSlides = 14;

  const goTo = (n) => {
    setSlide(n);
    setKey(k => k + 1);
    if (n !== 2) setProblemStep(0);
    if (n !== 4) setMarketStep(0);
    if (n !== 8) setCompetitorStep(0);
    if (n !== 9) setWhyNowStep(0);
  };

  const handleNext = () => {
    if (slide === 2 && problemStep < 4) setProblemStep(s => s + 1);
    else if (slide === 4 && marketStep < 2) setMarketStep(s => s + 1);
    else if (slide === 8 && competitorStep < 2) setCompetitorStep(s => s + 1);
    else if (slide === 9 && whyNowStep < 2) setWhyNowStep(s => s + 1);
    else if (slide < totalSlides - 1) goTo(slide + 1);
  };

  const handlePrev = () => {
    if (slide === 2 && problemStep > 0) setProblemStep(s => s - 1);
    else if (slide === 4 && marketStep > 0) setMarketStep(s => s - 1);
    else if (slide === 8 && competitorStep > 0) setCompetitorStep(s => s - 1);
    else if (slide === 9 && whyNowStep > 0) setWhyNowStep(s => s - 1);
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

  const Orb = ({ color = ds.coral, size = 500, x = '50%', y = '50%', opacity = 0.08 }) => (
    <div style={{ position: 'absolute', width: size, height: size, left: x, top: y, transform: 'translate(-50%, -50%)', background: `radial-gradient(circle, ${color} 0%, transparent 70%)`, opacity, pointerEvents: 'none' }} />
  );

  const Star = ({ size = 28 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={ds.coral}>
      <path d="M12 0L13.5 10.5L24 12L13.5 13.5L12 24L10.5 13.5L0 12L10.5 10.5L12 0Z" />
    </svg>
  );

  const AccentLine = () => <div style={{ width: 60, height: 4, backgroundColor: ds.coral, borderRadius: 2 }} />;

  // SLIDE 0: Title
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
        <p style={{ color: ds.cream, fontSize: '1.5rem', fontWeight: 600 }}>See the pattern. Break the cycle.</p>
      </Reveal>
      <Reveal delay={400}>
        <p style={{ color: ds.muted, fontSize: '1.1rem', marginTop: 24 }}>Pre-seed Investment Deck</p>
      </Reveal>
    </div>
  );

  // SLIDE 1: Why I'm Building This (from page.jsx WhySlide)
  const WhySlide = () => (
    <div className="relative max-w-xl">
      <Orb size={400} x="80%" y="60%" opacity={0.08} />
      <Reveal delay={0}><AccentLine /></Reveal>
      <Reveal delay={100}><p style={{ color: ds.muted, fontSize: '0.9rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: 24, marginBottom: 32 }}>Why I'm building this</p></Reveal>
      <Reveal delay={200}><p style={{ color: ds.cream, fontSize: '1.4rem', fontWeight: 600, marginBottom: 24, lineHeight: 1.4 }}>I spent years in a gap I couldn't see.</p></Reveal>
      <Reveal delay={350}><p style={{ color: ds.muted, fontSize: '1.15rem', marginBottom: 24, lineHeight: 1.5 }}>I had a pattern — a way I coped when things got hard. I didn't recognize it as a pattern. I just thought it was who I was.</p></Reveal>
      <Reveal delay={500}><p style={{ color: ds.muted, fontSize: '1.15rem', marginBottom: 32, lineHeight: 1.5 }}>It took everything falling apart before I finally got help.</p></Reveal>
      <Reveal delay={700}><p style={{ color: ds.coral, fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.3 }}>I want to help people see it earlier.</p></Reveal>
    </div>
  );

  // SLIDE 2: The Problem - Global to NL zoom
  const ProblemSlide = () => (
    <div className="relative text-center" style={{ height: 340 }}>
      <Orb size={600} x="50%" y="50%" opacity={0.08} />
      <p style={{ color: ds.muted, fontSize: '0.9rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 24 }}>The scale of the problem</p>
      <div style={{ position: 'relative', height: 260 }}>
        {[
          { stat: '1B+', desc: 'people live with a mental health condition', cite: 'WHO Mental Health Atlas, 2025', icon: <Globe size={20} /> },
          { stat: '91%', desc: 'of people with depression never receive adequate care', cite: 'WHO World Mental Health Report, 2025', icon: <Users size={20} /> },
          { stat: '11 yrs', desc: 'average delay from first symptoms to treatment', cite: 'WHO Mental Health Gap', icon: <Clock size={20} /> },
          { stat: '$1T', desc: 'lost annually to depression and anxiety alone', cite: 'WHO Economic Impact, 2025', icon: <TrendingUp size={20} /> },
          { stat: '90K+', desc: 'on mental health waiting lists in the Netherlands', cite: 'GGZ Nederland, 2024', icon: <MapPin size={20} />, highlight: true },
        ].map((item, i) => (
          <div key={i} style={{ position: 'absolute', width: '100%', top: 0, transition: 'opacity 0.5s ease, transform 0.5s ease', opacity: problemStep === i ? 1 : 0, transform: problemStep === i ? 'translateY(0)' : 'translateY(30px)' }}>
            <div className="flex items-center justify-center gap-2 mb-4" style={{ color: item.highlight ? ds.cyan : ds.coral }}>
              {item.icon}
              <span style={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                {item.highlight ? 'Netherlands' : 'Global'}
              </span>
            </div>
            <h2 style={{ color: item.highlight ? ds.cyan : ds.coral, fontSize: '5.5rem', fontWeight: 900, lineHeight: 0.85, letterSpacing: '-0.04em' }}>{item.stat}</h2>
            <p style={{ color: ds.cream, fontSize: '1.25rem', fontWeight: 700, marginTop: 20, lineHeight: 1.2 }}>{item.desc}</p>
            <p style={{ color: ds.muted, fontSize: '0.75rem', marginTop: 12 }}>{item.cite}</p>
          </div>
        ))}
      </div>
      <p style={{ position: 'absolute', bottom: 0, left: 0, right: 0, color: ds.muted, fontSize: '0.8rem', opacity: problemStep < 4 ? 1 : 0 }}>
        {problemStep < 4 ? 'Click → to continue' : ''}
      </p>
    </div>
  );

  // SLIDE 3: The Gap (from page.jsx)
  const GapSlide = () => (
    <div className="text-center relative">
      <Orb size={600} x="50%" y="50%" opacity={0.08} />
      <Reveal delay={0}><p style={{ color: ds.muted, fontSize: '1.1rem', marginBottom: 32 }}>There's a huge space between</p></Reveal>
      <Reveal delay={150}><h2 style={{ color: ds.coral, fontSize: '2.25rem', fontWeight: 800 }}>"something feels off"</h2></Reveal>
      <Reveal delay={300}>
        <div className="flex items-center justify-center gap-4 my-5">
          <div style={{ width: 40, height: 2, backgroundColor: ds.subtle }} />
          <p style={{ color: ds.muted, fontSize: '0.9rem', fontStyle: 'italic' }}>and</p>
          <div style={{ width: 40, height: 2, backgroundColor: ds.subtle }} />
        </div>
      </Reveal>
      <Reveal delay={450}><h2 style={{ color: ds.coral, fontSize: '2.25rem', fontWeight: 800, marginBottom: 40 }}>"I need help"</h2></Reveal>
      <Reveal delay={650}><p style={{ color: ds.cream, fontSize: '1.5rem', fontWeight: 700 }}>Most people live there for <span style={{ color: ds.coral }}>years</span>.</p></Reveal>
      <Reveal delay={850}><p style={{ color: ds.muted, fontSize: '1.1rem', marginTop: 16 }}>No one is building for those years.</p></Reveal>
    </div>
  );

  // SLIDE 4: Market Size
  const MarketSlide = () => (
    <div className="relative text-center" style={{ height: 380 }}>
      <Orb size={500} x="50%" y="50%" opacity={0.08} />
      <p style={{ color: ds.muted, fontSize: '0.9rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 24 }}>Market Opportunity</p>
      
      <div style={{ height: 300, position: 'relative' }}>
        {/* Global */}
        <div style={{ position: 'absolute', width: '100%', top: 0, transition: 'all 0.5s ease', opacity: marketStep === 0 ? 1 : 0, transform: marketStep === 0 ? 'translateY(0)' : 'translateY(30px)' }}>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Globe size={24} style={{ color: ds.coral }} />
            <span style={{ color: ds.cream, fontSize: '1rem', fontWeight: 600 }}>Global Mental Health Apps</span>
          </div>
          <h2 style={{ color: ds.coral, fontSize: '4rem', fontWeight: 900, marginBottom: 8 }}>$8.5B → $41B</h2>
          <p style={{ color: ds.muted, fontSize: '1rem' }}>2025 → 2035 (17% CAGR)</p>
          <p style={{ color: ds.cream, fontSize: '1.1rem', marginTop: 24, maxWidth: 400, margin: '24px auto 0' }}>
            The "pre-therapy" segment is underserved globally. Most apps are either wellness (too light) or therapy (too heavy).
          </p>
        </div>

        {/* Netherlands TAM/SAM */}
        <div style={{ position: 'absolute', width: '100%', top: 0, transition: 'all 0.5s ease', opacity: marketStep === 1 ? 1 : 0, transform: marketStep === 1 ? 'translateY(0)' : 'translateY(30px)' }}>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Target size={24} style={{ color: ds.cyan }} />
            <span style={{ color: ds.cream, fontSize: '1rem', fontWeight: 600 }}>Netherlands Beachhead</span>
          </div>
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
            {[
              { label: 'TAM', value: '4.8M', sub: 'Adults 25-45' },
              { label: 'SAM', value: '1.2-1.5M', sub: 'Untreated distress' },
              { label: 'SOM', value: '25-45K', sub: 'Paid subs (24mo)' },
            ].map((m, i) => (
              <div key={i} className="p-4 rounded-xl" style={{ backgroundColor: ds.surface }}>
                <p style={{ color: ds.muted, fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em', marginBottom: 8 }}>{m.label}</p>
                <p style={{ color: i === 1 ? ds.coral : ds.cream, fontSize: '1.5rem', fontWeight: 800, lineHeight: 1 }}>{m.value}</p>
                <p style={{ color: ds.muted, fontSize: '0.7rem', marginTop: 4 }}>{m.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Why NL */}
        <div style={{ position: 'absolute', width: '100%', top: 0, transition: 'all 0.5s ease', opacity: marketStep === 2 ? 1 : 0, transform: marketStep === 2 ? 'translateY(0)' : 'translateY(30px)' }}>
          <h3 style={{ color: ds.cream, fontSize: '1.5rem', fontWeight: 800, marginBottom: 24 }}>Why Netherlands First</h3>
          <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto text-left">
            {[
              { title: '90K+ waiting lists', desc: 'GPs desperate for bridging tools' },
              { title: 'POH-GGZ pathway', desc: 'Built-in referral channel' },
              { title: 'Prevention budgets', desc: 'Insurance reimbursement potential' },
              { title: 'High digital adoption', desc: 'Tech-savvy population' },
            ].map((item, i) => (
              <div key={i} className="p-3 rounded-lg flex items-start gap-2" style={{ backgroundColor: ds.surface }}>
                <Check size={16} style={{ color: ds.cyan, marginTop: 2, flexShrink: 0 }} />
                <div>
                  <p style={{ color: ds.cream, fontSize: '0.85rem', fontWeight: 600 }}>{item.title}</p>
                  <p style={{ color: ds.muted, fontSize: '0.75rem' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <p style={{ position: 'absolute', bottom: 0, left: 0, right: 0, color: ds.muted, fontSize: '0.8rem', opacity: marketStep < 2 ? 1 : 0 }}>
        {marketStep < 2 ? 'Click → to continue' : ''}
      </p>
    </div>
  );

  // SLIDE 5: Solution
  const SolutionSlide = () => (
    <div className="relative max-w-2xl mx-auto">
      <Orb size={400} x="80%" y="30%" opacity={0.08} />
      <Reveal delay={0}><AccentLine /></Reveal>
      <Reveal delay={100}>
        <p style={{ color: ds.muted, fontSize: '0.9rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: 24, marginBottom: 12 }}>The Solution</p>
      </Reveal>
      <Reveal delay={200}>
        <h2 style={{ color: ds.cream, fontSize: '2.25rem', fontWeight: 800, lineHeight: 1.15, marginBottom: 32 }}>
          A mirror for your patterns.<br/><span style={{ color: ds.coral }}>A bridge to change.</span>
        </h2>
      </Reveal>
      <Reveal delay={400}>
        <p style={{ color: ds.muted, fontSize: '1.1rem', lineHeight: 1.6, marginBottom: 32 }}>
          Seen helps people identify their stress-response patterns through a research-backed assessment, 
          then builds self-awareness through daily AI-powered check-ins.
        </p>
      </Reveal>
      <Reveal delay={600}>
        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: <Target size={20} />, title: 'Pattern Assessment', desc: '14 questions → 6 distinct patterns' },
            { icon: <MessageCircle size={20} />, title: 'Daily Check-ins', desc: 'AI-powered, proactive outreach' },
            { icon: <TrendingUp size={20} />, title: 'Insights Dashboard', desc: 'Triggers surfaced, progress tracked' },
            { icon: <Shield size={20} />, title: 'Privacy-First', desc: 'GDPR compliant, anonymous by default' },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl flex items-start gap-3" style={{ backgroundColor: ds.surface }}>
              <div className="p-2 rounded-lg" style={{ backgroundColor: ds.bg, color: ds.coral }}>{item.icon}</div>
              <div>
                <p style={{ color: ds.cream, fontSize: '0.9rem', fontWeight: 700 }}>{item.title}</p>
                <p style={{ color: ds.muted, fontSize: '0.8rem' }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  );

  // SLIDE 6: The 6 Patterns
  const PatternsSlide = () => {
    const patterns = [
      { icon: <Heart size={18} />, name: 'Intimacy', desc: 'Seeking connection' },
      { icon: <Wine size={18} />, name: 'Substances', desc: 'Using to cope' },
      { icon: <ShoppingBag size={18} />, name: 'Spending', desc: 'Buying for relief' },
      { icon: <Briefcase size={18} />, name: 'Work', desc: 'Overworking to avoid' },
      { icon: <Users size={18} />, name: 'Approval', desc: 'Seeking validation' },
      { icon: <Moon size={18} />, name: 'Withdrawal', desc: 'Retreating' },
    ];
    return (
      <div className="text-center relative">
        <Orb size={500} x="50%" y="60%" opacity={0.06} />
        <Reveal delay={0}>
          <p style={{ color: ds.muted, fontSize: '0.9rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 }}>The Framework</p>
          <h2 style={{ color: ds.cream, fontSize: '2.25rem', fontWeight: 800, marginBottom: 8 }}>Six stress-response <span style={{ color: ds.coral }}>patterns</span></h2>
          <p style={{ color: ds.muted, fontSize: '1rem', marginBottom: 32 }}>Each mapped to clinical research. Each with tailored questions.</p>
        </Reveal>
        <div className="grid grid-cols-3 gap-3 max-w-xl mx-auto">
          {patterns.map((p, i) => (
            <Reveal key={i} delay={200 + i * 100}>
              <div className="p-4 rounded-xl" style={{ backgroundColor: ds.surface }}>
                <div className="flex items-center justify-center gap-2 mb-2" style={{ color: ds.coral }}>
                  {p.icon}
                </div>
                <p style={{ color: ds.cream, fontSize: '0.9rem', fontWeight: 700 }}>{p.name}</p>
                <p style={{ color: ds.muted, fontSize: '0.75rem', marginTop: 4 }}>{p.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={900}>
          <p style={{ color: ds.muted, fontSize: '0.8rem', marginTop: 24, fontStyle: 'italic' }}>
            Based on peer-reviewed research: Weinstein et al., Koob & Volkow, Schaufeli et al.
          </p>
        </Reveal>
      </div>
    );
  };

  // SLIDE 7: Product
  const ProductSlide = () => (
    <div className="relative max-w-2xl mx-auto">
      <Orb size={400} x="20%" y="70%" opacity={0.08} />
      <Reveal delay={0}>
        <p style={{ color: ds.muted, fontSize: '0.9rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 }}>The Product</p>
        <h2 style={{ color: ds.cream, fontSize: '2.25rem', fontWeight: 800, marginBottom: 32 }}>Built and <span style={{ color: ds.coral }}>ready to launch</span></h2>
      </Reveal>
      
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { step: '1', title: 'Discover', desc: 'Social/search → quiz' },
          { step: '2', title: 'Assess', desc: '14 questions → pattern' },
          { step: '3', title: 'Engage', desc: 'Daily check-ins → insights' },
        ].map((item, i) => (
          <Reveal key={i} delay={200 + i * 150}>
            <div className="p-4 rounded-xl text-center" style={{ backgroundColor: ds.surface }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: ds.coral, color: ds.cream, fontSize: '0.9rem', fontWeight: 700 }}>{item.step}</div>
              <p style={{ color: ds.cream, fontSize: '1rem', fontWeight: 700 }}>{item.title}</p>
              <p style={{ color: ds.muted, fontSize: '0.8rem', marginTop: 4 }}>{item.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={700}>
        <div className="p-5 rounded-xl" style={{ backgroundColor: ds.surface, borderLeft: `4px solid ${ds.coral}` }}>
          <p style={{ color: ds.cream, fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>Key differentiators:</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              "Proactive outreach — doesn't wait for you",
              'Pattern-specific — not one-size-fits-all',
              'Gradual depth — builds honesty capacity',
              'Behavior-focused — reduces shame',
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <Zap size={14} style={{ color: ds.coral, marginTop: 3, flexShrink: 0 }} />
                <p style={{ color: ds.muted, fontSize: '0.8rem' }}>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );

  // SLIDE 8: Competition
  const CompetitionSlide = () => (
    <div className="relative text-center" style={{ height: 380 }}>
      <Orb size={500} x="50%" y="50%" opacity={0.06} />
      <p style={{ color: ds.muted, fontSize: '0.9rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 24 }}>Competition</p>
      
      <div style={{ height: 320, position: 'relative' }}>
        {/* Matrix */}
        <div style={{ position: 'absolute', width: '100%', top: 0, transition: 'all 0.5s ease', opacity: competitorStep === 0 ? 1 : 0, transform: competitorStep === 0 ? 'translateY(0)' : 'translateY(30px)' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm max-w-xl mx-auto">
              <thead>
                <tr style={{ borderBottom: `2px solid ${ds.subtle}` }}>
                  <th className="text-left py-2 px-2" style={{ color: ds.muted }}>App</th>
                  <th className="text-center py-2 px-2" style={{ color: ds.muted }}>Rating</th>
                  <th className="text-center py-2 px-2" style={{ color: ds.muted }}>Proactive</th>
                  <th className="text-center py-2 px-2" style={{ color: ds.muted }}>Pattern</th>
                  <th className="text-center py-2 px-2" style={{ color: ds.muted }}>Pre-therapy</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Finch', rating: '4.5★', pro: false, pat: false, pre: false },
                  { name: 'Daylio', rating: '4.5★', pro: false, pat: false, pre: false },
                  { name: 'Wysa', rating: '4.2★', pro: false, pat: false, pre: true },
                  { name: 'Liven', rating: '2.1★', pro: true, pat: true, pre: true },
                  { name: 'Seen', rating: '—', pro: true, pat: true, pre: true, highlight: true },
                ].map((row, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${ds.subtle}`, backgroundColor: row.highlight ? `${ds.coral}15` : 'transparent' }}>
                    <td className="py-2 px-2 font-medium" style={{ color: row.highlight ? ds.coral : ds.cream }}>{row.name}</td>
                    <td className="py-2 px-2 text-center" style={{ color: ds.muted }}>{row.rating}</td>
                    <td className="py-2 px-2 text-center">{row.pro ? <Check size={14} style={{ color: ds.cyan }} className="mx-auto" /> : <X size={14} style={{ color: ds.muted, opacity: 0.3 }} className="mx-auto" />}</td>
                    <td className="py-2 px-2 text-center">{row.pat ? <Check size={14} style={{ color: ds.cyan }} className="mx-auto" /> : <X size={14} style={{ color: ds.muted, opacity: 0.3 }} className="mx-auto" />}</td>
                    <td className="py-2 px-2 text-center">{row.pre ? <Check size={14} style={{ color: ds.cyan }} className="mx-auto" /> : <X size={14} style={{ color: ds.muted, opacity: 0.3 }} className="mx-auto" />}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Failures */}
        <div style={{ position: 'absolute', width: '100%', top: 0, transition: 'all 0.5s ease', opacity: competitorStep === 1 ? 1 : 0, transform: competitorStep === 1 ? 'translateY(0)' : 'translateY(30px)' }}>
          <h3 style={{ color: ds.cream, fontSize: '1.5rem', fontWeight: 800, marginBottom: 24 }}>Competitor Failures = <span style={{ color: ds.coral }}>Our Opening</span></h3>
          <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto text-left">
            <div className="p-4 rounded-xl" style={{ backgroundColor: ds.surface }}>
              <p style={{ color: ds.coral, fontSize: '1rem', fontWeight: 700 }}>Woebot</p>
              <p style={{ color: ds.muted, fontSize: '0.85rem', marginTop: 4 }}>Shut down consumer app June 2025. Pivoted to B2B only. Validates AI-therapy works — B2C model didn't.</p>
            </div>
            <div className="p-4 rounded-xl" style={{ backgroundColor: ds.surface }}>
              <p style={{ color: ds.coral, fontSize: '1rem', fontWeight: 700 }}>Liven</p>
              <p style={{ color: ds.muted, fontSize: '0.85rem', marginTop: 4 }}>47% of reviews cite billing scams. 2.1★ rating. Validates demand — destroyed trust.</p>
            </div>
          </div>
        </div>

        {/* Why we win */}
        <div style={{ position: 'absolute', width: '100%', top: 0, transition: 'all 0.5s ease', opacity: competitorStep === 2 ? 1 : 0, transform: competitorStep === 2 ? 'translateY(0)' : 'translateY(30px)' }}>
          <h3 style={{ color: ds.coral, fontSize: '2rem', fontWeight: 800, marginBottom: 24 }}>Why Seen wins</h3>
          <div className="space-y-3 max-w-md mx-auto text-left">
            {[
              { vs: 'vs. Finch/Daylio', why: 'Depth — we identify specific patterns, not generic moods' },
              { vs: 'vs. Wysa', why: 'Specialization — pattern-specific, not one-size-fits-all CBT' },
              { vs: 'vs. Liven', why: 'Trust — transparent pricing, no dark patterns' },
            ].map((item, i) => (
              <div key={i} className="p-3 rounded-lg" style={{ backgroundColor: ds.surface }}>
                <span style={{ color: ds.coral, fontSize: '0.8rem', fontWeight: 700 }}>{item.vs}: </span>
                <span style={{ color: ds.muted, fontSize: '0.85rem' }}>{item.why}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <p style={{ position: 'absolute', bottom: 0, left: 0, right: 0, color: ds.muted, fontSize: '0.8rem', opacity: competitorStep < 2 ? 1 : 0 }}>
        {competitorStep < 2 ? 'Click → to continue' : ''}
      </p>
    </div>
  );

  // SLIDE 9: Why Now
  const WhyNowSlide = () => (
    <div className="relative text-center" style={{ height: 340 }}>
      <Orb size={500} x="50%" y="50%" opacity={0.08} />
      <p style={{ color: ds.muted, fontSize: '0.9rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 24 }}>Timing</p>
      
      <div style={{ height: 280, position: 'relative' }}>
        {[
          { num: '01', title: 'AI crossed the threshold', desc: 'LLMs now capable of emotionally intelligent conversations. What was impossible 2 years ago is achievable today.' },
          { num: '02', title: 'Competitors created opening', desc: 'Woebot abandoned B2C. Liven destroyed trust. The market is primed for an ethical, effective alternative.' },
          { num: '03', title: 'System overload', desc: '90K+ waiting lists in NL alone. GPs actively seeking e-health tools to recommend. Prevention budgets expanding.' },
        ].map((item, i) => (
          <div key={i} style={{ position: 'absolute', width: '100%', top: 0, transition: 'all 0.5s ease', opacity: whyNowStep === i ? 1 : 0, transform: whyNowStep === i ? 'translateY(0)' : 'translateY(30px)' }}>
            <p style={{ color: ds.coral, fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.15em', marginBottom: 8 }}>{item.num}</p>
            <p style={{ color: ds.cream, fontSize: '2.5rem', fontWeight: 800, lineHeight: 1, marginBottom: 20 }}>{item.title}</p>
            <p style={{ color: ds.muted, fontSize: '1.1rem', maxWidth: 500, margin: '0 auto', lineHeight: 1.5 }}>{item.desc}</p>
          </div>
        ))}
      </div>
      
      <p style={{ position: 'absolute', bottom: 0, left: 0, right: 0, color: ds.muted, fontSize: '0.8rem', opacity: whyNowStep < 2 ? 1 : 0 }}>
        {whyNowStep < 2 ? 'Click → to continue' : ''}
      </p>
    </div>
  );

  // SLIDE 10: Business Model
  const BusinessSlide = () => (
    <div className="relative max-w-2xl mx-auto">
      <Orb size={400} x="80%" y="30%" opacity={0.08} />
      <Reveal delay={0}>
        <p style={{ color: ds.muted, fontSize: '0.9rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 }}>Business Model</p>
        <h2 style={{ color: ds.cream, fontSize: '2rem', fontWeight: 800, marginBottom: 32 }}>Simple. Transparent. <span style={{ color: ds.coral }}>Scalable.</span></h2>
      </Reveal>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <Reveal delay={200}>
          <div className="p-5 rounded-xl text-center" style={{ backgroundColor: ds.surface }}>
            <p style={{ color: ds.muted, fontSize: '0.8rem', fontWeight: 600, marginBottom: 8 }}>FREE</p>
            <p style={{ color: ds.cream, fontSize: '2rem', fontWeight: 800 }}>€0</p>
            <div className="mt-4 text-left space-y-2">
              {['Pattern assessment', 'Immediate results', 'Email sequence'].map((item, i) => (
                <p key={i} style={{ color: ds.muted, fontSize: '0.8rem' }}>• {item}</p>
              ))}
            </div>
          </div>
        </Reveal>
        <Reveal delay={350}>
          <div className="p-5 rounded-xl text-center" style={{ backgroundColor: ds.surface, border: `2px solid ${ds.coral}` }}>
            <p style={{ color: ds.coral, fontSize: '0.8rem', fontWeight: 600, marginBottom: 8 }}>FOUNDING MEMBER</p>
            <p style={{ color: ds.coral, fontSize: '2rem', fontWeight: 800 }}>€7.99<span style={{ fontSize: '1rem', fontWeight: 400 }}>/mo</span></p>
            <div className="mt-4 text-left space-y-2">
              {['Daily AI check-ins', 'Pattern tracking', 'Insights dashboard'].map((item, i) => (
                <p key={i} style={{ color: ds.muted, fontSize: '0.8rem' }}>• {item}</p>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      <Reveal delay={500}>
        <div className="p-4 rounded-xl" style={{ backgroundColor: ds.surface }}>
          <p style={{ color: ds.cream, fontSize: '0.9rem', fontWeight: 600, marginBottom: 12 }}>Target Unit Economics</p>
          <div className="grid grid-cols-4 gap-3 text-center">
            {[
              { label: 'ARPU', value: '€7.99' },
              { label: 'Target LTV', value: '€48-72' },
              { label: 'Target CAC', value: '<€15' },
              { label: 'LTV:CAC', value: '>3:1' },
            ].map((item, i) => (
              <div key={i}>
                <p style={{ color: ds.muted, fontSize: '0.7rem', marginBottom: 4 }}>{item.label}</p>
                <p style={{ color: ds.coral, fontSize: '1.1rem', fontWeight: 700 }}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );

  // SLIDE 11: Traction
  const TractionSlide = () => (
    <div className="relative max-w-2xl mx-auto">
      <Orb size={400} x="20%" y="70%" opacity={0.08} />
      <Reveal delay={0}>
        <p style={{ color: ds.muted, fontSize: '0.9rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 }}>Progress</p>
        <h2 style={{ color: ds.cream, fontSize: '2rem', fontWeight: 800, marginBottom: 32 }}>Product built. Launch <span style={{ color: ds.coral }}>imminent</span>.</h2>
      </Reveal>

      <Reveal delay={200}>
        <div className="space-y-3 mb-8">
          {[
            { item: 'Pattern assessment quiz', status: 'Built', done: true },
            { item: 'Daily AI check-in engine', status: 'Built', done: true },
            { item: 'Insights dashboard', status: 'Built', done: true },
            { item: 'Privacy/GDPR compliance', status: 'In progress', done: false },
            { item: 'Friends & family testing', status: 'Next', done: false },
            { item: 'Soft launch', status: 'End Jan 2026', done: false, highlight: true },
          ].map((row, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: row.highlight ? `${ds.coral}15` : ds.surface }}>
              <span style={{ color: ds.cream, fontSize: '0.9rem' }}>{row.item}</span>
              <span className="flex items-center gap-2">
                {row.done ? <Check size={14} style={{ color: ds.cyan }} /> : <Clock size={14} style={{ color: ds.coral }} />}
                <span style={{ color: row.done ? ds.cyan : ds.coral, fontSize: '0.8rem', fontWeight: 600 }}>{row.status}</span>
              </span>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal delay={500}>
        <div className="p-4 rounded-xl" style={{ backgroundColor: ds.surface, borderLeft: `4px solid ${ds.cyan}` }}>
          <p style={{ color: ds.cream, fontSize: '0.9rem', fontWeight: 600, marginBottom: 8 }}>Validation</p>
          <p style={{ color: ds.muted, fontSize: '0.85rem', lineHeight: 1.5 }}>
            Research-backed framework • Therapeutic technique integration (OARS, Stages of Change) • 
            Market research confirms gap • Automated testing shows psychological safety maintained
          </p>
        </div>
      </Reveal>
    </div>
  );

  // SLIDE 12: Vision
  const VisionSlide = () => {
    const [visStep, setVisStep] = useState(0);
    
    useEffect(() => {
      setVisStep(0);
      const timers = [
        setTimeout(() => setVisStep(1), 400),
        setTimeout(() => setVisStep(2), 900),
        setTimeout(() => setVisStep(3), 1400),
        setTimeout(() => setVisStep(4), 1900),
      ];
      return () => timers.forEach(t => clearTimeout(t));
    }, [slide]);

    const phases = [
      { phase: 'Phase 1', name: 'PRE', status: 'NOW', statusColor: ds.coral, desc: 'Pattern recognition + daily awareness. Getting people ready for change.', featured: true },
      { phase: 'Phase 2', name: 'DURING', status: 'NEXT', statusColor: ds.muted, desc: 'Between-session support for people in therapy. B2B potential.', featured: false },
      { phase: 'Phase 3', name: 'POST', status: 'LATER', statusColor: ds.muted, desc: 'Maintenance + relapse prevention. Long-term retention.', featured: false },
    ];

    return (
      <div className="text-center relative">
        <Orb size={600} x="50%" y="50%" opacity={0.08} />
        <div style={{ opacity: visStep >= 0 ? 1 : 0, transform: visStep >= 0 ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s ease' }}>
          <p style={{ color: ds.muted, fontSize: '0.9rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 }}>The Vision</p>
          <h2 style={{ color: ds.cream, fontSize: '2.5rem', fontWeight: 800, marginBottom: 32 }}>Where this <span style={{ color: ds.coral }}>goes</span></h2>
        </div>
        
        <div className="space-y-4 max-w-lg mx-auto text-left">
          {phases.map((p, i) => (
            <div 
              key={i}
              className="p-4 rounded-xl"
              style={{ 
                backgroundColor: p.featured ? ds.surface : ds.bg,
                border: p.featured ? `2px solid ${ds.coral}` : `1px solid ${ds.surface}`,
                opacity: visStep >= i + 1 ? 1 : 0,
                transform: visStep >= i + 1 ? 'translateY(0)' : 'translateY(20px)',
                transition: 'all 0.5s ease'
              }}
            >
              <div className="flex items-center gap-3 mb-2">
                <span style={{ color: p.featured ? ds.coral : ds.muted, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em' }}>{p.phase}</span>
                <span style={{ color: p.featured ? ds.cream : ds.muted, fontSize: '1.25rem', fontWeight: 800 }}>{p.name}</span>
                <span className="px-2 py-0.5 rounded text-xs font-bold" style={{ backgroundColor: p.statusColor, color: p.featured ? ds.cream : ds.bg }}>{p.status}</span>
              </div>
              <p style={{ color: p.featured ? ds.cream : ds.muted, fontSize: '0.9rem', lineHeight: 1.4 }}>{p.desc}</p>
            </div>
          ))}
        </div>
        
        <div style={{ opacity: visStep >= 4 ? 1 : 0, transform: visStep >= 4 ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.8s ease', marginTop: 24 }}>
          <p style={{ color: ds.muted, fontSize: '0.9rem', fontStyle: 'italic' }}>
            + BESIDE: A separate product for partners of people with patterns
          </p>
        </div>
      </div>
    );
  };

  // SLIDE 13: The Ask
  const AskSlide = () => (
    <div className="text-center relative">
      <Orb size={700} x="50%" y="50%" opacity={0.1} />
      <Reveal delay={0}>
        <p style={{ color: ds.muted, fontSize: '0.9rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 }}>The Ask</p>
        <h2 style={{ color: ds.cream, fontSize: '2.5rem', fontWeight: 800, marginBottom: 8 }}>Launch capital to <span style={{ color: ds.coral }}>reach users</span></h2>
      </Reveal>
      
      <Reveal delay={200}>
        <div className="p-6 rounded-2xl my-8 max-w-md mx-auto" style={{ backgroundColor: ds.surface }}>
          <p style={{ color: ds.muted, fontSize: '0.9rem', marginBottom: 8 }}>Raising</p>
          <p style={{ color: ds.coral, fontSize: '3.5rem', fontWeight: 900 }}>€[TBD]</p>
          <p style={{ color: ds.muted, fontSize: '0.9rem', marginTop: 8 }}>Pre-seed / Angel</p>
        </div>
      </Reveal>

      <Reveal delay={400}>
        <div className="max-w-md mx-auto text-left space-y-3">
          {[
            { label: 'Marketing & UA', pct: '50%', desc: 'Instagram, content, reach' },
            { label: 'Founder runway', pct: '30%', desc: '6-12 months full focus' },
            { label: 'Product dev', pct: '15%', desc: 'Phase 2, scaling' },
            { label: 'Legal', pct: '5%', desc: 'NEN 7510, GDPR' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4">
              <span style={{ color: ds.coral, fontSize: '1.1rem', fontWeight: 700, width: 50 }}>{item.pct}</span>
              <div>
                <p style={{ color: ds.cream, fontSize: '0.9rem', fontWeight: 600 }}>{item.label}</p>
                <p style={{ color: ds.muted, fontSize: '0.75rem' }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal delay={600}>
        <p style={{ color: ds.coral, fontSize: '1.25rem', fontWeight: 700, marginTop: 32, lineHeight: 1.4 }}>
          The product is built. The market is validated.<br/>This is fuel to reach the people who need it.
        </p>
      </Reveal>
    </div>
  );

  // Render
  const slideNames = ['Title', 'Why', 'Problem', 'Gap', 'Market', 'Solution', 'Patterns', 'Product', 'Competition', 'Why Now', 'Business', 'Traction', 'Vision', 'Ask'];

  const renderSlide = () => {
    switch (slide) {
      case 0: return <TitleSlide />;
      case 1: return <WhySlide />;
      case 2: return <ProblemSlide />;
      case 3: return <GapSlide />;
      case 4: return <MarketSlide />;
      case 5: return <SolutionSlide />;
      case 6: return <PatternsSlide />;
      case 7: return <ProductSlide />;
      case 8: return <CompetitionSlide />;
      case 9: return <WhyNowSlide />;
      case 10: return <BusinessSlide />;
      case 11: return <TractionSlide />;
      case 12: return <VisionSlide />;
      case 13: return <AskSlide />;
      default: return <TitleSlide />;
    }
  };

  return (
    <div style={{ backgroundColor: ds.bg, minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
      <div className="min-h-screen flex items-center justify-center p-6 pb-20 overflow-hidden">
        <div className="max-w-3xl w-full relative">{renderSlide()}</div>
      </div>
      
      {/* Slide indicator */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full" style={{ backgroundColor: ds.surface }}>
        <p style={{ color: ds.muted, fontSize: '0.75rem' }}>{slideNames[slide]}</p>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4" style={{ backgroundColor: ds.bg }}>
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button onClick={handlePrev} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: slide === 0 ? 'transparent' : ds.subtle, color: slide === 0 ? ds.subtle : ds.cream, cursor: slide === 0 ? 'default' : 'pointer' }}>
            <ArrowLeft size={16} />
          </button>
          <div className="flex gap-1">
            {Array.from({ length: totalSlides }).map((_, i) => (
              <button key={i} onClick={() => goTo(i)} style={{ width: i === slide ? 20 : 5, height: 5, borderRadius: 3, backgroundColor: i === slide ? ds.coral : ds.subtle, transition: 'all 0.3s' }} />
            ))}
          </div>
          <button onClick={handleNext} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: slide === totalSlides - 1 ? ds.subtle : ds.coral, color: ds.cream, cursor: slide === totalSlides - 1 ? 'default' : 'pointer', opacity: slide === totalSlides - 1 ? 0.4 : 1 }}>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
