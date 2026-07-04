import type { Metadata } from 'next'
import { BookOpen, ShoppingBag, Users, TrendingUp } from 'lucide-react'
import { getSupabaseServiceClient } from '@/lib/supabase/server'
import { StatsCard } from '@/components/admin/stats-card'

export const metadata: Metadata = { title: 'Admin — Dashboard' }

export default async function AdminPage() {
  const supabase = await getSupabaseServiceClient()

  const [
    { count: bookCount },
    { count: orderCount },
    { data: { users: authUsers } },
    { data: paidOrders },
  ] = await Promise.all([
    supabase.from('books').select('*',  { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.auth.admin.listUsers({ perPage: 1000 }),
    supabase.from('orders').select('total').eq('status', 'paid'),
  ])

  const userCount = authUsers.length

  const revenue = (paidOrders ?? []).reduce(
    (sum: number, o: { total: number }) => sum + (o.total ?? 0), 0
  )

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-bold font-display text-text-primary">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard label="Livres"       value={bookCount  ?? 0} icon={BookOpen}    href="/admin/livres"      />
        <StatsCard label="Commandes"    value={orderCount ?? 0} icon={ShoppingBag} href="/admin/commandes"   />
        <StatsCard label="Utilisateurs" value={userCount  ?? 0} icon={Users}       href="/admin/utilisateurs"/>
        <StatsCard
          label="CA (payé)"
          value={`${revenue.toFixed(2)} €`}
          icon={TrendingUp}
          href="/admin/commandes"
        />
      </div>

      <div className="bg-surface-card rounded-xl border border-border p-6">
        <h2 className="text-sm font-semibold text-text-primary mb-2">Accès rapide</h2>
        <div className="flex flex-wrap gap-3 mt-3">
          {[
            { label: '+ Ajouter un livre',   href: '/admin/livres/nouveau' },
            { label: '+ Ajouter un auteur',  href: '/admin/auteurs/nouveau' },
            { label: 'Voir les commandes',    href: '/admin/commandes' },
            { label: 'Voir le catalogue',     href: '/catalogue' },
          ].map(({ label, href }) => (
            <a
              key={href}
              href={href}
              className="text-sm px-4 py-2 rounded-lg border border-border text-text-secondary hover:bg-surface-subtle hover:text-text-primary transition-colors"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
