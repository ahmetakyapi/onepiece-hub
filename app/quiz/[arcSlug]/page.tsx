'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ArrowLeft, BrainCircuit, CheckCircle,
  XCircle, Trophy, RotateCcw
} from 'lucide-react'
import dynamic from 'next/dynamic'

const Confetti = dynamic(() => import('@/components/ui/Confetti'), { ssr: false })
import { getQuizByArcSlug } from '@/lib/constants/quizzes'
import { getArcBySlug } from '@/lib/constants/arcs'
import { fadeUp, staggerContainer, EASE } from '@/lib/variants'

export default function QuizPage() {
  const { arcSlug } = useParams<{ arcSlug: string }>()
  const quiz = getQuizByArcSlug(arcSlug)
  const arc = getArcBySlug(arcSlug)

  const [currentQ, setCurrentQ] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [finished, setFinished] = useState(false)
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
    }).catch(() => {}) // Sessizce başarısız ol — login olmayan kullanıcılar için
  }, [finished, arcSlug, score, quiz])

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

  const handleSelect = (index: number) => {
    if (showResult) return
    setSelected(index)
    setShowResult(true)
    if (index === question.correctIndex) {
      setScore((s) => s + 1)
    }
  }

  const handleNext = () => {
    if (currentQ < quiz.questions.length - 1) {
      setCurrentQ((q) => q + 1)
      setSelected(null)
      setShowResult(false)
    } else {
      setFinished(true)
    }
  }

  const handleRestart = () => {
    setCurrentQ(0)
    setScore(0)
    setSelected(null)
    setShowResult(false)
    setFinished(false)
  }

  const percentage = Math.round((score / quiz.questions.length) * 100)

  return (
      <main className="relative min-h-screen pt-24">
        <div className="mx-auto max-w-2xl px-6">
          {/* Back */}
          <Link
            href={`/arcs/${arc.slug}`}
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-pirate-muted transition-colors hover:text-gold"
          >
            <ArrowLeft className="h-4 w-4" />
            {arc.name}
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="mb-2 text-2xl font-extrabold text-pirate-text">
              <span className="text-gold-gradient">{arc.name}</span> Quiz
            </h1>
            {!finished && (
              <div className="flex items-center gap-3">
                <div className="progress-bar flex-1">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${((currentQ + 1) / quiz.questions.length) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-pirate-muted">
                  {currentQ + 1}/{quiz.questions.length}
                </span>
              </div>
            )}
          </div>

          <AnimatePresence mode="wait">
            {finished ? (
              /* Result */
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="bento-card p-8 text-center"
              >
                {percentage >= 70 && <Confetti />}
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1], delay: 0.2 }}
                >
                  <Trophy className={`mx-auto mb-4 h-16 w-16 ${percentage >= 80 ? 'text-gold' : percentage >= 50 ? 'text-sea' : 'text-luffy'}`} />
                </motion.div>
                <h2 className="mb-2 text-2xl font-extrabold text-pirate-text">
                  {percentage >= 80 ? 'Harika!' : percentage >= 50 ? 'İyi İş!' : 'Tekrar Dene!'}
                </h2>
                <p className="mb-6 text-pirate-muted">
                  {quiz.questions.length} sorudan <span className="font-bold text-gold">{score}</span> tanesini doğru bildin.
                </p>

                {/* Score ring — animated */}
                <div className="relative mx-auto mb-8 flex h-36 w-36 items-center justify-center">
                  <svg className="h-36 w-36 -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(30,144,255,0.08)" strokeWidth="8" />
                    <motion.circle
                      cx="60" cy="60" r="52" fill="none"
                      stroke={percentage >= 80 ? '#f4a300' : percentage >= 50 ? '#1e90ff' : '#e74c3c'}
                      strokeWidth="8"
                      strokeLinecap="round"
                      initial={{ strokeDasharray: '0 327' }}
                      animate={{ strokeDasharray: `${(percentage / 100) * 327} 327` }}
                      transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
                    />
                  </svg>
                  <motion.span
                    className="absolute text-3xl font-extrabold text-pirate-text"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                  >
                    %{percentage}
                  </motion.span>
                </div>

                <div className="flex flex-wrap justify-center gap-3">
                  <button onClick={handleRestart} className="btn-ghost">
                    <RotateCcw className="h-4 w-4" />
                    Tekrar Oyna
                  </button>
                  <Link href={`/arcs/${arc.slug}`} className="btn-gold">
                    Arc&apos;a Dön
                  </Link>
                </div>
              </motion.div>
            ) : (
              /* Question */
              <motion.div
                key={currentQ}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="bento-card p-6"
              >
                <h2 className="mb-6 text-lg font-bold text-pirate-text">
                  {question.question}
                </h2>

                <div className="space-y-3">
                  {question.options.map((option, i) => {
                    let optionClass = 'border-pirate-border bg-ocean-surface/50 text-pirate-text hover:border-gold/30 hover:bg-ocean-surface/80'
                    if (showResult) {
                      if (i === question.correctIndex) {
                        optionClass = 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
                      } else if (i === selected && i !== question.correctIndex) {
                        optionClass = 'border-luffy/50 bg-luffy/10 text-luffy'
                      } else {
                        optionClass = 'border-pirate-border/50 bg-ocean-surface/30 text-pirate-muted'
                      }
                    }

                    return (
                      <motion.button
                        key={i}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, ease: EASE, delay: i * 0.08 }}
                        onClick={() => handleSelect(i)}
                        disabled={showResult}
                        className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-sm font-medium transition-all ${optionClass}`}
                        whileHover={!showResult ? { scale: 1.01 } : undefined}
                        whileTap={!showResult ? { scale: 0.98 } : undefined}
                      >
                        <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-ocean-deep text-xs font-bold">
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span className="flex-1">{option}</span>
                        {showResult && i === question.correctIndex && (
                          <CheckCircle className="h-5 w-5 text-emerald-400" />
                        )}
                        {showResult && i === selected && i !== question.correctIndex && (
                          <XCircle className="h-5 w-5 text-luffy" />
                        )}
                      </motion.button>
                    )
                  })}
                </div>

                {showResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 flex justify-end"
                  >
                    <button onClick={handleNext} className="btn-gold">
                      {currentQ < quiz.questions.length - 1 ? 'Sonraki Soru' : 'Sonuçları Gör'}
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-16" />
      </main>
  )
}
