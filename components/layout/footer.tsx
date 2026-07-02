import Link from 'next/link'

const footerLinks = {
  'Book of Knowledge': [
    { label: 'À propos', href: '/a-propos' },
    { label: 'Carrières', href: '/carrieres' },
    { label: 'Presse', href: '/presse' },
  ],
  'Support': [
    { label: 'Centre d\'aide', href: '/aide' },
    { label: 'Carte cadeau', href: '/carte-cadeau' },
    { label: 'Accessibilité', href: '/accessibilite' },
  ],
  'Légal': [
    { label: 'Confidentialité', href: '/confidentialite' },
    { label: 'CGU', href: '/cgu' },
    { label: 'Cookies', href: '/cookies' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-surface-dark text-text-inverse">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link
              href="/"
              className="text-xl font-bold font-display text-white hover:text-accent-400 transition-colors"
            >
              Book of Knowledge
            </Link>
            <p className="mt-3 text-sm text-text-inverse-muted leading-relaxed">
              Où chaque histoire prend vie. Rejoignez des millions de lecteurs
              qui trouvent leur prochaine obsession.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-text-inverse-muted mb-4">
                {section}
              </h3>
              <ul className="space-y-2.5">
                {links.map(({ label, href }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm text-text-inverse-muted hover:text-white transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border-dark pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-inverse-muted">
            © {new Date().getFullYear()} Book of Knowledge. Keep the story moving.
          </p>
        </div>
      </div>
    </footer>
  )
}
