import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';

// Custom Star Icon
const StarIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0L13.5 10.5L24 12L13.5 13.5L12 24L10.5 13.5L0 12L10.5 10.5L12 0Z" />
  </svg>
);

export const metadata = {
  title: 'Why I Built SEEN | SEEN',
  description: 'The story behind SEEN — a mental health awareness tool built by someone who needed it.',
};

export default function StoryPage() {
  return (
    <div className="min-h-screen p-6 py-12" style={{ backgroundColor: '#1a1a2e' }}>
      <div className="max-w-2xl mx-auto">
        {/* Back button */}
        <Link
          href="/"
          className="mb-8 flex items-center gap-2 font-semibold transition-all hover:gap-3 rounded-lg px-2 py-1"
          style={{ color: '#FAF8F5' }}
        >
          <ArrowLeft size={18} /> Back
        </Link>

        <div 
          className="rounded-2xl shadow-xl p-8 md:p-10" 
          style={{ backgroundColor: '#252540' }}
        >
          <div className="flex items-center gap-2 mb-8">
            <StarIcon size={16} />
            <h1 
              className="text-2xl md:text-3xl font-bold" 
              style={{ color: '#FAF8F5' }}
            >
              Why I Built SEEN
            </h1>
          </div>

          <div className="space-y-6" style={{ color: '#FAF8F5' }}>
            <p className="text-lg leading-relaxed">
              I spent a long time stuck, without even realising it.
            </p>

            <p className="leading-relaxed" style={{ opacity: 0.85 }}>
              I knew something was wrong. I could half-see my pattern. But I wasn't ready to face it — not with a therapist, not with friends, definitely not with family.
            </p>

            <p className="leading-relaxed" style={{ opacity: 0.85 }}>
              And when someone got too close to the truth, I'd push back. Get defensive. Make them feel like they were overreacting. Meanwhile, they were carrying the weight of my pattern — and I couldn't see it.
            </p>

            <p className="leading-relaxed" style={{ opacity: 0.85 }}>
              I needed a space to figure things out on my own terms first. That space didn't exist. So I stayed stuck, alone with the insight but no way forward.
            </p>

            <p className="leading-relaxed" style={{ opacity: 0.85 }}>
              SEEN is what I wish I'd had. A place to explore what's really going on, without having to explain yourself to anyone. Completely private. No judgment, no pressure to share more than you're ready for.
            </p>

            <p 
              className="text-lg leading-relaxed font-medium"
              style={{ color: '#C25441' }}
            >
              A place to finally see yourself clearly — so you can change before your patterns cost you what matters most.
            </p>

            <p className="leading-relaxed italic" style={{ opacity: 0.7 }}>
              — Bas
            </p>
          </div>

          <div 
            className="mt-10 pt-8 border-t" 
            style={{ borderColor: 'rgba(255,255,255,0.1)' }}
          >
            <Link
              href="/quiz"
              className="w-full font-bold py-4 px-8 rounded-xl transition-all text-lg shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              style={{ 
                backgroundColor: '#C25441', 
                color: '#FAF8F5' 
              }}
            >
              Take the Assessment <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-6 py-8 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <svg width={18} height={18} viewBox="0 0 24 24" fill="#C25441">
                <path d="M12 0L13.5 10.5L24 12L13.5 13.5L12 24L10.5 13.5L0 12L10.5 10.5L12 0Z" />
              </svg>
              <span className="font-bold" style={{ color: '#FAF8F5' }}>Seen</span>
            </div>
            <div className="flex items-center gap-6 text-xs" style={{ color: '#FAF8F5', opacity: 0.4 }}>
              <Link href="/" className="hover:opacity-100 transition-opacity">Home</Link>
              <Link href="/faq" className="hover:opacity-100 transition-opacity">FAQ</Link>
              <Link href="/how-it-works" className="hover:opacity-100 transition-opacity">How it works</Link>
            </div>
          </div>
          <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
            <div className="flex items-center gap-6 text-xs" style={{ color: '#FAF8F5', opacity: 0.3 }}>
              <Link href="/terms" className="hover:opacity-100 transition-opacity">Terms</Link>
              <Link href="/privacy" className="hover:opacity-100 transition-opacity">Privacy</Link>
              <Link href="/cookies" className="hover:opacity-100 transition-opacity">Cookies</Link>
            </div>
            <span className="text-xs" style={{ color: '#FAF8F5', opacity: 0.3 }}>© 2025 Seen</span>
          </div>
        </div>
      </footer>
    </div>
  );
}