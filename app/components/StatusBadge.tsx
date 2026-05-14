import { ApplicationStatus } from '@prisma/client'

interface StatusBadgeProps {
  status: ApplicationStatus
}

const statusConfig = {
  SAVED: { label: 'Saved', className: 'bg-zinc-500/10 text-zinc-500 dark:text-zinc-400' },
  APPLIED: { label: 'Applied', className: 'bg-secondary/10 text-secondary' },
  INTERVIEWING: { label: 'Interviewing', className: 'bg-primary/10 text-primary' },
  OFFER: { label: 'Offer', className: 'bg-green-500/10 text-green-600 dark:text-green-400' },
  REJECTED: { label: 'Rejected', className: 'bg-destructive/10 text-destructive' },
  ARCHIVED: { label: 'Archived', className: 'bg-zinc-500/10 text-zinc-400 dark:text-zinc-500' },
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  )
}
