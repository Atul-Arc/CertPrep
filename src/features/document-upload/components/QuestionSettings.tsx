import React from 'react'

export default function QuestionSettings({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <label>Question count:</label>
      <input type="number" min={1} max={50} value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </div>
  )
}
