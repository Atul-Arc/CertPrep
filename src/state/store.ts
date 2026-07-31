import { create } from 'zustand'

type GenerationState = {
  status: 'idle' | 'running' | 'succeeded' | 'failed'
  error?: string | null
  errorType?: 'validation' | 'network' | 'rate' | 'server' | 'unknown' | null
  lastText?: string | null
  lastQuestionCount?: number | null
  setStatus: (s: GenerationState['status']) => void
  setError: (e?: string | null) => void
  setErrorType: (t?: GenerationState['errorType']) => void
  setLastRequest: (text?: string | null, count?: number | null) => void
}

export const useGenerationStore = create<GenerationState>((set) => ({
  status: 'idle',
  error: null,
  lastText: null,
  lastQuestionCount: null,
  errorType: null,
  setStatus: (s: GenerationState['status']) => set({ status: s }),
  setError: (e?: string | null) => set({ error: e }),
  setErrorType: (t?: GenerationState['errorType']) => set({ errorType: t ?? null }),
  setLastRequest: (text?: string | null, count?: number | null) => set({ lastText: text ?? null, lastQuestionCount: count ?? null }),
}))
