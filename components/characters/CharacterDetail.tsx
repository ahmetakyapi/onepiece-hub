'use client'

import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'
import {
  ArrowLeft, Users, Anchor, Sword, Sparkles,
  Skull, MapPin, Zap, BookOpen, Film,
  Ruler, Calendar, Globe, Quote, Cherry, Shield, Swords, ChevronRight
} from 'lucide-react'
import { fadeUp, staggerContainer, scrollReveal, EASE } from '@/lib/variants'
import { CREW_LABELS } from '@/lib/constants/characters'
import { getArcBySlug } from '@/lib/constants/arcs'
import { getCharacterImage } from '@/lib/constants/images'
import { BATTLES } from '@/lib/constants/battles'
import type { Character, Ability } from '@/types'
import CommentSection from '@/components/ui/CommentSection'
import FavoriteButton from '@/components/ui/FavoriteButton'
import SpeechBubble from '@/components/ui/SpeechBubble'

const DEVIL_FRUIT_TYPE_COLORS: Record<string, string> = {
  'Paramecia': 'bg-purple-500/20 text-purple-300',
  'Zoan': 'bg-green-500/20 text-green-300',
  'Logia': 'bg-yellow-500/20 text-yellow-300',
  'Mythical Zoan': 'bg-amber-500/20 text-amber-200',
  'Ancient Zoan': 'bg-emerald-500/20 text-emerald-300',
  'Special Paramecia': 'bg-pink-500/20 text-pink-300',
} as const

const ABILITY_CATEGORY_CONFIG: Record<string, { icon: typeof Zap; color: string }> = {
  'Haki': { icon: Shield, color: 'text-purple-400' },
  'Şeytan Meyvesi': { icon: Cherry, color: 'text-luffy' },
  'Kılıç': { icon: Sword, color: 'text-sea' },
  'Fiziksel': { icon: Zap, color: 'text-gold' },
  'Silah': { icon: Anchor, color: 'text-pirate-muted' },
  'Özel': { icon: Sparkles, color: 'text-gold' },
  'Bilim': { icon: BookOpen, color: 'text-green-400' },
} as const

function groupAbilitiesByCategory(abilities: Ability[]): Record<string, Ability[]> {
  const groups: Record<string, Ability[]> = {}
  for (const ability of abilities) {
    const cat = ability.category ?? 'Özel'
    if (!groups[cat]) groups[cat] = []
    groups[cat].push(ability)
  }
  return groups
}

/* ─── Stat Pill ──────────────────────────────────────────────────────── */
function StatPill({ icon: Icon, label, value, color = 'text-sea' }: {
  icon: typeof Zap; label: string; value: string; color?: string
}) {
  return (
    <div className="bento-card group flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-500 hover:border-gold/15">
      <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-current/10 to-current/5 ${color}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-[10px] font-medium uppercase tracking-wider text-pirate-muted/50">{label}</p>
        <p className="text-sm font-bold text-pirate-text">{value}</p>
      </div>
    </div>
  )
}

/* ─── Section with scroll reveal ─────────────────────────────────────── */
function RevealSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      variants={scrollReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default function CharacterDetailClient({ character }: { character: Character }) {
  const firstArc = getArcBySlug(character.firstArc)
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })

  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1])

  const imgSrc = getCharacterImage(character.slug)

  return (
    <main className="relative min-h-screen">
      {/* ─── Cinematic Hero ────────────────────────────────────── */}
      <section ref={heroRef} className="relative h-[78vh] min-h-[440px] overflow-hidden bg-gradient-to-b from-ocean-surface to-ocean-deep sm:h-[80vh] sm:min-h-[500px]">
        {/* Background image with parallax */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{ y: heroY, scale: heroScale, viewTransitionName: `character-image-${character.slug}` }}
        >
          {imgSrc ? (
            <Image
              src={imgSrc}
              alt={character.name}
              fill
              className="object-contain object-center"
              sizes="100vw"
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-ocean-surface to-ocean-deep relative overflow-hidden">
              <div className="orb absolute w-80 h-80 bg-sea/[0.07] animate-morph" />
              <div className="orb absolute w-64 h-64 bg-gold/[0.05] animate-float-delayed" style={{ top: '30%', left: '40%' }} />
              <div className="relative z-10 flex flex-col items-center gap-3">
                <div className="h-24 w-24 rounded-full border border-sea/20 bg-ocean-surface flex items-center justify-center shadow-sea-glow">
                  <span className="text-4xl font-extrabold text-gold/60 select-none">{character.name.charAt(0)}</span>
                </div>
                {character.epithet && (
                  <p className="text-xs font-semibold tracking-widest text-pirate-muted/40 uppercase">{character.epithet}</p>
                )}
              </div>
            </div>
          )}
        </motion.div>

        {/* Cinematic overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-ocean-deep/40 via-transparent to-ocean-deep" />
        <div className="absolute inset-0 bg-gradient-to-r from-ocean-deep/60 via-transparent to-ocean-deep/60" />
        <div className="absolute inset-x-0 bottom-0 h-[50%] bg-gradient-to-t from-ocean-deep via-ocean-deep/90 to-transparent" />

        {/* Side vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_40%,transparent_40%,rgba(6,14,26,0.7))]" />

        {/* Hero content — positioned at bottom */}
        <motion.div
          style={{ opacity: heroOpacity }}
          className="absolute inset-x-0 bottom-0 z-10 px-6 pb-12 sm:pb-16"
        >
          <div className="mx-auto max-w-4xl">
            {/* Back link */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}
            >
              <Link
                href="/characters"
                className="mb-6 inline-flex items-center gap-1.5 text-sm text-white/60 transition-colors hover:text-gold"
              >
                <ArrowLeft className="h-4 w-4" />
                Tüm Karakterler
              </Link>
            </motion.div>

            {/* Crew badge */}
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.2 }}
            >
              <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-sea/20 bg-sea/[0.08] px-3 py-1 text-xs font-semibold text-sea backdrop-blur-sm">
                <Anchor className="h-3 w-3" />
                {CREW_LABELS[character.crew]}
              </span>
            </motion.div>

            {/* Name + epithet */}
            <motion.div
              initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.3 }}
            >
              <div className="mb-2 flex items-center gap-3">
                <h1 className="text-4xl font-extrabold tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)] sm:text-5xl md:text-6xl">
                  {character.name}
                </h1>
                <FavoriteButton targetType="character" targetSlug={character.slug} className="mt-1" />
              </div>
              {character.epithet && (
                <p className="mb-1 flex items-center gap-1.5 text-base italic text-gold drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] sm:text-lg">
                  <Quote className="h-4 w-4" />
                  &quot;{character.epithet}&quot;
                </p>
              )}
              {character.role && (
                <p className="text-sm font-medium text-sea/80">{character.role}</p>
              )}
            </motion.div>

            {/* Quick stat pills */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.5 }}
              className="mt-5 flex flex-wrap gap-2"
            >
              {character.bounty && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/20 bg-gold/[0.08] px-3 py-1.5 text-xs font-bold text-gold backdrop-blur-sm">
                  <Skull className="h-3 w-3" />
                  {character.bounty} Berry
                </span>
              )}
              {character.devilFruit && (
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold backdrop-blur-sm ${DEVIL_FRUIT_TYPE_COLORS[character.devilFruit.type]}`}>
                  <Cherry className="h-3 w-3" />
                  {character.devilFruit.name}
                </span>
              )}
              {firstArc && (
                <Link
                  href={`/arcs/${firstArc.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-sea/20 bg-sea/[0.08] px-3 py-1.5 text-xs font-bold text-sea backdrop-blur-sm transition-colors hover:bg-sea/15"
                >
                  <MapPin className="h-3 w-3" />
                  {firstArc.name}
                </Link>
              )}
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ─── Content ───────────────────────────────────────────── */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 pb-20">
        {/* Description + epithet speech bubble */}
        <RevealSection className="mb-10 -mt-6">
          <div className="bento-card relative rounded-2xl p-6">
            {character.epithet && (
              <div className="mb-5 hidden pt-2 sm:block">
                <SpeechBubble tail="bottom-left" variant="shout" character={character.name}>
                  {character.epithet}!
                </SpeechBubble>
              </div>
            )}
            <p className="text-sm leading-relaxed text-pirate-muted sm:text-base">
              {character.description}
            </p>
          </div>
        </RevealSection>

        {/* Bio Stats Row */}
        {(character.age || character.height || character.origin || character.bounty) && (
          <RevealSection className="mb-10">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {character.age && (
                <StatPill icon={Calendar} label="Yaş" value={character.age} color="text-sea" />
              )}
              {character.height && (
                <StatPill icon={Ruler} label="Boy" value={character.height} color="text-sea" />
              )}
              {character.origin && (
                <StatPill icon={Globe} label="Köken" value={character.origin} color="text-sea" />
              )}
              {character.bounty && (
                <StatPill icon={Skull} label="Ödül" value={`${character.bounty} Berry`} color="text-gold" />
              )}
            </div>
          </RevealSection>
        )}

        {/* Backstory */}
        {character.backstory && (
          <RevealSection className="mb-10">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-pirate-text">
              <BookOpen className="h-5 w-5 text-gold" />
              Geçmiş Hikayesi
            </h2>
            <div className="bento-card relative overflow-hidden rounded-2xl p-6">
              {/* Decorative accent line */}
              <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-gold/30 via-sea/20 to-transparent" />
              <p className="pl-4 text-sm leading-relaxed text-pirate-muted whitespace-pre-line sm:text-[15px]">
                {character.backstory}
              </p>
            </div>
          </RevealSection>
        )}

        {/* Devil Fruit Detail */}
        {character.devilFruit && (
          <RevealSection className="mb-10">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-pirate-text">
              <Cherry className="h-5 w-5 text-luffy" />
              Şeytan Meyvesi
            </h2>
            <div className="bento-card relative overflow-hidden rounded-2xl p-6">
              {/* Decorative glow */}
              <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-luffy/5 blur-[60px]" />
              <div className="mb-3 flex items-center gap-3">
                <p className="text-base font-bold text-pirate-text sm:text-lg">{character.devilFruit.name}</p>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${DEVIL_FRUIT_TYPE_COLORS[character.devilFruit.type]}`}>
                  {character.devilFruit.type}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-pirate-muted">
                {character.devilFruit.description}
              </p>
            </div>
          </RevealSection>
        )}

        {/* Abilities */}
        <RevealSection className="mb-10">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-pirate-text">
            <Zap className="h-5 w-5 text-gold" />
            Yetenekler
          </h2>
          <div className="space-y-4">
            {Object.entries(groupAbilitiesByCategory(character.abilities)).map(([category, abilities]) => {
              const config = ABILITY_CATEGORY_CONFIG[category] ?? ABILITY_CATEGORY_CONFIG['Özel']
              const CategoryIcon = config.icon
              return (
                <div key={category} className="bento-card overflow-hidden rounded-2xl">
                  {/* Category header */}
                  <div className="flex items-center gap-2 border-b border-pirate-border/10 px-5 py-3">
                    <CategoryIcon className={`h-4 w-4 ${config.color}`} />
                    <h3 className={`text-sm font-bold ${config.color}`}>{category}</h3>
                    <span className="ml-auto text-[10px] font-semibold text-pirate-muted/40">
                      {abilities.length} yetenek
                    </span>
                  </div>
                  {/* Abilities grid */}
                  <div className="grid gap-px bg-pirate-border/5 sm:grid-cols-2">
                    {abilities.map((ability) => (
                      <div
                        key={ability.name}
                        className="group bg-ocean-deep/50 px-5 py-3.5 transition-colors hover:bg-ocean-surface/40"
                      >
                        <p className="mb-0.5 flex items-center gap-1.5 text-sm font-semibold text-pirate-text">
                          <CategoryIcon className={`h-3 w-3 ${config.color} transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110`} />
                          {ability.name}
                        </p>
                        <p className="text-xs leading-relaxed text-pirate-muted">
                          {ability.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </RevealSection>

        {/* Appearances */}
        {character.appearances && character.appearances.length > 0 && (
          <RevealSection className="mb-10">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-pirate-text">
              <Film className="h-5 w-5 text-sea" />
              Göründüğü Arc&apos;lar
              <span className="ml-1 rounded-full bg-sea/[0.06] px-2.5 py-0.5 text-[11px] font-semibold text-sea/70">
                {character.appearances.length}
              </span>
            </h2>
            <div className="bento-card rounded-2xl p-5">
              <div className="flex flex-wrap gap-2">
                {character.appearances.map((arcSlug) => {
                  const arcData = getArcBySlug(arcSlug)
                  return (
                    <Link
                      key={arcSlug}
                      href={`/arcs/${arcSlug}`}
                      className="group rounded-lg border border-transparent bg-ocean-surface px-3 py-1.5 text-xs font-medium text-pirate-muted transition-all duration-300 hover:border-sea/20 hover:bg-sea/10 hover:text-sea"
                    >
                      {arcData?.name ?? arcSlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                    </Link>
                  )
                })}
              </div>
            </div>
          </RevealSection>
        )}

        {/* Related Battles */}
        {(() => {
          const charBattles = BATTLES.filter(
            (b) =>
              b.participantSlugs?.side1.includes(character.slug) ||
              b.participantSlugs?.side2.includes(character.slug),
          )
          if (charBattles.length === 0) return null
          return (
            <RevealSection className="mb-10">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-pirate-text">
                <Swords className="h-5 w-5 text-luffy" />
                Katıldığı Savaşlar
                <span className="ml-1 rounded-full bg-luffy/[0.06] px-2.5 py-0.5 text-[11px] font-semibold text-luffy/70">
                  {charBattles.length}
                </span>
              </h2>
              <div className="space-y-2">
                {charBattles.map((battle) => {
                  const isWinnerSide =
                    (battle.winner === 'side1' && battle.participantSlugs?.side1.includes(character.slug)) ||
                    (battle.winner === 'side2' && battle.participantSlugs?.side2.includes(character.slug))
                  const isLoserSide =
                    (battle.winner === 'side1' && battle.participantSlugs?.side2.includes(character.slug)) ||
                    (battle.winner === 'side2' && battle.participantSlugs?.side1.includes(character.slug))
                  return (
                    <Link
                      key={battle.slug}
                      href="/battles"
                      className="bento-card group flex items-center gap-4 rounded-2xl px-5 py-3.5"
                    >
                      <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl ${
                        isWinnerSide ? 'bg-emerald-500/10' : isLoserSide ? 'bg-luffy/10' : 'bg-gold/10'
                      }`}>
                        <Swords className={`h-4 w-4 ${
                          isWinnerSide ? 'text-emerald-400' : isLoserSide ? 'text-luffy' : 'text-gold'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-pirate-text group-hover:text-gold transition-colors">
                          {battle.name}
                        </p>
                        <p className="text-[11px] text-pirate-muted/50">{battle.arc}</p>
                      </div>
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        isWinnerSide
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : isLoserSide
                          ? 'bg-luffy/10 text-luffy'
                          : 'bg-gold/10 text-gold'
                      }`}>
                        {isWinnerSide ? 'Zafer' : isLoserSide ? 'Yenilgi' : 'Berabere'}
                      </span>
                      <ChevronRight className="h-3.5 w-3.5 text-pirate-muted/30 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-gold" />
                    </Link>
                  )
                })}
              </div>
            </RevealSection>
          )
        })()}
      </div>

      <div className="mx-auto max-w-5xl px-6">
        <CommentSection targetType="character" targetSlug={character.slug} />
      </div>
    </main>
  )
}
