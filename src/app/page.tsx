'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Shield,
  ChevronRight,
  ChevronDown,
  Lock,
  Server,
  Eye,
  Check,
  HelpCircle
} from 'lucide-react';

const colors = {
  coral: '#ff6b5b',
  coralLight: '#ff8a7a',
  coralDark: '#e85a4f',
  bg: '#0f0f1a',
  dark: '#1a1a2e',
  darkLight: '#252542',
  cream: '#faf8f5',
  lightCream: '#F5F0E8',
  cyan: '#5B8F8F',
  cyanLight: '#7ab5b5',
  muted: 'rgba(250,248,245,0.4)',
  subtle: 'rgba(250,248,245,0.12)',
};

const StarIcon = ({ size = 24, className = "", style = {} }: { size?: number; className?: string; style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} style={style}>
    <path d="M12 0L13.5 10.5L24 12L13.5 13.5L12 24L10.5 13.5L0 12L10.5 10.5L12 0Z" />
  </svg>
);

const GradientBlur = ({ color, className = "", opacity = 0.3, blur = 80, size = 400 }: { color: string; className?: string; opacity?: number; blur?: number; size?: number }) => (
  <div 
    className={`absolute rounded-full pointer-events-none ${className}`}
    style={{
      width: size,
      height: size,
      background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
      filter: `blur(${blur}px)`,
      opacity
    }}
  />
);

const FadeIn = ({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay * 1000 + 300);
    const currentRef = ref.current;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          clearTimeout(timer);
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );
    
    if (currentRef) observer.observe(currentRef);
    
    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [delay]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`
      }}
    >
      {children}
    </div>
  );
};

const SlideIn = ({ children, delay = 0, direction = 'left', className = "" }: { children: React.ReactNode; delay?: number; direction?: 'left' | 'right'; className?: string }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay * 1000 + 300);
    const currentRef = ref.current;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          clearTimeout(timer);
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );
    
    if (currentRef) observer.observe(currentRef);
    
    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [delay]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateX(0)' : direction === 'left' ? 'translateX(-60px)' : 'translateX(60px)',
        transition: `opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s`
      }}
    >
      {children}
    </div>
  );
};

// Subtle staggered line animation for founder quote
const StaggeredQuote = ({ className = "" }: { className?: string }) => {
  const [visibleLines, setVisibleLines] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const lines = [
    { text: '"I spent years stuck in a pattern I couldn\'t even see.', color: colors.dark },
    { text: 'By the time I understood, it had already cost me.', color: colors.dark },
    { text: 'I built Seen because I wish it had existed for me', color: colors.coral },
    { text: '— a space to finally see what\'s going on, without judgment."', color: colors.dark },
  ];

  useEffect(() => {
    const currentRef = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isStarted) {
          setIsStarted(true);
        }
      },
      { threshold: 0.3 }
    );
    if (currentRef) observer.observe(currentRef);
    return () => observer.disconnect();
  }, [isStarted]);

  useEffect(() => {
    if (!isStarted) return;
    
    const interval = setInterval(() => {
      setVisibleLines(prev => {
        if (prev < lines.length) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 600);
    
    return () => clearInterval(interval);
  }, [isStarted, lines.length]);

  return (
    <div ref={ref} className={className}>
      {lines.map((line, idx) => (
        <span
          key={idx}
          className="inline"
          style={{
            color: line.color,
            opacity: idx < visibleLines ? 1 : 0,
            transition: 'opacity 0.5s ease-out',
          }}
        >
          {line.text}{' '}
        </span>
      ))}
    </div>
  );
};

// CycleDiagram with continuous rotation
const CycleDiagram = ({ className = "" }: { className?: string }) => {
  const [rotation, setRotation] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => prev + 90);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const steps = [
    { label: "Stress", color: colors.coral },
    { label: "Cope", color: colors.cream },
    { label: "Regret", color: colors.coral },
    { label: "Repeat", color: colors.cream },
  ];

  const activeStep = Math.floor((rotation / 90) % 4);

  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <circle 
          cx="100" 
          cy="100" 
          r="70" 
          fill="none" 
          stroke={colors.darkLight} 
          strokeWidth="2"
          opacity="0.5"
        />
        <circle 
          cx="100" 
          cy="100" 
          r="70" 
          fill="none" 
          stroke={colors.coral}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="110 330"
          style={{ 
            transform: `rotate(${-90 + rotation}deg)`,
            transformOrigin: '100px 100px',
            transition: 'transform 0.8s ease-in-out'
          }}
        />
        {[0, 1, 2, 3].map((i) => {
          const angle = (i * 90 - 45) * (Math.PI / 180);
          const x = 100 + 70 * Math.cos(angle);
          const y = 100 + 70 * Math.sin(angle);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="4"
              fill={i === activeStep ? colors.coral : colors.darkLight}
              style={{ transition: 'fill 0.3s ease' }}
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full h-full">
          {steps.map((step, idx) => {
            const positions = [
              { top: '5%', left: '50%', transform: 'translateX(-50%)' },
              { top: '50%', right: '-5%', transform: 'translateY(-50%)' },
              { bottom: '5%', left: '50%', transform: 'translateX(-50%)' },
              { top: '50%', left: '-5%', transform: 'translateY(-50%)' },
            ];
            return (
              <span
                key={idx}
                className="absolute text-base font-semibold transition-all duration-300"
                style={{
                  ...positions[idx],
                  color: idx === activeStep ? step.color : colors.cream,
                  opacity: idx === activeStep ? 1 : 0.4,
                  transform: `${positions[idx].transform} scale(${idx === activeStep ? 1.15 : 1})`,
                }}
              >
                {step.label}
              </span>
            );
          })}
        </div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <StarIcon size={28} style={{ color: colors.coral, margin: '0 auto' }} />
        </div>
      </div>
    </div>
  );
};

// Chat message for iPhone animation
const ChatMessage = ({ msg, isAi }: { msg: string; isAi: boolean }) => (
  <div className={isAi ? '' : 'flex justify-end'}>
    <div 
      className={`px-3 py-2 rounded-xl ${isAi ? 'rounded-tl-sm' : 'rounded-tr-sm'}`}
      style={{ 
        backgroundColor: isAi ? colors.dark : colors.coral, 
        maxWidth: isAi ? '90%' : '85%',
        color: colors.cream,
        fontSize: '0.75rem',
        lineHeight: 1.4
      }}
    >
      {msg}
    </div>
  </div>
);

// Hook for in-view detection
function useInView(threshold = 0.3) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

// iPhone Check-in Animation Component
const HowItWorksPreview = () => {
  const { ref, inView } = useInView(0.2);
  const [step, setStep] = useState(0);
  const chatRef = useRef<HTMLDivElement>(null);

  const conversation = [
    { type: 'ai', text: 'Hey, how are you feeling today?' },
    { type: 'user', text: 'Tired. Didn\'t sleep well.' },
    { type: 'ai', text: 'What kept you up?' },
    { type: 'user', text: 'Just my mind racing. Work stuff mostly.' },
    { type: 'ai', text: 'When your mind races like that, what do you usually do?' },
    { type: 'user', text: 'Scroll my phone. Or text people I shouldn\'t.' },
  ];

  const closing = "Doesn't sound stupid. Sounds like you're looking for something.";

  useEffect(() => {
    if (!inView) return;
    
    const timers: NodeJS.Timeout[] = [];
    timers.push(setTimeout(() => setStep(1), 400));
    for (let i = 2; i <= 7; i++) {
      timers.push(setTimeout(() => setStep(i), 400 + (i - 1) * 1200));
    }
    timers.push(setTimeout(() => setStep(8), 9000));
    timers.push(setTimeout(() => setStep(9), 10500));

    return () => timers.forEach(t => clearTimeout(t));
  }, [inView]);

  useEffect(() => {
    if (chatRef.current && step > 1) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [step]);

  return (
    <section 
      ref={ref}
      className="relative z-30 py-24 px-6 rounded-t-[2rem]"
      style={{ 
        backgroundColor: colors.darkLight,
        boxShadow: '0 -20px 60px rgba(0,0,0,0.5)',
      }}
    >
      {/* Gradient orb */}
      <GradientBlur color={colors.coral} className="top-1/2 right-0 -translate-y-1/2" opacity={0.12} size={500} />

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div 
          className="text-center mb-16"
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
            How it works
          </p>
          <h2 
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
            style={{ color: colors.cream }}
          >
            Seen checks in
          </h2>
          <p 
            className="text-lg md:text-xl max-w-xl mx-auto"
            style={{ color: colors.cream, opacity: 0.6 }}
          >
            Daily conversations that help you see what you&apos;d miss on your own
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-center justify-center">
          {/* iPhone Frame */}
          <div 
            style={{ 
              backgroundColor: '#1c1c1e', 
              borderRadius: 36, 
              padding: 10,
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
              opacity: step >= 1 ? 1 : 0, 
              transform: step >= 1 ? 'translateY(0)' : 'translateY(40px)', 
              transition: 'all 0.8s ease'
            }}
          >
            <div 
              className="flex flex-col overflow-hidden" 
              style={{ 
                backgroundColor: colors.dark, 
                borderRadius: 28,
                width: 260,
                height: 440,
              }}
            >
              {/* Dynamic Island */}
              <div className="flex justify-center pt-2 pb-1">
                <div style={{ backgroundColor: '#000', width: 80, height: 24, borderRadius: 16 }} />
              </div>
              
              {/* Header */}
              <div 
                className="flex items-center justify-between px-3 pb-2 flex-shrink-0" 
                style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}
              >
                <div className="flex items-center gap-2">
                  <StarIcon size={12} style={{ color: colors.coral }} />
                  <span style={{ color: colors.cream, fontSize: '0.7rem', fontWeight: 600 }}>Daily Check-in</span>
                </div>
                <span style={{ color: colors.cream, fontSize: '0.6rem', opacity: 0.5 }}>Day 3</span>
              </div>
              
              {/* Messages */}
              <div 
                ref={chatRef}
                className="px-3 py-2 flex-1 space-y-2" 
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
                {step >= 8 && (
                  <div style={{ opacity: 1, transition: 'all 0.4s ease' }}>
                    <ChatMessage msg={closing} isAi={true} />
                  </div>
                )}
              </div>
              
              {/* Home bar */}
              <div className="flex justify-center py-2">
                <div style={{ backgroundColor: 'rgba(255,255,255,0.3)', width: 80, height: 4, borderRadius: 2 }} />
              </div>
            </div>
          </div>

          {/* Right side: narrative + CTA */}
          <div 
            className="text-center lg:text-left max-w-md"
            style={{ 
              opacity: step >= 9 ? 1 : 0, 
              transform: step >= 9 ? 'translateY(0)' : 'translateY(30px)', 
              transition: 'all 0.8s ease' 
            }}
          >
            <p 
              className="text-xl md:text-2xl font-medium mb-4"
              style={{ color: colors.cream, lineHeight: 1.5 }}
            >
              Lives on your phone. Checks in daily — you don&apos;t have to remember.
            </p>
            <p 
              className="text-lg mb-8"
              style={{ color: colors.cream, opacity: 0.6, lineHeight: 1.5 }}
            >
              Every conversation builds. Patterns surface. Progress you can see.
            </p>
            
            <Link 
              href="/how-it-works"
              className="inline-flex items-center gap-2 text-lg font-semibold transition-all hover:gap-4"
              style={{ color: colors.coral }}
            >
              See how it builds <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

const Navigation = ({ scrolled, scrollProgress }: { scrolled: boolean; scrollProgress: number }) => (
  <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${scrolled ? 'bg-[#1a1a2e]/95 backdrop-blur-xl shadow-lg' : 'bg-transparent'}`}>
    <div className="absolute bottom-0 left-0 h-0.5 transition-all" style={{ width: `${scrollProgress}%`, backgroundColor: colors.coral, opacity: scrolled ? 1 : 0 }} />
    <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
      <div className="flex items-center gap-3">
        <StarIcon size={28} style={{ color: colors.coral }} />
        <span className="font-black text-2xl" style={{ color: colors.cream }}>Seen</span>
      </div>
      <Link href="/quiz" className="px-5 py-2 rounded-full font-semibold text-sm transition-all hover:scale-105" style={{ backgroundColor: colors.coral, color: colors.cream }}>
        Take the Quiz
      </Link>
    </div>
  </nav>
);

export default function SeenLandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress((window.scrollY / total) * 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.bg, overflowX: 'clip' }}>
      <Navigation scrolled={scrolled} scrollProgress={scrollProgress} />

      {/* Hero Section - STICKY so other sections slide over it */}
      <section className="min-h-screen flex items-center relative px-6 sticky top-0 z-0" style={{ backgroundColor: colors.dark }}>
        <GradientBlur color={colors.coral} className="-top-40 -right-40" opacity={0.5} blur={100} size={500} />
        <GradientBlur color={colors.cyan} className="bottom-0 -left-40" opacity={0.3} blur={80} size={400} />
        <div className="max-w-6xl mx-auto w-full pt-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <SlideIn direction="left" delay={0.1}>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight" style={{ color: colors.cream }}>
                  See the pattern.<br /><span style={{ color: colors.coral }}>Break the cycle.</span>
                </h1>
              </SlideIn>
              <SlideIn direction="left" delay={0.3}>
                <p className="text-lg md:text-xl mb-8 leading-relaxed max-w-xl" style={{ color: colors.cream, opacity: 0.85 }}>
                  Everyone develops ways to cope when life gets hard. Some work for a while. Some never did. 
                  Seen helps you understand what&apos;s really going on — so you can choose, instead of just react.
                </p>
              </SlideIn>
              <SlideIn direction="left" delay={0.5}>
                <Link href="/quiz" className="px-8 py-4 rounded-full font-bold text-lg inline-flex items-center gap-3 transition-all hover:scale-105 hover:shadow-2xl" style={{ backgroundColor: colors.coral, color: colors.cream, boxShadow: `0 8px 30px ${colors.coral}50` }}>
                  Take the Quiz <span className="text-sm opacity-70">(free)</span>
                  <ArrowRight size={20} />
                </Link>
              </SlideIn>
            </div>
            <SlideIn direction="right" delay={0.4} className="hidden lg:flex flex-col items-center justify-center">
              <CycleDiagram className="w-72 h-72" />
            </SlideIn>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <ChevronDown size={24} className="animate-bounce" style={{ color: colors.cream, opacity: 0.4 }} />
          <span className="text-xs" style={{ color: colors.cream, opacity: 0.4 }}>Scroll to explore</span>
        </div>
      </section>

      {/* Problem Section - slides over hero */}
      <section 
        className="relative z-10 min-h-screen flex items-center py-20 px-6 rounded-t-[2rem] sticky top-0" 
        style={{ 
          backgroundColor: colors.darkLight,
          boxShadow: '0 -20px 60px rgba(0,0,0,0.5)',
        }}
      >
        <div className="max-w-4xl mx-auto w-full">
          <FadeIn>
            <p className="text-lg md:text-xl font-bold uppercase tracking-widest mb-10" style={{ color: colors.coral }}>Here&apos;s what makes it hard</p>
          </FadeIn>
          <FadeIn delay={0.4}>
            <p className="text-2xl md:text-4xl lg:text-5xl leading-snug font-light" style={{ color: colors.cream }}>
              The pattern is automatic. By the time you notice, you&apos;ve already done it.
            </p>
          </FadeIn>
          <FadeIn delay={0.8}>
            <p className="text-2xl md:text-4xl lg:text-5xl leading-snug font-light mt-10 text-right" style={{ color: colors.coral }}>
              Scroll. Drink. Text someone you shouldn&apos;t. Shop. Shut down.
            </p>
          </FadeIn>
          <FadeIn delay={1.2}>
            <p className="text-2xl md:text-4xl lg:text-5xl leading-snug font-light mt-10" style={{ color: colors.cream }}>
              There&apos;s no pause — just the behavior, and then the aftermath.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* What is Seen Section */}
      <section 
        className="relative z-20 min-h-screen flex items-center py-20 px-6" 
        style={{ 
          backgroundColor: colors.dark,
        }}
      >
        <GradientBlur color={colors.cyan} className="-top-40 -right-60" opacity={0.15} size={500} />
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <p className="text-lg md:text-xl font-bold uppercase tracking-widest mb-8" style={{ color: colors.cyan }}>What is Seen?</p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <p className="text-2xl md:text-4xl lg:text-5xl leading-snug font-light" style={{ color: colors.cream }}>
              Personal support that actually gets it.
            </p>
          </FadeIn>
          <FadeIn delay={0.6}>
            <p className="text-2xl md:text-4xl lg:text-5xl leading-snug font-light mt-8" style={{ color: colors.cream }}>
              Seen checks in on you, learns what&apos;s going on, and helps you see what&apos;s 
              <span style={{ color: colors.cyan }}> really </span>
              driving your behavior.
            </p>
          </FadeIn>
          <FadeIn delay={0.9}>
            <p className="text-xl md:text-2xl lg:text-3xl leading-snug font-light mt-12" style={{ color: colors.cream, opacity: 0.7 }}>
              Not another meditation app. Not generic self-help. A daily practice built for people who are ready to look closer.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* How It Works Section - NEW SIMPLIFIED VERSION */}
      <HowItWorksPreview />

      {/* Founder Section - with subtle staggered quote animation */}
      <section 
        className="relative z-40 min-h-screen flex items-center py-20 px-6 rounded-t-[2rem]" 
        style={{ 
          backgroundColor: colors.lightCream,
          boxShadow: '0 -20px 60px rgba(0,0,0,0.3)',
        }}
      >
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="flex items-center gap-3 mb-10">
              <StarIcon size={24} style={{ color: colors.coral }} />
              <p className="text-lg md:text-xl font-bold uppercase tracking-widest" style={{ color: colors.coral }}>Built from experience</p>
            </div>
          </FadeIn>
          {/* Subtle staggered animation */}
          <StaggeredQuote className="text-2xl md:text-4xl lg:text-5xl leading-snug font-light" />
          <FadeIn delay={3}>
            <div className="flex items-center gap-6 mt-12 flex-wrap justify-end">
              <button 
                onClick={() => window.location.href = '/story'}
                className="font-semibold text-lg flex items-center gap-2 transition-all duration-300 hover:gap-3" 
                style={{ color: colors.coral }}
              >
                Read the full story <ChevronRight size={20} />
              </button>
              <div className="flex items-center gap-4">
                <div>
                  <p className="font-bold text-xl text-right" style={{ color: colors.dark }}>Bas</p>
                  <p className="text-right" style={{ color: colors.dark, opacity: 0.6 }}>Founder</p>
                </div>
                <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colors.coral}15` }}>
                  <StarIcon size={28} style={{ color: colors.coral }} />
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Privacy Section */}
      <section 
        className="relative z-50 py-24 px-6" 
        style={{ 
          backgroundColor: colors.dark,
        }}
      >
        <div className="max-w-4xl mx-auto">
          <FadeIn className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6" style={{ backgroundColor: `${colors.cyan}20` }}>
              <Shield size={40} style={{ color: colors.cyan }} />
            </div>
            <p className="text-lg md:text-xl font-bold uppercase tracking-widest mb-4" style={{ color: colors.cyan }}>Privacy</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6" style={{ color: colors.cream }}>
              Your privacy is non-negotiable
            </h2>
            <p className="text-xl md:text-2xl font-light" style={{ color: colors.cream, opacity: 0.7 }}>
              The patterns you share are deeply personal. We built Seen to protect them.
            </p>
          </FadeIn>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { icon: <Lock size={24} />, title: "Encrypted conversations", desc: "Your data is protected with industry-standard encryption." },
              { icon: <Server size={24} />, title: "EU-hosted, GDPR compliant", desc: "Your data is protected by the strongest privacy laws." },
              { icon: <Eye size={24} />, title: "No selling, no sharing", desc: "Your data is never sold to advertisers. Ever." },
              { icon: <Shield size={24} />, title: "Delete anytime", desc: "One click removes everything. No questions asked." }
            ].map((item, idx) => (
              <FadeIn key={idx} delay={idx * 0.15}>
                <div className="p-6 rounded-2xl border" style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.1)' }}>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${colors.cyan}15` }}>
                      <div style={{ color: colors.cyan }}>{item.icon}</div>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1" style={{ color: colors.cream }}>{item.title}</h3>
                      <p className="text-base" style={{ color: colors.cream, opacity: 0.6 }}>{item.desc}</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="relative z-[60] py-24 px-6" style={{ backgroundColor: colors.darkLight }}>
        <div className="max-w-lg mx-auto text-center">
          <FadeIn>
            <p className="text-lg md:text-xl font-bold uppercase tracking-widest mb-4" style={{ color: colors.cyan }}>Pricing</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: colors.cream }}>One plan. Everything you need.</h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="rounded-2xl p-10 mt-10 border" style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderColor: colors.coral }}>
              <div className="mb-6">
                <span className="text-6xl font-black" style={{ color: colors.cream }}>€7.99</span>
                <span className="text-xl" style={{ color: colors.cream, opacity: 0.5 }}>/month</span>
              </div>
              <p className="text-sm mb-10 inline-block px-5 py-2 rounded-full" style={{ backgroundColor: `${colors.coral}20`, color: colors.coral }}>
                Founding member pricing
              </p>
              <ul className="space-y-5 mb-10 text-left">
                {["Daily AI check-ins", "Pattern tracking & visualization", "Trigger identification", "Monthly founder updates", "Safety resources"].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-4 text-lg">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colors.cyan}20` }}>
                      <Check size={14} style={{ color: colors.cyan }} />
                    </div>
                    <span style={{ color: colors.cream }}>{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/coming-soon" className="w-full py-4 rounded-full font-bold text-lg transition-all hover:scale-[1.02] block text-center" style={{ backgroundColor: colors.coral, color: colors.cream }}>
                Start your free trial
              </Link>
              <p className="text-sm mt-4" style={{ color: colors.cream, opacity: 0.4 }}>Cancel anytime. No questions asked.</p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="relative z-[70] py-20 px-6" style={{ backgroundColor: colors.coral }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4" style={{ color: colors.cream }}>Ready to see your pattern?</h2>
          <p className="text-xl md:text-2xl mb-10" style={{ color: colors.cream, opacity: 0.85 }}>Take the free quiz. 2 minutes. Completely private.</p>
          <Link href="/quiz" className="px-10 py-5 rounded-full font-bold text-lg inline-flex items-center gap-3 transition-all hover:scale-105" style={{ backgroundColor: colors.cream, color: colors.coral }}>
            Take the Quiz <ArrowRight size={22} />
          </Link>
          <div className="mt-10 pt-8 border-t" style={{ borderColor: 'rgba(255,255,255,0.2)' }}>
            <Link 
              href="/faq" 
              className="inline-flex items-center gap-2 text-lg font-medium transition-all hover:gap-3"
              style={{ color: colors.cream, opacity: 0.9 }}
            >
              <HelpCircle size={20} />
              Questions? Check our FAQ
              <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-[80] py-8 px-6 border-t" style={{ backgroundColor: colors.dark, borderColor: 'rgba(255,255,255,0.1)' }}>
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <StarIcon size={18} style={{ color: colors.coral }} />
            <span className="font-bold" style={{ color: colors.cream }}>Seen</span>
          </div>
          <div className="flex items-center gap-6 text-xs" style={{ color: colors.cream, opacity: 0.4 }}>
            <Link href="/story" className="hover:opacity-100 cursor-pointer transition-opacity">Story</Link>
            <Link href="/faq" className="hover:opacity-100 cursor-pointer transition-opacity">FAQ</Link>
            <Link href="/how-it-works" className="hover:opacity-100 cursor-pointer transition-opacity">How it works</Link>
            <span>© 2025</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
