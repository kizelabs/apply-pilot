import { z } from 'zod'

export const coverLetterSchema = z.object({
  content: z.string().min(100),
})

export type CoverLetterOutput = z.infer<typeof coverLetterSchema>
