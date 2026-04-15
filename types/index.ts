export type Saga = {
  name: string
  slug: string
  arcs: string[] // arc slugs
}

export type Arc = {
  name: string
  slug: string
  saga: string
  cover: string
  episodeCount: number
  summary: string
  detailedSummary: string
  keyEvents: string[]
  themes: string[]
  location: string
  villain?: string
  characters: string[] // character slugs
  episodes: Episode[]
}

export type Episode = {
  number: number
  title: string
  slug: string
  duration: string // e.g. "24:30"
  summary: string
}

export type DevilFruit = {
  name: string
  type: 'Paramecia' | 'Zoan' | 'Logia' | 'Mythical Zoan' | 'Ancient Zoan' | 'Special Paramecia'
  description: string
}

export type Ability = {
  name: string
  description: string
  category?: 'Haki' | 'Şeytan Meyvesi' | 'Kılıç' | 'Fiziksel' | 'Silah' | 'Özel' | 'Bilim'
}

export type Character = {
  name: string
  slug: string
  image: string
  crew: CrewType
  epithet?: string
  bounty?: string
  devilFruit?: DevilFruit
  description: string
  backstory: string
  role: string
  age?: string
  height?: string
  origin?: string
  firstArc: string // arc slug
  appearances: string[] // arc slugs where they appear
  abilities: Ability[]
}

export type CrewType =
  | 'straw-hat'
  | 'marine'
  | 'shichibukai'
  | 'yonko'
  | 'revolutionary'
  | 'baroque-works'
  | 'cp9'
  | 'supernova'
  | 'beast-pirates'
  | 'big-mom-pirates'
  | 'roger-pirates'
  | 'whitebeard-pirates'
  | 'red-hair-pirates'
  | 'ally'
  | 'other'

export type QuizQuestion = {
  question: string
  options: [string, string, string, string]
  correctIndex: number
}

export type ArcQuiz = {
  arcSlug: string
  questions: QuizQuestion[]
}

// ─── Battle ──────────────────────────────────────────────────────────────
export type Battle = {
  name: string
  slug: string
  arc: string
  arcSlug: string
  participants: { side1: string[]; side2: string[] }
  participantSlugs?: { side1: string[]; side2: string[] }
  winner: 'side1' | 'side2' | 'draw' | 'interrupted'
  significance: string
  description: string
  keyMoments: string[]
  emotionalWeight: 1 | 2 | 3 | 4 | 5
  powerLevel: 1 | 2 | 3 | 4 | 5
  category: 'epic' | 'emotional' | 'rivalry' | 'war' | 'turning-point'
  episodes?: string
}

// ─── Devil Fruit (full entry) ────────────────────────────────────────────
export type DevilFruitEntry = {
  name: string
  slug: string
  japaneseName: string
  type: 'Paramecia' | 'Zoan' | 'Logia' | 'Mythical Zoan' | 'Ancient Zoan' | 'Special Paramecia'
  meaning: string
  description: string
  abilities: string[]
  weakness?: string
  awakening?: string
  user: string
  userSlug?: string
  status: 'active' | 'deceased' | 'unknown'
  firstAppearance: string
  image?: string
}

// ─── Location ────────────────────────────────────────────────────────────
export type Sea = {
  name: string
  slug: string
  description: string
  color: string
}

export type Location = {
  name: string
  slug: string
  sea: string
  type: 'island' | 'sea' | 'city' | 'fortress' | 'ship' | 'other'
  description: string
  significance: string[]
  relatedArcs: string[]
  relatedCharacters: string[]
  dangerLevel: 1 | 2 | 3 | 4 | 5
  image?: string
}

// ─── Crew ────────────────────────────────────────────────────────────────
export type Crew = {
  name: string
  slug: string
  japaneseName: string
  type: 'pirate' | 'marine' | 'government' | 'revolutionary' | 'other'
  captain?: string
  captainSlug?: string
  status: 'active' | 'disbanded' | 'defeated' | 'unknown'
  description: string
  history: string
  totalBounty?: string
  territory?: string[]
  notableMembers: { name: string; slug?: string; role: string }[]
  achievements: string[]
  jollyRoger?: string
  color: string
  bg: string
}

// ─── Bounty ──────────────────────────────────────────────────────────────
export type BountyEntry = {
  name: string
  bounty: string
  crew: string
  slug?: string
  epithet?: string
}
