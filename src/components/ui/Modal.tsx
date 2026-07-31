import React from 'react'

export default function Modal({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ position: 'fixed', inset: 0, display: 'grid', placeItems: 'center', background: 'rgba(0,0,0,0.3)' }}>
      <div style={{ background: 'white', padding: 20, borderRadius: 8, minWidth: 320 }}>{children}</div>
    </div>
  )
}
