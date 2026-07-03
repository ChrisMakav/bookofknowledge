import type { Metadata } from 'next'
import Link from 'next/link'
import { Plus, Pencil } from 'lucide-react'
import { adminGetCategories } from '@/actions/admin/categories'
import { DataTable } from '@/components/admin/data-table'
import { DeleteCategoryButton } from './delete-category-button'

export const metadata: Metadata = { title: 'Admin — Catégories' }

export default async function AdminCategoriesPage() {
  const categories = await adminGetCategories()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-display text-text-primary">Catégories</h1>
        <Link
          href="/admin/categories/nouveau"
          className="flex items-center gap-1.5 h-9 px-4 rounded-lg bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 transition-colors"
        >
          <Plus size={15} />
          Nouvelle catégorie
        </Link>
      </div>

      <DataTable
        rows={categories}
        keyFn={(c) => c.id}
        columns={[
          {
            key: 'name', label: 'Catégorie',
            render: (c) => (
              <div>
                <p className="font-medium text-text-primary">{c.name}</p>
                <p className="text-xs text-text-muted">{c.slug}</p>
              </div>
            ),
          },
          {
            key: 'description', label: 'Description',
            render: (c) => (
              <span className="text-sm text-text-secondary">{c.description ?? '—'}</span>
            ),
          },
          {
            key: 'actions', label: '', className: 'w-20',
            render: (c) => (
              <div className="flex items-center gap-1">
                <Link
                  href={`/admin/categories/${c.id}/modifier`}
                  className="size-7 flex items-center justify-center rounded text-text-muted hover:text-text-primary hover:bg-surface-subtle"
                >
                  <Pencil size={13} />
                </Link>
                <DeleteCategoryButton id={c.id} name={c.name} />
              </div>
            ),
          },
        ]}
      />
    </div>
  )
}
