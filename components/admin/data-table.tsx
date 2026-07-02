import { cn } from '@/lib/utils'

interface Column<T> {
  key:       string
  label:     string
  render:    (row: T) => React.ReactNode
  className?: string
}

interface DataTableProps<T> {
  columns:    Column<T>[]
  rows:       T[]
  keyFn:      (row: T) => string
  empty?:     string
  className?: string
}

export function DataTable<T>({ columns, rows, keyFn, empty = 'Aucun résultat', className }: DataTableProps<T>) {
  return (
    <div className={cn('overflow-x-auto rounded-xl border border-border bg-surface-card', className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-surface-subtle">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn('text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-text-muted', col.className)}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-10 text-text-muted text-sm">
                {empty}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={keyFn(row)} className="border-b border-border last:border-0 hover:bg-surface-subtle/50 transition-colors">
                {columns.map((col) => (
                  <td key={col.key} className={cn('px-4 py-3 text-text-primary', col.className)}>
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
