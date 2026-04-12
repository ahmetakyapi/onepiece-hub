'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowLeft, Crown, Users, Skull, BookOpen,
  Trophy, MapPin, Anchor, Star, Swords
} from 'lucide-react'
import { fadeUp, staggerContainer } from '@/lib/variants'
import { CREW_TYPE_LABELS } from '@/lib/constants/crews'
import type { Crew } from '@/lib/constants/crews'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function CrewDetailClient({ crew }: { crew: Crew }) {
  return (
    <>
      <Header />
      <main className="relative min-h-screen pt-24">
        <div className="mx-auto max-w-4xl px-6">
          {/* Back */}
          <Link
            href="/crews"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-pirate-muted transition-colors hover:text-gold"
          >
            <ArrowLeft className="h-4 w-4" />
            Tüm Organizasyonlar
          </Link>

          <motion.div
            variants={staggerContainer(0.1)}
            initial="hidden"
            animate="visible"
          >
            {/* Hero */}
            <motion.div variants={fadeUp} className="mb-8">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${crew.bg} ${crew.color}`}>
                  {CREW_TYPE_LABELS[crew.type]}
                </span>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  crew.status === 'active' ? 'bg-green-500/10 text-green-400' :
                  crew.status === 'disbanded' ? 'bg-pirate-muted/10 text-pirate-muted' :
                  'bg-luffy/10 text-luffy'
                }`}>
                  {crew.status === 'active' ? 'Aktif' :
                   crew.status === 'disbanded' ? 'Dağıtılmış' :
                   crew.status === 'defeated' ? 'Yenilmiş' : 'Bilinmiyor'}
                </span>
              </div>
              <h1 className={`mb-1 text-3xl font-extrabold sm:text-4xl ${crew.color}`}>
                {crew.name}
              </h1>
              <p className="mb-4 font-mono text-sm text-pirate-muted/60">{crew.japaneseName}</p>
              <p className="text-sm leading-relaxed text-pirate-muted">{crew.description}</p>
            </motion.div>

            {/* Quick stats */}
            <motion.div variants={fadeUp} className="mb-8 flex flex-wrap gap-3">
              {crew.captain && (
                <div className="glass rounded-xl px-4 py-2.5">
                  <p className="text-xs text-pirate-muted">Lider</p>
                  {crew.captainSlug ? (
                    <Link href={`/characters/${crew.captainSlug}`} className="text-sm font-bold text-gold hover:text-gold-bright">
                      {crew.captain}
                    </Link>
                  ) : (
                    <p className="text-sm font-bold text-pirate-text">{crew.captain}</p>
                  )}
                </div>
              )}
              {crew.totalBounty && (
                <div className="glass rounded-xl px-4 py-2.5">
                  <p className="text-xs text-pirate-muted">Toplam Ödül</p>
                  <p className="text-sm font-bold text-gold">{crew.totalBounty} Berry</p>
                </div>
              )}
              <div className="glass rounded-xl px-4 py-2.5">
                <p className="text-xs text-pirate-muted">Bilinen Üye</p>
                <p className="text-sm font-bold text-sea">{crew.notableMembers.length}</p>
              </div>
            </motion.div>

            {/* History */}
            <motion.div variants={fadeUp} className="mb-8">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-pirate-text">
                <BookOpen className="h-5 w-5 text-gold" />
                Tarihçe
              </h2>
              <div className="glass rounded-xl p-5">
                <p className="text-sm leading-relaxed text-pirate-muted whitespace-pre-line">
                  {crew.history}
                </p>
              </div>
            </motion.div>

            {/* Territory */}
            {crew.territory && crew.territory.length > 0 && (
              <motion.div variants={fadeUp} className="mb-8">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-pirate-text">
                  <MapPin className="h-5 w-5 text-sea" />
                  Topraklar
                </h2>
                <div className="glass rounded-xl p-4">
                  <div className="flex flex-wrap gap-2">
                    {crew.territory.map((t) => (
                      <span key={t} className="rounded-lg bg-ocean-surface px-3 py-1.5 text-xs font-medium text-pirate-text">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Members */}
            <motion.div variants={fadeUp} className="mb-8">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-pirate-text">
                <Users className="h-5 w-5 text-gold" />
                Önemli Üyeler
              </h2>
              <div className="glass rounded-xl p-4">
                <div className="grid gap-2 sm:grid-cols-2">
                  {crew.notableMembers.map((member) => {
                    const content = (
                      <div className="flex items-center justify-between rounded-lg bg-ocean-surface px-4 py-3 transition-colors hover:bg-ocean-surface/80">
                        <div>
                          <p className="text-sm font-semibold text-pirate-text">{member.name}</p>
                          <p className="text-xs text-pirate-muted">{member.role}</p>
                        </div>
                        {member.slug && (
                          <span className="text-[10px] text-sea">Profil &rarr;</span>
                        )}
                      </div>
                    )
                    return member.slug ? (
                      <Link key={member.name} href={`/characters/${member.slug}`}>
                        {content}
                      </Link>
                    ) : (
                      <div key={member.name}>{content}</div>
                    )
                  })}
                </div>
              </div>
            </motion.div>

            {/* Achievements */}
            <motion.div variants={fadeUp} className="mb-8">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-pirate-text">
                <Trophy className="h-5 w-5 text-gold" />
                Başarılar
              </h2>
              <div className="glass rounded-xl p-5">
                <div className="space-y-3">
                  {crew.achievements.map((achievement, i) => (
                    <div key={i} className="flex gap-3 rounded-lg bg-ocean-surface px-4 py-3">
                      <Star className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-gold" />
                      <p className="text-sm leading-relaxed text-pirate-muted">{achievement}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Jolly Roger */}
            {crew.jollyRoger && (
              <motion.div variants={fadeUp} className="mb-8">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-pirate-text">
                  <Skull className="h-5 w-5 text-pirate-text" />
                  Jolly Roger
                </h2>
                <div className="glass rounded-xl p-5">
                  <p className="text-sm text-pirate-muted">{crew.jollyRoger}</p>
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
