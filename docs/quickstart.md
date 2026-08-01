# Quickstart

CertPrep is an AI-powered practice exam generator for learners preparing for professional certifications and academic exams (AWS, Azure, GCP, CompTIA, PMP, PRINCE2, and more). Upload any PDF study guide or text document and CertPrep generates targeted multiple-choice practice questions using AI, then walks you through a realistic exam experience with scoring and per-question review.

Environment variables (place in `.env` during development):

- `VITE_AI_API_KEY` — API key for the AI provider (optional for mock adapter).
- `VITE_AI_ENDPOINT` — Full URL to the AI provider endpoint (if set, the OpenAI adapter will be used).
- `VITE_AI_MODEL` — Model name, e.g. `gpt-4o-mini`.
- `VITE_AI_TIMEOUT_MS` — Request timeout in milliseconds.

Start development server:

```powershell
npm install
npm run dev
```
