import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { CREWS, getCrewBySlug } from '@/lib/constants/crews'
import CrewDetailClient from '@/components/crews/CrewDetail'

type Props = {
  params: { slug: string }
}

export function generateStaticParams() {
  return CREWS.map((c) => ({ slug: c.slug }))
}

export function generateMetadata({ params }: Props): Metadata {
  const crew = getCrewBySlug(params.slug)
  if (!crew) return { title: 'Mürettebat Bulunamadı' }
  return {
    title: `${crew.name}`,
    description: crew.description,
  }
}

export default function CrewDetailPage({ params }: Props) {
  const crew = getCrewBySlug(params.slug)
  if (!crew) notFound()

  return <CrewDetailClient crew={crew} />
}
