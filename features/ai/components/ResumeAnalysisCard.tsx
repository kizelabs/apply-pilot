import { TrendingUp, TrendingDown, Lightbulb, Target } from 'lucide-react'
import { formatDate } from '@/lib/format-date'

interface ResumeAnalysisCardProps {
  analysis: {
    id: string
    matchScore: number
    strengths: string[]
    gaps: string[]
    suggestedKeywords: string[]
    bulletSuggestions: string[]
    summary: string
    createdAt: Date
  }
}

export function ResumeAnalysisCard({ analysis }: ResumeAnalysisCardProps) {
  const scoreColor =
    analysis.matchScore >= 80
      ? 'text-accent'
      : analysis.matchScore >= 60
        ? 'text-yellow-500'
        : 'text-destructive'

  const scoreBg =
    analysis.matchScore >= 80
      ? 'bg-accent/10'
      : analysis.matchScore >= 60
        ? 'bg-yellow-500/10'
        : 'bg-destructive/10'

  return (
    <div className="glass rounded-2xl p-6 shadow-sm space-y-6">
      {/* Header with score */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Resume Analysis</h3>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl ${scoreBg}`}>
          <Target className={`w-4 h-4 ${scoreColor}`} />
          <span className={`text-xl font-bold ${scoreColor}`}>
            {analysis.matchScore}%
          </span>
        </div>
      </div>

      {/* Summary */}
      <div>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Summary</h4>
        <p className="text-sm text-foreground leading-relaxed">{analysis.summary}</p>
      </div>

      {/* Strengths */}
      {analysis.strengths.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-accent" />
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Strengths</h4>
          </div>
          <ul className="space-y-1.5">
            {analysis.strengths.map((strength, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                {strength}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Gaps */}
      {analysis.gaps.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-4 h-4 text-destructive" />
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Gaps</h4>
          </div>
          <ul className="space-y-1.5">
            {analysis.gaps.map((gap, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-destructive mt-1.5 shrink-0" />
                {gap}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Suggested Keywords */}
      {analysis.suggestedKeywords.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-secondary" />
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Suggested Keywords</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {analysis.suggestedKeywords.map((keyword, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-secondary/10 text-secondary"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Bullet Suggestions */}
      {analysis.bulletSuggestions.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Bullet Point Suggestions
          </h4>
          <ul className="space-y-1.5">
            {analysis.bulletSuggestions.map((suggestion, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Footer */}
      <div className="pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          Analyzed on {formatDate(analysis.createdAt)}
        </p>
      </div>
    </div>
  )
}
