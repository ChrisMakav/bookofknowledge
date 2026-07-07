import { getResend } from '@/lib/resend/client'
import { getSupabaseServiceClient } from '@/lib/supabase/server'
import type { BookFormat, Order, OrderItem, ShippingAddress } from '@/types'

const FORMAT_LABELS: Record<BookFormat, string> = {
  hardcover: 'Relié',
  paperback: 'Broché',
  ebook:     'E-book',
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3002'

function renderAddress(address: ShippingAddress | null): string {
  if (!address) return ''

  return `
    <tr>
      <td style="padding-top:24px;">
        <p style="margin:0 0 8px;font-size:14px;font-weight:600;color:#0F0A2E;">Adresse de livraison</p>
        <p style="margin:0;font-size:14px;line-height:1.6;color:#5B5470;">
          ${address.full_name}<br />
          ${address.line1}${address.line2 ? `<br />${address.line2}` : ''}<br />
          ${address.postal_code} ${address.city}<br />
          ${address.country}
        </p>
      </td>
    </tr>
  `
}

function renderItemRow(item: OrderItem): string {
  const title = item.book?.title ?? 'Livre'
  return `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid #EDEAFB;">
        <p style="margin:0;font-size:14px;font-weight:600;color:#0F0A2E;">${title}</p>
        <p style="margin:4px 0 0;font-size:13px;color:#5B5470;">
          ${FORMAT_LABELS[item.format]} · ${item.quantity} × ${item.unit_price.toFixed(2)} €
        </p>
      </td>
      <td style="padding:12px 0;border-bottom:1px solid #EDEAFB;text-align:right;vertical-align:top;">
        <p style="margin:0;font-size:14px;font-weight:600;color:#0F0A2E;white-space:nowrap;">
          ${(item.unit_price * item.quantity).toFixed(2)} €
        </p>
      </td>
    </tr>
  `
}

function renderSummaryRow(label: string, value: string, opts?: { bold?: boolean; muted?: boolean }): string {
  const color  = opts?.muted ? '#5B5470' : '#0F0A2E'
  const weight = opts?.bold ? '700' : '400'
  const size   = opts?.bold ? '16px' : '14px'
  return `
    <tr>
      <td style="padding:4px 0;font-size:${size};font-weight:${weight};color:${color};">${label}</td>
      <td style="padding:4px 0;font-size:${size};font-weight:${weight};color:${color};text-align:right;">${value}</td>
    </tr>
  `
}

export function renderOrderConfirmationHtml(order: Order & { order_items: OrderItem[] }): string {
  const orderNumber = order.id.slice(-8).toUpperCase()
  const itemsHtml    = order.order_items.map(renderItemRow).join('')

  const summaryRows = [
    renderSummaryRow('Sous-total', `${order.subtotal.toFixed(2)} €`, { muted: true }),
    order.discount > 0 ? renderSummaryRow('Remise', `−${order.discount.toFixed(2)} €`, { muted: true }) : '',
    renderSummaryRow('TVA (20%)', `${order.tax.toFixed(2)} €`, { muted: true }),
    renderSummaryRow('Frais de livraison', `${order.shipping_cost.toFixed(2)} €`, { muted: true }),
  ].join('')

  return `
<!doctype html>
<html lang="fr">
  <body style="margin:0;padding:0;background-color:#F7F5FF;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F7F5FF;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#FFFFFF;border-radius:16px;overflow:hidden;">
            <tr>
              <td style="background-color:#5B3BF5;padding:28px 32px;">
                <p style="margin:0;font-size:18px;font-weight:700;color:#FFFFFF;letter-spacing:-0.01em;">Book of Knowledge</p>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                <p style="margin:0 0 4px;font-size:12px;font-weight:600;color:#5B3BF5;text-transform:uppercase;letter-spacing:0.04em;">Paiement confirmé</p>
                <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#0F0A2E;">Merci pour votre commande !</h1>
                <p style="margin:0 0 24px;font-size:14px;line-height:1.6;color:#5B5470;">
                  Nous avons bien reçu votre paiement. Votre commande <strong>#${orderNumber}</strong> est en cours de préparation.
                </p>

                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  ${itemsHtml}
                </table>

                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;">
                  ${summaryRows}
                  <tr>
                    <td colspan="2" style="padding-top:12px;border-top:1px solid #EDEAFB;"></td>
                  </tr>
                  ${renderSummaryRow('Total payé', `${order.total.toFixed(2)} €`, { bold: true })}
                </table>

                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  ${renderAddress(order.shipping_address)}
                </table>

                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:32px;">
                  <tr>
                    <td align="center">
                      <a href="${APP_URL}/compte/commandes/${order.id}"
                         style="display:inline-block;padding:12px 24px;background-color:#5B3BF5;color:#FFFFFF;font-size:14px;font-weight:600;text-decoration:none;border-radius:8px;">
                        Voir ma commande
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px;background-color:#F7F5FF;">
                <p style="margin:0;font-size:12px;color:#8B84A3;text-align:center;">
                  Book of Knowledge · Une question sur votre commande ? Répondez simplement à cet email.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
  `
}

export async function sendOrderConfirmationEmail(orderId: string): Promise<void> {
  const supabase = getSupabaseServiceClient()

  const { data: order } = await supabase
    .from('orders')
    .select('*, order_items(*, book:books(title, cover_url, slug))')
    .eq('id', orderId)
    .single()

  if (!order) return

  const { data: authUser } = await supabase.auth.admin.getUserById(order.user_id)
  const email = authUser?.user?.email
  if (!email) return

  const orderNumber = order.id.slice(-8).toUpperCase()

  await getResend().emails.send({
    from:    process.env.RESEND_FROM_EMAIL!,
    to:      email,
    subject: `Confirmation de votre commande #${orderNumber} — Book of Knowledge`,
    html:    renderOrderConfirmationHtml(order),
  })
}
