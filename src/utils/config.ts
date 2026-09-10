export function getConfig() {
  const env = (import.meta as any).env
  return {
    apiKey: env.VITE_AI_API_KEY,
    endpoint: env.VITE_AI_ENDPOINT,
    model: env.VITE_AI_MODEL || 'gpt-4o-mini',
    timeoutMs: Number(env.VITE_AI_TIMEOUT_MS) || 30000,
    // maximum tokens requested to the provider (max_tokens)
    tokenLimit: Number(env.VITE_AI_MAX_TOKENS) || 8000,
    // maximum upload size in bytes (UI enforcement)
    maxUploadBytes: Number(env.VITE_MAX_UPLOAD_BYTES) || 900 * 1024,
    // maximum characters we will send to the provider (truncation guard)
    maxInputChars: Number(env.VITE_AI_MAX_INPUT_CHARS) || 12000,
  }
}
