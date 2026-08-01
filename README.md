# CertPrep — AI Mock Exam Generator

CertPrep is an AI-powered practice exam generator built for learners preparing for professional certifications and academic exams. Whether you're studying for cloud certifications (AWS, Azure, GCP), IT fundamentals (CompTIA A+, Network+, Security+), project management (PMP, PRINCE2), or any subject-specific course — CertPrep helps you test your knowledge in a realistic exam-style format.

Upload your study material — a PDF textbook chapter, lecture notes, a whitepaper, or any text-based document — and CertPrep will analyze the content and generate targeted multiple-choice practice questions on the fly. Review your answers, see detailed explanations, and identify your weak spots so you can study smarter, not harder.

Frontend-only SPA — no backend, no database. All processing happens in the browser.

## Architecture Overview

- **Stack**: React + TypeScript + Vite + Zustand
- **PDF extraction**: [pdf.js](https://mozilla.github.io/pdf.js/) runs entirely client-side; the file is never uploaded to a server.
- **AI integration**: Extracted text is sent to a configurable OpenAI-compatible endpoint. The raw response is validated with Zod before the exam is rendered.
- **State**: Zustand stores hold generation status (`useGenerationStore`) and exam session data (`useExamStore`). All state is in-memory and reset on page reload.
- **No auth, no persistence**: v1 stores nothing beyond the current browser session.

```
src/
  components/ui/        # Shared primitives: Button, Modal, Toast
  features/
    document-upload/    # File input, PDF extraction, question-count settings
    exam-generation/    # AI call orchestration, Zod validation, error UI
    exam-player/        # Single-question exam flow, answer locking
    results/            # Score summary and per-question review
  services/
    ai/                 # IAiProvider abstraction, OpenAI adapter, mock adapter
    pdf/                # pdf.js wrapper (extractTextFromPdf)
  state/                # Zustand store and slices
  utils/
    config.ts           # Reads VITE_AI_* env vars
    schema/aiResponse.ts # Zod schema for AI JSON
```

## Getting Started

```powershell
cp .env.example .env   # fill in VITE_AI_ENDPOINT and VITE_AI_API_KEY
npm install
npm run dev
```

Build for production:

```powershell
npm run build
npm run preview
```

## Environment Variables

See [.env.example](.env.example) for all variables and descriptions.

| Variable | Required | Description |
|---|---|---|
| `VITE_AI_ENDPOINT` | Yes (for real AI) | Chat-completions URL (OpenAI-compatible) |
| `VITE_AI_API_KEY` | Yes (for real AI) | Provider API key |
| `VITE_AI_MODEL` | No | Model name (default: `gpt-4o-mini`) |
| `VITE_AI_TIMEOUT_MS` | No | Request timeout ms (default: `30000`) |

Leave `VITE_AI_ENDPOINT` empty to use the built-in mock adapter — no API key needed.

## Swapping or Adding AI Providers

1. Create a class in `src/services/ai/` that implements `IAiProvider`:
   ```ts
   export default class MyAdapter implements IAiProvider {
     async generateExam(req: GenerateExamRequest): Promise<GenerateExamResponse> { ... }
   }
   ```
2. Register it in `src/services/ai/index.ts` based on an env-var condition.
3. The rest of the app is unaffected — validation and rendering use the shared Zod schema.

## Agent Role Definitions

### ExamGeneratorAgent
- **Role**: `ExamGeneratorAgent`
- **Responsibility**: Generate a structured mock-exam JSON from extracted study-guide text.
- **Inputs**: `{ documentText: string, questionCount: number }`
- **Outputs**: `{ title, questionCount, questions[] }` — see `src/utils/schema/aiResponse.ts`
- **Errors**: `ValidationError`, `RateLimitError`, `ProviderError`, `ParsingError`

### HealthCheckAgent
- **Role**: `HealthCheckAgent`
- **Responsibility**: Verify AI provider availability and basic response sanity.
- **Inputs**: `{}`
- **Outputs**: `{ status: 'ok' | 'unavailable', latencyMs?, lastError? }`
- **Errors**: `NetworkError`, `AuthError`

Full agent contracts: [`specs/001-cretprep-mock-exams/agents.md`](specs/001-cretprep-mock-exams/agents.md)

## Definition of Done

A feature is complete when all of the following pass:

- [ ] `spec.md` exists and is reviewed
- [ ] `tsc --noEmit` passes (strict mode)
- [ ] Lint and formatting checks pass (`npm run lint`)
- [ ] AI responses validated against Zod schema; mock adapter available for local verification
- [ ] Accessibility: keyboard navigation verified on affected views
- [ ] `README.md` and `docs/quickstart.md` updated
- [ ] CI green on PR

## Privacy

No user data (PDF content or generated questions) is sent to any service other than the configured AI provider endpoint. No data is persisted beyond the current browser session.

