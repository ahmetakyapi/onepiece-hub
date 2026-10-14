'use client'

import { useEffect, useMemo, useState } from 'react'
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
import PageHero from '@/components/wiki/PageHero'
import { QUIZZES } from '@/lib/constants/quizzes'
import { ARCS, getArcBySlug } from '@/lib/constants/arcs'
import { getArcImage } from '@/lib/constants/images'
import { SAGAS } from '@/lib/constants/sagas'
import { fadeUp, staggerContainer } from '@/lib/variants'
import { useAuth } from '@/hooks/useAuth'

type BestScore = { score: number; totalQ: number }

export default function QuizHubPage() {
  const { user } = useAuth()
  /* Girişli kullanıcının en iyi skorları — kartta "En İyi 4/5" rozeti.
     Skorlar eskiden yalnız profilde görünüyordu; hangi quiz'i çözdüğünü
     görmek için listeden çıkmak gerekiyordu. Misafirde istek atılmaz. */
  const [best, setBest] = useState<Record<string, BestScore> | null>(null)

  useEffect(() => {
    if (!user) {
      setBest(null)
      return
    }
    let cancelled = false
    fetch('/api/quiz-scores')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data?.data?.scores) return
        const map: Record<string, BestScore> = {}
        for (const s of data.data.scores as { arcSlug: string; score: number; totalQ: number }[]) {
          map[s.arcSlug] = { score: s.score, totalQ: s.totalQ }
        }
        setBest(map)
      })
      .catch(() => {
        /* Skorlar ek bilgi — liste onlarsız da çalışır */
      })
    return () => {
      cancelled = true
    }
  }, [user])

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
  const solvedCount = best ? QUIZZES.filter((q) => best[q.arcSlug]).length : 0

  const stats = [
    { label: 'Quiz', value: String(totalQuizzes), icon: BrainCircuit },
    { label: 'Soru', value: String(totalQuestions), icon: Sparkles },
    { label: 'Saga', value: String(SAGAS.length), icon: Trophy },
    ...(best ? [{ label: 'Çözdüğün', value: `${solvedCount}/${totalQuizzes}`, icon: CheckCircle }] : []),
  ]

  /* Üst boşluk diğer liste sayfalarıyla aynı (`pt-24`): eskiden yoktu,
     hero sabit header'ın altına giriyor, ikon logoyla çakışıyordu. */
  return (
      <main className="relative min-h-screen pt-24">
        <div className="mx-auto max-w-6xl px-6">
          <PageHero
            title="Quiz"
            subtitle="Arenası"
            description="Her arc için kısa bir quiz. Bilgini test et; giriş yaptıysan en iyi skorun profiline yazılır."
            icon={BrainCircuit}
            accentColor="purple"
            orbs={[
              { color: 'rgb(var(--fruit-strong) / 0.4)', size: 280, x: '15%', y: '25%', delay: 0 },
              { color: 'rgb(var(--gold) / 0.2)', size: 200, x: '75%', y: '15%', delay: 1.5 },
              { color: 'rgb(var(--fruit-strong) / 0.15)', size: 220, x: '85%', y: '65%', delay: 3 },
            ]}
          />

          {/* Stats — mobilde de yan yana: alt alta üç tam genişlik kart
              ilk ekranı tek başına dolduruyordu. */}
          <section className="relative z-10 mx-auto -mt-6 mb-12 max-w-6xl">
          <motion.div
            variants={staggerContainer(0.1)}
            initial="hidden"
            animate="visible"
            className={`grid gap-2 sm:gap-4 ${stats.length === 4 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3'}`}
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                className="glass rounded-xl px-2 py-4 text-center sm:p-4"
              >
                <stat.icon className="w-5 h-5 mx-auto mb-2 text-gold" />
                <span className="block text-xl font-bold text-gold stat-number sm:text-2xl">{stat.value}</span>
                <span className="eyebrow mt-1 block text-pirate-muted">{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Saga-grouped quizzes — her saga kendi görünürlüğüyle açılır.
            Eskiden tek dev kapsayıcı `amount: 0.1` bekliyordu; ~5000px'lik
            listenin %10'u görünmeden hiçbir kart çıkmıyor, ilk ekran boş
            kalıyordu. */}
        <section className="mx-auto max-w-6xl pb-24">
          <div className="space-y-12">
            {quizzesBySaga.map(({ saga, quizzes }) => (
              <motion.div
                key={saga.slug}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '0px 0px -10% 0px' }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-1 h-8 rounded-full bg-gradient-to-b from-gold to-gold/30" />
                  <h2 className="text-xl font-bold text-pirate-text">{saga.name} Saga</h2>
                  <span className="chip eyebrow">{quizzes.length} quiz</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {quizzes.map(({ arc, quiz, arcSlug }) => {
                    const img = getArcImage(arcSlug)
                    const mine = best?.[arcSlug]
                    const perfect = mine ? mine.score === mine.totalQ : false
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
                              sizes="(min-width: 1024px) 22rem, (min-width: 640px) 50vw, 100vw"
                            />
                          ) : (
                            <div className="w-full h-full bg-ocean-elevated" />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-ocean-deep/90 via-ocean-deep/40 to-transparent" />

                          {/* Question count badge */}
                          <div className="absolute top-3 right-3 glass eyebrow rounded-lg px-2 py-1.5 text-pirate-text">
                            {quiz.questions.length} soru
                          </div>

                          {/* Kendi en iyi skorun */}
                          {mine && (
                            <div
                              className={`absolute top-3 left-3 inline-flex items-center gap-1 rounded-lg border px-2 py-1.5 text-xs font-semibold backdrop-blur-md ${
                                perfect
                                  ? 'border-gold/40 bg-ocean-deep/80 text-gold'
                                  : 'border-haki/30 bg-ocean-deep/80 text-haki'
                              }`}
                            >
                              <CheckCircle className="h-3.5 w-3.5" />
                              En İyi <span className="font-mono">{mine.score}/{mine.totalQ}</span>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-4">
                          <h3 className="text-sm font-bold text-pirate-text group-hover:text-gold transition-colors line-clamp-1">
                            {arc.name}
                          </h3>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-pirate-muted">
                              <span className="font-mono">{arc.episodes?.length ?? 0}</span> bölüm
                            </span>
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-pirate-muted group-hover:text-gold transition-colors">
                              {mine ? 'Tekrar Oyna' : 'Başla'}
                              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        </section>
        </div>
      </main>
  )
}
