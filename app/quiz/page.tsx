'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import {
  BrainCircuit,
  Trophy,
  CheckCircle,
  Sparkles,
  ChevronRight,
} from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import PageHero from '@/components/wiki/PageHero'
import { QUIZZES } from '@/lib/constants/quizzes'
import { ARCS, getArcBySlug } from '@/lib/constants/arcs'
import { getArcImage } from '@/lib/constants/images'
import { SAGAS } from '@/lib/constants/sagas'
import { fadeUp, staggerContainer } from '@/lib/variants'

export default function QuizHubPage() {
  const quizzesBySaga = useMemo(() => {
    return SAGAS.map((saga) => {
      const sagaQuizzes = saga.arcs
        .map((arcSlug) => {
          const arc = getArcBySlug(arcSlug)
          const quiz = QUIZZES.find((q) => q.arcSlug === arcSlug)
          if (!arc || !quiz) return null
          return { arc, quiz, arcSlug }
        })
        .filter(Boolean) as { arc: (typeof ARCS)[number]; quiz: (typeof QUIZZES)[number]; arcSlug: string }[]

      return { saga, quizzes: sagaQuizzes }
    }).filter((s) => s.quizzes.length > 0)
  }, [])

  const totalQuizzes = QUIZZES.length
  const totalQuestions = QUIZZES.reduce((acc, q) => acc + q.questions.length, 0)

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <PageHero
          title="Quiz Arena"
          subtitle="One Piece bilgini test et!"
          description="Her arc için 5 soruluk quiz. Bilgini sına, skorunu gör ve gerçek bir nakama olduğunu kanıtla!"
          icon={BrainCircuit}
          accentColor="purple"
          orbs={[
            { color: 'rgba(168, 85, 247, 0.4)', size: 280, x: '15%', y: '25%', delay: 0 },
            { color: 'rgba(244, 163, 0, 0.2)', size: 200, x: '75%', y: '15%', delay: 1.5 },
            { color: 'rgba(168, 85, 247, 0.15)', size: 220, x: '85%', y: '65%', delay: 3 },
          ]}
        />

        {/* Stats */}
        <section className="max-w-6xl mx-auto px-4 -mt-6 mb-12 relative z-10">
          <motion.div
            variants={staggerContainer(0.1)}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-3 gap-4"
          >
            {[
              { label: 'Quiz', value: totalQuizzes, icon: BrainCircuit },
              { label: 'Soru', value: totalQuestions, icon: Sparkles },
              { label: 'Saga', value: SAGAS.length, icon: Trophy },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                className="glass rounded-xl p-4 text-center"
              >
                <stat.icon className="w-5 h-5 mx-auto mb-2 text-gold" />
                <span className="block text-2xl font-bold text-gold stat-number">{stat.value}</span>
                <span className="block text-xs text-pirate-muted">{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Saga-grouped quizzes */}
        <section className="max-w-6xl mx-auto px-4 pb-24">
          <motion.div
            variants={staggerContainer(0.08)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="space-y-12"
          >
            {quizzesBySaga.map(({ saga, quizzes }) => (
              <motion.div key={saga.slug} variants={fadeUp}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-1 h-8 rounded-full bg-gradient-to-b from-gold to-gold/30" />
                  <h2 className="text-xl font-bold text-pirate-text">{saga.name} Saga</h2>
                  <span className="chip text-xs">{quizzes.length} quiz</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {quizzes.map(({ arc, quiz, arcSlug }) => {
                    const img = getArcImage(arcSlug)
                    return (
                      <Link
                        key={arcSlug}
                        href={`/quiz/${arcSlug}`}
                        className="glass rounded-xl overflow-hidden group hover:border-gold/30 transition-all duration-300"
                      >
                        {/* Arc image */}
                        <div className="relative h-32 overflow-hidden">
                          {img ? (
                            <Image
                              src={img}
                              alt={arc.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full bg-ocean-elevated" />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-ocean-deep/90 via-ocean-deep/40 to-transparent" />

                          {/* Question count badge */}
                          <div className="absolute top-3 right-3 glass rounded-lg px-2 py-1 text-xs font-medium text-pirate-text">
                            {quiz.questions.length} soru
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                          <h3 className="text-sm font-bold text-pirate-text group-hover:text-gold transition-colors line-clamp-1">
                            {arc.name}
                          </h3>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-pirate-muted">
                              {arc.episodes?.length ?? 0} bölüm
                            </span>
                            <ChevronRight className="w-4 h-4 text-pirate-muted group-hover:text-gold group-hover:translate-x-1 transition-all" />
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  )
}
