'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowLeft, Play, Compass, Film, Clock,
  ChevronRight, BrainCircuit, MessageCircle,
  MapPin, Skull, Sparkles, BookOpen, Users
} from 'lucide-react'
import { fadeUp, staggerContainer } from '@/lib/variants'
import { getArcImage } from '@/lib/constants/images'
import type { Arc } from '@/types'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function ArcDetailClient({ arc }: { arc: Arc }) {
  const coverRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: coverRef,
    offset: ['start start', 'end start'],
  })
  const coverScale = useTransform(scrollYProgress, [0, 1], [1, 1.15])
  const coverOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.3])

  return (
    <>
      <Header />
      <main className="relative min-h-screen pt-24">
        <div className="mx-auto max-w-5xl px-6">
          {/* Back */}
          <Link
            href="/arcs"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-pirate-muted transition-colors hover:text-gold group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Tüm Arc&apos;lar
          </Link>

          {/* Header section */}
          <motion.div
            variants={staggerContainer(0.1)}
            initial="hidden"
            animate="visible"
            className="mb-10"
          >
            {/* Cover with parallax */}
            <motion.div
              ref={coverRef}
              variants={fadeUp}
              className="relative mb-6 h-56 overflow-hidden rounded-2xl bg-ocean-surface sm:h-80"
            >
              {getArcImage(arc.slug) ? (
                <motion.div className="absolute inset-0" style={{ scale: coverScale, opacity: coverOpacity }}>
                  <Image
                    src={getArcImage(arc.slug)}
                    alt={arc.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 896px"
                    priority
                  />
                </motion.div>
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Compass className="h-16 w-16 text-sea/20" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-ocean-deep via-ocean-deep/30 to-transparent" />
            </motion.div>

            {/* Title + meta */}
            <motion.div variants={fadeUp} className="mb-4">
              <h1 className="mb-2 text-3xl font-extrabold text-pirate-text sm:text-4xl">
                {arc.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-pirate-muted">
                <span className="flex items-center gap-1">
                  <Film className="h-4 w-4 text-sea" />
                  {arc.episodeCount} Bölüm
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-gold" />
                  ~{Math.round(arc.episodeCount * 24 / 60)} saat
                </span>
              </div>
            </motion.div>

            {/* Summary */}
            <motion.p
              variants={fadeUp}
              className="mb-4 text-base leading-relaxed text-pirate-muted"
            >
              {arc.summary}
            </motion.p>

            {/* Detailed Summary */}
            {arc.detailedSummary && (
              <motion.div variants={fadeUp} className="glass mb-6 rounded-xl p-5">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-pirate-text">
                  <BookOpen className="h-4 w-4 text-gold" />
                  Detaylı Özet
                </h3>
                <p className="text-sm leading-relaxed text-pirate-muted">
                  {arc.detailedSummary}
                </p>
              </motion.div>
            )}

            {/* Location + Villain */}
            <motion.div variants={fadeUp} className="mb-6 flex flex-wrap gap-3">
              {arc.location && (
                <div className="glass flex items-center gap-2 rounded-xl px-4 py-2.5">
                  <MapPin className="h-4 w-4 text-sea" />
                  <div>
                    <p className="text-xs text-pirate-muted">Konum</p>
                    <p className="text-sm font-semibold text-pirate-text">{arc.location}</p>
                  </div>
                </div>
              )}
              {arc.villain && (
                <div className="glass flex items-center gap-2 rounded-xl px-4 py-2.5">
                  <Skull className="h-4 w-4 text-luffy" />
                  <div>
                    <p className="text-xs text-pirate-muted">Ana Düşman</p>
                    <p className="text-sm font-semibold text-pirate-text">{arc.villain}</p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Key Events */}
            {arc.keyEvents && arc.keyEvents.length > 0 && (
              <motion.div variants={fadeUp} className="glass mb-6 rounded-xl p-5">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-pirate-text">
                  <Sparkles className="h-4 w-4 text-gold" />
                  Önemli Olaylar
                </h3>
                <ul className="space-y-2">
                  {arc.keyEvents.map((event) => (
                    <li key={event} className="flex items-start gap-2 text-sm text-pirate-muted">
                      <ChevronRight className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-gold" />
                      {event}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Themes */}
            {arc.themes && arc.themes.length > 0 && (
              <motion.div variants={fadeUp} className="mb-6 flex flex-wrap gap-2">
                {arc.themes.map((theme) => (
                  <span key={theme} className="chip">
                    {theme}
                  </span>
                ))}
              </motion.div>
            )}

            {/* Characters */}
            {arc.characters && arc.characters.length > 0 && (
              <motion.div variants={fadeUp} className="glass mb-6 rounded-xl p-5">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-pirate-text">
                  <Users className="h-4 w-4 text-sea" />
                  Öne Çıkan Karakterler
                </h3>
                <div className="flex flex-wrap gap-2">
                  {arc.characters.map((slug) => (
                    <Link
                      key={slug}
                      href={`/characters/${slug}`}
                      className="rounded-lg bg-ocean-surface px-3 py-1.5 text-xs font-medium text-pirate-muted transition-colors hover:bg-sea/10 hover:text-sea"
                    >
                      {slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Quick actions */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
              <Link
                href={`/arcs/${arc.slug}/${arc.episodes[0]?.slug}`}
                className="btn-gold"
              >
                <Play className="h-4 w-4" />
                İzlemeye Başla
              </Link>
              <Link href={`/quiz/${arc.slug}`} className="btn-ghost">
                <BrainCircuit className="h-4 w-4" />
                Arc Quiz
              </Link>
            </motion.div>
          </motion.div>

          {/* Episode list */}
          <section className="mb-16">
            <h2 className="mb-6 flex items-center gap-2 text-lg font-bold text-pirate-text">
              <Film className="h-5 w-5 text-sea" />
              Bölümler
            </h2>
            <motion.div
              variants={staggerContainer(0.04)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-2"
            >
              {arc.episodes.map((ep) => (
                <motion.div key={ep.slug} variants={fadeUp}>
                  <Link
                    href={`/arcs/${arc.slug}/${ep.slug}`}
                    className="glass glass-lift group flex items-center gap-4 rounded-xl px-4 py-3 hover:border-gold/30"
                  >
                    {/* Episode number */}
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-ocean-surface border border-pirate-border/50 text-sm font-bold text-sea transition-all group-hover:border-gold/30 group-hover:text-gold">
                      {ep.number}
                    </div>

                    {/* Title + summary */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-pirate-text transition-colors group-hover:text-gold">
                        {ep.title}
                      </p>
                      {ep.summary && (
                        <p className="mt-0.5 line-clamp-1 text-xs text-pirate-muted/70">
                          {ep.summary}
                        </p>
                      )}
                      <p className="mt-0.5 text-xs text-pirate-muted">{ep.duration}</p>
                    </div>

                    {/* Play icon */}
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-transparent transition-all group-hover:bg-gold/10">
                      <Play className="h-4 w-4 text-pirate-muted transition-colors group-hover:text-gold" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* Comments section placeholder */}
          <section className="mb-16">
            <h2 className="mb-6 flex items-center gap-2 text-lg font-bold text-pirate-text">
              <MessageCircle className="h-5 w-5 text-gold" />
              Yorumlar
            </h2>
            <div className="glass rounded-xl p-8 text-center">
              <MessageCircle className="mx-auto mb-3 h-8 w-8 text-pirate-muted" />
              <p className="text-sm text-pirate-muted">
                Yorum yapabilmek için{' '}
                <Link href="/login" className="text-gold hover:underline">
                  giriş yapın
                </Link>
              </p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
