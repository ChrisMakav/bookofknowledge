import Link from 'next/link'

const footerLinks = {
  'Explorer': [
    { label: 'Catalogue', href: '/catalogue' },
    { label: 'Nouveautés', href: '/nouveautes' },
    { label: 'Bestsellers', href: '/bestsellers' },
    { label: 'Packs', href: '/catalogue?genre=packs' },
  ],
  'Informations': [
    { label: 'À propos', href: '/a-propos' },
    { label: 'Nos auteurs', href: '/auteurs' },
    { label: 'Contact', href: '/contact' },
  ],
  'Légal': [
    { label: 'CGU', href: '/cgu' },
    { label: 'Confidentialité', href: '/confidentialite' },
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
              La librairie chrétienne de référence. Des livres qui nourrissent
              l&apos;âme, édifient le caractère et accomplissent la destinée.
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

        <div className="border-t border-border-dark pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-text-inverse-muted">
            © {new Date().getFullYear()} Book of Knowledge. Grandis dans la foi, un livre à la fois.
          </p>
          <p className="text-xs text-text-inverse-muted">
            Créé par{' '}
            <a
              href="https://rmabila-kipoupa.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-400 hover:underline font-medium"
            >
              MAKAV Service Digital
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
