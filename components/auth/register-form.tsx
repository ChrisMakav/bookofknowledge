'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { register, type ActionResult } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

function Field({
  label,
  name,
  type = 'text',
  autoComplete,
}: {
  label:         string
  name:          string
  type?:         string
  autoComplete?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-medium text-text-primary">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required
        className={cn(
          'h-10 w-full rounded-lg border border-border bg-surface-page px-3 text-sm text-text-primary',
          'placeholder:text-text-muted',
          'transition-colors duration-[var(--duration-fast)]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:border-transparent',
        )}
      />
    </div>
  )
}

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(register, undefined as ActionResult | undefined)

  if (state?.success) {
    return (
      <div className="flex flex-col items-center gap-4 py-4 text-center">
        <div className="size-12 rounded-full bg-green-100 flex items-center justify-center text-2xl">
          ✓
        </div>
        <h2 className="text-xl font-bold text-text-primary">Vérifiez vos emails !</h2>
        <p className="text-sm text-text-secondary">
          Un lien de confirmation a été envoyé à votre adresse email. Cliquez dessus pour activer votre compte.
        </p>
        <Link href="/connexion" className="text-sm text-brand-600 font-medium hover:underline">
          Retour à la connexion
        </Link>
      </div>
    )
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="mb-1">
        <h1 className="text-2xl font-bold font-display text-text-primary">Créer un compte</h1>
        <p className="text-sm text-text-secondary mt-1">Rejoignez des milliers de lecteurs passionnés.</p>
      </div>

      {state?.error && (
        <p role="alert" className="text-sm text-error bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {state.error}
        </p>
      )}

      <Field label="Nom complet" name="full_name" autoComplete="name" />
      <Field label="Email" name="email" type="email" autoComplete="email" />
      <Field label="Mot de passe" name="password" type="password" autoComplete="new-password" />
      <Field label="Confirmer le mot de passe" name="confirm_password" type="password" autoComplete="new-password" />

      <Button type="submit" variant="primary" size="md" loading={pending} className="w-full mt-1">
        Créer mon compte
      </Button>

      <p className="text-center text-sm text-text-secondary">
        Déjà un compte ?{' '}
        <Link href="/connexion" className="text-brand-600 font-medium hover:underline">
          Se connecter
        </Link>
      </p>
    </form>
  )
}
