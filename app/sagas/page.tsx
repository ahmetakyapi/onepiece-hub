import type { Metadata } from 'next'
import { SAGAS } from '@/lib/constants/sagas'
import { ARCS, getArcBySlug } from '@/lib/constants/arcs'
import { SAGA_META } from '@/lib/constants/saga-meta'
import SagaShowcase, { type SagaCardData } from '@/components/sagas/SagaShowcase'

export const metadata: Metadata = {
  title: 'Sagalar — One Piece Destanı',
  description: 'One Piece evreninin 10 destansı sagası. Her biri kendine özgü dünyalar, antagonistler ve dönüm noktaları.',
}

export default function SagasPage() {
  // Build-time aggregation
  const cards: SagaCardData[] = SAGAS.map((saga, idx) => {
    const meta = SAGA_META[saga.slug]
    let totalEpisodes = 0
    for (const arcSlug of saga.arcs) {
      const arc = getArcBySlug(arcSlug)
      if (arc) totalEpisodes += arc.episodeCount
    }

    const featuredArc = meta ? getArcBySlug(meta.featuredArc) : null
    const firstArc = getArcBySlug(saga.arcs[0])

    return {
      index: idx + 1,
      name: saga.name,
      slug: saga.slug,
      arcCount: saga.arcs.length,
      totalEpisodes,
      firstArcSlug: saga.arcs[0],
      featuredArcSlug: meta?.featuredArc ?? saga.arcs[0],
      featuredCover: featuredArc?.cover ?? firstArc?.cover ?? '',
      tagline: meta?.tagline ?? '',
      description: meta?.description ?? '',
      era: meta?.era ?? '',
      accent: meta?.accent ?? 'sea',
      iconEmoji: meta?.iconEmoji ?? '🏴‍☠️',
    }
  })

  const totalArcs = ARCS.length
  const totalEpisodes = cards.reduce((sum, c) => sum + c.totalEpisodes, 0)

  return (
    <main className="min-h-screen bg-ocean-deep">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-pirate-border/20 bg-gradient-to-b from-ocean-surface/40 via-ocean-deep to-ocean-deep px-6 py-20 sm:py-28">
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-gold/[0.1] blur-[100px]" />
        <div className="pointer-events-none absolute -left-32 -bottom-32 h-80 w-80 rounded-full bg-sea/[0.08] blur-[100px]" />

        <div className="relative mx-auto max-w-4xl text-center">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.3em] text-gold/70">
            ⚓ Büyük Hikaye
          </p>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.7)] sm:text-5xl md:text-6xl">
            Sagalar
          </h1>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-white/70 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] sm:text-base">
            One Piece&apos;in büyük destanı {SAGAS.length} destansı saga, {totalArcs} arc ve {totalEpisodes}+ bölümden oluşuyor. Her saga kendi dünyası, düşmanı ve duygu tonuyla unutulmaz bir yolculuk.
          </p>

          {/* Journey stats */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-5">
            <div className="rounded-full border border-pirate-border/30 bg-ocean-surface/40 px-4 py-2 text-xs font-semibold text-pirate-text">
              <span className="text-gold stat-number">{SAGAS.length}</span> saga
            </div>
            <div className="rounded-full border border-pirate-border/30 bg-ocean-surface/40 px-4 py-2 text-xs font-semibold text-pirate-text">
              <span className="text-gold stat-number">{totalArcs}</span> arc
            </div>
            <div className="rounded-full border border-pirate-border/30 bg-ocean-surface/40 px-4 py-2 text-xs font-semibold text-pirate-text">
              <span className="text-gold stat-number">{totalEpisodes}</span>+ bölüm
            </div>
          </div>
        </div>
      </section>

      {/* Showcase */}
      <section className="relative px-4 py-12 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <SagaShowcase sagas={cards} />
        </div>
      </section>
    </main>
  )
}
