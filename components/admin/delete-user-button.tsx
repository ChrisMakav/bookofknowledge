'use client'

import { useState, useTransition } from 'react'
import { Trash2 } from 'lucide-react'
import { deleteUser } from '@/actions/admin/users'

export function DeleteUserButton({ userId, name }: { userId: string; name: string }) {
  const [confirming, setConfirming] = useState(false)
  const [isPending, start]          = useTransition()
  const [error, setError]           = useState<string | null>(null)

  function handleDelete() {
    start(async () => {
      const res = await deleteUser(userId)
      if (res.error) {
        setError(res.error)
        setConfirming(false)
      }
    })
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-1.5">
        {error && <span className="text-xs text-red-500">{error}</span>}
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="h-7 px-2 rounded text-xs font-semibold bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
        >
          {isPending ? '…' : 'Confirmer'}
        </button>
        <button
          onClick={() => { setConfirming(false); setError(null) }}
          disabled={isPending}
          className="h-7 px-2 rounded text-xs font-semibold text-text-muted hover:text-text-primary hover:bg-surface-subtle transition-colors"
        >
          Annuler
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      title={`Supprimer ${name}`}
      className="size-7 flex items-center justify-center rounded text-text-muted hover:text-red-600 hover:bg-red-50 transition-colors"
    >
      <Trash2 size={13} />
    </button>
  )
}
