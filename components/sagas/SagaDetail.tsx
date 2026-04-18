'use client'

import { memo, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
  ArrowLeft, ArrowRight, BookOpen, Film, MapPin, Sparkles,
  Users, Star, ChevronLeft, ChevronRight,
} from 'lucide-react'
import { fadeUp, staggerContainer, EASE } from '@/lib/variants'
import { getArcImage, getCharacterImage } from '@/lib/constants/images'
import { ACCENT_CLASSES, type SagaMeta } from '@/lib/constants/saga-meta'

interface ArcItem {
  slug: string
  name: string
  episodeCount: number
  summary: string
  themes: string[]
  cover: string
  location: string
}

interface DebutCharacter {
  slug: string
  name: string
  epithet?: string
  firstArc: string
  image: string
}

export interface SagaDetailData {
  index: number
  totalSagas: number
  name: string
  slug: string
  tagline: string
  description: string
  era: string
  accent: SagaMeta['accent']
  iconEmoji: string
  featuredArcSlug: string
  arcs: ArcItem[]
  totalEpisodes: number
  themes: string[]
  keyEvents: { arcName: string; arcSlug: string; event: string }[]
  debutCharacters: DebutCharacter[]
  prevSaga: { slug: string; name: string } | null
  nextSaga: { slug: string; name: string } | null
}

function SagaDetail({ data }: { data: SagaDetailData }) {
  const cls = ACCENT_CLASSES[data.accent]
  const featuredCover = getArcImage(data.featuredArcSlug)

  const [parallaxEnabled, setParallaxEnabled] = useState(false)
  useEffect(() => {
    setParallaxEnabled(window.matchMedia('(min-width: 768px)').matches)
  }, [])

  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.2])

  return (
    <main className="relative min-h-screen bg-ocean-deep">
      {/* ─── Cinematic Hero ─────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative h-[70vh] min-h-[480px] overflow-hidden sm:h-[75vh] sm:min-h-[540px] md:min-h-[600px]"
      >
        {featuredCover && (
          <motion.div
            className="absolute inset-0"
            style={parallaxEnabled ? { y: bgY, scale: bgScale } : undefined}
          >
            <Image
              src={featuredCover}
              alt={data.name}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          </motion.div>
        )}

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-ocean-deep/50 via-ocean-deep/30 to-ocean-deep" />
        <div className="absolute inset-0 bg-gradient-to-r from-ocean-deep/70 via-transparent to-ocean-deep/50" />
        <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-ocean-deep via-ocean-deep/80 to-transparent" />
        <div className={`absolute inset-0 bg-gradient-to-br ${cls.gradient} opacity-40 mix-blend-overlay`} />

        {/* Accent orbs */}
        <div className={`pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full ${cls.glow} blur-[100px]`} />
        <div className={`pointer-events-none absolute -left-28 -bottom-28 h-80 w-80 rounded-full ${cls.glow} opacity-70 blur-[90px]`} />

        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="absolute left-0 right-0 top-0 z-10 px-6 pt-24 sm:pt-28"
        >
          <div className="mx-auto max-w-5xl">
            <Link
              href="/sagas"
              className="group inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-ocean-deep/50 px-4 py-2 text-[13px] text-white/70 backdrop-blur-md transition-all duration-300 hover:border-gold/30 hover:text-gold"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
              Tüm Sagalar
            </Link>
          </div>
        </motion.div>

        {/* Hero content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}
          className="absolute inset-x-0 bottom-0 z-10 px-6 pb-12 sm:pb-16"
        >
          <div className="mx-auto max-w-5xl">
            {/* Saga index + emoji */}
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <div className={`inline-flex items-center gap-2 rounded-full border ${cls.border} ${cls.bg} px-4 py-1.5 backdrop-blur-md`}>
                <span className="text-lg">{data.iconEmoji}</span>
                <span className={`text-[11px] font-bold uppercase tracking-[0.2em] ${cls.text}`}>
                  Saga {String(data.index).padStart(2, '0')} / {String(data.totalSagas).padStart(2, '0')}
                </span>
              </div>
              {data.era && (
                <span className="rounded-full border border-white/10 bg-ocean-deep/50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white/70 backdrop-blur-md">
                  {data.era}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="mb-3 text-5xl font-extrabold tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)] sm:text-6xl md:text-7xl">
              {data.name}
            </h1>
            {data.tagline && (
              <p className={`mb-5 text-lg font-semibold italic ${cls.text} drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)] sm:text-xl`}>
                &ldquo;{data.tagline}&rdquo;
              </p>
            )}
            <p className="max-w-2xl text-sm leading-relaxed text-white/80 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] sm:text-base">
              {data.description}
            </p>

            {/* Stats pills */}
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-ocean-deep/60 px-3 py-1.5 text-xs font-semibold text-white/80 backdrop-blur-md">
                <BookOpen className="h-3 w-3" />
                <span className="tabular-nums">{data.arcs.length}</span> arc
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-ocean-deep/60 px-3 py-1.5 text-xs font-semibold text-white/80 backdrop-blur-md">
                <Film className="h-3 w-3" />
                <span className="tabular-nums">{data.totalEpisodes}</span> bölüm
              </span>
              {data.debutCharacters.length > 0 && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-ocean-deep/60 px-3 py-1.5 text-xs font-semibold text-white/80 backdrop-blur-md">
                  <Users className="h-3 w-3" />
                  <span className="tabular-nums">{data.debutCharacters.length}</span> yeni karakter
                </span>
              )}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Content */}
      <motion.div
        variants={staggerContainer(0.12)}
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-5xl px-6 pb-24 pt-12 sm:pt-16 space-y-14"
      >
        {/* Arcs Timeline */}
        <motion.section variants={fadeUp}>
          <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-pirate-text sm:text-2xl">
            <BookOpen className={`h-5 w-5 ${cls.text}`} />
            Arc Yolculuğu
            <span className={`ml-1 rounded-full ${cls.bg} border ${cls.border} px-2.5 py-0.5 text-[11px] font-bold ${cls.text}`}>
              {data.arcs.length}
            </span>
          </h2>

          <ol className="relative space-y-4 border-l border-pirate-border/20 pl-6 sm:pl-8">
            {data.arcs.map((arc, i) => {
              const cover = getArcImage(arc.slug)
              return (
                <motion.li
                  key={arc.slug}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, ease: EASE, delay: i * 0.04 }}
                  className="relative"
                >
                  {/* Dot on timeline */}
                  <span className={`absolute -left-[29px] top-3 flex h-4 w-4 items-center justify-center rounded-full border-2 ${cls.border} ${cls.bg} ${cls.text} backdrop-blur-md sm:-left-[33px]`}>
                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: 'currentColor' }} />
                  </span>

                  <Link
                    href={`/arcs/${arc.slug}`}
                    className="bento-card group relative block overflow-hidden rounded-2xl transition-all duration-500 hover:-translate-y-0.5"
                  >
                    <div className="grid gap-0 sm:grid-cols-[180px_1fr]">
                      {cover && (
                        <div className="relative h-40 w-full overflow-hidden sm:h-auto">
                          <Image
                            src={cover}
                            alt={arc.name}
                            fill
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                            sizes="(max-width: 640px) 100vw, 180px"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-ocean-deep/80 via-ocean-deep/20 to-transparent sm:bg-gradient-to-r sm:from-transparent sm:via-transparent sm:to-ocean-deep/30" />
                        </div>
                      )}

                      <div className="p-5">
                        <div className="mb-2 flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-pirate-muted/60">
                            Arc {String(i + 1).padStart(2, '0')}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-sea">
                            <Film className="h-2.5 w-2.5" />
                            {arc.episodeCount} bölüm
                          </span>
                        </div>
                        <h3 className={`mb-1.5 text-base font-extrabold text-pirate-text transition-colors duration-300 ${cls.hoverText} sm:text-lg`}>
                          {arc.name}
                        </h3>
                        {arc.location && (
                          <p className="mb-2 inline-flex items-center gap-1 text-[11px] text-pirate-muted">
                            <MapPin className="h-2.5 w-2.5" />
                            {arc.location}
                          </p>
                        )}
                        <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-pirate-muted/80 sm:text-[13px]">
                          {arc.summary}
                        </p>
                        {arc.themes && arc.themes.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {arc.themes.slice(0, 3).map((t) => (
                              <span key={t} className="tag">{t}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.li>
              )
            })}
          </ol>
        </motion.section>

        {/* Themes */}
        {data.themes.length > 0 && (
          <motion.section variants={fadeUp}>
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-pirate-text sm:text-2xl">
              <Sparkles className={`h-5 w-5 ${cls.text}`} />
              Temalar
            </h2>
            <div className="flex flex-wrap gap-2">
              {data.themes.map((t) => (
                <span
                  key={t}
                  className={`rounded-full border ${cls.border} ${cls.bg} px-3 py-1.5 text-xs font-semibold ${cls.text}`}
                >
                  {t}
                </span>
              ))}
            </div>
          </motion.section>
        )}

        {/* Debut Characters */}
        {data.debutCharacters.length > 0 && (
          <motion.section variants={fadeUp}>
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-pirate-text sm:text-2xl">
              <Users className={`h-5 w-5 ${cls.text}`} />
              Bu Saga'da Tanıtılan Karakterler
              <span className={`ml-1 rounded-full ${cls.bg} border ${cls.border} px-2.5 py-0.5 text-[11px] font-bold ${cls.text}`}>
                {data.debutCharacters.length}
              </span>
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {data.debutCharacters.map((char) => {
                const img = getCharacterImage(char.slug)
                return (
                  <Link
                    key={char.slug}
                    href={`/characters/${char.slug}`}
                    className="group flex items-center gap-3 rounded-xl border border-pirate-border/20 bg-ocean-surface/30 p-3 transition-all duration-300 hover:border-gold/30 hover:bg-ocean-surface/60"
                  >
                    <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg border border-pirate-border/30">
                      {img ? (
                        <Image
                          src={img}
                          alt={char.name}
                          fill
                          className="object-cover object-top transition-transform duration-500 group-hover:scale-110"
                          sizes="48px"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Users className="h-5 w-5 text-pirate-muted/40" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-pirate-text transition-colors group-hover:text-gold">
                        {char.name}
                      </p>
                      {char.epithet && (
                        <p className="truncate text-[11px] text-pirate-muted">{char.epithet}</p>
                      )}
                    </div>
                    <ArrowRight className="h-4 w-4 flex-shrink-0 text-pirate-muted/30 transition-all group-hover:translate-x-0.5 group-hover:text-gold" />
                  </Link>
                )
              })}
            </div>
          </motion.section>
        )}

        {/* Key Events */}
        {data.keyEvents.length > 0 && (
          <motion.section variants={fadeUp}>
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-pirate-text sm:text-2xl">
              <Star className={`h-5 w-5 ${cls.text}`} />
              Anahtar Olaylar
            </h2>
            <div className="bento-card rounded-2xl p-5">
              <div className="space-y-3">
                {data.keyEvents.map((e, i) => (
                  <div
                    key={i}
                    className="group flex gap-3 rounded-xl border border-pirate-border/15 bg-ocean-surface/30 px-4 py-3 transition-colors hover:border-gold/25 hover:bg-gold/[0.03]"
                  >
                    <div className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${cls.bg} border ${cls.border}`}>
                      <Star className={`h-2.5 w-2.5 ${cls.text}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm leading-relaxed text-pirate-muted group-hover:text-pirate-text transition-colors">
                        {e.event}
                      </p>
                      <Link
                        href={`/arcs/${e.arcSlug}`}
                        className="mt-0.5 inline-block text-[10px] font-semibold uppercase tracking-wider text-pirate-muted/60 hover:text-gold transition-colors"
                      >
                        {e.arcName} →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {/* Prev/Next saga navigation */}
        <motion.nav variants={fadeUp} className="grid gap-3 sm:grid-cols-2">
          {data.prevSaga ? (
            <Link
              href={`/sagas/${data.prevSaga.slug}`}
              className="group flex items-center gap-3 rounded-2xl border border-pirate-border/30 bg-ocean-surface/30 p-4 transition-all hover:border-gold/40 hover:bg-ocean-surface/60"
            >
              <ChevronLeft className="h-5 w-5 flex-shrink-0 text-pirate-muted transition-all group-hover:-translate-x-1 group-hover:text-gold" />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-pirate-muted/60">
                  Önceki Saga
                </p>
                <p className="truncate text-sm font-bold text-pirate-text group-hover:text-gold transition-colors">
                  {data.prevSaga.name}
                </p>
              </div>
            </Link>
          ) : (
            <div className="rounded-2xl border border-dashed border-pirate-border/15 bg-ocean-surface/10 p-4 text-center">
              <p className="text-[10px] font-bold uppercase tracking-wider text-pirate-muted/40">
                Yolculuğun Başı
              </p>
            </div>
          )}
          {data.nextSaga ? (
            <Link
              href={`/sagas/${data.nextSaga.slug}`}
              className="group flex items-center gap-3 rounded-2xl border border-pirate-border/30 bg-ocean-surface/30 p-4 text-right transition-all hover:border-gold/40 hover:bg-ocean-surface/60"
            >
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-pirate-muted/60">
                  Sonraki Saga
                </p>
                <p className="truncate text-sm font-bold text-pirate-text group-hover:text-gold transition-colors">
                  {data.nextSaga.name}
                </p>
              </div>
              <ChevronRight className="h-5 w-5 flex-shrink-0 text-pirate-muted transition-all group-hover:translate-x-1 group-hover:text-gold" />
            </Link>
          ) : (
            <div className="rounded-2xl border border-dashed border-gold/20 bg-gold/[0.03] p-4 text-center">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gold/70">
                Büyük Final
              </p>
            </div>
          )}
        </motion.nav>
      </motion.div>
    </main>
  )
}

export default memo(SagaDetail)
