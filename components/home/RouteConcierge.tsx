'use client'

import { motion, useInView } from 'framer-motion'
import {
  ArrowRight,
  BookOpen,
  Compass,
  Crown,
  Map,
  Sparkles,
  Swords,
  TimerReset,
} from 'lucide-react'
import Link from 'next/link'
import { useRef } from 'react'
import { SITE_STATS } from '@/lib/constants/stats'

import { EASE } from '@/lib/variants'

const ROUTES = [
  {
    icon: Compass,
    title: 'İlk Yolculuk',
    eyebrow: 'Başlangıç',
    desc: 'East Blue’dan itibaren ana hikayeyi temiz, sıralı ve spoilersız bir akışla takip et.',
    href: '/guide',
    cta: 'Rehberi aç',
    meta: '36 arc rotası',
    accent: 'text-gold',
    border: 'border-gold/25',
    bg: 'from-gold/[0.12] to-gold/[0.03]',
  },
  {
    icon: TimerReset,
    title: 'Kaldığın Yerden',
    eyebrow: 'Devam et',
    desc: 'Saga özetleri ve kritik dönemeçlerle hikayeye ritmini kaybetmeden geri dön.',
    href: '/timeline',
    cta: 'Özetleri gör',
    meta: '25+ dönüm noktası',
    accent: 'text-sea-light',
    border: 'border-sea/25',
    bg: 'from-sea/[0.12] to-sea/[0.03]',
  },
  {
    icon: Crown,
    title: 'Güç Analizi',
    eyebrow: 'Kıyas',
    desc: 'Karakter seviyelerini, teknikleri ve unutulmaz düelloları aynı ölçekte incele.',
    href: '/power',
    cta: 'Analize git',
    meta: 'tier sistemi',
    accent: 'text-luffy',
    border: 'border-luffy/25',
    bg: 'from-luffy/[0.12] to-luffy/[0.03]',
  },
  {
    icon: BookOpen,
    title: 'Evren Arşivi',
    eyebrow: 'Derin okuma',
    desc: 'Meyveler, Haki, mürettebatlar ve dünya haritası arasındaki büyük bağlantıları keşfet.',
    href: '/explore',
    cta: 'Arşivi keşfet',
    meta: 'wiki seçkisi',
    accent: 'text-accent-emerald',
    border: 'border-accent-emerald/25',
    bg: 'from-accent-emerald/[0.12] to-accent-emerald/[0.03]',
  },
] as const

const HIGHLIGHTS = [
  { icon: Map, label: 'Düzenli akış', value: `${SITE_STATS.episodes} bölüm` },
  { icon: Swords, label: 'Karakter arşivi', value: `${SITE_STATS.characters} profil` },
  { icon: Sparkles, label: 'Seçilmiş rotalar', value: '4 başlangıç' },
] as const

export default function RouteConcierge() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="relative z-10 px-6 pb-14 pt-4 sm:pb-20 sm:pt-2">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between"
        >
          <div className="max-w-3xl">
            <p className="eyebrow-lg mb-3 text-gold/70">
              Seyir Masası
            </p>
            <h2 className="font-display max-w-[760px] text-balance text-2xl font-extrabold leading-tight text-pirate-text sm:text-3xl lg:text-4xl">
              <span className="block">One Piece yolculuğunu</span>
              <span className="block text-gold-gradient">daha net bir rotaya bağla</span>
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-pirate-muted sm:text-base">
              Nereden başlayacağını, hangi özetle geri döneceğini ya da hangi arşive dalacağını tek bakışta seç. Kalabalığı azalttık; hikayenin tadı ve keşif hissi sende kalsın.
            </p>
          </div>

          <div className="grid gap-2 sm:grid-cols-3 md:min-w-[420px]">
            {HIGHLIGHTS.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, ease: EASE, delay: 0.12 + i * 0.06 }}
                className="rounded-xl border border-pirate-border/20 bg-ocean-surface/35 px-3 py-2.5"
              >
                <div className="eyebrow mb-1 flex items-center gap-1.5 text-pirate-muted/70">
                  <item.icon className="h-3 w-3 text-gold/70" />
                  {item.label}
                </div>
                <p className="font-display text-sm font-extrabold text-pirate-text">{item.value}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {ROUTES.map((route, i) => (
            <motion.div
              key={route.href}
              initial={{ opacity: 0, y: 26 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: EASE, delay: 0.18 + i * 0.07 }}
            >
              <Link
                href={route.href}
                className={`group relative flex h-full min-h-[250px] flex-col overflow-hidden rounded-2xl border ${route.border} bg-gradient-to-br ${route.bg} p-5 transition-all duration-500 hover:-translate-y-1 hover:bg-ocean-surface/55 hover:shadow-[0_22px_70px_rgba(2,6,23,0.38)]`}
              >
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl border ${route.border} bg-ocean-deep/35 transition-transform duration-500 group-hover:scale-105`}>
                    <route.icon className={`h-5 w-5 ${route.accent}`} />
                  </div>
                  <span className={`eyebrow rounded-full border ${route.border} bg-ocean-deep/35 px-2.5 py-1 ${route.accent}`}>
                    {route.eyebrow}
                  </span>
                </div>

                <div className="flex-1">
                  <h3 className="font-display mb-2 text-xl font-extrabold text-pirate-text transition-colors duration-300 group-hover:text-pirate-text">
                    {route.title}
                  </h3>
                  <p className="text-[13px] leading-relaxed text-pirate-muted">
                    {route.desc}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-ink/[0.06] pt-4">
                  <span className="eyebrow text-pirate-muted/60">
                    {route.meta}
                  </span>
                  <span className={`inline-flex items-center gap-1.5 text-xs font-extrabold ${route.accent}`}>
                    {route.cta}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
