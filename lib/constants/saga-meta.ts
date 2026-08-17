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
    text: 'text-accent-cyan',
    hoverText: 'group-hover:text-accent-cyan',
    border: 'border-accent-cyan/30',
    bg: 'bg-accent-cyan/10',
    glow: 'bg-accent-cyan/[0.12]',
    gradient: 'from-accent-cyan/20 via-ocean-surface/40 to-ocean-deep',
  },
  amber: {
    text: 'text-accent-amber',
    hoverText: 'group-hover:text-accent-amber',
    border: 'border-accent-amber/30',
    bg: 'bg-accent-amber/10',
    glow: 'bg-accent-amber/[0.12]',
    gradient: 'from-accent-amber/20 via-ocean-surface/40 to-ocean-deep',
  },
  indigo: {
    text: 'text-accent-indigo',
    hoverText: 'group-hover:text-accent-indigo',
    border: 'border-accent-indigo/30',
    bg: 'bg-accent-indigo/10',
    glow: 'bg-accent-indigo/[0.12]',
    gradient: 'from-accent-indigo/20 via-ocean-surface/40 to-ocean-deep',
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
    text: 'text-fruit',
    hoverText: 'group-hover:text-fruit',
    border: 'border-fruit-strong/30',
    bg: 'bg-fruit-strong/10',
    glow: 'bg-fruit-strong/[0.12]',
    gradient: 'from-fruit-strong/20 via-ocean-surface/40 to-ocean-deep',
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
    text: 'text-accent-emerald',
    hoverText: 'group-hover:text-accent-emerald',
    border: 'border-accent-emerald/30',
    bg: 'bg-accent-emerald/10',
    glow: 'bg-accent-emerald/[0.12]',
    gradient: 'from-accent-emerald/20 via-ocean-surface/40 to-ocean-deep',
  },
  pink: {
    text: 'text-accent-pink',
    hoverText: 'group-hover:text-accent-pink',
    border: 'border-accent-pink/30',
    bg: 'bg-accent-pink/10',
    glow: 'bg-accent-pink/[0.12]',
    gradient: 'from-accent-pink/20 via-ocean-surface/40 to-ocean-deep',
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
    text: 'text-accent-rose',
    hoverText: 'group-hover:text-accent-rose',
    border: 'border-accent-rose/30',
    bg: 'bg-accent-rose/10',
    glow: 'bg-accent-rose/[0.12]',
    gradient: 'from-accent-rose/20 via-ocean-surface/40 to-ocean-deep',
  },
}
