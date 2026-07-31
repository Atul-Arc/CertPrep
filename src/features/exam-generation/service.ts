import { provider } from '../../services/ai'
import { AiExamSchema } from '../../utils/schema/aiResponse'
import { useGenerationStore } from '../../state/store'
import { useExamStore } from '../../state/slices/examSlice'
import { ZodError } from 'zod'

export async function generateExam(text: string, questionCount: number) {
  const gen = useGenerationStore.getState()
  const examStore = useExamStore.getState()
  console.group('[CertPrep] Extracted PDF text')
  console.log('Length:', text?.length ?? 'undefined', 'chars | Questions requested:', questionCount)
  console.log('Preview (first 500 chars):\n', text?.slice(0, 500))
  console.log('Full text:\n', text)
  console.groupEnd()
  if (!text) {
    gen.setError('PDF text extraction returned empty — check the [pdfWorker] logs above.')
    gen.setStatus('failed')
    return false
  }
  try {
    gen.setLastRequest(text, questionCount)
    gen.setStatus('running')
    const resp = await provider.generateExam({ text, questionCount })
    const parsed = AiExamSchema.parse(resp)
    examStore.setQuestions(parsed.questions)
    gen.setStatus('succeeded')
    gen.setErrorType(null)
    return true
  } catch (err: any) {
    const msg = err?.message ?? String(err)
    gen.setError(msg)

    // Classify errors
    if (err instanceof ZodError) {
      gen.setErrorType('validation')
    } else if (/429|rate limit|rate-limit/i.test(msg)) {
      gen.setErrorType('rate')
    } else if (/502|503|504|5\d{2}/i.test(msg)) {
      gen.setErrorType('server')
    } else if (/network|failed to fetch|fetch/i.test(msg)) {
      gen.setErrorType('network')
    } else {
      gen.setErrorType('unknown')
    }

    gen.setStatus('failed')
    return false
  }
}
