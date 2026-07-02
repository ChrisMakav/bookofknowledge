'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getSupabaseServiceClient } from '@/lib/supabase/server'
import { BookSchema } from '@/lib/validations/book'
import type { ActionResult } from '@/actions/auth'

export async function adminGetBooks({ page = 1, q }: { page?: number; q?: string } = {}) {
  const supabase = await getSupabaseServiceClient()
  const limit = 20
  const from  = (page - 1) * limit

  let query = supabase
    .from('books')
    .select('id, title, slug, cover_url, price_hardcover, rating_avg, is_featured, is_new_release, author:authors(name)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, from + limit - 1)

  if (q) query = query.ilike('title', `%${q}%`)

  const { data, count } = await query
  return { books: data ?? [], total: count ?? 0, pages: Math.ceil((count ?? 0) / limit) }
}

export async function createBook(
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  const raw = Object.fromEntries(formData.entries())
  const parsed = BookSchema.safeParse({
    ...raw,
    is_featured:    raw.is_featured    === 'on',
    is_new_release: raw.is_new_release === 'on',
    is_bestseller:  raw.is_bestseller  === 'on',
    is_staff_pick:  raw.is_staff_pick  === 'on',
    author_id:      raw.author_id || null,
  })
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const supabase = await getSupabaseServiceClient()
  const { error } = await supabase.from('books').insert(parsed.data)
  if (error) {
    if (error.code === '23505') return { error: 'Un livre avec ce slug ou cet ISBN existe déjà.' }
    return { error: error.message }
  }

  revalidatePath('/catalogue')
  revalidatePath('/admin/livres')
  redirect('/admin/livres')
}

export async function updateBook(
  id: string,
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  const raw = Object.fromEntries(formData.entries())
  const parsed = BookSchema.safeParse({
    ...raw,
    is_featured:    raw.is_featured    === 'on',
    is_new_release: raw.is_new_release === 'on',
    is_bestseller:  raw.is_bestseller  === 'on',
    is_staff_pick:  raw.is_staff_pick  === 'on',
    author_id:      raw.author_id || null,
  })
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const supabase = await getSupabaseServiceClient()
  const { error } = await supabase.from('books').update(parsed.data).eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/catalogue')
  revalidatePath('/admin/livres')
  redirect('/admin/livres')
}

export async function deleteBook(id: string): Promise<ActionResult> {
  const supabase = await getSupabaseServiceClient()
  const { error } = await supabase.from('books').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/catalogue')
  revalidatePath('/admin/livres')
  return { success: true }
}
