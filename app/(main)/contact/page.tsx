import type { Metadata } from 'next'
import { ContactForm } from './contact-form'
import { Mail, MapPin, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact — Book of Knowledge',
  description: 'Contactez l\'équipe Book of Knowledge pour toute question ou demande.',
}

const INFO = [
  {
    icon: Mail,
    label: 'Email',
    value: 'contact@bookofknowledge.fr',
    href: 'mailto:contact@bookofknowledge.fr',
  },
  {
    icon: MapPin,
    label: 'Localisation',
    value: 'France — Service digital remote-first',
    href: null,
  },
  {
    icon: Clock,
    label: 'Délai de réponse',
    value: 'Sous 24 à 48h ouvrées',
    href: null,
  },
]

export default function ContactPage() {
  return (
    <div className="bg-surface-page min-h-screen">

      {/* ── Hero ── */}
      <section
        className="py-20"
        style={{
          background: 'linear-gradient(135deg, var(--color-surface-dark) 0%, #2D1B69 60%, #1E1B3A 100%)',
        }}
      >
        <div className="max-w-3xl mx-auto px-6 text-center flex flex-col items-center gap-4">
          <h1 className="font-display text-4xl md:text-5xl font-extrabold text-white leading-tight">
            Contactez-nous
          </h1>
          <p className="text-white/70 text-lg max-w-xl">
            Une question, une suggestion, une demande de partenariat ?
            L&apos;équipe Book of Knowledge vous répond.
          </p>
        </div>
      </section>

      {/* ── Contenu ── */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-5 gap-12">

          {/* Infos */}
          <div className="md:col-span-2 flex flex-col gap-8">
            <div>
              <h2 className="font-display text-xl font-bold text-text-primary mb-2">
                MAKAV Service Digital
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed">
                Book of Knowledge est une création de MAKAV Service Digital,
                fondé par Rachide MABILA-KIPOUPA. Nous sommes à votre écoute
                pour toute question relative à la plateforme, aux commandes
                ou aux partenariats.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {INFO.map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="size-9 rounded-lg bg-brand-50 flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-brand-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-0.5">{label}</p>
                    {href ? (
                      <a href={href} className="text-sm text-brand-600 hover:underline font-medium">{value}</a>
                    ) : (
                      <p className="text-sm text-text-secondary">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-xl bg-gradient-to-br from-brand-50 to-accent-50 border border-brand-100 p-5">
              <p className="text-sm font-semibold text-text-primary mb-1">
                Vous êtes auteur chrétien ?
              </p>
              <p className="text-sm text-text-secondary leading-relaxed">
                Vous souhaitez que vos livres soient référencés sur Book of Knowledge ?
                Mentionnez-le dans votre message, nous étudions toutes les demandes.
              </p>
            </div>
          </div>

          {/* Formulaire */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-2xl border border-border p-8 shadow-sm">
              <h2 className="font-display text-xl font-bold text-text-primary mb-6">
                Envoyer un message
              </h2>
              <ContactForm />
            </div>
          </div>

        </div>
      </section>

    </div>
  )
}
