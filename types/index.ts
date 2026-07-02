// ─── Genre & Format ──────────────────────────────────────────────────────────

export type GenreKey =
  | 'scifi'
  | 'romance'
  | 'thriller'
  | 'fantasy'
  | 'lifestyle'
  | 'tech'

export type BookFormat = 'hardcover' | 'paperback' | 'ebook'

export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded'

// ─── Author ───────────────────────────────────────────────────────────────────

export interface Author {
  id:         string
  name:       string
  slug:       string
  bio:        string | null
  avatar_url: string | null
  created_at: string
}

// ─── Category ─────────────────────────────────────────────────────────────────

export interface Category {
  id:          string
  name:        string
  slug:        string
  description: string | null
  genre:       GenreKey | null
}

// ─── Book ─────────────────────────────────────────────────────────────────────

export interface Book {
  id:               string
  title:            string
  slug:             string
  author_id:        string | null
  author?:          Author
  cover_url:        string
  description:      string | null
  synopsis:         string | null
  isbn:             string | null
  published_at:     string | null
  page_count:       number | null
  price_hardcover:  number | null
  price_paperback:  number | null
  price_ebook:      number | null
  rating_avg:       number
  review_count:     number
  is_featured:      boolean
  is_new_release:   boolean
  is_bestseller:    boolean
  is_staff_pick:    boolean
  created_at:       string
  categories?:      Category[]
}

export interface BookWithDetails extends Book {
  author:     Author
  categories: Category[]
  reviews:    Review[]
}

// ─── Review ───────────────────────────────────────────────────────────────────

export interface Review {
  id:         string
  book_id:    string
  user_id:    string
  rating:     number
  body:       string | null
  vibe_tags:  string[]
  created_at: string
  profile?:   Profile
}

// ─── Profile ──────────────────────────────────────────────────────────────────

export interface Profile {
  id:         string
  full_name:  string | null
  avatar_url: string | null
  bio:        string | null
  created_at: string
  updated_at: string
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

export interface CartItem {
  bookId:   string
  title:    string
  author:   string
  cover:    string
  format:   BookFormat
  price:    number
  quantity: number
  slug:     string
}

// ─── Edition ──────────────────────────────────────────────────────────────────

export interface Edition {
  key:   BookFormat
  label: string
  price: number
}

// ─── Order ────────────────────────────────────────────────────────────────────

export interface OrderItem {
  id:           string
  order_id:     string
  book_id:      string
  format:       BookFormat
  quantity:     number
  unit_price:   number
  download_url: string | null
  book?:        Pick<Book, 'title' | 'cover_url' | 'slug'>
}

export interface Order {
  id:                       string
  user_id:                  string
  status:                   OrderStatus
  stripe_payment_intent_id: string | null
  subtotal:                 number
  tax:                      number
  total:                    number
  shipping_address:         ShippingAddress | null
  created_at:               string
  updated_at:               string
  items?:                   OrderItem[]
}

export interface ShippingAddress {
  full_name:   string
  line1:       string
  line2?:      string
  city:        string
  state?:      string
  postal_code: string
  country:     string
}

// ─── Catalog filters ──────────────────────────────────────────────────────────

export type SortOption =
  | 'relevance'
  | 'newest'
  | 'price_asc'
  | 'price_desc'
  | 'rating'
  | 'popularity'

export interface CatalogFilters {
  q?:       string
  genre?:   GenreKey
  sort?:    SortOption
  page?:    number
  min?:     number
  max?:     number
  format?:  BookFormat
}

// ─── API responses ────────────────────────────────────────────────────────────

export interface PaginatedBooks {
  books:  Book[]
  total:  number
  page:   number
  limit:  number
  pages:  number
}
