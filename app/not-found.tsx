'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Home, Compass, Map, Anchor } from 'lucide-react'
import { fadeUp, staggerContainer, EASE } from '@/lib/variants'

const QUICK_LINKS = [
  { label: 'Ana Sayfa', href: '/', icon: Home, desc: 'Maceraya geri dön' },
  { label: "Arc'lar", href: '/arcs', icon: Compass, desc: 'Tüm hikaye yaylarını keşfet' },
  { label: 'Karakterler', href: '/characters', icon: Anchor, desc: '65 karakteri tanı' },
  { label: 'Dünya Haritası', href: '/world', icon: Map, desc: 'Grand Line\'ı keşfet' },
]

export default function NotFound() {
  return (
      <main className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
        {/* Decorative orbs */}
        <div className="orb absolute w-[300px] h-[300px] rounded-full blur-[120px] opacity-20" style={{ background: 'rgba(244, 163, 0, 0.4)', top: '10%', left: '10%' }} />
        <div className="orb absolute w-[200px] h-[200px] rounded-full blur-[100px] opacity-15" style={{ background: 'rgba(30, 144, 255, 0.3)', bottom: '20%', right: '15%' }} />

        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          animate="visible"
          className="text-center max-w-2xl mx-auto relative z-10"
        >
          {/* 404 Number */}
          <motion.div variants={fadeUp} className="mb-6">
            <span className="text-[8rem] sm:text-[10rem] font-extrabold leading-none text-gold-gradient select-none">
              404
            </span>
          </motion.div>

          {/* Message */}
          <motion.h1 variants={fadeUp} className="text-2xl sm:text-3xl font-bold text-pirate-text mb-3">
            Bu ada henüz keşfedilmedi!
          </motion.h1>

          <motion.p variants={fadeUp} className="text-pirate-muted text-lg mb-4 max-w-md mx-auto">
            Log Pose yanlış yönü gösteriyor gibi... Aradığın sayfa Grand Line&apos;ın derinliklerinde kaybolmuş olabilir.
          </motion.p>

          <motion.p variants={fadeUp} className="text-pirate-muted/60 text-sm mb-10 italic">
            &ldquo;Kaybolmak da maceranın bir parçası!&rdquo; &mdash; Roronoa Zoro (muhtemelen)
          </motion.p>

          {/* Quick links */}
          <motion.div
            variants={fadeUp}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10"
          >
            {QUICK_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="glass rounded-xl p-4 text-center group hover:border-gold/30 transition-all duration-300"
              >
                <link.icon className="w-6 h-6 mx-auto mb-2 text-gold group-hover:scale-110 transition-transform" />
                <span className="block text-sm font-semibold text-pirate-text">{link.label}</span>
                <span className="block text-xs text-pirate-muted mt-1">{link.desc}</span>
              </Link>
            ))}
          </motion.div>

          {/* Main CTA */}
          <motion.div variants={fadeUp}>
            <Link
              href="/"
              className="btn-gold inline-flex items-center gap-2 px-8 py-3 rounded-xl text-base font-semibold"
            >
              <Compass className="w-5 h-5" />
              Ana Sayfaya Dön
            </Link>
          </motion.div>
        </motion.div>
      </main>
  )
}
