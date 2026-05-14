import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/app/components/Navbar'
import { EditForm } from './EditForm'
import { ArrowLeft } from 'lucide-react'

export default async function EditApplicationPage({
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

  const application = await prisma.application.findUnique({
    where: {
      id,
      userId: user.id,
    },
  })

  if (!application) {
    notFound()
  }

  return (
    <div className="min-h-screen">
      <Navbar email={user.email ?? undefined} />

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href={`/applications/${id}`}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 mb-4 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to application
          </Link>
          <h1 className="text-3xl font-semibold text-foreground">Edit Application</h1>
          <p className="mt-1 text-muted-foreground">Update application details</p>
        </div>

        <div className="glass-strong rounded-2xl p-8 shadow-sm">
          <EditForm application={application} />
        </div>
      </main>
    </div>
  )
}
