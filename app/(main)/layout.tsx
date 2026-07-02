import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { CartDrawer } from '@/components/cart/cart-drawer'
import { getSupabaseServerClient } from '@/lib/supabase/server'

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  let isAdmin = false
  if (user) {
    const { data } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single()
    isAdmin = data?.is_admin ?? false
  }

  return (
    <>
      <Navbar isAdmin={isAdmin} />
      <main className="flex-1 pt-16">{children}</main>
      <Footer />
      <CartDrawer />
    </>
  )
}
