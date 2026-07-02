'use client'

import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface FABProps {
  icon?:    React.ReactNode
  label:    string
  onClick:  () => void
  className?: string
}

export function FAB({
  icon    = <Plus size={24} />,
  label,
  onClick,
  className,
}: FABProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const id = setTimeout(() => setVisible(true), 400)
    return () => clearTimeout(id)
  }, [])

  return (
    <div
      className={cn(
        'transition-all duration-[var(--duration-slow)] ease-[var(--ease-spring)]',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
      )}
    >
      <button
        onClick={onClick}
        aria-label={label}
        className={cn(
          'fixed bottom-5 right-5 z-40',
          'size-14 rounded-full bg-brand-600 text-white',
          'flex items-center justify-center',
          'shadow-lg',
          'transition-all duration-[var(--duration-slow)] ease-[var(--ease-spring)]',
          'hover:shadow-xl hover:-translate-y-0.5 hover:bg-brand-700',
          'active:scale-95 active:shadow-md',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2',
          className,
        )}
      >
        {icon}
      </button>
    </div>
  )
}
