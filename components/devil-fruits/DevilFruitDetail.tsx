'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowLeft, Cherry, Sparkles, Skull, Zap,
  AlertTriangle, Star, BookOpen, Globe
} from 'lucide-react'
import { fadeUp, staggerContainer } from '@/lib/variants'
import { DEVIL_FRUIT_TYPE_INFO } from '@/lib/constants/devil-fruits'
import type { DevilFruitEntry } from '@/types'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function DevilFruitDetailClient({ fruit }: { fruit: DevilFruitEntry }) {
  const typeInfo = DEVIL_FRUIT_TYPE_INFO[fruit.type]

  return (
    <>
      <Header />
      <main className="relative min-h-screen pt-24">
        <div className="mx-auto max-w-4xl px-6">
          {/* Back */}
          <Link
            href="/devil-fruits"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-pirate-muted transition-colors hover:text-gold"
          >
            <ArrowLeft className="h-4 w-4" />
            Tüm Şeytan Meyveleri
          </Link>

          <motion.div
            variants={staggerContainer(0.1)}
            initial="hidden"
            animate="visible"
          >
            {/* Hero */}
            <motion.div variants={fadeUp} className="mb-8">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${typeInfo.bg} ${typeInfo.color}`}>
                  {typeInfo.label}
                </span>
                {fruit.status === 'deceased' && (
                  <span className="rounded-full bg-luffy/10 px-3 py-1 text-xs font-semibold text-luffy">
                    Kullanıcı Ölü
                  </span>
                )}
              </div>
              <h1 className="mb-2 text-3xl font-extrabold text-pirate-text sm:text-4xl">
                {fruit.name}
              </h1>
              <p className="mb-1 font-mono text-sm text-pirate-muted/60">{fruit.japaneseName}</p>
              <p className="text-sm text-gold">{fruit.meaning}</p>
            </motion.div>

            {/* Description */}
            <motion.div variants={fadeUp} className="mb-8">
              <div className="bento-card rounded-xl p-6">
                <div className="mb-3 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-gold" />
                  <h2 className="text-sm font-bold text-pirate-text">Açıklama</h2>
                </div>
                <p className="text-sm leading-relaxed text-pirate-muted">
                  {fruit.description}
                </p>
              </div>
            </motion.div>

            {/* User */}
            <motion.div variants={fadeUp} className="mb-8">
              <div className="bento-card rounded-xl p-5">
                <div className="mb-3 flex items-center gap-2">
                  <Skull className="h-4 w-4 text-sea" />
                  <h2 className="text-sm font-bold text-pirate-text">Kullanıcı</h2>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-base font-bold text-pirate-text">{fruit.user}</p>
                  {fruit.userSlug && (
                    <Link
                      href={`/characters/${fruit.userSlug}`}
                      className="rounded-lg bg-sea/10 px-3 py-1 text-xs font-medium text-sea transition-colors hover:bg-sea/20"
                    >
                      Karakter Sayfası
                    </Link>
                  )}
                </div>
                <p className="mt-2 flex items-center gap-1.5 text-xs text-pirate-muted">
                  <Globe className="h-3 w-3" />
                  İlk Görünüm: {fruit.firstAppearance}
                </p>
              </div>
            </motion.div>

            {/* Abilities */}
            <motion.div variants={fadeUp} className="mb-8">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-pirate-text">
                <Zap className="h-5 w-5 text-gold" />
                Yetenekler
              </h2>
              <div className="bento-card rounded-xl p-5">
                <div className="space-y-3">
                  {fruit.abilities.map((ability, i) => (
                    <div
                      key={i}
                      className="flex gap-3 rounded-lg bg-ocean-surface px-4 py-3"
                    >
                      <Sparkles className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-gold" />
                      <p className="text-sm leading-relaxed text-pirate-muted">{ability}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Weakness */}
            {fruit.weakness && (
              <motion.div variants={fadeUp} className="mb-8">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-pirate-text">
                  <AlertTriangle className="h-5 w-5 text-luffy" />
                  Zayıf Nokta
                </h2>
                <div className="bento-card rounded-xl border-luffy/20 p-5">
                  <p className="text-sm leading-relaxed text-pirate-muted">
                    {fruit.weakness}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Awakening */}
            {fruit.awakening && (
              <motion.div variants={fadeUp} className="mb-8">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-pirate-text">
                  <Star className="h-5 w-5 text-gold" />
                  Uyanış (Awakening)
                </h2>
                <div className="bento-card rounded-xl border-gold/20 p-5">
                  <p className="text-sm leading-relaxed text-pirate-muted">
                    {fruit.awakening}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Type info */}
            <motion.div variants={fadeUp} className="mb-8">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-pirate-text">
                <Cherry className="h-5 w-5 text-purple-400" />
                Meyve Türü Hakkında
              </h2>
              <div className="bento-card rounded-xl p-5">
                <p className={`mb-2 text-sm font-bold ${typeInfo.color}`}>{typeInfo.label}</p>
                <p className="text-sm leading-relaxed text-pirate-muted">
                  {typeInfo.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <div className="mt-16" />
      </main>
      <Footer />
    </>
  )
}
