'use client'

import { Search, X } from 'lucide-react'
import { useState, useRef } from 'react'
import { cn } from '@/lib/utils'

interface SearchInputProps {
  placeholder?: string
  value?:       string
  onChange?:    (value: string) => void
  onSearch?:    (value: string) => void
  className?:   string
}

export function SearchInput({
  placeholder = 'Rechercher des livres…',
  value: controlledValue,
  onChange,
  onSearch,
  className,
}: SearchInputProps) {
  const [internalValue, setInternalValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const value = controlledValue ?? internalValue

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    setInternalValue(v)
    onChange?.(v)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') onSearch?.(value)
    if (e.key === 'Escape') {
      setInternalValue('')
      onChange?.('')
      inputRef.current?.blur()
    }
  }

  const handleClear = () => {
    setInternalValue('')
    onChange?.('')
    inputRef.current?.focus()
  }

  return (
    <div className={cn('relative flex items-center', className)}>
      <Search
        size={16}
        className="absolute left-3 text-text-muted pointer-events-none"
        aria-hidden
      />

      <input
        ref={inputRef}
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className={cn(
          'h-9 w-full pl-9 pr-9 text-sm',
          'bg-surface-page rounded-input border border-border',
          'text-text-primary placeholder:text-text-muted',
          'transition-colors duration-[var(--duration-fast)]',
          'focus:outline-none focus:border-brand-600 focus:shadow-sm',
          'hover:border-border-strong',
        )}
      />

      {value && (
        <button
          onClick={handleClear}
          aria-label="Effacer la recherche"
          className={cn(
            'absolute right-3 text-text-muted hover:text-text-primary',
            'transition-colors duration-[var(--duration-fast)]',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 rounded-sm',
          )}
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}
