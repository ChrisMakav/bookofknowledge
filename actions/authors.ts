'use server'

import { getSupabaseServerClient } from '@/lib/supabase/server'
import type { Author, Book } from '@/types'

export async function getAuthor(slug: string): Promise<Author | null> {
  const supabase = await getSupabaseServerClient()
  const { data } = await supabase
    .from('authors')
    .select('*')
    .eq('slug', slug)
    .single()
  return data as Author | null
}

export async function getAuthorBooks(authorId: string): Promise<Book[]> {
  const supabase = await getSupabaseServerClient()
  const { data } = await supabase
    .from('books')
    .select('*, author:authors(id, name, slug)')
    .eq('author_id', authorId)
    .order('created_at', { ascending: false })
  return (data ?? []) as Book[]
}

export async function getAllAuthors(): Promise<Author[]> {
  const supabase = await getSupabaseServerClient()
  const { data } = await supabase
    .from('authors')
    .select('*')
    .order('name')
  return (data ?? []) as Author[]
}
