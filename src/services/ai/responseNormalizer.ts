import type { GenerateExamResponse } from './index'

function tryParseJson(text: string): any | null {
  try {
    return JSON.parse(text)
  } catch (e) {
    // try to extract JSON substring
    const m = text.match(/\{[\s\S]*\}/)
    if (m) {
      try {
        return JSON.parse(m[0])
      } catch (e2) {
        return null
      }
    }
    return null
  }
}

export function normalizeResponse(raw: any, questionCount: number): GenerateExamResponse {
  // If already matches shape, return as-is
  if (raw && raw.title && Array.isArray(raw.questions)) return raw as GenerateExamResponse

  // OpenAI-like: { choices: [{ text }] }
  if (raw && Array.isArray(raw.choices) && raw.choices[0]) {
    const text = raw.choices[0].text || raw.choices[0].message?.content
    if (typeof text === 'string') {
      const parsed = tryParseJson(text)
      if (parsed) return parsed as GenerateExamResponse
    }
  }

  // Sometimes providers return a plain string
  if (typeof raw === 'string') {
    const parsed = tryParseJson(raw)
    if (parsed) return parsed as GenerateExamResponse
  }

  // If raw has a 'data' or 'result' wrapper
  if (raw && (raw.data || raw.result)) {
    const candidate = raw.data || raw.result
    if (typeof candidate === 'string') {
      const parsed = tryParseJson(candidate)
      if (parsed) return parsed as GenerateExamResponse
    } else if (candidate && candidate.title && Array.isArray(candidate.questions)) {
      return candidate as GenerateExamResponse
    }
  }

  // Last resort: attempt to coerce a minimal mock structure
  const questions = [] as any[]
  for (let i = 0; i < questionCount; i++) {
    questions.push({ id: `q${i + 1}`, text: `Question ${i + 1} (auto-generated)`, options: [{ id: 'a', text: 'A' }, { id: 'b', text: 'B' }], correctIndex: 0 })
  }
  return { title: 'Generated (normalized)', questionCount, questions }
}
