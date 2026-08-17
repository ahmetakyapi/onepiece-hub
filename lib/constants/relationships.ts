/**
 * Karakter İlişki Verileri
 * force-directed graph için kullanılır
 */

export type RelationType = 'nakama' | 'family' | 'rival' | 'enemy' | 'mentor' | 'ally'

export interface CharacterRelation {
  from: string // character slug
  to: string
  type: RelationType
  label?: string
}

/* `token` = renk değişkeninin ADI, `color` = doğrudan kullanıma hazır hâli.
   İkisi de burada tanımlı ki tek kaynak olsun: grafiğin kenarları rengi
   opaklıkla harmanlaması gerekiyor (`rgb(var(--sea) / 0.4)`) ve bunun için
   değişken adına ihtiyacı var. Daha önce bu eşleme bileşenin içinde ikinci
   kez yazılıydı ve sürüklenmeye açıktı. */
export const RELATION_CONFIG: Record<
  RelationType,
  { token: string; color: string; label: string; dash?: boolean }
> = {
  nakama: { token: '--sea', color: 'rgb(var(--sea))', label: 'Nakama' },
  family: { token: '--haki', color: 'rgb(var(--haki))', label: 'Aile' },
  rival: { token: '--gold', color: 'rgb(var(--gold))', label: 'Rakip', dash: true },
  enemy: { token: '--luffy', color: 'rgb(var(--luffy))', label: 'Düşman', dash: true },
  mentor: { token: '--fruit-strong', color: 'rgb(var(--fruit-strong))', label: 'Mentor' },
  ally: { token: '--sea-light', color: 'rgb(var(--sea-light))', label: 'Müttefik', dash: true },
}

export const CHARACTER_RELATIONS: CharacterRelation[] = [
  // Straw Hats — Nakama bonds
  { from: 'luffy', to: 'zoro', type: 'nakama' },
  { from: 'luffy', to: 'nami', type: 'nakama' },
  { from: 'luffy', to: 'usopp', type: 'nakama' },
  { from: 'luffy', to: 'sanji', type: 'nakama' },
  { from: 'luffy', to: 'chopper', type: 'nakama' },
  { from: 'luffy', to: 'robin', type: 'nakama' },
  { from: 'luffy', to: 'franky', type: 'nakama' },
  { from: 'luffy', to: 'brook', type: 'nakama' },
  { from: 'luffy', to: 'jinbe', type: 'nakama' },
  { from: 'zoro', to: 'sanji', type: 'rival', label: 'Kavgacı İkili' },

  // Luffy's family
  { from: 'luffy', to: 'garp', type: 'family', label: 'Büyükbaba' },
  { from: 'luffy', to: 'shanks', type: 'mentor', label: 'İlham Kaynağı' },
  { from: 'luffy', to: 'ace', type: 'family', label: 'Kardeşler' },
  { from: 'luffy', to: 'sabo', type: 'family', label: 'Kardeşler' },

  // Rivalries & Enemies
  { from: 'luffy', to: 'blackbeard', type: 'enemy' },
  { from: 'luffy', to: 'kaido', type: 'enemy' },
  { from: 'luffy', to: 'bigmom', type: 'enemy' },
  { from: 'luffy', to: 'akainu', type: 'enemy' },
  { from: 'luffy', to: 'law', type: 'ally', label: 'İttifak' },

  // Zoro
  { from: 'zoro', to: 'mihawk', type: 'rival', label: 'Hedef' },
  { from: 'zoro', to: 'mihawk', type: 'mentor' },

  // Sanji
  { from: 'sanji', to: 'zeff', type: 'mentor', label: 'Baba Figürü' },

  // Cross-crew
  { from: 'shanks', to: 'mihawk', type: 'rival' },
  { from: 'shanks', to: 'blackbeard', type: 'enemy' },
  { from: 'ace', to: 'blackbeard', type: 'enemy', label: 'Ölüm Düellosu' },
  { from: 'ace', to: 'whitebeard', type: 'family', label: 'Oğul-Baba' },
  { from: 'robin', to: 'aokiji', type: 'enemy' },
  { from: 'law', to: 'doflamingo', type: 'enemy', label: 'Kan Davası' },
  { from: 'law', to: 'rosinante', type: 'mentor', label: 'Kurtarıcı' },
]

/** Character nodes for the graph */
export const GRAPH_CHARACTERS = [
  'luffy', 'zoro', 'nami', 'usopp', 'sanji', 'chopper', 'robin', 'franky', 'brook', 'jinbe',
  'shanks', 'ace', 'sabo', 'garp', 'mihawk', 'blackbeard', 'law', 'kaido', 'bigmom',
  'whitebeard', 'akainu', 'aokiji', 'doflamingo', 'rosinante', 'zeff',
] as const
