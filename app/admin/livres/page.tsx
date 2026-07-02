import type { Metadata } from 'next'
import Link from 'next/link'
import { Plus, Pencil } from 'lucide-react'
import { adminGetBooks } from '@/actions/admin/books'
import { DataTable } from '@/components/admin/data-table'
import { DeleteBookButton } from './delete-book-button'

export const metadata: Metadata = { title: 'Admin — Livres' }

export default async function AdminBooksPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>
}) {
  const { q, page } = await searchParams
  const { books, total, pages } = await adminGetBooks({ q, page: parseInt(page ?? '1') })
  const currentPage = parseInt(page ?? '1')

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-text-primary">Livres</h1>
          <p className="text-sm text-text-secondary mt-0.5">{total} livre{total !== 1 ? 's' : ''} au total</p>
        </div>
        <Link
          href="/admin/livres/nouveau"
          className="flex items-center gap-1.5 h-9 px-4 rounded-lg bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 transition-colors"
        >
          <Plus size={15} />
          Nouveau livre
        </Link>
      </div>

      {/* Search */}
      <form method="GET">
        <input
          name="q"
          defaultValue={q}
          placeholder="Rechercher par titre…"
          className="h-9 w-full max-w-xs rounded-lg border border-border bg-surface-page px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
        />
      </form>

      <DataTable
        rows={books}
        keyFn={(b) => b.id}
        columns={[
          {
            key: 'title', label: 'Titre',
            render: (b) => (
              <div className="flex items-center gap-3">
                {b.cover_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={b.cover_url} alt="" className="w-8 h-12 object-cover rounded shrink-0" />
                )}
                <div>
                  <p className="font-medium text-text-primary truncate max-w-[200px]">{b.title}</p>
                  <p className="text-xs text-text-muted">{b.slug}</p>
                </div>
              </div>
            ),
          },
          {
            key: 'author', label: 'Auteur',
            render: (b) => <span className="text-text-secondary">{(b.author as { name?: string } | null)?.name ?? '—'}</span>,
          },
          {
            key: 'price', label: 'Prix',
            render: (b) => (
              <span className="font-medium text-brand-600">
                {b.price_hardcover != null ? `${b.price_hardcover} €` : '—'}
              </span>
            ),
          },
          {
            key: 'badges', label: 'Tags',
            render: (b) => (
              <div className="flex gap-1 flex-wrap">
                {b.is_featured    && <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-brand-50 text-brand-600">Vedette</span>}
                {b.is_new_release && <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-green-50 text-green-700">Nouveau</span>}
              </div>
            ),
          },
          {
            key: 'actions', label: '',
            className: 'w-24',
            render: (b) => (
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/livres/${b.id}/modifier`}
                  className="size-7 flex items-center justify-center rounded text-text-muted hover:text-text-primary hover:bg-surface-subtle"
                >
                  <Pencil size={13} />
                </Link>
                <DeleteBookButton id={b.id} title={b.title} />
              </div>
            ),
          },
        ]}
      />

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center gap-2">
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`?page=${p}${q ? `&q=${q}` : ''}`}
              className={`size-8 flex items-center justify-center rounded-lg text-sm transition-colors ${p === currentPage ? 'bg-brand-600 text-white' : 'text-text-secondary hover:bg-surface-subtle'}`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
