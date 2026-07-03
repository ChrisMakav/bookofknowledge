import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Politique de Cookies — Book of Knowledge',
  description: 'Politique d\'utilisation des cookies sur la plateforme Book of Knowledge.',
}

const LAST_UPDATED = '3 juillet 2026'
const SITE         = 'Book of Knowledge'
const EMAIL        = 'contact@bookofknowledge.fr'

const COOKIES = [
  {
    name: 'sb-access-token',
    type: 'Essentiel',
    purpose: 'Authentification utilisateur (session Supabase)',
    duration: 'Session',
  },
  {
    name: 'sb-refresh-token',
    type: 'Essentiel',
    purpose: 'Renouvellement automatique de la session',
    duration: '1 an',
  },
  {
    name: '__stripe_mid',
    type: 'Paiement',
    purpose: 'Prévention de la fraude lors des paiements (Stripe)',
    duration: '1 an',
  },
  {
    name: '__stripe_sid',
    type: 'Paiement',
    purpose: 'Session de paiement sécurisée (Stripe)',
    duration: '30 min',
  },
]

export default function CookiesPage() {
  return (
    <div className="bg-surface-page min-h-screen">

      {/* Hero */}
      <section
        className="py-16"
        style={{ background: 'linear-gradient(135deg, var(--color-surface-dark) 0%, #2D1B69 60%, #1E1B3A 100%)' }}
      >
        <div className="max-w-3xl mx-auto px-6 text-center flex flex-col items-center gap-3">
          <h1 className="font-display text-4xl md:text-5xl font-extrabold text-white">
            Politique de Cookies
          </h1>
          <p className="text-white/60 text-sm">Dernière mise à jour : {LAST_UPDATED}</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6">
          <div className="flex flex-col gap-10 text-text-secondary text-sm leading-relaxed">

            <div className="flex flex-col gap-3">
              <p>
                Un cookie est un petit fichier texte déposé sur votre appareil lors de la visite d&apos;un site web.
                Il permet de mémoriser des informations sur votre navigation afin d&apos;améliorer votre expérience.
                La présente politique décrit les cookies utilisés par <strong>{SITE}</strong>.
              </p>
            </div>

            {/* Section 1 */}
            <div>
              <h2 className="font-display text-xl font-bold text-text-primary mb-3">1. Cookies que nous utilisons</h2>
              <p className="mb-4">
                {SITE} utilise uniquement des cookies <strong>strictement nécessaires</strong> au fonctionnement
                de la plateforme. Aucun cookie publicitaire ou de traçage commercial n&apos;est déposé.
              </p>

              {/* Table */}
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-sm text-left">
                  <thead className="bg-surface-subtle text-text-muted text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Nom</th>
                      <th className="px-4 py-3 font-semibold">Type</th>
                      <th className="px-4 py-3 font-semibold">Finalité</th>
                      <th className="px-4 py-3 font-semibold">Durée</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {COOKIES.map((c) => (
                      <tr key={c.name} className="bg-white">
                        <td className="px-4 py-3 font-mono text-xs text-text-primary">{c.name}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${
                            c.type === 'Essentiel'
                              ? 'bg-green-50 text-green-700'
                              : 'bg-blue-50 text-blue-700'
                          }`}>
                            {c.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-text-secondary">{c.purpose}</td>
                        <td className="px-4 py-3 text-text-muted">{c.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 2 */}
            <div>
              <h2 className="font-display text-xl font-bold text-text-primary mb-3">2. Cookies tiers</h2>
              <p>
                Lors d&apos;un paiement, <strong>Stripe</strong> peut déposer ses propres cookies à des fins
                de prévention de la fraude. Ces cookies sont soumis à la{' '}
                <a href="https://stripe.com/fr/privacy" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">
                  politique de confidentialité de Stripe
                </a>.
              </p>
            </div>

            {/* Section 3 */}
            <div>
              <h2 className="font-display text-xl font-bold text-text-primary mb-3">3. Gestion des cookies</h2>
              <p className="mb-4">
                Les cookies essentiels ne peuvent pas être désactivés car ils sont indispensables au
                fonctionnement de la plateforme (connexion, panier, sécurité des paiements).
              </p>
              <p className="mb-4">
                Vous pouvez à tout moment configurer votre navigateur pour bloquer ou supprimer les cookies.
                Notez que cela peut affecter certaines fonctionnalités du site, notamment votre session de
                connexion.
              </p>
              <ul className="pl-5 list-disc flex flex-col gap-1">
                <li>
                  <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">
                    Google Chrome
                  </a>
                </li>
                <li>
                  <a href="https://support.mozilla.org/fr/kb/activer-desactiver-cookies" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">
                    Mozilla Firefox
                  </a>
                </li>
                <li>
                  <a href="https://support.apple.com/fr-fr/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">
                    Safari
                  </a>
                </li>
                <li>
                  <a href="https://support.microsoft.com/fr-fr/microsoft-edge/supprimer-les-cookies-dans-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">
                    Microsoft Edge
                  </a>
                </li>
              </ul>
            </div>

            {/* Section 4 */}
            <div>
              <h2 className="font-display text-xl font-bold text-text-primary mb-3">4. Contact</h2>
              <p>
                Pour toute question relative à l&apos;utilisation des cookies sur {SITE}, contactez-nous à{' '}
                <a href={`mailto:${EMAIL}`} className="text-brand-600 hover:underline">{EMAIL}</a>.
              </p>
            </div>

          </div>
        </div>
      </section>

    </div>
  )
}
