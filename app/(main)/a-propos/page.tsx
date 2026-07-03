import type { Metadata } from 'next'
import Link from 'next/link'
import { BookOpen, Target, Heart, Zap, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'À propos — Book of Knowledge',
  description: 'Découvrez l\'histoire et la vision derrière Book of Knowledge, la librairie chrétienne créée par MAKAV Service Digital.',
}

const VALUES = [
  {
    icon: BookOpen,
    title: 'La connaissance qui transforme',
    body: 'Chaque livre de notre catalogue a été sélectionné pour son pouvoir de transformation. Nous croyons que la lecture est un acte spirituel qui nourrit l\'âme et élève l\'esprit.',
  },
  {
    icon: Heart,
    title: 'Des auteurs qui édifient',
    body: 'Nous mettons en avant des auteurs chrétiens dont la vie et les écrits témoignent d\'une foi authentique et d\'une expérience vécue de la Parole.',
  },
  {
    icon: Target,
    title: 'Une destinée à accomplir',
    body: 'Nous accompagnons chaque lecteur dans son parcours vers l\'accomplissement de sa destinée — leadership, mariage, ministère, développement personnel ou réussite.',
  },
  {
    icon: Zap,
    title: 'L\'excellence au service de Dieu',
    body: 'Né de l\'expertise digitale de MAKAV Service Digital, Book of Knowledge allie rigueur technologique et passion pour le royaume de Dieu.',
  },
]

export default function AboutPage() {
  return (
    <div className="bg-surface-page">

      {/* ── Hero ── */}
      <section
        className="relative overflow-hidden py-24"
        style={{
          background: 'linear-gradient(135deg, var(--color-surface-dark) 0%, #2D1B69 60%, #1E1B3A 100%)',
        }}
      >
        <div
          className="absolute -top-24 -right-24 size-96 rounded-full opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #7755FF 0%, transparent 70%)' }}
          aria-hidden
        />
        <div className="relative max-w-4xl mx-auto px-6 text-center flex flex-col items-center gap-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-500/20 text-accent-400 text-xs font-semibold uppercase tracking-wider border border-accent-500/30">
            Notre histoire
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold text-white leading-tight">
            Grandis dans la foi,
            <br />
            <span className="text-accent-400">un livre à la fois</span>
          </h1>
          <p className="text-base md:text-lg text-white/70 leading-relaxed max-w-2xl">
            Book of Knowledge est la librairie chrétienne de référence, créée pour mettre
            entre tes mains les livres qui nourrissent l&apos;âme, développent le caractère
            et t&apos;aident à accomplir ta destinée.
          </p>
        </div>
      </section>

      {/* ── Notre mission ── */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-5">
              <h2 className="font-display text-3xl font-bold text-text-primary">
                Pourquoi Book of Knowledge ?
              </h2>
              <p className="text-text-secondary leading-relaxed">
                Il existe des milliers de livres chrétiens, mais trouver ceux qui correspondent
                exactement à là où tu en es dans ta vie — ta saison spirituelle, tes défis,
                ta croissance — n&apos;est pas toujours simple.
              </p>
              <p className="text-text-secondary leading-relaxed">
                Book of Knowledge a été créé pour répondre à ce besoin : une plateforme
                pensée par et pour la communauté chrétienne francophone, avec un catalogue
                organisé par thématiques de vie, des auteurs reconnus et une expérience
                d&apos;achat simple et sécurisée.
              </p>
              <p className="text-text-secondary leading-relaxed">
                Notre conviction : <span className="font-semibold text-text-primary">un bon livre au bon moment peut changer une vie.</span>
              </p>
            </div>
            <div className="bg-gradient-to-br from-brand-50 to-accent-50 rounded-2xl p-8 flex flex-col gap-4">
              <p className="text-4xl font-extrabold font-display text-brand-600">18</p>
              <p className="text-text-secondary text-sm">catégories thématiques soigneusement organisées</p>
              <div className="h-px bg-border" />
              <p className="text-4xl font-extrabold font-display text-accent-500">100%</p>
              <p className="text-text-secondary text-sm">livres chrétiens, sélectionnés avec soin</p>
              <div className="h-px bg-border" />
              <p className="text-4xl font-extrabold font-display text-brand-600">1</p>
              <p className="text-text-secondary text-sm">mission : t&apos;aider à grandir dans la foi</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Nos valeurs ── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-text-primary mb-3">Ce en quoi nous croyons</h2>
            <p className="text-text-secondary max-w-xl mx-auto">
              Quatre piliers guident chaque décision que nous prenons chez Book of Knowledge.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {VALUES.map(({ icon: Icon, title, body }) => (
              <div key={title} className="bg-surface-page rounded-xl p-6 flex flex-col gap-3 border border-border">
                <div className="size-10 rounded-lg bg-brand-50 flex items-center justify-center">
                  <Icon size={20} className="text-brand-600" />
                </div>
                <h3 className="font-semibold text-text-primary">{title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MAKAV Service Digital ── */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex flex-col gap-6">
            <div className="inline-flex w-fit items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-600 text-xs font-semibold uppercase tracking-wider border border-brand-100">
              Derrière la plateforme
            </div>
            <h2 className="font-display text-3xl font-bold text-text-primary">
              MAKAV Service Digital
            </h2>
            <div className="grid md:grid-cols-2 gap-10 items-start">
              <div className="flex flex-col gap-4">
                <p className="text-text-secondary leading-relaxed">
                  Book of Knowledge est une création de <span className="font-semibold text-text-primary">MAKAV Service Digital</span>,
                  une agence digitale fondée par <span className="font-semibold text-text-primary">Rachide MABILA-KIPOUPA</span>,
                  ingénieur chef de projet et expert digital avec plus de 15 ans d&apos;expérience
                  dans l&apos;industrie lourde (GE Energy, Total E&P, Schlumberger, Zodiac Aerospace…).
                </p>
                <p className="text-text-secondary leading-relaxed">
                  Fort d&apos;une formation d&apos;ingénieur (UTBM) et d&apos;une expertise en transformation
                  digitale, Rachide a fondé MAKAV Service Digital avec une vision claire :
                  mettre la puissance des outils technologiques des grands groupes au service
                  des PME, associations et projets à impact — sans la lourdeur associée.
                </p>
                <p className="text-text-secondary leading-relaxed">
                  Book of Knowledge est l&apos;expression de cette vision appliquée à la communauté
                  chrétienne francophone : une plateforme rigoureuse, belle et efficace,
                  entièrement dédiée à la diffusion du savoir chrétien.
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <div className="bg-surface-dark rounded-xl p-6 flex flex-col gap-4">
                  <h4 className="text-white font-semibold text-sm uppercase tracking-wider">Rachide MABILA-KIPOUPA</h4>
                  <ul className="flex flex-col gap-2.5 text-sm text-white/70">
                    <li className="flex items-start gap-2">
                      <span className="text-accent-400 mt-0.5">▸</span>
                      Ingénieur UTBM · DUT ENSP · IBC London
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent-400 mt-0.5">▸</span>
                      15+ ans en industrie lourde (ferroviaire, aéronautique, pétrole & gaz)
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent-400 mt-0.5">▸</span>
                      Expert en transformation digitale & IA
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent-400 mt-0.5">▸</span>
                      Fondateur de MAKAV Service Digital
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent-400 mt-0.5">▸</span>
                      50+ projets livrés · 30+ clients accompagnés
                    </li>
                  </ul>
                  <a
                    href="https://rmabila-kipoupa.xyz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-accent-400 text-sm font-semibold hover:underline mt-1"
                  >
                    Découvrir son parcours <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 bg-white">
        <div className="max-w-2xl mx-auto px-6 text-center flex flex-col items-center gap-6">
          <h2 className="font-display text-2xl font-bold text-text-primary">
            Prêt à commencer ton voyage ?
          </h2>
          <p className="text-text-secondary">
            Parcours notre catalogue et trouve le livre qui parlera à ton cœur aujourd&apos;hui.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/catalogue"
              className="inline-flex items-center gap-2 h-11 px-6 rounded-lg bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 transition-colors"
            >
              Explorer le catalogue <ArrowRight size={15} />
            </Link>
            <Link
              href="/decouvrir"
              className="inline-flex items-center h-11 px-6 rounded-lg border border-border text-sm font-semibold text-text-primary hover:bg-surface-subtle transition-colors"
            >
              Découvrir les sélections
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
