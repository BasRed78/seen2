'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function AntiCookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Check if user has already seen the banner
    const hasSeenBanner = localStorage.getItem('seen-privacy-banner');
    
    if (!hasSeenBanner) {
      // Delay showing banner to not compete with first impression
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2500);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const dismissBanner = () => {
    setIsLeaving(true);
    setTimeout(() => {
      setIsVisible(false);
      localStorage.setItem('seen-privacy-banner', 'true');
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-300 ${
        isLeaving ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
      }`}
    >
      {/* Backdrop gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" 
           style={{ height: '150%', bottom: 0 }} />
      
      <div className="relative max-w-2xl mx-auto p-4">
        <div 
          className="rounded-2xl p-6 shadow-2xl border backdrop-blur-sm"
          style={{ 
            backgroundColor: 'rgba(26, 26, 46, 0.95)',
            borderColor: 'rgba(194, 84, 65, 0.3)',
          }}
        >
          {/* Close button */}
          <button
            onClick={dismissBanner}
            className="absolute top-4 right-4 p-1 rounded-lg transition-colors hover:bg-white/10"
            aria-label="Close"
          >
            <X size={20} style={{ color: 'rgba(255,255,255,0.5)' }} />
          </button>

          {/* Cookie icon - crossed out */}
          <div className="flex items-start gap-4">
            <div 
              className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center relative"
              style={{ backgroundColor: 'rgba(194, 84, 65, 0.15)' }}
            >
              {/* Cookie emoji with strikethrough */}
              <span className="text-2xl">🍪</span>
              <div 
                className="absolute inset-0 flex items-center justify-center"
                style={{ color: '#C25441' }}
              >
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="12" x2="36" y2="36" />
                </svg>
              </div>
            </div>

            <div className="flex-1 pr-8">
              {/* Headline - looks like typical cookie banner at first glance */}
              <h3 
                className="text-lg font-bold mb-2"
                style={{ color: '#FAF8F5' }}
              >
                You expected a cookie popup.
              </h3>
              
              {/* The twist */}
              <p 
                className="text-base mb-4 leading-relaxed"
                style={{ color: 'rgba(250, 248, 245, 0.8)' }}
              >
                Here's what we do instead: <span style={{ color: '#C25441', fontWeight: 600 }}>nothing</span>.
                <br />
                <span style={{ color: 'rgba(250, 248, 245, 0.6)' }}>
                  No tracking. No analytics that follow you around the internet. No selling your data. 
                  You're here to understand yourself, not to become a product.
                </span>
              </p>

              {/* CTA */}
              <button
                onClick={dismissBanner}
                className="px-5 py-2.5 rounded-xl font-semibold text-sm transition-all hover:scale-105"
                style={{ 
                  backgroundColor: '#C25441',
                  color: '#FAF8F5',
                }}
              >
                Okay, I like you already
              </button>
            </div>
          </div>

          {/* Subtle link to privacy policy */}
          <div className="mt-4 pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
            <a 
              href="/privacy" 
              className="text-xs transition-colors hover:underline"
              style={{ color: 'rgba(250, 248, 245, 0.4)' }}
            >
              Read our full privacy policy →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
