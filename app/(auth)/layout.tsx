import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface-page flex flex-col items-center justify-center px-4 py-12">
      <Link
        href="/"
        className="text-2xl font-bold font-display text-text-primary mb-8 hover:text-brand-600 transition-colors"
      >
        Book of Knowledge
      </Link>
      <div className="w-full max-w-md bg-surface-card rounded-2xl shadow-lg p-8">
        {children}
      </div>
    </div>
  )
}
