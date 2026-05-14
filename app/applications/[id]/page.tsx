import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/layout'
import { StatusSelector } from '@/features/applications/components'
import { ResumeAnalyzer, ResumeAnalysisCard, CoverLetterGenerator, CoverLetterCard } from '@/features/ai/components'
import { deleteApplication } from '@/app/actions/applications'
import {
  ArrowLeft,
  Pencil,
  Trash2,
  ExternalLink,
  Calendar,
  Clock,
} from 'lucide-react'
import { formatDate } from '@/lib/format-date'

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const application = await (prisma.application.findUnique as any)({
    where: {
      id,
      userId: user.id,
    },
    include: {
      resumeAnalysis: {
        orderBy: {
          createdAt: 'desc',
        },
        take: 1,
      },
      coverLetters: {
        orderBy: {
          createdAt: 'desc',
        },
        take: 1,
      },
    },
  }) as {
    id: string
    userId: string
    companyName: string
    jobTitle: string
    jobDescription: string | null
    jobUrl: string | null
    status: string
    appliedAt: Date | null
    notes: string | null
    createdAt: Date
    updatedAt: Date
    resumeAnalysis: {
      id: string
      matchScore: number
      strengths: string[]
      gaps: string[]
      suggestedKeywords: string[]
      bulletSuggestions: string[]
      summary: string
      createdAt: Date
    }[]
    coverLetters: {
      id: string
      tone: string
      content: string
      createdAt: Date
      updatedAt: Date
    }[]
  } | null

  if (!application) {
    notFound()
  }

  async function handleDelete() {
    'use server'
    await deleteApplication(id)
  }

  return (
    <div className="min-h-screen">
      <Navbar email={user.email ?? undefined} />

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          href="/applications"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to applications
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-foreground">{application.companyName}</h1>
            <p className="mt-1 text-xl text-muted-foreground">{application.jobTitle}</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Link href={`/applications/${id}/edit`}>
              <button className="inline-flex items-center gap-2 px-3 py-2 rounded-xl glass border border-border text-sm font-medium text-foreground hover:bg-white/60 dark:hover:bg-white/10 transition-all duration-200 cursor-pointer">
                <Pencil className="w-4 h-4" />
                Edit
              </button>
            </Link>
            <form action={handleDelete}>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl glass border border-destructive/30 text-sm font-medium text-destructive hover:bg-destructive/10 transition-all duration-200 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          {/* Meta info card */}
          <div className="glass rounded-2xl p-6 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Status</h3>
                <StatusSelector applicationId={application.id} currentStatus={application.status} />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Applied Date</h3>
                <div className="flex items-center gap-2 text-foreground">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">
                    {application.appliedAt
                      ? formatDate(application.appliedAt)
                      : 'Not applied yet'}
                  </span>
                </div>
              </div>
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Created</h3>
                <div className="flex items-center gap-2 text-foreground">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{formatDate(application.createdAt)}</span>
                </div>
              </div>
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Last Updated</h3>
                <div className="flex items-center gap-2 text-foreground">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{formatDate(application.updatedAt)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Job URL */}
          {application.jobUrl && (
            <div className="glass rounded-2xl p-6 shadow-sm">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Job URL</h3>
              <a
                href={application.jobUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors duration-200 break-all cursor-pointer"
              >
                {application.jobUrl}
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              </a>
            </div>
          )}

          {/* Job Description */}
          {application.jobDescription && (
            <div className="glass rounded-2xl p-6 shadow-sm">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Job Description</h3>
              <div className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                {application.jobDescription}
              </div>
            </div>
          )}

          {/* Notes */}
          {application.notes && (
            <div className="glass rounded-2xl p-6 shadow-sm">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Notes</h3>
              <div className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                {application.notes}
              </div>
            </div>
          )}

          {/* Resume Analysis */}
          {application.resumeAnalysis[0] ? (
            <ResumeAnalysisCard analysis={application.resumeAnalysis[0]} />
          ) : (
            <div className="glass rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-foreground mb-2">Resume Analysis</h3>
              <p className="text-sm text-muted-foreground mb-5">
                Analyze your resume against this job description to get personalized feedback and suggestions.
              </p>
              <ResumeAnalyzer applicationId={application.id} />
            </div>
          )}

          {/* Cover Letter */}
          {application.coverLetters[0] ? (
            <CoverLetterCard coverLetter={application.coverLetters[0]} />
          ) : (
            <div className="glass rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-foreground mb-2">Cover Letter</h3>
              <p className="text-sm text-muted-foreground mb-5">
                Generate a personalized cover letter tailored to this job description.
              </p>
              <CoverLetterGenerator applicationId={application.id} />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
