'use server'

import { revalidatePath } from 'next/cache'
import { getSupabaseServiceClient } from '@/lib/supabase/server'
import type { OrderStatus } from '@/types'
import type { ActionResult } from '@/actions/auth'

export async function adminGetOrders({ page = 1, status }: { page?: number; status?: OrderStatus } = {}) {
  const supabase = await getSupabaseServiceClient()
  const limit = 25
  const from  = (page - 1) * limit

  let query = supabase
    .from('orders')
    .select('id, created_at, total, status, user_id, profile:profiles(full_name)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, from + limit - 1)

  if (status) query = query.eq('status', status)

  const { data, count } = await query
  return { orders: data ?? [], total: count ?? 0, pages: Math.ceil((count ?? 0) / limit) }
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
): Promise<ActionResult> {
  const supabase = await getSupabaseServiceClient()
  const { error } = await supabase
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', orderId)

  if (error) return { error: error.message }
  revalidatePath('/admin/commandes')
  return { success: true }
}
