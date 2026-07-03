import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Politique de Confidentialité — Book of Knowledge',
  description: 'Politique de confidentialité et traitement des données personnelles sur Book of Knowledge.',
}

const LAST_UPDATED = '3 juillet 2026'
const COMPANY      = 'MAKAV Service Digital'
const SITE         = 'Book of Knowledge'
const EMAIL        = 'contact@bookofknowledge.fr'

export default function ConfidentialitePage() {
  return (
    <div className="bg-surface-page min-h-screen">

      {/* Hero */}
      <section
        className="py-16"
        style={{ background: 'linear-gradient(135deg, var(--color-surface-dark) 0%, #2D1B69 60%, #1E1B3A 100%)' }}
      >
        <div className="max-w-3xl mx-auto px-6 text-center flex flex-col items-center gap-3">
          <h1 className="font-display text-4xl md:text-5xl font-extrabold text-white">
            Politique de Confidentialité
          </h1>
          <p className="text-white/60 text-sm">Dernière mise à jour : {LAST_UPDATED}</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6">
          <div className="prose prose-sm prose-neutral max-w-none text-text-secondary [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-text-primary [&_h2]:mt-10 [&_h2]:mb-3 [&_h3]:font-semibold [&_h3]:text-text-primary [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:leading-relaxed [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:pl-5 [&_li]:mb-1">

            <p>
              La présente Politique de Confidentialité décrit la manière dont <strong>{COMPANY}</strong>, éditeur
              de la plateforme <strong>{SITE}</strong>, collecte, utilise et protège vos données personnelles,
              conformément au Règlement Général sur la Protection des Données (RGPD — UE 2016/679) et à la loi
              Informatique et Libertés.
            </p>

            <h2>1. Responsable du traitement</h2>
            <p>
              Le responsable du traitement des données est :<br />
              <strong>{COMPANY}</strong>, fondée par Rachide MABILA-KIPOUPA<br />
              Contact : <a href={`mailto:${EMAIL}`} className="text-brand-600 hover:underline">{EMAIL}</a>
            </p>

            <h2>2. Données collectées</h2>
            <h3>2.1 Données que vous nous fournissez</h3>
            <ul>
              <li><strong>Création de compte :</strong> nom complet, adresse e-mail, mot de passe (haché)</li>
              <li><strong>Commandes :</strong> adresse de livraison, informations de facturation</li>
              <li><strong>Messages de contact :</strong> nom, e-mail, sujet, contenu du message</li>
              <li><strong>Avis et commentaires :</strong> note, texte de l&apos;avis</li>
            </ul>

            <h3>2.2 Données collectées automatiquement</h3>
            <ul>
              <li>Adresse IP, type de navigateur, système d&apos;exploitation</li>
              <li>Pages visitées, durée de visite, source de trafic</li>
              <li>Données de session (cookies techniques nécessaires au fonctionnement)</li>
            </ul>

            <h2>3. Finalités du traitement</h2>
            <p>Vos données sont utilisées pour :</p>
            <ul>
              <li>Gérer votre compte et vous authentifier</li>
              <li>Traiter et suivre vos commandes</li>
              <li>Vous envoyer des confirmations de commande et communications transactionnelles</li>
              <li>Améliorer l&apos;expérience utilisateur et les fonctionnalités de la plateforme</li>
              <li>Répondre à vos messages et demandes de support</li>
              <li>Respecter nos obligations légales</li>
            </ul>

            <h2>4. Base légale du traitement</h2>
            <ul>
              <li><strong>Exécution du contrat :</strong> pour le traitement des commandes et la gestion de compte</li>
              <li><strong>Intérêt légitime :</strong> pour l&apos;amélioration du service et la sécurité</li>
              <li><strong>Consentement :</strong> pour les communications marketing (si applicable)</li>
              <li><strong>Obligation légale :</strong> pour la conservation des données comptables</li>
            </ul>

            <h2>5. Durée de conservation</h2>
            <ul>
              <li><strong>Données de compte :</strong> durée de vie du compte + 3 ans après inactivité</li>
              <li><strong>Données de commande :</strong> 10 ans (obligation comptable)</li>
              <li><strong>Messages de contact :</strong> 3 ans</li>
              <li><strong>Logs de connexion :</strong> 12 mois</li>
            </ul>

            <h2>6. Partage des données</h2>
            <p>
              Vos données personnelles ne sont jamais vendues. Elles peuvent être partagées avec :
            </p>
            <ul>
              <li>
                <strong>Supabase</strong> (hébergement base de données, UE) —{' '}
                <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">
                  Politique de confidentialité
                </a>
              </li>
              <li>
                <strong>Stripe</strong> (paiement sécurisé) —{' '}
                <a href="https://stripe.com/fr/privacy" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">
                  Politique de confidentialité
                </a>
              </li>
              <li>
                <strong>Vercel</strong> (hébergement de l&apos;application, UE/US avec garanties adéquates) —{' '}
                <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">
                  Politique de confidentialité
                </a>
              </li>
            </ul>
            <p>
              Ces prestataires agissent en qualité de sous-traitants et sont soumis à des engagements contractuels
              de confidentialité conformes au RGPD.
            </p>

            <h2>7. Sécurité des données</h2>
            <p>
              Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos
              données : chiffrement SSL/TLS, authentification sécurisée, contrôle d&apos;accès par rôles (RLS),
              mots de passe hachés (bcrypt).
            </p>

            <h2>8. Vos droits</h2>
            <p>Conformément au RGPD, vous disposez des droits suivants :</p>
            <ul>
              <li><strong>Droit d&apos;accès :</strong> obtenir une copie de vos données</li>
              <li><strong>Droit de rectification :</strong> corriger des données inexactes</li>
              <li><strong>Droit à l&apos;effacement :</strong> demander la suppression de vos données</li>
              <li><strong>Droit à la portabilité :</strong> recevoir vos données dans un format structuré</li>
              <li><strong>Droit d&apos;opposition :</strong> vous opposer à certains traitements</li>
              <li><strong>Droit à la limitation :</strong> limiter le traitement de vos données</li>
            </ul>
            <p>
              Pour exercer ces droits, contactez-nous à{' '}
              <a href={`mailto:${EMAIL}`} className="text-brand-600 hover:underline">{EMAIL}</a>.
              Nous répondrons dans un délai de <strong>30 jours</strong>.
            </p>
            <p>
              Vous avez également le droit d&apos;introduire une réclamation auprès de la{' '}
              <strong>CNIL</strong> (Commission Nationale de l&apos;Informatique et des Libertés) :{' '}
              <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">
                www.cnil.fr
              </a>.
            </p>

            <h2>9. Cookies</h2>
            <p>
              {SITE} utilise des cookies strictement nécessaires au fonctionnement de la plateforme
              (session, authentification, panier). Aucun cookie publicitaire ou de traçage tiers n&apos;est
              utilisé sans votre consentement explicite.
            </p>
            <p>
              Vous pouvez configurer votre navigateur pour refuser les cookies, ce qui peut affecter certaines
              fonctionnalités du site.
            </p>

            <h2>10. Modifications</h2>
            <p>
              Cette politique peut être mise à jour pour refléter des changements légaux ou fonctionnels.
              La date de dernière mise à jour est indiquée en haut de cette page. Pour toute question :{' '}
              <a href={`mailto:${EMAIL}`} className="text-brand-600 hover:underline">{EMAIL}</a>.
            </p>

          </div>
        </div>
      </section>

    </div>
  )
}
