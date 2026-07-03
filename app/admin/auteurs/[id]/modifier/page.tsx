import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getSupabaseServiceClient } from '@/lib/supabase/server'
import { updateAuthor } from '@/actions/admin/authors'
import { AuthorForm } from '@/components/admin/author-form'

export const metadata: Metadata = { title: 'Admin — Modifier l\'auteur' }

export default async function EditAuthorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await getSupabaseServiceClient()

  const { data: author } = await supabase
    .from('authors')
    .select('*')
    .eq('id', id)
    .single()

  if (!author) notFound()

  const boundAction = updateAuthor.bind(null, id)

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold font-display text-text-primary">
        Modifier : {author.name}
      </h1>
      <AuthorForm action={boundAction} author={author} />
    </div>
  )
}
