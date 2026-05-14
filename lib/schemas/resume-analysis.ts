import { z } from 'zod'

export const resumeAnalysisSchema = z.object({
  matchScore: z.number().min(0).max(100),
  strengths: z.array(z.string()).min(1),
  gaps: z.array(z.string()),
  suggestedKeywords: z.array(z.string()),
  bulletSuggestions: z.array(z.string()),
  summary: z.string().min(10),
})

export type ResumeAnalysisOutput = z.infer<typeof resumeAnalysisSchema>
