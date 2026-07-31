import React from 'react'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' }

export default function Button({ variant = 'primary', children, ...rest }: Props) {
  const style = {
    padding: '8px 12px',
    borderRadius: 6,
    border: 'none',
    background: variant === 'primary' ? '#2563eb' : '#e5e7eb',
    color: variant === 'primary' ? 'white' : '#111827',
  }
  return (
    <button style={style} {...rest}>
      {children}
    </button>
  )
}
