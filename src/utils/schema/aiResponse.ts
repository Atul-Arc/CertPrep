import { z } from 'zod'

export const OptionSchema = z.object({ id: z.string(), text: z.string() })
export const QuestionSchema = z.object({
  id: z.string(),
  text: z.string(),
  options: z.array(OptionSchema).min(2),
  correctIndex: z.number().int().nonnegative(),
  explanation: z.string().optional(),
})

export const AiExamSchema = z.object({
  title: z.string(),
  questionCount: z.number().int().positive(),
  questions: z.array(QuestionSchema).min(1),
})

export type AiExam = z.infer<typeof AiExamSchema>
