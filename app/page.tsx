import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import {
  Briefcase,
  FileText,
  Sparkles,
  BarChart3,
  Shield,
  Zap,
} from 'lucide-react'
import appIcon from './icon.png'

export default async function LandingPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="sticky top-4 mx-4 z-50 rounded-2xl glass-strong shadow-lg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Image
                src={appIcon}
                alt="Apply Pilot"
                width={32}
                height={32}
                className="w-8 h-8 rounded-lg"
              />
              <span className="font-semibold text-foreground text-lg">Apply Pilot</span>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 bg-linear-to-r from-primary to-accent text-white text-sm font-medium rounded-xl hover:opacity-90 transition-all duration-200 shadow-md glow-primary cursor-pointer"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 pt-24 pb-16 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
          Track Applications.
          <br />
          <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
            Land Your Dream Job.
          </span>
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          AI-powered job application tracker. Manage your pipeline, analyze resumes against job descriptions, and generate tailored cover letters — all in one place.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/signup"
            className="px-8 py-3.5 bg-linear-to-r from-primary to-accent text-white font-medium rounded-xl hover:opacity-90 transition-all duration-200 shadow-lg glow-primary cursor-pointer text-base"
          >
            Start Tracking Free
          </Link>
          <Link
            href="/login"
            className="px-8 py-3.5 glass border border-border font-medium rounded-xl hover:bg-primary/5 transition-all duration-200 cursor-pointer text-base text-foreground"
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Everything you need to manage your job search
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
            From tracking applications to AI-powered insights, Apply Pilot helps you stay organized and land more interviews.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="glass rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-4`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            How it works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Get started in under a minute
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          {steps.map((step, i) => (
            <div key={step.title} className="text-center">
              <div className="w-12 h-12 rounded-full bg-linear-to-br from-primary to-accent text-white font-bold text-lg flex items-center justify-center mx-auto mb-4">
                {i + 1}
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="glass-strong rounded-3xl p-12 sm:p-16 text-center shadow-lg">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Ready to take control of your job search?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-lg mx-auto">
            Join thousands of job seekers who use Apply Pilot to stay organized and land more offers.
          </p>
          <Link
            href="/signup"
            className="mt-8 inline-block px-8 py-3.5 bg-linear-to-r from-primary to-accent text-white font-medium rounded-xl hover:opacity-90 transition-all duration-200 shadow-lg glow-primary cursor-pointer text-base"
          >
            Get Started — It&apos;s Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border pt-8">
          <div className="flex items-center gap-2">
            <Image
              src={appIcon}
              alt="Apply Pilot"
              width={24}
              height={24}
              className="w-6 h-6 rounded-md"
            />
            <span className="text-sm text-muted-foreground">© 2025 Apply Pilot by KizeLabs</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/terms" className="hover:text-foreground transition-colors duration-200 cursor-pointer">
              Terms of Service
            </Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors duration-200 cursor-pointer">
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

const features = [
  {
    title: 'Application Tracking',
    description: 'Track every application through Saved, Applied, Interviewing, Offer, and Rejected stages with a visual pipeline.',
    icon: Briefcase,
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    title: 'AI Resume Analysis',
    description: 'Get instant match scores, identify strengths and gaps, and receive keyword suggestions tailored to each job.',
    icon: BarChart3,
    color: 'text-secondary',
    bg: 'bg-secondary/10',
  },
  {
    title: 'Cover Letter Generator',
    description: 'Generate personalized cover letters in seconds. Choose from Professional, Confident, Friendly, Concise, or Startup tones.',
    icon: Sparkles,
    color: 'text-accent',
    bg: 'bg-accent/10',
  },
  {
    title: 'Smart Dashboard',
    description: 'See your entire job search at a glance — pipeline funnel, conversion rates, and recent activity in one view.',
    icon: FileText,
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    title: 'Secure & Private',
    description: 'Your data is encrypted and never shared. Authentication powered by Supabase with Google OAuth support.',
    icon: Shield,
    color: 'text-green-500',
    bg: 'bg-green-500/10',
  },
  {
    title: 'Fast & Lightweight',
    description: 'Built on Next.js with edge-optimized database queries. No bloat, no lag — just a fast, focused tool.',
    icon: Zap,
    color: 'text-yellow-500',
    bg: 'bg-yellow-500/10',
  },
]

const steps = [
  {
    title: 'Add Applications',
    description: 'Paste the job URL and description. Apply Pilot organizes everything for you.',
  },
  {
    title: 'Get AI Insights',
    description: 'Analyze your resume against each job. See your match score and get improvement suggestions.',
  },
  {
    title: 'Land Interviews',
    description: 'Generate tailored cover letters, track your progress, and focus on what matters.',
  },
]
