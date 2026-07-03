'use server'

import { z } from 'zod'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import type { ActionResult } from '@/actions/auth'

const ContactSchema = z.object({
  name:    z.string().min(2, 'Nom requis'),
  email:   z.string().email('Email invalide'),
  subject: z.string().min(2, 'Sujet requis'),
  message: z.string().min(10, 'Message trop court (10 caractères min)'),
})

export async function sendContactMessage(
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  const raw = Object.fromEntries(formData.entries())
  const parsed = ContactSchema.safeParse(raw)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const supabase = await getSupabaseServerClient()
  const { error } = await supabase.from('contact_messages').insert(parsed.data)
  if (error) return { error: 'Une erreur est survenue. Veuillez réessayer.' }

  return { success: true }
}
