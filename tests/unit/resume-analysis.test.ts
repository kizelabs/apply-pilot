import { describe, it, expect } from 'vitest'
import { resumeAnalysisSchema } from '@/lib/schemas/resume-analysis'

describe('resumeAnalysisSchema', () => {
  it('should validate correct resume analysis output', () => {
    const validOutput = {
      matchScore: 85,
      strengths: ['Strong technical skills', 'Relevant experience'],
      gaps: ['Missing cloud certifications'],
      suggestedKeywords: ['AWS', 'Docker', 'Kubernetes'],
      bulletSuggestions: ['Add metrics to achievements'],
      summary: 'Strong candidate with relevant experience',
    }

    const result = resumeAnalysisSchema.safeParse(validOutput)
    expect(result.success).toBe(true)
  })

  it('should reject invalid match score', () => {
    const invalidOutput = {
      matchScore: 150,
      strengths: ['Strong skills'],
      gaps: [],
      suggestedKeywords: [],
      bulletSuggestions: [],
      summary: 'Good candidate',
    }

    const result = resumeAnalysisSchema.safeParse(invalidOutput)
    expect(result.success).toBe(false)
  })

  it('should reject missing required fields', () => {
    const invalidOutput = {
      matchScore: 85,
      strengths: [],
    }

    const result = resumeAnalysisSchema.safeParse(invalidOutput)
    expect(result.success).toBe(false)
  })

  it('should require at least one strength', () => {
    const invalidOutput = {
      matchScore: 85,
      strengths: [],
      gaps: [],
      suggestedKeywords: [],
      bulletSuggestions: [],
      summary: 'Good candidate',
    }

    const result = resumeAnalysisSchema.safeParse(invalidOutput)
    expect(result.success).toBe(false)
  })

  it('should require summary to be at least 10 characters', () => {
    const invalidOutput = {
      matchScore: 85,
      strengths: ['Strong skills'],
      gaps: [],
      suggestedKeywords: [],
      bulletSuggestions: [],
      summary: 'Good',
    }

    const result = resumeAnalysisSchema.safeParse(invalidOutput)
    expect(result.success).toBe(false)
  })
})
