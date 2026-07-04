'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createPromoCode } from '@/actions/admin/promo-codes'

export default function NewPromoCodePage() {
  const router = useRouter()
  const [error, setError]    = useState<string | null>(null)
  const [isPending, start]   = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    start(async () => {
      const res = await createPromoCode(formData)
      if (res.error) {
        setError(res.error)
      } else {
        router.push('/admin/codes-promo')
      }
    })
  }

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <div className="flex items-center gap-3">
        <Link href="/admin/codes-promo"
          className="size-8 flex items-center justify-center rounded-lg text-text-muted hover:bg-surface-subtle hover:text-text-primary transition-colors">
          <ArrowLeft size={16} />
        </Link>
        <h1 className="text-2xl font-bold font-display text-text-primary">Nouveau code promo</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-surface-card rounded-xl border border-border p-6 flex flex-col gap-5">
        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-text-primary" htmlFor="code">Code</label>
          <input
            id="code" name="code" required
            placeholder="EX: SOLDES20"
            className="h-10 px-3 rounded-lg border border-border bg-surface-page text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-600 uppercase"
            onChange={(e) => e.target.value = e.target.value.toUpperCase()}
          />
          <p className="text-xs text-text-muted">Le code sera automatiquement mis en majuscules.</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-text-primary" htmlFor="type">Type de réduction</label>
            <select id="type" name="type" required
              className="h-10 px-3 rounded-lg border border-border bg-surface-page text-sm text-text-primary focus:outline-none focus:border-brand-600">
              <option value="percentage">Pourcentage (%)</option>
              <option value="fixed">Montant fixe (€)</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-text-primary" htmlFor="value">Valeur</label>
            <input
              id="value" name="value" type="number" required min="0.01" step="0.01"
              placeholder="20"
              className="h-10 px-3 rounded-lg border border-border bg-surface-page text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-text-primary" htmlFor="expires_at">Date d'expiration</label>
            <input
              id="expires_at" name="expires_at" type="date"
              className="h-10 px-3 rounded-lg border border-border bg-surface-page text-sm text-text-primary focus:outline-none focus:border-brand-600"
            />
            <p className="text-xs text-text-muted">Laisser vide = sans limite.</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-text-primary" htmlFor="usage_limit">Limite d'utilisations</label>
            <input
              id="usage_limit" name="usage_limit" type="number" min="1" step="1"
              placeholder="100"
              className="h-10 px-3 rounded-lg border border-border bg-surface-page text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-600"
            />
            <p className="text-xs text-text-muted">Laisser vide = illimité.</p>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={isPending}
            className="h-10 px-6 rounded-lg bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 disabled:opacity-50 transition-colors">
            {isPending ? 'Création…' : 'Créer le code'}
          </button>
          <Link href="/admin/codes-promo"
            className="h-10 px-4 rounded-lg border border-border text-sm text-text-secondary hover:bg-surface-subtle transition-colors flex items-center">
            Annuler
          </Link>
        </div>
      </form>
    </div>
  )
}
