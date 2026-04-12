import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { DEVIL_FRUITS, getDevilFruitBySlug } from '@/lib/constants/devil-fruits'
import DevilFruitDetailClient from '@/components/devil-fruits/DevilFruitDetail'

type Props = {
  params: { slug: string }
}

export function generateStaticParams() {
  return DEVIL_FRUITS.map((df) => ({ slug: df.slug }))
}

export function generateMetadata({ params }: Props): Metadata {
  const df = getDevilFruitBySlug(params.slug)
  if (!df) return { title: 'Şeytan Meyvesi Bulunamadı' }
  return {
    title: `${df.name} — Şeytan Meyvesi`,
    description: df.description,
  }
}

export default function DevilFruitDetailPage({ params }: Props) {
  const df = getDevilFruitBySlug(params.slug)
  if (!df) notFound()

  return <DevilFruitDetailClient fruit={df} />
}
