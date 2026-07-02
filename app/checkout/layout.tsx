import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface-page">
      <header className="border-b border-border bg-surface-card">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="text-lg font-bold font-display text-text-primary hover:text-brand-600 transition-colors"
          >
            Book of Knowledge
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-text-muted">
            <ShieldCheck size={14} className="text-brand-600" />
            Paiement sécurisé
          </div>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-6 py-8">{children}</main>
    </div>
  )
}
