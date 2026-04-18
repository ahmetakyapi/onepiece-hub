'use client'

import { memo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, Film, BookOpen, Sparkles, Compass } from 'lucide-react'
import { getArcImage } from '@/lib/constants/images'
import { ACCENT_CLASSES, type SagaMeta } from '@/lib/constants/saga-meta'
import { fadeUp, staggerContainer, EASE } from '@/lib/variants'

export interface SagaCardData {
  index: number
  name: string
  slug: string
  arcCount: number
  totalEpisodes: number
  firstArcSlug: string
  featuredArcSlug: string
  featuredCover: string
  tagline: string
  description: string
  era: string
  accent: SagaMeta['accent']
  iconEmoji: string
}

function SagaCard({ saga, alternate }: { saga: SagaCardData; alternate: boolean }) {
  const cls = ACCENT_CLASSES[saga.accent]
  const cover = getArcImage(saga.featuredArcSlug)

  return (
    <motion.article
      variants={fadeUp}
      className={`group relative overflow-hidden rounded-3xl border ${cls.border} bg-gradient-to-br ${cls.gradient} transition-all duration-500 hover:shadow-2xl`}
    >
      {/* Full-card click overlay — below buttons so they still catch clicks */}
      <Link
        href={`/sagas/${saga.slug}`}
        aria-label={`${saga.name} sagasını keşfet`}
        className="absolute inset-0 z-0 rounded-[inherit] focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/40"
      />

      {/* Ambient glows */}
      <div className={`pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full ${cls.glow} blur-[90px]`} />
      <div className={`pointer-events-none absolute -left-20 -bottom-20 h-48 w-48 rounded-full ${cls.glow} opacity-50 blur-[70px]`} />

      <div className={`pointer-events-none relative z-[1] grid items-stretch gap-0 md:grid-cols-2 ${alternate ? 'md:[&>*:first-child]:order-2' : ''}`}>
        {/* Image side */}
        <div className="relative h-56 w-full overflow-hidden sm:h-72 md:h-auto md:min-h-[380px]">
          {cover && (
            <Image
              src={cover}
              alt={saga.name}
              fill
              className="object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={saga.index <= 2}
            />
          )}
          {/* Gradient overlays */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ocean-deep via-ocean-deep/40 to-transparent md:bg-gradient-to-r md:from-ocean-deep md:via-ocean-deep/40 md:to-transparent" />
          <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${cls.gradient} opacity-40 mix-blend-overlay`} />

          {/* Index badge */}
          <div className="absolute left-5 top-5 z-10">
            <div className={`flex items-center gap-2 rounded-full border ${cls.border} ${cls.bg} px-3 py-1.5 backdrop-blur-md`}>
              <span className="text-lg">{saga.iconEmoji}</span>
              <span className={`text-[11px] font-bold uppercase tracking-[0.2em] ${cls.text}`}>
                Saga {String(saga.index).padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* Era badge bottom */}
          {saga.era && (
            <div className="absolute bottom-5 left-5 z-10 md:hidden">
              <span className={`rounded-full ${cls.bg} border ${cls.border} px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${cls.text} backdrop-blur-md`}>
                {saga.era}
              </span>
            </div>
          )}
        </div>

        {/* Content side */}
        <div className="relative flex flex-col justify-between p-6 sm:p-8">
          <div>
            {saga.era && (
              <p className={`mb-3 hidden text-[10px] font-bold uppercase tracking-[0.3em] ${cls.text} md:block`}>
                {saga.era}
              </p>
            )}
            <h2 className={`mb-2 text-3xl font-extrabold tracking-tight text-white transition-colors duration-300 ${cls.hoverText} sm:text-4xl md:text-5xl`}>
              {saga.name}
            </h2>
            <p className={`mb-5 text-sm font-semibold italic ${cls.text}`}>
              &ldquo;{saga.tagline}&rdquo;
            </p>
            <p className="mb-6 text-sm leading-relaxed text-pirate-muted sm:text-[15px]">
              {saga.description}
            </p>
          </div>

          <div>
            {/* Stats */}
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-pirate-border/30 bg-ocean-surface/50 px-3 py-1.5 text-[11px] font-semibold text-pirate-text">
                <BookOpen className="h-3 w-3" />
                <span className="tabular-nums">{saga.arcCount}</span> arc
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-pirate-border/30 bg-ocean-surface/50 px-3 py-1.5 text-[11px] font-semibold text-pirate-text">
                <Film className="h-3 w-3" />
                <span className="tabular-nums">{saga.totalEpisodes}</span> bölüm
              </span>
            </div>

            {/* CTAs — pointer-events-auto re-enables clicks on buttons above the card overlay link */}
            <div className="pointer-events-auto relative z-10 flex flex-wrap gap-2">
              <Link
                href={`/sagas/${saga.slug}`}
                className={`group/btn inline-flex items-center gap-1.5 rounded-full ${cls.bg} border ${cls.border} px-4 py-2 text-xs font-bold ${cls.text} transition-all hover:brightness-125`}
              >
                <Compass className="h-3 w-3" />
                Saga&apos;yı Keşfet
                <ArrowRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-0.5" />
              </Link>
              <Link
                href={`/arcs/${saga.firstArcSlug}`}
                className="group/btn2 inline-flex items-center gap-1.5 rounded-full border border-pirate-border/30 bg-ocean-surface/40 px-4 py-2 text-xs font-bold text-pirate-text transition-all hover:border-gold/40 hover:text-gold"
              >
                <Sparkles className="h-3 w-3" />
                İlk Arc
                <ArrowRight className="h-3 w-3 transition-transform group-hover/btn2:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  )
}

const MemoCard = memo(SagaCard)

function SagaShowcase({ sagas }: { sagas: SagaCardData[] }) {
  return (
    <motion.div
      variants={staggerContainer(0.08)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      className="space-y-6 sm:space-y-8"
    >
      {/* Timeline connector */}
      <div className="relative">
        {sagas.map((saga, i) => (
          <div key={saga.slug} className="relative">
            <MemoCard saga={saga} alternate={i % 2 === 1} />
            {i !== sagas.length - 1 && (
              <div className="flex justify-center py-4 sm:py-6">
                <motion.div
                  initial={{ scaleY: 0, opacity: 0 }}
                  whileInView={{ scaleY: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: EASE }}
                  className="h-12 w-px bg-gradient-to-b from-pirate-border/0 via-gold/40 to-pirate-border/0 origin-top"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* End marker */}
      <motion.div
        variants={fadeUp}
        className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-gold/30 bg-ocean-surface/20 py-8 text-center"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/10 border border-gold/30">
          <span className="text-xl">🏴‍☠️</span>
        </div>
        <div>
          <p className="text-sm font-bold text-gold">Yolculuk Sürüyor</p>
          <p className="text-xs text-pirate-muted mt-0.5">Sıradaki saga bekleniyor...</p>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default memo(SagaShowcase)
