import React, { useRef, useState } from 'react'
import Button from '../../../components/ui/Button'
import QuestionSettings from './QuestionSettings'
import { extractTextFromPdf } from '../../../services/pdf'
import { generateExam } from '../../exam-generation/service'

const TRUNCATION_THRESHOLD = 12_000

export default function UploadDropzone({ onGenerated }: { onGenerated?: () => void }) {
  const fileRef = useRef<HTMLInputElement | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [questionCount, setQuestionCount] = useState<number>(5)
  const [extractError, setExtractError] = useState<string | null>(null)
  const [truncationWarning, setTruncationWarning] = useState(false)
  const [questionCountError, setQuestionCountError] = useState<string | null>(null)

  async function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return

    // Validate PDF only
    const isPdf = f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf')
    if (!isPdf) {
      setExtractError('Please upload a PDF file.')
      setFileName(null)
      // clear the input
      e.target.value = ''
      return
    }

    setFileName(f.name)
    setExtractError(null)
    setTruncationWarning(false)
    setQuestionCountError(null)
  }

  async function onGenerate() {
    const f = fileRef.current?.files?.[0]
    if (!f) return alert('Select a PDF file first')
    if (!(f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'))) {
      setExtractError('Please upload a PDF file.')
      return
    }

    if (questionCount <= 0) {
      setQuestionCountError('Question count must be greater than 0')
      return
    }
    setExtractError(null)
    setTruncationWarning(false)

    let text: string
    try {
      const result = await extractTextFromPdf(f)
      text = result.text
      if (text.length > TRUNCATION_THRESHOLD) {
        setTruncationWarning(true)
      }
    } catch {
      setExtractError(
        'Could not extract text from this PDF. If it is a scanned or image-only PDF, please use a text-selectable version or run OCR first before uploading.',
      )
      return
    }

    const ok = await generateExam(text, questionCount)
    if (ok && onGenerated) onGenerated()
  }

  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <div style={{ display: 'grid', gap: 12 }}>
        <div>
          <p style={{ margin: '0 0 10px', fontSize: '0.95rem', color: 'var(--muted)', lineHeight: 1.6 }}>
            <strong>CertPrep</strong> is an AI-powered tool that generates practice questions from your study materials. Upload a PDF file, and we'll create questions to help you prepare for your exams.
          </p>
        </div>
        <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '4px 0' }} />
        <div>
          <h2 style={{ margin: '0 0 4px', fontSize: '0.95rem' }}>Upload Study Document</h2>
          <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.875rem' }}>
            Upload a PDF file and we'll generate practice questions.
          </p>
        </div>
      </div>

      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '12px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <label
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 12px',
              borderRadius: 6,
              border: '1px solid var(--border)',
              background: 'var(--bg)',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: 500,
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            Choose file
            <input ref={fileRef} type="file" accept="application/pdf,.pdf" onChange={onSelectFile} style={{ display: 'none' }} />
          </label>
          <span style={{ color: fileName ? 'var(--fg)' : 'var(--muted)', fontSize: '0.875rem', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {fileName ?? 'No file selected'}
          </span>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <QuestionSettings value={questionCount} onChange={(n) => { setQuestionCount(n); if (n > 0) setQuestionCountError(null) }} />
              {questionCountError && (
                <div style={{ color: '#b91c1c', fontSize: '0.85rem' }}>{questionCountError}</div>
              )}
            </div>
            <Button onClick={onGenerate} disabled={!fileName || questionCount <= 0}>Generate Exam</Button>
          </div>
        </div>

        {extractError && (
          <div style={{ padding: '8px 12px', borderRadius: 6, background: '#fff1f2', border: '1px solid #fca5a5', fontSize: '0.875rem', color: '#b91c1c' }}>
            {extractError}
          </div>
        )}

        {truncationWarning && (
          <div style={{ padding: '8px 12px', borderRadius: 6, background: '#fffbeb', border: '1px solid #fcd34d', fontSize: '0.875rem', color: '#92400e' }}>
            ⚠ Document is large — only the first ~12,000 characters will be sent to the AI. Questions will be based on that portion of the material.
          </div>
        )}
      </div>
    </div>
  )
}
