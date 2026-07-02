'use server'

import { getSupabaseServerClient } from '@/lib/supabase/server'
import type { Book, CatalogFilters, PaginatedBooks } from '@/types'

const PAGE_SIZE = 20

export async function getFeaturedBooks(): Promise<Book[]> {
  const supabase = await getSupabaseServerClient()
  const { data } = await supabase
    .from('books')
    .select('*, author:authors(id, name, slug)')
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(6)
  return (data ?? []) as Book[]
}

export async function getNewReleases(): Promise<Book[]> {
  const supabase = await getSupabaseServerClient()
  const { data } = await supabase
    .from('books')
    .select('*, author:authors(id, name, slug)')
    .eq('is_new_release', true)
    .order('created_at', { ascending: false })
    .limit(8)
  return (data ?? []) as Book[]
}

export async function getTrendingBooks(): Promise<Book[]> {
  const supabase = await getSupabaseServerClient()
  const { data } = await supabase
    .from('books')
    .select('*, author:authors(id, name, slug)')
    .order('review_count', { ascending: false })
    .limit(8)
  return (data ?? []) as Book[]
}

export async function getBestsellers(): Promise<Book[]> {
  const supabase = await getSupabaseServerClient()
  const { data } = await supabase
    .from('books')
    .select('*, author:authors(id, name, slug)')
    .eq('is_bestseller', true)
    .order('rating_avg', { ascending: false })
    .limit(8)
  return (data ?? []) as Book[]
}

export async function getBook(slug: string): Promise<Book | null> {
  const supabase = await getSupabaseServerClient()
  const { data } = await supabase
    .from('books')
    .select(`
      *,
      author:authors(id, name, slug, bio, avatar_url),
      book_categories(category:categories(id, name, slug, genre)),
      reviews(id, rating, body, vibe_tags, created_at, profile:profiles(full_name, avatar_url))
    `)
    .eq('slug', slug)
    .single()

  if (!data) return null

  // Flatten categories
  return {
    ...data,
    categories: data.book_categories?.map((bc: { category: unknown }) => bc.category) ?? [],
  } as Book
}

export async function getBooks(filters: CatalogFilters = {}): Promise<PaginatedBooks> {
  const supabase = await getSupabaseServerClient()
  const { q, genre, sort = 'newest', page = 1, min, max, format } = filters

  let query = supabase
    .from('books')
    .select('*, author:authors(id, name, slug)', { count: 'exact' })

  if (q) {
    query = query.ilike('title', `%${q}%`)
  }

  if (genre) {
    // Two-step: get category IDs for the genre, then filter book_categories
    const { data: cats } = await supabase
      .from('categories')
      .select('id')
      .eq('genre', genre)
    const catIds = (cats ?? []).map((c: { id: string }) => c.id)

    if (catIds.length > 0) {
      const { data: bookCats } = await supabase
        .from('book_categories')
        .select('book_id')
        .in('category_id', catIds)
      const bookIds = [...new Set((bookCats ?? []).map((bc: { book_id: string }) => bc.book_id))]
      if (bookIds.length > 0) {
        query = query.in('id', bookIds)
      } else {
        // No books in this genre — return empty
        return { books: [], total: 0, page, limit: PAGE_SIZE, pages: 0 }
      }
    }
  }

  if (min !== undefined) {
    query = query.gte('price_hardcover', min)
  }
  if (max !== undefined) {
    query = query.lte('price_hardcover', max)
  }

  if (format === 'ebook') {
    query = query.not('price_ebook', 'is', null)
  } else if (format === 'paperback') {
    query = query.not('price_paperback', 'is', null)
  }

  switch (sort) {
    case 'price_asc':
      query = query.order('price_hardcover', { ascending: true })
      break
    case 'price_desc':
      query = query.order('price_hardcover', { ascending: false })
      break
    case 'rating':
      query = query.order('rating_avg', { ascending: false })
      break
    case 'popularity':
      query = query.order('review_count', { ascending: false })
      break
    case 'newest':
    default:
      query = query.order('created_at', { ascending: false })
      break
  }

  const from  = (page - 1) * PAGE_SIZE
  const to    = from + PAGE_SIZE - 1
  query = query.range(from, to)

  const { data, count } = await query
  const total = count ?? 0

  return {
    books: (data ?? []) as Book[],
    total,
    page,
    limit: PAGE_SIZE,
    pages: Math.ceil(total / PAGE_SIZE),
  }
}
