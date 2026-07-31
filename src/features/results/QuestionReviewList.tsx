import React from 'react'
import type { ExamQuestion } from '../../services/ai'

interface Props {
  questions: ExamQuestion[]
  answers: (number | null)[]
}

export default function QuestionReviewList({ questions, answers }: Props) {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      {questions.map((q, i) => {
        const userAnswer = answers[i]
        const isCorrect = userAnswer === q.correctIndex
        const borderColor = userAnswer === null ? 'var(--border)' : isCorrect ? '#16a34a' : '#dc2626'
        const bgColor = userAnswer === null ? 'var(--bg)' : isCorrect ? '#f0fdf4' : '#fff1f2'

        return (
          <div
            key={q.id}
            className="card"
            style={{ borderLeft: `4px solid ${borderColor}`, background: bgColor, padding: '16px 20px' }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
              <span style={{
                flexShrink: 0,
                width: 22,
                height: 22,
                borderRadius: '50%',
                background: isCorrect ? '#16a34a' : '#dc2626',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 700,
                marginTop: 2,
              }}>
                {isCorrect ? '✓' : '✗'}
              </span>
              <p style={{ margin: 0, fontWeight: 500, lineHeight: 1.5 }}>
                Q{i + 1}. {q.text}
              </p>
            </div>

            <div style={{ paddingLeft: 32, display: 'grid', gap: 4, fontSize: '0.875rem' }}>
              {q.options.map((opt, j) => {
                const isUserPick = j === userAnswer
                const isRight = j === q.correctIndex
                return (
                  <div
                    key={opt.id}
                    style={{
                      padding: '4px 8px',
                      borderRadius: 4,
                      background: isRight ? '#dcfce7' : isUserPick ? '#fee2e2' : 'transparent',
                      fontWeight: isRight || isUserPick ? 600 : 400,
                      color: isRight ? '#15803d' : isUserPick ? '#b91c1c' : 'var(--fg)',
                    }}
                  >
                    <span style={{ marginRight: 6 }}>{String.fromCharCode(65 + j)}.</span>
                    {opt.text}
                    {isRight && <span style={{ marginLeft: 6, fontSize: '0.8rem' }}>← Correct</span>}
                    {isUserPick && !isRight && <span style={{ marginLeft: 6, fontSize: '0.8rem' }}>← Your answer</span>}
                  </div>
                )
              })}
            </div>

            {q.explanation && (
              <div style={{
                marginTop: 10,
                paddingLeft: 32,
                fontSize: '0.8rem',
                color: 'var(--muted)',
                lineHeight: 1.5,
              }}>
                <strong>Explanation:</strong> {q.explanation}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
