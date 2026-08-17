import {
  Anchor, Shield, Swords, Crown, Flame, Star, Skull, Sparkles,
} from 'lucide-react'

/* Ekip kimlik paleti — 15 ekip, 15 ayrı ton. Bu bir İÇERİK skalası,
   marka sistemi değil; ama `text` alanı metin rengi olarak basıldığı
   için ham 300-400 seviye tonlar light temada okunmuyordu. Artık
   `accent-*` (belgeli içerik skalası) üzerinden temayla dönüyor.
   Ayırt edicilik korundu — çakışmayı önlemek için whitebeard sky→teal,
   ally teal→lime, red-hair red→rose'a kaydırıldı. */
export const CREW_COLORS: Record<string, { border: string; bg: string; text: string; glow: string }> = {
  'straw-hat': { border: 'border-gold/30', bg: 'bg-gold/[0.06]', text: 'text-gold', glow: 'shadow-gold/10' },
  marine: { border: 'border-sea/30', bg: 'bg-sea/[0.06]', text: 'text-sea-light', glow: 'shadow-sea/10' },
  shichibukai: { border: 'border-fruit/30', bg: 'bg-fruit-strong/[0.06]', text: 'text-fruit', glow: 'shadow-fruit-strong/10' },
  yonko: { border: 'border-luffy/30', bg: 'bg-luffy/[0.06]', text: 'text-luffy', glow: 'shadow-luffy/10' },
  revolutionary: { border: 'border-accent-emerald/30', bg: 'bg-accent-emerald/[0.06]', text: 'text-accent-emerald', glow: 'shadow-accent-emerald/10' },
  'baroque-works': { border: 'border-accent-amber/30', bg: 'bg-accent-amber/[0.06]', text: 'text-accent-amber', glow: 'shadow-accent-amber/10' },
  cp9: { border: 'border-accent-silver/30', bg: 'bg-accent-silver/[0.06]', text: 'text-accent-silver', glow: 'shadow-accent-silver/10' },
  supernova: { border: 'border-accent-cyan/30', bg: 'bg-accent-cyan/[0.06]', text: 'text-accent-cyan', glow: 'shadow-accent-cyan/10' },
  'beast-pirates': { border: 'border-accent-indigo/30', bg: 'bg-accent-indigo/[0.06]', text: 'text-accent-indigo', glow: 'shadow-accent-indigo/10' },
  'big-mom-pirates': { border: 'border-accent-pink/30', bg: 'bg-accent-pink/[0.06]', text: 'text-accent-pink', glow: 'shadow-accent-pink/10' },
  'roger-pirates': { border: 'border-gold/30', bg: 'bg-gold/[0.06]', text: 'text-gold', glow: 'shadow-gold/10' },
  'whitebeard-pirates': { border: 'border-accent-teal/30', bg: 'bg-accent-teal/[0.06]', text: 'text-accent-teal', glow: 'shadow-accent-teal/10' },
  'red-hair-pirates': { border: 'border-accent-rose/30', bg: 'bg-accent-rose/[0.06]', text: 'text-accent-rose', glow: 'shadow-accent-rose/10' },
  ally: { border: 'border-accent-lime/30', bg: 'bg-accent-lime/[0.06]', text: 'text-accent-lime', glow: 'shadow-accent-lime/10' },
  other: { border: 'border-pirate-border/30', bg: 'bg-pirate-muted/[0.04]', text: 'text-pirate-muted', glow: 'shadow-pirate-border/10' },
}

export const CREW_RGB: Record<string, string> = {
  'straw-hat': '244,163,0',
  marine: '30,144,255',
  shichibukai: '168,139,250',
  yonko: '231,76,60',
  revolutionary: '52,211,153',
  'baroque-works': '251,191,36',
  cp9: '209,213,219',
  supernova: '34,211,238',
  'beast-pirates': '129,140,248',
  'big-mom-pirates': '244,114,182',
  'roger-pirates': '244,163,0',
  'whitebeard-pirates': '45,212,191',
  'red-hair-pirates': '251,113,133',
  ally: '74,222,128',
  other: '148,163,184',
}

export const CREW_ICONS: Record<string, typeof Skull> = {
  'straw-hat': Anchor,
  marine: Shield,
  shichibukai: Swords,
  yonko: Crown,
  revolutionary: Flame,
  supernova: Star,
  'beast-pirates': Skull,
  'big-mom-pirates': Sparkles,
}
