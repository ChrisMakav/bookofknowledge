'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getSupabaseServiceClient } from '@/lib/supabase/server'
import { CategorySchema } from '@/lib/validations/category'
import type { ActionResult } from '@/actions/auth'

export async function adminGetCategories() {
  const supabase = await getSupabaseServiceClient()
  const { data } = await supabase
    .from('categories')
    .select('id, name, slug, description, genre')
    .order('name')
  return data ?? []
}

export async function createCategory(
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  const raw = Object.fromEntries(formData.entries())
  const parsed = CategorySchema.safeParse(raw)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const supabase = await getSupabaseServiceClient()
  const { error } = await supabase.from('categories').insert({
    ...parsed.data,
    genre: parsed.data.slug,
  })
  if (error) {
    if (error.code === '23505') return { error: 'Une catégorie avec ce slug existe déjà.' }
    return { error: error.message }
  }

  revalidatePath('/admin/categories')
  redirect('/admin/categories')
}

export async function updateCategory(
  id: string,
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  const raw = Object.fromEntries(formData.entries())
  const parsed = CategorySchema.safeParse(raw)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const supabase = await getSupabaseServiceClient()
  const { error } = await supabase.from('categories').update({
    ...parsed.data,
    genre: parsed.data.slug,
  }).eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/admin/categories')
  redirect('/admin/categories')
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  const supabase = await getSupabaseServiceClient()
  const { error } = await supabase.from('categories').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/categories')
  return { success: true }
}
