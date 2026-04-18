import type { Metadata } from 'next'
import PowerLeaderboard from '@/components/power/PowerLeaderboard'

export const metadata: Metadata = {
  title: 'Güç Sıralaması',
  description: 'One Piece karakterlerinin güç seviyelerini karşılaştır. Yonko, Amiral ve daha fazlası.',
}

export default function PowerPage() {
  return (
    <main className="min-h-screen bg-ocean-deep">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-pirate-border/20 bg-gradient-to-b from-ocean-surface/60 via-ocean-deep to-ocean-deep px-6 py-20 sm:py-32">
        <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-gold/[0.08] blur-[100px]" />
        <div className="pointer-events-none absolute -left-32 -bottom-32 h-80 w-80 rounded-full bg-sea/[0.06] blur-[80px]" />

        <div className="relative mx-auto max-w-4xl text-center">
          <h1 className="mb-3 text-5xl font-extrabold tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.7)] sm:text-6xl md:text-7xl">
            Güç Sıralaması
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-white/70 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] sm:text-lg">
            One Piece dünyasının en güçlü korsanlarını keşfet. Güç seviyeleri, yetenekler ve istatistiklerle karşılaştır.
          </p>
        </div>
      </section>

      {/* Leaderboard */}
      <section className="relative px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <PowerLeaderboard />
        </div>
      </section>
    </main>
  )
}
