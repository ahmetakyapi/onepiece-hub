'use client'

import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Skull, Crown, Search, Medal, Sparkles, Star } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import PageHero from '@/components/wiki/PageHero'
import { getCharacterImage } from '@/lib/constants/images'
import { fadeUp, staggerContainer, EASE } from '@/lib/variants'

function parseBounty(bounty?: string): number {
  if (!bounty) return 0
  return parseInt(bounty.replace(/,/g, ''), 10)
}

function formatBounty(value: number): string {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1)}B`
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(0)}M`
  }
  return value.toLocaleString()
}

const RANK_COLORS = ['text-gold', 'text-pirate-text', 'text-amber-600'] as const

// Additional known bounties (characters not in CHARACTERS array)
const EXTRA_BOUNTIES: { name: string; bounty: string; crew: string; slug?: string; epithet?: string }[] = [
  { name: 'Gol D. Roger', bounty: '5,564,800,000', crew: 'Korsanlar Kralı', slug: 'roger', epithet: 'Korsanlar Kralı' },
  { name: 'Edward Newgate', bounty: '5,046,000,000', crew: 'Yonko', slug: 'whitebeard', epithet: 'Beyaz Sakal' },
  { name: 'Kaido', bounty: '4,611,100,000', crew: 'Yonko', slug: 'kaido', epithet: 'En Güçlü Yaratık' },
  { name: 'Charlotte Linlin', bounty: '4,388,000,000', crew: 'Yonko', slug: 'bigmom', epithet: 'Big Mom' },
  { name: 'Shanks', bounty: '4,048,900,000', crew: 'Yonko', slug: 'shanks', epithet: 'Kızıl Saçlı' },
  { name: 'Marshall D. Teach', bounty: '3,996,000,000', crew: 'Yonko', slug: 'blackbeard', epithet: 'Kara Sakal' },
  { name: 'Dracule Mihawk', bounty: '3,590,000,000', crew: 'Cross Guild', slug: 'mihawk', epithet: 'Şahin Göz' },
  { name: 'Buggy', bounty: '3,189,000,000', crew: 'Cross Guild', slug: 'buggy', epithet: 'Palyaço' },
  { name: 'Monkey D. Luffy', bounty: '3,000,000,000', crew: 'Hasır Şapka', slug: 'luffy', epithet: 'Hasır Şapka' },
  { name: 'Trafalgar Law', bounty: '3,000,000,000', crew: 'Heart Korsanları', slug: 'law', epithet: 'Ölümün Cerrahı' },
  { name: 'Eustass Kid', bounty: '3,000,000,000', crew: 'Kid Korsanları', slug: 'kid', epithet: 'Kaptan' },
  { name: 'Crocodile', bounty: '1,965,000,000', crew: 'Cross Guild', slug: 'crocodile', epithet: 'Mr. 0' },
  { name: 'Boa Hancock', bounty: '1,659,000,000', crew: 'Kuja Korsanları', slug: 'hancock', epithet: 'Korsan İmparatoriçesi' },
  { name: 'King', bounty: '1,390,000,000', crew: 'Beast Korsanları', epithet: 'Wildfire' },
  { name: 'Marco', bounty: '1,374,000,000', crew: 'Whitebeard Korsanları', epithet: 'Anka Kuşu' },
  { name: 'Queen', bounty: '1,320,000,000', crew: 'Beast Korsanları', epithet: 'Plague' },
  { name: 'Roronoa Zoro', bounty: '1,111,000,000', crew: 'Hasır Şapka', slug: 'zoro', epithet: 'Korsan Avcısı' },
  { name: 'Jinbe', bounty: '1,100,000,000', crew: 'Hasır Şapka', slug: 'jinbe', epithet: 'Denizlerin Şövalyesi' },
  { name: 'Charlotte Katakuri', bounty: '1,057,000,000', crew: 'Big Mom Korsanları', epithet: 'Tatlı Komutan' },
  { name: 'Vinsmoke Sanji', bounty: '1,032,000,000', crew: 'Hasır Şapka', slug: 'sanji', epithet: 'Kara Bacak' },
  { name: 'Jack', bounty: '1,000,000,000', crew: 'Beast Korsanları', epithet: 'Drought' },
  { name: 'Charlotte Smoothie', bounty: '932,000,000', crew: 'Big Mom Korsanları', epithet: 'Tatlı Komutan' },
  { name: 'Nico Robin', bounty: '930,000,000', crew: 'Hasır Şapka', slug: 'robin', epithet: 'Şeytanın Çocuğu' },
  { name: 'Charlotte Cracker', bounty: '860,000,000', crew: 'Big Mom Korsanları', epithet: 'Tatlı Komutan' },
  { name: 'Sabo', bounty: '602,000,000', crew: 'Devrimci Ordu', slug: 'sabo', epithet: 'Alev İmparatoru' },
  { name: 'Usopp', bounty: '500,000,000', crew: 'Hasır Şapka', slug: 'usopp', epithet: 'Tanrı' },
  { name: 'Portgas D. Ace', bounty: '550,000,000', crew: 'Whitebeard (eski)', slug: 'ace', epithet: 'Ateş Yumruk' },
  { name: 'Nami', bounty: '366,000,000', crew: 'Hasır Şapka', slug: 'nami', epithet: 'Hırsız Kedi' },
  { name: 'Brook', bounty: '383,000,000', crew: 'Hasır Şapka', slug: 'brook', epithet: 'Ruh Kralı' },
  { name: 'Franky', bounty: '394,000,000', crew: 'Hasır Şapka', slug: 'franky', epithet: 'Cyborg' },
  { name: 'Tony Tony Chopper', bounty: '1,000', crew: 'Hasır Şapka', slug: 'chopper', epithet: 'Pamuk Şeker Sever' },
  { name: 'Donquixote Doflamingo', bounty: '340,000,000', crew: 'Donquixote (eski)', slug: 'doflamingo', epithet: 'Joker' },
  { name: 'Yamato', bounty: '---', crew: 'Bağımsız', slug: 'yamato', epithet: 'Oni Prensesi' },
]

const CREW_FILTERS = [
  { label: 'Tümü', value: '' },
  { label: 'Hasır Şapka', value: 'Hasır Şapka' },
  { label: 'Yonko', value: 'Yonko' },
  { label: 'Cross Guild', value: 'Cross Guild' },
  { label: 'Big Mom', value: 'Big Mom Korsanları' },
  { label: 'Beast', value: 'Beast Korsanları' },
  { label: 'Whitebeard', value: 'Whitebeard Korsanları' },
  { label: 'Devrimci', value: 'Devrimci Ordu' },
] as const

const HERO_ORBS = [
  { color: 'rgba(244, 163, 0, 0.4)', size: 300, x: '10%', y: '20%', delay: 0 },
  { color: 'rgba(30, 144, 255, 0.2)', size: 200, x: '70%', y: '10%', delay: 1.5 },
  { color: 'rgba(244, 163, 0, 0.15)', size: 250, x: '80%', y: '60%', delay: 3 },
  { color: 'rgba(231, 76, 60, 0.12)', size: 180, x: '5%', y: '70%', delay: 2 },
]

export default function BountiesPage() {
  const [search, setSearch] = useState('')
  const [crewFilter, setCrewFilter] = useState('')

  const allSorted = useMemo(() => {
    return EXTRA_BOUNTIES
      .filter((b) => b.bounty !== '---')
      .sort((a, b) => parseBounty(b.bounty) - parseBounty(a.bounty))
  }, [])

  const filtered = useMemo(() => {
    let result = allSorted

    if (crewFilter) {
      result = result.filter((b) => b.crew === crewFilter)
    }

    if (search) {
      result = result.filter((b) =>
        b.name.toLowerCase().includes(search.toLowerCase()) ||
        b.crew.toLowerCase().includes(search.toLowerCase()) ||
        (b.epithet?.toLowerCase().includes(search.toLowerCase()) ?? false)
      )
    }

    return result
  }, [search, crewFilter, allSorted])

  const highestBounty = parseBounty(allSorted[0]?.bounty)
  const top3 = filtered.slice(0, 3)
  const rest = filtered.slice(3)
  const totalBounty = allSorted.reduce((sum, b) => sum + parseBounty(b.bounty), 0)
  const isFiltered = search !== '' || crewFilter !== ''

  return (
    <>
      <Header />
      <main className="relative min-h-screen pt-24">
        <div className="mx-auto max-w-5xl px-6">
          {/* Hero */}
          <PageHero
            icon={Trophy}
            title="Ödül"
            subtitle="Sıralaması"
            description="One Piece evrenindeki en yüksek ödüllü korsanlar ve suçlular. Dünya Hükümeti tarafından belirlenen ödüller, bir kişinin tehlike seviyesini gösterir."
            accentColor="gold"
            orbs={HERO_ORBS}
          >
            <div className="flex flex-wrap items-center gap-4">
              <div className="bento-card inline-flex items-center gap-3 rounded-xl px-5 py-3">
                <Trophy className="h-5 w-5 text-gold" />
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-pirate-muted">Toplam Kayıtlı Ödül</p>
                  <p className="text-lg font-extrabold text-gold">
                    {totalBounty.toLocaleString()} Berry
                  </p>
                </div>
              </div>
              <div className="bento-card inline-flex items-center gap-3 rounded-xl px-5 py-3">
                <Skull className="h-5 w-5 text-sea" />
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-pirate-muted">Aranan Korsan</p>
                  <p className="text-lg font-extrabold text-sea">{allSorted.length}</p>
                </div>
              </div>
            </div>
          </PageHero>

          {/* Search + Crew Filters */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.2 }}
            className="mb-8 space-y-4"
          >
            {/* Search */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-pirate-muted" />
              <input
                type="text"
                placeholder="Karakter veya mürettebat ara..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-pirate-border/50 bg-ocean-surface/40 py-3 pl-11 pr-4 text-sm text-pirate-text placeholder:text-pirate-muted/40 focus:border-gold/20 focus:outline-none focus:ring-2 focus:ring-gold/[0.08] transition-all"
              />
            </div>

            {/* Crew filter chips */}
            <div className="flex flex-wrap gap-2">
              {CREW_FILTERS.map((crew) => (
                <button
                  key={crew.value}
                  onClick={() => setCrewFilter(crew.value === crewFilter ? '' : crew.value)}
                  className={`chip transition-all duration-200 ${
                    crewFilter === crew.value
                      ? 'border-gold/50 bg-gold/15 text-gold shadow-[0_0_12px_rgba(244,163,0,0.15)]'
                      : 'border-pirate-border/50 bg-ocean-surface/30 text-pirate-muted hover:border-pirate-border hover:text-pirate-text'
                  }`}
                >
                  {crew.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* PODIUM - Top 3 */}
          {!isFiltered && top3.length >= 3 && (
            <motion.section
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.3 }}
              className="relative mb-12"
            >
              {/* Section label */}
              <div className="mb-6 flex items-center gap-3">
                <Crown className="h-5 w-5 text-gold" />
                <h2 className="text-lg font-bold text-gold-gradient">En Çok Arananlar</h2>
                <div className="divider-glow flex-1" />
              </div>

              {/* Podium background glow */}
              <div className="absolute inset-0 -top-8 rounded-3xl">
                <div className="absolute left-1/2 top-0 h-64 w-96 -translate-x-1/2 rounded-full bg-gold/5 blur-3xl" />
              </div>

              {/* Podium grid: #2 left, #1 center (elevated), #3 right */}
              <div className="relative grid grid-cols-3 items-end gap-3 sm:gap-5">
                {[top3[1], top3[0], top3[2]].map((entry, podiumIdx) => {
                  const actualRank = podiumIdx === 0 ? 2 : podiumIdx === 1 ? 1 : 3
                  const isFirst = actualRank === 1
                  const bountyValue = parseBounty(entry.bounty)
                  const characterImage = entry.slug ? getCharacterImage(entry.slug) : ''

                  const heights = ['h-52 sm:h-64', 'h-64 sm:h-80', 'h-48 sm:h-56']
                  const podiumHeight = heights[podiumIdx]

                  return (
                    <motion.div
                      key={entry.name}
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, ease: EASE, delay: 0.4 + podiumIdx * 0.15 }}
                      className="flex flex-col items-center"
                    >
                      {/* Card */}
                      <MaybeLinkWrapper slug={entry.slug}>
                        <div
                          className={`group relative flex w-full flex-col items-center overflow-hidden rounded-2xl border transition-all duration-300 ${podiumHeight} ${
                            isFirst
                              ? 'border-gold/40 bg-gradient-to-b from-gold/10 via-ocean-surface/80 to-ocean-deep shadow-[0_0_40px_rgba(244,163,0,0.12)] hover:shadow-[0_0_60px_rgba(244,163,0,0.2)]'
                              : 'border-pirate-border/50 bg-gradient-to-b from-ocean-surface/60 to-ocean-deep hover:border-pirate-border'
                          }`}
                        >
                          {/* Gold shimmer for #1 */}
                          {isFirst && (
                            <div className="absolute inset-0 bg-gradient-to-b from-gold/5 via-transparent to-transparent" />
                          )}

                          {/* Rank badge */}
                          <div className={`relative z-10 mt-3 sm:mt-4 flex items-center justify-center rounded-full ${
                            isFirst
                              ? 'h-8 w-8 sm:h-10 sm:w-10 bg-gold/20 border border-gold/40'
                              : 'h-7 w-7 sm:h-8 sm:w-8 bg-ocean-surface border border-pirate-border/50'
                          }`}>
                            {isFirst ? (
                              <Crown className="h-4 w-4 sm:h-5 sm:w-5 text-gold" />
                            ) : (
                              <span className={`text-xs sm:text-sm font-extrabold ${RANK_COLORS[actualRank - 1]}`}>
                                {actualRank}
                              </span>
                            )}
                          </div>

                          {/* Character image */}
                          <div className={`relative z-10 my-2 sm:my-3 overflow-hidden rounded-xl bg-ocean-surface/50 ${
                            isFirst ? 'h-16 w-16 sm:h-24 sm:w-24' : 'h-14 w-14 sm:h-20 sm:w-20'
                          }`}>
                            {characterImage ? (
                              <Image
                                src={characterImage}
                                alt={entry.name}
                                fill
                                className="object-cover object-top transition-transform duration-500 group-hover:scale-110"
                                sizes="96px"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <Skull className="h-6 w-6 text-pirate-muted" />
                              </div>
                            )}
                          </div>

                          {/* Name & epithet */}
                          <div className="relative z-10 px-2 text-center">
                            <p className={`font-bold leading-tight ${
                              isFirst ? 'text-xs sm:text-sm text-gold' : 'text-[11px] sm:text-xs text-pirate-text'
                            }`}>
                              {entry.name}
                            </p>
                            {entry.epithet && (
                              <p className="mt-0.5 text-[9px] sm:text-[10px] italic text-pirate-muted">
                                &quot;{entry.epithet}&quot;
                              </p>
                            )}
                          </div>

                          {/* Bounty */}
                          <div className={`relative z-10 mt-auto mb-3 sm:mb-4 rounded-lg px-3 py-1.5 ${
                            isFirst ? 'bg-gold/15 border border-gold/20' : 'bg-ocean-surface/80'
                          }`}>
                            <p className={`text-center text-xs sm:text-sm font-extrabold ${
                              isFirst ? 'text-gold' : RANK_COLORS[actualRank - 1]
                            }`}>
                              {formatBounty(bountyValue)}
                            </p>
                            <p className="text-center text-[8px] sm:text-[9px] text-pirate-muted">Berry</p>
                          </div>
                        </div>
                      </MaybeLinkWrapper>

                      {/* Podium base */}
                      <div className={`mt-2 w-full rounded-t-lg text-center py-1 ${
                        isFirst
                          ? 'bg-gradient-to-r from-gold/20 via-gold/30 to-gold/20 border-x border-t border-gold/20'
                          : actualRank === 2
                            ? 'bg-gradient-to-r from-pirate-text/10 via-pirate-text/15 to-pirate-text/10 border-x border-t border-pirate-border/30'
                            : 'bg-gradient-to-r from-amber-700/10 via-amber-700/15 to-amber-700/10 border-x border-t border-amber-700/20'
                      }`}>
                        <span className={`text-[10px] font-bold ${RANK_COLORS[actualRank - 1]}`}>
                          #{actualRank}
                        </span>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.section>
          )}

          {/* Leaderboard */}
          <motion.section
            variants={staggerContainer(0.03)}
            initial="hidden"
            animate="visible"
            className="mb-8"
          >
            {/* Section label */}
            <motion.div variants={fadeUp} className="mb-4 flex items-center gap-3">
              <Star className="h-4 w-4 text-sea" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-pirate-muted">
                {isFiltered ? `Sonuçlar (${filtered.length})` : 'Tam Sıralama'}
              </h2>
              <div className="divider-glow flex-1" />
            </motion.div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {(isFiltered ? filtered : rest).map((entry, i) => {
                  const rank = isFiltered
                    ? allSorted.findIndex((e) => e.name === entry.name) + 1
                    : i + 4
                  const bountyValue = parseBounty(entry.bounty)
                  const characterImage = entry.slug ? getCharacterImage(entry.slug) : ''
                  const isTop10 = rank <= 10

                  return (
                    <motion.div
                      key={`${entry.name}-${entry.bounty}`}
                      variants={fadeUp}
                      layout
                      exit={{ opacity: 0, scale: 0.95 }}
                    >
                      <MaybeLinkWrapper slug={entry.slug}>
                        <div className={`bento-card group relative flex flex-col items-center overflow-hidden p-5 text-center transition-all duration-500 ${
                          isTop10 ? 'hover:border-gold/20 hover:shadow-gold-glow' : ''
                        }`}>
                          {/* Rank badge */}
                          <div className={`absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg border ${
                            rank <= 5 ? 'bg-gold/15 border-gold/30' : rank <= 10 ? 'bg-sea/10 border-sea/20' : 'bg-ocean-surface/60 border-pirate-border/30'
                          }`}>
                            <span className={`text-xs font-extrabold ${
                              rank <= 5 ? 'text-gold' : rank <= 10 ? 'text-sea' : 'text-pirate-muted'
                            }`}>
                              #{rank}
                            </span>
                          </div>

                          {/* Character image */}
                          <div className={`relative mb-3 h-20 w-20 overflow-hidden rounded-2xl border-2 ${
                            isTop10 ? 'border-gold/25 bg-ocean-surface' : 'border-pirate-border/30 bg-ocean-surface'
                          }`}>
                            {characterImage ? (
                              <Image
                                src={characterImage}
                                alt={entry.name}
                                fill
                                className="object-cover object-top transition-transform duration-500 group-hover:scale-110"
                                sizes="80px"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <Skull className="h-8 w-8 text-pirate-muted/40" />
                              </div>
                            )}
                          </div>

                          {/* Name */}
                          <h3 className="mb-0.5 text-base font-bold text-pirate-text transition-colors group-hover:text-gold">
                            {entry.name}
                          </h3>
                          {entry.epithet && (
                            <p className="mb-2 text-xs italic text-pirate-muted">&quot;{entry.epithet}&quot;</p>
                          )}

                          {/* Bounty */}
                          <div className={`mt-auto rounded-xl px-4 py-2 ${
                            isTop10 ? 'bg-gold/10 border border-gold/20' : 'bg-ocean-surface/80'
                          }`}>
                            <p className={`text-lg font-extrabold ${rank <= 5 ? 'text-gold' : rank <= 10 ? 'text-gold/80' : 'text-pirate-text'}`}>
                              {formatBounty(bountyValue)}
                            </p>
                            <p className="text-[10px] text-pirate-muted">{entry.bounty} Berry</p>
                          </div>

                          {/* Crew pill */}
                          <span className="mt-3 rounded-full bg-ocean-surface/80 px-3 py-1 text-[10px] font-medium text-pirate-muted">
                            {entry.crew}
                          </span>
                        </div>
                      </MaybeLinkWrapper>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>

            {filtered.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-8 flex flex-col items-center gap-3 py-12 text-center"
              >
                <Search className="h-8 w-8 text-pirate-muted/40" />
                <p className="text-pirate-muted">Aramanızla eşleşen korsan bulunamadı.</p>
              </motion.div>
            )}
          </motion.section>

          {/* Chopper fun fact callout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6, ease: EASE }}
            className="relative mb-8 overflow-hidden rounded-2xl border border-gold/20 bg-gradient-to-br from-gold/[0.06] via-ocean-surface/60 to-ocean-surface/30"
          >
            {/* Background sparkle */}
            <div className="absolute right-4 top-4 opacity-20">
              <Sparkles className="h-16 w-16 text-gold" />
            </div>

            <div className="relative flex items-start gap-4 p-5 sm:p-6">
              {/* Chopper avatar */}
              <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl border-2 border-gold/20 bg-ocean-surface">
                <Image
                  src={getCharacterImage('chopper')}
                  alt="Tony Tony Chopper"
                  fill
                  className="object-cover object-top"
                  sizes="56px"
                />
              </div>

              <div className="flex-1">
                <div className="mb-1.5 flex items-center gap-2">
                  <Medal className="h-4 w-4 text-gold" />
                  <span className="text-xs font-bold uppercase tracking-wider text-gold">Eğlenceli Bilgi</span>
                </div>
                <p className="text-sm leading-relaxed text-pirate-text">
                  Chopper&apos;ın ödülü sadece <span className="font-extrabold text-gold">1.000 Berry</span> — Dünya Hükümeti onu mürettebatın maskotu (evcil hayvanı) sanıyor! Bu, tüm One Piece evrenindeki en düşük aktif korsan ödülü.
                </p>
                <p className="mt-1.5 text-[11px] text-pirate-muted italic">
                  &quot;Ben bir geyik değilim, bir Tanuki&apos;yim!&quot; — Chopper (muhtemelen)
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-16" />
      </main>
      <Footer />
    </>
  )
}

/** Wraps children in a Link if slug exists, otherwise renders as-is */
function MaybeLinkWrapper({ slug, children }: { slug?: string; children: React.ReactNode }) {
  if (slug) {
    return (
      <Link href={`/characters/${slug}`} className="block">
        {children}
      </Link>
    )
  }
  return <>{children}</>
}
