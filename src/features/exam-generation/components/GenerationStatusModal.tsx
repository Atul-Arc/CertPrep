import React from 'react'
import Modal from '../../../components/ui/Modal'
import { useGenerationStore } from '../../../state/store'
import ValidationErrorPanel from './ValidationErrorPanel'

export default function GenerationStatusModal() {
  const status = useGenerationStore((s) => s.status)
  const error = useGenerationStore((s) => s.error)

  if (status === 'failed') return <ValidationErrorPanel />

  return (
    <Modal>
      <div>
        <h3>Generation</h3>
        <div>Status: {status}</div>
      </div>
    </Modal>
  )
}
