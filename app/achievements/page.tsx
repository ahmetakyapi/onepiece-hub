import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { Medal, Star } from 'lucide-react'
import { ACHIEVEMENTS } from '@/lib/constants/achievements'

const AchievementsClient = dynamic(() => import('@/components/achievements/AchievementsClient'))

export const metadata: Metadata = {
  title: 'Başarımlar - Hedeflerin',
  description: 'One Piece Hub başarım vitrini. Bronz, gümüş, altın ve efsanevi rozetleri aç.',
}

export default function AchievementsPage() {
  const totalByTier = ACHIEVEMENTS.reduce<Record<string, number>>((acc, a) => {
    acc[a.tier] = (acc[a.tier] ?? 0) + 1
    return acc
  }, {})

  return (
    <main className="min-h-screen bg-ocean-deep">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-pirate-border/20 bg-gradient-to-b from-ocean-surface/40 via-ocean-deep to-ocean-deep px-6 py-20 sm:py-28">
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-gold/[0.12] blur-[100px]" />
        <div className="pointer-events-none absolute -left-32 -bottom-32 h-80 w-80 rounded-full bg-fruit-strong/[0.08] blur-[100px]" />

        <div className="relative mx-auto max-w-4xl text-center">
          <p className="eyebrow-lg mb-3 text-gold/70">
            Hedefler &amp; Rozetler
          </p>
          <h1 className="mb-4 text-4xl font-bold text-pirate-text sm:text-5xl md:text-6xl">
            Başarımlar
          </h1>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-pirate-muted sm:text-base">
            İzlediğin bölümler, çözdüğün quizler ve keşfettiğin sayfalar rozete dönüşür. Bronzdan efsaneviye dört kademe var.
          </p>

          {/* Tier stats */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-accent-amber/30 bg-accent-amber/10 px-3 py-1.5 text-xs font-bold text-accent-amber">
              <Medal className="h-3.5 w-3.5" />
              {totalByTier.bronze ?? 0} Bronz
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-accent-silver/30 bg-accent-silver/10 px-3 py-1.5 text-xs font-bold text-accent-silver">
              <Medal className="h-3.5 w-3.5" />
              {totalByTier.silver ?? 0} Gümüş
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-3 py-1.5 text-xs font-bold text-gold">
              <Medal className="h-3.5 w-3.5" />
              {totalByTier.gold ?? 0} Altın
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-fruit/30 bg-fruit/10 px-3 py-1.5 text-xs font-bold text-fruit">
              <Star className="h-3.5 w-3.5" />
              {totalByTier.legendary ?? 0} Efsanevi
            </span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="relative px-6 py-12 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <AchievementsClient />
        </div>
      </section>
    </main>
  )
}
