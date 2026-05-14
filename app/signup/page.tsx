'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Input } from '@/app/components/Input'
import { Button } from '@/app/components/Button'
import { GoogleAuthButton } from '@/app/components/GoogleAuthButton'
import { signup } from '@/app/actions/auth'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState(false)

  async function handleGoogleSignIn() {
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError('')
    const result = await signup(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent mb-4 glow-primary">
            <svg
              className="w-7 h-7 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <h1 className="text-3xl font-semibold text-foreground">Create your account</h1>
          <p className="mt-2 text-muted-foreground">Start tracking your job applications</p>
        </div>

        {/* Card */}
        <div className="glass-strong rounded-2xl p-8 shadow-xl">
          <form action={handleSubmit} className="space-y-5">
            <Input
              label="Email"
              type="email"
              name="email"
              required
              autoComplete="email"
              disabled={loading}
              placeholder="you@example.com"
            />
            <Input
              label="Password"
              type="password"
              name="password"
              required
              autoComplete="new-password"
              disabled={loading}
              placeholder="••••••••"
            />

            {error && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating account...' : 'Sign up'}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-transparent text-muted-foreground backdrop-blur-sm">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6">
              <GoogleAuthButton onClick={handleGoogleSignIn} disabled={loading} />
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-primary hover:text-primary/80 transition-colors duration-200">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
