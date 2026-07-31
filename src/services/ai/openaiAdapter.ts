import type { IAiProvider, GenerateExamRequest, GenerateExamResponse } from './index'
import { getConfig } from '../../utils/config'
import { buildExamMessages } from './promptBuilder'
import { normalizeResponse } from './responseNormalizer'

export default class OpenAIAdapter implements IAiProvider {
  private cfg = getConfig()

  async generateExam(req: GenerateExamRequest): Promise<GenerateExamResponse> {
    const { system, user } = buildExamMessages(req.text, req.questionCount)

    // Chat completions format — compatible with OpenAI, Azure OpenAI, and most hosted models
    const payload = {
      model: this.cfg.model,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 4000,
    }

    console.group('[CertPrep] AI request')
    console.log('Endpoint:', this.cfg.endpoint)
    console.log('Model:', this.cfg.model)
    console.log('System message:\n', system)
    console.log('User message (preview):\n', user.slice(0, 500))
    console.groupEnd()

    const endpoint = this.cfg.endpoint
    if (!endpoint) throw new Error('AI endpoint not configured')

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.cfg.apiKey ? { Authorization: `Bearer ${this.cfg.apiKey}` } : {}),
      },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const errText = await res.text().catch(() => '')
      throw new Error(`AI provider returned ${res.status}${errText ? ': ' + errText.slice(0, 200) : ''}`)
    }

    const json = await res.json()
    console.log('[CertPrep] Raw AI response:', JSON.stringify(json).slice(0, 500))
    const normalized = normalizeResponse(json, req.questionCount)
    return normalized
  }
}
