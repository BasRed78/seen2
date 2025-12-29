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

const Heart = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

const Shield = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const Lock = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const Globe = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);

const Trash = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>
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

const Users = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const Moon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

// Design system - defined outside component to prevent recreation
const ds = {
  bg: '#0f0f1a',
  surface: '#1a1a2e',
  surfaceLight: '#252542',
  coral: '#e85a4f',
  cream: '#faf8f5',
  muted: 'rgba(250,248,245,0.4)',
  subtle: 'rgba(250,248,245,0.12)',
};

// Chat message - no animation, just appears
const ChatMessage = ({ msg, isAi }) => (
  <div>
    {isAi ? (
      <div className="px-4 py-3 rounded-xl rounded-tl-sm" style={{ backgroundColor: ds.bg, maxWidth: '90%' }}>
        <p style={{ color: ds.cream, fontSize: '0.85rem', lineHeight: 1.4 }}>{msg}</p>
      </div>
    ) : (
      <div className="px-4 py-3 rounded-xl rounded-tr-sm ml-auto" style={{ backgroundColor: ds.coral, maxWidth: '85%' }}>
        <p style={{ color: ds.cream, fontSize: '0.85rem', lineHeight: 1.4 }}>{msg}</p>
      </div>
    )}
  </div>
);

export default function PitchDeck() {
  const [slide, setSlide] = useState(0);
  const [key, setKey] = useState(0);
  const [scopeStep, setScopeStep] = useState(0);
  const [stuckStep, setStuckStep] = useState(0);
  const [questionStep, setQuestionStep] = useState(0);
  const [changeStep, setChangeStep] = useState(0);
  const [notStep, setNotStep] = useState(0);
  const [functionalStep, setFunctionalStep] = useState(0);
  const [funcSubStep, setFuncSubStep] = useState(0);
  const [solutionStep, setSolutionStep] = useState(0);
  const chatContainerRef = useRef(null);
  
  // Auto-scroll: set scrollTop after message renders (stop after closing)
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

  const totalSlides = 17;

  const goTo = (n) => {
    setSlide(n);
    setKey(k => k + 1);
    if (n !== 2) setScopeStep(0);
    if (n !== 6) setStuckStep(0);
    if (n !== 7) setQuestionStep(0);
    if (n !== 8) setChangeStep(0);
    if (n !== 9) setNotStep(0);
    if (n !== 10) setFunctionalStep(0);
    if (n !== 12) setSolutionStep(0);
  };

  const handleNext = () => {
    if (slide === 2 && scopeStep < 2) setScopeStep(s => s + 1);
    else if (slide === 6 && stuckStep < 3) setStuckStep(s => s + 1);
    else if (slide === 7 && questionStep < 3) setQuestionStep(s => s + 1);
    else if (slide === 8 && changeStep < 3) setChangeStep(s => s + 1);
    else if (slide === 9 && notStep < 3) setNotStep(s => s + 1);
    else if (slide === 11 && functionalStep < 2) setFunctionalStep(s => s + 1);
    else if (slide === 13 && solutionStep < 2) setSolutionStep(s => s + 1);
    else if (slide < totalSlides - 1) goTo(slide + 1);
  };

  const handlePrev = () => {
    if (slide === 2 && scopeStep > 0) setScopeStep(s => s - 1);
    else if (slide === 6 && stuckStep > 0) setStuckStep(s => s - 1);
    else if (slide === 7 && questionStep > 0) setQuestionStep(s => s - 1);
    else if (slide === 8 && changeStep > 0) setChangeStep(s => s - 1);
    else if (slide === 9 && notStep > 0) setNotStep(s => s - 1);
    else if (slide === 11 && functionalStep > 0) setFunctionalStep(s => s - 1);
    else if (slide === 13 && solutionStep > 0) setSolutionStep(s => s - 1);
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
    if (slide === 11) {
      setFuncSubStep(0);
      const timers = [];
      
      if (functionalStep === 0) {
        // Beat 0: Check-in conversation - 10 messages + closing + pause + narrative
        timers.push(setTimeout(() => setFuncSubStep(1), 800));    // conversation box + msg 1
        timers.push(setTimeout(() => setFuncSubStep(2), 2200));   // message 2
        timers.push(setTimeout(() => setFuncSubStep(3), 3600));   // message 3
        timers.push(setTimeout(() => setFuncSubStep(4), 5000));   // message 4
        timers.push(setTimeout(() => setFuncSubStep(5), 6400));   // message 5
        timers.push(setTimeout(() => setFuncSubStep(6), 7800));   // message 6
        timers.push(setTimeout(() => setFuncSubStep(7), 9200));   // message 7
        timers.push(setTimeout(() => setFuncSubStep(8), 10600));  // message 8
        timers.push(setTimeout(() => setFuncSubStep(9), 12000));  // message 9
        timers.push(setTimeout(() => setFuncSubStep(10), 13400)); // message 10
        timers.push(setTimeout(() => setFuncSubStep(11), 15000)); // closing
        timers.push(setTimeout(() => setFuncSubStep(12), 16500)); // narrative fades in
      } else if (functionalStep === 1) {
        // Beat 1: Patterns
        timers.push(setTimeout(() => setFuncSubStep(1), 800));   // week tracker
        timers.push(setTimeout(() => setFuncSubStep(2), 1800));  // stats
        timers.push(setTimeout(() => setFuncSubStep(3), 2800));  // triggers
        timers.push(setTimeout(() => setFuncSubStep(4), 4000));  // narrative
      } else if (functionalStep === 2) {
        // Beat 2: Connects the dots
        timers.push(setTimeout(() => setFuncSubStep(1), 800));   // card appears
        timers.push(setTimeout(() => setFuncSubStep(2), 1800));  // first pill
        timers.push(setTimeout(() => setFuncSubStep(3), 2600));  // second pill
        timers.push(setTimeout(() => setFuncSubStep(4), 3400));  // third pill
        timers.push(setTimeout(() => setFuncSubStep(5), 4400));  // excerpt
        timers.push(setTimeout(() => setFuncSubStep(6), 5600));  // narrative
      }
      
      return () => timers.forEach(t => clearTimeout(t));
    }
  }, [slide, functionalStep]);

  const Orb = ({ color = ds.coral, size = 500, x = '50%', y = '50%', opacity = 0.08 }) => (
    <div style={{ position: 'absolute', width: size, height: size, left: x, top: y, transform: 'translate(-50%, -50%)', background: `radial-gradient(circle, ${color} 0%, transparent 70%)`, opacity, pointerEvents: 'none' }} />
  );

  const Star = ({ size = 28 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={ds.coral}>
      <path d="M12 0L13.5 10.5L24 12L13.5 13.5L12 24L10.5 13.5L0 12L10.5 10.5L12 0Z" />
    </svg>
  );

  const AccentLine = () => <div style={{ width: 60, height: 4, backgroundColor: ds.coral, borderRadius: 2 }} />;

  const patterns = [
    { icon: <Heart size={22} />, name: "Intimacy" },
    { icon: <Wine size={22} />, name: "Substances" },
    { icon: <ShoppingBag size={22} />, name: "Spending" },
    { icon: <Briefcase size={22} />, name: "Work" },
    { icon: <Users size={22} />, name: "Approval" },
    { icon: <Moon size={22} />, name: "Withdrawal" },
  ];

  // SLIDES
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
        <p style={{ color: ds.muted, fontSize: '1.25rem' }}>See the pattern. Break the cycle.</p>
      </Reveal>
    </div>
  );

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

  const ScopeSlide = () => (
    <div className="relative text-center" style={{ height: 300 }}>
      <Orb size={600} x="50%" y="50%" opacity={0.08} />
      <p style={{ color: ds.muted, fontSize: '0.9rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 24 }}>The scale of the problem</p>
      <div style={{ position: 'relative', height: 180 }}>
        {[
          { stat: '1B+', desc: 'people live with some form of mental health condition' },
          { stat: '62%', desc: 'say stress has impacted their daily life' },
          { stat: '31%', desc: 'see stress as their #1 health problem' },
        ].map((item, i) => (
          <div key={i} style={{ position: 'absolute', width: '100%', top: 0, transition: 'opacity 0.5s ease, transform 0.5s ease', opacity: scopeStep === i ? 1 : 0, transform: scopeStep === i ? 'translateY(0)' : 'translateY(30px)' }}>
            <h2 style={{ color: ds.coral, fontSize: '6rem', fontWeight: 900, lineHeight: 0.85, letterSpacing: '-0.04em' }}>{item.stat}</h2>
            <p style={{ color: ds.cream, fontSize: '1.25rem', fontWeight: 700, marginTop: 16, lineHeight: 1.2 }}>{item.desc}</p>
          </div>
        ))}
      </div>
      <p style={{ position: 'absolute', bottom: 0, left: 0, right: 0, color: ds.muted, fontSize: '0.8rem', opacity: scopeStep < 2 ? 1 : 0 }}>{scopeStep < 2 ? 'Click → to continue' : ''}</p>
    </div>
  );

  const CopeSlide = () => (
    <div className="relative max-w-2xl">
      <Orb size={400} x="90%" y="30%" opacity={0.1} />
      <Reveal delay={0}><AccentLine /></Reveal>
      <Reveal delay={100}><h2 style={{ color: ds.cream, fontSize: '2rem', fontWeight: 800, lineHeight: 1.15, marginTop: 32, marginBottom: 32 }}>When stress becomes overwhelming, your nervous system looks for relief.</h2></Reveal>
      <Reveal delay={250}><p style={{ color: ds.cream, fontSize: '1.15rem', lineHeight: 1.6 }}>It's not weakness — <span style={{ color: ds.coral, fontWeight: 600 }}>it's biology.</span></p></Reveal>
      <Reveal delay={400}><p style={{ color: ds.muted, fontSize: '1.15rem', lineHeight: 1.6, marginTop: 20 }}>Your brain learns what makes the discomfort stop, and reaches for that again and again.</p></Reveal>
      <Reveal delay={600}><p style={{ color: ds.coral, fontSize: '1.5rem', fontWeight: 700, marginTop: 40 }}>Patterns you don't even notice.</p></Reveal>
    </div>
  );

  const PatternsSlide = () => (
    <div className="text-center relative">
      <Orb size={500} x="50%" y="60%" opacity={0.06} />
      <Reveal delay={0}><p style={{ color: ds.muted, fontSize: '0.9rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 }}>What research shows</p></Reveal>
      <Reveal delay={100}><h2 style={{ color: ds.cream, fontSize: '2rem', fontWeight: 800, marginBottom: 12, lineHeight: 1.2 }}>Stress responses tend to <span style={{ color: ds.coral }}>cluster into patterns</span>.</h2></Reveal>
      <Reveal delay={200}><p style={{ color: ds.muted, fontSize: '1rem', marginBottom: 32 }}>Common ways we cope when things get hard:</p></Reveal>
      <div className="grid grid-cols-3 gap-2 max-w-md mx-auto mb-8">
        {patterns.map((p, i) => (
          <Reveal key={i} delay={300 + i * 60} y={20}>
            <div className="py-4 px-2 rounded-xl text-center" style={{ backgroundColor: ds.surface }}>
              <div className="flex justify-center mb-2" style={{ color: ds.coral }}>{p.icon}</div>
              <p style={{ color: ds.cream, fontSize: '0.75rem', fontWeight: 500 }}>{p.name}</p>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal delay={700}><p style={{ color: ds.coral, fontSize: '1.5rem', fontWeight: 700 }}>Most people have a default.</p></Reveal>
    </div>
  );

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
      <Reveal delay={650}><p style={{ color: ds.cream, fontSize: '1.5rem', fontWeight: 700 }}>Most people live there for years.</p></Reveal>
    </div>
  );

  const StuckSlide = () => (
    <div className="relative text-center">
      <Orb size={400} x="50%" y="50%" opacity={0.08} />
      <div className="flex justify-center mb-5"><AccentLine /></div>
      <h2 style={{ color: ds.cream, fontSize: '2rem', fontWeight: 800, marginBottom: 40 }}>Why do people stay stuck?</h2>
      <div style={{ height: 170, position: 'relative', overflow: 'hidden' }}>
        {[
          { quote: "Shame", explain: "The #1 barrier. Fear of being seen, judged, exposed.", cite: "Clement et al., 2015 — Lancet Psychiatry" },
          { quote: '"I can still function"', explain: "Keeping the facade. Getting away with it.", cite: "Becker et al., 2014 — high-functioning concealment" },
          { quote: '"I\'m managing it"', explain: "Treating symptoms. Never asking why.", cite: "Aldao et al., 2010 — avoidant coping strategies" },
        ].map((item, i) => (
          <div key={i} style={{ position: 'absolute', width: '100%', transition: 'all 0.6s ease', transform: stuckStep === i ? 'translateY(0)' : stuckStep > i ? 'translateY(-100px)' : 'translateY(100px)', opacity: stuckStep === i ? 1 : 0 }}>
            <p style={{ color: ds.coral, fontSize: i === 0 ? '2.75rem' : '2.25rem', fontWeight: 800, lineHeight: 1.2, marginBottom: 12 }}>{item.quote}</p>
            <p style={{ color: ds.muted, fontSize: '1.1rem', maxWidth: 450, margin: '0 auto', lineHeight: 1.4 }}>{item.explain}</p>
            <p style={{ color: ds.coral, fontSize: '0.75rem', marginTop: 12, opacity: 0.6 }}>{item.cite}</p>
          </div>
        ))}
        <div style={{ position: 'absolute', width: '100%', transition: 'all 0.6s ease', transform: stuckStep === 3 ? 'translateY(0)' : 'translateY(100px)', opacity: stuckStep === 3 ? 1 : 0 }}>
          <p style={{ color: ds.coral, fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.4, maxWidth: 480, margin: '0 auto' }}>They're so busy managing the fallout, they never look at what's underneath.</p>
        </div>
      </div>
    </div>
  );

  const QuestionSlide = () => (
    <div className="text-center relative" style={{ height: 280 }}>
      <Orb size={500} x="50%" y="50%" opacity={0.08} />
      <div style={{ height: 260, position: 'relative' }}>
        {[
          { text: "But here's the real question...", size: '2rem', color: ds.cream },
          { text: "Is this actually working for you?", size: '2.75rem', color: ds.coral },
          { text: "Is this how you want to live?", size: '2.75rem', color: ds.coral },
        ].map((item, i) => (
          <div key={i} style={{ position: 'absolute', width: '100%', top: 60, transition: 'all 0.5s ease', opacity: questionStep === i ? 1 : 0, transform: questionStep === i ? 'translateY(0)' : 'translateY(30px)' }}>
            <p style={{ color: item.color, fontSize: item.size, fontWeight: 800, lineHeight: 1.2 }}>{item.text}</p>
          </div>
        ))}
        {/* Final step with two-color treatment */}
        <div style={{ position: 'absolute', width: '100%', top: 20, transition: 'all 0.5s ease', opacity: questionStep === 3 ? 1 : 0, transform: questionStep === 3 ? 'translateY(0)' : 'translateY(30px)' }}>
          <p style={{ color: ds.cream, fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.5, marginBottom: 24 }}>Only you can answer that.</p>
          <p style={{ color: ds.coral, fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.5 }}>But you can't answer honestly<br/>if you can't see clearly.</p>
        </div>
      </div>
    </div>
  );

  const ChangeSlide = () => (
    <div className="text-center relative" style={{ height: 320 }}>
      <Orb size={400} x="80%" y="70%" opacity={0.1} />
      <p style={{ color: ds.muted, fontSize: '0.9rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 20 }}>Before you can change anything</p>
      <div style={{ height: 250, position: 'relative' }}>
        {/* Preamble - step 0 */}
        <div style={{ position: 'absolute', width: '100%', top: 40, transition: 'all 0.5s ease', opacity: changeStep === 0 ? 1 : 0, transform: changeStep === 0 ? 'translateY(0)' : 'translateY(30px)' }}>
          <p style={{ color: ds.cream, fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.3 }}>
            Change doesn't start with willpower.
          </p>
        </div>
        {/* Steps 1-3 */}
        {[
          { num: "01", title: "Awareness", desc: "See the pattern. Name it. Recognize it when it shows up." },
          { num: "02", title: "Understanding", desc: "Learn where it comes from. What triggers it." },
          { num: "03", title: "Honesty", desc: "Face it without flinching. No more rationalizing." },
        ].map((item, i) => (
          <div key={i} style={{ position: 'absolute', width: '100%', top: 0, transition: 'all 0.5s ease', opacity: changeStep === i + 1 ? 1 : 0, transform: changeStep === i + 1 ? 'translateY(0)' : 'translateY(30px)' }}>
            <p style={{ color: ds.coral, fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.15em', marginBottom: 8 }}>{item.num}</p>
            <p style={{ color: ds.cream, fontSize: '3rem', fontWeight: 800, lineHeight: 1, marginBottom: 20 }}>{item.title}</p>
            <p style={{ color: ds.muted, fontSize: '1.15rem', maxWidth: 420, margin: '0 auto', lineHeight: 1.5 }}>{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const NotSlide = () => {
    const items = ["Therapy", "Diagnosis", "A quick fix"];
    return (
      <div className="text-center relative" style={{ height: 380 }}>
        <Orb size={500} x="50%" y="50%" opacity={0.06} />
        <p style={{ color: ds.muted, fontSize: '0.9rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 20 }}>Important</p>
        <div className="flex items-center justify-center gap-3 mb-12">
          <Star size={28} />
          <span style={{ color: ds.cream, fontSize: '3.5rem', fontWeight: 800 }}>Seen</span>
          <span style={{ color: ds.cream, fontSize: '3.5rem', fontWeight: 800 }}>is</span>
          <span style={{ color: ds.coral, fontSize: '3.5rem', fontWeight: 800 }}>not</span>
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
      </div>
    );
  };

  const FoundationSlide = () => {
    const [foundStep, setFoundStep] = useState(0);
    const pillars = [
      { 
        title: "Lived experience", 
        desc: "Years of therapy. Group work. Hundreds of conversations with people walking the same path. The patterns became clear." 
      },
      { 
        title: "Research-backed", 
        desc: "Grounded in peer-reviewed studies on stress responses, coping mechanisms, and what actually helps people change." 
      },
      { 
        title: "Technology as bridge", 
        desc: "Seen doesn't replace human wisdom. It makes proven approaches accessible to more people, more often, at their own pace." 
      },
    ];
    
    useEffect(() => {
      setFoundStep(0);
      const timers = [
        setTimeout(() => setFoundStep(1), 500),
        setTimeout(() => setFoundStep(2), 1100),
        setTimeout(() => setFoundStep(3), 1700),
        setTimeout(() => setFoundStep(4), 2400),
      ];
      return () => timers.forEach(t => clearTimeout(t));
    }, [slide]);

    return (
      <div className="relative max-w-2xl mx-auto">
        <Orb size={500} x="70%" y="30%" opacity={0.08} />
        <div style={{ opacity: foundStep >= 0 ? 1 : 0, transform: foundStep >= 0 ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s ease' }}>
          <div className="flex items-center gap-2 mb-3">
            <Star size={16} />
            <p style={{ color: ds.muted, fontSize: '0.9rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase' }}>The Foundation</p>
          </div>
          <h2 style={{ color: ds.cream, fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.15, marginBottom: 32 }}>
            Built on what <span style={{ color: ds.coral }}>actually works.</span>
          </h2>
        </div>
        
        <div className="space-y-4">
          {pillars.map((p, i) => (
            <div 
              key={i}
              className="p-5 rounded-xl"
              style={{ 
                backgroundColor: ds.surface,
                opacity: foundStep >= i + 1 ? 1 : 0,
                transform: foundStep >= i + 1 ? 'translateX(0)' : 'translateX(-30px)',
                transition: 'all 0.5s ease'
              }}
            >
              <p style={{ color: ds.coral, fontSize: '1.1rem', fontWeight: 700, marginBottom: 6 }}>{p.title}</p>
              <p style={{ color: ds.muted, fontSize: '1rem', lineHeight: 1.5 }}>{p.desc}</p>
            </div>
          ))}
        </div>
        
        <div style={{ opacity: foundStep >= 4 ? 1 : 0, transform: foundStep >= 4 ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.8s ease', marginTop: 32 }}>
          <p style={{ color: ds.coral, fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.4 }}>
            A first step that reaches people where they are.
          </p>
        </div>
      </div>
    );
  };

  const SolutionSlide = () => {
    const [solSubStep, setSolSubStep] = useState(0);
    const items = [
      { t: "Proactive", d: "Reaches out to you. Doesn't wait for you to remember." },
      { t: "Gradual", d: "Starts easy, gets deeper. Builds capacity for honesty." },
      { t: "Safe", d: "Anonymous. Private. A mirror, not a prescription." },
    ];
    
    useEffect(() => {
      setSolSubStep(0);
      const timers = [
        setTimeout(() => setSolSubStep(1), 400),
        setTimeout(() => setSolSubStep(2), 900),
      ];
      return () => timers.forEach(t => clearTimeout(t));
    }, [solutionStep]);

    return (
      <div className="text-center relative" style={{ height: 340 }}>
        <Orb size={500} x="50%" y="40%" opacity={0.08} />
        <div className="flex items-center justify-center gap-2 mb-3">
          <Star size={16} />
          <p style={{ color: ds.muted, fontSize: '0.9rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase' }}>How It Meets You</p>
        </div>
        <h2 style={{ color: ds.cream, fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.1, marginBottom: 32 }}>On your terms</h2>
        <div style={{ height: 180, position: 'relative' }}>
          {items.map((item, i) => (
            <div key={i} style={{ position: 'absolute', width: '100%', top: 0, transition: 'all 0.5s ease', opacity: solutionStep === i ? 1 : 0, transform: solutionStep === i ? 'translateY(0)' : 'translateY(30px)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {/* Title */}
              <div style={{ opacity: solSubStep >= 0 ? 1 : 0, transform: solSubStep >= 0 ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.5s ease' }}>
                <p style={{ color: ds.coral, fontSize: '2.5rem', fontWeight: 800, marginBottom: 16 }}>{item.t}</p>
              </div>
              {/* Description */}
              <div style={{ opacity: solSubStep >= 1 ? 1 : 0, transform: solSubStep >= 1 ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.5s ease' }}>
                <div className="p-5 rounded-2xl" style={{ backgroundColor: ds.surface, maxWidth: 420 }}>
                  <p style={{ color: ds.muted, fontSize: '1.1rem', lineHeight: 1.5 }}>{item.d}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const FunctionalSlide = () => {
    const conversation = [
      { type: 'ai', text: 'Hey Alex, how are you feeling today?' },
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
    
    const closing = "Doesn't sound stupid. Sounds like you're looking for something when your mind won't quiet down. Thanks for sharing that, Alex. I'll remember this — we can pick it up tomorrow. Take care.";

    return (
      <div className="relative">
        <Orb size={400} x="80%" y="20%" opacity={0.08} />
        
        {/* Beat 0: Check-in */}
        <div style={{ opacity: functionalStep === 0 ? 1 : 0, position: functionalStep === 0 ? 'relative' : 'absolute', transition: 'opacity 0.6s ease', pointerEvents: functionalStep === 0 ? 'auto' : 'none' }}>
          {/* Headline - always visible first */}
          <div className="text-center mb-6" style={{ opacity: funcSubStep >= 0 ? 1 : 0, transform: funcSubStep >= 0 ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.8s ease' }}>
            <p style={{ color: ds.muted, fontSize: '0.85rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>What Seen Is</p>
            <h2 style={{ color: ds.cream, fontSize: '2.25rem', fontWeight: 800 }}>An app that reaches out to you</h2>
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
              {/* Screen */}
              <div className="flex flex-col overflow-hidden" style={{ 
                backgroundColor: ds.surface, 
                borderRadius: 32,
                width: 280,
                height: 580,
              }}>
                {/* Dynamic Island */}
                <div className="flex justify-center pt-3 pb-2">
                  <div style={{ backgroundColor: '#000', width: 90, height: 28, borderRadius: 20 }} />
                </div>
                {/* App Header */}
                <div className="flex items-center justify-between px-4 pb-3 flex-shrink-0" style={{ borderBottom: `1px solid ${ds.subtle}` }}>
                  <div className="flex items-center gap-2">
                    <Star size={14} />
                    <span style={{ color: ds.cream, fontSize: '0.85rem', fontWeight: 600 }}>Daily Check-in</span>
                  </div>
                  <span style={{ color: ds.muted, fontSize: '0.75rem' }}>Day 3</span>
                </div>
                {/* Messages */}
                <div ref={chatContainerRef} className="px-4 py-3 flex-1 hide-scrollbar" style={{ overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  <div className="space-y-3">
                    {conversation.map((msg, i) => (
                      funcSubStep >= i + 1 ? (
                        <ChatMessage key={i} msg={msg.text} isAi={msg.type === 'ai'} />
                      ) : null
                    ))}
                    {funcSubStep >= 11 ? (
                      <ChatMessage key="closing" msg={closing} isAi={true} />
                    ) : null}
                  </div>
                </div>
                {/* Home indicator */}
                <div className="flex justify-center py-2">
                  <div style={{ backgroundColor: 'rgba(255,255,255,0.3)', width: 100, height: 4, borderRadius: 2 }} />
                </div>
              </div>
            </div>
            
            {/* Narrative - appears after conversation ends */}
            <div className="text-center md:text-left" style={{ maxWidth: 280, opacity: funcSubStep >= 12 ? 1 : 0, transform: funcSubStep >= 12 ? 'translateY(0)' : 'translateY(20px)', transition: 'all 1s ease 0.3s' }}>
              <p style={{ color: ds.cream, fontSize: '1.15rem', lineHeight: 1.6, marginBottom: 16 }}>
                Lives on your phone. Checks in daily — you don't have to remember.
              </p>
              <p style={{ color: ds.muted, fontSize: '1rem', lineHeight: 1.5 }}>
                2-3 minutes. Like texting a friend who asks the right questions.
              </p>
            </div>
          </div>
        </div>

        {/* Beat 1: Patterns */}
        <div style={{ opacity: functionalStep === 1 ? 1 : 0, position: functionalStep === 1 ? 'relative' : 'absolute', top: 0, width: '100%', transition: 'opacity 0.6s ease', pointerEvents: functionalStep === 1 ? 'auto' : 'none' }}>
          {/* Headline */}
          <div className="text-center mb-6" style={{ opacity: funcSubStep >= 0 ? 1 : 0, transform: funcSubStep >= 0 ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.8s ease' }}>
            <p style={{ color: ds.muted, fontSize: '0.85rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>What Seen Is</p>
            <h2 style={{ color: ds.cream, fontSize: '2.25rem', fontWeight: 800 }}>Every conversation builds on the last</h2>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center justify-center">
            {/* Visuals - animate in sequence */}
            <div className="space-y-3" style={{ width: 280 }}>
              <div className="p-4 rounded-xl" style={{ backgroundColor: ds.surface, opacity: funcSubStep >= 1 ? 1 : 0, transform: funcSubStep >= 1 ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.7s ease' }}>
                <p style={{ color: ds.muted, fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>This Week</p>
                <div className="flex justify-between gap-1">
                  {['M','T','W','T','F','S','S'].map((d,i) => (
                    <div key={i} className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: i < 5 ? ds.coral : ds.bg, color: ds.cream }}>{i < 5 ? '✓' : d}</div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2" style={{ opacity: funcSubStep >= 2 ? 1 : 0, transform: funcSubStep >= 2 ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.7s ease' }}>
                {[{ v: '12', l: 'Check-ins' },{ v: '3', l: 'Patterns' },{ v: '5d', l: 'Streak' }].map((s, i) => (
                  <div key={i} className="p-3 rounded-lg text-center" style={{ backgroundColor: ds.surface }}>
                    <p style={{ color: ds.coral, fontSize: '1.5rem', fontWeight: 800, lineHeight: 1 }}>{s.v}</p>
                    <p style={{ color: ds.cream, fontSize: '0.7rem', fontWeight: 600, marginTop: 4 }}>{s.l}</p>
                  </div>
                ))}
              </div>
              <div className="p-4 rounded-xl" style={{ backgroundColor: ds.surface, opacity: funcSubStep >= 3 ? 1 : 0, transform: funcSubStep >= 3 ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.7s ease' }}>
                <p style={{ color: ds.muted, fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Top Triggers</p>
                {[{ trigger: 'Conflict', count: 4 },{ trigger: 'Work pressure', count: 3 },{ trigger: 'Loneliness', count: 2 }].map((t, i) => (
                  <div key={i} className="flex justify-between items-center mb-2">
                    <span style={{ color: ds.cream, fontSize: '0.85rem' }}>{t.trigger}</span>
                    <span style={{ color: ds.coral, fontSize: '0.75rem', fontWeight: 700 }}>{t.count}×</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Narrative */}
            <div className="text-center md:text-left" style={{ maxWidth: 280, opacity: funcSubStep >= 4 ? 1 : 0, transform: funcSubStep >= 4 ? 'translateY(0)' : 'translateY(20px)', transition: 'all 1s ease 0.3s' }}>
              <p style={{ color: ds.cream, fontSize: '1.15rem', lineHeight: 1.6, marginBottom: 16 }}>
                What you said Tuesday connects to what's happening today.
              </p>
              <p style={{ color: ds.muted, fontSize: '1rem', lineHeight: 1.5 }}>
                Patterns surface. Triggers become visible. Progress you can actually see.
              </p>
            </div>
          </div>
        </div>

        {/* Beat 2: Connects the dots */}
        <div style={{ opacity: functionalStep === 2 ? 1 : 0, position: functionalStep === 2 ? 'relative' : 'absolute', top: 0, width: '100%', transition: 'opacity 0.6s ease', pointerEvents: functionalStep === 2 ? 'auto' : 'none' }}>
          {/* Headline */}
          <div className="text-center mb-6" style={{ opacity: funcSubStep >= 0 ? 1 : 0, transform: funcSubStep >= 0 ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.8s ease' }}>
            <p style={{ color: ds.muted, fontSize: '0.85rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>What Seen Is</p>
            <h2 style={{ color: ds.cream, fontSize: '2.25rem', fontWeight: 800 }}>Spots what you'd miss on your own</h2>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center justify-center">
            {/* Visual - Insight Card */}
            <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: ds.surface, width: 340, opacity: funcSubStep >= 1 ? 1 : 0, transform: funcSubStep >= 1 ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.7s ease' }}>
              {/* Card header */}
              <div className="px-5 py-3 flex items-center justify-between" style={{ backgroundColor: ds.coral }}>
                <div className="flex items-center gap-2">
                  <Star size={14} />
                  <span style={{ color: ds.cream, fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Pattern Detected</span>
                </div>
                <span style={{ color: ds.cream, fontSize: '0.7rem', opacity: 0.8 }}>This week</span>
              </div>
              
              {/* Card body */}
              <div className="p-5">
                {/* Trigger chain */}
                <div className="flex items-center justify-center gap-2 mb-5 flex-wrap">
                  <span className="px-3 py-1.5 rounded-full text-sm font-semibold" style={{ backgroundColor: ds.bg, color: ds.coral, border: `1px solid ${ds.coral}`, opacity: funcSubStep >= 2 ? 1 : 0, transition: 'all 0.5s ease' }}>Work stress</span>
                  <span style={{ color: ds.muted, fontSize: '0.8rem', opacity: funcSubStep >= 2 ? 1 : 0, transition: 'all 0.5s ease' }}>→</span>
                  <span className="px-3 py-1.5 rounded-full text-sm font-semibold" style={{ backgroundColor: ds.bg, color: ds.cream, opacity: funcSubStep >= 3 ? 1 : 0, transition: 'all 0.5s ease' }}>Anxiety</span>
                  <span style={{ color: ds.muted, fontSize: '0.8rem', opacity: funcSubStep >= 3 ? 1 : 0, transition: 'all 0.5s ease' }}>→</span>
                  <span className="px-3 py-1.5 rounded-full text-sm font-semibold" style={{ backgroundColor: ds.bg, color: ds.cream, opacity: funcSubStep >= 4 ? 1 : 0, transition: 'all 0.5s ease' }}>Seeking escape</span>
                </div>
                
                {/* Frequency visual */}
                <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: ds.bg, opacity: funcSubStep >= 4 ? 1 : 0, transition: 'all 0.6s ease' }}>
                  <div className="flex justify-between items-center mb-2">
                    <span style={{ color: ds.muted, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Occurrences</span>
                    <span style={{ color: ds.coral, fontSize: '0.85rem', fontWeight: 700 }}>4× this week</span>
                  </div>
                  <div className="flex gap-1">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                      <div key={day} className="flex-1 text-center">
                        <div 
                          className="mx-auto rounded-sm mb-1" 
                          style={{ 
                            width: 20, 
                            height: [1, 3, 0, 2, 0, 0, 1][i] > 0 ? [1, 3, 0, 2, 0, 0, 1][i] * 8 + 4 : 4,
                            backgroundColor: [1, 3, 0, 2, 0, 0, 1][i] > 0 ? ds.coral : ds.surfaceLight,
                            opacity: [1, 3, 0, 2, 0, 0, 1][i] > 0 ? 1 : 0.3
                          }} 
                        />
                        <span style={{ color: ds.muted, fontSize: '0.55rem' }}>{day[0]}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Insight */}
                <div className="p-3 rounded-lg" style={{ backgroundColor: ds.bg, borderLeft: `3px solid ${ds.coral}`, opacity: funcSubStep >= 5 ? 1 : 0, transform: funcSubStep >= 5 ? 'translateY(0)' : 'translateY(10px)', transition: 'all 0.7s ease' }}>
                  <p style={{ color: ds.cream, fontSize: '0.85rem', lineHeight: 1.5, fontStyle: 'italic' }}>
                    "Each time after 9pm, following a high-stress day at work."
                  </p>
                </div>
              </div>
            </div>
            
            {/* Narrative */}
            <div className="text-center md:text-left" style={{ maxWidth: 280, opacity: funcSubStep >= 6 ? 1 : 0, transform: funcSubStep >= 6 ? 'translateY(0)' : 'translateY(20px)', transition: 'all 1s ease 0.3s' }}>
              <p style={{ color: ds.cream, fontSize: '1.15rem', lineHeight: 1.6, marginBottom: 16 }}>
                The stress that precedes the behavior. The feelings underneath.
              </p>
              <p style={{ color: ds.muted, fontSize: '1rem', lineHeight: 1.5 }}>
                Weekly reflections that show you what's actually happening — not what you tell yourself is happening.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const PositionalSlide = () => {
    const [posStep, setPosStep] = useState(0);
    
    useEffect(() => {
      setPosStep(0);
      const timers = [
        setTimeout(() => setPosStep(1), 400),
        setTimeout(() => setPosStep(2), 900),
        setTimeout(() => setPosStep(3), 1400),
      ];
      return () => timers.forEach(t => clearTimeout(t));
    }, [slide]);

    return (
      <div className="text-center relative">
        <Orb size={600} x="50%" y="50%" opacity={0.1} />
        <div style={{ opacity: posStep >= 0 ? 1 : 0, transform: posStep >= 0 ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s ease' }}>
          <p style={{ color: ds.muted, fontSize: '0.9rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 16 }}>Where It Sits</p>
        </div>
        <div style={{ opacity: posStep >= 1 ? 1 : 0, transform: posStep >= 1 ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s ease' }}>
          <h2 style={{ color: ds.coral, fontSize: '4rem', fontWeight: 800, marginBottom: 24 }}>A bridge</h2>
        </div>
        <div style={{ opacity: posStep >= 2 ? 1 : 0, transform: posStep >= 2 ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s ease' }}>
          <p style={{ color: ds.cream, fontSize: '1.5rem', maxWidth: 500, margin: '0 auto', lineHeight: 1.4 }}>
            Between suspecting something's wrong
          </p>
        </div>
        <div style={{ opacity: posStep >= 3 ? 1 : 0, transform: posStep >= 3 ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s ease' }}>
          <p style={{ color: ds.cream, fontSize: '1.5rem', maxWidth: 500, margin: '8px auto 0', lineHeight: 1.4 }}>
            — and understanding why.
          </p>
        </div>
      </div>
    );
  };

  const PrivacySlide = () => {
    const [privStep, setPrivStep] = useState(0);
    const pillars = [
      { icon: <Shield size={20} />, title: "Privacy by design", desc: "Not an afterthought. The architecture." },
      { icon: <Globe size={20} />, title: "EU-hosted, GDPR compliant", desc: "Built in Amsterdam. World's strictest privacy standards." },
      { icon: <Lock size={20} />, title: "No selling. Ever.", desc: "We make money by being valuable to you, not by selling you." },
      { icon: <Trash size={20} />, title: "One click deletes everything", desc: "You're in control." },
    ];
    
    useEffect(() => {
      setPrivStep(0);
      const timers = [
        setTimeout(() => setPrivStep(1), 400),
        setTimeout(() => setPrivStep(2), 900),
        setTimeout(() => setPrivStep(3), 1400),
        setTimeout(() => setPrivStep(4), 1900),
        setTimeout(() => setPrivStep(5), 2600),
      ];
      return () => timers.forEach(t => clearTimeout(t));
    }, [slide]);

    return (
      <div className="text-center relative">
        <Orb size={600} x="50%" y="50%" opacity={0.08} />
        <div style={{ opacity: privStep >= 0 ? 1 : 0, transform: privStep >= 0 ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s ease' }}>
          <p style={{ color: ds.muted, fontSize: '0.9rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 }}>Your Data</p>
          <h2 style={{ color: ds.cream, fontSize: '3.5rem', fontWeight: 800, marginBottom: 8 }}>Built for <span style={{ color: ds.coral }}>secrets.</span></h2>
        </div>
        <div style={{ opacity: privStep >= 1 ? 1 : 0, transform: privStep >= 1 ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s ease' }}>
          <p style={{ color: ds.muted, fontSize: '1.1rem', marginBottom: 36, maxWidth: 400, margin: '0 auto 36px' }}>
            The things you share here are sensitive. That's why we built Seen under the strictest privacy laws in the world.
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 max-w-xl mx-auto">
          {pillars.map((p, i) => (
            <div 
              key={i}
              className="p-5 rounded-xl text-left"
              style={{ 
                backgroundColor: ds.surface,
                opacity: privStep >= i + 2 ? 1 : 0,
                transform: privStep >= i + 2 ? 'translateY(0)' : 'translateY(20px)',
                transition: 'all 0.5s ease'
              }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg" style={{ backgroundColor: ds.bg, color: ds.coral }}>{p.icon}</div>
                <p style={{ color: ds.cream, fontSize: '1rem', fontWeight: 700 }}>{p.title}</p>
              </div>
              <p style={{ color: ds.muted, fontSize: '0.85rem', lineHeight: 1.4 }}>{p.desc}</p>
            </div>
          ))}
        </div>
        
        <div style={{ opacity: privStep >= 6 ? 1 : 0, transform: privStep >= 6 ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.8s ease', marginTop: 32 }}>
          <p style={{ color: ds.cream, fontSize: '1.25rem', fontStyle: 'italic' }}>
            We can't see who you are. We only see patterns.
          </p>
        </div>
      </div>
    );
  };

  const VisionSlide = () => {
    const [visStep, setVisStep] = useState(0);
    
    useEffect(() => {
      setVisStep(0);
      const timers = [
        setTimeout(() => setVisStep(1), 400),
        setTimeout(() => setVisStep(2), 900),
        setTimeout(() => setVisStep(3), 1600),
        setTimeout(() => setVisStep(4), 2300),
        setTimeout(() => setVisStep(5), 3000),
      ];
      return () => timers.forEach(t => clearTimeout(t));
    }, [slide]);

    const phases = [
      {
        phase: "Phase 1",
        name: "Awareness",
        status: "NOW",
        statusColor: ds.coral,
        description: "See what's driving you. Daily check-ins that build awareness over time — on your schedule, at your pace. Triggers surfaced, connections spotted, patterns revealed. Weekly reflections that show you what's actually happening — not what you tell yourself is happening. No pressure, no streaks to protect. You're in control. The foundation everything else builds on.",
        note: null,
        featured: true
      },
      {
        phase: "Phase 2",
        name: "Practice",
        status: "COMING",
        statusColor: ds.muted,
        description: "Support during therapy. Your therapist gives you the insight. Seen helps you practice it. Mindfulness exercises, homework accountability, session prep, and tools drawn from what actually works. 167 hours of support for every 1 hour of therapy.",
        note: "Developed in partnership with licensed therapists.",
        featured: false
      },
      {
        phase: "Phase 3",
        name: "Maintenance",
        status: "COMING",
        statusColor: ds.muted,
        description: "After therapy ends. Sustain what you built. Trigger tracking, milestone celebrations, and a gentle tap on the shoulder when something looks familiar. Check-ins that step down as you need them less — daily to weekly to as-needed. A safety net that fades into the background.",
        note: null,
        featured: false
      }
    ];

    return (
      <div className="text-center relative">
        <Orb size={600} x="50%" y="50%" opacity={0.08} />
        <div style={{ opacity: visStep >= 0 ? 1 : 0, transform: visStep >= 0 ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s ease' }}>
          <p style={{ color: ds.muted, fontSize: '0.9rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 }}>The Vision</p>
          <h2 style={{ color: ds.cream, fontSize: '2.75rem', fontWeight: 800, marginBottom: 8 }}>Seen meets you <span style={{ color: ds.coral }}>where you are.</span></h2>
        </div>
        <div style={{ opacity: visStep >= 1 ? 1 : 0, transform: visStep >= 1 ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s ease' }}>
          <p style={{ color: ds.muted, fontSize: '1.1rem', marginBottom: 32 }}>
            This is the beginning. Here's where it's going.
          </p>
        </div>
        
        <div className="space-y-4 max-w-2xl mx-auto text-left">
          {phases.map((p, i) => (
            <div 
              key={i}
              className="p-5 rounded-xl"
              style={{ 
                backgroundColor: p.featured ? ds.surface : ds.bg,
                border: p.featured ? `2px solid ${ds.coral}` : `1px solid ${ds.surface}`,
                opacity: visStep >= i + 2 ? 1 : 0,
                transform: visStep >= i + 2 ? 'translateY(0)' : 'translateY(20px)',
                transition: 'all 0.5s ease'
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <span style={{ color: p.featured ? ds.coral : ds.muted, fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em' }}>{p.phase}</span>
                <span style={{ color: p.featured ? ds.cream : ds.muted, fontSize: '1.25rem', fontWeight: 800 }}>{p.name}</span>
                <span className="px-2 py-1 rounded text-xs font-bold" style={{ backgroundColor: p.statusColor, color: p.featured ? ds.cream : ds.bg }}>{p.status}</span>
              </div>
              <p style={{ color: p.featured ? ds.cream : ds.muted, fontSize: p.featured ? '1rem' : '0.9rem', lineHeight: 1.5 }}>{p.description}</p>
              {p.note && (
                <p style={{ color: ds.muted, fontSize: '0.8rem', fontStyle: 'italic', marginTop: 8 }}>{p.note}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const CloseSlide = () => (
    <div className="text-center relative">
      <Orb size={700} x="50%" y="50%" opacity={0.1} />
      <Reveal delay={0}>
        <div className="flex items-center justify-center gap-4 mb-6">
          <Star size={36} />
          <h1 style={{ color: ds.cream, fontSize: '5rem', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 0.9 }}>Seen</h1>
        </div>
      </Reveal>
      <Reveal delay={200}><p style={{ color: ds.cream, fontSize: '1.5rem' }}>Understand how you cope when things get hard.</p></Reveal>
      <Reveal delay={350}><p style={{ color: ds.muted, fontSize: '1.25rem', marginTop: 12 }}>See the pattern. Break the cycle.</p></Reveal>
    </div>
  );

  const renderSlide = () => {
    switch (slide) {
      case 0: return <TitleSlide />;
      case 1: return <WhySlide />;
      case 2: return <ScopeSlide />;
      case 3: return <CopeSlide />;
      case 4: return <PatternsSlide />;
      case 5: return <GapSlide />;
      case 6: return <StuckSlide />;
      case 7: return <QuestionSlide />;
      case 8: return <ChangeSlide />;
      case 9: return <NotSlide />;
      case 10: return <FoundationSlide />;
      case 11: return <FunctionalSlide />;
      case 12: return <PositionalSlide />;
      case 13: return <SolutionSlide />;
      case 14: return <PrivacySlide />;
      case 15: return <VisionSlide />;
      case 16: return <CloseSlide />;
      default: return <TitleSlide />;
    }
  };

  const slideNames = ['Title', 'My Story', 'Scale', 'Biology', 'Patterns', 'The Gap', 'Why Stuck', 'Question', 'Prerequisites', 'Not', 'Foundation', 'What It Is', 'Bridge', 'How It Meets You', 'Privacy', 'Vision', 'Close'];

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
        <p style={{ color: ds.muted, fontSize: '0.7rem' }}>{slideNames[slide]} ({slide + 1}/{totalSlides})</p>
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
