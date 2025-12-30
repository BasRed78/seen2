import LegalPageLayout from '@/components/LegalPageLayout';

export const metadata = {
  title: 'Privacy Policy | SEEN',
  description: 'Privacy Policy for SEEN - how we handle your data.',
};

export default function PrivacyPage() {
  return (
    <LegalPageLayout title="Privacy Policy" lastUpdated="December 2024">
      
      {/* Human-readable summary */}
      <section className="mb-12 p-6 rounded-2xl" style={{ backgroundColor: 'rgba(194, 84, 65, 0.1)', border: '1px solid rgba(194, 84, 65, 0.3)' }}>
        <h2 className="text-xl font-bold mb-4" style={{ color: '#C25441' }}>The Short Version</h2>
        <p style={{ color: 'rgba(250, 248, 245, 0.9)' }}>
          We don't sell your data. We don't track you around the internet. We use the minimum data necessary to provide the service. You can use SEEN anonymously, and you can delete your data anytime. That's it.
        </p>
        <p className="mt-3 text-sm" style={{ color: 'rgba(250, 248, 245, 0.5)' }}>
          Below is the full legal version for those who want the details.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4" style={{ color: '#FAF8F5' }}>1. Introduction</h2>
        <p>SEEN ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, store, and protect your personal information when you use our platform and services.</p>
        <p>We understand that mental health is deeply personal. That's why we've designed our service with privacy at its core. You can use SEEN with or without providing personally identifiable information.</p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4" style={{ color: '#FAF8F5' }}>2. Data Controller</h2>
        <p>SEEN is the data controller responsible for your personal data. We are based in the Netherlands and comply with the General Data Protection Regulation (GDPR) and other applicable data protection laws.</p>
        <p className="mt-3">
          <strong>Contact:</strong><br />
          Email: <a href="mailto:privacy@seeyourself.today">privacy@seeyourself.today</a><br />
          Address: Amsterdam, Netherlands
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4" style={{ color: '#FAF8F5' }}>3. Information We Collect</h2>
        
        <h3 className="text-xl font-semibold mt-6 mb-3" style={{ color: '#FAF8F5' }}>3.1 Information You Provide</h3>
        <ul>
          <li><strong>Assessment Responses:</strong> Your answers to pattern assessment questions</li>
          <li><strong>Check-in Data:</strong> Your responses during daily AI check-ins</li>
          <li><strong>Account Information:</strong> Email address (if you choose to create an account)</li>
          <li><strong>Payment Information:</strong> Processed securely by our payment provider (we do not store card details)</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3" style={{ color: '#FAF8F5' }}>3.2 Information Collected Automatically</h3>
        <ul>
          <li><strong>Usage Data:</strong> How you interact with the Service (pages visited, features used)</li>
          <li><strong>Device Information:</strong> Device type, operating system, browser type</li>
          <li><strong>Log Data:</strong> IP address (anonymized), access times, error logs</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3" style={{ color: '#FAF8F5' }}>3.3 Anonymous Use</h3>
        <p>You may use certain features of SEEN without providing any personal information. The pattern assessment can be completed anonymously. However, to access personalized features like daily check-ins and progress tracking, you will need to create an account.</p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4" style={{ color: '#FAF8F5' }}>4. How We Use Your Information</h2>
        <p>We use your information for the following purposes:</p>
        <ul>
          <li><strong>Service Delivery:</strong> To provide personalized check-ins and generate insights</li>
          <li><strong>Pattern Analysis:</strong> To identify patterns in your responses and provide relevant feedback</li>
          <li><strong>Service Improvement:</strong> To improve our algorithms and user experience</li>
          <li><strong>Communication:</strong> To send service-related notifications and, with your consent, educational content</li>
          <li><strong>Legal Compliance:</strong> To comply with legal obligations</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4" style={{ color: '#FAF8F5' }}>5. Legal Basis for Processing (GDPR)</h2>
        <p>Under GDPR, we process your personal data based on the following legal grounds:</p>
        <ul>
          <li><strong>Consent:</strong> For processing sensitive personal data (health-related data) and sending marketing communications</li>
          <li><strong>Contract:</strong> To provide the services you've subscribed to</li>
          <li><strong>Legitimate Interest:</strong> To improve our services and ensure security</li>
          <li><strong>Legal Obligation:</strong> When required by law</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4" style={{ color: '#FAF8F5' }}>6. Special Category Data</h2>
        <p>Some information you share with SEEN may constitute special category data under GDPR (health-related data). We process this data only with your explicit consent, which you provide when you agree to these terms and use the Service. You may withdraw consent at any time.</p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4" style={{ color: '#FAF8F5' }}>7. Data Sharing and Disclosure</h2>
        <div className="p-4 rounded-xl mb-4" style={{ backgroundColor: 'rgba(194, 84, 65, 0.1)' }}>
          <p className="font-bold" style={{ color: '#C25441' }}>We do not sell your personal data.</p>
        </div>
        <p>We may share data with:</p>
        <ul>
          <li><strong>Service Providers:</strong> Trusted third parties who assist us (hosting, payment processing, analytics) under strict data protection agreements</li>
          <li><strong>AI Service Providers:</strong> Our AI processing partner (Anthropic) processes conversation data to provide the check-in service. Data is processed in accordance with their privacy policy and our data processing agreement</li>
          <li><strong>Legal Requirements:</strong> When required by law, court order, or to protect our legal rights</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4" style={{ color: '#FAF8F5' }}>8. Data Retention</h2>
        <ul>
          <li><strong>Active Accounts:</strong> We retain your data while your account is active</li>
          <li><strong>Inactive Accounts:</strong> Data is retained for 24 months after last activity, then deleted</li>
          <li><strong>Deleted Accounts:</strong> Upon account deletion request, we delete your personal data within 30 days, except where retention is required by law</li>
          <li><strong>Anonymous Data:</strong> Aggregated, anonymized data may be retained indefinitely for research and service improvement</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4" style={{ color: '#FAF8F5' }}>9. Your Rights (GDPR)</h2>
        <p>Under GDPR, you have the following rights:</p>
        <ul>
          <li><strong>Access:</strong> Request a copy of your personal data</li>
          <li><strong>Rectification:</strong> Request correction of inaccurate data</li>
          <li><strong>Erasure:</strong> Request deletion of your data ("right to be forgotten")</li>
          <li><strong>Restriction:</strong> Request limitation of processing</li>
          <li><strong>Data Portability:</strong> Receive your data in a structured, machine-readable format</li>
          <li><strong>Objection:</strong> Object to processing based on legitimate interests</li>
          <li><strong>Withdraw Consent:</strong> Withdraw consent at any time</li>
        </ul>
        <p className="mt-4">To exercise any of these rights, contact us at <a href="mailto:privacy@seeyourself.today">privacy@seeyourself.today</a>. We will respond within 30 days.</p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4" style={{ color: '#FAF8F5' }}>10. Data Security</h2>
        <p>We implement appropriate technical and organizational measures to protect your data, including:</p>
        <ul>
          <li>Encryption of data in transit (TLS/SSL) and at rest</li>
          <li>Secure, access-controlled cloud infrastructure</li>
          <li>Regular security assessments and updates</li>
          <li>Employee training on data protection</li>
          <li>Incident response procedures</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4" style={{ color: '#FAF8F5' }}>11. International Data Transfers</h2>
        <p>Your data may be transferred to and processed in countries outside the European Economic Area (EEA). When this occurs, we ensure appropriate safeguards are in place, such as Standard Contractual Clauses approved by the European Commission, or transfers to countries with adequate data protection laws.</p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4" style={{ color: '#FAF8F5' }}>12. Cookies and Tracking</h2>
        <p>We use minimal cookies for essential functionality only:</p>
        <ul>
          <li><strong>Essential Cookies:</strong> Required for the Service to function (authentication, security)</li>
          <li><strong>Functional Cookies:</strong> To remember your preferences</li>
        </ul>
        <p className="mt-4">We do not use tracking cookies or analytics that follow you around the internet. See our <a href="/cookies">Cookie Policy</a> for details.</p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4" style={{ color: '#FAF8F5' }}>13. Children's Privacy</h2>
        <p>SEEN is not intended for use by individuals under 18 years of age. We do not knowingly collect personal information from children. If we become aware that we have collected data from a child under 18, we will delete it promptly.</p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4" style={{ color: '#FAF8F5' }}>14. Changes to This Policy</h2>
        <p>We may update this Privacy Policy from time to time. We will notify you of material changes by posting the updated policy on our website, updating the "Last Updated" date, and where appropriate, notifying you by email. Your continued use of the Service after changes constitutes acceptance of the updated policy.</p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4" style={{ color: '#FAF8F5' }}>15. Complaints</h2>
        <p>If you have concerns about how we handle your personal data, please contact us first at <a href="mailto:privacy@seeyourself.today">privacy@seeyourself.today</a>. You also have the right to lodge a complaint with your local data protection authority. In the Netherlands, this is the Autoriteit Persoonsgegevens (Dutch Data Protection Authority).</p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4" style={{ color: '#FAF8F5' }}>16. Contact Us</h2>
        <p>For any questions about this Privacy Policy or your personal data, please contact:</p>
        <p className="mt-3">
          <strong>SEEN</strong><br />
          Email: <a href="mailto:privacy@seeyourself.today">privacy@seeyourself.today</a><br />
          Website: <a href="https://seeyourself.today">www.seeyourself.today</a><br />
          Address: Amsterdam, Netherlands
        </p>
      </section>

    </LegalPageLayout>
  );
}
