'use client'

import { useState } from 'react'
import { updateApplicationStatus } from '@/app/actions/applications'
import { Select } from './Select'

interface StatusSelectorProps {
  applicationId: string
  currentStatus: string
}

const statusOptions = [
  { value: 'SAVED', label: 'Saved' },
  { value: 'APPLIED', label: 'Applied' },
  { value: 'INTERVIEWING', label: 'Interviewing' },
  { value: 'OFFER', label: 'Offer' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'ARCHIVED', label: 'Archived' },
]

export function StatusSelector({ applicationId, currentStatus }: StatusSelectorProps) {
  const [loading, setLoading] = useState(false)

  async function handleChange(value: string) {
    setLoading(true)
    await updateApplicationStatus(applicationId, value as 'SAVED' | 'APPLIED' | 'INTERVIEWING' | 'OFFER' | 'REJECTED' | 'ARCHIVED')
    setLoading(false)
  }

  return (
    <Select
      options={statusOptions}
      value={currentStatus}
      onValueChange={handleChange}
      disabled={loading}
    />
  )
}
