import { z } from 'zod'

export const AuthorSchema = z.object({
  name:       z.string().min(1, 'Nom requis'),
  slug:       z.string().min(1, 'Slug requis').regex(/^[a-z0-9-]+$/, 'Slug : minuscules, chiffres et tirets'),
  bio:        z.string().optional(),
  avatar_url: z.string().url('URL invalide').or(z.literal('')).optional(),
})

export type AuthorInput = z.infer<typeof AuthorSchema>
