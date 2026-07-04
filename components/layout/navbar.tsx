'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ShoppingCart, CircleUser, LayoutDashboard, User, LogOut } from 'lucide-react'
import { useRef, useState } from 'react'
import { SearchInput } from '@/components/ui/search-input'
import { useCartStore } from '@/stores/cart.store'
import { cn } from '@/lib/utils'
import { logout } from '@/actions/auth'

const navItems = [
  { label: 'Découvrir', href: '/decouvrir' },
  { label: 'Catalogue', href: '/catalogue' },
  { label: 'Ma Bibliothèque', href: '/bibliotheque' },
  { label: 'Communauté', href: '/communaute' },
]

export function Navbar({ isAdmin = false }: { isAdmin?: boolean }) {
  const pathname    = usePathname()
  const router      = useRouter()
  const totalItems  = useCartStore((s) => s.totalItems())
  const setCartOpen = useCartStore((s) => s.setCartOpen)
  const [menuOpen, setMenuOpen]  = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  function handleSearch(query: string) {
    const q = query.trim()
    if (!q) return
    router.push(`/catalogue?q=${encodeURIComponent(q)}`)
  }

  return (
    <header className="fixed top-0 inset-x-0 z-50 h-16 bg-surface-card border-b border-border">
      <div className="h-full max-w-7xl mx-auto px-6 flex items-center gap-8">

        {/* Logo */}
        <Link
          href="/"
          className={cn(
            'text-lg font-bold text-text-primary shrink-0 font-display',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 rounded-sm',
          )}
        >
          Book of Knowledge
        </Link>

        {/* Nav links */}
        <nav aria-label="Navigation principale" className="hidden md:flex items-center gap-1">
          {navItems.map(({ label, href }) => {
            const isActive = pathname === href || pathname.startsWith(`${href}/`)
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'relative px-3 py-1.5 text-sm font-medium rounded-lg',
                  'transition-colors duration-[var(--duration-fast)]',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600',
                  isActive
                    ? 'text-brand-600'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-subtle',
                )}
              >
                {label}
                {isActive && (
                  <span
                    className="absolute bottom-0 inset-x-3 h-0.5 bg-brand-600 rounded-full"
                    aria-hidden
                  />
                )}
              </Link>
            )
          })}
        </nav>

        <div className="flex-1" />

        {/* Search */}
        <div className="hidden md:block">
          <SearchInput className="w-64" onSearch={handleSearch} />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCartOpen(true)}
            aria-label={totalItems > 0 ? `Panier, ${totalItems} article${totalItems > 1 ? 's' : ''}` : 'Panier'}
            suppressHydrationWarning
            className={cn(
              'relative size-9 flex items-center justify-center rounded-lg',
              'text-text-secondary hover:bg-surface-subtle hover:text-text-primary',
              'transition-colors duration-[var(--duration-fast)]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600',
            )}
          >
            <ShoppingCart size={20} />
            {totalItems > 0 && (
              <span className="absolute top-1 right-1 size-4 flex items-center justify-center bg-brand-600 text-white text-[10px] font-bold rounded-full">
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </button>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Mon compte"
              aria-expanded={menuOpen}
              className={cn(
                'size-9 flex items-center justify-center rounded-lg',
                'text-text-secondary hover:bg-surface-subtle hover:text-text-primary',
                'transition-colors duration-[var(--duration-fast)]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600',
                menuOpen && 'bg-surface-subtle text-text-primary',
              )}
            >
              <CircleUser size={20} />
            </button>

            {menuOpen && (
              <>
                {/* backdrop */}
                <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-2 z-50 w-48 rounded-xl border border-border bg-surface-card shadow-lg py-1 overflow-hidden">
                  <Link
                    href="/compte"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-sm text-text-secondary hover:bg-surface-subtle hover:text-text-primary transition-colors"
                  >
                    <User size={15} />
                    Mon compte
                  </Link>

                  {isAdmin && (
                    <>
                      <div className="my-1 border-t border-border" />
                      <Link
                        href="/admin"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm font-semibold text-brand-600 hover:bg-brand-50 transition-colors"
                      >
                        <LayoutDashboard size={15} />
                        Tableau de bord
                      </Link>
                    </>
                  )}

                  <div className="my-1 border-t border-border" />
                  <form action={logout}>
                    <button
                      type="submit"
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-text-secondary hover:bg-surface-subtle hover:text-red-600 transition-colors"
                    >
                      <LogOut size={15} />
                      Déconnexion
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
