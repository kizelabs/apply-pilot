import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/app/components/Navbar'
import { StatusBadge } from '@/app/components/StatusBadge'
import { ApplicationFilters } from '@/app/components/ApplicationFilters'
import { Plus, ExternalLink } from 'lucide-react'
import { formatDate } from '@/lib/format-date'

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string }>
}) {
  const { search, status } = await searchParams
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {
    userId: user.id,
  }

  if (search) {
    where.OR = [
      { companyName: { contains: search, mode: 'insensitive' } },
      { jobTitle: { contains: search, mode: 'insensitive' } },
    ]
  }

  if (status) {
    where.status = status
  }

  const applications = await prisma.application.findMany({
    where,
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <div className="min-h-screen">
      <Navbar email={user.email ?? undefined} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-foreground">Applications</h1>
            <p className="mt-1 text-muted-foreground">
              {applications.length} application{applications.length !== 1 ? 's' : ''} tracked
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

        {applications.length === 0 && !search && !status ? (
          <div className="glass rounded-2xl p-12 text-center shadow-sm">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-primary to-accent mb-4 glow-primary">
              <Plus className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No applications yet
            </h3>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              Start tracking your job search by adding your first application
            </p>
            <Link
              href="/applications/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-primary to-accent text-white rounded-xl font-medium hover:opacity-90 transition-all duration-200 shadow-md glow-primary cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Application
            </Link>
          </div>
        ) : (
          <>
            <ApplicationFilters />

            {applications.length === 0 ? (
              <div className="glass rounded-2xl p-12 text-center shadow-sm">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No applications found
                </h3>
                <p className="text-muted-foreground">
                  Try adjusting your filters
                </p>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden md:block glass rounded-2xl shadow-sm overflow-hidden">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Company
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Position
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Applied
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Created
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {applications.map((app) => (
                        <tr
                          key={app.id}
                          className="hover:bg-white/40 dark:hover:bg-white/5 transition-colors duration-150"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Link
                              href={`/applications/${app.id}`}
                              className="text-sm font-medium text-foreground hover:text-primary transition-colors duration-200 cursor-pointer"
                            >
                              {app.companyName}
                            </Link>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-foreground">{app.jobTitle}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <StatusBadge status={app.status} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                            {app.appliedAt ? formatDate(app.appliedAt) : '—'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                            {formatDate(app.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-3">
                  {applications.map((app) => (
                    <Link
                      key={app.id}
                      href={`/applications/${app.id}`}
                      className="block glass rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-medium text-foreground truncate">{app.companyName}</p>
                          <p className="text-sm text-muted-foreground truncate mt-0.5">{app.jobTitle}</p>
                        </div>
                        <StatusBadge status={app.status} />
                      </div>
                      <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                        <span>{formatDate(app.createdAt)}</span>
                        {app.jobUrl && <ExternalLink className="w-3 h-3" />}
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </main>
    </div>
  )
}
