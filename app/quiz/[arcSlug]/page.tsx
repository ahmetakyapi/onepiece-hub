'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ArrowLeft, BrainCircuit, CheckCircle,
  XCircle, Trophy, RotateCcw, Zap,
  ChevronRight, Target, Flame, Crown,
  ArrowRight
} from 'lucide-react'
import dynamic from 'next/dynamic'

const Confetti = dynamic(() => import('@/components/ui/Confetti'), { ssr: false })
import { getQuizByArcSlug } from '@/lib/constants/quizzes'
import { getArcBySlug } from '@/lib/constants/arcs'
import { EASE } from '@/lib/variants'

export default function QuizPage() {
  const { arcSlug } = useParams<{ arcSlug: string }>()
  const quiz = getQuizByArcSlug(arcSlug)
  const arc = getArcBySlug(arcSlug)

  const [currentQ, setCurrentQ] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [finished, setFinished] = useState(false)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const scoreSaved = useRef(false)

  // Quiz bittiğinde skoru DB'ye kaydet
  useEffect(() => {
    if (!finished || scoreSaved.current || !quiz) return
    scoreSaved.current = true
    fetch('/api/quiz-scores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        arcSlug,
        score,
        totalQ: quiz.questions.length,
      }),
    }).catch(() => {})
  }, [finished, arcSlug, score, quiz])

  const handleSelect = useCallback((index: number) => {
    if (showResult || !quiz) return
    setSelected(index)
    setShowResult(true)
    const correct = index === quiz.questions[currentQ].correctIndex
    if (correct) {
      setScore((s) => s + 1)
      setStreak((s) => {
        const next = s + 1
        setBestStreak((b) => Math.max(b, next))
        return next
      })
    } else {
      setStreak(0)
    }
  }, [showResult, quiz, currentQ])

  const handleNext = useCallback(() => {
    if (!quiz) return
    if (currentQ < quiz.questions.length - 1) {
      setCurrentQ((q) => q + 1)
      setSelected(null)
      setShowResult(false)
    } else {
      setFinished(true)
    }
  }, [currentQ, quiz])

  const handleRestart = useCallback(() => {
    setCurrentQ(0)
    setScore(0)
    setSelected(null)
    setShowResult(false)
    setFinished(false)
    setStreak(0)
    setBestStreak(0)
    scoreSaved.current = false
  }, [])

  if (!quiz || !arc) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <BrainCircuit className="mx-auto mb-4 h-12 w-12 text-pirate-muted" />
          <h1 className="mb-2 text-xl font-bold text-pirate-text">Quiz Bulunamadı</h1>
          <p className="mb-4 text-sm text-pirate-muted">Bu arc için henüz quiz eklenmemiş.</p>
          <Link href="/arcs" className="btn-ghost">Arc&apos;lara Dön</Link>
        </div>
      </main>
    )
  }

  const question = quiz.questions[currentQ]
  const percentage = Math.round((score / quiz.questions.length) * 100)
  const progress = ((currentQ + (showResult ? 1 : 0)) / quiz.questions.length) * 100

  const getRank = () => {
    if (percentage >= 90) return { label: 'Yonko', icon: Crown, color: 'text-gold' }
    if (percentage >= 70) return { label: 'Supernova', icon: Flame, color: 'text-sea' }
    if (percentage >= 50) return { label: 'Rookie', icon: Target, color: 'text-purple-400' }
    return { label: 'Cabin Boy', icon: Zap, color: 'text-pirate-muted' }
  }

  const OPTION_LETTERS = ['A', 'B', 'C', 'D']

  return (
    <main className="relative min-h-screen pt-24 pb-16 overflow-hidden">
      {/* Background ambient */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute top-1/4 left-1/4 h-[500px] w-[500px] rounded-full bg-purple-500/[0.04] blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-gold/[0.03] blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-2xl px-4 sm:px-6">
        {/* Top bar */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href={`/arcs/${arc.slug}`}
            className="inline-flex items-center gap-1.5 text-sm text-pirate-muted transition-colors hover:text-gold"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">{arc.name}</span>
          </Link>

          {!finished && (
            <div className="flex items-center gap-3">
              {/* Streak indicator */}
              {streak >= 2 && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center gap-1 rounded-full bg-gold/10 px-2.5 py-1 text-xs font-bold text-gold"
                >
                  <Flame className="h-3 w-3" />
                  {streak}x
                </motion.div>
              )}

              {/* Score pill */}
              <div className="flex items-center gap-1.5 rounded-full border border-pirate-border/50 bg-ocean-surface/80 px-3 py-1.5 text-xs font-semibold text-pirate-text backdrop-blur-sm">
                <Zap className="h-3 w-3 text-gold" />
                {score}/{quiz.questions.length}
              </div>
            </div>
          )}
        </div>

        <AnimatePresence mode="wait">
          {finished ? (
            /* ─── Result Screen ─── */
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="space-y-6"
            >
              {percentage >= 70 && <Confetti />}

              {/* Score card */}
              <div className="relative overflow-hidden rounded-2xl border border-pirate-border/30 bg-ocean-surface/50 p-8 text-center backdrop-blur-xl">
                {/* Decorative glow behind score */}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className={`h-40 w-40 rounded-full blur-[80px] ${percentage >= 70 ? 'bg-gold/20' : 'bg-sea/15'}`} />
                </div>

                <div className="relative">
                  {/* Rank badge */}
                  {(() => {
                    const rank = getRank()
                    return (
                      <motion.div
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1], delay: 0.2 }}
                        className="mb-5 inline-flex items-center gap-2 rounded-full border border-pirate-border/30 bg-ocean-deep/60 px-4 py-2"
                      >
                        <rank.icon className={`h-4 w-4 ${rank.color}`} />
                        <span className={`text-sm font-bold ${rank.color}`}>{rank.label}</span>
                      </motion.div>
                    )
                  })()}

                  {/* Score ring */}
                  <div className="relative mx-auto mb-6 flex h-40 w-40 items-center justify-center">
                    <svg className="h-40 w-40 -rotate-90" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(30,144,255,0.06)" strokeWidth="6" />
                      <motion.circle
                        cx="60" cy="60" r="50" fill="none"
                        stroke={percentage >= 80 ? '#f4a300' : percentage >= 50 ? '#1e90ff' : '#e74c3c'}
                        strokeWidth="6"
                        strokeLinecap="round"
                        initial={{ strokeDasharray: '0 314' }}
                        animate={{ strokeDasharray: `${(percentage / 100) * 314} 314` }}
                        transition={{ duration: 1.2, ease: EASE, delay: 0.4 }}
                      />
                    </svg>
                    <motion.span
                      className="absolute text-4xl font-extrabold text-pirate-text"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.8 }}
                    >
                      %{percentage}
                    </motion.span>
                  </div>

                  {/* Stats grid */}
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="mx-auto mb-8 grid max-w-xs grid-cols-3 gap-3"
                  >
                    <div className="rounded-xl border border-pirate-border/20 bg-ocean-deep/40 px-3 py-3">
                      <p className="text-lg font-bold text-gold stat-number">{score}</p>
                      <p className="text-[10px] text-pirate-muted">Doğru</p>
                    </div>
                    <div className="rounded-xl border border-pirate-border/20 bg-ocean-deep/40 px-3 py-3">
                      <p className="text-lg font-bold text-luffy stat-number">{quiz.questions.length - score}</p>
                      <p className="text-[10px] text-pirate-muted">Yanlış</p>
                    </div>
                    <div className="rounded-xl border border-pirate-border/20 bg-ocean-deep/40 px-3 py-3">
                      <p className="text-lg font-bold text-sea stat-number">{bestStreak}x</p>
                      <p className="text-[10px] text-pirate-muted">Seri</p>
                    </div>
                  </motion.div>

                  {/* Actions */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="flex flex-wrap justify-center gap-3"
                  >
                    <button onClick={handleRestart} className="btn-ghost">
                      <RotateCcw className="h-4 w-4" />
                      Tekrar Oyna
                    </button>
                    <Link href={`/arcs/${arc.slug}`} className="btn-gold">
                      Arc&apos;a Dön
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ) : (
            /* ─── Question Screen ─── */
            <motion.div
              key={`q-${currentQ}`}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="space-y-5"
            >
              {/* Progress + question header */}
              <div>
                {/* Progress track */}
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex-1 h-1 overflow-hidden rounded-full bg-ocean-surface">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-purple-500 to-gold"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.4, ease: EASE }}
                    />
                  </div>
                  <span className="text-xs font-mono font-medium text-pirate-muted tabular-nums">
                    {currentQ + 1}/{quiz.questions.length}
                  </span>
                </div>

                {/* Question number */}
                <div className="mb-3 flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-gold/20 text-sm font-bold text-gold">
                    {currentQ + 1}
                  </span>
                  <span className="text-xs font-medium text-pirate-muted">{arc.name}</span>
                </div>

                {/* Question text */}
                <h2 className="text-xl font-bold leading-snug text-pirate-text sm:text-2xl">
                  {question.question}
                </h2>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {question.options.map((option, i) => {
                  const isCorrect = i === question.correctIndex
                  const isSelected = i === selected
                  const isWrong = isSelected && !isCorrect

                  let cardStyle = 'border-pirate-border/40 bg-ocean-surface/30 hover:border-pirate-border hover:bg-ocean-surface/60'
                  let letterStyle = 'bg-ocean-deep/60 text-pirate-muted'
                  let iconEl = null

                  if (showResult) {
                    if (isCorrect) {
                      cardStyle = 'border-emerald-500/40 bg-emerald-500/[0.08]'
                      letterStyle = 'bg-emerald-500/20 text-emerald-400'
                      iconEl = <CheckCircle className="h-5 w-5 flex-shrink-0 text-emerald-400" />
                    } else if (isWrong) {
                      cardStyle = 'border-luffy/40 bg-luffy/[0.08]'
                      letterStyle = 'bg-luffy/20 text-luffy'
                      iconEl = <XCircle className="h-5 w-5 flex-shrink-0 text-luffy" />
                    } else {
                      cardStyle = 'border-pirate-border/20 bg-ocean-surface/20 opacity-50'
                      letterStyle = 'bg-ocean-deep/40 text-pirate-muted/50'
                    }
                  }

                  return (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, ease: EASE, delay: 0.1 + i * 0.06 }}
                      onClick={() => handleSelect(i)}
                      disabled={showResult}
                      className={`group flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-all duration-200 backdrop-blur-sm ${cardStyle}`}
                      whileHover={!showResult ? { x: 4 } : undefined}
                      whileTap={!showResult ? { scale: 0.98 } : undefined}
                    >
                      <span className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-colors ${letterStyle}`}>
                        {OPTION_LETTERS[i]}
                      </span>
                      <span className={`flex-1 text-sm font-medium ${showResult && !isCorrect && !isWrong ? 'text-pirate-muted/50' : 'text-pirate-text'}`}>
                        {option}
                      </span>
                      {iconEl}
                    </motion.button>
                  )
                })}
              </div>

              {/* Next button */}
              {showResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="flex justify-end pt-2"
                >
                  <button onClick={handleNext} className="btn-gold">
                    {currentQ < quiz.questions.length - 1 ? (
                      <>
                        Sonraki
                        <ChevronRight className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        Sonuçları Gör
                        <Trophy className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
