'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, BookOpen, ShoppingBag, Users, Tag, LogOut } from 'lucide-react'
import { logout } from '@/actions/auth'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/admin',           label: 'Dashboard',  icon: LayoutDashboard },
  { href: '/admin/livres',    label: 'Livres',      icon: BookOpen },
  { href: '/admin/commandes', label: 'Commandes',   icon: ShoppingBag },
  { href: '/admin/auteurs',     label: 'Auteurs',     icon: Users },
  { href: '/admin/categories',  label: 'Catégories',  icon: Tag },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex flex-col w-56 shrink-0 min-h-screen bg-surface-dark border-r border-white/10">
      {/* Logo */}
      <div className="h-14 flex items-center px-5 border-b border-white/10">
        <Link href="/" className="text-sm font-bold font-display text-white hover:text-accent-400 transition-colors">
          Book of Knowledge
        </Link>
        <span className="ml-2 text-[10px] font-semibold uppercase tracking-widest text-accent-400 bg-accent-500/20 px-1.5 py-0.5 rounded">
          Admin
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 flex flex-col gap-0.5">
        {NAV.map(({ href, label, icon: Icon }) => {
          const isActive = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400',
                isActive
                  ? 'bg-brand-600 text-white'
                  : 'text-white/60 hover:bg-white/10 hover:text-white',
              )}
            >
              <Icon size={16} className="shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-5 border-t border-white/10 pt-4">
        <form action={logout}>
          <button
            type="submit"
            className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm text-white/60 hover:bg-white/10 hover:text-white transition-colors"
          >
            <LogOut size={16} />
            Déconnexion
          </button>
        </form>
      </div>
    </aside>
  )
}
