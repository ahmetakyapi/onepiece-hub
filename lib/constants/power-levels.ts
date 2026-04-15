/**
 * Karakter Güç Seviyeleri
 * Her stat 0-100 arasında. Güç sıralaması ve karşılaştırma için kullanılır.
 */

export interface PowerStats {
  slug: string
  overall: number
  stats: {
    strength: number
    speed: number
    haki: number
    devilFruit: number
    intelligence: number
    endurance: number
  }
}

export const STAT_LABELS: Record<string, { label: string; color: string }> = {
  strength: { label: 'Güç', color: '#e74c3c' },
  speed: { label: 'Hız', color: '#1e90ff' },
  haki: { label: 'Haki', color: '#a855f7' },
  devilFruit: { label: 'Şeytan Meyvesi', color: '#f4a300' },
  intelligence: { label: 'Zeka', color: '#22c55e' },
  endurance: { label: 'Dayanıklılık', color: '#f97316' },
}

export const POWER_LEVELS: PowerStats[] = [
  { slug: 'luffy', overall: 97, stats: { strength: 98, speed: 92, haki: 96, devilFruit: 99, intelligence: 65, endurance: 98 } },
  { slug: 'zoro', overall: 92, stats: { strength: 95, speed: 88, haki: 90, devilFruit: 0, intelligence: 60, endurance: 96 } },
  { slug: 'sanji', overall: 88, stats: { strength: 88, speed: 94, haki: 82, devilFruit: 0, intelligence: 80, endurance: 85 } },
  { slug: 'jinbe', overall: 86, stats: { strength: 90, speed: 78, haki: 84, devilFruit: 0, intelligence: 82, endurance: 90 } },
  { slug: 'robin', overall: 78, stats: { strength: 70, speed: 65, haki: 55, devilFruit: 85, intelligence: 98, endurance: 72 } },
  { slug: 'franky', overall: 76, stats: { strength: 85, speed: 60, haki: 0, devilFruit: 0, intelligence: 95, endurance: 88 } },
  { slug: 'brook', overall: 74, stats: { strength: 72, speed: 85, haki: 45, devilFruit: 70, intelligence: 75, endurance: 65 } },
  { slug: 'nami', overall: 62, stats: { strength: 30, speed: 55, haki: 40, devilFruit: 0, intelligence: 95, endurance: 50 } },
  { slug: 'usopp', overall: 58, stats: { strength: 35, speed: 60, haki: 50, devilFruit: 0, intelligence: 88, endurance: 45 } },
  { slug: 'chopper', overall: 65, stats: { strength: 75, speed: 60, haki: 30, devilFruit: 70, intelligence: 90, endurance: 65 } },
  { slug: 'shanks', overall: 98, stats: { strength: 96, speed: 95, haki: 100, devilFruit: 0, intelligence: 92, endurance: 95 } },
  { slug: 'kaido', overall: 99, stats: { strength: 100, speed: 85, haki: 97, devilFruit: 98, intelligence: 70, endurance: 100 } },
  { slug: 'big-mom', overall: 96, stats: { strength: 98, speed: 75, haki: 95, devilFruit: 96, intelligence: 78, endurance: 98 } },
  { slug: 'blackbeard', overall: 95, stats: { strength: 92, speed: 72, haki: 88, devilFruit: 100, intelligence: 90, endurance: 90 } },
  { slug: 'mihawk', overall: 95, stats: { strength: 97, speed: 92, haki: 94, devilFruit: 0, intelligence: 85, endurance: 92 } },
  { slug: 'akainu', overall: 94, stats: { strength: 92, speed: 80, haki: 90, devilFruit: 98, intelligence: 85, endurance: 95 } },
  { slug: 'aokiji', overall: 93, stats: { strength: 88, speed: 82, haki: 88, devilFruit: 96, intelligence: 88, endurance: 90 } },
  { slug: 'law', overall: 88, stats: { strength: 78, speed: 82, haki: 80, devilFruit: 98, intelligence: 95, endurance: 80 } },
  { slug: 'ace', overall: 85, stats: { strength: 85, speed: 85, haki: 82, devilFruit: 90, intelligence: 72, endurance: 80 } },
  { slug: 'sabo', overall: 90, stats: { strength: 90, speed: 88, haki: 88, devilFruit: 88, intelligence: 82, endurance: 85 } },
  { slug: 'garp', overall: 96, stats: { strength: 98, speed: 85, haki: 95, devilFruit: 0, intelligence: 80, endurance: 97 } },
  { slug: 'whitebeard', overall: 99, stats: { strength: 100, speed: 78, haki: 98, devilFruit: 100, intelligence: 82, endurance: 95 } },
  { slug: 'doflamingo', overall: 88, stats: { strength: 84, speed: 85, haki: 85, devilFruit: 92, intelligence: 92, endurance: 82 } },
]
