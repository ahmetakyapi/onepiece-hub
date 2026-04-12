'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Skull, Crown, Search, Medal } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { CHARACTERS, CREW_LABELS } from '@/lib/constants/characters'
import { getCharacterImage } from '@/lib/constants/images'
import { fadeUp, staggerContainer } from '@/lib/variants'

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

const RANK_STYLES = [
  'border-gold/50 shadow-gold-glow bg-gradient-to-r from-gold/10 to-transparent', // 1st
  'border-pirate-text/30 bg-gradient-to-r from-pirate-text/5 to-transparent', // 2nd
  'border-amber-700/30 bg-gradient-to-r from-amber-700/5 to-transparent', // 3rd
] as const

const RANK_COLORS = ['text-gold', 'text-pirate-text', 'text-amber-600'] as const

// Additional known bounties (characters not in CHARACTERS array)
const EXTRA_BOUNTIES: { name: string; bounty: string; crew: string; slug?: string; epithet?: string }[] = [
  { name: 'Gol D. Roger', bounty: '5,564,800,000', crew: 'Korsanlar Kralı', epithet: 'Korsanlar Kralı' },
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

export default function BountiesPage() {
  const [search, setSearch] = useState('')

  const sorted = useMemo(() => {
    const all = EXTRA_BOUNTIES
      .filter((b) => b.bounty !== '---')
      .sort((a, b) => parseBounty(b.bounty) - parseBounty(a.bounty))

    if (!search) return all

    return all.filter((b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.crew.toLowerCase().includes(search.toLowerCase()) ||
      (b.epithet?.toLowerCase().includes(search.toLowerCase()) ?? false)
    )
  }, [search])

  return (
    <>
      <Header />
      <main className="relative min-h-screen pt-24">
        <div className="mx-auto max-w-4xl px-6">
          {/* Header */}
          <motion.div
            variants={staggerContainer(0.1)}
            initial="hidden"
            animate="visible"
            className="mb-10"
          >
            <motion.h1
              variants={fadeUp}
              className="mb-3 text-3xl font-extrabold sm:text-4xl"
            >
              <span className="text-gold-gradient">Ödül</span>{' '}
              <span className="text-pirate-text">Sıralaması</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="max-w-2xl text-pirate-muted">
              One Piece evrenindeki en yüksek ödüllü korsanlar ve suçlular.
              Dünya Hükümeti tarafından belirlenen ödüller, bir kişinin tehlike seviyesini gösterir.
            </motion.p>

            {/* Total */}
            <motion.div variants={fadeUp} className="mt-4 glass rounded-xl p-4 inline-flex items-center gap-3">
              <Trophy className="h-5 w-5 text-gold" />
              <div>
                <p className="text-xs text-pirate-muted">Toplam Kayıtlı Ödül</p>
                <p className="text-lg font-extrabold text-gold">
                  {sorted.reduce((sum, b) => sum + parseBounty(b.bounty), 0).toLocaleString()} Berry
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-pirate-muted" />
              <input
                type="text"
                placeholder="Karakter veya mürettebat ara..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-pirate-border bg-ocean-surface/50 py-2.5 pl-10 pr-4 text-sm text-pirate-text placeholder:text-pirate-muted focus:border-gold/30 focus:outline-none focus:ring-1 focus:ring-gold/20"
              />
            </div>
          </div>

          {/* Leaderboard */}
          <motion.div
            variants={staggerContainer(0.02)}
            initial="hidden"
            animate="visible"
            className="space-y-2"
          >
            {sorted.map((entry, i) => {
              const rank = i + 1
              const bountyValue = parseBounty(entry.bounty)
              const characterImage = entry.slug ? getCharacterImage(entry.slug) : ''
              const isTop3 = rank <= 3

              return (
                <motion.div key={`${entry.name}-${entry.bounty}`} variants={fadeUp}>
                  {entry.slug ? (
                    <Link
                      href={`/characters/${entry.slug}`}
                      className={`group flex items-center gap-4 rounded-xl border p-4 transition-all hover:border-gold/30 ${
                        isTop3
                          ? RANK_STYLES[rank - 1]
                          : 'border-pirate-border/50 bg-ocean-surface/30 hover:bg-ocean-surface/50'
                      }`}
                    >
                      <RankContent
                        rank={rank}
                        entry={entry}
                        bountyValue={bountyValue}
                        characterImage={characterImage}
                        isTop3={isTop3}
                      />
                    </Link>
                  ) : (
                    <div
                      className={`flex items-center gap-4 rounded-xl border p-4 ${
                        isTop3
                          ? RANK_STYLES[rank - 1]
                          : 'border-pirate-border/50 bg-ocean-surface/30'
                      }`}
                    >
                      <RankContent
                        rank={rank}
                        entry={entry}
                        bountyValue={bountyValue}
                        characterImage={characterImage}
                        isTop3={isTop3}
                      />
                    </div>
                  )}
                </motion.div>
              )
            })}
          </motion.div>

          {/* Fun fact about Chopper */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 glass rounded-xl p-5"
          >
            <p className="flex items-center gap-2 text-sm text-pirate-muted">
              <Medal className="h-4 w-4 text-gold" />
              <span>
                <span className="font-bold text-pirate-text">Eğlenceli Bilgi:</span>{' '}
                Chopper&apos;ın ödülü sadece 1.000 Berry — Dünya Hükümeti onu mürettebatın maskotu (evcil hayvanı) sanıyor!
              </span>
            </p>
          </motion.div>
        </div>

        <div className="mt-16" />
      </main>
      <Footer />
    </>
  )
}

function RankContent({
  rank,
  entry,
  bountyValue,
  characterImage,
  isTop3,
}: {
  rank: number
  entry: { name: string; bounty: string; crew: string; slug?: string; epithet?: string }
  bountyValue: number
  characterImage: string
  isTop3: boolean
}) {
  return (
    <>
      {/* Rank */}
      <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl font-extrabold ${
        isTop3
          ? `text-lg ${RANK_COLORS[rank - 1]}`
          : 'text-sm text-pirate-muted'
      }`}>
        {isTop3 ? (
          <Crown className={`h-6 w-6 ${RANK_COLORS[rank - 1]}`} />
        ) : (
          `#${rank}`
        )}
      </div>

      {/* Avatar */}
      <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-ocean-surface">
        {characterImage ? (
          <Image
            src={characterImage}
            alt={entry.name}
            fill
            className="object-cover object-top"
            sizes="40px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Skull className="h-4 w-4 text-pirate-muted" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-pirate-text truncate">{entry.name}</p>
        <div className="flex items-center gap-2">
          {entry.epithet && (
            <span className="text-[10px] italic text-pirate-muted">&quot;{entry.epithet}&quot;</span>
          )}
          <span className="text-[10px] text-pirate-muted/60">{entry.crew}</span>
        </div>
      </div>

      {/* Bounty */}
      <div className="text-right flex-shrink-0">
        <p className={`text-sm font-extrabold ${isTop3 ? 'text-gold' : 'text-pirate-text'}`}>
          {formatBounty(bountyValue)}
        </p>
        <p className="text-[10px] text-pirate-muted">{entry.bounty} Berry</p>
      </div>
    </>
  )
}
