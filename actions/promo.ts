'use server'

import { getSupabaseServiceClient } from '@/lib/supabase/server'

export interface PromoApplied {
  id:       string
  code:     string
  type:     'percentage' | 'fixed'
  value:    number
  discount: number
}

export type ValidatePromoResult =
  | { data: PromoApplied; error?: never }
  | { data?: never; error: string }

export async function validatePromoCode(
  code: string,
  subtotal: number,
): Promise<ValidatePromoResult> {
  if (!code.trim()) return { error: 'Veuillez saisir un code promo.' }

  const supabase = await getSupabaseServiceClient()
  const { data } = await supabase
    .from('promo_codes')
    .select('id, code, type, value, expires_at, usage_limit, used_count')
    .eq('code', code.toUpperCase().trim())
    .eq('active', true)
    .single()

  if (!data) return { error: 'Code promo invalide ou inactif.' }
  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    return { error: 'Ce code promo a expiré.' }
  }
  if (data.usage_limit !== null && data.used_count >= data.usage_limit) {
    return { error: "Ce code promo a atteint sa limite d'utilisation." }
  }

  const discount =
    data.type === 'percentage'
      ? parseFloat((subtotal * (data.value / 100)).toFixed(2))
      : parseFloat(Math.min(data.value, subtotal).toFixed(2))

  return {
    data: {
      id:       data.id,
      code:     data.code,
      type:     data.type as 'percentage' | 'fixed',
      value:    data.value,
      discount,
    },
  }
}
