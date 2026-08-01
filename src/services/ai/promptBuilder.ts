// ~3 k tokens — enough context for a POC without hitting typical model limits
const MAX_TEXT_CHARS = 12_000

const SYSTEM_MESSAGE = [
  'You are a helpful exam-generation assistant.',
  'Focus on creating realistic, real-world scenario-based multiple-choice questions that require applying knowledge from the source material rather than merely repeating it.',
  'Use the provided source material as background and reference; you may synthesize, adapt, or condense examples to produce practical scenarios that test understanding and application.',
  'You MUST output ONLY a valid JSON object — no markdown, no explanatory text, no code fences.',
  'The JSON must match this schema exactly:',
  '{',
  '  "title": string,',
  '  "questionCount": number,',
  '  "questions": [',
  '    {',
  '      "id": string,',
  '      "text": string,',
  '      "options": [{"id": string, "text": string}],',
  '      "correctIndex": number,',
  '      "explanation": string',
  '    }',
  '  ]',
  '}',
  'Rules: ids are short strings (e.g. q1, a, b, c, d). Each question should present a concise, plausible scenario and have exactly 4 distinct options.',
  'correctIndex is a zero-based integer, questionCount equals the number of questions.',
].join('\n')

export function buildExamMessages(text: string, questionCount: number): { system: string; user: string } {
  const truncated = text.length > MAX_TEXT_CHARS
  const source = truncated ? text.slice(0, MAX_TEXT_CHARS) + '\n\n[...truncated]' : text

  console.group('[CertPrep] Extracted text sent to AI')
  console.log('Original length:', text.length, 'chars | Truncated:', truncated)
  console.log('Preview (first 500 chars):\n', text.slice(0, 500))
  console.groupEnd()

  const user = [
    `Generate exactly ${questionCount} scenario-based multiple-choice questions that apply concepts from the following source material to realistic, real-world situations. Use the source as background and reference but synthesize or adapt examples—do not copy long verbatim passages.`,
    `Requirements:\n- Each question must be focused and test application of knowledge.\n- Provide exactly 4 options per question.\n- Mark the correct option with the zero-based \"correctIndex\" and include a brief explanation for the correct answer.`,
    `Source material:\n\n${source}`,
  ].join('\n\n')

  return { system: SYSTEM_MESSAGE, user }
}

/** @deprecated use buildExamMessages for chat completions API */
export function buildExamPrompt(text: string, questionCount: number): string {
  const { system, user } = buildExamMessages(text, questionCount)
  return `${system}\n\n${user}`
}
