import type { Metadata } from 'next'
import { CheckoutClient } from './checkout-client'

export const metadata: Metadata = {
  title: 'Paiement',
}

export default function CheckoutPage() {
  return <CheckoutClient />
}
