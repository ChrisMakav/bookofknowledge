import type { Metadata } from 'next'
import { createCategory } from '@/actions/admin/categories'
import { CategoryForm } from '@/components/admin/category-form'

export const metadata: Metadata = { title: 'Admin — Nouvelle catégorie' }

export default function NewCategoryPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold font-display text-text-primary">Nouvelle catégorie</h1>
      <CategoryForm action={createCategory} />
    </div>
  )
}
