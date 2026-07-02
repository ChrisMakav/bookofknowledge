import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { getOrders } from '@/actions/orders'
import { getFavorites } from '@/actions/favorites'
import { AccountClient } from './account-client'

export const metadata: Metadata = {
  title: 'Mon compte',
}

export default async function AccountPage() {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/connexion?redirectTo=/compte')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const [orders, favorites] = await Promise.all([getOrders(), getFavorites()])

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold font-display text-text-primary mb-8">Mon compte</h1>
      <AccountClient
        profile={profile}
        orders={orders}
        favorites={favorites}
      />
    </div>
  )
}
