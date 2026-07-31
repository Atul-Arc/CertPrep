import Modal from '../../../components/ui/Modal'
import { useGenerationStore } from '../../../state/store'
import { generateExam } from '../../exam-generation/service'
import React from 'react'

export default function ValidationErrorPanel() {
  const error = useGenerationStore((s) => s.error)
  const setStatus = useGenerationStore((s) => s.setStatus)
  const lastText = useGenerationStore((s) => s.lastText)
  const lastCount = useGenerationStore((s) => s.lastQuestionCount)
  const errorType = useGenerationStore((s) => s.errorType)
  const setErrorType = useGenerationStore((s) => s.setErrorType)

  const [retrying, setRetrying] = React.useState(false)

  function sleep(ms: number) {
    return new Promise((res) => setTimeout(res, ms))
  }

  return (
    <Modal>
      <div>
        <h3>Validation Error</h3>
        <div style={{ color: 'crimson', whiteSpace: 'pre-wrap' }}>{error}</div>
        <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
          <button onClick={() => setStatus('idle')}>Close</button>
          <button
            onClick={async () => {
              if (!lastText || !lastCount) return
              await generateExam(lastText, lastCount)
            }}
            disabled={retrying}
          >
            Regenerate
          </button>
          <button
            onClick={async () => {
              if (!lastText || !lastCount || retrying) return
              setRetrying(true)
              setErrorType(null)
              // Retry with simple exponential backoff up to 3 attempts
              const attempts = 3
              for (let i = 0; i < attempts; i++) {
                const ok = await generateExam(lastText, lastCount)
                if (ok) break
                const delay = Math.pow(2, i) * 1000
                // eslint-disable-next-line no-await-in-loop
                await sleep(delay)
              }
              setRetrying(false)
            }}
            disabled={retrying}
          >
            {retrying ? 'Retrying…' : 'Retry with backoff'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
