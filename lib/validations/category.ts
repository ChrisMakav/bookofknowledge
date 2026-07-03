import { z } from 'zod'

export const CategorySchema = z.object({
  name:        z.string().min(1, 'Nom requis'),
  slug:        z.string().min(1, 'Slug requis').regex(/^[a-z0-9-]+$/, 'Slug : minuscules, chiffres et tirets uniquement'),
  description: z.string().optional(),
})

export type CategoryInput = z.infer<typeof CategorySchema>
