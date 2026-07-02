import { z } from 'zod'

export const LoginSchema = z.object({
  email:    z.string().email('Adresse email invalide'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
})

export const RegisterSchema = z
  .object({
    full_name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
    email:     z.string().email('Adresse email invalide'),
    password:  z
      .string()
      .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
      .regex(/[A-Z]/, 'Doit contenir au moins une majuscule')
      .regex(/[0-9]/, 'Doit contenir au moins un chiffre'),
    confirm_password: z.string(),
  })
  .refine((d) => d.password === d.confirm_password, {
    message: 'Les mots de passe ne correspondent pas',
    path:    ['confirm_password'],
  })

export const ForgotPasswordSchema = z.object({
  email: z.string().email('Adresse email invalide'),
})

export type LoginInput     = z.infer<typeof LoginSchema>
export type RegisterInput  = z.infer<typeof RegisterSchema>
export type ForgotInput    = z.infer<typeof ForgotPasswordSchema>
