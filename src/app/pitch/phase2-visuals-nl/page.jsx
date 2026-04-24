'use client';

import React, { useRef, useState } from 'react';
import { toPng } from 'html-to-image';

const ds = {
  bg: '#0f0f1a',
  surface: '#1a1a2e',
  surfaceLight: '#252542',
  cyan: '#e85a4f',
  cream: '#faf8f5',
  muted: 'rgba(250,248,245,0.4)',
  subtle: 'rgba(250,248,245,0.12)',
  gold: '#FFD93D',
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
  Check: ({ size = 14 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  CheckCircle: ({ size = 16 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  Star: ({ size = 12, filled = false }) => <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? ds.gold : 'none'} stroke={filled ? ds.gold : ds.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Send: ({ size = 14 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  Shield: ({ size = 12 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
};

const SeenStar = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={ds.cyan}>
    <path d="M12 0L13.5 10.5L24 12L13.5 13.5L12 24L10.5 13.5L0 12L10.5 10.5L12 0Z" />
  </svg>
);

// ============ PHONE SHELL ============
function Phone({ children }) {
  return (
    <div style={{
      backgroundColor: '#1c1c1e',
      borderRadius: 48,
      padding: 12,
      boxShadow: '0 30px 60px -15px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.08)',
      width: 'fit-content',
    }}>
      <div style={{
        backgroundColor: ds.bg,
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
          backgroundColor: 'rgba(255,255,255,0.3)', width: 110, height: 4, borderRadius: 2, zIndex: 50,
        }} />
      </div>
    </div>
  );
}

function ScreenHeader({ title, back = true }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '48px 20px 14px',
      backgroundColor: ds.bg,
    }}>
      {back && <div style={{ color: ds.cream }}><Icon.Back size={18} /></div>}
      <p style={{ color: ds.cream, fontSize: '1rem', fontWeight: 700, margin: 0 }}>{title}</p>
    </div>
  );
}

// ============ SCREENS ============

// HOME
function Home() {
  return (
    <div>
      <div style={{ padding: '48px 20px 16px' }}>
        <p style={{ color: ds.cream, fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>Goedemorgen, Daan</p>
        <p style={{ color: ds.muted, fontSize: '0.85rem', margin: 0, marginTop: 2 }}>Jouw oefenruimte</p>
      </div>
      <div style={{ padding: '0 20px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: 14, borderRadius: 16,
          backgroundColor: ds.surface, border: `1px solid ${ds.cyan}25`, marginBottom: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ color: ds.cyan }}><Icon.Chat size={16} /></div>
            <div>
              <p style={{ color: ds.cream, fontSize: '0.85rem', fontWeight: 600, margin: 0 }}>Dagelijkse check-in</p>
              <p style={{ color: ds.muted, fontSize: '0.7rem', margin: 0, marginTop: 2 }}>Een paar minuten reflectie</p>
            </div>
          </div>
          <div style={{ padding: '6px 14px', borderRadius: 10, backgroundColor: ds.cyan, color: ds.cream, fontSize: '0.75rem', fontWeight: 600 }}>Starten</div>
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: 12, borderRadius: 16,
          backgroundColor: ds.surface, border: `1px solid ${ds.cyan}25`, marginBottom: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ color: ds.cyan }}><Icon.Calendar size={14} /></div>
            <div>
              <p style={{ color: ds.cream, fontSize: '0.85rem', fontWeight: 600, margin: 0 }}>Bereid je sessie voor</p>
              <p style={{ color: ds.muted, fontSize: '0.7rem', margin: 0, marginTop: 2 }}>Bekijk je week voor je therapie</p>
            </div>
          </div>
          <div style={{ color: ds.muted }}><Icon.Chevron size={12} /></div>
        </div>

        <div style={{
          padding: 16, borderRadius: 16, backgroundColor: ds.cyan, marginBottom: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: ds.cream, fontSize: '1rem', fontWeight: 700, margin: 0 }}>Ik had een sessie</p>
              <p style={{ color: ds.cream, fontSize: '0.75rem', margin: 0, marginTop: 2, opacity: 0.85 }}>Reflecteer op je therapiesessie</p>
            </div>
            <div style={{ color: ds.cream }}><Icon.ArrowRight size={18} /></div>
          </div>
        </div>

        <div style={{ padding: 14, borderRadius: 16, backgroundColor: ds.surface, border: '1px solid rgba(255,255,255,0.08)', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <div style={{ color: ds.cyan }}><Icon.Target size={11} /></div>
            <p style={{ color: ds.cyan, fontSize: '0.7rem', fontWeight: 700, margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actieve intentie</p>
          </div>
          <p style={{ color: ds.cream, fontSize: '0.85rem', margin: 0, lineHeight: 1.4 }}>Zeg deze week nee tegen één verzoek zonder uit te leggen waarom</p>
          <p style={{ color: ds.muted, fontSize: '0.7rem', margin: 0, marginTop: 6 }}>Voor vr 18 apr</p>
        </div>

        <div style={{ padding: 14, borderRadius: 16, backgroundColor: ds.surface, border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
            <div style={{ color: ds.gold }}><Icon.Calendar size={11} /></div>
            <p style={{ color: ds.gold, fontSize: '0.7rem', fontWeight: 700, margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Deze week op de planning</p>
          </div>
          <div style={{ padding: 10, borderRadius: 12, backgroundColor: `${ds.gold}10`, border: `1px solid ${ds.gold}30`, marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 10 }}>
              <div>
                <p style={{ color: ds.cream, fontSize: '0.8rem', fontWeight: 500, margin: 0 }}>Een grens stellen</p>
                <p style={{ color: ds.muted, fontSize: '0.7rem', margin: 0, marginTop: 2 }}>Vandaag om 9:00</p>
              </div>
              <span style={{ backgroundColor: ds.gold, color: ds.bg, padding: '2px 6px', borderRadius: 4, fontSize: '0.6rem', fontWeight: 700 }}>Straks</span>
            </div>
            <div style={{ width: '100%', padding: '8px 12px', borderRadius: 10, backgroundColor: ds.gold, color: ds.bg, fontSize: '0.75rem', fontWeight: 700, textAlign: 'center' }}>Nu starten</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// DAILY CHECK-IN
function CheckIn() {
  const messages = [
    { role: 'ai', text: 'Hé Daan, hoe gaat het vandaag met je?' },
    { role: 'user', text: 'Eigenlijk beter. Ik had een lastig gesprek op werk.' },
    { role: 'ai', text: 'Dat klinkt belangrijk. Je gaf aan dat je wilde oefenen met nee zeggen. Hield dit daar verband mee?' },
    { role: 'user', text: 'Ja. Iemand vroeg of ik hun dienst kon overnemen en ik zei dat het niet ging.' },
    { role: 'ai', text: 'Dat vraagt echt moed. De angst was groter dan wat er daadwerkelijk gebeurde. Misschien is dat de moeite waard om te bespreken met je therapeut.' },
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '48px 20px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ color: ds.cream }}><Icon.Back size={18} /></div>
          <p style={{ color: ds.cream, fontSize: '1rem', fontWeight: 700, margin: 0 }}>Dagelijkse Check-in</p>
        </div>
        <p style={{ color: ds.muted, fontSize: '0.75rem', margin: 0 }}>Dag 12</p>
      </div>

      <div style={{ flex: 1, overflow: 'hidden', padding: '0 16px' }}>
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
      </div>

      <div style={{ padding: '10px 16px 24px', borderTop: `1px solid ${ds.subtle}` }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ flex: 1, padding: '10px 14px', borderRadius: 20, backgroundColor: ds.surface, border: `1px solid ${ds.subtle}`, color: ds.muted, fontSize: '0.8rem' }}>Typ of tik op verzenden</div>
          <div style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: ds.cyan, display: 'flex', alignItems: 'center', justifyContent: 'center', color: ds.cream }}>
            <Icon.Send size={14} />
          </div>
        </div>
      </div>
    </div>
  );
}

// POST-SESSION STEPS
function PostSessionStep({ step }) {
  const total = 6;
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <ScreenHeader title="Na de sessie" />
      <div style={{ padding: '0 20px', marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, backgroundColor: i < step ? ds.cyan : ds.surfaceLight }} />
          ))}
        </div>
      </div>
      <div style={{ flex: 1, padding: '0 20px' }}>
        {step === 1 && (
          <div>
            <p style={{ color: ds.cream, fontSize: '1.1rem', fontWeight: 700, margin: '0 0 8px' }}>Hoe voel je je nu?</p>
            <p style={{ color: ds.muted, fontSize: '0.8rem', margin: '0 0 24px' }}>Net na je sessie</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
              {[1,2,3,4,5,6,7,8,9,10].map(n => (
                <div key={n} style={{
                  width: 44, height: 44, borderRadius: 22, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  backgroundColor: n === 7 ? ds.cyan : ds.surface,
                  color: ds.cream, border: `1px solid ${n === 7 ? ds.cyan : ds.subtle}`,
                  fontSize: '0.85rem', fontWeight: 700,
                }}>{n}</div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, padding: '0 4px' }}>
              <span style={{ color: ds.muted, fontSize: '0.65rem' }}>Laag</span>
              <span style={{ color: ds.muted, fontSize: '0.65rem' }}>Hoog</span>
            </div>
          </div>
        )}
        {step === 2 && (
          <div>
            <p style={{ color: ds.cream, fontSize: '1.1rem', fontWeight: 700, margin: '0 0 8px' }}>Wat kwam er naar boven?</p>
            <p style={{ color: ds.muted, fontSize: '0.8rem', margin: '0 0 20px' }}>Kies de thema's die bleven hangen</p>
            {['Grenzen', 'Eigenwaarde', 'Relaties', 'Angst', 'Werkstress', 'Familie'].map((t, i) => (
              <div key={t} style={{
                padding: 12, borderRadius: 12,
                backgroundColor: i < 2 ? `${ds.cyan}15` : ds.surface,
                border: `1px solid ${i < 2 ? ds.cyan : ds.subtle}`,
                marginBottom: 8,
              }}>
                <span style={{ color: i < 2 ? ds.cyan : ds.cream, fontSize: '0.85rem', fontWeight: 500 }}>{t}</span>
              </div>
            ))}
          </div>
        )}
        {step === 3 && (
          <div>
            <p style={{ color: ds.cream, fontSize: '1.1rem', fontWeight: 700, margin: '0 0 8px' }}>Wat bleef hangen?</p>
            <p style={{ color: ds.muted, fontSize: '0.8rem', margin: '0 0 16px' }}>Het moment dat er het meest toe deed</p>
            <div style={{ padding: 12, borderRadius: 12, backgroundColor: ds.surface, border: `1px solid ${ds.subtle}`, minHeight: 200 }}>
              <p style={{ color: ds.cream, fontSize: '0.85rem', lineHeight: 1.5, margin: 0 }}>Ik realiseerde me dat ik steeds ja blijf zeggen tegen dingen die me uitputten, omdat ik bang ben om als lastig gezien te worden. Mijn therapeut hielp me inzien dat het niet om aardig zijn gaat, maar om het vermijden van conflict.</p>
            </div>
          </div>
        )}
        {step === 4 && (
          <div>
            <p style={{ color: ds.cream, fontSize: '1.1rem', fontWeight: 700, margin: '0 0 8px' }}>Iets om te oefenen?</p>
            <p style={{ color: ds.muted, fontSize: '0.8rem', margin: '0 0 16px' }}>Eén kleine actie deze week</p>
            <div style={{ padding: 12, borderRadius: 12, backgroundColor: `${ds.cyan}10`, border: `1px solid ${ds.cyan}40`, minHeight: 80 }}>
              <p style={{ color: ds.cream, fontSize: '0.85rem', lineHeight: 1.5, margin: 0 }}>Zeg deze week nee tegen één verzoek zonder uit te leggen waarom</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12 }}>
              <div style={{ color: ds.cyan }}><Icon.Calendar size={12} /></div>
              <span style={{ color: ds.cyan, fontSize: '0.75rem', fontWeight: 500 }}>Voor vr 18 apr</span>
            </div>
          </div>
        )}
        {step === 5 && (
          <div>
            <p style={{ color: ds.cream, fontSize: '1.1rem', fontWeight: 700, margin: '0 0 8px' }}>Oefeningen om te doen</p>
            <p style={{ color: ds.muted, fontSize: '0.8rem', margin: '0 0 16px' }}>Afgestemd op je sessiethema's</p>
            {[
              { title: 'Een grens stellen', dur: 10, cat: 'Gedrag', selected: true },
              { title: 'Waarden check-in', dur: 5, cat: 'Zelfreflectie', selected: true },
              { title: 'Zelfcompassie-pauze', dur: 8, cat: 'Mindfulness', selected: false },
            ].map(ex => (
              <div key={ex.title} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: 12, borderRadius: 12,
                backgroundColor: ex.selected ? `${ds.cyan}15` : ds.surface,
                border: `1px solid ${ex.selected ? ds.cyan : ds.subtle}`,
                marginBottom: 8,
              }}>
                <div style={{
                  width: 20, height: 20, borderRadius: 10,
                  border: `1.5px solid ${ex.selected ? ds.cyan : ds.muted}`,
                  backgroundColor: ex.selected ? ds.cyan : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: ds.cream,
                }}>
                  {ex.selected && <Icon.Check size={12} />}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ color: ds.cream, fontSize: '0.85rem', fontWeight: 600, margin: 0 }}>{ex.title}</p>
                  <p style={{ color: ds.muted, fontSize: '0.7rem', margin: 0, marginTop: 2 }}>{ex.dur} min · {ex.cat}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        {step === 6 && (
          <div>
            <p style={{ color: ds.cream, fontSize: '1.1rem', fontWeight: 700, margin: '0 0 8px' }}>Jouw reflectie</p>
            <p style={{ color: ds.muted, fontSize: '0.8rem', margin: '0 0 16px' }}>Bekijk voor je opslaat</p>
            <div style={{ padding: 12, borderRadius: 12, backgroundColor: ds.surface, marginBottom: 10 }}>
              <p style={{ color: ds.muted, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 6px' }}>Gevoel</p>
              <p style={{ color: ds.cream, fontSize: '0.9rem', margin: 0, fontWeight: 600 }}>7/10</p>
            </div>
            <div style={{ padding: 12, borderRadius: 12, backgroundColor: ds.surface, marginBottom: 10 }}>
              <p style={{ color: ds.muted, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 8px' }}>Thema's</p>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {['Grenzen', 'Eigenwaarde'].map(t => (
                  <span key={t} style={{ padding: '3px 10px', borderRadius: 10, backgroundColor: `${ds.cyan}20`, color: ds.cyan, fontSize: '0.7rem', fontWeight: 600 }}>{t}</span>
                ))}
              </div>
            </div>
            <div style={{ padding: 12, borderRadius: 12, backgroundColor: ds.surface, border: `1px solid ${ds.cyan}30`, marginBottom: 10 }}>
              <p style={{ color: ds.muted, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 6px' }}>Oefenintentie</p>
              <p style={{ color: ds.cream, fontSize: '0.8rem', margin: 0, lineHeight: 1.4 }}>Zeg deze week nee tegen één verzoek zonder uit te leggen waarom</p>
            </div>
            <div style={{ padding: 12, borderRadius: 12, backgroundColor: ds.surface, border: `1px solid ${ds.gold}30` }}>
              <p style={{ color: ds.muted, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 6px' }}>Ingepland</p>
              <p style={{ color: ds.cream, fontSize: '0.8rem', margin: '4px 0' }}>Een grens stellen</p>
              <p style={{ color: ds.cream, fontSize: '0.8rem', margin: '4px 0' }}>Waarden check-in</p>
            </div>
          </div>
        )}
      </div>
      <div style={{ padding: '10px 20px 20px', borderTop: `1px solid ${ds.subtle}` }}>
        <div style={{
          width: '100%', padding: 14, borderRadius: 14,
          backgroundColor: ds.cyan, color: ds.cream,
          fontSize: '0.9rem', fontWeight: 700, textAlign: 'center',
        }}>{step === 6 ? 'Reflectie opslaan' : 'Volgende'}</div>
      </div>
    </div>
  );
}

// EXERCISE PHASES
function ExerciseIntro() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <ScreenHeader title="Een grens stellen" />
      <div style={{ flex: 1, padding: '0 20px' }}>
        <div style={{ padding: 14, borderRadius: 12, backgroundColor: ds.surface, marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 24 }}>
            <div>
              <p style={{ color: ds.muted, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 2px' }}>Duur</p>
              <p style={{ color: ds.cream, fontSize: '0.85rem', fontWeight: 600, margin: 0 }}>10 min</p>
            </div>
            <div>
              <p style={{ color: ds.muted, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 2px' }}>Stappen</p>
              <p style={{ color: ds.cream, fontSize: '0.85rem', fontWeight: 600, margin: 0 }}>4</p>
            </div>
            <div>
              <p style={{ color: ds.muted, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 2px' }}>Methode</p>
              <p style={{ color: ds.cream, fontSize: '0.85rem', fontWeight: 600, margin: 0 }}>ACT</p>
            </div>
          </div>
        </div>
        <p style={{ color: ds.cream, fontSize: '0.9rem', lineHeight: 1.6, margin: '0 0 16px' }}>
          Deze oefening helpt je grenzen stellen te oefenen door eerst te verkennen wat het moeilijk maakt, en daarna te oefenen hoe het kan voelen.
        </p>
        <p style={{ color: ds.muted, fontSize: '0.8rem', lineHeight: 1.6, margin: 0 }}>
          Je kunt tussen stappen pauzeren. Je antwoorden zijn privé en alleen voor jou zichtbaar.
        </p>
      </div>
      <div style={{ padding: '10px 20px 20px', borderTop: `1px solid ${ds.subtle}` }}>
        <div style={{
          width: '100%', padding: 14, borderRadius: 14,
          backgroundColor: ds.cyan, color: ds.cream,
          fontSize: '0.9rem', fontWeight: 700, textAlign: 'center',
        }}>Beginnen</div>
      </div>
    </div>
  );
}

function ExerciseStep({ type, text, hasInput }) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <ScreenHeader title="Een grens stellen" />
      <div style={{ flex: 1, padding: '0 20px' }}>
        <p style={{ color: ds.muted, fontSize: '0.7rem', textAlign: 'center', margin: '0 0 12px' }}>Stap 2 van 4</p>
        <div style={{ display: 'flex', gap: 4, marginBottom: 24 }}>
          {[0,1,2,3].map(i => (
            <div key={i} style={{ flex: 1, height: 2, borderRadius: 1, backgroundColor: i <= 1 ? ds.cyan : ds.surfaceLight }} />
          ))}
        </div>
        <div style={{ padding: '3px 10px', borderRadius: 8, backgroundColor: `${ds.cyan}20`, display: 'inline-block', marginBottom: 12 }}>
          <span style={{ color: ds.cyan, fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{type}</span>
        </div>
        <p style={{ color: ds.cream, fontSize: '0.95rem', lineHeight: 1.6, margin: '0 0 16px' }}>{text}</p>
        {hasInput && (
          <div style={{ padding: 12, borderRadius: 12, backgroundColor: ds.surface, border: `1px solid ${ds.subtle}`, minHeight: 140 }}>
            <p style={{ color: ds.cream, fontSize: '0.85rem', lineHeight: 1.5, margin: 0 }}>
              Dat ik als egoïstisch of niet behulpzaam gezien zou worden. Dat ze me geen dingen meer zouden vragen en ik er niet meer bij zou horen.
            </p>
          </div>
        )}
      </div>
      <div style={{ padding: '10px 20px 20px', borderTop: `1px solid ${ds.subtle}` }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ padding: '14px 18px', borderRadius: 14, backgroundColor: ds.surface, color: ds.cream, fontSize: '0.85rem', fontWeight: 600, border: `1px solid ${ds.subtle}` }}>Terug</div>
          <div style={{ flex: 1, padding: 14, borderRadius: 14, backgroundColor: ds.cyan, color: ds.cream, fontSize: '0.9rem', fontWeight: 700, textAlign: 'center' }}>Volgende</div>
        </div>
      </div>
    </div>
  );
}

function ExerciseCompletion() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <ScreenHeader title="Een grens stellen" />
      <div style={{ flex: 1, padding: '0 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: 24, paddingTop: 16 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 28, backgroundColor: `${ds.cyan}20`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px',
          }}>
            <div style={{ color: ds.cyan }}><Icon.CheckCircle size={24} /></div>
          </div>
          <p style={{ color: ds.cream, fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Goed gedaan</p>
          <p style={{ color: ds.muted, fontSize: '0.8rem', margin: '4px 0 0' }}>Je kwam vandaag op voor jezelf</p>
        </div>

        <p style={{ color: ds.cream, fontSize: '0.85rem', fontWeight: 600, margin: '0 0 10px' }}>Hoe was het?</p>
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {[1,2,3,4,5].map(n => (
            <div key={n} style={{
              flex: 1, padding: 10, borderRadius: 10,
              backgroundColor: ds.surface, border: `1px solid ${n <= 4 ? ds.gold : ds.subtle}`,
              display: 'flex', justifyContent: 'center',
            }}>
              <Icon.Star size={16} filled={n <= 4} />
            </div>
          ))}
        </div>

        <p style={{ color: ds.cream, fontSize: '0.85rem', fontWeight: 600, margin: '0 0 8px' }}>Kwam er iets naar boven?</p>
        <div style={{ padding: 12, borderRadius: 12, backgroundColor: ds.surface, border: `1px solid ${ds.subtle}`, minHeight: 100 }}>
          <p style={{ color: ds.cream, fontSize: '0.85rem', lineHeight: 1.5, margin: 0 }}>
            Makkelijker voor te stellen dan ik dacht. De angst voelt kleiner als ik het terugbreng naar één kleine situatie.
          </p>
        </div>
      </div>
      <div style={{ padding: '10px 20px 20px', borderTop: `1px solid ${ds.subtle}` }}>
        <div style={{
          width: '100%', padding: 14, borderRadius: 14,
          backgroundColor: ds.cyan, color: ds.cream,
          fontSize: '0.9rem', fontWeight: 700, textAlign: 'center',
        }}>Opslaan en afronden</div>
      </div>
    </div>
  );
}

// SESSION PREP
function SessionPrep() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <ScreenHeader title="Sessievoorbereiding" />
      <div style={{ flex: 1, padding: '0 20px' }}>
        <p style={{ color: ds.muted, fontSize: '0.8rem', margin: '0 0 16px' }}>
          Een overzicht van je week om mee te nemen naar je volgende sessie.
        </p>

        <div style={{ padding: 14, borderRadius: 14, backgroundColor: ds.surface, border: `1px solid ${ds.cyan}25`, marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <div style={{ color: ds.cyan }}><Icon.Calendar size={11} /></div>
            <span style={{ color: ds.cyan, fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sinds je laatste sessie</span>
          </div>
          <p style={{ color: ds.cream, fontSize: '1.3rem', fontWeight: 800, margin: '0 0 14px' }}>5 dagen geleden</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
            {[
              { n: '4', l: 'Check-ins' },
              { n: '3', l: 'Oefeningen' },
              { n: '1/2', l: 'Intenties' },
            ].map((s, i) => (
              <div key={i} style={{ padding: 10, borderRadius: 10, backgroundColor: ds.bg, textAlign: 'center' }}>
                <p style={{ color: ds.cyan, fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>{s.n}</p>
                <p style={{ color: ds.muted, fontSize: '0.6rem', margin: 0, marginTop: 2 }}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: 14, borderRadius: 14, backgroundColor: ds.surface, border: '1px solid rgba(255,255,255,0.08)', marginBottom: 10 }}>
          <p style={{ color: ds.muted, fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 8px' }}>Wat kwam er vorige keer naar boven</p>
          <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
            <span style={{ padding: '3px 10px', borderRadius: 10, backgroundColor: `${ds.cyan}20`, color: ds.cyan, fontSize: '0.7rem', fontWeight: 600 }}>Grenzen</span>
            <span style={{ padding: '3px 10px', borderRadius: 10, backgroundColor: `${ds.cyan}20`, color: ds.cyan, fontSize: '0.7rem', fontWeight: 600 }}>Eigenwaarde</span>
          </div>
          <p style={{ color: ds.cream, fontSize: '0.8rem', lineHeight: 1.5, margin: 0 }}>
            Ik realiseerde me dat ik steeds ja blijf zeggen tegen dingen die me uitputten, omdat ik bang ben om als lastig gezien te worden.
          </p>
        </div>

        <div style={{ padding: 14, borderRadius: 14, backgroundColor: ds.surface, border: '1px solid rgba(255,255,255,0.08)', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ color: ds.cyan }}><Icon.Book size={11} /></div>
              <span style={{ color: ds.cyan, fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Wat je hebt geoefend</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Icon.Star size={10} filled />
              <span style={{ color: ds.cream, fontSize: '0.7rem', fontWeight: 600 }}>4.0 gem.</span>
            </div>
          </div>
          {[
            { title: 'Een grens stellen', when: 'Wo', rating: 5, reflection: 'Spannend, maar ik heb het gedaan. Ze vonden het prima.' },
            { title: 'Waarden check-in', when: 'Do', rating: 4, reflection: null },
          ].map((ex, i) => (
            <div key={i} style={{ padding: 10, borderRadius: 10, backgroundColor: ds.bg, marginBottom: i < 1 ? 6 : 0 }}>
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
      </div>
    </div>
  );
}

// SCHEDULING / EXERCISE CHOICE SCREEN
function SchedulingScreen() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <ScreenHeader title="Oefeningen inplannen" />
      <div style={{ flex: 1, padding: '0 20px' }}>
        <p style={{ color: ds.muted, fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 10px' }}>Afgestemd op je sessie</p>
        {[
          { title: 'Een grens stellen', dur: 10, cat: 'Gedrag' },
          { title: 'Waarden check-in', dur: 5, cat: 'Zelfreflectie' },
        ].map((ex, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 12, borderRadius: 12, backgroundColor: ds.bg, marginBottom: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: `${ds.cyan}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: ds.cyan }}>
              <Icon.Book size={14} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ color: ds.cream, fontSize: '0.85rem', fontWeight: 600, margin: 0 }}>{ex.title}</p>
              <p style={{ color: ds.muted, fontSize: '0.7rem', margin: 0, marginTop: 2 }}>{ex.dur} min · {ex.cat}</p>
            </div>
            <div style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: `${ds.cyan}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: ds.cyan }}>
              <Icon.Check size={12} />
            </div>
          </div>
        ))}

        <p style={{ color: ds.muted, fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '16px 0 10px' }}>Wanneer</p>
        {[
          { title: 'Een grens stellen', day: 'Wo', time: '9:00' },
          { title: 'Waarden check-in', day: 'Vr', time: '19:00' },
        ].map((ex, i) => (
          <div key={i} style={{ padding: 12, borderRadius: 12, backgroundColor: ds.bg, marginBottom: 8 }}>
            <p style={{ color: ds.cream, fontSize: '0.8rem', fontWeight: 500, margin: 0 }}>{ex.title}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
              <div style={{ flex: 1, padding: '6px 10px', borderRadius: 8, backgroundColor: ds.surface, color: ds.cream, fontSize: '0.75rem' }}>{ex.day} 18 apr</div>
              <div style={{ padding: '6px 10px', borderRadius: 8, backgroundColor: ds.surface, color: ds.cream, fontSize: '0.75rem' }}>{ex.time}</div>
            </div>
          </div>
        ))}

        <div style={{ padding: 12, borderRadius: 12, backgroundColor: ds.surface, border: `1px solid ${ds.cyan}30`, marginTop: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ color: ds.cyan }}><Icon.Calendar size={14} /></div>
          <p style={{ color: ds.cream, fontSize: '0.8rem', margin: 0, flex: 1 }}>Toevoegen aan agenda</p>
          <p style={{ color: ds.muted, fontSize: '0.65rem', margin: 0 }}>.ics</p>
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
        pixelRatio: 3,
        backgroundColor: undefined,
        cacheBust: true,
        style: { transform: 'none' },
      });
      const link = document.createElement('a');
      const filename = title.replace(/[^a-zA-Z0-9]+/g, '-').toLowerCase() + '.png';
      link.download = `seen-${filename}`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Export failed:', err);
      alert('Kon deze afbeelding niet exporteren. Probeer opnieuw of gebruik een andere browser.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div style={{
      backgroundColor: ds.surface,
      borderRadius: 24,
      padding: 32,
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
    }}>
      <div style={{ textAlign: 'center', maxWidth: 320 }}>
        <p style={{ color: ds.cyan, fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 6px' }}>{title}</p>
        {description && (
          <p style={{ color: ds.muted, fontSize: '0.85rem', lineHeight: 1.5, margin: 0 }}>{description}</p>
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
          backgroundColor: ds.cyan, color: ds.cream,
          fontSize: '0.85rem', fontWeight: 600,
          border: 'none', cursor: downloading ? 'default' : 'pointer',
          opacity: downloading ? 0.6 : 1,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
        {downloading ? 'Even geduld...' : 'Download PNG'}
      </button>
    </div>
  );
}

export default function Phase2Visuals() {
  const visuals = [
    {
      title: 'Oefenruimte (home)',
      description: 'De startpagina. Dagelijkse check-in, sessievoorbereiding, na de sessie, actieve intentie, en ingeplande oefeningen met Straks-label.',
      content: <Home />,
    },
    {
      title: 'Dagelijkse check-in',
      description: 'AI-gesprek dat de therapiethema\'s, intenties en ingeplande oefeningen van de gebruiker onthoudt. Stimuleert om dingen met de therapeut te bespreken.',
      content: <CheckIn />,
    },
    {
      title: 'Na de sessie · Stap 1 · Gevoel',
      description: 'Beoordeling van de emotionele staat direct na de sessie. 1 tot 10.',
      content: <PostSessionStep step={1} />,
    },
    {
      title: 'Na de sessie · Stap 2 · Thema\'s',
      description: 'Kies meerdere thema\'s die in de sessie naar boven kwamen.',
      content: <PostSessionStep step={2} />,
    },
    {
      title: 'Na de sessie · Stap 3 · Reflectie',
      description: 'Vrije reflectie met spraakinvoer. Het moment dat er het meest toe deed.',
      content: <PostSessionStep step={3} />,
    },
    {
      title: 'Na de sessie · Stap 4 · Intentie',
      description: 'Een oefenintentie voor de week, met optionele streefdatum.',
      content: <PostSessionStep step={4} />,
    },
    {
      title: 'Na de sessie · Stap 5 · Oefeningen',
      description: 'Oefeningen afgestemd op de thema\'s van de sessie. De gebruiker kan ook door de hele bibliotheek bladeren of zelf activiteiten toevoegen.',
      content: <PostSessionStep step={5} />,
    },
    {
      title: 'Na de sessie · Stap 6 · Overzicht',
      description: 'Alles op één scherm voor het opslaan.',
      content: <PostSessionStep step={6} />,
    },
    {
      title: 'Oefeningen inplannen',
      description: 'Kies voor elke oefening een dag en tijd, en voeg ze via .ics toe aan de eigen agenda van de gebruiker.',
      content: <SchedulingScreen />,
    },
    {
      title: 'Oefening · Intro',
      description: 'Duur, aantal stappen en methode. Wat de oefening doet en hoe het werkt.',
      content: <ExerciseIntro />,
    },
    {
      title: 'Oefening · Begeleidingsstap',
      description: 'Een stap met het label Begeleiding leidt de gebruiker door de oefening. Andere stappen kunnen Reflecteer, Dagboek of Pauze zijn.',
      content: <ExerciseStep type="Begeleiding" text="Denk aan een recente situatie waarin je ja zei terwijl je nee wilde zeggen. Haal het duidelijk voor de geest." hasInput={false} />,
    },
    {
      title: 'Oefening · Reflectiestap',
      description: 'Een reflectiestap legt in eigen woorden vast wat er bij de gebruiker naar boven kwam.',
      content: <ExerciseStep type="Reflecteer" text="Waar was je bang voor als je nee zou zeggen?" hasInput={true} />,
    },
    {
      title: 'Oefening · Afronding',
      description: 'Zelfbeoordeling en reflectie na afloop. Deze komen terug in de AI-context voor volgende check-ins.',
      content: <ExerciseCompletion />,
    },
    {
      title: 'Sessievoorbereiding',
      description: 'Een overzicht van één pagina van de week sinds de laatste sessie. Om door te nemen voor je naar de volgende therapieafspraak gaat.',
      content: <SessionPrep />,
    },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: ds.bg,
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
      padding: '40px 20px 80px',
    }}>
      <style>{`
        @media print {
          body { background: white !important; }
        }
      `}</style>

      {/* Header */}
      <div style={{ maxWidth: 1200, margin: '0 auto 40px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 12 }}>
          <SeenStar size={24} />
          <h1 style={{ color: ds.cream, fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>Seen Fase 2</h1>
          <span style={{ color: ds.cyan, fontSize: '0.9rem', fontWeight: 600 }}>UI Galerij</span>
        </div>
        <p style={{ color: ds.muted, fontSize: '0.95rem', margin: '0 auto', maxWidth: 600, lineHeight: 1.5 }}>
          Tik op Download PNG onder elk scherm om het op te slaan. Hoge resolutie, transparante achtergrond, klaar om in een presentatie te plakken.
        </p>
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

      <div style={{ maxWidth: 600, margin: '60px auto 0', padding: 20, borderRadius: 16, backgroundColor: ds.surface, textAlign: 'center' }}>
        <p style={{ color: ds.muted, fontSize: '0.85rem', margin: 0, lineHeight: 1.5 }}>
          Elke PNG wordt geëxporteerd op 3x resolutie met een transparante achtergrond. De telefoonrand en zachte schaduw worden meegenomen, zodat het op elke dia-achtergrond afgemaakt oogt.
        </p>
      </div>
    </div>
  );
}
