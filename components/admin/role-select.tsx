'use client'

import { useState, useTransition } from 'react'
import { updateUserRole } from '@/actions/admin/users'

const ROLES = [
  { value: 'user',  label: 'Utilisateur' },
  { value: 'admin', label: 'Admin' },
] as const

type Role = 'admin' | 'user'

export function RoleSelect({ userId, current }: { userId: string; current: Role }) {
  const [role, setRole]     = useState<Role>(current)
  const [isPending, start]  = useTransition()
  const [error, setError]   = useState<string | null>(null)

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value as Role
    setRole(next)
    setError(null)
    start(async () => {
      const res = await updateUserRole(userId, next)
      if (res.error) {
        setRole(current)
        setError(res.error)
      }
    })
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={role}
        onChange={handleChange}
        disabled={isPending}
        className={`text-xs font-semibold px-2 py-1 rounded-full border appearance-none cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-brand-600 disabled:opacity-60 ${
          role === 'admin'
            ? 'bg-brand-50 text-brand-600 border-brand-200'
            : 'bg-surface-subtle text-text-secondary border-border'
        }`}
      >
        {ROLES.map(({ value, label }) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  )
}
