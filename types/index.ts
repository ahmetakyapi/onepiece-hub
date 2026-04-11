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
  pixeldrainId?: string
}

export type Character = {
  name: string
  slug: string
  image: string
  crew: CrewType
  epithet?: string
  bounty?: string
  devilFruit?: string
  description: string
  backstory: string
  role: string
  age?: string
  height?: string
  origin?: string
  firstArc: string // arc slug
  appearances: string[] // arc slugs where they appear
  abilities: string[]
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
