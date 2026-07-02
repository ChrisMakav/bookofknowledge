'use client'

import { Trash2 } from 'lucide-react'
import { deleteBook } from '@/actions/admin/books'

export function DeleteBookButton({ id, title }: { id: string; title: string }) {
  async function handleDelete() {
    if (!confirm(`Supprimer "${title}" ? Cette action est irréversible.`)) return
    await deleteBook(id)
  }

  return (
    <button
      onClick={handleDelete}
      aria-label={`Supprimer ${title}`}
      className="size-7 flex items-center justify-center rounded text-text-muted hover:text-error hover:bg-red-50 transition-colors"
    >
      <Trash2 size={13} />
    </button>
  )
}
