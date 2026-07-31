import { AiExamSchema } from '../../utils/schema/aiResponse'
import { ZodError } from 'zod'

export function validateAiExam(obj: unknown) {
  try {
    const parsed = AiExamSchema.parse(obj)
    return { valid: true as const, parsed }
  } catch (err) {
    if (err instanceof ZodError) {
      return { valid: false as const, errors: err.issues }
    }
    return { valid: false as const, errors: [{ message: (err as any).message ?? String(err) }] }
  }
}
