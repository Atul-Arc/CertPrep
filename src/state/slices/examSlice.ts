import { create } from 'zustand'
import type { ExamQuestion } from '../../services/ai'

type ExamState = {
  questions: ExamQuestion[]
  currentIndex: number
  answers: (number | null)[]  // user's selected option index per question (-1 = skipped)
  setQuestions: (q: ExamQuestion[]) => void
  setCurrentIndex: (i: number) => void
  setAnswer: (questionIndex: number, answerIndex: number) => void
  resetExam: () => void
}

export const useExamStore = create<ExamState>((set) => ({
  questions: [],
  currentIndex: 0,
  answers: [],
  setQuestions: (q: ExamQuestion[]) => set({ questions: q, answers: new Array(q.length).fill(null), currentIndex: 0 }),
  setCurrentIndex: (i: number) => set({ currentIndex: i }),
  setAnswer: (questionIndex: number, answerIndex: number) =>
    set((state) => {
      const answers = [...state.answers]
      answers[questionIndex] = answerIndex
      return { answers }
    }),
  resetExam: () => set({ questions: [], answers: [], currentIndex: 0 }),
}))
