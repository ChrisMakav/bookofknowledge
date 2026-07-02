import type { Metadata } from 'next'
import { createAuthor } from '@/actions/admin/authors'
import { AuthorForm } from '@/components/admin/author-form'

export const metadata: Metadata = { title: 'Admin — Nouvel auteur' }

export default function NewAuthorPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold font-display text-text-primary">Nouvel auteur</h1>
      <AuthorForm action={createAuthor} />
    </div>
  )
}
