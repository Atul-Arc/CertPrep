# Feature Specification: CretPrep — AI Mock Exam Generator

**Feature Branch**: `001-cretprep-mock-exams`

**Created**: 2026-07-29

**Status**: Draft

**Input**: User description: "Build a web app called CretPrep that generates AI-powered mock certification exams from study material. The user uploads a certification study guide PDF (processed in-memory only, no storage) and chooses how many questions to generate (e.g., 10, 20, 50, or custom). The uploaded document is the only knowledge source for generating the exam. The AI should return structured JSON containing: Exam title; Requested number of multiple-choice questions; Four options per question; Correct answer; Optional explanation. The app should validate the AI response before rendering. The exam experience should resemble a real certification exam: Show one question at a time; Four answer options; Previous/Next navigation; Question indicator (e.g., 3/10); Immediate evaluation after answer selection; Highlight the correct answer; Update the score; Prevent changing an answered question. After the exam, display a results page with: Final score and percentage; Correct vs. incorrect count; Review of every question with the user's answer, correct answer, and explanation (if available). The application does not require authentication or a database. All data exists only during the current session. AI provider settings (API key, endpoint, model, etc.) must be configurable through environment variables. The solution should be robust, user-friendly, and easily extensible to support additional document types and future exam modes."

## User Scenarios *(mandatory)*

### User Story 1 - Generate and take an exam (Priority: P1)

As a candidate preparing for a certification, I want to upload my study guide PDF, choose how many multiple-choice questions to generate, and take a mock exam that mimics the certification experience so I can evaluate readiness.

**Why this priority**: Core product value—creates and delivers the mock exam experience from user-provided material.

(Acceptance criteria described below cover the expected observable behavior for the user flow.)

**Acceptance Scenarios**:

1. **Given** a PDF is uploaded and the user requests N questions, **When** the user starts the exam, **Then** the app shows question 1/ N with four options.
2. **Given** the user selects an answer for a question, **When** they confirm, **Then** the app immediately evaluates and highlights the correct answer and updates the score; the user cannot change that answer later.
3. **Given** the user navigates using Previous/Next, **When** they visit answered questions, **Then** answers are readonly and show evaluation state.
4. **Given** the user completes the last question, **When** they view results, **Then** the results page shows final score, percentage, counts of correct/incorrect, and a question-by-question review including explanations if provided by AI.

---

### User Story 2 - Validate AI responses (Priority: P1)

As a product owner, I want the app to verify the AI's structured JSON response to ensure required fields are present and well-formed before rendering the exam, so users aren't served malformed or incomplete exams.

**Why this priority**: Safety and reliability—protects user experience from hallucinated or malformed AI outputs.

The system must surface validation errors with actionable guidance (retry, regenerate, adjust input) when AI responses are malformed.

**Acceptance Scenarios**:

1. **Given** the AI returns JSON, **When** the app validates it, **Then** missing or invalid fields cause a visible error with a retry option.
2. **Given** the AI returns extra fields, **When** the JSON is valid for required schema, **Then** the app ignores unknown fields and proceeds.

---

### User Story 3 - Configurable AI provider (Priority: P2)

As an integrator, I want AI settings (API key, endpoint, model) configurable through environment variables so the app can be deployed with different providers or models without code changes.

**Why this priority**: Deployment flexibility and security—keeps secrets out of source and supports multiple providers.

Verify the app reads AI configuration from environment variables at runtime and uses those values for API calls.

**Acceptance Scenarios**:

1. **Given** environment variables for AI settings, **When** the app triggers generation, **Then** network calls use the configured endpoint and model.

---

### Edge Cases

- Very large PDFs: App should show progress and limit pages/topics used for question generation if needed (graceful failure or partial coverage).
- Malformed or scanned PDFs: If text extraction fails, present a clear error and instructions (e.g., suggest OCR or uploading a text version).
- AI rate limits/errors: Surface friendly retry options and backoff messaging.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST accept a PDF upload and process it in-memory only; no server-side persistent storage is allowed. Client-side ephemeral storage (for example, `sessionStorage` or in-memory only) MAY be used solely to improve page-refresh resilience. Any use of client-side ephemeral storage MUST be documented, default to disabled, provide a clear Time-To-Live (TTL) or explicit user-consent opt-in, and be cleared when the session ends. Any storage beyond client-side ephemeral storage (including server-side proxies that persist user content) is prohibited unless a documented constitution exception is granted.
- **FR-002**: System MUST allow the user to choose the number of questions to generate (predefined choices 10/20/50 and a custom numeric input).
- **FR-003**: System MUST send the extracted document content as the sole knowledge source to the AI prompt; no external knowledge sources may be used for generation.
- **FR-004**: The AI must return structured JSON with: Exam title, requested question count, questions array; each question includes text, four options, correct answer index/identifier, and optional explanation.
- **FR-005**: System MUST validate the AI JSON against a strict schema before using it to render the exam and present clear retry/regenerate options on validation failure.
- **FR-006**: The exam UI MUST present one question at a time with four options, navigation (Previous/Next), and a question progress indicator (e.g., 3/10).
- **FR-007**: On answer selection, the UI MUST evaluate the answer immediately, highlight the correct answer, lock the question from further changes, and update the session score.
- **FR-008**: The results page MUST show final score, percentage, counts of correct and incorrect answers, and allow review of each question with the user's answer, correct answer, and explanation if available.
- **FR-009**: System MUST keep all exam state client-side in memory for the session. Optionally, the system MAY persist ephemeral state to browser storage (e.g., `sessionStorage` or IndexedDB) strictly for page-refresh resilience; this behavior MUST be documented, default to disabled, include a TTL or explicit user opt-in, and ensure data is cleared on session end. Persistence that exposes user content outside the client (server-side storage or long-lived proxies) is not permitted without a constitution exception.
- **FR-010**: No authentication or database is required or provided in v1.
- **FR-011**: AI provider settings (API key, endpoint, model, timeout) MUST be configurable via environment variables.
- **FR-012**: The app MUST provide clear UX for errors from AI or document parsing with actionable next steps.

### Key Entities

- **Exam**: title, questionCount, questions[]
- **Question**: id, text, options[4], correctOptionIndex, explanation?
- **Option**: id, text
- **Session**: currentQuestionIndex, answers[{questionId, selectedIndex, correct, timestamp}], score

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can upload a PDF and generate a 10-question exam within 30 seconds for average-sized study guides (up to 50 pages).
- **SC-002**: 95% of generated exams pass schema validation on first AI response for well-formed PDFs.
- **SC-003**: Users complete the mock exam flow with an error-free UI in 99% of sessions (errors logged and actionable messaging for the remainder).
- **SC-004**: At least 90% of users report the mock exam as "useful" in quick usability testing (qualitative metric gathered separately).

## Assumptions

- The uploaded PDF contains selectable text; OCR and image-only PDFs are out-of-scope for v1 but should be detectable and produce guidance.
- All processing happens client-side (or in ephemeral serverless functions if necessary) and no persistent storage is used for user content in v1.
- Environment variables are available at build/run time to configure AI provider settings.
- The AI provider supports a JSON-output-capable model and reasonable prompt-control for producing structured JSON.

## Architecture Constraints (CretPrep)

- **ARCH-001**: The project MUST be frontend-first; no long-lived backend or database is required for v1. Short-lived serverless proxy for AI calls is allowed if required by provider CORS/security.
- **ARCH-002**: Primary implementation stack SHOULD be React + TypeScript to follow existing project conventions and enable strong typing for schema validation.
- **ARCH-003**: Data persistence for application state SHOULD be local-first (in-memory for session) and optional ephemeral storage (sessionStorage/localStorage) for resilience only.

