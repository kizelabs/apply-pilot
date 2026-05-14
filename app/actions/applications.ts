'use server'

import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import type { ApplicationStatus } from '@prisma/client'

export async function createApplication(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const companyName = formData.get('companyName') as string
  const jobTitle = formData.get('jobTitle') as string
  const jobDescription = formData.get('jobDescription') as string
  const jobUrl = formData.get('jobUrl') as string
  const status = (formData.get('status') as ApplicationStatus) || 'SAVED'

  let applicationId: string

  try {
    const application = await prisma.application.create({
      data: {
        userId: user.id,
        companyName,
        jobTitle,
        jobDescription: jobDescription || null,
        jobUrl: jobUrl || null,
        status,
        appliedAt: status === 'APPLIED' ? new Date() : undefined,
      },
    })
    applicationId = application.id
  } catch {
    return { error: 'Failed to create application' }
  }

  revalidatePath('/applications')
  redirect(`/applications/${applicationId}`)
}

export async function updateApplication(id: string, formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const companyName = formData.get('companyName') as string
  const jobTitle = formData.get('jobTitle') as string
  const jobDescription = formData.get('jobDescription') as string
  const jobUrl = formData.get('jobUrl') as string
  const status = formData.get('status') as ApplicationStatus

  try {
    await prisma.application.update({
      where: {
        id,
        userId: user.id,
      },
      data: {
        companyName,
        jobTitle,
        jobDescription: jobDescription || null,
        jobUrl: jobUrl || null,
        status,
        appliedAt: status === 'APPLIED' ? new Date() : undefined,
      },
    })
  } catch {
    return { error: 'Failed to update application' }
  }

  revalidatePath('/applications')
  revalidatePath(`/applications/${id}`)
  redirect(`/applications/${id}`)
}

export async function deleteApplication(id: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  try {
    await prisma.application.delete({
      where: {
        id,
        userId: user.id,
      },
    })
  } catch {
    return { error: 'Failed to delete application' }
  }

  revalidatePath('/applications')
  redirect('/applications')
}

export async function updateApplicationStatus(id: string, status: ApplicationStatus) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  try {
    await prisma.application.update({
      where: {
        id,
        userId: user.id,
      },
      data: {
        status,
        appliedAt: status === 'APPLIED' ? new Date() : undefined,
      },
    })
  } catch {
    return { error: 'Failed to update status' }
  }

  revalidatePath('/applications')
  revalidatePath(`/applications/${id}`)
  return { success: true }
}
