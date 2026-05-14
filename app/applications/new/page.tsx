'use client'

import { useTransition, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/layout'
import { Input, Textarea, Select, Button } from '@/components/form'
import { createApplication } from '@/app/actions/applications'
import { ArrowLeft, Loader2 } from 'lucide-react'

const statusOptions = [
  { value: 'SAVED', label: 'Saved' },
  { value: 'APPLIED', label: 'Applied' },
  { value: 'INTERVIEWING', label: 'Interviewing' },
  { value: 'OFFER', label: 'Offer' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'ARCHIVED', label: 'Archived' },
]

export default function NewApplicationPage() {
  const [error, setError] = useState<string>('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleSubmit(formData: FormData) {
    setError('')
    startTransition(async () => {
      const result = await createApplication(formData)
      if (result?.error) {
        setError(result.error)
      }
    })
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/applications"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 mb-4 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to applications
          </Link>
          <h1 className="text-3xl font-semibold text-foreground">New Application</h1>
          <p className="mt-1 text-muted-foreground">Add a new job application to track</p>
        </div>

        <div className="glass-strong rounded-2xl p-8 shadow-sm">
          <form action={handleSubmit} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <Input
                label="Company Name"
                name="companyName"
                required
                disabled={isPending}
                placeholder="e.g., Acme Corp"
              />
              <Input
                label="Job Title"
                name="jobTitle"
                required
                disabled={isPending}
                placeholder="e.g., Senior Software Engineer"
              />
            </div>

            <Input
              label="Job URL"
              name="jobUrl"
              type="url"
              disabled={isPending}
              placeholder="https://..."
            />

            <Textarea
              label="Job Description"
              name="jobDescription"
              rows={6}
              disabled={isPending}
              placeholder="Paste the job description here..."
            />

            <Select
              label="Status"
              name="status"
              options={statusOptions}
              disabled={isPending}
            />

            {error && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                {isPending ? 'Creating...' : 'Create Application'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.back()}
                disabled={isPending}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
