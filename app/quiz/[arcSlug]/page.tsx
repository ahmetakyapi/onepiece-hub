import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { QUIZZES, getQuizByArcSlug } from '@/lib/constants/quizzes'
import { getArcBySlug } from '@/lib/constants/arcs'
import QuizClient from '@/components/quiz/QuizClient'

type Props = {
  params: { arcSlug: string }
}

/** 32 quiz de statik veri — hepsi build-time'da üretilir */
export function generateStaticParams() {
  return QUIZZES.map((quiz) => ({ arcSlug: quiz.arcSlug }))
}

export function generateMetadata({ params }: Props): Metadata {
  const arc = getArcBySlug(params.arcSlug)
  const quiz = getQuizByArcSlug(params.arcSlug)
  if (!arc || !quiz) return { title: 'Quiz Bulunamadı' }

  return {
    title: `${arc.name} Quiz`,
    description: `${arc.name} arc'ı hakkında ${quiz.questions.length} soruluk bilgi testi. Ne kadar iyi hatırlıyorsun?`,
  }
}

export default function QuizPage({ params }: Props) {
  const quiz = getQuizByArcSlug(params.arcSlug)
  const arc = getArcBySlug(params.arcSlug)
  if (!quiz || !arc) notFound()

  return <QuizClient arcSlug={params.arcSlug} />
}
