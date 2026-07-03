'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Heart } from 'lucide-react'
import { EditionSelector } from '@/components/books/edition-selector'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/stores/cart.store'
import { toggleFavorite } from '@/actions/favorites'
import type { Book, BookFormat, Edition } from '@/types'

interface BookDetailClientProps {
  book:                Book
  initialIsFavorited?: boolean
}

export function BookDetailClient({ book, initialIsFavorited = false }: BookDetailClientProps) {
  const addItem      = useCartStore((s) => s.addItem)
  const setCartOpen  = useCartStore((s) => s.setCartOpen)
  const router       = useRouter()
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited)
  const [favPending, setFavPending]   = useState(false)

  // Build editions list from available formats
  const editions: Edition[] = []
  if (book.price_hardcover !== null) {
    editions.push({ key: 'hardcover', label: 'Relié',  price: book.price_hardcover! })
  }
  if (book.price_paperback !== null) {
    editions.push({ key: 'paperback', label: 'Broché', price: book.price_paperback! })
  }
  if (book.price_ebook !== null) {
    editions.push({ key: 'ebook',     label: 'Ebook',  price: book.price_ebook! })
  }

  const [selectedFormat, setSelectedFormat] = useState<BookFormat>(
    editions[0]?.key ?? 'hardcover',
  )

  const selectedEdition = editions.find((e) => e.key === selectedFormat)

  function handleAddToCart() {
    if (!selectedEdition) return
    addItem({
      bookId: book.id,
      slug:   book.slug,
      title:  book.title,
      author: (book as { author?: { name?: string } }).author?.name ?? '',
      cover:  book.cover_url,
      format: selectedFormat,
      price:  selectedEdition.price,
    })
    setCartOpen(true)
  }

  async function handleToggleFavorite() {
    if (favPending) return
    setFavPending(true)
    try {
      const result = await toggleFavorite(book.id)
      setIsFavorited(result.isFavorited)
    } catch {
      router.push('/connexion')
    } finally {
      setFavPending(false)
    }
  }

  if (editions.length === 0) return null

  return (
    <div className="flex flex-col gap-4">
      {editions.length > 1 && (
        <EditionSelector
          editions={editions}
          selectedKey={selectedFormat}
          onSelect={setSelectedFormat}
        />
      )}

      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold text-brand-600">
          {selectedEdition?.price.toFixed(2)} €
        </span>
      </div>

      <Button
        variant="primary"
        size="lg"
        className="w-full"
        onClick={handleAddToCart}
      >
        <ShoppingCart size={16} />
        Ajouter au panier
      </Button>

      <Button
        variant="ghost"
        size="md"
        className="w-full"
        onClick={handleToggleFavorite}
        loading={favPending}
      >
        <Heart
          size={16}
          className={isFavorited ? 'fill-brand-600 text-brand-600' : ''}
        />
        {isFavorited ? 'Retiré des favoris' : 'Ajouter aux favoris'}
      </Button>
    </div>
  )
}
