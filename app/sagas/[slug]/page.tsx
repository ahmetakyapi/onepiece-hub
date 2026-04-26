import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SAGAS } from '@/lib/constants/sagas'
import { ARCS, getArcBySlug } from '@/lib/constants/arcs'
import { CHARACTERS } from '@/lib/constants/characters'
import { SAGA_META } from '@/lib/constants/saga-meta'
import SagaDetail, { type SagaDetailData } from '@/components/sagas/SagaDetail'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  return SAGAS.map((saga) => ({ slug: saga.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params
  const saga = SAGAS.find((s) => s.slug === slug)
  if (!saga) return { title: 'Saga Bulunamadı' }

  const meta = SAGA_META[slug]
  return {
    title: saga.name,
    description: meta?.description ?? `${saga.name} sagası, arc'lar ve karakterler.`,
  }
}

export default function SagaPage({ params }: Props) {
  const { slug } = params
  const saga = SAGAS.find((s) => s.slug === slug)
  if (!saga) notFound()

  const meta = SAGA_META[slug]

  // Build arc list with details
  const arcs = saga.arcs
    .map((arcSlug) => getArcBySlug(arcSlug))
    .filter((a): a is NonNullable<typeof a> => Boolean(a))

  const totalEpisodes = arcs.reduce((sum, a) => sum + a.episodeCount, 0)

  // Characters who debuted in this saga
  const sagaArcSlugs = new Set(saga.arcs)
  const debutCharacters = CHARACTERS.filter((c) => sagaArcSlugs.has(c.firstArc))

  // Aggregate themes (unique)
  const themesSet = new Set<string>()
  for (const arc of arcs) {
    for (const theme of arc.themes ?? []) themesSet.add(theme)
  }
  const themes = Array.from(themesSet).slice(0, 8)

  // Key events aggregated (first 12 across arcs)
  const keyEvents: { arcName: string; arcSlug: string; event: string }[] = []
  for (const arc of arcs) {
    for (const event of arc.keyEvents ?? []) {
      keyEvents.push({ arcName: arc.name, arcSlug: arc.slug, event })
    }
  }

  // Saga index for previous/next navigation
  const sagaIndex = SAGAS.findIndex((s) => s.slug === slug)
  const prevSaga = sagaIndex > 0 ? SAGAS[sagaIndex - 1] : null
  const nextSaga = sagaIndex < SAGAS.length - 1 ? SAGAS[sagaIndex + 1] : null

  const data: SagaDetailData = {
    index: sagaIndex + 1,
    totalSagas: SAGAS.length,
    name: saga.name,
    slug: saga.slug,
    tagline: meta?.tagline ?? '',
    description: meta?.description ?? '',
    era: meta?.era ?? '',
    accent: meta?.accent ?? 'sea',
    iconEmoji: meta?.iconEmoji ?? '🏴‍☠️',
    featuredArcSlug: meta?.featuredArc ?? saga.arcs[0],
    arcs: arcs.map((a) => ({
      slug: a.slug,
      name: a.name,
      episodeCount: a.episodeCount,
      summary: a.summary,
      themes: a.themes ?? [],
      cover: a.cover,
      location: a.location,
    })),
    totalEpisodes,
    themes,
    keyEvents: keyEvents.slice(0, 12),
    debutCharacters: debutCharacters.slice(0, 12).map((c) => ({
      slug: c.slug,
      name: c.name,
      epithet: c.epithet,
      firstArc: c.firstArc,
      image: c.image,
    })),
    prevSaga: prevSaga ? { slug: prevSaga.slug, name: prevSaga.name } : null,
    nextSaga: nextSaga ? { slug: nextSaga.slug, name: nextSaga.name } : null,
  }

  return <SagaDetail data={data} />
}
