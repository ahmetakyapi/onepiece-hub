/**
 * One Piece Hub — Başarım/Rozet Tanımları
 * Başarımlar client-side hesaplanır, DB'ye ek tablo gerekmez.
 * Kaynak verileri: izleme ilerlemesi, quiz skorları, favoriler.
 */

export type AchievementTier = 'bronze' | 'silver' | 'gold' | 'legendary'

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  tier: AchievementTier
  category: 'watching' | 'quiz' | 'exploration' | 'social'
  /** Check function receives user stats and returns whether unlocked */
  check: (stats: UserStats) => boolean
}

export interface UserStats {
  totalWatched: number
  totalArcsCompleted: number
  quizzesTaken: number
  perfectQuizzes: number
  totalQuizScore: number
  favoritesCount: number
  commentsCount: number
}

export const TIER_CONFIG: Record<AchievementTier, { label: string; color: string; bg: string; border: string; glow: string }> = {
  bronze: {
    label: 'Bronz',
    color: 'text-amber-600',
    bg: 'bg-amber-600/10',
    border: 'border-amber-600/20',
    glow: 'shadow-[0_0_12px_rgba(217,119,6,0.15)]',
  },
  silver: {
    label: 'Gümüş',
    color: 'text-gray-300',
    bg: 'bg-gray-300/10',
    border: 'border-gray-300/20',
    glow: 'shadow-[0_0_12px_rgba(209,213,219,0.15)]',
  },
  gold: {
    label: 'Altın',
    color: 'text-gold',
    bg: 'bg-gold/10',
    border: 'border-gold/25',
    glow: 'shadow-[0_0_16px_rgba(244,163,0,0.2)]',
  },
  legendary: {
    label: 'Efsanevi',
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
    border: 'border-purple-400/25',
    glow: 'shadow-[0_0_20px_rgba(147,51,234,0.2)]',
  },
}

export const ACHIEVEMENTS: Achievement[] = [
  // ─── İzleme Başarımları ────────────────────────────────────
  {
    id: 'first-episode',
    name: 'Yolculuk Başlıyor',
    description: 'İlk bölümünü izle',
    icon: '⚓',
    tier: 'bronze',
    category: 'watching',
    check: (s) => s.totalWatched >= 1,
  },
  {
    id: 'ten-episodes',
    name: 'Çaylak Denizci',
    description: '10 bölüm izle',
    icon: '🚢',
    tier: 'bronze',
    category: 'watching',
    check: (s) => s.totalWatched >= 10,
  },
  {
    id: 'fifty-episodes',
    name: 'Deneyimli Korsan',
    description: '50 bölüm izle',
    icon: '⛵',
    tier: 'silver',
    category: 'watching',
    check: (s) => s.totalWatched >= 50,
  },
  {
    id: 'hundred-episodes',
    name: 'Grand Line Gazisi',
    description: '100 bölüm izle',
    icon: '🏴‍☠️',
    tier: 'gold',
    category: 'watching',
    check: (s) => s.totalWatched >= 100,
  },
  {
    id: 'arc-complete',
    name: 'İlk Arc Tamam',
    description: 'Bir arc\'ı tamamen bitir',
    icon: '📖',
    tier: 'bronze',
    category: 'watching',
    check: (s) => s.totalArcsCompleted >= 1,
  },
  {
    id: 'five-arcs',
    name: 'Arc Avcısı',
    description: '5 arc\'ı tamamla',
    icon: '📚',
    tier: 'silver',
    category: 'watching',
    check: (s) => s.totalArcsCompleted >= 5,
  },
  {
    id: 'ten-arcs',
    name: 'Yeni Dünya Yolcusu',
    description: '10 arc\'ı tamamla',
    icon: '🗺️',
    tier: 'gold',
    category: 'watching',
    check: (s) => s.totalArcsCompleted >= 10,
  },
  {
    id: 'all-arcs',
    name: 'Korsan Kralı',
    description: 'Tüm arc\'ları tamamla',
    icon: '👑',
    tier: 'legendary',
    category: 'watching',
    check: (s) => s.totalArcsCompleted >= 30,
  },

  // ─── Quiz Başarımları ──────────────────────────────────────
  {
    id: 'first-quiz',
    name: 'Meraklı Denizci',
    description: 'İlk quizi tamamla',
    icon: '❓',
    tier: 'bronze',
    category: 'quiz',
    check: (s) => s.quizzesTaken >= 1,
  },
  {
    id: 'five-quizzes',
    name: 'Bilgi Lordu',
    description: '5 quiz tamamla',
    icon: '🧠',
    tier: 'silver',
    category: 'quiz',
    check: (s) => s.quizzesTaken >= 5,
  },
  {
    id: 'perfect-quiz',
    name: 'Mükemmel Skor',
    description: 'Bir quizde tam puan al',
    icon: '💯',
    tier: 'gold',
    category: 'quiz',
    check: (s) => s.perfectQuizzes >= 1,
  },
  {
    id: 'quiz-master',
    name: 'Quiz Ustası',
    description: '5 quizde tam puan al',
    icon: '🏆',
    tier: 'legendary',
    category: 'quiz',
    check: (s) => s.perfectQuizzes >= 5,
  },

  // ─── Keşif Başarımları ─────────────────────────────────────
  {
    id: 'first-favorite',
    name: 'İlk Nakama',
    description: 'İlk favorini ekle',
    icon: '❤️',
    tier: 'bronze',
    category: 'exploration',
    check: (s) => s.favoritesCount >= 1,
  },
  {
    id: 'ten-favorites',
    name: 'Koleksiyoncu',
    description: '10 favori ekle',
    icon: '💎',
    tier: 'silver',
    category: 'exploration',
    check: (s) => s.favoritesCount >= 10,
  },

  // ─── Sosyal Başarımlar ─────────────────────────────────────
  {
    id: 'first-comment',
    name: 'İlk Söz',
    description: 'İlk yorumunu yaz',
    icon: '💬',
    tier: 'bronze',
    category: 'social',
    check: (s) => s.commentsCount >= 1,
  },
  {
    id: 'ten-comments',
    name: 'Hikaye Anlatıcı',
    description: '10 yorum yaz',
    icon: '📝',
    tier: 'silver',
    category: 'social',
    check: (s) => s.commentsCount >= 10,
  },
]
