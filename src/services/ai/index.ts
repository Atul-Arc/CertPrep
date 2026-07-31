export interface GenerateExamRequest {
  text: string
  questionCount: number
}

export interface ExamOption { id: string; text: string }
export interface ExamQuestion { id: string; text: string; options: ExamOption[]; correctIndex: number; explanation?: string }
export interface GenerateExamResponse { title: string; questionCount: number; questions: ExamQuestion[] }

export interface IAiProvider {
  generateExam(req: GenerateExamRequest): Promise<GenerateExamResponse>
}

// Default provider is the mock adapter; consumers can swap implementations
import MockAdapter from './mockAdapter'
import OpenAIAdapter from './openaiAdapter'
import { getConfig } from '../../utils/config'

const cfg = getConfig()
export const provider: IAiProvider = cfg.endpoint ? new OpenAIAdapter() : new MockAdapter()
