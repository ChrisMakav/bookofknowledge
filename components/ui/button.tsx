'use client'

import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const variants = {
  primary:
    'bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800',
  secondary:
    'border border-brand-600 text-brand-600 hover:bg-surface-subtle active:bg-brand-100',
  ghost:
    'text-text-secondary hover:bg-surface-subtle hover:text-text-primary',
  icon:
    'text-text-secondary hover:bg-surface-subtle hover:text-text-primary',
} as const

const sizes = {
  sm: 'h-8 px-3 text-sm rounded-button gap-1.5',
  md: 'h-10 px-4 text-sm rounded-button gap-2',
  lg: 'h-12 px-6 text-base rounded-button gap-2.5',
} as const

const iconSizes = {
  sm: 'size-8 rounded-button',
  md: 'size-9 rounded-button',
  lg: 'size-10 rounded-button',
} as const

type Variant = keyof typeof variants
type Size    = keyof typeof sizes

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:    Variant
  size?:       Size
  loading?:    boolean
  icon?:       React.ReactNode
  iconAfter?:  React.ReactNode
}

export function Button({
  variant = 'primary',
  size    = 'md',
  loading = false,
  icon,
  iconAfter,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const isIcon = variant === 'icon'

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-semibold',
        'transition-all duration-[var(--duration-base)] ease-[var(--ease-default)]',
        'focus-visible:outline-none focus-visible:ring-2',
        'focus-visible:ring-brand-600 focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
        isIcon ? iconSizes[size] : sizes[size],
        variants[variant],
        className,
      )}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <>
          {icon}
          {children}
          {iconAfter}
        </>
      )}
    </button>
  )
}
