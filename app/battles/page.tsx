'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Swords, Star, Skull, Heart, Zap, Crown, Shield, Flame } from 'lucide-react'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { BATTLES, BATTLE_CATEGORIES } from '@/lib/constants/battles'
import { fadeUp, staggerContainer, EASE } from '@/lib/variants'

const WINNER_LABELS = {
  side1: 'Kazanan: Taraf 1',
  side2: 'Kazanan: Taraf 2',
  draw: 'Berabere',
  interrupted: 'Yarıda Kaldı',
} as const

export default function BattlesPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return activeCategory ? BATTLES.filter((b) => b.category === activeCategory) : BATTLES
  }, [activeCategory])

  const categories = Object.entries(BATTLE_CATEGORIES)

  return (
    <>
      <Header />
      <main className="relative min-h-screen pt-24">
        <div className="mx-auto max-w-5xl px-6">
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
              <span className="text-gold-gradient">Efsanevi</span>{' '}
              <span className="text-pirate-text">Savaşlar</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="max-w-2xl text-pirate-muted">
              One Piece tarihinin en ikonik dövüşleri ve savaşları. Destansı çatışmalardan
              duygusal düellolara, her savaş hikayenin gidişatını değiştirdi.
            </motion.p>
          </motion.div>

          {/* Category filters */}
          <div className="mb-8 flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory(null)}
              className={`chip transition-all ${!activeCategory ? 'border-gold/40 bg-gold/10 text-gold' : ''}`}
            >
              Tümü ({BATTLES.length})
            </button>
            {categories.map(([key, { label, color }]) => (
              <button
                key={key}
                onClick={() => setActiveCategory(activeCategory === key ? null : key)}
                className={`chip transition-all ${activeCategory === key ? 'border-gold/40 bg-gold/10 text-gold' : ''}`}
              >
                <span className={color}>{label}</span>
              </button>
            ))}
          </div>

          {/* Battles */}
          <div className="space-y-6">
            {filtered.map((battle, i) => {
              const catInfo = BATTLE_CATEGORIES[battle.category]
              return (
                <motion.div
                  key={battle.slug}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, ease: EASE, delay: i * 0.05 }}
                  className="glass rounded-2xl p-6 transition-all hover:border-gold/20"
                >
                  {/* Header */}
                  <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="mb-2 flex items-center gap-2">
                        <Swords className="h-5 w-5 text-gold" />
                        <h2 className="text-lg font-extrabold text-pirate-text">{battle.name}</h2>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${catInfo.color} bg-ocean-surface`}>
                          {catInfo.label}
                        </span>
                        <Link
                          href={`/arcs/${battle.arcSlug}`}
                          className="rounded-full bg-sea/10 px-2 py-0.5 text-[10px] font-medium text-sea transition-colors hover:bg-sea/20"
                        >
                          {battle.arc}
                        </Link>
                      </div>
                    </div>

                    {/* Power & Emotion meters */}
                    <div className="flex gap-4">
                      <div className="text-center">
                        <p className="text-[10px] text-pirate-muted mb-1">Güç</p>
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, j) => (
                            <Zap
                              key={j}
                              className={`h-3 w-3 ${j < battle.powerLevel ? 'text-gold' : 'text-pirate-border'}`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] text-pirate-muted mb-1">Duygu</p>
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, j) => (
                            <Heart
                              key={j}
                              className={`h-3 w-3 ${j < battle.emotionalWeight ? 'text-luffy' : 'text-pirate-border'}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Participants */}
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex-1 rounded-lg bg-ocean-surface p-3">
                      <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-sea">Taraf 1</p>
                      {battle.participants.side1.map((p) => (
                        <p key={p} className="text-sm font-semibold text-pirate-text">{p}</p>
                      ))}
                    </div>
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gold/10">
                      <span className="text-xs font-bold text-gold">VS</span>
                    </div>
                    <div className="flex-1 rounded-lg bg-ocean-surface p-3">
                      <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-luffy">Taraf 2</p>
                      {battle.participants.side2.map((p) => (
                        <p key={p} className="text-sm font-semibold text-pirate-text">{p}</p>
                      ))}
                    </div>
                  </div>

                  {/* Winner */}
                  <div className="mb-4 flex items-center gap-2">
                    <Crown className={`h-4 w-4 ${
                      battle.winner === 'draw' ? 'text-pirate-muted' : 'text-gold'
                    }`} />
                    <span className={`text-xs font-semibold ${
                      battle.winner === 'draw' ? 'text-pirate-muted' : 'text-gold'
                    }`}>
                      {battle.winner === 'side1'
                        ? battle.participants.side1.join(', ')
                        : battle.winner === 'side2'
                        ? battle.participants.side2.join(', ')
                        : WINNER_LABELS[battle.winner]}
                      {battle.winner !== 'draw' && battle.winner !== 'interrupted' && ' kazandı'}
                    </span>
                  </div>

                  {/* Significance */}
                  <p className="mb-4 text-sm font-medium text-sea">{battle.significance}</p>

                  {/* Description */}
                  <p className="mb-4 text-sm leading-relaxed text-pirate-muted">
                    {battle.description}
                  </p>

                  {/* Key moments */}
                  <div>
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-pirate-text">Kilit Anlar</p>
                    <div className="space-y-1.5">
                      {battle.keyMoments.map((moment, j) => (
                        <div key={j} className="flex gap-2">
                          <Star className="mt-0.5 h-3 w-3 flex-shrink-0 text-gold/50" />
                          <p className="text-xs leading-relaxed text-pirate-muted">{moment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        <div className="mt-16" />
      </main>
      <Footer />
    </>
  )
}
