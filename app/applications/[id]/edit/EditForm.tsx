'use client'

import { useTransition, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/app/components/Input'
import { Textarea } from '@/app/components/Textarea'
import { Select } from '@/app/components/Select'
import { Button } from '@/app/components/Button'
import { updateApplication } from '@/app/actions/applications'
import { Loader2 } from 'lucide-react'

interface EditFormProps {
  application: {
    id: string
    companyName: string
    jobTitle: string
    jobUrl: string | null
    jobDescription: string | null
    status: string
  }
}

const statusOptions = [
  { value: 'SAVED', label: 'Saved' },
  { value: 'APPLIED', label: 'Applied' },
  { value: 'INTERVIEWING', label: 'Interviewing' },
  { value: 'OFFER', label: 'Offer' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'ARCHIVED', label: 'Archived' },
]

export function EditForm({ application }: EditFormProps) {
  const [error, setError] = useState<string>('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleSubmit(formData: FormData) {
    setError('')
    startTransition(async () => {
      const result = await updateApplication(application.id, formData)
      if (result?.error) {
        setError(result.error)
      }
    })
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <Input
          label="Company Name"
          name="companyName"
          required
          disabled={isPending}
          defaultValue={application.companyName}
        />
        <Input
          label="Job Title"
          name="jobTitle"
          required
          disabled={isPending}
          defaultValue={application.jobTitle}
        />
      </div>

      <Input
        label="Job URL"
        name="jobUrl"
        type="url"
        disabled={isPending}
        defaultValue={application.jobUrl || ''}
        placeholder="https://..."
      />

      <Textarea
        label="Job Description"
        name="jobDescription"
        rows={6}
        disabled={isPending}
        defaultValue={application.jobDescription || ''}
        placeholder="Paste the job description here..."
      />

      <Select
        label="Status"
        name="status"
        options={statusOptions}
        disabled={isPending}
        value={application.status}
      />

      {error && (
        <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
          {isPending ? 'Saving...' : 'Save Changes'}
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
  )
}
