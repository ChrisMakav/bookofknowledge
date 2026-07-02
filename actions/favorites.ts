'use server'

import { revalidatePath } from 'next/cache'
import { getSupabaseServerClient } from '@/lib/supabase/server'

export async function toggleFavorite(bookId: string): Promise<{ isFavorited: boolean }> {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non authentifié')

  const { data: existing } = await supabase
    .from('favorites')
    .select('book_id')
    .eq('user_id', user.id)
    .eq('book_id', bookId)
    .single()

  if (existing) {
    await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('book_id', bookId)
    revalidatePath('/compte')
    return { isFavorited: false }
  }

  await supabase
    .from('favorites')
    .insert({ user_id: user.id, book_id: bookId })
  revalidatePath('/compte')
  return { isFavorited: true }
}

export async function getFavorites() {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from('favorites')
    .select('book_id, created_at, book:books(id, title, slug, cover_url, price_hardcover, rating_avg, author:authors(name))')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return data ?? []
}
