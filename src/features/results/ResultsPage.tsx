import React from 'react'
import { useExamStore } from '../../state/slices/examSlice'
import Button from '../../components/ui/Button'
import QuestionReviewList from './QuestionReviewList'

export default function ResultsPage({ onBack }: { onBack?: () => void }) {
  const questions = useExamStore((s) => s.questions)
  const answers = useExamStore((s) => s.answers)
  const resetExam = useExamStore((s) => s.resetExam)

  const total = questions.length
  const correct = questions.filter((q, i) => answers[i] === q.correctIndex).length
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0
  const passed = pct >= 70
  const scoreColor = pct >= 70 ? '#16a34a' : pct >= 50 ? '#d97706' : '#dc2626'

  function handleBack() {
    resetExam()
    if (onBack) onBack()
  }

  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <div>
        <h2 style={{ margin: '0 0 4px', fontSize: '1.2rem' }}>Exam Complete</h2>
        <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.875rem' }}>Here's how you did.</p>
      </div>

      <div className="card" style={{ padding: '28px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, textAlign: 'center' }}>
        <div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: scoreColor }}>{pct}%</div>
          <div style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: 4 }}>Score</div>
        </div>
        <div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#16a34a' }}>{correct}</div>
          <div style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: 4 }}>Correct</div>
        </div>
        <div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#dc2626' }}>{total - correct}</div>
          <div style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: 4 }}>Incorrect</div>
        </div>
      </div>

      <div className="card" style={{ padding: '12px 20px', background: passed ? '#f0fdf4' : '#fff1f2', border: `1px solid ${passed ? '#86efac' : '#fca5a5'}` }}>
        <span style={{ fontWeight: 600, color: passed ? '#15803d' : '#b91c1c', fontSize: '0.9rem' }}>
          {passed ? '✓ PASSED — well done!' : '✗ NOT PASSED — keep studying and try again.'}
        </span>
      </div>

      {questions.length > 0 && (
        <div>
          <h3 style={{ margin: '0 0 12px', fontSize: '1rem' }}>Question Review</h3>
          <QuestionReviewList questions={questions} answers={answers} />
        </div>
      )}

      <div>
        <Button variant="secondary" onClick={handleBack}>Start New Exam</Button>
      </div>
    </div>
  )
}
