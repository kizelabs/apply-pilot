import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/layout'
import { formatDate } from '@/lib/format-date'
import {
  Briefcase,
  Send,
  MessageSquare,
  Trophy,
  XCircle,
  Plus,
  ArrowRight,
} from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const [total, active, interviewing, offers, rejected, recentApplications] = await Promise.all([
    prisma.application.count({ where: { userId: user.id } }),
    prisma.application.count({
      where: { userId: user.id, status: { in: ['SAVED', 'APPLIED'] } },
    }),
    prisma.application.count({ where: { userId: user.id, status: 'INTERVIEWING' } }),
    prisma.application.count({ where: { userId: user.id, status: 'OFFER' } }),
    prisma.application.count({ where: { userId: user.id, status: 'REJECTED' } }),
    prisma.application.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
  ])

  const stats = [
    { label: 'Total', value: total, icon: Briefcase, color: 'text-foreground', bg: 'bg-primary/10' },
    { label: 'Active', value: active, icon: Send, color: 'text-secondary', bg: 'bg-secondary/10' },
    { label: 'Interviewing', value: interviewing, icon: MessageSquare, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Offers', value: offers, icon: Trophy, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Rejected', value: rejected, icon: XCircle, color: 'text-muted-foreground', bg: 'bg-muted' },
  ]

  // Funnel data for visualization
  const funnelStages = [
    { label: 'Saved/Applied', count: active, percent: total > 0 ? Math.round((active / total) * 100) : 0, color: 'bg-secondary' },
    { label: 'Interviewing', count: interviewing, percent: total > 0 ? Math.round((interviewing / total) * 100) : 0, color: 'bg-primary' },
    { label: 'Offers', count: offers, percent: total > 0 ? Math.round((offers / total) * 100) : 0, color: 'bg-green-500' },
  ]

  return (
    <div className="min-h-screen">
      <Navbar email={user.email ?? undefined} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-foreground">Dashboard</h1>
            <p className="mt-1 text-muted-foreground">
              Your job search at a glance
            </p>
          </div>
          <Link
            href="/applications/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-linear-to-r from-primary to-accent text-white rounded-xl font-medium hover:opacity-90 transition-all duration-200 shadow-md glow-primary cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            New Application
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="glass rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-xl ${stat.bg}`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
              <p className="text-3xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Pipeline Funnel */}
          <div className="glass rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground mb-6">Application Pipeline</h2>
            {total === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No applications yet</p>
                <Link
                  href="/applications/new"
                  className="inline-flex items-center gap-1 mt-2 text-sm text-primary hover:text-primary/80 transition-colors duration-200 cursor-pointer"
                >
                  Add your first application <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {funnelStages.map((stage) => (
                  <div key={stage.label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-foreground">{stage.label}</span>
                      <span className="text-sm text-muted-foreground">
                        {stage.count} ({stage.percent}%)
                      </span>
                    </div>
                    <div className="h-3 rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full ${stage.color} transition-all duration-500`}
                        style={{ width: `${Math.max(stage.percent, 2)}%` }}
                      />
                    </div>
                  </div>
                ))}
                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Conversion rate</span>
                    <span className="font-medium text-foreground">
                      {total > 0 ? Math.round((offers / total) * 100) : 0}% to offer
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="glass rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
              <Link
                href="/applications"
                className="text-sm text-primary hover:text-primary/80 transition-colors duration-200 cursor-pointer"
              >
                View all
              </Link>
            </div>
            {recentApplications.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No recent activity</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentApplications.map((app) => (
                  <Link
                    key={app.id}
                    href={`/applications/${app.id}`}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-white/50 dark:hover:bg-white/5 transition-colors duration-200 cursor-pointer group"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors duration-200">
                        {app.companyName}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {app.jobTitle}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-3 shrink-0">
                      <StatusDot status={app.status} />
                      <span className="text-xs text-muted-foreground">
                        {formatDate(app.createdAt)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    SAVED: 'bg-zinc-400',
    APPLIED: 'bg-secondary',
    INTERVIEWING: 'bg-primary',
    OFFER: 'bg-green-500',
    REJECTED: 'bg-destructive',
    ARCHIVED: 'bg-zinc-300',
  }

  return (
    <span className={`w-2 h-2 rounded-full ${colors[status] || 'bg-zinc-400'}`} />
  )
}
