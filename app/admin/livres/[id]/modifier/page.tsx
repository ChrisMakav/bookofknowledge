import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getSupabaseServiceClient } from '@/lib/supabase/server'
import { updateBook } from '@/actions/admin/books'
import { BookForm } from '@/components/admin/book-form'

export const metadata: Metadata = { title: 'Admin — Modifier le livre' }

export default async function EditBookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await getSupabaseServiceClient()

  const [{ data: book }, { data: authors }] = await Promise.all([
    supabase.from('books').select('*').eq('id', id).single(),
    supabase.from('authors').select('id, name').order('name'),
  ])

  if (!book) notFound()

  const boundAction = updateBook.bind(null, id)

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold font-display text-text-primary">
        Modifier : {book.title}
      </h1>
      <BookForm action={boundAction} book={book} authors={authors ?? []} />
    </div>
  )
}
