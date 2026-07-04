'use server'

import { revalidatePath } from 'next/cache'
import { getSupabaseServiceClient } from '@/lib/supabase/server'

export async function adminGetPromoCodes() {
  const supabase = await getSupabaseServiceClient()
  const { data } = await supabase
    .from('promo_codes')
    .select('*')
    .order('created_at', { ascending: false })
  return data ?? []
}

export async function createPromoCode(formData: FormData): Promise<{ error?: string }> {
  const code        = (formData.get('code') as string).toUpperCase().trim()
  const type        = formData.get('type') as 'percentage' | 'fixed'
  const value       = parseFloat(formData.get('value') as string)
  const expires_at  = formData.get('expires_at') as string | null
  const usage_limit = formData.get('usage_limit') as string | null

  if (!code)              return { error: 'Le code est requis.' }
  if (!['percentage', 'fixed'].includes(type)) return { error: 'Type invalide.' }
  if (isNaN(value) || value <= 0)              return { error: 'La valeur doit être > 0.' }
  if (type === 'percentage' && value > 100)    return { error: 'Le pourcentage ne peut pas dépasser 100.' }

  const supabase = await getSupabaseServiceClient()
  const { error } = await supabase.from('promo_codes').insert({
    code,
    type,
    value,
    expires_at:  expires_at  || null,
    usage_limit: usage_limit ? parseInt(usage_limit) : null,
  })

  if (error) {
    if (error.code === '23505') return { error: 'Ce code existe déjà.' }
    return { error: error.message }
  }

  revalidatePath('/admin/codes-promo')
  return {}
}

export async function togglePromoCode(id: string, active: boolean): Promise<{ error?: string }> {
  const supabase = await getSupabaseServiceClient()
  const { error } = await supabase.from('promo_codes').update({ active }).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/codes-promo')
  return {}
}

export async function deletePromoCode(id: string): Promise<{ error?: string }> {
  const supabase = await getSupabaseServiceClient()
  const { error } = await supabase.from('promo_codes').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/codes-promo')
  return {}
}
