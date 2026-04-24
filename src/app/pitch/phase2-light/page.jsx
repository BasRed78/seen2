'use client';

import React, { useRef, useState } from 'react';
import { toPng } from 'html-to-image';

// Light mode palette
const lt = {
  bg: '#faf8f5',              // brand cream, becomes the page bg
  surface: '#ffffff',          // cards
  surfaceLight: '#f3ede4',     // nested/inset surfaces, pills
  text: '#1a1a2e',             // primary text (was dark surface in dark mode)
  muted: 'rgba(26,26,46,0.5)', // secondary text
  faint: 'rgba(26,26,46,0.35)',// tertiary
  subtle: 'rgba(26,26,46,0.08)', // borders
  cyan: '#4ECDC4',             // Phase 2 accent unchanged
  cyanDeep: '#2BA39B',          // darker cyan for contrast on white
  coral: '#e85a4f',            // Phase 1 accent unchanged
  gold: '#F2B800',             // darkened gold for light bg contrast
};

// Page bg for the showcase - gradient that shows both worlds
const page = {
  bg: '#1a1a2e',               // keep dark surrounding so light mode phones pop
  text: '#faf8f5',
  muted: 'rgba(250,248,245,0.4)',
};

// ============ ICONS ============
const Icon = {
  Back: ({ size = 18 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>,
  ArrowRight: ({ size = 16 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>,
  Chevron: ({ size = 14 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>,
  Calendar: ({ size = 14 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  Book: ({ size = 14 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  Target: ({ size = 14 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  Chat: ({ size = 16 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>,
  Star: ({ size = 12, filled = false, color = lt.gold }) => <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'} stroke={filled ? color : lt.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Send: ({ size = 14 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
};

const SeenStar = ({ size = 14, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color || lt.cyan}>
    <path d="M12 0L13.5 10.5L24 12L13.5 13.5L12 24L10.5 13.5L0 12L10.5 10.5L12 0Z" />
  </svg>
);

// ============ PHONE SHELL (light mode interior) ============
function Phone({ children }) {
  return (
    <div style={{
      backgroundColor: '#1c1c1e',
      borderRadius: 48,
      padding: 12,
      boxShadow: '0 30px 60px -15px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.08)',
      width: 'fit-content',
    }}>
      <div style={{
        backgroundColor: lt.bg,
        borderRadius: 36,
        width: 320,
        height: 640,
        overflow: 'hidden',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)',
          backgroundColor: '#000', width: 100, height: 28, borderRadius: 20, zIndex: 50,
        }} />
        <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
          {children}
        </div>
        <div style={{
          position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
          backgroundColor: 'rgba(0,0,0,0.3)', width: 110, height: 4, borderRadius: 2, zIndex: 50,
        }} />
      </div>
    </div>
  );
}

function ScreenHeader({ title }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '48px 20px 14px',
      backgroundColor: lt.bg,
    }}>
      <div style={{ color: lt.text }}><Icon.Back size={18} /></div>
      <p style={{ color: lt.text, fontSize: '1rem', fontWeight: 700, margin: 0 }}>{title}</p>
    </div>
  );
}

// ============ SCREEN 1: HOME ============
function Home() {
  return (
    <div>
      <div style={{ padding: '48px 20px 16px' }}>
        <p style={{ color: lt.text, fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>Good morning, Sarah</p>
        <p style={{ color: lt.muted, fontSize: '0.85rem', margin: '2px 0 0' }}>Your practice space</p>
      </div>
      <div style={{ padding: '0 20px' }}>
        {/* Daily check-in */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: 14, borderRadius: 16,
          backgroundColor: lt.surface, border: `1px solid ${lt.subtle}`,
          boxShadow: '0 2px 8px rgba(26,26,46,0.04)', marginBottom: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ color: lt.cyanDeep }}><Icon.Chat size={16} /></div>
            <div>
              <p style={{ color: lt.text, fontSize: '0.85rem', fontWeight: 600, margin: 0 }}>Daily check-in</p>
              <p style={{ color: lt.muted, fontSize: '0.7rem', margin: 0, marginTop: 2 }}>A few minutes of reflection</p>
            </div>
          </div>
          <div style={{ padding: '6px 14px', borderRadius: 10, backgroundColor: lt.cyan, color: '#fff', fontSize: '0.75rem', fontWeight: 600 }}>Start</div>
        </div>

        {/* Prepare for session */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: 12, borderRadius: 16,
          backgroundColor: lt.surface, border: `1px solid ${lt.subtle}`,
          boxShadow: '0 2px 8px rgba(26,26,46,0.04)', marginBottom: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ color: lt.cyanDeep }}><Icon.Calendar size={14} /></div>
            <div>
              <p style={{ color: lt.text, fontSize: '0.85rem', fontWeight: 600, margin: 0 }}>Prepare for session</p>
              <p style={{ color: lt.muted, fontSize: '0.7rem', margin: 0, marginTop: 2 }}>Review your week before therapy</p>
            </div>
          </div>
          <div style={{ color: lt.faint }}><Icon.Chevron size={12} /></div>
        </div>

        {/* I had a session */}
        <div style={{
          padding: 16, borderRadius: 16, backgroundColor: lt.cyan,
          boxShadow: '0 4px 16px rgba(78,205,196,0.25)', marginBottom: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, margin: 0 }}>I had a session</p>
              <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.75rem', margin: '2px 0 0' }}>Reflect on your therapy session</p>
            </div>
            <div style={{ color: '#fff' }}><Icon.ArrowRight size={18} /></div>
          </div>
        </div>

        {/* Active intention */}
        <div style={{
          padding: 14, borderRadius: 16,
          backgroundColor: lt.surface, border: `1px solid ${lt.subtle}`,
          boxShadow: '0 2px 8px rgba(26,26,46,0.04)', marginBottom: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <div style={{ color: lt.cyanDeep }}><Icon.Target size={11} /></div>
            <p style={{ color: lt.cyanDeep, fontSize: '0.7rem', fontWeight: 700, margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active intention</p>
          </div>
          <p style={{ color: lt.text, fontSize: '0.85rem', margin: 0, lineHeight: 1.4 }}>Say no to one request this week without explaining why</p>
          <p style={{ color: lt.muted, fontSize: '0.7rem', margin: 0, marginTop: 6 }}>By Fri, 18 Apr</p>
        </div>

        {/* Upcoming */}
        <div style={{
          padding: 14, borderRadius: 16,
          backgroundColor: lt.surface, border: `1px solid ${lt.subtle}`,
          boxShadow: '0 2px 8px rgba(26,26,46,0.04)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
            <div style={{ color: lt.gold }}><Icon.Calendar size={11} /></div>
            <p style={{ color: lt.gold, fontSize: '0.7rem', fontWeight: 700, margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Upcoming this week</p>
          </div>
          <div style={{ padding: 10, borderRadius: 12, backgroundColor: `${lt.gold}14`, border: `1px solid ${lt.gold}55`, marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 10 }}>
              <div>
                <p style={{ color: lt.text, fontSize: '0.8rem', fontWeight: 500, margin: 0 }}>Setting a boundary</p>
                <p style={{ color: lt.muted, fontSize: '0.7rem', margin: 0, marginTop: 2 }}>Today at 9:00 AM</p>
              </div>
              <span style={{ backgroundColor: lt.gold, color: '#fff', padding: '2px 6px', borderRadius: 4, fontSize: '0.6rem', fontWeight: 700 }}>Soon</span>
            </div>
            <div style={{ width: '100%', padding: '8px 12px', borderRadius: 10, backgroundColor: lt.gold, color: '#fff', fontSize: '0.75rem', fontWeight: 700, textAlign: 'center' }}>Start now</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ SCREEN 2: DAILY CHECK-IN ============
function CheckIn() {
  const messages = [
    { role: 'ai', text: 'Hey Sarah, how are you doing today?' },
    { role: 'user', text: 'Better actually. Had a tough conversation at work.' },
    { role: 'ai', text: 'That sounds significant. You mentioned wanting to practice saying no. Was this related?' },
    { role: 'user', text: 'Yeah. Someone asked me to cover their shift and I said I couldn\'t.' },
    { role: 'ai', text: 'That takes real courage. The fear was bigger than the actual consequence. That might be worth bringing to your therapist.' },
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '48px 20px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ color: lt.text }}><Icon.Back size={18} /></div>
          <p style={{ color: lt.text, fontSize: '1rem', fontWeight: 700, margin: 0 }}>Daily Check-in</p>
        </div>
        <p style={{ color: lt.muted, fontSize: '0.75rem', margin: 0 }}>Day 12</p>
      </div>

      <div style={{ flex: 1, overflow: 'hidden', padding: '0 16px' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            {m.role === 'ai' ? (
              <div style={{ padding: '10px 14px', borderRadius: 14, backgroundColor: lt.surface, border: `1px solid ${lt.subtle}`, maxWidth: '88%' }}>
                <p style={{ color: lt.text, fontSize: '0.8rem', lineHeight: 1.5, margin: 0 }}>{m.text}</p>
              </div>
            ) : (
              <div style={{ padding: '10px 14px', borderRadius: 14, backgroundColor: lt.cyan, maxWidth: '85%', marginLeft: 'auto' }}>
                <p style={{ color: '#fff', fontSize: '0.8rem', lineHeight: 1.5, margin: 0 }}>{m.text}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ padding: '10px 16px 24px', borderTop: `1px solid ${lt.subtle}` }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ flex: 1, padding: '10px 14px', borderRadius: 20, backgroundColor: lt.surface, border: `1px solid ${lt.subtle}`, color: lt.muted, fontSize: '0.8rem' }}>Type or tap send</div>
          <div style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: lt.cyan, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <Icon.Send size={14} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ SCREEN 3: SESSION PREP ============
function SessionPrep() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <ScreenHeader title="Session prep" />

      <div style={{ flex: 1, padding: '0 20px' }}>
        <p style={{ color: lt.muted, fontSize: '0.8rem', margin: '0 0 16px' }}>
          A snapshot of your week to take into your next session.
        </p>

        {/* Hero */}
        <div style={{
          padding: 14, borderRadius: 14, backgroundColor: lt.surface,
          border: `1px solid ${lt.cyan}40`,
          boxShadow: '0 2px 8px rgba(26,26,46,0.04)', marginBottom: 10,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <div style={{ color: lt.cyanDeep }}><Icon.Calendar size={11} /></div>
            <span style={{ color: lt.cyanDeep, fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Since your last session</span>
          </div>
          <p style={{ color: lt.text, fontSize: '1.3rem', fontWeight: 800, margin: '0 0 14px' }}>5 days ago</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
            {[
              { n: '4', l: 'Check-ins' },
              { n: '3', l: 'Exercises' },
              { n: '1/2', l: 'Intentions' },
            ].map((s, i) => (
              <div key={i} style={{ padding: 10, borderRadius: 10, backgroundColor: lt.surfaceLight, textAlign: 'center' }}>
                <p style={{ color: lt.cyanDeep, fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>{s.n}</p>
                <p style={{ color: lt.muted, fontSize: '0.6rem', margin: 0, marginTop: 2 }}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Last session */}
        <div style={{
          padding: 14, borderRadius: 14, backgroundColor: lt.surface,
          border: `1px solid ${lt.subtle}`,
          boxShadow: '0 2px 8px rgba(26,26,46,0.04)', marginBottom: 10,
        }}>
          <p style={{ color: lt.cyanDeep, fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 8px' }}>What came up last time</p>
          <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
            <span style={{ padding: '3px 10px', borderRadius: 10, backgroundColor: `${lt.cyan}22`, color: lt.cyanDeep, fontSize: '0.7rem', fontWeight: 600 }}>Boundaries</span>
            <span style={{ padding: '3px 10px', borderRadius: 10, backgroundColor: `${lt.cyan}22`, color: lt.cyanDeep, fontSize: '0.7rem', fontWeight: 600 }}>Self-worth</span>
          </div>
          <p style={{ color: lt.text, fontSize: '0.8rem', lineHeight: 1.5, margin: 0 }}>
            I realised I keep saying yes to things that drain me because I&apos;m afraid of being seen as difficult.
          </p>
        </div>

        {/* What you practiced */}
        <div style={{
          padding: 14, borderRadius: 14, backgroundColor: lt.surface,
          border: `1px solid ${lt.subtle}`,
          boxShadow: '0 2px 8px rgba(26,26,46,0.04)', marginBottom: 10,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ color: lt.cyanDeep }}><Icon.Book size={11} /></div>
              <span style={{ color: lt.cyanDeep, fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>What you practiced</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Icon.Star size={10} filled />
              <span style={{ color: lt.text, fontSize: '0.7rem', fontWeight: 600 }}>4.0 avg</span>
            </div>
          </div>
          {[
            { title: 'Setting a boundary', when: 'Wed', rating: 5, reflection: 'Scary but I did it. They were fine with it.' },
            { title: 'Values check-in', when: 'Thu', rating: 4, reflection: null },
          ].map((ex, i) => (
            <div key={i} style={{ padding: 10, borderRadius: 10, backgroundColor: lt.surfaceLight, marginBottom: i < 1 ? 6 : 0 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                <div style={{ flex: 1 }}>
                  <p style={{ color: lt.text, fontSize: '0.8rem', fontWeight: 500, margin: 0 }}>{ex.title}</p>
                  <p style={{ color: lt.muted, fontSize: '0.65rem', margin: '2px 0 0' }}>{ex.when}</p>
                </div>
                <div style={{ display: 'flex', gap: 2 }}>
                  {[1,2,3,4,5].map(n => <Icon.Star key={n} size={8} filled={n <= ex.rating} />)}
                </div>
              </div>
              {ex.reflection && (
                <p style={{ color: lt.muted, fontSize: '0.7rem', margin: '6px 0 0', fontStyle: 'italic' }}>&ldquo;{ex.reflection}&rdquo;</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============ GALLERY ============
function Visual({ title, description, children }) {
  const phoneRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!phoneRef.current || downloading) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(phoneRef.current, {
        pixelRatio: 3, backgroundColor: undefined, cacheBust: true, style: { transform: 'none' },
      });
      const link = document.createElement('a');
      link.download = `seen-light-${title.replace(/[^a-zA-Z0-9]+/g, '-').toLowerCase()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div style={{
      backgroundColor: 'rgba(255,255,255,0.04)',
      borderRadius: 24,
      padding: 32,
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
      border: `1px solid rgba(255,255,255,0.08)`,
    }}>
      <div style={{ textAlign: 'center', maxWidth: 320 }}>
        <p style={{ color: lt.cyan, fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 6px' }}>{title}</p>
        {description && (
          <p style={{ color: page.muted, fontSize: '0.85rem', lineHeight: 1.5, margin: 0 }}>{description}</p>
        )}
      </div>
      <div ref={phoneRef} style={{ padding: '30px 30px 50px' }}>
        <Phone>{children}</Phone>
      </div>
      <button
        onClick={handleDownload}
        disabled={downloading}
        style={{
          padding: '10px 20px', borderRadius: 10,
          backgroundColor: lt.cyan, color: '#fff',
          fontSize: '0.85rem', fontWeight: 600,
          border: 'none', cursor: downloading ? 'default' : 'pointer',
          opacity: downloading ? 0.6 : 1,
        }}>
        {downloading ? 'Preparing...' : 'Download PNG'}
      </button>
    </div>
  );
}

export default function Phase2Light() {
  const visuals = [
    {
      title: 'Practice Home',
      description: 'The hub in light mode. Warm cream background, white cards with soft shadows, cyan accent kept.',
      content: <Home />,
    },
    {
      title: 'Daily Check-in',
      description: 'AI conversation. User messages keep the cyan, AI messages become white cards with a subtle border.',
      content: <CheckIn />,
    },
    {
      title: 'Session prep',
      description: 'Weekly summary. Stat tiles use a warm cream tint for nesting instead of a darker surface.',
      content: <SessionPrep />,
    },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: page.bg,
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
      padding: '40px 20px 80px',
    }}>
      {/* Header */}
      <div style={{ maxWidth: 1200, margin: '0 auto 32px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 12 }}>
          <SeenStar size={22} />
          <h1 style={{ color: page.text, fontSize: '1.6rem', fontWeight: 800, margin: 0 }}>Seen Phase 2</h1>
          <span style={{ color: lt.cyan, fontSize: '0.9rem', fontWeight: 600 }}>Light mode proposal</span>
        </div>
        <p style={{ color: page.muted, fontSize: '0.95rem', margin: '0 auto', maxWidth: 600, lineHeight: 1.5 }}>
          Three key screens rendered in a proposed light mode. Phones are shown on the dark background of this gallery so you can see how the light interior stands on its own.
        </p>
      </div>

      {/* Palette panel */}
      <div style={{ maxWidth: 900, margin: '0 auto 40px', padding: 20, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.04)', border: `1px solid rgba(255,255,255,0.08)` }}>
        <p style={{ color: page.muted, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px', textAlign: 'center' }}>Palette</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
          {[
            { name: 'Background', hex: lt.bg, textColor: lt.text },
            { name: 'Surface', hex: lt.surface, textColor: lt.text, border: true },
            { name: 'Nested', hex: lt.surfaceLight, textColor: lt.text },
            { name: 'Text', hex: lt.text, textColor: '#fff' },
            { name: 'Cyan', hex: lt.cyan, textColor: '#fff' },
            { name: 'Coral', hex: lt.coral, textColor: '#fff' },
            { name: 'Gold', hex: lt.gold, textColor: '#fff' },
          ].map(c => (
            <div key={c.name} style={{ textAlign: 'center' }}>
              <div style={{
                width: 80, height: 56, borderRadius: 10,
                backgroundColor: c.hex,
                border: c.border ? '1px solid rgba(0,0,0,0.08)' : 'none',
                marginBottom: 6,
              }} />
              <p style={{ color: page.text, fontSize: '0.7rem', fontWeight: 600, margin: 0 }}>{c.name}</p>
              <p style={{ color: page.muted, fontSize: '0.65rem', margin: 0, fontFamily: 'monospace' }}>{c.hex}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
        gap: 24,
      }}>
        {visuals.map((v, i) => (
          <Visual key={i} title={v.title} description={v.description}>
            {v.content}
          </Visual>
        ))}
      </div>

      {/* Notes */}
      <div style={{ maxWidth: 700, margin: '48px auto 0', padding: 20, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.04)', border: `1px solid rgba(255,255,255,0.08)` }}>
        <p style={{ color: page.text, fontSize: '0.9rem', fontWeight: 700, margin: '0 0 10px' }}>Design notes</p>
        <ul style={{ color: page.muted, fontSize: '0.85rem', lineHeight: 1.7, margin: 0, paddingLeft: 18 }}>
          <li>Page background stays the brand cream — it keeps the warmth the dark mode has.</li>
          <li>Cards are pure white with a subtle 1px border and a soft 4% shadow. No hard edges.</li>
          <li>Nested surfaces (stat tiles, pill backgrounds) use a slightly warmer cream (#f3ede4) instead of a darker colour. This avoids the cold look of a pure gray light mode.</li>
          <li>Cyan stays the same. On smaller labels, a deeper shade (#2BA39B) is used for legibility on white, but the main accent is unchanged.</li>
          <li>Coral and gold carry through with only minor contrast tweaks.</li>
          <li>The cyan CTA (&ldquo;I had a session&rdquo;) picks up a soft cyan shadow rather than a harsh drop shadow — this feels lighter, more inviting.</li>
        </ul>
      </div>
    </div>
  );
}
