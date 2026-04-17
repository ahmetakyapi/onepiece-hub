import {
  Anchor, Shield, Swords, Crown, Flame, Star, Skull, Sparkles,
} from 'lucide-react'

export const CREW_COLORS: Record<string, { border: string; bg: string; text: string; glow: string }> = {
  'straw-hat': { border: 'border-gold/30', bg: 'bg-gold/[0.06]', text: 'text-gold', glow: 'shadow-gold/10' },
  marine: { border: 'border-sea/30', bg: 'bg-sea/[0.06]', text: 'text-sea-light', glow: 'shadow-sea/10' },
  shichibukai: { border: 'border-purple-400/30', bg: 'bg-purple-500/[0.06]', text: 'text-purple-400', glow: 'shadow-purple-500/10' },
  yonko: { border: 'border-luffy/30', bg: 'bg-luffy/[0.06]', text: 'text-luffy', glow: 'shadow-luffy/10' },
  revolutionary: { border: 'border-emerald-400/30', bg: 'bg-emerald-500/[0.06]', text: 'text-emerald-400', glow: 'shadow-emerald-500/10' },
  'baroque-works': { border: 'border-amber-400/30', bg: 'bg-amber-500/[0.06]', text: 'text-amber-400', glow: 'shadow-amber-500/10' },
  cp9: { border: 'border-slate-400/30', bg: 'bg-slate-500/[0.06]', text: 'text-slate-300', glow: 'shadow-slate-500/10' },
  supernova: { border: 'border-cyan-400/30', bg: 'bg-cyan-500/[0.06]', text: 'text-cyan-400', glow: 'shadow-cyan-500/10' },
  'beast-pirates': { border: 'border-violet-400/30', bg: 'bg-violet-500/[0.06]', text: 'text-violet-400', glow: 'shadow-violet-500/10' },
  'big-mom-pirates': { border: 'border-pink-400/30', bg: 'bg-pink-500/[0.06]', text: 'text-pink-400', glow: 'shadow-pink-500/10' },
  'roger-pirates': { border: 'border-gold/30', bg: 'bg-gold/[0.06]', text: 'text-gold', glow: 'shadow-gold/10' },
  'whitebeard-pirates': { border: 'border-sky-400/30', bg: 'bg-sky-500/[0.06]', text: 'text-sky-400', glow: 'shadow-sky-500/10' },
  'red-hair-pirates': { border: 'border-red-400/30', bg: 'bg-red-500/[0.06]', text: 'text-red-400', glow: 'shadow-red-500/10' },
  ally: { border: 'border-teal-400/30', bg: 'bg-teal-500/[0.06]', text: 'text-teal-400', glow: 'shadow-teal-500/10' },
  other: { border: 'border-pirate-border/30', bg: 'bg-pirate-muted/[0.04]', text: 'text-pirate-muted', glow: 'shadow-pirate-border/10' },
}

export const CREW_RGB: Record<string, string> = {
  'straw-hat': '244,163,0',
  marine: '30,144,255',
  shichibukai: '168,139,250',
  yonko: '231,76,60',
  revolutionary: '52,211,153',
  'baroque-works': '251,191,36',
  cp9: '148,163,184',
  supernova: '34,211,238',
  'beast-pirates': '167,139,250',
  'big-mom-pirates': '244,114,182',
  'roger-pirates': '244,163,0',
  'whitebeard-pirates': '56,189,248',
  'red-hair-pirates': '239,68,68',
  ally: '45,212,191',
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
