'use client'

import { useState, useTransition } from 'react'
import { togglePromoCode } from '@/actions/admin/promo-codes'

export function PromoCodeToggle({ id, active }: { id: string; active: boolean }) {
  const [enabled, setEnabled] = useState(active)
  const [isPending, start]    = useTransition()

  function handleToggle() {
    const next = !enabled
    setEnabled(next)
    start(async () => {
      const res = await togglePromoCode(id, next)
      if (res.error) setEnabled(enabled)
    })
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      aria-label={enabled ? 'Désactiver' : 'Activer'}
      className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-brand-600 disabled:opacity-50 ${
        enabled ? 'bg-brand-600' : 'bg-border'
      }`}
    >
      <span
        className={`pointer-events-none inline-block size-4 rounded-full bg-white shadow transition-transform ${
          enabled ? 'translate-x-4' : 'translate-x-0'
        }`}
      />
    </button>
  )
}
