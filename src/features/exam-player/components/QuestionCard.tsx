import React from 'react'
import type { ExamQuestion } from '../../../services/ai'

interface Props {
  question: ExamQuestion
  questionIndex: number
  onAnswer: (questionIndex: number, selectedIndex: number) => void
}

export default function QuestionCard({ question, questionIndex, onAnswer }: Props) {
  const [selected, setSelected] = React.useState<number | null>(null)

  function handleSelect(i: number) {
    if (selected !== null) return   // locked after first selection
    setSelected(i)
    onAnswer(questionIndex, i)
  }

  function optionStyle(i: number): React.CSSProperties {
    if (selected === null) {
      return {
        textAlign: 'left',
        padding: '10px 14px',
        borderRadius: 8,
        border: '1px solid var(--border)',
        background: 'var(--bg)',
        cursor: 'pointer',
        fontSize: '0.9rem',
        transition: 'border-color 0.15s, background 0.15s',
        width: '100%',
      }
    }
    const isCorrect = i === question.correctIndex
    const isSelected = i === selected
    return {
      textAlign: 'left',
      padding: '10px 14px',
      borderRadius: 8,
      border: isCorrect ? '2px solid #16a34a' : isSelected ? '2px solid #dc2626' : '1px solid var(--border)',
      background: isCorrect ? '#dcfce7' : isSelected ? '#fee2e2' : 'var(--bg)',
      cursor: 'default',
      fontSize: '0.9rem',
      width: '100%',
      fontWeight: isCorrect || isSelected ? 600 : 400,
    }
  }

  return (
    <div className="card">
      <p style={{ margin: '0 0 20px', fontSize: '1rem', fontWeight: 500, lineHeight: 1.6 }}>{question.text}</p>
      <div style={{ display: 'grid', gap: 10 }}>
        {question.options.map((opt, i) => (
          <button
            key={opt.id}
            onClick={() => handleSelect(i)}
            disabled={selected !== null && i !== question.correctIndex && i !== selected}
            style={optionStyle(i)}
          >
            <span style={{ fontWeight: 600, marginRight: 8, color: 'var(--accent)' }}>
              {String.fromCharCode(65 + i)}.
            </span>
            {opt.text}
            {selected !== null && i === question.correctIndex && (
              <span style={{ marginLeft: 8, color: '#16a34a', fontSize: '0.8rem' }}>✓ Correct</span>
            )}
            {selected !== null && i === selected && i !== question.correctIndex && (
              <span style={{ marginLeft: 8, color: '#dc2626', fontSize: '0.8rem' }}>✗ Wrong</span>
            )}
          </button>
        ))}
      </div>

      {selected !== null && question.explanation && (
        <div style={{
          marginTop: 16,
          padding: '12px 14px',
          background: '#eff6ff',
          borderLeft: '3px solid var(--accent)',
          borderRadius: 6,
          fontSize: '0.875rem',
          color: 'var(--fg)',
          lineHeight: 1.5,
        }}>
          <strong>Explanation:</strong> {question.explanation}
        </div>
      )}
    </div>
  )
}
