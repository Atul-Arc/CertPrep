---
description: "Generated task list for 001-cretprep-mock-exams (CretPrep)"
---

# Tasks: CretPrep — AI Mock Exam Generator

**Input**: Design documents from `specs/001-cretprep-mock-exams/` (plan.md, spec.md)

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Initialize repository with React + TypeScript (Vite) and basic scripts — create `package.json`, `vite.config.ts`, `tsconfig.json`
- [ ] T002 Create initial folder layout and starter files under `src/` per implementation plan (`src/App.tsx`, `src/main.tsx`, `src/index.css`)
- [ ] T003 [P] Add environment example and docs: `.env.example` and `README.md` in repo root

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before user stories

- [ ] T004 Initialize linting and formatting: add `/.eslintrc.cjs`, `/prettier.config.cjs`, update `package.json` scripts
- [ ] T005 [P] Add CI workflow skeleton for build, type-check, lint (`.github/workflows/ci.yml`)
- [ ] T006 Implement AI provider abstraction and mock adapter: `src/services/ai/index.ts`, `src/services/ai/mockAdapter.ts`
- [ ] T007 [P] Implement Zod-based validation utilities and schema placeholder: `src/utils/schema/aiResponse.ts`
- [ ] T008 Implement PDF extraction service and worker scaffolding: `src/services/pdf/pdfWorker.ts`, `src/services/pdf/index.ts`
- [ ] T009 Create lightweight state store with Zustand and slices: `src/state/store.ts`, `src/state/slices/generationSlice.ts`, `src/state/slices/examSlice.ts`
- [ ] T010 [P] Add basic UI primitives and design tokens: `src/components/ui/Button.tsx`, `src/components/ui/Modal.tsx`, `src/components/ui/Toast.tsx`
- [ ] T011 Add `env.example` and config loader utility: `src/utils/config.ts` (read VITE_AI_API_KEY, VITE_AI_ENDPOINT, VITE_AI_MODEL, VITE_AI_TIMEOUT_MS)

---

## Phase 3: User Story 1 - Generate and take an exam (Priority: P1) 🎯 MVP

**Goal**: Upload a PDF, generate N multiple-choice questions, and take the exam one-question-at-a-time.

(Acceptance criteria below describe the expected observable behavior for the implemented user story.)

- [ ] T012 [US1] Create document upload feature UI and components: `src/features/document-upload/components/UploadDropzone.tsx`, `src/features/document-upload/components/DocumentPreview.tsx`
- [ ] T013 [US1] Implement document text extraction integration using `src/services/pdf/index.ts` and wire to upload UI (`src/features/document-upload/service.ts`)
- [ ] T014 [US1] Create generation settings UI (question count selector) in `src/features/document-upload/components/QuestionSettings.tsx`
- [ ] T015 [US1] Implement generation flow orchestration: `src/features/exam-generation/service.ts` (compose prompt, call AI adapter, validate response)
- [ ] T016 [US1] Implement GenerationStatusModal and progress UI: `src/features/exam-generation/components/GenerationStatusModal.tsx`
- [ ] T017 [US1] Implement exam player UI (single-question flow): `src/features/exam-player/components/QuestionCard.tsx`, `src/features/exam-player/ExamPage.tsx`
- [ ] T018 [US1] Implement results page and review UI: `src/features/results/ResultsPage.tsx`, `src/features/results/QuestionReviewList.tsx`

---

## Phase 4: User Story 2 - Validate AI responses (Priority: P1)

**Goal**: Verify AI JSON against strict schema and surface actionable UI on validation failures.

Ensure the UI displays validation errors with retry/regenerate actions when AI JSON fails validation.

- [ ] T020 [US2] Implement Zod schema for AI exam responses: `src/utils/schema/aiResponse.ts` (detailed schema per plan)
- [ ] T021 [US2] Implement validation pipeline and error normalization: `src/features/exam-generation/validators.ts`
- [ ] T022 [US2] Implement validation error UI and retry/regenerate actions: `src/features/exam-generation/components/ValidationErrorPanel.tsx`

---

## Phase 5: User Story 3 - Configurable AI provider (Priority: P2)

**Goal**: Make AI provider settings configurable via environment variables and ensure adapters honor those values.

Verify the app reads environment overrides and uses the configured endpoint/model for network calls.

- [ ] T024 [US3] Implement environment-driven AI adapter configuration: `src/services/ai/openaiAdapter.ts`, `src/services/ai/index.ts` (use `src/utils/config.ts`)
- [ ] T025 [US3] Document environment variables and runtime configuration in `docs/quickstart.md` and update `.env.example`


---

## Phase N: Polish & Cross-Cutting Concerns

- [ ] T027 [P] Accessibility and keyboard navigation fixes for core flows: update components under `src/components/` and relevant feature components
- [ ] T028 Code cleanup, docs, and release checklist: update `README.md`, `docs/quickstart.md`, and add `CHANGELOG.md`

---

## Dependencies & Execution Order

- Phase 1 → Phase 2 (Foundational) must complete before most user-story implementation.
- User Stories US1 and US2 are both Priority P1 and should be implemented first (can run in parallel after foundational tasks complete).
- US3 is P2 and follows P1 work; however small env/config work can be done earlier in parallel.

---

## Summary

- Total tasks: 28
- Tasks per story: US1=8, US2=4, US3=3 (rest are setup/foundational/polish)
- Suggested MVP scope: Complete Phase 1 + Phase 2 + Phase 3 (User Story 1) — enough to demo core flow.
- Validation: All tasks follow checklist format with Task IDs, optional `[P]` markers, and `[USx]` story labels where required.
