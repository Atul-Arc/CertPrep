import React, { useRef, useState } from 'react'
import Button from '../../../components/ui/Button'
import QuestionSettings from './QuestionSettings'
import { extractTextFromPdf } from '../../../services/pdf'
import { generateExam } from '../../exam-generation/service'

export default function UploadDropzone({ onGenerated }: { onGenerated?: () => void }) {
  const fileRef = useRef<HTMLInputElement | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [questionCount, setQuestionCount] = useState<number>(5)

  async function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    setFileName(f.name)
  }

  async function onGenerate() {
    const f = fileRef.current?.files?.[0]
    if (!f) return alert('Select a file first')
    const { text } = await extractTextFromPdf(f)
    const ok = await generateExam(text, questionCount)
    if (ok && onGenerated) onGenerated()
  }

  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <div>
        <h2 style={{ margin: '0 0 4px', fontSize: '1.2rem' }}>Upload Study Document</h2>
        <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.875rem' }}>
          Upload a PDF or text file and we'll generate practice questions.
        </p>
      </div>

      <div className="card" style={{ display: 'grid', gap: 16 }}>
        <div>
          <label style={{ display: 'block', marginBottom: 6 }}>Document</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <label
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 14px',
                borderRadius: 6,
                border: '1px solid var(--border)',
                background: 'var(--bg)',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: 500,
              }}
            >
              Choose file
              <input ref={fileRef} type="file" accept=".pdf,text/plain" onChange={onSelectFile} style={{ display: 'none' }} />
            </label>
            <span style={{ color: fileName ? 'var(--fg)' : 'var(--muted)', fontSize: '0.875rem' }}>
              {fileName ?? 'No file selected'}
            </span>
          </div>
        </div>

        <QuestionSettings value={questionCount} onChange={setQuestionCount} />

        <div style={{ paddingTop: 4 }}>
          <Button onClick={onGenerate}>Generate Exam</Button>
        </div>
      </div>
    </div>
  )
}
