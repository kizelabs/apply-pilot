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
          content: 'You are an expert resume reviewer. Always respond with valid JSON only, no extra text.',
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

    // DEBUG — remove once stable
    console.log('[resume-analysis] raw AI response:\n', rawContent.slice(0, 2000))

    // Strip <think>...</think> reasoning blocks (Qwen / DeepSeek models)
    const stripped = rawContent.replace(/<think>[\s\S]*?<\/think>/gi, '').trim()
    console.log('[resume-analysis] after stripping think blocks:\n', stripped.slice(0, 1000))

    // Extract the first JSON object from the response
    const jsonMatch = stripped.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      console.error('[resume-analysis] No JSON found in stripped response:', stripped)
      return NextResponse.json({ error: 'Invalid AI response format' }, { status: 500 })
    }

    // Parse and validate AI output
    let parsed = JSON.parse(jsonMatch[0])
    console.log('[resume-analysis] parsed keys:', Object.keys(parsed))

    // Unwrap if the model nested the result under a top-level key (e.g. { "analysis": {...} })
    const schemaKeys = ['matchScore', 'strengths', 'gaps', 'suggestedKeywords', 'bulletSuggestions', 'summary']
    const hasDirectKeys = schemaKeys.some((k) => k in parsed)
    if (!hasDirectKeys) {
      console.log('[resume-analysis] unwrapping nested object, top-level keys:', Object.keys(parsed))
      const nested = Object.values(parsed)[0]
      if (nested && typeof nested === 'object') parsed = nested
    }

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
      {
        error: 'Failed to analyze resume',
        detail: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    )
  }
}
