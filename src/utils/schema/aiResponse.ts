import { z } from 'zod'

export const OptionSchema = z.object({ id: z.string(), text: z.string() })
export const QuestionSchema = z.object({
  id: z.string(),
  text: z.string(),
  options: z.array(OptionSchema).length(4),
  correctIndex: z.number().int().nonnegative(),
  explanation: z.string().optional(),
})

// Cross-field validations: ensure correctIndex is within options range
export const QuestionSchemaWithChecks = QuestionSchema.superRefine((obj, ctx) => {
  const opts = obj.options ?? []
  const idx = obj.correctIndex
  if (!Number.isInteger(idx) || idx < 0 || idx >= opts.length) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: `correctIndex ${idx} out of range for options length ${opts.length}` })
  }
})

export const AiExamSchema = z
  .object({
    title: z.string(),
    questionCount: z.number().int().positive(),
    questions: z.array(QuestionSchemaWithChecks).min(1),
  })
  .superRefine((obj, ctx) => {
    const expected = obj.questionCount
    const actual = obj.questions?.length ?? 0
    if (expected !== actual) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `questionCount ${expected} does not match number of questions ${actual}`,
      })
    }
  })

export type AiExam = z.infer<typeof AiExamSchema>
