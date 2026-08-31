import type { Metadata, Viewport } from 'next'
import { Manrope, Space_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/hooks/useAuth'
import { ThemeProvider } from '@/hooks/useTheme'
import { THEME_INIT_SCRIPT } from '@/lib/theme-config'
import { ClientLayout } from '@/components/layout/ClientLayout'
import { SITE_STATS } from '@/lib/constants/stats'
import '@/lib/env'
import './globals.css'

/* Gövde — Manrope. */
const manrope = Manrope({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
})

/* Etiket / veri — Space Mono. Eyebrow'lar, ödüller, bölüm numaraları. */
const spaceMono = Space_Mono({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '700'],
  variable: '--font-mono',
  display: 'swap',
})

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://onepiece-hub.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'One Piece Hub - Macera Başlasın',
    template: '%s | One Piece Hub',
  },
  description: `One Piece evrenini keşfet. ${SITE_STATS.arcs} arc'ta ${SITE_STATS.episodes} filler'sız bölüm, ${SITE_STATS.characters} karakterlik ansiklopedi, izleme takibi, quiz ve daha fazlası.`,
  keywords: ['One Piece', 'anime', 'manga', 'karakter', 'arc', 'filler', 'izleme rehberi', 'OnePaceTR', 'wiki'],
  authors: [{ name: 'One Piece Hub' }],
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    siteName: 'One Piece Hub',
    title: 'One Piece Hub - Macera Başlasın',
    description: 'Filler\'sız arc bazlı bölümler, karakter ansiklopedisi, izleme takibi ve daha fazlası.',
    images: [{ url: '/hero.webp', width: 1200, height: 630, alt: 'One Piece Hub' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'One Piece Hub - Macera Başlasın',
    description: 'Filler\'sız arc bazlı bölümler, karakter ansiklopedisi, izleme takibi ve daha fazlası.',
    images: ['/hero.webp'],
  },
  icons: {
    icon: [
      /* Pusula işareti — SVG destekleyen tarayıcılar bunu seçer, PNG'ler
         geriye dönük yedek. Tüm raster boyutlar `public/icon.svg` ve
         `public/icon-small.svg`'den üretildi (üretim notu: CLAUDE.md). */
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
}

/* Tema çubuğu rengi temayla birlikte dönsün — mobil tarayıcı chrome'u. */
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#060e1a' },
    { media: '(prefers-color-scheme: light)', color: '#f4f1e8' },
  ],
}

/* FOUC koruması: ilk boyamadan ÖNCE `<html data-theme>` yazılır.

   Script gövdesi `lib/theme-config.ts`'te ve orası düz (client olmayan) bir
   modül olmak ZORUNDA: `'use client'` taşıyan bir modülden import edilen
   sabit, server component'te gerçek string yerine client referans nesnesine
   dönüşüyor ve script'e `'[object Object]'` olarak gömülüyordu — script bir
   anahtara yazıp `useTheme` başka bir anahtardan okuyordu.

   Bu script ilk boyamayı garanti eder ama TEK BAŞINA yeterli DEĞİL:
   `loading.tsx` taşıyan rotalarda React istemci render'ına düşüp `<html>`i
   yeniden kuruyor ve attribute SSR değerine dönüyor. İkinci katman
   `hooks/useTheme.tsx`'teki mount effect'i — oradaki notu da oku. */

/* `<html>` üzerinde `data-theme` attribute'u BİLEREK yok.
   React'in bu attribute hakkında bir fikri olduğu anda, istemci render'ına
   düşen rotalarda (`loading.tsx` taşıyanlar — /arcs, /characters) kök
   elemanı yeniden kururken değeri SSR sabitine geri döndürüyor ve init
   script'in yazdığını siliyordu. Tek yazar: init script + `ThemeProvider`.
   Hiç yazılmadığında `globals.css`teki `:root` zaten dark paleti veriyor,
   yani JS kapalıyken de doğru görünüyor. */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // `data-theme` BİLEREK JSX'te YOK — sebebi RootLayout'un üstündeki notta.
    <html
      lang="tr"
      suppressHydrationWarning
      className={`${manrope.variable} ${spaceMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className={`${manrope.className} bg-ocean-deep`} suppressHydrationWarning>
        <ThemeProvider>
          <AuthProvider>
            <ClientLayout>{children}</ClientLayout>
          </AuthProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
