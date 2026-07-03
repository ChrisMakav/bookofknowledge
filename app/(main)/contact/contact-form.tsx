'use client'

import { useActionState } from 'react'
import { CheckCircle } from 'lucide-react'
import { sendContactMessage } from '@/actions/contact'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { ActionResult } from '@/actions/auth'

function Field({ label, name, type = 'text', placeholder, required = true, className }: {
  label:       string
  name:        string
  type?:       string
  placeholder?: string
  required?:   boolean
  className?:  string
}) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={name} className="text-xs font-semibold uppercase tracking-wider text-text-muted">
        {label}{required && <span className="text-error ml-0.5">*</span>}
      </label>
      {type === 'textarea' ? (
        <textarea
          id={name} name={name} rows={5} placeholder={placeholder} required={required}
          className="w-full rounded-lg border border-border bg-surface-page px-3 py-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 resize-none"
        />
      ) : (
        <input
          id={name} name={name} type={type} placeholder={placeholder} required={required}
          className="h-9 w-full rounded-lg border border-border bg-surface-page px-3 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
        />
      )}
    </div>
  )
}

export function ContactForm() {
  const [state, formAction, pending] = useActionState(
    sendContactMessage,
    undefined as ActionResult | undefined,
  )

  if (state?.success) {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <div className="size-14 rounded-full bg-green-50 flex items-center justify-center">
          <CheckCircle size={28} className="text-green-600" />
        </div>
        <h3 className="font-display text-lg font-bold text-text-primary">Message envoyé !</h3>
        <p className="text-sm text-text-secondary max-w-sm">
          Merci pour votre message. Nous vous répondrons dans les 24 à 48h ouvrées.
        </p>
      </div>
    )
  }

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {state?.error && (
        <p role="alert" className="text-sm text-error bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {state.error}
        </p>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Nom" name="name" placeholder="Jean Dupont" />
        <Field label="Email" name="email" type="email" placeholder="vous@email.com" />
      </div>

      <Field label="Sujet" name="subject" placeholder="Commande, partenariat, question…" />
      <Field label="Message" name="message" type="textarea" placeholder="Décrivez votre demande…" />

      <Button type="submit" variant="primary" size="md" loading={pending} className="self-start">
        Envoyer le message
      </Button>
    </form>
  )
}
