import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { openai, MODEL } from '@/lib/openai'
import { coverLetterSchema } from '@/lib/schemas/cover-letter'

const toneDescriptions: Record<string, string> = {
  PROFESSIONAL: 'formal, business-appropriate, and polished',
  CONFIDENT: 'assertive, self-assured, and achievement-focused',
  FRIENDLY: 'warm, personable, and conversational',
  CONCISE: 'brief, direct, and to-the-point',
  STARTUP: 'innovative, energetic, and culture-focused',
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { applicationId, tone, resumeText } = await request.json()

    if (!applicationId || !tone || !resumeText) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Verify application ownership
    const application = await prisma.application.findUnique({
      where: {
        id: applicationId,
        userId: user.id,
      },
    })

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    const toneDesc = toneDescriptions[tone as string]

    // Generate cover letter with AI
    const prompt = `You are an expert cover letter writer. Write a compelling cover letter for this job application.

Job Details:
Company: ${application.companyName}
Position: ${application.jobTitle}
Job Description: ${application.jobDescription || 'Not provided'}

Resume/Background:
${resumeText}

Tone: ${toneDesc}

Write a complete, professional cover letter that:
- Opens with a strong hook
- Highlights relevant experience and skills
- Shows enthusiasm for the role and company
- Demonstrates cultural fit
- Closes with a clear call to action
- Matches the ${toneDesc} tone

Return ONLY the cover letter text, no JSON formatting.`

    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content: 'You are an expert cover letter writer. Write compelling, personalized cover letters.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    const rawContent = completion.choices[0]?.message?.content
    if (!rawContent) {
      return NextResponse.json({ error: 'No response from AI' }, { status: 500 })
    }

    // Strip <think>...</think> reasoning blocks (Qwen / DeepSeek models)
    const content = rawContent.replace(/<think>[\s\S]*?<\/think>/gi, '').trim()

    // Validate output
    const validated = coverLetterSchema.parse({ content })

    // Save to database
    const coverLetter = await prisma.coverLetter.create({
      data: {
        applicationId,
        tone: tone as 'PROFESSIONAL' | 'CONFIDENT' | 'FRIENDLY' | 'CONCISE' | 'STARTUP',
        content: validated.content,
      },
    })

    return NextResponse.json(coverLetter)
  } catch (error) {
    console.error('Cover letter generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate cover letter' },
      { status: 500 }
    )
  }
}
