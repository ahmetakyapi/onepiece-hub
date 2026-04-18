import {
  Compass, Users, BookOpen, Map, BrainCircuit,
  Cherry, Shield, Globe, Anchor, Swords,
  Trophy, Clock, Scroll,
} from 'lucide-react'

export const MAIN_LINKS = [
  { label: 'Keşfet', href: '/explore', icon: Compass },
  { label: 'Arc\'lar', href: '/arcs', icon: Scroll },
  { label: 'Karakterler', href: '/characters', icon: Users },
  { label: 'Rehber', href: '/guide', icon: Map },
] as const

export const WIKI_LINKS = [
  { label: 'Şeytan Meyveleri', href: '/devil-fruits', icon: Cherry, desc: 'Tüm meyveler ve güçleri' },
  { label: 'Haki Rehberi', href: '/haki', icon: Shield, desc: 'Üç Haki türü detaylı' },
  { label: 'Dünya Haritası', href: '/world', icon: Globe, desc: 'Denizler ve lokasyonlar' },
  { label: 'Organizasyonlar', href: '/crews', icon: Anchor, desc: 'Mürettebat ve gruplar' },
  { label: 'Efsanevi Savaşlar', href: '/battles', icon: Swords, desc: 'İkonik dövüşler' },
  { label: 'Ödül Sıralaması', href: '/bounties', icon: Trophy, desc: 'Bounty leaderboard' },
  { label: 'Güç Sıralaması', href: '/power', icon: Swords, desc: 'Karakter güç seviyeleri' },
  { label: 'Zaman Çizelgesi', href: '/timeline', icon: Clock, desc: 'Kronolojik tarih' },
] as const

export const FOOTER_SECTIONS = [
  {
    title: 'Keşfet',
    links: [
      { label: 'Keşfet Sayfası', href: '/explore', icon: Compass },
      { label: 'Arc\'lar', href: '/arcs', icon: Scroll },
      { label: 'Karakterler', href: '/characters', icon: Users },
      { label: 'İzleme Rehberi', href: '/guide', icon: Map },
      { label: 'Ödül Sıralaması', href: '/bounties', icon: Trophy },
    ],
  },
  {
    title: 'Ansiklopedi',
    links: [
      { label: 'Şeytan Meyveleri', href: '/devil-fruits', icon: Cherry },
      { label: 'Haki Rehberi', href: '/haki', icon: Shield },
      { label: 'Dünya Haritası', href: '/world', icon: Globe },
      { label: 'Organizasyonlar', href: '/crews', icon: Anchor },
    ],
  },
  {
    title: 'Daha Fazla',
    links: [
      { label: 'Zaman Çizelgesi', href: '/timeline', icon: Clock },
      { label: 'Wanted Poster', href: '/wanted-poster', icon: Scroll },
      { label: 'Hakkında', href: '/about', icon: BookOpen },
    ],
  },
] as const
