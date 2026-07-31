import React from 'react'
import { useExamStore } from '../../state/slices/examSlice'
import QuestionCard from './components/QuestionCard'
import Button from '../../components/ui/Button'

export default function ExamPage({ onFinish, onBack }: { onFinish?: () => void; onBack?: () => void }) {
  const questions = useExamStore((s) => s.questions)
  const setAnswer = useExamStore((s) => s.setAnswer)
  const [index, setIndex] = React.useState(0)
  const [answered, setAnswered] = React.useState(false)

  if (!questions || questions.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: 40 }}>
        <p style={{ color: 'var(--muted)', marginBottom: 16 }}>No exam loaded.</p>
        <Button variant="secondary" onClick={onBack}>Back to Upload</Button>
      </div>
    )
  }

  function handleAnswer(questionIndex: number, selectedIndex: number) {
    setAnswer(questionIndex, selectedIndex)
    setAnswered(true)
  }

  function handleNext() {
    const next = index + 1
    if (next >= questions.length) {
      if (onFinish) onFinish()
    } else {
      setIndex(next)
      setAnswered(false)
    }
  }

  const progress = Math.round((index / questions.length) * 100)
  const isLast = index === questions.length - 1

  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ margin: 0, fontSize: '1.1rem' }}>Question {index + 1} of {questions.length}</h2>
        <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{progress}% complete</span>
      </div>
      <div style={{ height: 4, background: 'var(--border)', borderRadius: 99 }}>
        <div style={{ height: '100%', width: `${progress}%`, background: 'var(--accent)', borderRadius: 99, transition: 'width 0.3s' }} />
      </div>

      <QuestionCard
        key={index}
        question={questions[index]}
        questionIndex={index}
        onAnswer={handleAnswer}
      />

      {answered && (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={handleNext}>{isLast ? 'See Results' : 'Next Question →'}</Button>
        </div>
      )}
    </div>
  )
}
