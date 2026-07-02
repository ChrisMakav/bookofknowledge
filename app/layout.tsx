import type { Metadata } from 'next'
import { Geist, Geist_Mono, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const plusJakarta = Plus_Jakarta_Sans({
  variable: '--font-plus-jakarta',
  subsets: ['latin'],
  weight: ['700', '800'],
})

export const metadata: Metadata = {
  title: {
    template: '%s — Book of Knowledge',
    default: 'Book of Knowledge — Where Every Story Comes to Life',
  },
  description:
    'Discover, buy, and read books from a curated catalog of 24,000+ titles. Join millions of readers finding their next obsession.',
  openGraph: {
    type: 'website',
    siteName: 'Book of Knowledge',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} ${plusJakarta.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
