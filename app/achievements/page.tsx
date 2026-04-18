import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { ACHIEVEMENTS } from '@/lib/constants/achievements'

const AchievementsClient = dynamic(() => import('@/components/achievements/AchievementsClient'))

export const metadata: Metadata = {
  title: 'Başarımlar — Hedeflerin',
  description: 'One Piece Hub başarım vitrinasi. Bronze, gümüş, altın ve efsanevi rozetleri unlock et.',
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
        <div className="pointer-events-none absolute -left-32 -bottom-32 h-80 w-80 rounded-full bg-purple-500/[0.08] blur-[100px]" />

        <div className="relative mx-auto max-w-4xl text-center">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.3em] text-gold/70">
            🏆 Hedefler & Rozetler
          </p>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.7)] sm:text-5xl md:text-6xl">
            Başarımlar
          </h1>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-white/70 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] sm:text-base">
            İzleme ilerlemen, quiz başarıların ve keşiflerinle rozetleri kazan. Her bronz bronzdan büyür, her efsane efsaneden geçer.
          </p>

          {/* Tier stats */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <span className="rounded-full border border-amber-600/30 bg-amber-600/10 px-3 py-1.5 text-xs font-bold text-amber-500">
              🥉 {totalByTier.bronze ?? 0} Bronz
            </span>
            <span className="rounded-full border border-gray-300/30 bg-gray-300/10 px-3 py-1.5 text-xs font-bold text-gray-300">
              🥈 {totalByTier.silver ?? 0} Gümüş
            </span>
            <span className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1.5 text-xs font-bold text-gold">
              🥇 {totalByTier.gold ?? 0} Altın
            </span>
            <span className="rounded-full border border-purple-400/30 bg-purple-400/10 px-3 py-1.5 text-xs font-bold text-purple-400">
              ⭐ {totalByTier.legendary ?? 0} Efsanevi
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
