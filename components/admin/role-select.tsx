'use client'

import { useState, useTransition } from 'react'
import { Check } from 'lucide-react'
import { updateUserRole } from '@/actions/admin/users'

const ROLES = [
  { value: 'user',  label: 'Utilisateur' },
  { value: 'admin', label: 'Admin' },
] as const

type Role = 'admin' | 'user'

export function RoleSelect({ userId, current }: { userId: string; current: Role }) {
  const [role, setRole]      = useState<Role>(current)
  const [saved, setSaved]    = useState<Role>(current)
  const [isPending, start]   = useTransition()
  const [error, setError]    = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const dirty = role !== saved

  function handleSave() {
    setError(null)
    setSuccess(false)
    start(async () => {
      const res = await updateUserRole(userId, role)
      if (res.error) {
        setError(res.error)
      } else {
        setSaved(role)
        setSuccess(true)
        setTimeout(() => setSuccess(false), 2000)
      }
    })
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={role}
        onChange={(e) => { setRole(e.target.value as Role); setError(null); setSuccess(false) }}
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

      {dirty && (
        <button
          onClick={handleSave}
          disabled={isPending}
          className="h-6 px-2 rounded text-xs font-semibold bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-50 transition-colors"
        >
          {isPending ? '…' : 'Enregistrer'}
        </button>
      )}

      {success && !dirty && (
        <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
          <Check size={12} /> Enregistré
        </span>
      )}

      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  )
}
