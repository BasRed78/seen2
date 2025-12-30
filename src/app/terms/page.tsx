import LegalPageLayout from '@/components/LegalPageLayout';

export const metadata = {
  title: 'Terms of Service | SEEN',
  description: 'Terms of Service for SEEN - a self-reflection and awareness tool.',
};

export default function TermsPage() {
  return (
    <LegalPageLayout title="Terms of Service" lastUpdated="December 2024">
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4" style={{ color: '#FAF8F5' }}>1. Introduction and Acceptance</h2>
        <p>Welcome to SEEN ("we," "us," or "our"). These Terms of Service ("Terms") govern your access to and use of the SEEN platform, including our website, mobile applications, and related services (collectively, the "Service").</p>
        <p>By accessing or using the Service, you agree to be bound by these Terms. If you do not agree to these Terms, you may not access or use the Service.</p>
        <div className="p-4 rounded-xl my-6" style={{ backgroundColor: 'rgba(194, 84, 65, 0.15)', borderLeft: '4px solid #C25441' }}>
          <p className="font-semibold" style={{ color: '#C25441' }}>
            IMPORTANT: Please read Section 2 (Nature of Service) and Section 8 (Limitation of Liability) carefully. They contain critical information about the limitations of our Service and your legal rights.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4" style={{ color: '#FAF8F5' }}>2. Nature of Service – Critical Disclaimers</h2>
        
        <h3 className="text-xl font-semibold mt-6 mb-3" style={{ color: '#FAF8F5' }}>2.1 SEEN Is Not Healthcare</h3>
        <div className="p-4 rounded-xl mb-4" style={{ backgroundColor: 'rgba(194, 84, 65, 0.1)' }}>
          <p className="font-bold mb-3" style={{ color: '#FAF8F5' }}>
            SEEN IS NOT A MEDICAL SERVICE, MENTAL HEALTH PROVIDER, OR HEALTHCARE FACILITY.
          </p>
          <p>The Service is designed solely as a self-reflection and awareness tool. We do not provide:</p>
          <ul className="mt-3">
            <li>Medical advice, diagnosis, or treatment</li>
            <li>Psychological or psychiatric assessment</li>
            <li>Therapy, counseling, or clinical intervention</li>
            <li>Crisis intervention or emergency services</li>
            <li>Professional recommendations about your mental health</li>
          </ul>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3" style={{ color: '#FAF8F5' }}>2.2 Educational Purpose Only</h3>
        <p>The pattern assessments, daily check-ins, insights, and all other content provided through the Service are for educational and self-reflection purposes only. Any "pattern" identification is not a clinical diagnosis and should not be treated as such.</p>

        <h3 className="text-xl font-semibold mt-6 mb-3" style={{ color: '#FAF8F5' }}>2.3 Not a Substitute for Professional Help</h3>
        <p className="font-semibold">THE SERVICE IS NOT A SUBSTITUTE FOR PROFESSIONAL MENTAL HEALTH TREATMENT. If you are experiencing mental health concerns, you should consult with qualified healthcare professionals. Our Service is designed to complement, not replace, professional care.</p>

        <h3 className="text-xl font-semibold mt-6 mb-3" style={{ color: '#FAF8F5' }}>2.4 Crisis Situations</h3>
        <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(194, 84, 65, 0.2)', border: '1px solid #C25441' }}>
          <p className="font-bold mb-3" style={{ color: '#C25441' }}>
            IF YOU ARE IN CRISIS, EXPERIENCING SUICIDAL THOUGHTS, OR ARE IN IMMEDIATE DANGER, PLEASE STOP USING THIS SERVICE IMMEDIATELY AND CONTACT EMERGENCY SERVICES OR A CRISIS HELPLINE.
          </p>
          <p className="font-semibold mb-2">In the Netherlands:</p>
          <ul>
            <li><strong>Emergency Services:</strong> 112</li>
            <li><strong>113 Zelfmoordpreventie:</strong> 0900-0113 (24/7)</li>
            <li><strong>De Luisterlijn:</strong> 088-0767000 (24/7)</li>
          </ul>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4" style={{ color: '#FAF8F5' }}>3. Eligibility and Account</h2>
        <p>To use the Service, you must:</p>
        <ul>
          <li>Be at least 18 years old</li>
          <li>Not be in an active mental health crisis</li>
          <li>Acknowledge that you understand the limitations of the Service as described in Section 2</li>
          <li>Agree to use the Service only for personal, non-commercial self-reflection purposes</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4" style={{ color: '#FAF8F5' }}>4. User Responsibilities</h2>
        <p>By using the Service, you agree to:</p>
        <ul>
          <li>Provide accurate information during assessments and check-ins</li>
          <li>Seek professional help if you experience worsening mental health symptoms</li>
          <li>Not use the Service as a substitute for professional treatment</li>
          <li>Not share your account access with others</li>
          <li>Not attempt to reverse-engineer, copy, or reproduce the Service</li>
          <li>Not scrape, crawl, or automatically extract content from the Service</li>
          <li>Comply with all applicable laws and regulations</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4" style={{ color: '#FAF8F5' }}>5. Intellectual Property</h2>
        
        <h3 className="text-xl font-semibold mt-6 mb-3" style={{ color: '#FAF8F5' }}>5.1 Our Intellectual Property</h3>
        <p>The Service, including all content, features, functionality, design elements, pattern frameworks, assessment methodologies, AI systems, algorithms, software, text, graphics, logos, and trademarks, is owned by SEEN and is protected by copyright, trademark, and other intellectual property laws.</p>

        <h3 className="text-xl font-semibold mt-6 mb-3" style={{ color: '#FAF8F5' }}>5.2 Restrictions</h3>
        <p>You may not, without our prior written permission:</p>
        <ul>
          <li>Copy, reproduce, or distribute any part of the Service</li>
          <li>Modify, adapt, or create derivative works based on the Service</li>
          <li>Reverse-engineer, decompile, or attempt to extract the source code</li>
          <li>Use automated systems to access or interact with the Service</li>
          <li>Use the SEEN name, logo, or trademarks without authorization</li>
          <li>Remove or alter any copyright, trademark, or proprietary notices</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3" style={{ color: '#FAF8F5' }}>5.3 Your Content</h3>
        <p>You retain ownership of any content you submit through the Service (such as check-in responses). By submitting content, you grant us a limited license to use that content solely to provide and improve the Service for you.</p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4" style={{ color: '#FAF8F5' }}>6. Payment and Subscriptions</h2>
        <p>Some features of the Service require a paid subscription. By subscribing:</p>
        <ul>
          <li>You agree to pay all fees associated with your chosen plan</li>
          <li>Subscriptions renew automatically unless cancelled before the renewal date</li>
          <li>You may cancel your subscription at any time through your account settings</li>
          <li>Refunds are available within 14 days of initial purchase, in accordance with EU consumer protection law</li>
          <li>We will not charge hidden fees or use deceptive billing practices</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4" style={{ color: '#FAF8F5' }}>7. Termination</h2>
        <p>You may stop using the Service at any time. We may suspend or terminate your access if you violate these Terms or if we determine, in our sole discretion, that continued use poses a risk to your wellbeing or safety. Upon termination, you may request deletion of your data in accordance with our Privacy Policy.</p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4" style={{ color: '#FAF8F5' }}>8. Limitation of Liability</h2>
        
        <h3 className="text-xl font-semibold mt-6 mb-3" style={{ color: '#FAF8F5' }}>8.1 Disclaimer of Warranties</h3>
        <p className="font-semibold">THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.</p>

        <h3 className="text-xl font-semibold mt-6 mb-3" style={{ color: '#FAF8F5' }}>8.2 Limitation of Liability</h3>
        <p className="font-semibold">TO THE MAXIMUM EXTENT PERMITTED BY LAW, SEEN AND ITS OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.</p>

        <h3 className="text-xl font-semibold mt-6 mb-3" style={{ color: '#FAF8F5' }}>8.3 Mental Health Specific Disclaimer</h3>
        <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(194, 84, 65, 0.1)' }}>
          <p className="font-semibold mb-3">YOU EXPRESSLY ACKNOWLEDGE AND AGREE THAT:</p>
          <ul>
            <li><strong>SEEN does not provide medical, psychological, or therapeutic services</strong></li>
            <li><strong>Any actions you take based on using the Service are entirely at your own risk</strong></li>
            <li><strong>We are not responsible for any decisions you make or actions you take while using or after using the Service</strong></li>
            <li><strong>We are not liable for any harm, injury, or adverse outcomes that may result from your use of the Service</strong></li>
            <li><strong>You assume full responsibility for seeking appropriate professional help when needed</strong></li>
          </ul>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3" style={{ color: '#FAF8F5' }}>8.4 Maximum Liability</h3>
        <p>In no event shall our total liability to you for all claims exceed the amount you have paid us in the twelve (12) months preceding the claim, or €100, whichever is greater.</p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4" style={{ color: '#FAF8F5' }}>9. Indemnification</h2>
        <p>You agree to indemnify, defend, and hold harmless SEEN and its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses arising out of or in any way connected with your use of the Service, your violation of these Terms, or your violation of any rights of another person or entity.</p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4" style={{ color: '#FAF8F5' }}>10. Privacy</h2>
        <p>Your privacy is important to us. Our collection and use of personal information is governed by our <a href="/privacy">Privacy Policy</a>, which is incorporated into these Terms by reference. Please review our Privacy Policy to understand our practices.</p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4" style={{ color: '#FAF8F5' }}>11. Modifications to Terms</h2>
        <p>We may modify these Terms at any time. We will notify you of material changes by posting the updated Terms on our website and updating the "Last Updated" date. Your continued use of the Service after such modifications constitutes your acceptance of the updated Terms.</p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4" style={{ color: '#FAF8F5' }}>12. Governing Law and Disputes</h2>
        <p>These Terms shall be governed by and construed in accordance with the laws of the Netherlands. Any disputes arising from or relating to these Terms or the Service shall be subject to the exclusive jurisdiction of the courts of Amsterdam, Netherlands, without regard to conflict of law principles.</p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4" style={{ color: '#FAF8F5' }}>13. Severability</h2>
        <p>If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect.</p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4" style={{ color: '#FAF8F5' }}>14. Contact Information</h2>
        <p>If you have questions about these Terms, please contact us at:</p>
        <p className="mt-2">
          <strong>SEEN</strong><br />
          Email: <a href="mailto:legal@seeyourself.today">legal@seeyourself.today</a><br />
          Website: <a href="https://seeyourself.today">www.seeyourself.today</a>
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4" style={{ color: '#FAF8F5' }}>15. Acknowledgment</h2>
        <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
          <p className="font-semibold">
            BY USING THE SERVICE, YOU ACKNOWLEDGE THAT YOU HAVE READ THESE TERMS OF SERVICE, UNDERSTAND THEM, AND AGREE TO BE BOUND BY THEM. YOU FURTHER ACKNOWLEDGE THAT THESE TERMS CONSTITUTE THE COMPLETE AND EXCLUSIVE AGREEMENT BETWEEN YOU AND SEEN REGARDING THE SERVICE.
          </p>
        </div>
      </section>

    </LegalPageLayout>
  );
}
