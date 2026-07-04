import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  label:      string
  value:      string | number
  icon:       LucideIcon
  href?:      string
  trend?:     string
  className?: string
}

export function StatsCard({ label, value, icon: Icon, href, trend, className }: StatsCardProps) {
  const inner = (
    <>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest text-text-muted">{label}</span>
        <div className="size-8 rounded-lg bg-brand-50 flex items-center justify-center">
          <Icon size={16} className="text-brand-600" />
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold font-display text-text-primary">{value}</p>
        {trend && <p className="text-xs text-text-muted mt-0.5">{trend}</p>}
      </div>
    </>
  )

  const base = cn(
    'bg-surface-card rounded-xl border border-border p-5 flex flex-col gap-3',
    href && 'transition-colors hover:border-brand-300 hover:bg-brand-50/30 cursor-pointer',
    className,
  )

  if (href) {
    return <Link href={href} className={base}>{inner}</Link>
  }

  return <div className={base}>{inner}</div>
}
