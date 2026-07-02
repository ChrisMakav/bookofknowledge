import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  label:      string
  value:      string | number
  icon:       LucideIcon
  trend?:     string
  className?: string
}

export function StatsCard({ label, value, icon: Icon, trend, className }: StatsCardProps) {
  return (
    <div className={cn('bg-surface-card rounded-xl border border-border p-5 flex flex-col gap-3', className)}>
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
    </div>
  )
}
