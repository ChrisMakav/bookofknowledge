'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { resetPassword, type ActionResult } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function ForgotPasswordPage() {
  const [state, formAction, pending] = useActionState(resetPassword, undefined as ActionResult | undefined)

  if (state?.success) {
    return (
      <div className="flex flex-col items-center gap-4 py-4 text-center">
        <div className="size-12 rounded-full bg-brand-50 flex items-center justify-center text-2xl">
          ✉️
        </div>
        <h2 className="text-xl font-bold text-text-primary">Email envoyé !</h2>
        <p className="text-sm text-text-secondary">
          Si un compte existe avec cette adresse, vous recevrez un lien de réinitialisation dans quelques minutes.
        </p>
        <Link href="/connexion" className="text-sm text-brand-600 font-medium hover:underline">
          Retour à la connexion
        </Link>
      </div>
    )
  }

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold font-display text-text-primary">Mot de passe oublié</h1>
        <p className="text-sm text-text-secondary mt-1">
          Entrez votre email et nous vous enverrons un lien de réinitialisation.
        </p>
      </div>

      {state?.error && (
        <p role="alert" className="text-sm text-error bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {state.error}
        </p>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-text-primary">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className={cn(
            'h-10 w-full rounded-lg border border-border bg-surface-page px-3 text-sm text-text-primary',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:border-transparent',
          )}
        />
      </div>

      <Button type="submit" variant="primary" size="md" loading={pending} className="w-full">
        Envoyer le lien
      </Button>

      <Link href="/connexion" className="text-center text-sm text-brand-600 hover:underline">
        Retour à la connexion
      </Link>
    </form>
  )
}
