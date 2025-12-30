import LegalPageLayout from '@/components/LegalPageLayout';

export const metadata = {
  title: 'Cookie Policy | SEEN',
  description: 'Cookie Policy for SEEN - spoiler: we barely use them.',
};

export default function CookiesPage() {
  return (
    <LegalPageLayout title="Cookie Policy" lastUpdated="December 2024">
      
      {/* On-brand intro */}
      <section className="mb-12 p-6 rounded-2xl" style={{ backgroundColor: 'rgba(194, 84, 65, 0.1)', border: '1px solid rgba(194, 84, 65, 0.3)' }}>
        <h2 className="text-xl font-bold mb-4" style={{ color: '#C25441' }}>The Honest Version</h2>
        <p style={{ color: 'rgba(250, 248, 245, 0.9)' }}>
          We don't use tracking cookies. We don't use analytics that follow you around the internet. We don't sell your data to advertisers. The only cookies we use are the ones that make the site actually work — like keeping you logged in.
        </p>
        <p className="mt-3" style={{ color: 'rgba(250, 248, 245, 0.7)' }}>
          That's genuinely it. The rest of this page is just the formal version for legal completeness.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4" style={{ color: '#FAF8F5' }}>1. What Are Cookies?</h2>
        <p>Cookies are small text files that websites place on your device. They're used for everything from remembering your login to tracking your behavior across the internet.</p>
        <p className="mt-3">Most websites use lots of them. We use very few.</p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4" style={{ color: '#FAF8F5' }}>2. Cookies We Use</h2>
        
        <h3 className="text-xl font-semibold mt-6 mb-3" style={{ color: '#FAF8F5' }}>Essential Cookies Only</h3>
        <p>We only use cookies that are strictly necessary for the site to function:</p>
        
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.2)' }}>
                <th className="text-left py-3 pr-4" style={{ color: '#FAF8F5' }}>Cookie</th>
                <th className="text-left py-3 pr-4" style={{ color: '#FAF8F5' }}>Purpose</th>
                <th className="text-left py-3" style={{ color: '#FAF8F5' }}>Duration</th>
              </tr>
            </thead>
            <tbody style={{ color: 'rgba(250, 248, 245, 0.8)' }}>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <td className="py-3 pr-4 font-mono text-sm">sb-auth-token</td>
                <td className="py-3 pr-4">Keeps you logged in</td>
                <td className="py-3">Session</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <td className="py-3 pr-4 font-mono text-sm">seen-privacy-banner</td>
                <td className="py-3 pr-4">Remembers you've seen our privacy notice</td>
                <td className="py-3">Persistent</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <p className="mt-4 text-sm" style={{ color: 'rgba(250, 248, 245, 0.5)' }}>
          That's the complete list. Really.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4" style={{ color: '#FAF8F5' }}>3. What We Don't Use</h2>
        <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
          <ul>
            <li><strong>❌ Analytics cookies</strong> — No Google Analytics, no tracking pixels</li>
            <li><strong>❌ Advertising cookies</strong> — We don't do targeted ads</li>
            <li><strong>❌ Social media cookies</strong> — No Facebook pixel, no tracking scripts</li>
            <li><strong>❌ Third-party tracking</strong> — We don't let others track you through our site</li>
          </ul>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4" style={{ color: '#FAF8F5' }}>4. Why We Do It This Way</h2>
        <p>SEEN is a mental health awareness tool. The people who use it are often exploring sensitive, personal topics. The last thing they need is to feel watched.</p>
        <p className="mt-3">Most companies track everything because they can monetize the data or "optimize the experience." We'd rather build something you can trust.</p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4" style={{ color: '#FAF8F5' }}>5. Your Browser Settings</h2>
        <p>You can control cookies through your browser settings. Since we only use essential cookies, blocking them might prevent the site from working properly (like staying logged in).</p>
        <p className="mt-3">But you do you. Here's how to manage cookies in common browsers:</p>
        <ul className="mt-3">
          <li><strong>Chrome:</strong> Settings → Privacy and Security → Cookies</li>
          <li><strong>Firefox:</strong> Settings → Privacy & Security → Cookies</li>
          <li><strong>Safari:</strong> Preferences → Privacy → Cookies</li>
          <li><strong>Edge:</strong> Settings → Cookies and site permissions</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4" style={{ color: '#FAF8F5' }}>6. Third-Party Services</h2>
        <p>We use a few services that may set their own essential cookies:</p>
        <ul>
          <li><strong>Supabase:</strong> Authentication and database (essential for login)</li>
          <li><strong>Vercel:</strong> Website hosting (no tracking)</li>
        </ul>
        <p className="mt-3">These services are selected specifically because they respect privacy and don't add tracking.</p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4" style={{ color: '#FAF8F5' }}>7. Updates</h2>
        <p>If we ever change our cookie practices, we'll update this page. But honestly, we're pretty committed to keeping things minimal.</p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4" style={{ color: '#FAF8F5' }}>8. Questions?</h2>
        <p>
          Email: <a href="mailto:privacy@seeyourself.today">privacy@seeyourself.today</a>
        </p>
      </section>

    </LegalPageLayout>
  );
}
