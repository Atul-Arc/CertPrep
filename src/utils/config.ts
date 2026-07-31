export function getConfig() {
  const env = (import.meta as any).env
  return {
    apiKey: env.VITE_AI_API_KEY,
    endpoint: env.VITE_AI_ENDPOINT,
    model: env.VITE_AI_MODEL || 'gpt-4o-mini',
    timeoutMs: Number(env.VITE_AI_TIMEOUT_MS) || 30000,
  }
}
