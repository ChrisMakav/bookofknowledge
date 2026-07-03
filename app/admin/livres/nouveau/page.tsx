import type { Metadata } from 'next'
import { getSupabaseServiceClient } from '@/lib/supabase/server'
import { createBook } from '@/actions/admin/books'
import { BookForm } from '@/components/admin/book-form'

export const metadata: Metadata = { title: 'Admin — Nouveau livre' }

export default async function NewBookPage() {
  const supabase = await getSupabaseServiceClient()
  const [{ data: authors }, { data: categories }] = await Promise.all([
    supabase.from('authors').select('id, name').order('name'),
    supabase.from('categories').select('id, name').order('name'),
  ])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-text-primary">Nouveau livre</h1>
      </div>
      <BookForm action={createBook} authors={authors ?? []} categories={categories ?? []} />
    </div>
  )
}
