# Implementation Plan: CretPrep — AI Mock Exam Generator

## Overview
CretPrep is a frontend-only single-page application (SPA) that generates AI-powered mock certification exams from an uploaded study-guide PDF processed in-memory. This plan defines a clean, modular, and scalable React + TypeScript architecture that keeps business logic separate from presentation, validates AI JSON responses with strict schemas, and requires no backend for v1. If a provider's CORS or security constraints make direct client calls impossible, an intermediary proxy MAY only be considered after obtaining a documented constitution exception and approval; the default implementation approach is client-only.

## Goals
- Deliver an end-to-end frontend implementation that: accepts a PDF (in-memory), extracts text, requests structured exam JSON from an AI provider, validates the response, and presents an exam experience that mimics certification test flows.
- Optimize for maintainability, testability, and excellent UX.

## High-level Architecture
- Stack: React + TypeScript + Vite
- Architectural pattern: Feature-based modular frontend with clear layers:
  - Presentation: presentational components under `components/` and feature `components/`.
  - Business logic / domain services: `services/` and `features/*/service.ts` and `hooks.ts` providing side-effect encapsulation.
  - State: lightweight global store (Zustand) under `state/` with small, focused slices.
  - Validation: Zod schemas in `utils/schema/` for AI response validation and runtime type safety.
  - Utilities: `utils/` (formatters, timeouts, retry/backoff) and `services/pdf` for extraction.

## Feature / Module Breakdown
- Document Upload
  - Responsibilities: file ingestion, client-side text extraction (pdf.js), page selection, basic validation (scanned PDF detection), previewing first pages.
  - Outputs: plain-text document (string) and metadata (pageCount, sampleText).

- AI Integration
  - Responsibilities: provider adapter(s), request shaping (prompt builder), network calls, retry/backoff, error classification, and response passthrough for validation.
  - Exposed interface: `IAiProvider.generateExam(request): Promise<GenerateExamResponse>`.

- Exam Generation
  - Responsibilities: compose generation request, validate AI JSON, parse into typed `Exam` model, and persist to session store.
  - UX: generation progress modal, regenerate / manual edit options on validation failure.

- Exam Player
  - Responsibilities: single-question presentation, immediate evaluation, answer locking, navigation, progress indicator, keyboard accessibility.

- Scoring & Results
  - Responsibilities: calculate session score, percentage, counts, question review UI (user answer, correct answer, explanation), export/print result.

- Configuration & Settings
  - Responsibilities: expose environment-driven settings (read-only in UI), allow runtime model overrides in dev mode, show diagnostic AI logs when enabled.

- Shared UI / Design System
  - Small set of accessible components: `Button`, `Input`, `Select`, `Modal`, `Toast`, `Progress`, `Icon`, `Typography`.

## Folder Structure
```
src/
  assets/
  components/
    ui/ (Button, Modal, Toast...)
  features/
    document-upload/
      components/
      hooks.ts
      service.ts
      types.ts
    exam-generation/
      components/
      hooks.ts
      service.ts
      validators.ts
    exam-player/
      components/
      hooks.ts
      types.ts
    results/
      components/
  services/
    ai/
      index.ts (adapter registry)
      openaiAdapter.ts
    pdf/
      pdfWorker.ts
  state/
    store.ts
    slices/
  utils/
    schema/
      aiResponse.ts (Zod schemas)
    retry.ts
    format.ts
  hooks/
  types/
  App.tsx
  main.tsx
public/
```

## Component Hierarchy (pages & key components)
- App
  - UploadPage (`features/document-upload`) — `UploadDropzone`, `QuestionSettings`, `GenerateButton`
  - GenerationStatusModal — progress and trace logs
  - ExamPage (`features/exam-player`) — `QuestionHeader`, `QuestionCard`, `OptionButton`, `NavigationBar`
  - ResultsPage (`features/results`) — `ScoreSummary`, `QuestionReviewList`
  - SettingsPanel — read-only env display

## Component Responsibilities
- Presentational components: purely UI, receive props and callbacks, no side-effects.
- Container/hooks: coordinate services, call AI adapters, dispatch store updates.
- Services: pure side-effect implementations (network, pdf extraction) returning typed results.

## State Management
- Use Zustand for a minimal, typed global store. Generation and exam state are maintained together in `store.ts` or separate slice files as convenient:
  - generation state: status, raw AI response, validation errors
  - `examSlice`: `Exam` model, answers[], score
  - `uiSlice`: modals, toasts, transient UI flags
- Persist snapshot to `sessionStorage` optionally (feature-flagged) for page refresh resilience.
- Inject store into components via hooks: `useExamStore()`, `useGenerationStore()`.

## AI Service Abstraction & JSON Validation
- Define `IAiProvider` interface with `generateExam(request)` and `healthCheck()`.
- Implement adapters (e.g., `OpenAIAdapter`) that map to provider-specific API contract.
- Prompt builder: deterministic function that accepts extracted text + generation settings and returns the prompt/payload.
- Response schema: implement Zod schema `AiExamResponseSchema` that enforces:
  - `title: string`
  - `questionCount: number`
  - `questions: Array<{id: string, text: string, options: Array<{id:string,text:string}>, correctIndex: number, explanation?: string}>`
- Validation flow:
  1. Raw HTTP response → attempt JSON parse
  2. Validate with Zod → if success, normalize indexes and IDs, then store
  3. On failure, build actionable error object (missing fields, type mismatch, wrong counts)

## AI Response Example (canonical)
```json
{
  "title": "CretPrep: Sample Exam",
  "questionCount": 10,
  "questions": [
    {"id":"q1","text":"What is X?","options":[{"id":"a","text":"A"},{"id":"b","text":"B"},{"id":"c","text":"C"},{"id":"d","text":"D"}],"correctIndex":1,"explanation":"Because..."}
  ]
}
```

## Error Handling Strategy
- Global ErrorBoundary for rendering errors.
- Centralized `ErrorToast`/`Modal` for recoverable errors.
- Classify AI errors: `ValidationError`, `NetworkError`, `RateLimitError`, `ServerError`, and show tailored UX with retry/regenerate/adjust options.
- Document-level parsing errors: show guidance and offer re-upload or suggestion to provide a text file.
- Retries: exponential backoff with configurable max attempts for transient network issues.

## Environment Configuration
- Use Vite env variables (`VITE_AI_API_KEY`, `VITE_AI_ENDPOINT`, `VITE_AI_MODEL`, `VITE_AI_TIMEOUT_MS`, `VITE_ALLOW_SERVER_PROXY`).
- Provide `env.example` with descriptions and recommend CI/runtime secret injection.

## User Flow (happy path)
1. User opens app → sees UploadPage.
2. Uploads PDF → client extracts text and shows preview.
3. Selects question count and clicks Generate.
4. App shows GenerationStatusModal → AI call performed with extracted text only.
5. On validated response → app navigates to ExamPage.
6. User answers questions one-at-a-time → immediate evaluation, locked answers.
7. After last question → ResultsPage displays score and question-by-question review.

## Testing
Testing and automated test projects are out-of-scope for the MVP POC. Focus on implementing core functionality and validation; add automated tests later as needed.

## Risks & Assumptions
- Assumptions:
  - PDFs contain selectable text; OCR/scanned PDFs are out-of-scope for v1 but detected.
  - Environment variables available at build/runtime.
  - AI provider can be instructed to return strict JSON.
- Risks:
  - Large documents may exceed client-side memory/performance limits — mitigate via page limits, sampling, and progress UX.
  - Provider CORS/secret restrictions may force a short-lived serverless proxy.
  - AI hallucinations producing invalid JSON; mitigation: strict validation + regenerate UI.

## Future Extensibility
- Add provider plugins by implementing `IAiProvider` adapters.
- Document a provider-exception and proxy-approval pattern (constitution exception) to guide implementers if a proxy becomes necessary.
- Add exam modes (timed, sections), more doc types (DOCX, Markdown), and telemetry hooks.

## Deliverables & Next Steps
1. Create this `plan.md` (this file) in the feature folder.
2. Scaffold project (Vite + React + TypeScript + store) and implement core modules in priority order: document-upload → ai-adapter + validators → exam-player → results.
3. Add CI for build, type-check, and lint; postpone adding automated test projects for MVP.

---