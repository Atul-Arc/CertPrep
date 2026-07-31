import React from 'react'

export default function Toast({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ position: 'fixed', right: 20, bottom: 20, background: '#111827', color: 'white', padding: 12, borderRadius: 8 }}>{children}</div>
  )
}
