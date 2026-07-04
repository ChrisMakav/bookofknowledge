'use server'

import { revalidatePath } from 'next/cache'
import { getSupabaseServiceClient } from '@/lib/supabase/server'

export async function updateUserRole(userId: string, role: 'admin' | 'user'): Promise<{ error?: string }> {
  const supabase = await getSupabaseServiceClient()
  const { error } = await supabase.auth.admin.updateUserById(userId, {
    app_metadata: { role },
  })
  if (error) return { error: error.message }
  revalidatePath('/admin/utilisateurs')
  return {}
}

export async function deleteUser(userId: string): Promise<{ error?: string }> {
  const supabase = await getSupabaseServiceClient()
  const { error } = await supabase.auth.admin.deleteUser(userId)
  if (error) return { error: error.message }
  revalidatePath('/admin/utilisateurs')
  return {}
}
