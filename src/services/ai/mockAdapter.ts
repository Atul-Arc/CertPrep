import type { IAiProvider, GenerateExamRequest, GenerateExamResponse } from './index'

export default class MockAdapter implements IAiProvider {
  async generateExam(req: GenerateExamRequest): Promise<GenerateExamResponse> {
    // Return a deterministic mock response for development & tests
    const questions = Array.from({ length: req.questionCount }).map((_, i) => ({
      id: `q${i + 1}`,
      text: `Mock question ${i + 1} based on provided document excerpt`,
      options: [
        { id: 'a', text: 'Option A' },
        { id: 'b', text: 'Option B' },
        { id: 'c', text: 'Option C' },
        { id: 'd', text: 'Option D' },
      ],
      correctIndex: 0,
      explanation: 'Because this is a mock.'
    }))

    return { title: 'Mock Exam', questionCount: req.questionCount, questions }
  }
}
