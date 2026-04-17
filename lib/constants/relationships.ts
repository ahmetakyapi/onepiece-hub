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

export const RELATION_CONFIG: Record<RelationType, { color: string; label: string; dash?: boolean }> = {
  nakama: { color: '#1e90ff', label: 'Nakama' },
  family: { color: '#22c55e', label: 'Aile' },
  rival: { color: '#f4a300', label: 'Rakip', dash: true },
  enemy: { color: '#e74c3c', label: 'Düşman', dash: true },
  mentor: { color: '#a855f7', label: 'Mentor' },
  ally: { color: '#60b8ff', label: 'Müttefik', dash: true },
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
