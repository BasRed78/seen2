import Link from 'next/link';

// Custom Star Icon
const StarIcon = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0L13.5 10.5L24 12L13.5 13.5L12 24L10.5 13.5L0 12L10.5 10.5L12 0Z" />
  </svg>
);

interface FooterProps {
  className?: string;
}

export default function Footer({ className = '' }: FooterProps) {
  return (
    <footer className={`border-t border-white/10 ${className}`}>
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Logo and tagline */}
        <div className="flex items-center gap-2 mb-6">
          <StarIcon size={14} />
          <span className="text-lg font-bold text-cream">SEEN</span>
        </div>
        
        {/* Links */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-cream/50">
          <Link href="/terms" className="hover:text-cream/80 transition-colors">
            Terms of Service
          </Link>
          <Link href="/privacy" className="hover:text-cream/80 transition-colors">
            Privacy Policy
          </Link>
          <Link href="/cookies" className="hover:text-cream/80 transition-colors">
            Cookie Policy
          </Link>
          <a 
            href="mailto:support@seeyourself.today" 
            className="hover:text-cream/80 transition-colors"
          >
            Contact
          </a>
        </div>
        
        {/* Copyright */}
        <p className="mt-6 text-xs text-cream/30">
          © {new Date().getFullYear()} SEEN. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
