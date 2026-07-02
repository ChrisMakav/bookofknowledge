'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { login, type ActionResult } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

function Field({
  label,
  name,
  type = 'text',
  autoComplete,
  required,
}: {
  label:        string
  name:         string
  type?:        string
  autoComplete?: string
  required?:    boolean
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
        required={required}
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

export function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const [state, formAction, pending] = useActionState(login, undefined as ActionResult | undefined)

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {redirectTo && (
        <input type="hidden" name="redirectTo" value={redirectTo} />
      )}

      <div className="mb-1">
        <h1 className="text-2xl font-bold font-display text-text-primary">Bon retour !</h1>
        <p className="text-sm text-text-secondary mt-1">Connectez-vous à votre compte Book of Knowledge.</p>
      </div>

      {state?.error && (
        <p role="alert" className="text-sm text-error bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {state.error}
        </p>
      )}

      <Field label="Email" name="email" type="email" autoComplete="email" required />
      <Field label="Mot de passe" name="password" type="password" autoComplete="current-password" required />

      <div className="flex justify-end">
        <Link
          href="/mot-de-passe-oublie"
          className="text-xs text-brand-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 rounded"
        >
          Mot de passe oublié ?
        </Link>
      </div>

      <Button type="submit" variant="primary" size="md" loading={pending} className="w-full">
        Se connecter
      </Button>

      <p className="text-center text-sm text-text-secondary">
        Pas encore de compte ?{' '}
        <Link href="/inscription" className="text-brand-600 font-medium hover:underline">
          S&apos;inscrire
        </Link>
      </p>
    </form>
  )
}
