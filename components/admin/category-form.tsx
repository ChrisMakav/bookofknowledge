'use client'

import { useActionState } from 'react'
import { Button } from '@/components/ui/button'
import type { ActionResult } from '@/actions/auth'
import type { Category } from '@/types'

function Field({ label, name, type = 'text', defaultValue, placeholder }: {
  label:         string
  name:          string
  type?:         string
  defaultValue?: string | null
  placeholder?:  string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-xs font-semibold uppercase tracking-wider text-text-muted">{label}</label>
      {type === 'textarea' ? (
        <textarea
          id={name} name={name} defaultValue={defaultValue ?? ''} rows={3}
          className="w-full rounded-lg border border-border bg-surface-page px-3 py-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 resize-none"
        />
      ) : (
        <input
          id={name} name={name} type={type}
          defaultValue={defaultValue ?? ''} placeholder={placeholder}
          className="h-9 w-full rounded-lg border border-border bg-surface-page px-3 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
        />
      )}
    </div>
  )
}

interface CategoryFormProps {
  action:    (prev: ActionResult | undefined, formData: FormData) => Promise<ActionResult>
  category?: Partial<Category>
}

export function CategoryForm({ action, category }: CategoryFormProps) {
  const [state, formAction, pending] = useActionState(action, undefined as ActionResult | undefined)

  return (
    <form action={formAction} className="flex flex-col gap-5 max-w-lg">
      {state?.error && (
        <p role="alert" className="text-sm text-error bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {state.error}
        </p>
      )}
      <Field label="Nom" name="name" defaultValue={category?.name} placeholder="Développement personnel" />
      <Field label="Slug" name="slug" defaultValue={category?.slug} placeholder="developpement-personnel" />
      <Field label="Description" name="description" type="textarea" defaultValue={category?.description} />
      <div className="flex gap-3">
        <Button type="submit" variant="primary" size="md" loading={pending}>
          {category?.id ? 'Enregistrer' : 'Créer la catégorie'}
        </Button>
        <Button type="button" variant="secondary" size="md" onClick={() => history.back()}>
          Annuler
        </Button>
      </div>
    </form>
  )
}
