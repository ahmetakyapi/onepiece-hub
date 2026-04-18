/**
 * Saga görsel + anlatısal metadata
 * Her saga için tema rengi, tagline, dönem bilgisi
 */

export interface SagaMeta {
  tagline: string
  description: string
  era: string
  accent: 'sea' | 'gold' | 'luffy' | 'purple' | 'emerald' | 'amber' | 'pink' | 'cyan' | 'rose' | 'indigo'
  featuredArc: string
  iconEmoji: string
}

export const SAGA_META: Record<string, SagaMeta> = {
  'east-blue': {
    tagline: 'Macera Başlıyor',
    description: 'Luffy\'nin hasır şapka yolculuğu Doğu Mavi\'de başlıyor. Mürettebatın ilk üyeleri toplanıyor, ilk düşmanlar yeniliyor.',
    era: 'Başlangıç',
    accent: 'cyan',
    featuredArc: 'arlong-park',
    iconEmoji: '🌊',
  },
  'alabasta': {
    tagline: 'Çöl Kralığı',
    description: 'Grand Line\'a giriş, ilk büyük antagonist Baroque Works, ve Alabasta\'da iç savaşa son verme mücadelesi.',
    era: 'Grand Line I',
    accent: 'amber',
    featuredArc: 'arabasta',
    iconEmoji: '🏜️',
  },
  'sky-island': {
    tagline: 'Gökyüzü Rüyası',
    description: 'Göklerde uçan adalar, kayıp Poneglyph\'ler ve Tanrı olduğunu iddia eden Enel\'e karşı destansı kozmik dövüş.',
    era: 'Grand Line II',
    accent: 'indigo',
    featuredArc: 'skypiea',
    iconEmoji: '☁️',
  },
  'water-7': {
    tagline: 'İhanet ve Kardeşlik',
    description: 'Robin\'in kurtuluşu, CP9 ile çatışma, Going Merry\'ye veda ve Enies Lobby\'de hükümete açılan savaş bayrağı.',
    era: 'Grand Line III',
    accent: 'sea',
    featuredArc: 'enies-lobby',
    iconEmoji: '⚓',
  },
  'thriller-bark': {
    tagline: 'Hayaletli Gemi',
    description: 'Gotik atmosfer, gölgelerin çalındığı lanetli bir adada Warlord Gecko Moria ile hesaplaşma.',
    era: 'Yeni Dünya Öncesi',
    accent: 'purple',
    featuredArc: 'thriller-bark',
    iconEmoji: '👻',
  },
  'summit-war': {
    tagline: 'Zirve Savaşı',
    description: 'Ace\'in kurtarma operasyonu, Impel Down firarı ve Marineford\'da Beyaz Sakal\'ın son savaşı. Bir devrin sonu.',
    era: 'Dönüm Noktası',
    accent: 'luffy',
    featuredArc: 'marineford',
    iconEmoji: '⚔️',
  },
  'fish-man-island': {
    tagline: 'Derinlerde Tarih',
    description: '2 yıllık eğitim sonrası mürettebatın yeniden birleşmesi ve Balık-İnsan ırkının geçmişiyle yüzleşme.',
    era: 'Yeni Dünya I',
    accent: 'emerald',
    featuredArc: 'fish-man-island',
    iconEmoji: '🐟',
  },
  'dressrosa': {
    tagline: 'Kuklanın Krallığı',
    description: 'Dünya Hükümeti\'nin karanlık tarafı, Donquixote Doflamingo\'nun düşürülmesi ve SMILE meyve operasyonunun çökertilmesi.',
    era: 'Yeni Dünya II',
    accent: 'pink',
    featuredArc: 'dressrosa',
    iconEmoji: '💃',
  },
  'four-emperors': {
    tagline: 'Yonko\'ya Karşı',
    description: 'Big Mom ile Whole Cake, ittifaklar ve Wano\'da Kaido\'nun düşürülüp Luffy\'nin efsanevi Gear 5 uyanışı.',
    era: 'Yeni Dünya III',
    accent: 'gold',
    featuredArc: 'wano',
    iconEmoji: '👑',
  },
  'final': {
    tagline: 'Son Saga',
    description: 'Boş Yüzyıl\'ın sırları, Egghead ve sonrası — One Piece\'in gerçek anlamına giden son yolculuk.',
    era: 'Final',
    accent: 'rose',
    featuredArc: 'egghead',
    iconEmoji: '🏴‍☠️',
  },
}

export const ACCENT_CLASSES: Record<SagaMeta['accent'], {
  text: string
  hoverText: string
  border: string
  bg: string
  glow: string
  gradient: string
}> = {
  cyan: {
    text: 'text-cyan-400',
    hoverText: 'group-hover:text-cyan-400',
    border: 'border-cyan-500/30',
    bg: 'bg-cyan-500/10',
    glow: 'bg-cyan-500/[0.12]',
    gradient: 'from-cyan-500/20 via-ocean-surface/40 to-ocean-deep',
  },
  amber: {
    text: 'text-amber-400',
    hoverText: 'group-hover:text-amber-400',
    border: 'border-amber-500/30',
    bg: 'bg-amber-500/10',
    glow: 'bg-amber-500/[0.12]',
    gradient: 'from-amber-500/20 via-ocean-surface/40 to-ocean-deep',
  },
  indigo: {
    text: 'text-indigo-400',
    hoverText: 'group-hover:text-indigo-400',
    border: 'border-indigo-500/30',
    bg: 'bg-indigo-500/10',
    glow: 'bg-indigo-500/[0.12]',
    gradient: 'from-indigo-500/20 via-ocean-surface/40 to-ocean-deep',
  },
  sea: {
    text: 'text-sea',
    hoverText: 'group-hover:text-sea',
    border: 'border-sea/30',
    bg: 'bg-sea/10',
    glow: 'bg-sea/[0.12]',
    gradient: 'from-sea/20 via-ocean-surface/40 to-ocean-deep',
  },
  purple: {
    text: 'text-purple-400',
    hoverText: 'group-hover:text-purple-400',
    border: 'border-purple-500/30',
    bg: 'bg-purple-500/10',
    glow: 'bg-purple-500/[0.12]',
    gradient: 'from-purple-500/20 via-ocean-surface/40 to-ocean-deep',
  },
  luffy: {
    text: 'text-luffy',
    hoverText: 'group-hover:text-luffy',
    border: 'border-luffy/30',
    bg: 'bg-luffy/10',
    glow: 'bg-luffy/[0.12]',
    gradient: 'from-luffy/20 via-ocean-surface/40 to-ocean-deep',
  },
  emerald: {
    text: 'text-emerald-400',
    hoverText: 'group-hover:text-emerald-400',
    border: 'border-emerald-500/30',
    bg: 'bg-emerald-500/10',
    glow: 'bg-emerald-500/[0.12]',
    gradient: 'from-emerald-500/20 via-ocean-surface/40 to-ocean-deep',
  },
  pink: {
    text: 'text-pink-400',
    hoverText: 'group-hover:text-pink-400',
    border: 'border-pink-500/30',
    bg: 'bg-pink-500/10',
    glow: 'bg-pink-500/[0.12]',
    gradient: 'from-pink-500/20 via-ocean-surface/40 to-ocean-deep',
  },
  gold: {
    text: 'text-gold',
    hoverText: 'group-hover:text-gold',
    border: 'border-gold/30',
    bg: 'bg-gold/10',
    glow: 'bg-gold/[0.12]',
    gradient: 'from-gold/20 via-ocean-surface/40 to-ocean-deep',
  },
  rose: {
    text: 'text-rose-400',
    hoverText: 'group-hover:text-rose-400',
    border: 'border-rose-500/30',
    bg: 'bg-rose-500/10',
    glow: 'bg-rose-500/[0.12]',
    gradient: 'from-rose-500/20 via-ocean-surface/40 to-ocean-deep',
  },
}
