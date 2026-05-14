'use client'

import { useState } from 'react'
import { Textarea, Select, Button } from '@/components/form'
import { Sparkles } from 'lucide-react'

interface CoverLetterGeneratorProps {
  applicationId: string
  onGenerated?: (coverLetterId: string) => void
}

const toneOptions = [
  { value: 'PROFESSIONAL', label: 'Professional' },
  { value: 'CONFIDENT', label: 'Confident' },
  { value: 'FRIENDLY', label: 'Friendly' },
  { value: 'CONCISE', label: 'Concise' },
  { value: 'STARTUP', label: 'Startup' },
]

export function CoverLetterGenerator({ applicationId, onGenerated }: CoverLetterGeneratorProps) {
  const [resumeText, setResumeText] = useState('')
  const [tone, setTone] = useState('PROFESSIONAL')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [generatedContent, setGeneratedContent] = useState('')

  async function handleGenerate() {
    if (!resumeText.trim()) {
      setError('Please paste your resume text')
      return
    }

    setLoading(true)
    setError('')
    setGeneratedContent('')

    try {
      const response = await fetch('/api/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId, tone, resumeText }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate cover letter')
      }

      const data = await response.json()
      setGeneratedContent(data.content)
      onGenerated?.(data.id)
    } catch {
      setError('Failed to generate cover letter. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (generatedContent) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-foreground">Generated Cover Letter</h4>
          <Button
            variant="secondary"
            onClick={() => setGeneratedContent('')}
          >
            <Sparkles className="w-4 h-4" />
            Generate New
          </Button>
        </div>
        <Textarea
          value={generatedContent}
          onChange={(e) => setGeneratedContent(e.target.value)}
          rows={15}
        />
        <p className="text-xs text-muted-foreground">
          Cover letter saved. You can edit it above.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Select
        label="Tone"
        options={toneOptions}
        value={tone}
        onValueChange={(value) => setTone(value)}
        disabled={loading}
      />

      <Textarea
        label="Resume Text"
        placeholder="Paste your resume text here..."
        rows={8}
        value={resumeText}
        onChange={(e) => setResumeText(e.target.value)}
        disabled={loading}
      />

      {error && (
        <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <Button onClick={handleGenerate} disabled={loading || !resumeText.trim()}>
        <Sparkles className="w-4 h-4" />
        {loading ? 'Generating...' : 'Generate Cover Letter'}
      </Button>
    </div>
  )
}
