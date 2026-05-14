'use client'

import { useState } from 'react'
import { Textarea } from './Textarea'
import { Button } from './Button'
import { FileText } from 'lucide-react'

interface ResumeAnalyzerProps {
  applicationId: string
  onAnalysisComplete?: () => void
}

export function ResumeAnalyzer({ applicationId, onAnalysisComplete }: ResumeAnalyzerProps) {
  const [resumeText, setResumeText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleAnalyze() {
    if (!resumeText.trim()) {
      setError('Please paste your resume text')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/resume-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId, resumeText }),
      })

      if (!response.ok) {
        throw new Error('Failed to analyze resume')
      }

      setResumeText('')
      onAnalysisComplete?.()
      // Reload to show the analysis card
      window.location.reload()
    } catch {
      setError('Failed to analyze resume. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Textarea
        label="Resume Text"
        placeholder="Paste your resume text here..."
        rows={10}
        value={resumeText}
        onChange={(e) => setResumeText(e.target.value)}
        disabled={loading}
      />

      {error && (
        <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <Button onClick={handleAnalyze} disabled={loading || !resumeText.trim()}>
        <FileText className="w-4 h-4" />
        {loading ? 'Analyzing...' : 'Analyze Resume'}
      </Button>
    </div>
  )
}
