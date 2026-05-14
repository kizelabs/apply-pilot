import { FileText } from 'lucide-react'
import { formatDate } from '@/lib/format-date'

interface CoverLetterCardProps {
  coverLetter: {
    id: string
    tone: string
    content: string
    createdAt: Date
    updatedAt: Date
  }
}

const toneLabels: Record<string, string> = {
  PROFESSIONAL: 'Professional',
  CONFIDENT: 'Confident',
  FRIENDLY: 'Friendly',
  CONCISE: 'Concise',
  STARTUP: 'Startup',
}

export function CoverLetterCard({ coverLetter }: CoverLetterCardProps) {
  return (
    <div className="glass rounded-2xl p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Cover Letter</h3>
        </div>
        <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
          {toneLabels[coverLetter.tone] || coverLetter.tone}
        </span>
      </div>

      <div className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
        {coverLetter.content}
      </div>

      <div className="pt-4 border-t border-border flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Generated on {formatDate(coverLetter.createdAt)}
        </p>
        {coverLetter.updatedAt > coverLetter.createdAt && (
          <p className="text-xs text-muted-foreground">
            Last edited {formatDate(coverLetter.updatedAt)}
          </p>
        )}
      </div>
    </div>
  )
}
