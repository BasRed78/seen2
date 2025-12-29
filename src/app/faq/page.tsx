'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';

const StarIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0L13.5 10.5L24 12L13.5 13.5L12 24L10.5 13.5L0 12L10.5 10.5L12 0Z" />
  </svg>
);

const colors = {
  dark: '#1a1a2e',
  darkLight: '#252540',
  coral: '#C25441',
  cyan: '#5B8F8F',
  cream: '#FAF8F5',
};

interface FAQItemProps {
  question: string;
  answer: React.ReactNode;
  isOpen: boolean;
  onClick: () => void;
}

const FAQItem = ({ question, answer, isOpen, onClick }: FAQItemProps) => (
  <div className="border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
    <button
      onClick={onClick}
      className="w-full py-6 flex items-start justify-between text-left gap-4"
    >
      <h3 className="text-lg font-bold pr-4" style={{ color: colors.cream }}>
        {question}
      </h3>
      {isOpen ? (
        <ChevronUp size={20} className="flex-shrink-0 mt-1" style={{ color: colors.coral }} />
      ) : (
        <ChevronDown size={20} className="flex-shrink-0 mt-1" style={{ color: colors.cream, opacity: 0.5 }} />
      )}
    </button>
    {isOpen && (
      <div className="pb-6 pr-12" style={{ color: colors.cream, opacity: 0.8 }}>
        {answer}
      </div>
    )}
  </div>
);

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Why not just use ChatGPT?",
      answer: (
        <div className="space-y-4">
          <p>You could. But here's the difference.</p>
          <p><strong>ChatGPT waits for you to show up.</strong> Seen shows up for you — every day, with a question you didn't know you needed to answer.</p>
          <p><strong>ChatGPT is a general-purpose tool</strong> that can discuss anything. Seen is purpose-built for one thing: helping you understand your stress patterns. Every question draws from peer-reviewed psychology research. Every interaction is designed around established therapeutic frameworks like Motivational Interviewing and the Transtheoretical Model of change.</p>
          <p><strong>ChatGPT won't push back.</strong> Seen is designed to spot resistance, ask harder questions when you're ready, and surface patterns you'd rather not see. It's built with the kind of structure a good therapist would use — not just conversation, but guided inquiry.</p>
          <p>Think of it like the difference between googling your symptoms and talking to a specialist who's studied exactly what you're dealing with.</p>
        </div>
      )
    },
    {
      question: "Is Seen therapy?",
      answer: (
        <div className="space-y-4">
          <p><strong>No.</strong> Seen is not therapy and doesn't replace professional help.</p>
          <p>Think of it this way:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Therapy</strong> = professional guidance and behavior change</li>
            <li><strong>Seen</strong> = pattern awareness and daily self-reflection</li>
          </ul>
          <p>Seen helps you <em>see</em> what's happening. What you do with that clarity is up to you — whether that's making changes on your own, having a hard conversation, or deciding to seek professional support.</p>
          <p>If you're in crisis or need professional support, please reach out to a mental health professional.</p>
        </div>
      )
    },
    {
      question: "What are the six patterns?",
      answer: (
        <div className="space-y-4">
          <p>When stress hits, your brain reaches for something. We've identified six common patterns:</p>
          <ul className="space-y-3">
            <li><strong style={{ color: colors.coral }}>Intimacy Seeking</strong> — Reaching for connection, validation, or romantic attention</li>
            <li><strong style={{ color: colors.coral }}>Substance Soothing</strong> — Using alcohol, food, or other substances to numb or escape</li>
            <li><strong style={{ color: colors.coral }}>Compulsive Spending</strong> — Shopping or spending to feel in control or get relief</li>
            <li><strong style={{ color: colors.coral }}>Achievement Hiding</strong> — Overworking to avoid feelings or prove worth</li>
            <li><strong style={{ color: colors.coral }}>Approval Chasing</strong> — Seeking external validation to feel okay</li>
            <li><strong style={{ color: colors.coral }}>Withdrawal & Avoidance</strong> — Retreating, isolating, or shutting down</li>
          </ul>
          <p>These aren't diagnoses — they're patterns. Most people recognize themselves in one or two. The quiz helps you identify yours.</p>
        </div>
      )
    },
    {
      question: "Is my data private?",
      answer: (
        <div className="space-y-4">
          <p><strong>Yes. Your privacy is non-negotiable.</strong></p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Your data is encrypted</strong> — Protected with industry-standard encryption</li>
            <li><strong>EU-hosted, GDPR compliant</strong> — Protected by the strongest privacy laws</li>
            <li><strong>No selling, no sharing</strong> — Your data is never sold to advertisers. Ever.</li>
            <li><strong>Delete anytime</strong> — One click removes everything</li>
          </ul>
          <p>The patterns you share are deeply personal. We built Seen to protect them.</p>
        </div>
      )
    },
    {
      question: "Is there scientific evidence behind this?",
      answer: (
        <div className="space-y-4">
          <p><strong>Yes.</strong> Seen is built on peer-reviewed research in psychology and behavioral science.</p>
          <p>Our approach draws from established frameworks including:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>The Transtheoretical Model</strong> of behavior change (Prochaska & DiClemente)</li>
            <li><strong>Motivational Interviewing</strong> techniques (Miller & Rollnick)</li>
            <li><strong>Emotion regulation research</strong> (Gross & John)</li>
            <li><strong>Stress and coping theory</strong> (Lazarus & Folkman)</li>
            <li><strong>Attachment theory under stress</strong> (Mikulincer & Shaver)</li>
          </ul>
          <p>Every pattern in our quiz, every question in our check-ins, is informed by legitimate academic research — not marketing claims.</p>
        </div>
      )
    },
    {
      question: "How does the AI work?",
      answer: (
        <div className="space-y-4">
          <p>Seen uses advanced AI (Claude by Anthropic) to power the daily check-ins. But it's not just a chatbot.</p>
          <p>The AI is guided by:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Your pattern type</strong> — Questions are tailored to your specific stress response</li>
            <li><strong>Therapeutic frameworks</strong> — OARS techniques (Open questions, Affirmations, Reflections, Summaries) from Motivational Interviewing</li>
            <li><strong>Your history</strong> — It remembers what you've shared and spots connections over time</li>
            <li><strong>Stage awareness</strong> — It adapts based on where you are in your journey</li>
          </ul>
          <p>The goal isn't to be clever. It's to ask the right question at the right time.</p>
        </div>
      )
    },
    {
      question: "What if I'm in crisis?",
      answer: (
        <div className="space-y-4">
          <p><strong>Seen is not a crisis intervention tool.</strong></p>
          <p>If you're in crisis or having thoughts of self-harm, please reach out to professional support:</p>
          <div 
            className="p-4 rounded-xl my-4"
            style={{ backgroundColor: `${colors.coral}15`, borderLeft: `4px solid ${colors.coral}` }}
          >
            <p className="font-bold mb-2">Netherlands:</p>
            <p>113 Zelfmoordpreventie: <strong>0900-0113</strong> (24/7)</p>
            <p>De Luisterlijn: <strong>088-0767000</strong> (24/7)</p>
            <p className="font-bold mb-2 mt-4">International:</p>
            <p>Find your local crisis line at <a href="https://findahelpline.com" target="_blank" rel="noopener noreferrer" className="underline">findahelpline.com</a></p>
          </div>
          <p>If you're struggling but not in crisis, Seen can help you build awareness — but it's not a substitute for professional care.</p>
        </div>
      )
    },
    {
      question: "How much does it cost?",
      answer: (
        <div className="space-y-4">
          <p><strong>The quiz is free.</strong> Take it, see your pattern, learn something about yourself.</p>
          <p>Daily check-ins and pattern tracking are <strong>€7.99/month</strong> for founding members.</p>
          <p>Cancel anytime. No questions asked. No dark patterns. No surprise charges.</p>
        </div>
      )
    },
    {
      question: "How long does the quiz take?",
      answer: (
        <div className="space-y-4">
          <p><strong>About 2 minutes.</strong> 14 questions. Completely private.</p>
          <p>You'll get immediate results showing your stress pattern — no email required to see them.</p>
        </div>
      )
    },
    {
      question: "What happens after the quiz?",
      answer: (
        <div className="space-y-4">
          <p>After the quiz, you'll see:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Your primary stress pattern</li>
            <li>What it means and why it develops</li>
            <li>The research behind it</li>
          </ul>
          <p>From there, you can start daily check-ins. Seen will reach out each day with a brief reflection — 2-3 minutes. Over time, patterns emerge, triggers become visible, and you start to see what's actually driving your behavior.</p>
        </div>
      )
    },
    {
      question: "How is this different from journaling?",
      answer: (
        <div className="space-y-4">
          <p>Journaling is valuable, but it has limits:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Journaling waits for you.</strong> Seen reaches out.</li>
            <li><strong>Journaling is open-ended.</strong> Seen asks specific, research-backed questions.</li>
            <li><strong>Journaling doesn't connect the dots.</strong> Seen remembers last week and spots patterns you'd miss.</li>
            <li><strong>Journaling doesn't push back.</strong> Seen is designed to surface what you'd rather not see.</li>
          </ul>
          <p>Think of Seen as guided journaling with memory and pattern recognition built in.</p>
        </div>
      )
    },
    {
      question: "Can I use Seen if I'm already in therapy?",
      answer: (
        <div className="space-y-4">
          <p><strong>Absolutely.</strong> Many people use Seen alongside therapy.</p>
          <p>It can help you:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Track patterns between sessions</li>
            <li>Notice triggers you might otherwise miss</li>
            <li>Come to sessions with more self-awareness</li>
            <li>Practice honesty in a low-stakes environment</li>
          </ul>
          <p>Seen doesn't replace what happens in the therapy room — it supports the work you're already doing.</p>
        </div>
      )
    },
    {
      question: "Who built this?",
      answer: (
        <div className="space-y-4">
          <p>Seen was built by Bas, who spent years stuck in a pattern he couldn't see.</p>
          <p>"I built Seen because I wish it had existed for me. By the time I understood what I was doing — and why — it had already cost me. I want to help others see their patterns before everything breaks."</p>
          <Link 
            href="/story" 
            className="inline-flex items-center gap-2 font-semibold transition-all hover:gap-3"
            style={{ color: colors.coral }}
          >
            Read the full story <ArrowRight size={16} />
          </Link>
        </div>
      )
    },
    {
      question: "When will Seen launch?",
      answer: (
        <div className="space-y-4">
          <p><strong>Q1 2026.</strong> We're currently in private testing with a small group.</p>
          <p>Take the quiz to join the waitlist and be first to know when we launch.</p>
          <p className="mt-4 pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
            <strong style={{ color: colors.cyan }}>What's on the roadmap:</strong>
          </p>
          <p>We're building Seen to support you wherever you are in your journey. Future expansions include:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>During-therapy tools</strong> — Pattern tracking and insights to complement your sessions</li>
            <li><strong>Post-therapy support</strong> — Maintenance tools to help you stay aware after therapy ends</li>
          </ul>
          <p>Right now, we're focused on getting the core experience right: helping people see their patterns before they're ready for professional help.</p>
        </div>
      )
    },
    {
      question: "I have another question",
      answer: (
        <div className="space-y-4">
          <p>Reach out directly: <a href="mailto:bas@seeyourself.today" className="underline" style={{ color: colors.coral }}>bas@seeyourself.today</a></p>
          <p>I read every email and respond personally.</p>
        </div>
      )
    },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.dark }}>
      {/* Header */}
      <header className="px-6 py-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <StarIcon size={24} />
            <span className="font-black text-xl" style={{ color: colors.cream }}>Seen</span>
          </Link>
          <Link 
            href="/"
            className="flex items-center gap-2 text-sm font-medium transition-all hover:gap-3"
            style={{ color: colors.cream, opacity: 0.7 }}
          >
            <ArrowLeft size={16} /> Back to home
          </Link>
        </div>
      </header>

      {/* FAQ Content */}
      <main className="px-6 py-12 pb-24">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-lg font-bold uppercase tracking-widest mb-4" style={{ color: colors.coral }}>
              FAQ
            </p>
            <h1 className="text-3xl md:text-4xl font-bold" style={{ color: colors.cream }}>
              Questions & Answers
            </h1>
          </div>

          <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              />
            ))}
          </div>

          {/* CTA */}
          <div 
            className="mt-16 p-8 rounded-2xl text-center border"
            style={{ backgroundColor: colors.darkLight, borderColor: colors.coral }}
          >
            <h3 className="text-xl font-bold mb-3" style={{ color: colors.cream }}>
              Ready to see your pattern?
            </h3>
            <p className="mb-6" style={{ color: colors.cream, opacity: 0.7 }}>
              Take the free quiz. 2 minutes. Completely private.
            </p>
            <Link 
              href="/quiz"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold transition-all hover:scale-105"
              style={{ backgroundColor: colors.coral, color: colors.cream }}
            >
              Take the Quiz <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-8 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <StarIcon size={18} />
            <span className="font-bold" style={{ color: colors.cream }}>Seen</span>
          </div>
          <div className="flex items-center gap-6 text-xs" style={{ color: colors.cream, opacity: 0.4 }}>
            <Link href="/story" className="hover:opacity-100 transition-opacity">Story</Link>
            <span>© 2025</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
