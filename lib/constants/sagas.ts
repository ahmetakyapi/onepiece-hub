import type { Saga } from '@/types'

export const SAGAS: Saga[] = [
  {
    name: 'East Blue',
    slug: 'east-blue',
    arcs: ['romance-dawn', 'orange-town', 'syrup-village', 'baratie', 'arlong-park', 'loguetown'],
  },
  {
    name: 'Alabasta',
    slug: 'alabasta',
    arcs: ['reverse-mountain', 'whiskey-peak', 'little-garden', 'drum-island', 'arabasta'],
  },
  {
    name: 'Sky Island',
    slug: 'sky-island',
    arcs: ['jaya', 'skypiea'],
  },
  {
    name: 'Water 7',
    slug: 'water-7',
    arcs: ['long-ring-long-land', 'water-seven', 'enies-lobby', 'post-enies-lobby'],
  },
  {
    name: 'Thriller Bark',
    slug: 'thriller-bark',
    arcs: ['thriller-bark'],
  },
  {
    name: 'Summit War',
    slug: 'summit-war',
    arcs: ['sabaody-archipelago', 'amazon-lily', 'impel-down', 'marineford', 'post-war'],
  },
  {
    name: 'Fish-Man Island',
    slug: 'fish-man-island',
    arcs: ['return-to-sabaody', 'fish-man-island'],
  },
  {
    name: 'Dressrosa',
    slug: 'dressrosa',
    arcs: ['punk-hazard', 'dressrosa'],
  },
  {
    name: 'Four Emperors',
    slug: 'four-emperors',
    arcs: ['zou', 'whole-cake-island', 'reverie', 'wano'],
  },
  {
    name: 'Final',
    slug: 'final',
    arcs: ['egghead'],
  },
]
