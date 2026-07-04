'use server'

import { getSupabaseServerClient } from '@/lib/supabase/server'
import { getStripe } from '@/lib/stripe/server'
import type { CartItem, ShippingAddress } from '@/types'

interface CreatePaymentIntentInput {
  items:           CartItem[]
  shippingAddress: ShippingAddress
  promoCodeId?:    string
}

interface CreatePaymentIntentResult {
  clientSecret: string
  orderId:      string
  error?:       string
}

export async function createPaymentIntent(
  input: CreatePaymentIntentInput,
): Promise<CreatePaymentIntentResult> {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { clientSecret: '', orderId: '', error: 'Non authentifié' }

  // ─── 1. Validate prices server-side (never trust client) ─────────────────
  const bookIds = input.items.map((i) => i.bookId)
  const { data: books } = await supabase
    .from('books')
    .select('id, price_hardcover, price_paperback, price_ebook')
    .in('id', bookIds)

  if (!books || books.length !== bookIds.length) {
    return { clientSecret: '', orderId: '', error: 'Livre introuvable' }
  }

  let subtotal = 0
  const validatedItems = input.items.map((item) => {
    const book = books.find((b) => b.id === item.bookId)!
    const serverPrice =
      item.format === 'hardcover' ? book.price_hardcover
      : item.format === 'paperback' ? book.price_paperback
      : book.price_ebook

    if (serverPrice === null || serverPrice === undefined) {
      throw new Error(`Format ${item.format} indisponible pour ce livre`)
    }

    subtotal += serverPrice * item.quantity
    return { ...item, price: serverPrice }
  })

  // ─── 2. Validate promo code server-side ──────────────────────────────────
  let discount  = 0
  let promoId: string | null = null

  if (input.promoCodeId) {
    const { data: promo } = await supabase
      .from('promo_codes')
      .select('*')
      .eq('id', input.promoCodeId)
      .eq('active', true)
      .single()

    if (promo) {
      const now          = new Date()
      const notExpired   = !promo.expires_at || new Date(promo.expires_at) > now
      const notExhausted = promo.usage_limit === null || promo.used_count < promo.usage_limit

      if (notExpired && notExhausted) {
        if (promo.type === 'percentage') {
          discount = parseFloat((subtotal * promo.value / 100).toFixed(2))
        } else {
          discount = parseFloat(Math.min(Number(promo.value), subtotal).toFixed(2))
        }
        promoId = promo.id
      }
    }
  }

  const discountedBase = Math.max(0, subtotal - discount)
  const tax            = parseFloat((discountedBase * 0.2).toFixed(2))
  const total          = parseFloat((discountedBase + tax).toFixed(2))

  // ─── 3. Create pending order ──────────────────────────────────────────────
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id:          user.id,
      status:           'pending',
      subtotal,
      discount,
      promo_code_id:    promoId,
      tax,
      total,
      shipping_address: input.shippingAddress,
    })
    .select('id')
    .single()

  if (orderError || !order) {
    return { clientSecret: '', orderId: '', error: 'Erreur lors de la création de commande' }
  }

  // ─── 4. Insert order items ────────────────────────────────────────────────
  await supabase.from('order_items').insert(
    validatedItems.map((item) => ({
      order_id:   order.id,
      book_id:    item.bookId,
      format:     item.format,
      quantity:   item.quantity,
      unit_price: item.price,
    })),
  )

  // ─── 5. Create Stripe PaymentIntent ──────────────────────────────────────
  const stripe = getStripe()
  const intent = await stripe.paymentIntents.create({
    amount:   Math.round(total * 100),
    currency: 'eur',
    metadata: {
      order_id:      order.id,
      user_id:       user.id,
      promo_code_id: promoId ?? '',
    },
  })

  // ─── 6. Store payment intent ID ──────────────────────────────────────────
  await supabase
    .from('orders')
    .update({ stripe_payment_intent_id: intent.id })
    .eq('id', order.id)

  return { clientSecret: intent.client_secret!, orderId: order.id }
}

export async function updateOrderShippingAddress(
  orderId: string,
  address: ShippingAddress,
): Promise<void> {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase
    .from('orders')
    .update({ shipping_address: address })
    .eq('id', orderId)
    .eq('user_id', user.id)
}

export async function getOrders() {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from('orders')
    .select('*, order_items(*, book:books(title, cover_url, slug))')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return data ?? []
}
