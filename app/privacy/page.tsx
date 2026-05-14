import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Privacy Policy — Apply Pilot',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 mb-8 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        <h1 className="text-3xl font-bold text-foreground mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">Last updated: May 14, 2025</p>

        <div className="glass-strong rounded-2xl p-8 shadow-sm space-y-8 text-sm text-foreground leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold mb-3">1. Information We Collect</h2>
            <p className="mb-3">We collect information you provide directly:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground mb-3">
              <li><strong className="text-foreground">Account information:</strong> Email address and password (or Google OAuth profile)</li>
              <li><strong className="text-foreground">Application data:</strong> Company names, job titles, descriptions, URLs, and notes you enter</li>
              <li><strong className="text-foreground">Resume content:</strong> Text you paste for AI analysis (not stored permanently after processing)</li>
              <li><strong className="text-foreground">Generated content:</strong> Cover letters and analysis results</li>
            </ul>
            <p>We automatically collect basic usage data (page views, feature usage) to improve the Service. We do not use third-party tracking or advertising cookies.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">2. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>To provide and maintain the Service</li>
              <li>To process your resume analyses and generate cover letters</li>
              <li>To authenticate your identity and secure your account</li>
              <li>To send important service notifications (not marketing)</li>
              <li>To improve the Service based on aggregate usage patterns</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">3. AI Processing</h2>
            <p>
              When you use our AI features (resume analysis, cover letter generation), your content is sent to our AI provider for processing. We do not use your data to train AI models. AI-generated outputs are stored in your account for your convenience and can be deleted at any time.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">4. Data Storage & Security</h2>
            <p className="mb-2">Your data is stored securely using:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>PostgreSQL database hosted on Supabase (encrypted at rest)</li>
              <li>Authentication managed by Supabase Auth (industry-standard security)</li>
              <li>All data transmitted over HTTPS/TLS</li>
              <li>Connection pooling via Prisma Accelerate (no direct database exposure)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">5. Data Sharing</h2>
            <p className="mb-2">We do not sell your data. We share data only with:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li><strong className="text-foreground">Supabase:</strong> Authentication and database hosting</li>
              <li><strong className="text-foreground">AI Provider:</strong> Processing resume analyses and cover letter generation</li>
              <li><strong className="text-foreground">Vercel:</strong> Application hosting</li>
            </ul>
            <p className="mt-2">We may disclose data if required by law or to protect our rights.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">6. Your Rights</h2>
            <p className="mb-2">You have the right to:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Access all data associated with your account</li>
              <li>Correct inaccurate information</li>
              <li>Delete your account and all associated data</li>
              <li>Export your data in a portable format</li>
              <li>Withdraw consent for data processing</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">7. Data Retention</h2>
            <p>
              We retain your data for as long as your account is active. When you delete your account, all associated data (applications, analyses, cover letters) is permanently deleted within 30 days. Backups are purged within 90 days.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">8. Cookies</h2>
            <p>
              We use essential cookies only for authentication session management. We do not use advertising, analytics, or third-party tracking cookies.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">9. Children&apos;s Privacy</h2>
            <p>
              The Service is not intended for users under 16 years of age. We do not knowingly collect data from children.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">10. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of significant changes via email. Continued use of the Service after changes constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">11. Contact</h2>
            <p>
              For privacy-related questions or to exercise your rights, contact us at{' '}
              <a href="mailto:admin@kizelabs.my.id" className="text-primary hover:text-primary/80 transition-colors duration-200">
                admin@kizelabs.my.id
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
