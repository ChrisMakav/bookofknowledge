'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { deleteOrder } from '@/actions/admin/orders'

export function DeleteOrderButton({
  orderId,
  redirectAfterDelete = false,
}: {
  orderId: string
  redirectAfterDelete?: boolean
}) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete() {
    if (!confirm(`Supprimer la commande #${orderId.slice(-8).toUpperCase()} ? Cette action est irréversible.`)) return
    setIsDeleting(true)
    const result = await deleteOrder(orderId)
    if (result.error) {
      alert(result.error)
      setIsDeleting(false)
      return
    }
    if (redirectAfterDelete) {
      router.push('/admin/commandes')
    } else {
      router.refresh()
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      aria-label={`Supprimer la commande #${orderId.slice(-8).toUpperCase()}`}
      className="size-7 flex items-center justify-center rounded text-text-muted hover:text-error hover:bg-red-50 transition-colors disabled:opacity-50"
    >
      <Trash2 size={13} />
    </button>
  )
}
