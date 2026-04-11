import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getArcBySlug, ARCS } from '@/lib/constants/arcs'
import ArcDetailClient from '@/components/arcs/ArcDetail'

type Props = {
  params: { slug: string }
}

export function generateStaticParams() {
  return ARCS.map((arc) => ({ slug: arc.slug }))
}

export function generateMetadata({ params }: Props): Metadata {
  const arc = getArcBySlug(params.slug)
  if (!arc) return { title: 'Arc Bulunamadı' }
  return {
    title: arc.name,
    description: arc.summary,
  }
}

export default function ArcDetailPage({ params }: Props) {
  const arc = getArcBySlug(params.slug)
  if (!arc) notFound()

  return <ArcDetailClient arc={arc} />
}
