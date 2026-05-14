import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { openai, MODEL } from '@/lib/openai'
import { resumeAnalysisSchema } from '@/lib/schemas/resume-analysis'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { applicationId, resumeText } = await request.json()

    if (!applicationId || !resumeText) {
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

    // Generate analysis with AI
    const prompt = `You are an expert resume reviewer. Analyze the following resume against this job description and provide a detailed assessment.

Job Description:
${application.jobDescription || 'No job description provided'}

Resume:
${resumeText}

Provide your analysis in the following JSON format:
{
  "matchScore": <number 0-100>,
  "strengths": ["strength 1", "strength 2", ...],
  "gaps": ["gap 1", "gap 2", ...],
  "suggestedKeywords": ["keyword 1", "keyword 2", ...],
  "bulletSuggestions": ["suggestion 1", "suggestion 2", ...],
  "summary": "Overall assessment summary"
}

Focus on:
- How well the resume matches the job requirements
- Key strengths that align with the role
- Missing skills or experience gaps
- Keywords that should be added
- Specific bullet point improvements
- Overall fit assessment`

    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content: 'You are an expert resume reviewer. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      return NextResponse.json({ error: 'No response from AI' }, { status: 500 })
    }

    // Parse and validate AI output
    const parsed = JSON.parse(content)
    const validated = resumeAnalysisSchema.parse(parsed)

    // Save to database
    const analysis = await prisma.resumeAnalysis.create({
      data: {
        applicationId,
        resumeText,
        matchScore: validated.matchScore,
        strengths: validated.strengths,
        gaps: validated.gaps,
        suggestedKeywords: validated.suggestedKeywords,
        bulletSuggestions: validated.bulletSuggestions,
        summary: validated.summary,
      },
    })

    return NextResponse.json(analysis)
  } catch (error) {
    console.error('Resume analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze resume' },
      { status: 500 }
    )
  }
}
