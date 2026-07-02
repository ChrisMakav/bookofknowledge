import { z } from 'zod'

export const AddressSchema = z.object({
  full_name:   z.string().min(2, 'Nom requis'),
  line1:       z.string().min(3, 'Adresse requise'),
  line2:       z.string().optional(),
  city:        z.string().min(1, 'Ville requise'),
  postal_code: z.string().regex(/^\d{5}$/, 'Code postal invalide (5 chiffres)'),
  country:     z.string().min(2),
})

export type AddressInput = z.infer<typeof AddressSchema>
