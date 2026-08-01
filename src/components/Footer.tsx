import React from 'react'

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <span>© {new Date().getFullYear()} CertPrep</span>
        <div style={{ display: 'flex', gap: 12 }}>
          <a href="https://www.linkedin.com/in/atulkharecha/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="https://github.com/Atul-Arc/CertPrep" target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>
      </div>
    </footer>
  )
}
