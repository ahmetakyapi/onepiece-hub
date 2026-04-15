import type { MetadataRoute } from 'next'
import { ARCS } from '@/lib/constants/arcs'
import { CHARACTERS } from '@/lib/constants/characters'
import { DEVIL_FRUITS } from '@/lib/constants/devil-fruits'
import { CREWS } from '@/lib/constants/crews'
import { QUIZZES } from '@/lib/constants/quizzes'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://onepiece-hub.vercel.app'

  const staticPages = [
    '',
    '/arcs',
    '/characters',
    '/devil-fruits',
    '/crews',
    '/battles',
    '/bounties',
    '/haki',
    '/timeline',
    '/world',
    '/guide',
    '/quiz',
    '/search',
    '/about',
    '/power-ranking',
    '/wanted-poster',
  ]

  const staticEntries: MetadataRoute.Sitemap = staticPages.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: path === '' ? 1.0 : 0.8,
  }))

  const arcEntries: MetadataRoute.Sitemap = ARCS.map((arc) => ({
    url: `${baseUrl}/arcs/${arc.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const episodeEntries: MetadataRoute.Sitemap = ARCS.flatMap((arc) =>
    arc.episodes.map((ep) => ({
      url: `${baseUrl}/arcs/${arc.slug}/${ep.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    })),
  )

  const characterEntries: MetadataRoute.Sitemap = CHARACTERS.map((char) => ({
    url: `${baseUrl}/characters/${char.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const devilFruitEntries: MetadataRoute.Sitemap = DEVIL_FRUITS.map((df) => ({
    url: `${baseUrl}/devil-fruits/${df.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  const crewEntries: MetadataRoute.Sitemap = CREWS.map((crew) => ({
    url: `${baseUrl}/crews/${crew.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  const quizEntries: MetadataRoute.Sitemap = QUIZZES.map((quiz) => ({
    url: `${baseUrl}/quiz/${quiz.arcSlug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }))

  return [
    ...staticEntries,
    ...arcEntries,
    ...episodeEntries,
    ...characterEntries,
    ...devilFruitEntries,
    ...crewEntries,
    ...quizEntries,
  ]
}
