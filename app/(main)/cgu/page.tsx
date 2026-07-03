import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Conditions Générales d\'Utilisation — Book of Knowledge',
  description: 'Conditions générales d\'utilisation de la plateforme Book of Knowledge.',
}

const LAST_UPDATED = '3 juillet 2026'
const COMPANY      = 'MAKAV Service Digital'
const SITE         = 'Book of Knowledge'
const EMAIL        = 'contact@bookofknowledge.fr'

export default function CGUPage() {
  return (
    <div className="bg-surface-page min-h-screen">

      {/* Hero */}
      <section
        className="py-16"
        style={{ background: 'linear-gradient(135deg, var(--color-surface-dark) 0%, #2D1B69 60%, #1E1B3A 100%)' }}
      >
        <div className="max-w-3xl mx-auto px-6 text-center flex flex-col items-center gap-3">
          <h1 className="font-display text-4xl md:text-5xl font-extrabold text-white">
            Conditions Générales d&apos;Utilisation
          </h1>
          <p className="text-white/60 text-sm">Dernière mise à jour : {LAST_UPDATED}</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6">
          <div className="prose prose-sm prose-neutral max-w-none text-text-secondary [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-text-primary [&_h2]:mt-10 [&_h2]:mb-3 [&_h3]:font-semibold [&_h3]:text-text-primary [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:leading-relaxed [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:pl-5 [&_li]:mb-1">

            <p>
              Les présentes Conditions Générales d&apos;Utilisation (ci-après « CGU ») régissent l&apos;accès et
              l&apos;utilisation de la plateforme <strong>{SITE}</strong>, éditée par <strong>{COMPANY}</strong>,
              fondée par Rachide MABILA-KIPOUPA. En accédant au site, vous acceptez sans réserve les présentes CGU.
            </p>

            <h2>1. Présentation de la plateforme</h2>
            <p>
              {SITE} est une librairie chrétienne en ligne proposant des livres numériques et physiques d&apos;auteurs
              chrétiens. La plateforme est accessible à l&apos;adresse <strong>bookofknowledge.fr</strong> et est
              éditée par {COMPANY}.
            </p>

            <h2>2. Accès au service</h2>
            <p>
              L&apos;accès à la plateforme est libre et gratuit. Certaines fonctionnalités (favoris, historique de
              commandes, avis) nécessitent la création d&apos;un compte utilisateur.
            </p>
            <p>
              Vous devez avoir au moins 18 ans ou disposer de l&apos;autorisation de votre représentant légal pour
              créer un compte et effectuer des achats.
            </p>

            <h2>3. Création de compte</h2>
            <p>
              Lors de la création de votre compte, vous vous engagez à fournir des informations exactes, complètes
              et à jour. Vous êtes responsable de la confidentialité de votre mot de passe et de toutes les activités
              réalisées depuis votre compte.
            </p>
            <p>
              Tout accès non autorisé à votre compte doit être signalé sans délai à{' '}
              <a href={`mailto:${EMAIL}`} className="text-brand-600 hover:underline">{EMAIL}</a>.
            </p>

            <h2>4. Commandes et paiement</h2>
            <h3>4.1 Processus de commande</h3>
            <p>
              La validation de votre panier vaut acceptation ferme de votre commande. Un e-mail de confirmation vous
              est adressé après validation du paiement.
            </p>
            <h3>4.2 Prix</h3>
            <p>
              Les prix sont affichés en euros (€), toutes taxes comprises (TTC). {COMPANY} se réserve le droit de
              modifier les prix à tout moment, sans que cela affecte les commandes déjà validées.
            </p>
            <h3>4.3 Paiement sécurisé</h3>
            <p>
              Les paiements sont traités par <strong>Stripe</strong>, certifié PCI-DSS. {SITE} ne stocke aucune
              donnée bancaire. Les transactions sont sécurisées par le protocole SSL/TLS et l&apos;authentification
              forte (3D Secure).
            </p>

            <h2>5. Droit de rétractation</h2>
            <p>
              Conformément à l&apos;article L221-18 du Code de la consommation, vous disposez d&apos;un délai de
              <strong> 14 jours</strong> à compter de la réception de votre commande pour exercer votre droit de
              rétractation, sans justification.
            </p>
            <p>
              <strong>Exception :</strong> les livres numériques (ebooks) téléchargés ou auxquels l&apos;accès a été
              fourni sont exclus du droit de rétractation (article L221-28 du Code de la consommation).
            </p>
            <p>
              Pour exercer ce droit, contactez-nous à{' '}
              <a href={`mailto:${EMAIL}`} className="text-brand-600 hover:underline">{EMAIL}</a>.
            </p>

            <h2>6. Propriété intellectuelle</h2>
            <p>
              L&apos;ensemble des contenus présents sur {SITE} (textes, images, logos, mise en page, code source)
              est protégé par le droit d&apos;auteur et appartient à {COMPANY} ou à ses partenaires. Toute
              reproduction ou utilisation sans autorisation préalable est interdite.
            </p>
            <p>
              Les couvertures et contenus des livres restent la propriété exclusive de leurs auteurs et éditeurs
              respectifs.
            </p>

            <h2>7. Responsabilité</h2>
            <p>
              {COMPANY} s&apos;efforce d&apos;assurer l&apos;exactitude des informations publiées sur {SITE} mais
              ne peut garantir leur exhaustivité. La plateforme peut être temporairement indisponible pour des
              raisons de maintenance ou de force majeure.
            </p>
            <p>
              {COMPANY} ne saurait être tenu responsable des dommages directs ou indirects résultant de
              l&apos;utilisation ou de l&apos;impossibilité d&apos;utiliser la plateforme.
            </p>

            <h2>8. Comportement des utilisateurs</h2>
            <p>Il est interdit d&apos;utiliser la plateforme pour :</p>
            <ul>
              <li>Publier des contenus illicites, injurieux ou contraires aux valeurs chrétiennes prônées par le site ;</li>
              <li>Tenter de pirater ou de perturber le fonctionnement de la plateforme ;</li>
              <li>Collecter des données personnelles d&apos;autres utilisateurs sans leur consentement ;</li>
              <li>Usurper l&apos;identité d&apos;une autre personne.</li>
            </ul>
            <p>
              Tout manquement peut entraîner la suspension ou la suppression du compte sans préavis.
            </p>

            <h2>9. Modifications des CGU</h2>
            <p>
              {COMPANY} se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront
              informés par e-mail ou par une notification sur la plateforme. La poursuite de l&apos;utilisation du
              service après modification vaut acceptation des nouvelles CGU.
            </p>

            <h2>10. Droit applicable et juridiction</h2>
            <p>
              Les présentes CGU sont soumises au droit français. En cas de litige, et à défaut de résolution amiable,
              les tribunaux compétents de France seront seuls compétents.
            </p>
            <p>
              Pour toute question relative aux présentes CGU, contactez-nous à{' '}
              <a href={`mailto:${EMAIL}`} className="text-brand-600 hover:underline">{EMAIL}</a>.
            </p>

          </div>
        </div>
      </section>

    </div>
  )
}
