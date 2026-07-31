import React, { useState } from 'react'
import UploadDropzone from './features/document-upload/components/UploadDropzone'
import ExamPage from './features/exam-player/ExamPage'
import ResultsPage from './features/results/ResultsPage'
import GenerationStatusModal from './features/exam-generation/components/GenerationStatusModal'
import { useGenerationStore } from './state/store'

const VIEW_LABEL: Record<string, string> = {
  upload: 'Upload & Configure',
  exam: 'Taking Exam',
  results: 'Results',
}

export default function App() {
  const [view, setView] = useState<'upload' | 'exam' | 'results'>('upload')
  const status = useGenerationStore((s) => s.status)

  return (
    <>
      <header className="app-header">
        <span className="app-header__logo">CertPrep</span>
        <span className="app-header__sub">AI Mock Exam Generator</span>
        <span className="app-header__badge">{VIEW_LABEL[view]}</span>
      </header>

      <main className="page-container">
        {view === 'upload' && (
          <UploadDropzone onGenerated={() => setView('exam')} />
        )}

        {view === 'exam' && (
          <ExamPage onFinish={() => setView('results')} onBack={() => setView('upload')} />
        )}

        {view === 'results' && <ResultsPage onBack={() => setView('upload')} />}
      </main>

      {(status === 'running' || status === 'failed') && <GenerationStatusModal />}
    </>
  )
}
