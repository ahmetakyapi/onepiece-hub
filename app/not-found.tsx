'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Home, Compass, Map, Anchor } from 'lucide-react'
import { fadeUp, staggerContainer } from '@/lib/variants'
import SpeechBubble from '@/components/ui/SpeechBubble'

const QUICK_LINKS = [
  { label: 'Ana Sayfa', href: '/', icon: Home, desc: 'Maceraya geri dön' },
  { label: "Arc'lar", href: '/arcs', icon: Compass, desc: 'Tüm hikaye yayları' },
  { label: 'Karakterler', href: '/characters', icon: Anchor, desc: '65 karakter' },
  { label: 'Dünya Haritası', href: '/world', icon: Map, desc: 'Grand Line' },
]

export default function NotFound() {
  return (
    <main className="relative min-h-screen flex items-center justify-center px-4 py-24 overflow-hidden">
      <div className="orb absolute w-[360px] h-[360px] rounded-full blur-[140px] opacity-25" style={{ background: 'rgba(244, 163, 0, 0.5)', top: '6%', left: '8%' }} />
      <div className="orb absolute w-[280px] h-[280px] rounded-full blur-[120px] opacity-20" style={{ background: 'rgba(231, 76, 60, 0.35)', bottom: '12%', right: '10%' }} />

      <motion.div
        variants={staggerContainer(0.1)}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto max-w-4xl text-center"
      >
        <motion.div variants={fadeUp} className="manga-grid manga-grid-action mb-10 shadow-2xl">
          <div className="manga-panel manga-panel-highlight manga-speed-lines relative flex items-center justify-center p-6 sm:p-10">
            <div className="manga-speed-line" style={{ top: '20%', width: '80%', left: '-10%', animationDelay: '0.05s' }} />
            <div className="manga-speed-line" style={{ top: '40%', width: '70%', left: '-10%', animationDelay: '0.12s' }} />
            <div className="manga-speed-line" style={{ top: '65%', width: '75%', left: '-10%', animationDelay: '0.2s' }} />
            <span className="relative z-10 text-[7rem] sm:text-[10rem] font-extrabold leading-none text-gold-gradient drop-shadow-[0_6px_18px_rgba(244,163,0,0.25)]">
              404
            </span>
          </div>

          <div className="manga-panel flex flex-col justify-between p-5 sm:p-6">
            <div>
              <p className="mb-2 text-[10px] font-black uppercase tracking-[0.25em] text-sea">Kayıt defteri</p>
              <h1 className="text-xl font-extrabold leading-tight text-pirate-text sm:text-2xl">
                Bu ada henüz keşfedilmedi.
              </h1>
            </div>
            <span
              className="manga-sfx mt-6 block text-right text-3xl font-black tracking-[0.12em] sm:text-5xl"
              style={{ transform: 'rotate(-4deg)' }}
            >
              DOKAAN!
            </span>
          </div>

          <div className="manga-panel manga-panel-diagonal col-span-full flex flex-col items-start gap-4 p-5 sm:flex-row sm:items-center sm:p-6">
            <div className="relative flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-gold/30 bg-ocean-surface/60">
              <Compass className="h-6 w-6 text-gold animate-pulse" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm text-pirate-muted sm:text-base">
                Log Pose yanlış yönü gösteriyor gibi... Aradığın sayfa Grand Line&apos;ın derinliklerinde kaybolmuş.
              </p>
            </div>
            <div className="flex-shrink-0 self-end sm:self-center">
              <SpeechBubble tail="bottom-right" variant="whisper">
                Kaybolmak da maceranın bir parçası — Zoro
              </SpeechBubble>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4"
        >
          {QUICK_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="glass rounded-xl p-4 text-center group hover:border-gold/30 transition-all duration-300"
            >
              <link.icon className="mx-auto mb-2 h-6 w-6 text-gold transition-transform group-hover:scale-110" />
              <span className="block text-sm font-semibold text-pirate-text">{link.label}</span>
              <span className="mt-1 block text-xs text-pirate-muted">{link.desc}</span>
            </Link>
          ))}
        </motion.div>

        <motion.div variants={fadeUp}>
          <Link
            href="/"
            className="btn-gold inline-flex items-center gap-2 px-8 py-3 text-base font-semibold"
          >
            <Compass className="h-5 w-5" />
            Ana Sayfaya Dön
          </Link>
        </motion.div>
      </motion.div>
    </main>
  )
}
