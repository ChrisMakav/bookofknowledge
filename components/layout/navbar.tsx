'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingCart, CircleUser } from 'lucide-react'
import { SearchInput } from '@/components/ui/search-input'
import { useCartStore } from '@/stores/cart.store'
import { cn } from '@/lib/utils'

const navItems = [
  { label: 'Découvrir', href: '/decouvrir' },
  { label: 'Catalogue', href: '/catalogue' },
  { label: 'Ma Bibliothèque', href: '/bibliotheque' },
  { label: 'Communauté', href: '/communaute' },
]

export function Navbar() {
  const pathname  = usePathname()
  const totalItems = useCartStore((s) => s.totalItems())
  const setCartOpen = useCartStore((s) => s.setCartOpen)

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
          <SearchInput className="w-64" />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCartOpen(true)}
            aria-label={totalItems > 0 ? `Panier, ${totalItems} article${totalItems > 1 ? 's' : ''}` : 'Panier'}
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

          <Link
            href="/compte"
            aria-label="Mon compte"
            className={cn(
              'size-9 flex items-center justify-center rounded-lg',
              'text-text-secondary hover:bg-surface-subtle hover:text-text-primary',
              'transition-colors duration-[var(--duration-fast)]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600',
            )}
          >
            <CircleUser size={20} />
          </Link>
        </div>
      </div>
    </header>
  )
}
