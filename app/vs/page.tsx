import type { Metadata } from 'next'
import VersusClient from '@/components/vs/VersusClient'

export const metadata: Metadata = {
  title: 'Karşılaştır — Kim Daha Güçlü?',
  description: 'İki One Piece karakterini yan yana karşılaştır. Ödül, güç stats, yetenek ve daha fazlası.',
}

export default function VsPage() {
  return (
    <main className="min-h-screen bg-ocean-deep">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-pirate-border/20 bg-gradient-to-b from-luffy/[0.08] via-ocean-deep to-ocean-deep px-6 py-16 sm:py-24">
        <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-luffy/[0.12] blur-[100px]" />
        <div className="pointer-events-none absolute -left-32 -bottom-32 h-80 w-80 rounded-full bg-gold/[0.1] blur-[100px]" />

        <div className="relative mx-auto max-w-4xl text-center">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.3em] text-luffy/80">
            ⚔️ Karşı Karşıya
          </p>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.7)] sm:text-5xl md:text-6xl">
            Kim Daha <span className="text-luffy">Güçlü</span>?
          </h1>
          <p className="mx-auto max-w-xl text-sm leading-relaxed text-white/70 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] sm:text-base">
            İki karakter seç, tüm istatistiklerini yan yana karşılaştır.
            Ödül, güç seviyesi, yetenek sayısı — hepsi detaylı.
          </p>
        </div>
      </section>

      {/* Comparison */}
      <section className="relative px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-6xl">
          <VersusClient />
        </div>
      </section>
    </main>
  )
}
