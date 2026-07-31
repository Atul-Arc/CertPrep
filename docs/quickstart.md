# Quickstart

This project is a frontend SPA that generates mock exams from uploaded PDFs.

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
