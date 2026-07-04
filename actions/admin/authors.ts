'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getSupabaseServiceClient } from '@/lib/supabase/server'
import { AuthorSchema } from '@/lib/validations/author'
import type { ActionResult } from '@/actions/auth'

export async function adminGetAuthors() {
  const supabase = await getSupabaseServiceClient()
  const { data } = await supabase
    .from('authors')
    .select('id, name, slug, avatar_url, created_at')
    .order('name')
  return data ?? []
}

export async function createAuthor(
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  const raw = Object.fromEntries(formData.entries())
  const parsed = AuthorSchema.safeParse(raw)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const supabase = await getSupabaseServiceClient()
  const { error } = await supabase.from('authors').insert(parsed.data)
  if (error) {
    if (error.code === '23505') return { error: 'Un auteur avec ce slug existe déjà.' }
    return { error: error.message }
  }

  revalidatePath('/admin/auteurs')
  redirect('/admin/auteurs')
}

export async function updateAuthor(
  id: string,
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  const raw = Object.fromEntries(formData.entries())
  const parsed = AuthorSchema.safeParse(raw)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const supabase = await getSupabaseServiceClient()
  const { error } = await supabase.from('authors').update(parsed.data).eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/admin/auteurs')
  redirect('/admin/auteurs')
}

export async function deleteAuthor(id: string): Promise<ActionResult> {
  const supabase = await getSupabaseServiceClient()
  const { error } = await supabase.from('authors').delete().eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/admin/auteurs')
  return {}
}
