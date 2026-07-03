'use client'

import { Trash2 } from 'lucide-react'
import { deleteCategory } from '@/actions/admin/categories'

export function DeleteCategoryButton({ id, name }: { id: string; name: string }) {
  async function handleDelete() {
    if (!confirm(`Supprimer "${name}" ? Cette action est irréversible.`)) return
    await deleteCategory(id)
  }

  return (
    <button
      onClick={handleDelete}
      aria-label={`Supprimer ${name}`}
      className="size-7 flex items-center justify-center rounded text-text-muted hover:text-error hover:bg-red-50 transition-colors"
    >
      <Trash2 size={13} />
    </button>
  )
}
