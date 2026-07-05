'use server'

import { revalidatePath } from 'next/cache'
import { getSupabaseServiceClient } from '@/lib/supabase/server'
import type { OrderStatus } from '@/types'
import type { ActionResult } from '@/actions/auth'

export async function adminGetOrders({ page = 1, status }: { page?: number; status?: OrderStatus } = {}) {
  const supabase = getSupabaseServiceClient()
  const limit = 25
  const from  = (page - 1) * limit

  let query = supabase
    .from('orders')
    .select('id, created_at, total, status, user_id', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, from + limit - 1)

  if (status) query = query.eq('status', status)

  const { data: orders, count } = await query

  if (!orders?.length) {
    return { orders: [], total: count ?? 0, pages: Math.ceil((count ?? 0) / limit) }
  }

  const userIds = [...new Set(orders.map((o) => o.user_id))]
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name')
    .in('id', userIds)

  const profileMap = Object.fromEntries((profiles ?? []).map((p) => [p.id, p]))

  const ordersWithProfiles = orders.map((o) => ({
    ...o,
    profile: profileMap[o.user_id] ?? null,
  }))

  return { orders: ordersWithProfiles, total: count ?? 0, pages: Math.ceil((count ?? 0) / limit) }
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
