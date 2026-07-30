<!--
Sync Impact Report
Version change: none → 1.0.0
Modified principles: Set of mandatory frontend, AI-first, agent-oriented, spec-driven rules
Added sections: Agent Roles, AI Provider Abstraction, Definition of Done
Removed sections: none
Templates requiring updates:
- .specify/templates/plan-template.md ✅ updated
- .specify/templates/spec-template.md ✅ updated
- .specify/templates/tasks-template.md ✅ updated
Follow-up TODOs: none
-->

# CretPrep Constitution

## Core Principles

### 1. Frontend-Only Architecture (NON-NEGOTIABLE)
- The project MUST be implemented as a frontend-only application. The runtime MUST NOT include any custom backend API servers or server-side databases. The ONLY external network calls permitted from the client are to AI LLM providers and other third-party services that are explicitly approved in a specification exception. Any deviation requires a documented exception and governance approval.

### 2. Technology Stack
- The primary implementation stack MUST be React + TypeScript. TypeScript strict mode (`strict`) MUST be enabled in all packages. Build-time or developer tooling MAY use other languages, but runtime business logic and UI MUST be TypeScript/React.

### 3. Component-Based Architecture
- The UI MUST be organized as reusable, well-typed components with clear separation of concerns (presentation vs. orchestration). Components MUST be library-ready, documented, and verified through agreed acceptance checks.

### 4. AI-First Design
- Knowledge generation, question-answering, content synthesis, and other domain reasoning MUST be delegated to specialized AI agents. The client UI orchestrates agents and presents validated outputs; it MUST NOT embed domain logic that duplicates agent responsibilities.

### 5. Agent-Oriented Architecture
- Agents MUST be first-class, explicitly defined artifacts. Each agent MUST declare:
	- `role`: short descriptive role name
	- `responsibility`: one-line accountability statement
	- `inputs`: typed JSON schema for inputs
	- `outputs`: typed JSON schema for outputs
	- `errors`: structured error schema
- Agents' outputs MUST be structured JSON that conforms to their declared schemas. Free-text MAY be included only as an auxiliary field; core data MUST be machine-parseable.

### 6. Specification-Driven Development
- EVERY feature MUST begin with a written specification (`specs/[feature]/spec.md`) that includes user stories, acceptance criteria, success metrics, and architecture constraints. No implementation work MAY begin until the specification is reviewed and linked in the implementation branch.

### 7. Strong Typing and Clean Code
- Code MUST use explicit types; `any` is DISCOURAGED and MUST be justified in a PR. The project MUST enforce linting, formatting, and type-checking in CI. Code MUST be readable, maintainable, and accompanied by verification steps as agreed per feature spec.

### 8. Reusable UI & Design System
- The project MUST include a design system with tokens, primitives, and documented components. New visual elements MUST be added to the system rather than duplicated in feature code.

### 9. Responsive, and Performant UX
- Views MUST be responsive across common screen sizes and respect performance budgets (e.g., first meaningful paint, interaction readiness).

### 10. AI Provider Abstraction
- All integrations with LLM providers MUST be encapsulated behind an abstraction layer. Provider adapters MAY be switched without changes to higher-level business logic. API keys MUST NOT be stored in the repository; development keys MUST be kept in environment variables or secure developer secret stores.

### 11. Validation of AI Responses
- All AI responses MUST be validated against declared JSON schemas before rendering. The client MUST sanitize and handle unexpected or malicious content gracefully. When validation fails, the UI MUST show a safe fallback and log the incident for investigation.

### 12. Security Best Practices
- Secrets and API keys MUST NEVER be checked into source control. The application MUST minimize user data exposure, avoid persisting PII to third-party services, and provide clear privacy disclosures in `README.md`.

### 13. Local-First State Management
- Persistent state MUST be local-first using browser storage primitives (IndexedDB, localStorage, or secure equivalents). Any data persisted locally MUST be scoped, encrypted where required, and purged per the project's privacy policy.

### 14. Documentation
- The project README.md MUST contain architecture overview, development setup, how to add or swap AI providers, agent role definitions, and the Definition of Done checklist. Feature-level docs MUST live under `specs/[feature]`.

### 15. Code Quality and Reuse
- Duplicate or copy-pasted code MUST be refactored into reusable components or utilities. PRs MUST demonstrate rationale for any deviation from reuse.

## Definition of Done (Feature-level)
- A feature is NOT done until all of the following are completed and merged:
 	- A reviewed `specs/[feature]/spec.md` exists and is linked from the branch
 	- Type checks pass with `strict` TypeScript settings
 	- Linting and formatting checks pass
 	- Verification steps for new components and agent logic completed (as agreed per spec)
 	- Accessibility audit performed for affected views (automated or manual)
 	- AI responses validated against declared schemas; mock provider or manual verification performed as appropriate
 	- Provider abstraction has a mocked adapter available for local verification or CI if requested
 	- README and quickstart updated with feature notes
 	- PR has at least one approver (two recommended) and CI green

## Governance
- The constitution supersedes informal conventions. Amendments MUST follow this process:
 1. File a PR against `.specify/memory/constitution.md` describing the change and rationale.
 2. The PR MUST include a migration/compatibility plan if the change affects implementation.
 3. At least two reviewers MUST approve the PR and CI MUST be green prior to merge.

**Versioning Policy**:
- MAJOR: Backward-incompatible governance or principle removals/renames.
- MINOR: Addition of a new principle or material expansion of guidance.
- PATCH: Editorial clarifications, wording fixes, or non-semantic refinements.

**Version**: 1.0.0 | **Ratified**: 2026-07-29 | **Last Amended**: 2026-07-29
