'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'
import {
  ArrowLeft, Cherry, Sparkles, Skull, Zap,
  AlertTriangle, Star, BookOpen, Globe, ArrowRight,
} from 'lucide-react'
import { fadeUp, staggerContainer, EASE } from '@/lib/variants'
import { DEVIL_FRUIT_TYPE_INFO } from '@/lib/constants/devil-fruits'
import { getCharacterImage } from '@/lib/constants/images'
import FavoriteButton from '@/components/ui/FavoriteButton'
import type { DevilFruitEntry } from '@/types'

export default function DevilFruitDetailClient({ fruit }: { fruit: DevilFruitEntry }) {
  const typeInfo = DEVIL_FRUIT_TYPE_INFO[fruit.type]
  const userImg = fruit.userSlug ? getCharacterImage(fruit.userSlug) : ''

  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.2])

  return (
    <main className="relative min-h-screen">
      {/* ─── Cinematic Hero ─────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative h-[70vh] min-h-[400px] overflow-hidden sm:h-[70vh] sm:min-h-[440px]"
      >
        {userImg ? (
          <motion.div className="absolute inset-0" style={{ y: bgY, scale: bgScale, viewTransitionName: `fruit-image-${fruit.slug}` }}>
            <Image
              src={userImg}
              alt={fruit.user}
              fill
              className="object-cover object-top"
              sizes="100vw"
              priority
            />
          </motion.div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-ocean-surface to-ocean-deep" />
        )}

        <div className="absolute inset-0 bg-gradient-to-b from-ocean-deep/45 via-ocean-deep/25 to-ocean-deep" />
        <div className="absolute inset-0 bg-gradient-to-r from-ocean-deep/60 via-transparent to-ocean-deep/40" />
        <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-ocean-deep via-ocean-deep/80 to-transparent" />

        <div className="pointer-events-none absolute -right-32 -top-24 h-80 w-80 rounded-full bg-purple-500/[0.08] blur-[80px]" />
        <div className="pointer-events-none absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-gold/[0.06] blur-[80px]" />

        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="absolute left-0 right-0 top-0 z-10 px-6 pt-24 sm:pt-28"
        >
          <div className="mx-auto max-w-4xl">
            <Link
              href="/devil-fruits"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-ocean-deep/50 px-4 py-2 text-[13px] text-white/70 backdrop-blur-md transition-all duration-300 hover:border-gold/30 hover:text-gold group"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
              Tüm Şeytan Meyveleri
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
          className="absolute inset-x-0 bottom-0 z-10 px-6 pb-10 sm:pb-14"
        >
          <div className="mx-auto max-w-4xl">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className={`rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur-md ${typeInfo.bg} ${typeInfo.color} border-current/20`}>
                <Cherry className="mr-1 inline h-3 w-3" />
                {typeInfo.label}
              </span>
              {fruit.status === 'deceased' && (
                <span className="rounded-full border border-luffy/30 bg-luffy/10 px-3 py-1 text-xs font-semibold text-luffy backdrop-blur-md">
                  <Skull className="mr-1 inline h-3 w-3" />
                  Kullanıcı Ölü
                </span>
              )}
            </div>

            <div className="mb-2 flex flex-wrap items-center gap-3">
              <h1 className="text-4xl font-extrabold tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.7)] sm:text-5xl md:text-6xl">
                {fruit.name}
              </h1>
              <FavoriteButton targetType="devil-fruit" targetSlug={fruit.slug} />
            </div>
            <p className="mb-1 font-mono text-sm text-white/50 drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]">
              {fruit.japaneseName}
            </p>
            <p className="text-base font-semibold text-gold drop-shadow-[0_2px_8px_rgba(0,0,0,0.55)] sm:text-lg">
              {fruit.meaning}
            </p>
          </div>
        </motion.div>
      </section>

      <div className="mx-auto max-w-4xl px-6 pt-10 pb-20">
        <motion.div variants={staggerContainer(0.1)} initial="hidden" animate="visible">
          {/* Description */}
          <motion.div variants={fadeUp} className="mb-10">
            <div className="bento-card relative overflow-hidden rounded-2xl p-6">
              <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-gold/40 via-purple-400/20 to-transparent" />
              <div className="mb-3 flex items-center gap-2 pl-4">
                <BookOpen className="h-4 w-4 text-gold" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-pirate-text">Açıklama</h2>
              </div>
              <p className="pl-4 text-sm leading-relaxed text-pirate-muted sm:text-[15px]">
                {fruit.description}
              </p>
            </div>
          </motion.div>

          {/* User card — spotlight */}
          <motion.div variants={fadeUp} className="mb-10">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-pirate-text">
              <Skull className="h-5 w-5 text-sea" />
              Kullanıcı
            </h2>
            <div className="relative overflow-hidden rounded-2xl border border-sea/20 bg-gradient-to-br from-sea/[0.05] via-ocean-surface/60 to-ocean-deep">
              <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-sea/[0.08] blur-[80px]" />

              <div className="relative flex flex-col items-center gap-5 p-6 sm:flex-row sm:gap-6">
                <div className="relative h-28 w-28 flex-shrink-0 overflow-hidden rounded-2xl border-2 border-sea/25 bg-ocean-deep/50">
                  {userImg ? (
                    <Image
                      src={userImg}
                      alt={fruit.user}
                      fill
                      className="object-cover object-top"
                      sizes="112px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Skull className="h-12 w-12 text-sea/30" />
                    </div>
                  )}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ocean-deep/30 to-transparent" />
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.22em] text-sea/70">
                    Meyve Sahibi
                  </p>
                  <p className="mb-3 text-2xl font-extrabold text-pirate-text sm:text-3xl">
                    {fruit.user}
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                    <span className="inline-flex items-center gap-1.5 text-xs text-pirate-muted">
                      <Globe className="h-3 w-3 text-sea" />
                      {fruit.firstAppearance}
                    </span>
                    {fruit.userSlug && (
                      <Link
                        href={`/characters/${fruit.userSlug}`}
                        className="btn-ghost text-xs group"
                      >
                        Karakter Profili
                        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Abilities */}
          <motion.div variants={fadeUp} className="mb-10">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-pirate-text">
              <Zap className="h-5 w-5 text-gold" />
              Yetenekler
              <span className="ml-1 rounded-full bg-gold/[0.08] px-2.5 py-0.5 text-[11px] font-semibold text-gold">
                {fruit.abilities.length}
              </span>
            </h2>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {fruit.abilities.map((ability, i) => (
                <div
                  key={i}
                  className="group relative overflow-hidden rounded-xl border border-pirate-border/20 bg-ocean-surface/40 px-4 py-3 transition-all duration-300 hover:border-gold/25 hover:bg-gold/[0.03]"
                >
                  <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-gold/50 to-transparent" />
                  <div className="flex gap-3 pl-2">
                    <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-gold/10 border border-gold/25">
                      <Sparkles className="h-2.5 w-2.5 text-gold" />
                    </div>
                    <p className="flex-1 text-sm leading-relaxed text-pirate-muted group-hover:text-pirate-text transition-colors">
                      {ability}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Weakness + Awakening — side by side if both exist */}
          {(fruit.weakness || fruit.awakening) && (
            <motion.div variants={fadeUp} className="mb-10 grid gap-4 sm:grid-cols-2">
              {fruit.weakness && (
                <div className="bento-card relative overflow-hidden rounded-2xl border-luffy/20 p-5">
                  <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-luffy/[0.08] blur-[40px]" />
                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-luffy/10 border border-luffy/25">
                      <AlertTriangle className="h-4 w-4 text-luffy" />
                    </div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-luffy">Zayıf Nokta</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-pirate-muted">
                    {fruit.weakness}
                  </p>
                </div>
              )}

              {fruit.awakening && (
                <div className="relative overflow-hidden rounded-2xl border border-gold/25 bg-gradient-to-br from-gold/[0.06] via-ocean-surface/60 to-ocean-deep p-5">
                  <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-gold/[0.12] blur-[50px]" />
                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold/15 border border-gold/35">
                      <Star className="h-4 w-4 text-gold" />
                    </div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gold">Uyanış</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-pirate-muted">
                    {fruit.awakening}
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* Type info */}
          <motion.div variants={fadeUp}>
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-pirate-text">
              <Cherry className="h-5 w-5 text-purple-400" />
              Meyve Türü
            </h2>
            <div className={`relative overflow-hidden rounded-2xl border ${typeInfo.bg} ${typeInfo.color} border-current/20 p-5`}>
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-current/[0.08] blur-[60px]" />
              <p className={`mb-2 text-base font-extrabold ${typeInfo.color}`}>{typeInfo.label}</p>
              <p className="text-sm leading-relaxed text-pirate-muted">
                {typeInfo.description}
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </main>
  )
}
