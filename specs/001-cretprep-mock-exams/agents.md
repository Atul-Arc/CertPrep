# Agent Definitions: CretPrep AI Agents

This file declares the agent artifacts required by the project constitution for the `001-cretprep-mock-exams` feature.

## ExamGeneratorAgent
- role: `ExamGeneratorAgent`
- responsibility: Generate a structured mock-exam JSON from an extracted study-guide text.
- inputs: `{ documentText: string, questionCount: number, options?: {difficulty?: string} }`
- outputs: `AiExamResponse` (see `utils/schema/aiResponse.ts`), canonical shape:
  - `title: string`
  - `questionCount: number`
  - `questions: Array<{ id: string, text: string, options: Array<{id:string,text:string}>, correctIndex: number, explanation?: string }>`
- errors: `ValidationError`, `RateLimitError`, `ProviderError`, `ParsingError` with structured shape `{ code: string, message: string, details?: any }`

## HealthCheckAgent
- role: `HealthCheckAgent`
- responsibility: Verify AI provider availability and basic response sanity (small prompt + parse check).
- inputs: `{}`
- outputs: `{ status: 'ok' | 'unavailable', latencyMs?: number, lastError?: {code:string,message:string} }`
- errors: `NetworkError`, `AuthError`

## Notes
- Implementers MUST place Zod schemas under `src/utils/schema/aiResponse.ts` and reference them from the agent input/output documentation.
- Agents' named roles and schemas MUST be included in PRs as part of the Definition of Done.
- Any additions or changes to agent contracts require an update to this `agents.md` and a constitution-aligned review when they affect policies.
