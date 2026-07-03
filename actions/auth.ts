'use server'

import { redirect } from 'next/navigation'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { LoginSchema, RegisterSchema, ForgotPasswordSchema } from '@/lib/validations/auth'

export interface ActionResult {
  error?: string
  success?: boolean
  redirectTo?: string
}

export async function login(
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  const raw = {
    email:    formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const parsed = LoginSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const supabase = await getSupabaseServerClient()
  const { error } = await supabase.auth.signInWithPassword(parsed.data)

  if (error) return { error: 'Email ou mot de passe incorrect.' }

  const redirectTo = formData.get('redirectTo') as string | null
  redirect(redirectTo || '/')
}

export async function register(
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  const raw = {
    full_name:        formData.get('full_name') as string,
    email:            formData.get('email') as string,
    password:         formData.get('password') as string,
    confirm_password: formData.get('confirm_password') as string,
  }

  const parsed = RegisterSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const supabase = await getSupabaseServerClient()
  const { error } = await supabase.auth.signUp({
    email:    parsed.data.email,
    password: parsed.data.password,
    options:  { data: { full_name: parsed.data.full_name } },
  })

  if (error) {
    if (error.message.includes('already registered')) {
      return { error: 'Un compte existe déjà avec cet email.' }
    }
    return { error: "Une erreur est survenue lors de l'inscription." }
  }

  return { success: true }
}

export async function logout(): Promise<void> {
  const supabase = await getSupabaseServerClient()
  await supabase.auth.signOut()
  redirect('/')
}

export async function resetPassword(
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  const raw = { email: formData.get('email') as string }

  const parsed = ForgotPasswordSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const supabase = await getSupabaseServerClient()
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/compte/nouveau-mot-de-passe`,
  })

  if (error) return { error: 'Une erreur est survenue. Veuillez réessayer.' }

  return { success: true }
}
