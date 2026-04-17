'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'
import {
  ArrowLeft, Crown, Users, Skull, BookOpen,
  Trophy, MapPin, Anchor, Star, ArrowRight,
} from 'lucide-react'
import { fadeUp, staggerContainer, EASE } from '@/lib/variants'
import { CREW_TYPE_LABELS } from '@/lib/constants/crews'
import { getCharacterImage } from '@/lib/constants/images'
import FavoriteButton from '@/components/ui/FavoriteButton'
import type { Crew } from '@/types'

export default function CrewDetailClient({ crew }: { crew: Crew }) {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const heroScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.25])

  const captainImg = crew.captainSlug ? getCharacterImage(crew.captainSlug) : ''

  return (
    <main className="relative min-h-screen">
      {/* ─── Cinematic Hero ─────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative h-[68vh] min-h-[400px] overflow-hidden sm:h-[68vh] sm:min-h-[440px]"
      >
        {captainImg ? (
          <motion.div className="absolute inset-0" style={{ y: heroY, scale: heroScale }}>
            <Image
              src={captainImg}
              alt={crew.captain || crew.name}
              fill
              className="object-cover object-top"
              sizes="100vw"
              priority
            />
          </motion.div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-ocean-surface to-ocean-deep" />
        )}

        <div className="absolute inset-0 bg-gradient-to-b from-ocean-deep/40 via-ocean-deep/30 to-ocean-deep" />
        <div className="absolute inset-0 bg-gradient-to-r from-ocean-deep/65 via-transparent to-ocean-deep/45" />
        <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-ocean-deep via-ocean-deep/85 to-transparent" />

        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-gold/[0.08] blur-[120px]" />
        <div className="pointer-events-none absolute -left-28 -bottom-28 h-80 w-80 rounded-full bg-sea/[0.05] blur-[120px]" />

        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="absolute left-0 right-0 top-0 z-10 px-6 pt-24 sm:pt-28"
        >
          <div className="mx-auto max-w-4xl">
            <Link
              href="/crews"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-ocean-deep/50 px-4 py-2 text-[13px] text-white/70 backdrop-blur-md transition-all duration-300 hover:border-gold/30 hover:text-gold group"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
              Tüm Organizasyonlar
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
              <span className={`rounded-full px-3 py-1 text-xs font-semibold backdrop-blur-md ${crew.bg} ${crew.color}`}>
                {CREW_TYPE_LABELS[crew.type]}
              </span>
              <span className={`rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur-md ${
                crew.status === 'active' ? 'border-emerald-400/30 bg-emerald-500/10 text-emerald-400' :
                crew.status === 'disbanded' ? 'border-pirate-muted/30 bg-pirate-muted/10 text-pirate-muted' :
                'border-luffy/30 bg-luffy/10 text-luffy'
              }`}>
                <span className={`mr-1 inline-block h-1.5 w-1.5 rounded-full ${
                  crew.status === 'active' ? 'bg-emerald-400 animate-pulse' :
                  crew.status === 'disbanded' ? 'bg-pirate-muted/60' : 'bg-luffy'
                }`} />
                {crew.status === 'active' ? 'Aktif' :
                 crew.status === 'disbanded' ? 'Dağıtılmış' :
                 crew.status === 'defeated' ? 'Yenilmiş' : 'Bilinmiyor'}
              </span>
            </div>

            <div className="mb-2 flex flex-wrap items-center gap-3">
              <h1 className={`text-4xl font-extrabold tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.7)] sm:text-5xl md:text-6xl ${crew.color}`}>
                {crew.name}
              </h1>
              <FavoriteButton targetType="crew" targetSlug={crew.slug} />
            </div>
            <p className="mb-4 font-mono text-sm text-white/50 drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]">
              {crew.japaneseName}
            </p>
            <p className="max-w-2xl text-sm leading-relaxed text-white/80 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] sm:text-base">
              {crew.description}
            </p>
          </div>
        </motion.div>
      </section>

      <div className="mx-auto max-w-4xl px-6 pt-10 pb-20">
        <motion.div variants={staggerContainer(0.1)} initial="hidden" animate="visible">
          {/* Quick stats */}
          <motion.div variants={fadeUp} className="mb-10 grid gap-3 sm:grid-cols-3">
            {crew.captain && (
              <div className="bento-card flex items-center gap-3 rounded-xl px-4 py-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gold/10 border border-gold/20">
                  <Crown className="h-4 w-4 text-gold" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-pirate-muted/60">Lider</p>
                  {crew.captainSlug ? (
                    <Link href={`/characters/${crew.captainSlug}`} className="text-sm font-bold text-gold hover:text-gold-bright transition-colors truncate block">
                      {crew.captain}
                    </Link>
                  ) : (
                    <p className="truncate text-sm font-bold text-pirate-text">{crew.captain}</p>
                  )}
                </div>
              </div>
            )}
            {crew.totalBounty && (
              <div className="bento-card flex items-center gap-3 rounded-xl px-4 py-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gold/10 border border-gold/20">
                  <Trophy className="h-4 w-4 text-gold" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-pirate-muted/60">Toplam Ödül</p>
                  <p className="text-sm font-bold text-gold stat-number">{crew.totalBounty} Berry</p>
                </div>
              </div>
            )}
            <div className="bento-card flex items-center gap-3 rounded-xl px-4 py-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-sea/10 border border-sea/20">
                <Users className="h-4 w-4 text-sea" />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-pirate-muted/60">Bilinen Üye</p>
                <p className="text-sm font-bold text-sea">{crew.notableMembers.length} korsan</p>
              </div>
            </div>
          </motion.div>

          {/* History */}
          <motion.div variants={fadeUp} className="mb-10">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-pirate-text">
              <BookOpen className="h-5 w-5 text-gold" />
              Tarihçe
            </h2>
            <div className="bento-card relative overflow-hidden rounded-2xl p-6">
              <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-gold/40 via-sea/25 to-transparent" />
              <p className="pl-4 text-sm leading-relaxed text-pirate-muted whitespace-pre-line sm:text-[15px]">
                {crew.history}
              </p>
            </div>
          </motion.div>

          {/* Members — avatar grid */}
          <motion.div variants={fadeUp} className="mb-10">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-pirate-text">
              <Users className="h-5 w-5 text-gold" />
              Önemli Üyeler
              <span className={`ml-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${crew.bg} ${crew.color}`}>
                {crew.notableMembers.length}
              </span>
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {crew.notableMembers.map((member) => {
                const img = member.slug ? getCharacterImage(member.slug) : ''
                const inner = (
                  <div className="bento-card group relative flex items-center gap-3 overflow-hidden rounded-2xl p-3 transition-all duration-500 hover:border-gold/20">
                    <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl border border-pirate-border/30 bg-ocean-surface">
                      {img ? (
                        <Image
                          src={img}
                          alt={member.name}
                          fill
                          className="object-cover object-top transition-transform duration-500 group-hover:scale-110"
                          sizes="56px"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Users className="h-5 w-5 text-pirate-muted/40" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-pirate-text transition-colors group-hover:text-gold">
                        {member.name}
                      </p>
                      <p className="truncate text-[11px] text-pirate-muted">{member.role}</p>
                    </div>
                    {member.slug && (
                      <ArrowRight className="h-4 w-4 flex-shrink-0 text-pirate-muted/40 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-gold" />
                    )}
                  </div>
                )
                return member.slug ? (
                  <Link key={member.name} href={`/characters/${member.slug}`}>
                    {inner}
                  </Link>
                ) : (
                  <div key={member.name}>{inner}</div>
                )
              })}
            </div>
          </motion.div>

          {/* Territory */}
          {crew.territory && crew.territory.length > 0 && (
            <motion.div variants={fadeUp} className="mb-10">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-pirate-text">
                <MapPin className="h-5 w-5 text-sea" />
                Topraklar
              </h2>
              <div className="bento-card rounded-2xl p-4">
                <div className="flex flex-wrap gap-2">
                  {crew.territory.map((t) => (
                    <span key={t} className="inline-flex items-center gap-1.5 rounded-lg border border-sea/20 bg-sea/5 px-3 py-1.5 text-xs font-medium text-sea">
                      <Anchor className="h-3 w-3" />
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Achievements */}
          <motion.div variants={fadeUp} className="mb-10">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-pirate-text">
              <Trophy className="h-5 w-5 text-gold" />
              Başarılar
            </h2>
            <div className="bento-card rounded-2xl p-5">
              <div className="space-y-3">
                {crew.achievements.map((achievement, i) => (
                  <div key={i} className="group flex gap-3 rounded-xl border border-pirate-border/20 bg-ocean-surface/40 px-4 py-3 transition-colors hover:border-gold/20 hover:bg-gold/[0.03]">
                    <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-gold/10 border border-gold/25">
                      <Star className="h-2.5 w-2.5 text-gold" />
                    </div>
                    <p className="flex-1 text-sm leading-relaxed text-pirate-muted group-hover:text-pirate-text transition-colors">
                      {achievement}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Jolly Roger — dramatic showcase */}
          {crew.jollyRoger && (
            <motion.div variants={fadeUp} className="mb-10">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-pirate-text">
                <Skull className="h-5 w-5 text-pirate-text" />
                Jolly Roger
              </h2>
              <div className="relative overflow-hidden rounded-2xl border border-gold/20 bg-gradient-to-br from-ocean-deep via-ocean-surface to-ocean-deep p-6 sm:p-8">
                <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-luffy/[0.06] blur-[100px]" />
                <div className="pointer-events-none absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-gold/[0.05] blur-[80px]" />

                <div className="relative flex flex-col items-center gap-5 sm:flex-row sm:items-start">
                  <div className="relative flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-2xl border-2 border-gold/25 bg-ocean-deep/70">
                    <Skull className="h-12 w-12 text-pirate-text/80" />
                    <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-gold/[0.08] to-transparent" />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-gold/70">
                      Sembol
                    </p>
                    <p className="text-sm leading-relaxed text-pirate-text sm:text-base">
                      {crew.jollyRoger}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </main>
  )
}
