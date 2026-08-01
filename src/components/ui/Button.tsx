import React from 'react'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' }

export default function Button({ variant = 'primary', children, disabled, ...rest }: Props) {
  const style: React.CSSProperties = {
    padding: '8px 12px',
    borderRadius: 6,
    border: 'none',
    background: variant === 'primary' ? '#2563eb' : '#e5e7eb',
    color: variant === 'primary' ? 'white' : '#111827',
    opacity: disabled ? 0.6 : 1,
    cursor: disabled ? 'not-allowed' : 'pointer',
  }

  return (
    <button style={style} disabled={disabled} {...rest}>
      {children}
    </button>
  )
}
