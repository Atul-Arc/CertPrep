import React from 'react'
import Modal from '../../../components/ui/Modal'
import { useGenerationStore } from '../../../state/store'
import ValidationErrorPanel from './ValidationErrorPanel'

export default function GenerationStatusModal() {
  const status = useGenerationStore((s) => s.status)

  if (status === 'failed') return <ValidationErrorPanel />

  return (
    <Modal>
      <div>
        <h3>Analyzing your document and creating questions...</h3>
        <div>Status: {status === 'running' ? 'in progress' : status}</div>
      </div>
    </Modal>
  )
}
