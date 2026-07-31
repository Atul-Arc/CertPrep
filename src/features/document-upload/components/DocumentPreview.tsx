import React from 'react'

export default function DocumentPreview({ text }: { text: string }) {
  return (
    <div style={{ border: '1px solid #e5e7eb', padding: 12, borderRadius: 8, maxHeight: 200, overflow: 'auto' }}>
      <pre style={{ whiteSpace: 'pre-wrap' }}>{text.slice(0, 1000)}</pre>
    </div>
  )
}
