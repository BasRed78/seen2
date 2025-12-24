'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Brain, 
  MessageCircle, 
  TrendingUp, 
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
  coral: '#C25441',
  coralLight: '#E07A5F',
  coralDark: '#A13D2D',
  dark: '#1a1a2e',
  darkLight: '#252540',
  navy: '#205179',
  cream: '#FAF8F5',
  lightCream: '#F5F0E8',
  cyan: '#5B8F8F',
  cyanLight: '#7ab5b5',
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

const QuizMockup = () => (
  <div 
    className="rounded-2xl p-6 max-w-md mx-auto border"
    style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.1)' }}
  >
    <div className="mb-6">
      <div className="flex justify-between text-sm mb-3" style={{ color: colors.cream, opacity: 0.5 }}>
        <span>Question 1 of 14</span>
        <span style={{ color: colors.cyan }}>7%</span>
      </div>
      <div className="h-2 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
        <div className="h-2 rounded-full transition-all" style={{ width: '7.14%', backgroundColor: colors.coral }} />
      </div>
    </div>
    <p className="text-xl md:text-2xl font-medium mb-6 leading-snug" style={{ color: colors.cream }}>
      When you&apos;re stressed or overwhelmed, are you usually aware of it in the moment?
    </p>
    <div className="space-y-3">
      {["Yes, I notice right away", "Sometimes, depends", "Not really — I realize later", "I'm not sure"].map((opt, idx) => (
        <div 
          key={idx}
          className="p-4 rounded-xl text-base transition-all"
          style={{ 
            backgroundColor: idx === 2 ? colors.coral : 'rgba(255,255,255,0.03)',
            border: `2px solid ${idx === 2 ? colors.coral : 'rgba(255,255,255,0.08)'}`,
            color: colors.cream,
            fontWeight: idx === 2 ? 600 : 400
          }}
        >
          {opt}
        </div>
      ))}
    </div>
  </div>
);

const ChatDemo = () => {
  const [visibleMessages, setVisibleMessages] = useState(0);
  const [showCallout, setShowCallout] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const messages = [
    { text: "How are you feeling this morning?", isUser: false },
    { text: "Honestly? Pretty stressed. Big presentation on Friday.", isUser: true },
    { text: "I notice you mentioned feeling overwhelmed last Tuesday too. Do you see a connection?", isUser: false },
    { text: "Yeah... I guess I do feel this way a lot lately.", isUser: true },
  ];

  useEffect(() => {
    const currentRef = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.3 }
    );
    if (currentRef) observer.observe(currentRef);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;
    const interval = setInterval(() => {
      setVisibleMessages(prev => {
        if (prev < messages.length) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 800);
    return () => clearInterval(interval);
  }, [hasStarted, messages.length]);

  useEffect(() => {
    if (visibleMessages >= messages.length) {
      const timer = setTimeout(() => setShowCallout(true), 600);
      return () => clearTimeout(timer);
    }
  }, [visibleMessages, messages.length]);

  return (
    <div ref={ref} className="max-w-md mx-auto">
      <div className="p-5 rounded-2xl border" style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.1)' }}>
        <div className="flex items-center justify-between mb-4 pb-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: colors.coral }} />
            <span className="text-sm font-medium" style={{ color: colors.cream }}>Daily Check-in</span>
          </div>
          <span className="text-xs" style={{ color: colors.cream, opacity: 0.4 }}>Day 12</span>
        </div>
        <div className="space-y-3 min-h-[200px]">
          {messages.map((msg, idx) => (
            <div 
              key={idx}
              className={`flex gap-2 ${msg.isUser ? 'justify-end' : ''}`}
              style={{
                opacity: idx < visibleMessages ? 1 : 0,
                transform: idx < visibleMessages ? 'translateY(0)' : 'translateY(15px)',
                transition: 'all 0.4s ease-out'
              }}
            >
              {!msg.isUser && (
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: colors.cyan }}>
                  <StarIcon size={10} style={{ color: colors.cream }} />
                </div>
              )}
              <div 
                className={`py-2 px-3 rounded-xl text-sm max-w-[80%] ${msg.isUser ? 'rounded-tr-sm' : 'rounded-tl-sm'}`}
                style={{ backgroundColor: msg.isUser ? colors.coral : 'rgba(255,255,255,0.06)', color: colors.cream }}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4" style={{ opacity: showCallout ? 1 : 0, transform: showCallout ? 'translateY(0)' : 'translateY(15px)', transition: 'all 0.5s ease-out' }}>
        <div className="flex items-center gap-3 p-4 rounded-xl" style={{ backgroundColor: `${colors.cyan}15`, border: `1px solid ${colors.cyan}30` }}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: colors.cyan }}>
            <TrendingUp size={18} style={{ color: colors.cream }} />
          </div>
          <div>
            <p className="font-bold text-sm" style={{ color: colors.cream }}>Seen remembers your journey</p>
            <p className="text-xs mt-0.5" style={{ color: colors.cream, opacity: 0.7 }}>Patterns emerge. Progress becomes visible.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const TimelineDemo = () => {
  const [visibleBars, setVisibleBars] = useState(0);
  const [activeBar, setActiveBar] = useState<number | null>(null);
  const [showInsight, setShowInsight] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const data = [
    { day: 1, stress: 40, mood: 'okay', color: colors.cream, summary: "First check-in. Feeling neutral." },
    { day: 3, stress: 65, mood: 'rough', color: colors.coral, summary: "Work pressure building." },
    { day: 5, stress: 80, mood: 'rough', color: colors.coral, summary: "Overwhelmed. Reached for phone." },
    { day: 7, stress: 55, mood: 'okay', color: colors.cream, summary: "Weekend helped reset." },
    { day: 11, stress: 45, mood: 'good', color: colors.cyan, summary: "Chose walk instead of scrolling." },
    { day: 14, stress: 35, mood: 'good', color: colors.cyan, summary: "Pattern is clearer now." },
  ];

  useEffect(() => {
    const currentRef = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.3 }
    );
    if (currentRef) observer.observe(currentRef);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;
    const interval = setInterval(() => {
      setVisibleBars(prev => {
        if (prev < data.length) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 300);
    return () => clearInterval(interval);
  }, [hasStarted, data.length]);

  useEffect(() => {
    if (visibleBars >= data.length) {
      setActiveBar(data.length - 1);
      const timer = setTimeout(() => setShowInsight(true), 500);
      return () => clearTimeout(timer);
    }
  }, [visibleBars, data.length]);

  return (
    <div ref={ref} className="max-w-lg mx-auto">
      <div className="p-5 rounded-2xl border" style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.1)' }}>
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-semibold" style={{ color: colors.cyan }}>Your journey — 14 days</p>
          <div className="flex gap-3 text-[10px]" style={{ color: colors.cream, opacity: 0.5 }}>
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.cyan }} /> Good</span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.cream }} /> Okay</span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.coral }} /> Rough</span>
          </div>
        </div>
        <div className="flex items-end justify-between gap-2 h-32 mb-4 px-1">
          {data.map((item, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center cursor-pointer h-full" onClick={() => setActiveBar(idx)}>
              <div className="flex-1 w-full flex items-end">
                <div 
                  className="w-full rounded-t-lg transition-all duration-500"
                  style={{ 
                    height: idx < visibleBars ? `${item.stress}%` : '0%',
                    minHeight: idx < visibleBars ? '4px' : '0',
                    backgroundColor: item.color,
                    boxShadow: activeBar === idx ? '0 0 0 2px white' : 'none',
                    transitionDelay: `${idx * 0.1}s`
                  }}
                />
              </div>
              <span className="text-[10px] mt-2 font-medium transition-opacity" style={{ color: colors.cream, opacity: idx < visibleBars ? (activeBar === idx ? 1 : 0.4) : 0 }}>
                {item.day}
              </span>
            </div>
          ))}
        </div>
        {activeBar !== null && (
          <div className="p-3 rounded-xl mb-3" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold text-sm" style={{ color: colors.cream }}>Day {data[activeBar].day}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs" style={{ color: colors.cream, opacity: 0.5 }}>Stress: {data[activeBar].stress}%</span>
                <span className="text-xs px-2 py-0.5 rounded-full capitalize" style={{ backgroundColor: `${data[activeBar].color}20`, color: data[activeBar].color }}>
                  {data[activeBar].mood}
                </span>
              </div>
            </div>
            <p className="text-xs" style={{ color: colors.cream, opacity: 0.7 }}>{data[activeBar].summary}</p>
          </div>
        )}
        <div 
          className="p-3 rounded-xl"
          style={{ 
            backgroundColor: `${colors.coral}15`,
            border: `1px solid ${colors.coral}30`,
            opacity: showInsight ? 1 : 0,
            transform: showInsight ? 'translateY(0)' : 'translateY(10px)',
            transition: 'all 0.5s ease-out'
          }}
        >
          <div className="flex items-start gap-2">
            <TrendingUp size={16} className="mt-0.5 flex-shrink-0" style={{ color: colors.coral }} />
            <div>
              <p className="text-xs font-semibold" style={{ color: colors.coral }}>Pattern detected</p>
              <p className="text-xs mt-0.5" style={{ color: colors.cream, opacity: 0.7 }}>
                Work stress leads to phone scrolling. You&apos;re most in control after consciously interrupting.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
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
    <div className="min-h-screen" style={{ backgroundColor: colors.dark, overflowX: 'clip' }}>
      <Navigation scrolled={scrolled} scrollProgress={scrollProgress} />

      {/* Hero Section - STICKY so other sections slide over it */}
      <section className="min-h-screen flex items-center relative px-6 sticky top-0 z-0" style={{ backgroundColor: colors.dark }}>
        <GradientBlur color={colors.coral} className="-top-40 -right-40" opacity={0.5} blur={100} size={500} />
        <GradientBlur color={colors.navy} className="bottom-0 -left-40" opacity={0.4} blur={80} size={400} />
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

      {/* How It Works Section */}
      <section 
        className="relative z-30 rounded-t-[2rem]" 
        style={{ 
          backgroundColor: colors.darkLight,
          boxShadow: '0 -20px 60px rgba(0,0,0,0.5)',
        }}
      >
        <div className="pt-20 pb-20 px-6">
          <div className="max-w-6xl mx-auto w-full">
            <FadeIn className="text-center mb-12">
              <p className="text-lg md:text-xl font-bold uppercase tracking-widest mb-4" style={{ color: colors.coral }}>How it works</p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold" style={{ color: colors.cream }}>From blind spot to clarity</h2>
            </FadeIn>

            <div className="relative">
              <div 
                className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory"
                style={{ 
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                }}
              >
                <div className="flex-shrink-0 w-[320px] md:w-[450px] snap-center">
                  <div className="bg-[#1a1a2e] rounded-2xl p-8 h-full border border-white/10">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colors.coral}20` }}>
                        <span className="font-bold text-2xl" style={{ color: colors.coral }}>1</span>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold" style={{ color: colors.cream }}>See your pattern</h3>
                        <p className="text-sm" style={{ color: colors.cream, opacity: 0.5 }}>2 minutes • 14 questions</p>
                      </div>
                    </div>
                    <p className="text-lg mb-6" style={{ color: colors.cream, opacity: 0.7 }}>
                      Find out what drives your behavior when life gets hard. Not to judge it — just to name it.
                    </p>
                    <QuizMockup />
                  </div>
                </div>

                <div className="flex-shrink-0 w-[320px] md:w-[450px] snap-center">
                  <div className="bg-[#1a1a2e] rounded-2xl p-8 h-full border border-white/10">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colors.coral}20` }}>
                        <span className="font-bold text-2xl" style={{ color: colors.coral }}>2</span>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold" style={{ color: colors.cream }}>Seen checks in</h3>
                        <p className="text-sm" style={{ color: colors.cream, opacity: 0.5 }}>Daily • Remembers everything</p>
                      </div>
                    </div>
                    <p className="text-lg mb-6" style={{ color: colors.cream, opacity: 0.7 }}>
                      Daily check-ins that remember what you said last week and notice what&apos;s building.
                    </p>
                    <ChatDemo />
                  </div>
                </div>

                <div className="flex-shrink-0 w-[320px] md:w-[450px] snap-center">
                  <div className="bg-[#1a1a2e] rounded-2xl p-8 h-full border border-white/10">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colors.coral}20` }}>
                        <span className="font-bold text-2xl" style={{ color: colors.coral }}>3</span>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold" style={{ color: colors.cream }}>See what you couldn&apos;t before</h3>
                        <p className="text-sm" style={{ color: colors.cream, opacity: 0.5 }}>Connections • Triggers • Progress</p>
                      </div>
                    </div>
                    <p className="text-lg mb-6" style={{ color: colors.cream, opacity: 0.7 }}>
                      Patterns emerge. Triggers become clear. You start to understand what&apos;s actually going on.
                    </p>
                    <TimelineDemo />
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-2 mt-4">
                <span className="text-sm" style={{ color: colors.cream, opacity: 0.4 }}>← Swipe to explore →</span>
              </div>
            </div>
          </div>
        </div>
      </section>

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
            <span>© 2025</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
