import { z } from 'zod'

export const BookSchema = z.object({
  title:           z.string().min(1, 'Titre requis'),
  slug:            z.string().min(1, 'Slug requis').regex(/^[a-z0-9-]+$/, 'Slug : minuscules, chiffres et tirets uniquement'),
  author_id:       z.string().uuid('Auteur invalide').nullable().optional(),
  cover_url:       z.string().url('URL de couverture invalide').or(z.literal('')).optional(),
  description:     z.string().optional(),
  synopsis:        z.string().optional(),
  isbn:            z.string().optional(),
  published_at:    z.string().optional(),
  page_count:      z.coerce.number().int().positive().optional(),
  price_hardcover: z.coerce.number().min(0).optional(),
  price_paperback: z.coerce.number().min(0).optional(),
  price_ebook:     z.coerce.number().min(0).optional(),
  is_featured:     z.coerce.boolean().optional(),
  is_new_release:  z.coerce.boolean().optional(),
  is_bestseller:   z.coerce.boolean().optional(),
  is_staff_pick:   z.coerce.boolean().optional(),
})

export type BookInput = z.infer<typeof BookSchema>
