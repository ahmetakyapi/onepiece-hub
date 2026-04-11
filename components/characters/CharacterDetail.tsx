'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowLeft, Users, Anchor, Sword, Sparkles,
  Skull, MapPin, Zap, BookOpen, Film,
  Ruler, Calendar, Globe, Quote
} from 'lucide-react'
import { fadeUp, staggerContainer } from '@/lib/variants'
import { CREW_LABELS } from '@/lib/constants/characters'
import { getArcBySlug } from '@/lib/constants/arcs'
import { getCharacterImage } from '@/lib/constants/images'
import type { Character } from '@/types'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function CharacterDetailClient({ character }: { character: Character }) {
  const firstArc = getArcBySlug(character.firstArc)

  return (
    <>
      <Header />
      <main className="relative min-h-screen pt-24">
        <div className="mx-auto max-w-4xl px-6">
          {/* Back */}
          <Link
            href="/characters"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-pirate-muted transition-colors hover:text-gold"
          >
            <ArrowLeft className="h-4 w-4" />
            Tüm Karakterler
          </Link>

          <motion.div
            variants={staggerContainer(0.1)}
            initial="hidden"
            animate="visible"
          >
            {/* Hero section */}
            <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:gap-8">
              {/* Avatar */}
              <motion.div
                variants={fadeUp}
                className="relative h-48 w-48 flex-shrink-0 self-center overflow-hidden rounded-2xl bg-ocean-surface sm:h-64 sm:w-64"
              >
                {getCharacterImage(character.slug) ? (
                  <Image
                    src={getCharacterImage(character.slug)}
                    alt={character.name}
                    fill
                    className="object-cover object-top"
                    sizes="256px"
                    priority
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Users className="h-16 w-16 text-sea/20" />
                  </div>
                )}
              </motion.div>

              {/* Info */}
              <motion.div variants={fadeUp} className="flex-1">
                <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-sea/10 px-2.5 py-1 text-xs font-medium text-sea">
                  <Anchor className="h-3 w-3" />
                  {CREW_LABELS[character.crew]}
                </span>
                <h1 className="mb-1 text-3xl font-extrabold text-pirate-text sm:text-4xl">
                  {character.name}
                </h1>
                {character.epithet && (
                  <p className="mb-3 flex items-center gap-1.5 text-sm italic text-gold">
                    <Quote className="h-3.5 w-3.5" />
                    &quot;{character.epithet}&quot;
                  </p>
                )}
                {character.role && (
                  <p className="mb-3 text-xs font-medium text-sea">
                    {character.role}
                  </p>
                )}
                <p className="mb-4 text-sm leading-relaxed text-pirate-muted">
                  {character.description}
                </p>

                {/* Quick stats */}
                <div className="flex flex-wrap gap-3">
                  {character.bounty && (
                    <div className="glass rounded-xl px-4 py-2">
                      <p className="text-xs text-pirate-muted">Ödül</p>
                      <p className="text-sm font-bold text-gold">{character.bounty} Berry</p>
                    </div>
                  )}
                  {character.devilFruit && (
                    <div className="glass rounded-xl px-4 py-2">
                      <p className="text-xs text-pirate-muted">Şeytan Meyvesi</p>
                      <p className="text-sm font-bold text-luffy">{character.devilFruit}</p>
                    </div>
                  )}
                  {firstArc && (
                    <div className="glass rounded-xl px-4 py-2">
                      <p className="text-xs text-pirate-muted">İlk Görünüm</p>
                      <Link href={`/arcs/${firstArc.slug}`} className="text-sm font-bold text-sea hover:text-gold">
                        {firstArc.name}
                      </Link>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Bio Stats */}
            {(character.age || character.height || character.origin) && (
              <motion.div variants={fadeUp} className="mb-8 flex flex-wrap gap-3">
                {character.age && (
                  <div className="glass flex items-center gap-2 rounded-xl px-4 py-2.5">
                    <Calendar className="h-4 w-4 text-sea" />
                    <div>
                      <p className="text-xs text-pirate-muted">Yaş</p>
                      <p className="text-sm font-semibold text-pirate-text">{character.age}</p>
                    </div>
                  </div>
                )}
                {character.height && (
                  <div className="glass flex items-center gap-2 rounded-xl px-4 py-2.5">
                    <Ruler className="h-4 w-4 text-sea" />
                    <div>
                      <p className="text-xs text-pirate-muted">Boy</p>
                      <p className="text-sm font-semibold text-pirate-text">{character.height}</p>
                    </div>
                  </div>
                )}
                {character.origin && (
                  <div className="glass flex items-center gap-2 rounded-xl px-4 py-2.5">
                    <Globe className="h-4 w-4 text-sea" />
                    <div>
                      <p className="text-xs text-pirate-muted">Köken</p>
                      <p className="text-sm font-semibold text-pirate-text">{character.origin}</p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Abilities */}
            <motion.div variants={fadeUp} className="mb-8">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-pirate-text">
                <Zap className="h-5 w-5 text-gold" />
                Yetenekler
              </h2>
              <div className="glass rounded-xl p-4">
                <div className="flex flex-wrap gap-2">
                  {character.abilities.map((ability) => (
                    <span
                      key={ability}
                      className="chip"
                    >
                      <Sparkles className="h-3 w-3 text-gold" />
                      {ability}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Backstory */}
            {character.backstory && (
              <motion.div variants={fadeUp} className="mb-8">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-pirate-text">
                  <BookOpen className="h-5 w-5 text-gold" />
                  Geçmiş Hikayesi
                </h2>
                <div className="glass rounded-xl p-5">
                  <p className="text-sm leading-relaxed text-pirate-muted whitespace-pre-line">
                    {character.backstory}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Appearances */}
            {character.appearances && character.appearances.length > 0 && (
              <motion.div variants={fadeUp} className="mb-8">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-pirate-text">
                  <Film className="h-5 w-5 text-sea" />
                  Göründüğü Arc&apos;lar
                </h2>
                <div className="glass rounded-xl p-4">
                  <div className="flex flex-wrap gap-2">
                    {character.appearances.map((arcSlug) => {
                      const arcData = getArcBySlug(arcSlug)
                      return (
                        <Link
                          key={arcSlug}
                          href={`/arcs/${arcSlug}`}
                          className="rounded-lg bg-ocean-surface px-3 py-1.5 text-xs font-medium text-pirate-muted transition-colors hover:bg-sea/10 hover:text-sea"
                        >
                          {arcData?.name ?? arcSlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>

        <div className="mt-16" />
      </main>
      <Footer />
    </>
  )
}
