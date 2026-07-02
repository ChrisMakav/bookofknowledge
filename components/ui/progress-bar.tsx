'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface ProgressBarProps {
  value:      number      // 0–100
  finished?:  boolean
  size?:      'sm' | 'md'
  animated?:  boolean
  className?: string
}

export function ProgressBar({
  value,
  finished  = false,
  size      = 'md',
  animated  = true,
  className,
}: ProgressBarProps) {
  const fillRef = useRef<HTMLDivElement>(null)
  const clamped = Math.min(100, Math.max(0, value))
  const pct     = finished ? 100 : clamped

  const fillColor =
    finished || clamped >= 100
      ? 'bg-success'
      : clamped >= 25
      ? 'bg-brand-600'
      : 'bg-brand-200'

  useEffect(() => {
    if (!animated || !fillRef.current) return
    fillRef.current.style.width = '0%'
    const id = requestAnimationFrame(() => {
      if (fillRef.current) fillRef.current.style.width = `${pct}%`
    })
    return () => cancelAnimationFrame(id)
  }, [pct, animated])

  return (
    <div
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={finished ? 'Terminé' : `${clamped}% lu`}
      className={cn(
        'w-full rounded-full overflow-hidden bg-border-subtle',
        size === 'sm' ? 'h-[3px]' : 'h-1',
        className,
      )}
    >
      <div
        ref={fillRef}
        className={cn(
          'h-full rounded-full',
          fillColor,
          animated && 'transition-[width] duration-[var(--duration-slower)] ease-out',
        )}
        style={{ width: animated ? '0%' : `${pct}%` }}
      />
    </div>
  )
}
