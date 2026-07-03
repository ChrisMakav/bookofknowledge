import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getSupabaseServiceClient } from '@/lib/supabase/server'
import { updateCategory } from '@/actions/admin/categories'
import { CategoryForm } from '@/components/admin/category-form'

export const metadata: Metadata = { title: 'Admin — Modifier la catégorie' }

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await getSupabaseServiceClient()

  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single()

  if (!category) notFound()

  const boundAction = updateCategory.bind(null, id)

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold font-display text-text-primary">
        Modifier : {category.name}
      </h1>
      <CategoryForm action={boundAction} category={category} />
    </div>
  )
}
