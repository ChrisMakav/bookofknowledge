'use client'

import { useActionState, useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { ActionResult } from '@/actions/auth'
import type { Author, Book, Category } from '@/types'

function toSlug(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function Field({ label, name, type = 'text', defaultValue, placeholder, className }: {
  label:         string
  name:          string
  type?:         string
  defaultValue?: string | number | null
  placeholder?:  string
  className?:    string
}) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={name} className="text-xs font-semibold uppercase tracking-wider text-text-muted">{label}</label>
      {type === 'textarea' ? (
        <textarea
          id={name} name={name}
          defaultValue={defaultValue ?? ''}
          rows={4}
          className="w-full rounded-lg border border-border bg-surface-page px-3 py-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 resize-none"
        />
      ) : (
        <input
          id={name} name={name} type={type}
          defaultValue={defaultValue ?? ''}
          placeholder={placeholder}
          step={type === 'number' ? '0.01' : undefined}
          className="h-9 w-full rounded-lg border border-border bg-surface-page px-3 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
        />
      )}
    </div>
  )
}

function Checkbox({ label, name, defaultChecked }: { label: string; name: string; defaultChecked?: boolean }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="size-4 rounded accent-brand-600" />
      <span className="text-sm text-text-primary">{label}</span>
    </label>
  )
}

interface BookFormProps {
  action:               (prev: ActionResult | undefined, formData: FormData) => Promise<ActionResult>
  book?:                Partial<Book>
  authors:              Pick<Author, 'id' | 'name'>[]
  categories?:          Pick<Category, 'id' | 'name'>[]
  selectedCategoryIds?: string[]
}

export function BookForm({ action, book, authors, categories, selectedCategoryIds }: BookFormProps) {
  const [state, formAction, pending] = useActionState(action, undefined as ActionResult | undefined)
  const [slug, setSlug]             = useState(book?.slug ?? '')
  const slugEditedRef               = useRef(!!book?.slug)
  const [coverUrl, setCoverUrl]     = useState(book?.cover_url ?? '')
  const [previewSrc, setPreviewSrc] = useState<string | null>(book?.cover_url ?? null)
  const fileInputRef                = useRef<HTMLInputElement>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const objectUrl = URL.createObjectURL(file)
    setPreviewSrc(objectUrl)
    setCoverUrl('')
  }

  function clearFile() {
    if (fileInputRef.current) fileInputRef.current.value = ''
    setPreviewSrc(coverUrl || null)
  }

  return (
    <form action={formAction} className="flex flex-col gap-6 max-w-2xl">
      {state?.error && (
        <div role="alert" className="text-sm text-error bg-red-50 border border-red-200 rounded-lg px-3 py-2 flex items-center justify-between gap-3">
          <span>{state.error}</span>
          {state.redirectTo && (
            <Link
              href={state.redirectTo}
              className="shrink-0 text-xs font-semibold underline hover:no-underline"
            >
              Modifier ce livre →
            </Link>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {/* Title — auto-fills slug */}
        <div className="col-span-2 flex flex-col gap-1.5">
          <label htmlFor="title" className="text-xs font-semibold uppercase tracking-wider text-text-muted">Titre</label>
          <input
            id="title" name="title" type="text"
            defaultValue={book?.title ?? ''}
            onChange={(e) => {
              if (!slugEditedRef.current) setSlug(toSlug(e.target.value))
            }}
            className="h-9 w-full rounded-lg border border-border bg-surface-page px-3 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
          />
        </div>

        {/* Slug — editable, shown value kept in sync */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="slug" className="text-xs font-semibold uppercase tracking-wider text-text-muted">Slug</label>
          <input
            id="slug" name="slug" type="text"
            value={slug}
            placeholder="mon-livre"
            onChange={(e) => {
              slugEditedRef.current = true
              setSlug(e.target.value)
            }}
            onBlur={(e) => setSlug(toSlug(e.target.value))}
            className="h-9 w-full rounded-lg border border-border bg-surface-page px-3 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
          />
        </div>

        <Field label="ISBN" name="isbn" defaultValue={book?.isbn ?? ''} />
      </div>

      {/* Author */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="author_id" className="text-xs font-semibold uppercase tracking-wider text-text-muted">Auteur</label>
        <select
          id="author_id" name="author_id"
          defaultValue={book?.author_id ?? ''}
          className="h-9 w-full rounded-lg border border-border bg-surface-page px-3 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
        >
          <option value="">— Aucun —</option>
          {authors.map((a) => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>
      </div>

      {categories && categories.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">Catégorie</span>
          <div className="grid grid-cols-2 gap-2 rounded-lg border border-border bg-surface-page p-3">
            {categories.map((cat) => (
              <label key={cat.id} className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="category_ids"
                  value={cat.id}
                  defaultChecked={selectedCategoryIds?.includes(cat.id)}
                  className="size-4 rounded accent-brand-600"
                />
                <span className="text-sm text-text-primary">{cat.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Cover */}
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">Couverture</span>
        <div className="flex gap-4 items-start">
          {/* Preview */}
          {previewSrc && (
            <div className="relative shrink-0 w-20 h-28 rounded-lg overflow-hidden border border-border bg-surface-subtle">
              <Image src={previewSrc} alt="Aperçu" fill className="object-cover" unoptimized />
            </div>
          )}
          <div className="flex-1 flex flex-col gap-2">
            {/* URL input */}
            <input
              name="cover_url"
              type="text"
              value={coverUrl}
              placeholder="https://..."
              onChange={(e) => {
                setCoverUrl(e.target.value)
                setPreviewSrc(e.target.value || null)
                if (fileInputRef.current) fileInputRef.current.value = ''
              }}
              className="h-9 w-full rounded-lg border border-border bg-surface-page px-3 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
            />
            <div className="flex items-center gap-2 text-xs text-text-muted">
              <div className="h-px flex-1 bg-border" />
              <span>ou</span>
              <div className="h-px flex-1 bg-border" />
            </div>
            {/* File upload */}
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 h-9 px-3 rounded-lg border border-dashed border-border bg-surface-subtle text-sm text-text-secondary hover:border-brand-600 hover:text-brand-600 cursor-pointer transition-colors">
                <Upload size={14} />
                Télécharger une image
                <input
                  ref={fileInputRef}
                  type="file"
                  name="cover_file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
              {previewSrc && !coverUrl && (
                <button type="button" onClick={clearFile} className="text-text-muted hover:text-error transition-colors">
                  <X size={16} />
                </button>
              )}
            </div>
            <p className="text-[11px] text-text-muted">JPG, PNG ou WebP · max 5 Mo</p>
          </div>
        </div>
      </div>
      <Field label="Description courte" name="description" type="textarea" defaultValue={book?.description ?? ''} />
      <Field label="Synopsis" name="synopsis" type="textarea" defaultValue={book?.synopsis ?? ''} />

      <div className="grid grid-cols-3 gap-4">
        <Field label="Prix Relié (€)"  name="price_hardcover" type="number" defaultValue={book?.price_hardcover ?? ''} />
        <Field label="Prix Broché (€)" name="price_paperback" type="number" defaultValue={book?.price_paperback ?? ''} />
        <Field label="Prix Ebook (€)"  name="price_ebook"     type="number" defaultValue={book?.price_ebook ?? ''} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Date de parution" name="published_at" type="date" defaultValue={book?.published_at ?? ''} />
        <Field label="Nombre de pages"  name="page_count"   type="number" defaultValue={book?.page_count ?? ''} />
      </div>

      <div className="flex flex-wrap gap-4">
        <Checkbox label="En vedette"      name="is_featured"    defaultChecked={book?.is_featured} />
        <Checkbox label="Nouveauté"       name="is_new_release" defaultChecked={book?.is_new_release} />
        <Checkbox label="Bestseller"      name="is_bestseller"  defaultChecked={book?.is_bestseller} />
        <Checkbox label="Sélection staff" name="is_staff_pick"  defaultChecked={book?.is_staff_pick} />
      </div>

      <div className="flex gap-3">
        <Button type="submit" variant="primary" size="md" loading={pending}>
          {book?.id ? 'Enregistrer les modifications' : 'Créer le livre'}
        </Button>
        <Button type="button" variant="secondary" size="md" onClick={() => history.back()}>
          Annuler
        </Button>
      </div>
    </form>
  )
}
