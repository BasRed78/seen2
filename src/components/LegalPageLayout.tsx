import Link from 'next/link';

// Custom Star Icon
const StarIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0L13.5 10.5L24 12L13.5 13.5L12 24L10.5 13.5L0 12L10.5 10.5L12 0Z" />
  </svg>
);

interface LegalPageLayoutProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export default function LegalPageLayout({ title, lastUpdated, children }: LegalPageLayoutProps) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1a1a2e' }}>
      {/* Header */}
      <header className="border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
        <div className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <StarIcon size={16} />
            <span className="text-xl font-bold" style={{ color: '#FAF8F5' }}>SEEN</span>
          </Link>
          <Link 
            href="/"
            className="text-sm px-4 py-2 rounded-lg transition-colors"
            style={{ color: 'rgba(250, 248, 245, 0.6)', backgroundColor: 'rgba(255,255,255,0.05)' }}
          >
            ← Back to home
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Title */}
        <div className="mb-12">
          <h1 
            className="text-4xl font-bold mb-3"
            style={{ color: '#FAF8F5' }}
          >
            {title}
          </h1>
          <p style={{ color: 'rgba(250, 248, 245, 0.5)' }}>
            Last updated: {lastUpdated}
          </p>
        </div>

        {/* Legal content */}
        <div 
          className="prose prose-invert max-w-none"
          style={{ 
            '--tw-prose-body': 'rgba(250, 248, 245, 0.8)',
            '--tw-prose-headings': '#FAF8F5',
            '--tw-prose-links': '#C25441',
            '--tw-prose-bold': '#FAF8F5',
            '--tw-prose-bullets': 'rgba(250, 248, 245, 0.4)',
            '--tw-prose-counters': 'rgba(250, 248, 245, 0.4)',
          } as React.CSSProperties}
        >
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex flex-wrap gap-6 text-sm" style={{ color: 'rgba(250, 248, 245, 0.5)' }}>
            <Link href="/terms" className="hover:underline">Terms of Service</Link>
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
            <Link href="/cookies" className="hover:underline">Cookie Policy</Link>
            <a href="mailto:support@seeyourself.today" className="hover:underline">Contact</a>
          </div>
          <p className="mt-4 text-xs" style={{ color: 'rgba(250, 248, 245, 0.3)' }}>
            © {new Date().getFullYear()} SEEN. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
