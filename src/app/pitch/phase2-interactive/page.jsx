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

// Icons
const Icon = {
  Back: ({ size = 20 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>,
  ArrowRight: ({ size = 16 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>,
  Chevron: ({ size = 16 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>,
  Heart: ({ size = 18 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  Chat: ({ size = 18 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>,
  Calendar: ({ size = 18 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  Book: ({ size = 18 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  Target: ({ size = 18 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  Check: ({ size = 16 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  CheckCircle: ({ size = 16 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  Star: ({ size = 12, filled = false }) => <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? ds.gold : 'none'} stroke={filled ? ds.gold : ds.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Mic: ({ size = 16 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>,
  Send: ({ size = 16 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  Shield: ({ size = 14 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
};

const SeenStar = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={ds.cyan}>
    <path d="M12 0L13.5 10.5L24 12L13.5 13.5L12 24L10.5 13.5L0 12L10.5 10.5L12 0Z" />
  </svg>
);

// ============ iPHONE SHELL ============
function Phone({ children }) {
  return (
    <div style={{
      backgroundColor: '#1c1c1e',
      borderRadius: 48,
      padding: 12,
      boxShadow: '0 30px 60px -15px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.08)',
    }}>
      <div style={{
        backgroundColor: ds.bg,
        borderRadius: 36,
        width: 320,
        height: 640,
        overflow: 'hidden',
        position: 'relative',
      }}>
        {/* Dynamic Island */}
        <div style={{
          position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)',
          backgroundColor: '#000', width: 100, height: 28, borderRadius: 20, zIndex: 50,
        }} />
        <div style={{ width: '100%', height: '100%', overflowY: 'auto', overflowX: 'hidden', paddingBottom: 30 }} className="hide-scrollbar">
          {children}
        </div>
        {/* Home indicator */}
        <div style={{
          position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
          backgroundColor: 'rgba(255,255,255,0.3)', width: 110, height: 4, borderRadius: 2, zIndex: 50,
        }} />
      </div>
    </div>
  );
}

// ============ SHARED HEADER ============
function ScreenHeader({ title, onBack }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '48px 20px 14px',
      backgroundColor: ds.bg,
      position: 'sticky', top: 0, zIndex: 10,
    }}>
      {onBack && (
        <button onClick={onBack} style={{ color: ds.cream, background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
          <Icon.Back size={18} />
        </button>
      )}
      <p style={{ color: ds.cream, fontSize: '1rem', fontWeight: 700, margin: 0 }}>{title}</p>
    </div>
  );
}

// ============ HOME SCREEN ============
function HomeScreen({ nav, state }) {
  return (
    <div>
      <div style={{ padding: '48px 20px 16px' }}>
        <p style={{ color: ds.cream, fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>Good morning, Sarah</p>
        <p style={{ color: ds.muted, fontSize: '0.85rem', marginTop: 2, margin: 0 }}>Your practice space</p>
      </div>

      <div style={{ padding: '0 20px' }}>
        {/* Check-in CTA */}
        <button onClick={() => nav('checkin')} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          width: '100%', padding: 14, borderRadius: 16,
          backgroundColor: ds.surface, border: `1px solid ${ds.cyan}25`,
          marginBottom: 12, textAlign: 'left', cursor: 'pointer',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Icon.Chat size={18} />
            <div>
              <p style={{ color: ds.cream, fontSize: '0.85rem', fontWeight: 600, margin: 0 }}>Daily check-in</p>
              <p style={{ color: ds.muted, fontSize: '0.7rem', margin: 0, marginTop: 2 }}>A few minutes of reflection</p>
            </div>
          </div>
          <div style={{ padding: '6px 14px', borderRadius: 10, backgroundColor: ds.cyan, color: ds.cream, fontSize: '0.75rem', fontWeight: 600 }}>Start</div>
        </button>

        {/* Session prep */}
        <button onClick={() => nav('session-prep')} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          width: '100%', padding: 12, borderRadius: 16,
          backgroundColor: ds.surface, border: `1px solid ${ds.cyan}25`,
          marginBottom: 12, textAlign: 'left', cursor: 'pointer',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Icon.Calendar size={16} />
            <div>
              <p style={{ color: ds.cream, fontSize: '0.85rem', fontWeight: 600, margin: 0 }}>Prepare for session</p>
              <p style={{ color: ds.muted, fontSize: '0.7rem', margin: 0, marginTop: 2 }}>Review your week before therapy</p>
            </div>
          </div>
          <Icon.Chevron size={14} />
        </button>

        {/* I had a session */}
        <button onClick={() => nav('post-session')} style={{
          display: 'block', width: '100%', padding: 16, borderRadius: 16,
          backgroundColor: ds.cyan, textAlign: 'left', cursor: 'pointer', border: 'none',
          marginBottom: 12, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: ds.cream, fontSize: '1rem', fontWeight: 700, margin: 0 }}>I had a session</p>
              <p style={{ color: ds.cream, fontSize: '0.75rem', margin: 0, marginTop: 2, opacity: 0.85 }}>Reflect on your therapy session</p>
            </div>
            <Icon.ArrowRight size={18} />
          </div>
        </button>

        {/* Active intentions */}
        {state.activeIntention && (
          <div style={{ padding: 14, borderRadius: 16, backgroundColor: ds.surface, border: '1px solid rgba(255,255,255,0.08)', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <Icon.Target size={12} />
              <p style={{ color: ds.cyan, fontSize: '0.7rem', fontWeight: 700, margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active intention</p>
            </div>
            <p style={{ color: ds.cream, fontSize: '0.85rem', margin: 0, lineHeight: 1.4 }}>{state.activeIntention}</p>
            <p style={{ color: ds.muted, fontSize: '0.7rem', margin: 0, marginTop: 6 }}>By Fri, 18 Apr</p>
          </div>
        )}

        {/* Upcoming scheduled */}
        {state.scheduled.length > 0 && (
          <div style={{ padding: 14, borderRadius: 16, backgroundColor: ds.surface, border: '1px solid rgba(255,255,255,0.08)', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              <Icon.Calendar size={12} />
              <p style={{ color: ds.gold, fontSize: '0.7rem', fontWeight: 700, margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Upcoming this week</p>
            </div>
            {state.scheduled.map((ex, i) => (
              <div key={ex.id} style={{
                padding: 10, borderRadius: 12,
                backgroundColor: ex.approaching ? `${ds.gold}10` : ds.bg,
                border: ex.approaching ? `1px solid ${ds.gold}30` : 'none',
                marginBottom: i < state.scheduled.length - 1 ? 8 : 0,
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 10 }}>
                  <div>
                    <p style={{ color: ds.cream, fontSize: '0.8rem', fontWeight: 500, margin: 0 }}>{ex.title}</p>
                    <p style={{ color: ds.muted, fontSize: '0.7rem', margin: 0, marginTop: 2 }}>{ex.when}</p>
                  </div>
                  {ex.approaching && (
                    <span style={{ backgroundColor: ds.gold, color: ds.bg, padding: '2px 6px', borderRadius: 4, fontSize: '0.6rem', fontWeight: 700 }}>Soon</span>
                  )}
                </div>
                <button
                  onClick={() => nav('exercise-do', { exercise: ex, fromSchedule: true })}
                  style={{
                    width: '100%', padding: '8px 12px', borderRadius: 10,
                    backgroundColor: ex.approaching ? ds.gold : ds.cyan,
                    color: ex.approaching ? ds.bg : ds.cream,
                    fontSize: '0.75rem', fontWeight: 700, border: 'none', cursor: 'pointer',
                  }}>
                  Start now
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Recommended exercises */}
        <div style={{ padding: 14, borderRadius: 16, backgroundColor: ds.surface, border: '1px solid rgba(255,255,255,0.08)', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Icon.Book size={12} />
              <p style={{ color: ds.cyan, fontSize: '0.7rem', fontWeight: 700, margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recommended</p>
            </div>
          </div>
          {[
            { title: 'Setting a boundary', duration: 10, category: 'Behavioural' },
            { title: 'Values check-in', duration: 5, category: 'Self-reflection' },
          ].map((ex, i) => (
            <button
              key={i}
              onClick={() => nav('exercise-do', { exercise: { ...ex, id: `rec-${i}`, when: null }, fromSchedule: false })}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                padding: 10, borderRadius: 12, backgroundColor: ds.bg, border: 'none',
                textAlign: 'left', cursor: 'pointer', marginBottom: i === 0 ? 8 : 0,
              }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: `${ds.cyan}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon.Book size={14} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ color: ds.cream, fontSize: '0.8rem', fontWeight: 600, margin: 0 }}>{ex.title}</p>
                <p style={{ color: ds.muted, fontSize: '0.65rem', margin: 0, marginTop: 2 }}>{ex.duration} min · {ex.category}</p>
              </div>
              <Icon.Chevron size={12} />
            </button>
          ))}
        </div>

        {/* Disclaimer */}
        <div style={{ padding: 12, borderRadius: 16, backgroundColor: ds.surface, border: `1px solid ${ds.cyan}15`, display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 20 }}>
          <div style={{ color: ds.cyan, flexShrink: 0, marginTop: 2 }}><Icon.Shield size={12} /></div>
          <p style={{ color: ds.muted, fontSize: '0.65rem', margin: 0, lineHeight: 1.5 }}>
            These tools support reflection. They are not therapy or medical advice.
          </p>
        </div>
      </div>
    </div>
  );
}

// ============ DAILY CHECK-IN ============
function CheckInScreen({ nav }) {
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hey Sarah, how are you doing today?' },
  ]);
  const [input, setInput] = useState('');
  const [step, setStep] = useState(0);
  const [waiting, setWaiting] = useState(false);
  const scrollRef = useRef(null);

  const scripted = [
    { user: 'Better actually. Had a tough conversation at work.', ai: 'That sounds significant. You mentioned wanting to practice saying no. Was this related?' },
    { user: 'Yeah. Someone asked me to cover their shift and I said I couldn\'t.', ai: 'That takes real courage. How did it feel afterwards?' },
    { user: 'Scary but good? They were fine with it.', ai: 'The fear was bigger than the actual consequence. That might be worth bringing to your therapist.' },
  ];

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const sendMessage = () => {
    if (step >= scripted.length || waiting) return;
    const currentStep = step;
    const userText = input.trim() || scripted[currentStep].user;
    setMessages(m => [...m, { role: 'user', text: userText }]);
    setInput('');
    setWaiting(true);
    setTimeout(() => {
      setMessages(m => [...m, { role: 'ai', text: scripted[currentStep].ai }]);
      setStep(s => s + 1);
      setWaiting(false);
    }, 600);
  };

  const finished = step >= scripted.length;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <ScreenHeader title="Daily Check-in" onBack={() => nav('home')} />

      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '0 16px 16px' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            {m.role === 'ai' ? (
              <div style={{ padding: '10px 14px', borderRadius: 14, backgroundColor: ds.surface, maxWidth: '88%' }}>
                <p style={{ color: ds.cream, fontSize: '0.8rem', lineHeight: 1.5, margin: 0 }}>{m.text}</p>
              </div>
            ) : (
              <div style={{ padding: '10px 14px', borderRadius: 14, backgroundColor: ds.cyan, maxWidth: '85%', marginLeft: 'auto' }}>
                <p style={{ color: ds.cream, fontSize: '0.8rem', lineHeight: 1.5, margin: 0 }}>{m.text}</p>
              </div>
            )}
          </div>
        ))}
        {finished && (
          <div style={{ padding: 12, borderRadius: 14, backgroundColor: `${ds.cyan}15`, border: `1px solid ${ds.cyan}30`, marginTop: 16, textAlign: 'center' }}>
            <p style={{ color: ds.cyan, fontSize: '0.75rem', fontWeight: 600, margin: 0 }}>Check-in saved</p>
            <button onClick={() => nav('home')} style={{ color: ds.cyan, fontSize: '0.75rem', fontWeight: 600, marginTop: 8, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
              Back to home
            </button>
          </div>
        )}
      </div>

      {!finished && (
        <div style={{ padding: '10px 16px 20px', backgroundColor: ds.bg, borderTop: `1px solid ${ds.subtle}` }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
              placeholder={scripted[step]?.user.slice(0, 30) + '...' || 'Type or tap send'}
              style={{
                flex: 1, padding: '10px 14px', borderRadius: 20,
                backgroundColor: ds.surface, border: `1px solid ${ds.subtle}`,
                color: ds.cream, fontSize: '0.8rem', outline: 'none',
              }}
            />
            <button onClick={sendMessage} style={{
              width: 36, height: 36, borderRadius: 18, backgroundColor: ds.cyan,
              border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: ds.cream,
            }}>
              <Icon.Send size={14} />
            </button>
          </div>
          <p style={{ color: ds.muted, fontSize: '0.65rem', marginTop: 8, textAlign: 'center', margin: '8px 0 0' }}>
            Tap send to see a sample response
          </p>
        </div>
      )}
    </div>
  );
}

// ============ POST-SESSION REFLECTION ============
function PostSessionScreen({ nav, state, setState }) {
  const [step, setStep] = useState(1);
  const [emotional, setEmotional] = useState(7);
  const [themes, setThemes] = useState(['Boundaries', 'Self-worth']);
  const [reflection, setReflection] = useState("I realised I keep saying yes to things that drain me because I'm afraid of being seen as difficult.");
  const [intention, setIntention] = useState('Say no to one request this week without explaining why');
  const [selectedExercises, setSelectedExercises] = useState([
    { id: 'sched-new-1', title: 'Setting a boundary', duration: 10 },
  ]);

  const totalSteps = 6;

  const next = () => {
    if (step < totalSteps) setStep(step + 1);
    else {
      // Commit to state and return home
      setState(s => ({
        ...s,
        activeIntention: intention,
        scheduled: [
          ...selectedExercises.map((ex, i) => ({
            id: `sched-${Date.now()}-${i}`,
            title: ex.title,
            when: i === 0 ? 'Today at 9:00 AM' : 'Fri at 7:00 PM',
            approaching: i === 0,
          })),
          ...s.scheduled.filter(s => !selectedExercises.some(e => e.title === s.title)),
        ],
      }));
      nav('home');
    }
  };

  const prev = () => step > 1 ? setStep(step - 1) : nav('home');

  const toggleTheme = (t) => {
    setThemes(ts => ts.includes(t) ? ts.filter(x => x !== t) : [...ts, t]);
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <ScreenHeader title="Post-Session" onBack={prev} />

      <div style={{ padding: '0 20px', marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} style={{
              flex: 1, height: 3, borderRadius: 2,
              backgroundColor: i < step ? ds.cyan : ds.surfaceLight,
            }} />
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 16px' }}>
        {step === 1 && (
          <div>
            <p style={{ color: ds.cream, fontSize: '1.1rem', fontWeight: 700, margin: '0 0 8px' }}>How are you feeling right now?</p>
            <p style={{ color: ds.muted, fontSize: '0.8rem', margin: '0 0 20px' }}>Right after your session</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
              {[1,2,3,4,5,6,7,8,9,10].map(n => (
                <button key={n} onClick={() => setEmotional(n)} style={{
                  width: 44, height: 44, borderRadius: 22,
                  backgroundColor: emotional === n ? ds.cyan : ds.surface,
                  color: ds.cream, border: `1px solid ${emotional === n ? ds.cyan : ds.subtle}`,
                  fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer',
                }}>{n}</button>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, padding: '0 4px' }}>
              <span style={{ color: ds.muted, fontSize: '0.65rem' }}>Low</span>
              <span style={{ color: ds.muted, fontSize: '0.65rem' }}>High</span>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <p style={{ color: ds.cream, fontSize: '1.1rem', fontWeight: 700, margin: '0 0 8px' }}>What came up?</p>
            <p style={{ color: ds.muted, fontSize: '0.8rem', margin: '0 0 20px' }}>Pick the themes that stood out</p>
            {['Boundaries', 'Self-worth', 'Relationships', 'Anxiety', 'Work stress', 'Family'].map(t => (
              <button key={t} onClick={() => toggleTheme(t)} style={{
                display: 'block', width: '100%', padding: 12, borderRadius: 12,
                backgroundColor: themes.includes(t) ? `${ds.cyan}15` : ds.surface,
                border: `1px solid ${themes.includes(t) ? ds.cyan : ds.subtle}`,
                marginBottom: 8, textAlign: 'left', cursor: 'pointer',
              }}>
                <span style={{ color: themes.includes(t) ? ds.cyan : ds.cream, fontSize: '0.85rem', fontWeight: 500 }}>{t}</span>
              </button>
            ))}
          </div>
        )}

        {step === 3 && (
          <div>
            <p style={{ color: ds.cream, fontSize: '1.1rem', fontWeight: 700, margin: '0 0 8px' }}>What stood out?</p>
            <p style={{ color: ds.muted, fontSize: '0.8rem', margin: '0 0 16px' }}>The moment that mattered most</p>
            <textarea
              value={reflection}
              onChange={e => setReflection(e.target.value)}
              rows={8}
              style={{
                width: '100%', padding: 12, borderRadius: 12,
                backgroundColor: ds.surface, border: `1px solid ${ds.subtle}`,
                color: ds.cream, fontSize: '0.85rem', lineHeight: 1.5,
                resize: 'none', outline: 'none', fontFamily: 'inherit',
              }}
            />
          </div>
        )}

        {step === 4 && (
          <div>
            <p style={{ color: ds.cream, fontSize: '1.1rem', fontWeight: 700, margin: '0 0 8px' }}>Something to practice?</p>
            <p style={{ color: ds.muted, fontSize: '0.8rem', margin: '0 0 16px' }}>One small action this week</p>
            <textarea
              value={intention}
              onChange={e => setIntention(e.target.value)}
              rows={3}
              style={{
                width: '100%', padding: 12, borderRadius: 12,
                backgroundColor: `${ds.cyan}10`, border: `1px solid ${ds.cyan}40`,
                color: ds.cream, fontSize: '0.85rem', lineHeight: 1.5,
                resize: 'none', outline: 'none', fontFamily: 'inherit',
              }}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10 }}>
              <Icon.Calendar size={12} />
              <span style={{ color: ds.cyan, fontSize: '0.75rem', fontWeight: 500 }}>By Fri, 18 Apr</span>
            </div>
          </div>
        )}

        {step === 5 && (
          <div>
            <p style={{ color: ds.cream, fontSize: '1.1rem', fontWeight: 700, margin: '0 0 8px' }}>Exercises to practice</p>
            <p style={{ color: ds.muted, fontSize: '0.8rem', margin: '0 0 16px' }}>Matched to your session themes</p>
            {[
              { id: 'ex-1', title: 'Setting a boundary', duration: 10, cat: 'Behavioural' },
              { id: 'ex-2', title: 'Values check-in', duration: 5, cat: 'Self-reflection' },
              { id: 'ex-3', title: 'Self-compassion break', duration: 8, cat: 'Mindfulness' },
            ].map(ex => {
              const selected = selectedExercises.some(e => e.id === ex.id);
              return (
                <button key={ex.id} onClick={() => {
                  setSelectedExercises(es => selected ? es.filter(e => e.id !== ex.id) : [...es, ex]);
                }} style={{
                  display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                  padding: 12, borderRadius: 12,
                  backgroundColor: selected ? `${ds.cyan}15` : ds.surface,
                  border: `1px solid ${selected ? ds.cyan : ds.subtle}`,
                  marginBottom: 8, cursor: 'pointer', textAlign: 'left',
                }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: 10,
                    border: `1.5px solid ${selected ? ds.cyan : ds.muted}`,
                    backgroundColor: selected ? ds.cyan : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {selected && <Icon.Check size={12} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: ds.cream, fontSize: '0.85rem', fontWeight: 600, margin: 0 }}>{ex.title}</p>
                    <p style={{ color: ds.muted, fontSize: '0.7rem', margin: 0, marginTop: 2 }}>{ex.duration} min · {ex.cat}</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {step === 6 && (
          <div>
            <p style={{ color: ds.cream, fontSize: '1.1rem', fontWeight: 700, margin: '0 0 8px' }}>Your reflection</p>
            <p style={{ color: ds.muted, fontSize: '0.8rem', margin: '0 0 16px' }}>Review before saving</p>

            <div style={{ padding: 12, borderRadius: 12, backgroundColor: ds.surface, marginBottom: 10 }}>
              <p style={{ color: ds.muted, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 6px' }}>Feeling</p>
              <p style={{ color: ds.cream, fontSize: '0.9rem', margin: 0, fontWeight: 600 }}>{emotional}/10</p>
            </div>

            <div style={{ padding: 12, borderRadius: 12, backgroundColor: ds.surface, marginBottom: 10 }}>
              <p style={{ color: ds.muted, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 8px' }}>Themes</p>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {themes.map(t => (
                  <span key={t} style={{ padding: '3px 10px', borderRadius: 10, backgroundColor: `${ds.cyan}20`, color: ds.cyan, fontSize: '0.7rem', fontWeight: 600 }}>{t}</span>
                ))}
              </div>
            </div>

            <div style={{ padding: 12, borderRadius: 12, backgroundColor: ds.surface, border: `1px solid ${ds.cyan}30`, marginBottom: 10 }}>
              <p style={{ color: ds.muted, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 6px' }}>Practice intention</p>
              <p style={{ color: ds.cream, fontSize: '0.8rem', margin: 0, lineHeight: 1.4 }}>{intention}</p>
            </div>

            {selectedExercises.length > 0 && (
              <div style={{ padding: 12, borderRadius: 12, backgroundColor: ds.surface, border: `1px solid ${ds.gold}30` }}>
                <p style={{ color: ds.muted, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 6px' }}>Scheduled</p>
                {selectedExercises.map(ex => (
                  <p key={ex.id} style={{ color: ds.cream, fontSize: '0.8rem', margin: '4px 0', lineHeight: 1.3 }}>{ex.title}</p>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{ padding: '10px 20px 20px', backgroundColor: ds.bg, borderTop: `1px solid ${ds.subtle}` }}>
        <button onClick={next} style={{
          width: '100%', padding: 14, borderRadius: 14,
          backgroundColor: ds.cyan, color: ds.cream,
          fontSize: '0.9rem', fontWeight: 700, border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          {step === totalSteps ? 'Save reflection' : 'Next'}
          {step === totalSteps ? <Icon.Check size={16} /> : <Icon.ArrowRight size={16} />}
        </button>
      </div>
    </div>
  );
}

// ============ EXERCISE GUIDED FLOW ============
function ExerciseDoScreen({ nav, context, state, setState }) {
  const exercise = context?.exercise || { title: 'Setting a boundary', duration: 10 };
  const fromSchedule = context?.fromSchedule;

  const [phase, setPhase] = useState('intro'); // intro | steps | completion
  const [stepIndex, setStepIndex] = useState(0);
  const [stepResponse, setStepResponse] = useState('');
  const [rating, setRating] = useState(0);
  const [reflection, setReflection] = useState('');

  const exerciseSteps = [
    { type: 'Guide', text: 'Think of a recent situation where you said yes when you wanted to say no. Bring it to mind clearly.' },
    { type: 'Reflect', text: 'What were you afraid would happen if you said no? Write what comes up.', inputType: 'text' },
    { type: 'Guide', text: 'Now imagine yourself saying no, calmly and without explanation. Notice any resistance in your body.' },
    { type: 'Reflect', text: 'What small situation this week could you practice this in?', inputType: 'text' },
  ];

  const finish = () => {
    // If from schedule, remove that scheduled item from state
    if (fromSchedule && context?.exercise?.id) {
      setState(s => ({
        ...s,
        scheduled: s.scheduled.filter(sc => sc.id !== context.exercise.id),
      }));
    }
    nav('home');
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <ScreenHeader title={exercise.title} onBack={() => nav('home')} />

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 16px' }}>
        {phase === 'intro' && (
          <div>
            <div style={{ padding: 14, borderRadius: 12, backgroundColor: ds.surface, marginBottom: 16 }}>
              <div style={{ display: 'flex', gap: 16 }}>
                <div>
                  <p style={{ color: ds.muted, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 2px' }}>Duration</p>
                  <p style={{ color: ds.cream, fontSize: '0.85rem', fontWeight: 600, margin: 0 }}>{exercise.duration || 10} min</p>
                </div>
                <div>
                  <p style={{ color: ds.muted, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 2px' }}>Steps</p>
                  <p style={{ color: ds.cream, fontSize: '0.85rem', fontWeight: 600, margin: 0 }}>{exerciseSteps.length}</p>
                </div>
              </div>
            </div>

            <p style={{ color: ds.cream, fontSize: '0.9rem', lineHeight: 1.6, margin: '0 0 16px' }}>
              This exercise helps you practice setting boundaries by first exploring what makes it hard, then rehearsing how it could feel.
            </p>
            <p style={{ color: ds.muted, fontSize: '0.8rem', lineHeight: 1.6, margin: 0 }}>
              You can pause between steps. Your responses are private and only visible to you.
            </p>
          </div>
        )}

        {phase === 'steps' && (
          <div>
            {/* Progress */}
            <p style={{ color: ds.muted, fontSize: '0.7rem', textAlign: 'center', margin: '0 0 16px' }}>
              Step {stepIndex + 1} of {exerciseSteps.length}
            </p>
            <div style={{ display: 'flex', gap: 4, marginBottom: 24 }}>
              {exerciseSteps.map((_, i) => (
                <div key={i} style={{
                  flex: 1, height: 2, borderRadius: 1,
                  backgroundColor: i <= stepIndex ? ds.cyan : ds.surfaceLight,
                }} />
              ))}
            </div>

            <div style={{ padding: '3px 10px', borderRadius: 8, backgroundColor: `${ds.cyan}20`, display: 'inline-block', marginBottom: 12 }}>
              <span style={{ color: ds.cyan, fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {exerciseSteps[stepIndex].type}
              </span>
            </div>

            <p style={{ color: ds.cream, fontSize: '0.95rem', lineHeight: 1.6, margin: '0 0 16px' }}>
              {exerciseSteps[stepIndex].text}
            </p>

            {exerciseSteps[stepIndex].inputType === 'text' && (
              <textarea
                value={stepResponse}
                onChange={e => setStepResponse(e.target.value)}
                placeholder="Take your time..."
                rows={5}
                style={{
                  width: '100%', padding: 12, borderRadius: 12,
                  backgroundColor: ds.surface, border: `1px solid ${ds.subtle}`,
                  color: ds.cream, fontSize: '0.85rem', lineHeight: 1.5,
                  resize: 'none', outline: 'none', fontFamily: 'inherit',
                }}
              />
            )}
          </div>
        )}

        {phase === 'completion' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 20, paddingTop: 16 }}>
              <div style={{
                width: 56, height: 56, borderRadius: 28, backgroundColor: `${ds.cyan}20`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px',
              }}>
                <div style={{ color: ds.cyan }}><Icon.CheckCircle size={24} /></div>
              </div>
              <p style={{ color: ds.cream, fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Well done</p>
              <p style={{ color: ds.muted, fontSize: '0.8rem', margin: '4px 0 0' }}>You showed up for yourself today</p>
            </div>

            <p style={{ color: ds.cream, fontSize: '0.85rem', fontWeight: 600, margin: '0 0 10px' }}>How was it?</p>
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              {[1,2,3,4,5].map(n => (
                <button key={n} onClick={() => setRating(n)} style={{
                  flex: 1, padding: 10, borderRadius: 10,
                  backgroundColor: ds.surface, border: `1px solid ${n <= rating ? ds.gold : ds.subtle}`,
                  cursor: 'pointer', display: 'flex', justifyContent: 'center',
                }}>
                  <Icon.Star size={16} filled={n <= rating} />
                </button>
              ))}
            </div>

            <p style={{ color: ds.cream, fontSize: '0.85rem', fontWeight: 600, margin: '0 0 8px' }}>Anything come up?</p>
            <textarea
              value={reflection}
              onChange={e => setReflection(e.target.value)}
              placeholder="Optional reflection..."
              rows={4}
              style={{
                width: '100%', padding: 12, borderRadius: 12,
                backgroundColor: ds.surface, border: `1px solid ${ds.subtle}`,
                color: ds.cream, fontSize: '0.85rem', lineHeight: 1.5,
                resize: 'none', outline: 'none', fontFamily: 'inherit',
              }}
            />
          </div>
        )}
      </div>

      <div style={{ padding: '10px 20px 20px', backgroundColor: ds.bg, borderTop: `1px solid ${ds.subtle}` }}>
        {phase === 'intro' && (
          <button onClick={() => setPhase('steps')} style={{
            width: '100%', padding: 14, borderRadius: 14,
            backgroundColor: ds.cyan, color: ds.cream,
            fontSize: '0.9rem', fontWeight: 700, border: 'none', cursor: 'pointer',
          }}>Begin</button>
        )}
        {phase === 'steps' && (
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => {
                if (stepIndex === 0) setPhase('intro');
                else setStepIndex(i => i - 1);
                setStepResponse('');
              }}
              style={{
                padding: '14px 18px', borderRadius: 14,
                backgroundColor: ds.surface, color: ds.cream,
                fontSize: '0.85rem', fontWeight: 600, border: `1px solid ${ds.subtle}`, cursor: 'pointer',
              }}>
              Back
            </button>
            <button
              onClick={() => {
                if (stepIndex < exerciseSteps.length - 1) {
                  setStepIndex(i => i + 1);
                  setStepResponse('');
                } else setPhase('completion');
              }}
              style={{
                flex: 1, padding: 14, borderRadius: 14,
                backgroundColor: ds.cyan, color: ds.cream,
                fontSize: '0.9rem', fontWeight: 700, border: 'none', cursor: 'pointer',
              }}>
              {stepIndex === exerciseSteps.length - 1 ? 'Complete' : 'Next'}
            </button>
          </div>
        )}
        {phase === 'completion' && (
          <button onClick={finish} style={{
            width: '100%', padding: 14, borderRadius: 14,
            backgroundColor: ds.cyan, color: ds.cream,
            fontSize: '0.9rem', fontWeight: 700, border: 'none', cursor: 'pointer',
          }}>Save and finish</button>
        )}
      </div>
    </div>
  );
}

// ============ SESSION PREP ============
function SessionPrepScreen({ nav, state }) {
  const [notes, setNotes] = useState('');

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <ScreenHeader title="Session prep" onBack={() => nav('home')} />

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 16px' }}>
        <p style={{ color: ds.muted, fontSize: '0.8rem', margin: '0 0 16px' }}>
          A snapshot of your week to take into your next session.
        </p>

        {/* Hero */}
        <div style={{ padding: 14, borderRadius: 14, backgroundColor: ds.surface, border: `1px solid ${ds.cyan}25`, marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <Icon.Calendar size={12} />
            <span style={{ color: ds.cyan, fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Since your last session</span>
          </div>
          <p style={{ color: ds.cream, fontSize: '1.3rem', fontWeight: 800, margin: '0 0 14px' }}>5 days ago</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
            {[
              { n: '4', l: 'Check-ins' },
              { n: '3', l: 'Exercises' },
              { n: '1/2', l: 'Intentions' },
            ].map((s, i) => (
              <div key={i} style={{ padding: 10, borderRadius: 10, backgroundColor: ds.bg, textAlign: 'center' }}>
                <p style={{ color: ds.cyan, fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>{s.n}</p>
                <p style={{ color: ds.muted, fontSize: '0.6rem', margin: 0, marginTop: 2 }}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Last session */}
        <div style={{ padding: 14, borderRadius: 14, backgroundColor: ds.surface, border: '1px solid rgba(255,255,255,0.08)', marginBottom: 10 }}>
          <p style={{ color: ds.muted, fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 8px' }}>What came up last time</p>
          <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
            <span style={{ padding: '3px 10px', borderRadius: 10, backgroundColor: `${ds.cyan}20`, color: ds.cyan, fontSize: '0.7rem', fontWeight: 600 }}>Boundaries</span>
            <span style={{ padding: '3px 10px', borderRadius: 10, backgroundColor: `${ds.cyan}20`, color: ds.cyan, fontSize: '0.7rem', fontWeight: 600 }}>Self-worth</span>
          </div>
          <p style={{ color: ds.cream, fontSize: '0.8rem', lineHeight: 1.5, margin: 0 }}>
            I realised I keep saying yes to things that drain me because I&apos;m afraid of being seen as difficult.
          </p>
        </div>

        {/* Intention status */}
        <div style={{ padding: 14, borderRadius: 14, backgroundColor: ds.surface, border: '1px solid rgba(255,255,255,0.08)', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
            <Icon.Target size={12} />
            <span style={{ color: ds.cyan, fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Practice intention</span>
          </div>
          <div style={{ padding: 10, borderRadius: 10, backgroundColor: ds.bg }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: ds.cyan, marginTop: 5, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <p style={{ color: ds.cream, fontSize: '0.8rem', margin: 0 }}>Say no to one request this week without explaining why</p>
                <p style={{ color: ds.muted, fontSize: '0.65rem', margin: '4px 0 0' }}>Active · tried twice this week</p>
              </div>
            </div>
          </div>
        </div>

        {/* What you practiced */}
        <div style={{ padding: 14, borderRadius: 14, backgroundColor: ds.surface, border: '1px solid rgba(255,255,255,0.08)', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Icon.Book size={12} />
              <span style={{ color: ds.cyan, fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>What you practiced</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Icon.Star size={10} filled={true} />
              <span style={{ color: ds.cream, fontSize: '0.7rem', fontWeight: 600 }}>4.0 avg</span>
            </div>
          </div>
          {[
            { title: 'Setting a boundary', when: 'Wed', rating: 5, reflection: 'Scary but I did it. They were fine with it.' },
            { title: 'Values check-in', when: 'Thu', rating: 4, reflection: null },
            { title: 'Self-compassion break', when: 'Sat', rating: 3, reflection: null },
          ].map((ex, i) => (
            <div key={i} style={{ padding: 10, borderRadius: 10, backgroundColor: ds.bg, marginBottom: i < 2 ? 6 : 0 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                <div style={{ flex: 1 }}>
                  <p style={{ color: ds.cream, fontSize: '0.8rem', fontWeight: 500, margin: 0 }}>{ex.title}</p>
                  <p style={{ color: ds.muted, fontSize: '0.65rem', margin: '2px 0 0' }}>{ex.when}</p>
                </div>
                <div style={{ display: 'flex', gap: 2 }}>
                  {[1,2,3,4,5].map(n => <Icon.Star key={n} size={8} filled={n <= ex.rating} />)}
                </div>
              </div>
              {ex.reflection && (
                <p style={{ color: ds.muted, fontSize: '0.7rem', margin: '6px 0 0', fontStyle: 'italic' }}>&ldquo;{ex.reflection}&rdquo;</p>
              )}
            </div>
          ))}
        </div>

        {/* Notes */}
        <div style={{ padding: 14, borderRadius: 14, backgroundColor: ds.surface, border: `1px solid ${ds.cyan}25` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <Icon.Target size={12} />
            <span style={{ color: ds.cyan, fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Notes to bring up</span>
          </div>
          <p style={{ color: ds.muted, fontSize: '0.7rem', margin: '0 0 10px' }}>Saved on your device only</p>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Something I noticed this week..."
            rows={4}
            style={{
              width: '100%', padding: 10, borderRadius: 10,
              backgroundColor: ds.bg, border: `1px solid ${ds.subtle}`,
              color: ds.cream, fontSize: '0.8rem', lineHeight: 1.5,
              resize: 'none', outline: 'none', fontFamily: 'inherit',
            }}
          />
        </div>
      </div>
    </div>
  );
}

// ============ MAIN APP ============
export default function Phase2Interactive() {
  const [screen, setScreen] = useState('home');
  const [context, setContext] = useState(null);
  const [state, setState] = useState({
    activeIntention: 'Say no to one request this week without explaining why',
    scheduled: [
      { id: 'sched-1', title: 'Setting a boundary', when: 'Today at 9:00 AM', approaching: true },
      { id: 'sched-2', title: 'Values check-in', when: 'Fri at 7:00 PM', approaching: false },
    ],
  });

  const nav = (target, ctx) => {
    setContext(ctx || null);
    setScreen(target);
  };

  const reset = () => {
    setScreen('home');
    setContext(null);
    setState({
      activeIntention: 'Say no to one request this week without explaining why',
      scheduled: [
        { id: 'sched-1', title: 'Setting a boundary', when: 'Today at 9:00 AM', approaching: true },
        { id: 'sched-2', title: 'Values check-in', when: 'Fri at 7:00 PM', approaching: false },
      ],
    });
  };

  const renderScreen = () => {
    switch (screen) {
      case 'home': return <HomeScreen nav={nav} state={state} />;
      case 'checkin': return <CheckInScreen nav={nav} />;
      case 'post-session': return <PostSessionScreen nav={nav} state={state} setState={setState} />;
      case 'exercise-do': return <ExerciseDoScreen nav={nav} context={context} state={state} setState={setState} />;
      case 'session-prep': return <SessionPrepScreen nav={nav} state={state} />;
      default: return <HomeScreen nav={nav} state={state} />;
    }
  };

  const tabs = [
    { key: 'home', label: 'Home' },
    { key: 'checkin', label: 'Daily check-in' },
    { key: 'post-session', label: 'I had a session' },
    { key: 'exercise-do', label: 'Exercise' },
    { key: 'session-prep', label: 'Session prep' },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: ds.bg,
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
      padding: '40px 20px',
    }}>
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { scrollbar-width: none; }
      `}</style>

      {/* Header */}
      <div style={{ maxWidth: 1000, margin: '0 auto', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <SeenStar size={22} />
          <h1 style={{ color: ds.cream, fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Seen</h1>
          <span style={{ color: ds.cyan, fontSize: '0.85rem', fontWeight: 600 }}>Phase 2 · Interactive preview</span>
        </div>
        <p style={{ color: ds.muted, fontSize: '0.9rem', margin: 0, maxWidth: 600 }}>
          Tap through the actual flows. This is Sarah&apos;s practice space — she&apos;s been working on boundaries in therapy.
        </p>
      </div>

      {/* Main layout */}
      <div style={{
        maxWidth: 1000, margin: '0 auto',
        display: 'flex', flexWrap: 'wrap', gap: 40, alignItems: 'flex-start', justifyContent: 'center',
      }}>
        {/* Phone */}
        <Phone>{renderScreen()}</Phone>

        {/* Tabs + info */}
        <div style={{ flex: 1, minWidth: 280, maxWidth: 400 }}>
          <p style={{ color: ds.muted, fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>
            Jump to
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => nav(t.key, t.key === 'exercise-do' ? { exercise: { title: 'Setting a boundary', duration: 10 }, fromSchedule: false } : null)}
                style={{
                  padding: '10px 14px', borderRadius: 10,
                  backgroundColor: screen === t.key ? ds.cyan : ds.surface,
                  color: screen === t.key ? ds.cream : ds.muted,
                  fontSize: '0.85rem', fontWeight: 600,
                  border: 'none', cursor: 'pointer', textAlign: 'left',
                  transition: 'all 0.2s',
                }}>
                {t.label}
              </button>
            ))}
            <button
              onClick={reset}
              style={{
                padding: '10px 14px', borderRadius: 10,
                backgroundColor: 'transparent', color: ds.muted,
                fontSize: '0.75rem', fontWeight: 500,
                border: `1px solid ${ds.subtle}`, cursor: 'pointer', textAlign: 'left',
                marginTop: 8,
              }}>
              Reset demo
            </button>
          </div>

          <div style={{ marginTop: 24, padding: 16, borderRadius: 14, backgroundColor: ds.surface, border: '1px solid rgba(255,255,255,0.08)' }}>
            <p style={{ color: ds.cream, fontSize: '0.85rem', fontWeight: 700, margin: '0 0 8px' }}>What to try</p>
            <ul style={{ color: ds.muted, fontSize: '0.8rem', lineHeight: 1.7, margin: 0, paddingLeft: 18 }}>
              <li>Start a <strong style={{ color: ds.cream }}>Daily check-in</strong> — tap send for scripted responses</li>
              <li>Do <strong style={{ color: ds.cream }}>I had a session</strong> to walk through the 6-step reflection</li>
              <li>From home, tap <strong style={{ color: ds.cream }}>Start now</strong> on a scheduled exercise</li>
              <li>Open <strong style={{ color: ds.cream }}>Session prep</strong> to see the weekly summary</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
