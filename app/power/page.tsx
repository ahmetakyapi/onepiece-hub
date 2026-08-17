import type { Metadata } from 'next'
import Link from 'next/link'
import { BarChart3, ArrowRight } from 'lucide-react'
import PowerLeaderboard from '@/components/power/PowerLeaderboard'

/* /power → tier bazlı sıralama · /power-ranking → radar chart'lı stat analizi.
   Başlıkları bilerek ayrı: aynı başlıkla iki sayfa SEO'da birbirini yiyordu. */
export const metadata: Metadata = {
  title: 'Güç Sıralaması — Tier Listesi',
  description:
    'One Piece karakterlerinin tier bazlı güç sıralaması. Yonko, Komutan ve Supernova seviyeleri; stat bazında sırala.',
}

export default function PowerPage() {
  return (
    <main className="min-h-screen bg-ocean-deep">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-pirate-border/20 bg-gradient-to-b from-ocean-surface/60 via-ocean-deep to-ocean-deep px-6 py-20 sm:py-32">
        <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-gold/[0.08] blur-[100px]" />
        <div className="pointer-events-none absolute -left-32 -bottom-32 h-80 w-80 rounded-full bg-sea/[0.06] blur-[80px]" />

        <div className="relative mx-auto max-w-4xl text-center">
          {/* Metin rengi token'a bağlandı: eskiden `text-white` + siyah
              drop-shadow vardı, light temada parşömen zeminde kayboluyordu.
              Gölge de ocean-deep'e bağlı — light'ta kendiliğinden sönüyor. */}
          <h1 className="mb-3 text-5xl font-extrabold text-pirate-text drop-shadow-[0_4px_24px_rgb(var(--ocean-deep)/0.6)] sm:text-6xl md:text-7xl">
            Güç Sıralaması
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-pirate-text/70 drop-shadow-[0_2px_8px_rgb(var(--ocean-deep)/0.4)] sm:text-lg">
            One Piece dünyasının en güçlü korsanlarını keşfet. Güç seviyeleri, yetenekler ve istatistiklerle karşılaştır.
          </p>
        </div>
      </section>

      {/* Leaderboard */}
      <section className="relative px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <PowerLeaderboard />

          {/* Detaylı stat analizine köprü — /power-ranking aksi halde
              hiçbir yerden linkli olmayan bir orphan sayfaydı. */}
          <Link
            href="/power-ranking"
            className="bento-card group mt-10 flex items-center gap-4 p-5 transition-colors hover:border-sea/25"
          >
            <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-sea/20 bg-sea/[0.08]">
              <BarChart3 className="h-5 w-5 text-sea" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-bold text-pirate-text transition-colors group-hover:text-sea">
                Detaylı Stat Analizi
              </span>
              <span className="block text-xs text-pirate-muted">
                Radar grafikleri ve karakter bazında altı stat kırılımı
              </span>
            </span>
            <ArrowRight className="h-4 w-4 flex-shrink-0 text-sea transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </main>
  )
}
