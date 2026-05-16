'use client'

import { useState } from 'react'
import { FileSearch, FileText } from 'lucide-react'
import {
  ResumeAnalyzer,
  ResumeAnalysisCard,
  CoverLetterGenerator,
  CoverLetterCard,
} from '@/features/ai/components'

type Tab = 'resume' | 'cover-letter'

interface ResumeAnalysis {
  id: string
  matchScore: number
  strengths: string[]
  gaps: string[]
  suggestedKeywords: string[]
  bulletSuggestions: string[]
  summary: string
  createdAt: Date
}

interface CoverLetter {
  id: string
  tone: string
  content: string
  createdAt: Date
  updatedAt: Date
}

interface AiTabsProps {
  applicationId: string
  resumeAnalysis: ResumeAnalysis | null
  coverLetter: CoverLetter | null
}

export function AiTabs({ applicationId, resumeAnalysis, coverLetter }: AiTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>('resume')

  const tabs: { id: Tab; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'resume',
      label: 'Resume Analysis',
      icon: <FileSearch className="w-4 h-4" />,
      badge: resumeAnalysis ? `${resumeAnalysis.matchScore}%` : undefined,
    },
    {
      id: 'cover-letter',
      label: 'Cover Letter',
      icon: <FileText className="w-4 h-4" />,
      badge: coverLetter
        ? (coverLetter.tone.charAt(0) + coverLetter.tone.slice(1).toLowerCase())
        : undefined,
    },
  ]

  return (
    <div className="glass rounded-2xl shadow-sm overflow-hidden">
      {/* Tab bar */}
      <div className="flex border-b border-border">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={[
                'relative flex items-center gap-2 px-5 py-4 text-sm font-medium transition-all duration-200 cursor-pointer flex-1 justify-center sm:flex-none sm:justify-start',
                isActive
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/30 dark:hover:bg-white/5',
              ].join(' ')}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
              {tab.badge && (
                <span
                  className={[
                    'px-2 py-0.5 rounded-full text-xs font-semibold transition-colors duration-200',
                    isActive
                      ? tab.id === 'resume'
                        ? 'bg-primary/15 text-primary'
                        : 'bg-purple-500/15 text-purple-600 dark:text-purple-400'
                      : 'bg-muted text-muted-foreground',
                  ].join(' ')}
                >
                  {tab.badge}
                </span>
              )}
              {/* Active indicator */}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
              )}
            </button>
          )
        })}
      </div>

      {/* Tab content */}
      <div className="p-6">
        {activeTab === 'resume' && (
          <>
            {resumeAnalysis ? (
              // Strip outer glass card wrapper since we're already inside one
              <ResumeAnalysisCardInline analysis={resumeAnalysis} />
            ) : (
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Resume Analysis</h3>
                <p className="text-sm text-muted-foreground mb-5">
                  Analyze your resume against this job description to get personalized feedback and
                  suggestions.
                </p>
                <ResumeAnalyzer applicationId={applicationId} />
              </div>
            )}
          </>
        )}

        {activeTab === 'cover-letter' && (
          <>
            {coverLetter ? (
              <CoverLetterCardInline coverLetter={coverLetter} />
            ) : (
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Cover Letter</h3>
                <p className="text-sm text-muted-foreground mb-5">
                  Generate a personalized cover letter tailored to this job description.
                </p>
                <CoverLetterGenerator applicationId={applicationId} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

// ─── Inline variants (no outer glass wrapper) ────────────────────────────────

import { TrendingUp, TrendingDown, Lightbulb, Target } from 'lucide-react'
import { formatDate } from '@/lib/format-date'

function ResumeAnalysisCardInline({ analysis }: { analysis: ResumeAnalysis }) {
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Resume Analysis</h3>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl ${scoreBg}`}>
          <Target className={`w-4 h-4 ${scoreColor}`} />
          <span className={`text-xl font-bold ${scoreColor}`}>{analysis.matchScore}%</span>
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Summary
        </h4>
        <p className="text-sm text-foreground leading-relaxed">{analysis.summary}</p>
      </div>

      {analysis.strengths.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-accent" />
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Strengths
            </h4>
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

      {analysis.gaps.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-4 h-4 text-destructive" />
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Gaps
            </h4>
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

      {analysis.suggestedKeywords.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-secondary" />
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Suggested Keywords
            </h4>
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

      <div className="pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground">Analyzed on {formatDate(analysis.createdAt)}</p>
      </div>
    </div>
  )
}

const toneLabels: Record<string, string> = {
  PROFESSIONAL: 'Professional',
  CONFIDENT: 'Confident',
  FRIENDLY: 'Friendly',
  CONCISE: 'Concise',
  STARTUP: 'Startup',
}

function CoverLetterCardInline({ coverLetter }: { coverLetter: CoverLetter }) {
  return (
    <div className="space-y-4">
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
