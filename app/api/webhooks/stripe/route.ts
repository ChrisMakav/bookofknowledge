import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getStripe } from '@/lib/stripe/server'
import { getSupabaseServiceClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const body      = await request.text()
  const headerList = await headers()
  const signature = headerList.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    )
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'payment_intent.succeeded') {
    const intent  = event.data.object as Stripe.PaymentIntent
    const orderId = intent.metadata.order_id

    if (orderId) {
      const supabase = await getSupabaseServiceClient()
      await supabase
        .from('orders')
        .update({ status: 'paid', updated_at: new Date().toISOString() })
        .eq('id', orderId)
    }
  }

  if (event.type === 'payment_intent.payment_failed') {
    const intent  = event.data.object as Stripe.PaymentIntent
    const orderId = intent.metadata.order_id

    if (orderId) {
      const supabase = await getSupabaseServiceClient()
      await supabase
        .from('orders')
        .update({ status: 'cancelled', updated_at: new Date().toISOString() })
        .eq('id', orderId)
    }
  }

  return NextResponse.json({ received: true })
}
