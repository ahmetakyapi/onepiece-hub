import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getArcBySlug, ARCS } from '@/lib/constants/arcs'
import WatchPageClient from '@/components/watch/WatchPage'

type Props = {
  params: { slug: string; episode: string }
}

export function generateStaticParams() {
  return ARCS.flatMap((arc) =>
    arc.episodes.map((ep) => ({
      slug: arc.slug,
      episode: ep.slug,
    }))
  )
}

export function generateMetadata({ params }: Props): Metadata {
  const arc = getArcBySlug(params.slug)
  if (!arc) return { title: 'Bulunamadı' }
  const episode = arc.episodes.find((e) => e.slug === params.episode)
  if (!episode) return { title: 'Bulunamadı' }
  return {
    title: `${episode.title} — ${arc.name}`,
    description: `${arc.name} arc'ından ${episode.title} bölümünü izle`,
  }
}

export default function WatchPage({ params }: Props) {
  const arc = getArcBySlug(params.slug)
  if (!arc) notFound()

  const episodeIndex = arc.episodes.findIndex((e) => e.slug === params.episode)
  if (episodeIndex === -1) notFound()

  const episode = arc.episodes[episodeIndex]
  const prevEpisode = episodeIndex > 0 ? arc.episodes[episodeIndex - 1] : null
  const nextEpisode = episodeIndex < arc.episodes.length - 1 ? arc.episodes[episodeIndex + 1] : null

  return (
    <WatchPageClient
      arc={arc}
      episode={episode}
      prevEpisode={prevEpisode}
      nextEpisode={nextEpisode}
    />
  )
}
