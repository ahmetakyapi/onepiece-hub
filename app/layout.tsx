import type { Metadata } from 'next'
import { Manrope, IBM_Plex_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/hooks/useAuth'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import dynamic from 'next/dynamic'

const ScrollProgress = dynamic(() => import('@/components/layout/ScrollProgress'), { ssr: false })
import './globals.css'

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
  display: 'swap',
})

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://onepiece-hub.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'One Piece Hub — Macera Başlasın',
    template: '%s | One Piece Hub',
  },
  description:
    'One Piece evrenini keşfet. Arc bazlı filler\'sız bölümler, 65+ karakter ansiklopedisi, izleme takibi, quiz ve daha fazlası.',
  keywords: ['One Piece', 'anime', 'manga', 'karakter', 'arc', 'filler', 'izleme rehberi', 'OnePaceTR', 'wiki'],
  authors: [{ name: 'One Piece Hub' }],
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    siteName: 'One Piece Hub',
    title: 'One Piece Hub — Macera Başlasın',
    description: 'Filler\'sız arc bazlı bölümler, karakter ansiklopedisi, izleme takibi ve daha fazlası.',
    images: [{ url: '/hero.webp', width: 1200, height: 630, alt: 'One Piece Hub' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'One Piece Hub — Macera Başlasın',
    description: 'Filler\'sız arc bazlı bölümler, karakter ansiklopedisi, izleme takibi ve daha fazlası.',
    images: ['/hero.webp'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" suppressHydrationWarning className={`${manrope.variable} ${ibmPlexMono.variable}`}>
      <head />
      <body className={`${manrope.className} bg-ocean-deep`} suppressHydrationWarning>
        <AuthProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[9999] focus:rounded-lg focus:bg-gold focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-ocean-deep"
          >
            İçeriğe atla
          </a>
          <ScrollProgress />
          <Header />
          {children}
          <Footer />
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
