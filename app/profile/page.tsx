'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  User, Film, Trophy, MessageCircle,
  Compass, ArrowRight, Anchor
} from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { fadeUp, staggerContainer } from '@/lib/variants'

export default function ProfilePage() {
  // TODO: Get from auth session
  const isLoggedIn = false

  if (!isLoggedIn) {
    return (
      <>
        <Header />
        <main className="flex min-h-screen items-center justify-center px-6">
          <motion.div
            variants={staggerContainer(0.1)}
            initial="hidden"
            animate="visible"
            className="text-center"
          >
            <motion.div variants={fadeUp}>
              <Anchor className="mx-auto mb-4 h-12 w-12 text-pirate-muted" />
            </motion.div>
            <motion.h1 variants={fadeUp} className="mb-2 text-xl font-bold text-pirate-text">
              Giriş Yapmanız Gerekiyor
            </motion.h1>
            <motion.p variants={fadeUp} className="mb-6 text-sm text-pirate-muted">
              Profilinizi görmek için giriş yapın
            </motion.p>
            <motion.div variants={fadeUp}>
              <Link href="/login" className="btn-gold">Giriş Yap</Link>
            </motion.div>
          </motion.div>
        </main>
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="relative min-h-screen pt-24">
        <div className="mx-auto max-w-4xl px-6">
          {/* Profile header */}
          <motion.div
            variants={staggerContainer(0.1)}
            initial="hidden"
            animate="visible"
            className="mb-10"
          >
            <motion.div variants={fadeUp} className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-ocean-surface">
                <User className="h-8 w-8 text-sea/40" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-pirate-text">Profil</h1>
                <p className="text-sm text-pirate-muted">İzleme geçmişin ve istatistiklerin</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Stats grid */}
          <motion.div
            variants={staggerContainer(0.08)}
            initial="hidden"
            animate="visible"
            className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {[
              { label: 'İzlenen Bölüm', value: '0', icon: Film, color: 'text-sea' },
              { label: 'Tamamlanan Arc', value: '0', icon: Compass, color: 'text-gold' },
              { label: 'Quiz Skoru', value: '0%', icon: Trophy, color: 'text-emerald-400' },
              { label: 'Yorum', value: '0', icon: MessageCircle, color: 'text-luffy' },
            ].map((stat) => (
              <motion.div key={stat.label} variants={fadeUp} className="glass rounded-xl p-4 text-center">
                <stat.icon className={`mx-auto mb-2 h-5 w-5 ${stat.color}`} />
                <p className="text-2xl font-extrabold text-pirate-text">{stat.value}</p>
                <p className="text-xs text-pirate-muted">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Continue watching */}
          <section className="mb-10">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-pirate-text">
              <Film className="h-5 w-5 text-sea" />
              Kaldığın Yerden Devam Et
            </h2>
            <div className="glass rounded-xl p-8 text-center">
              <Compass className="mx-auto mb-3 h-8 w-8 text-pirate-muted" />
              <p className="mb-4 text-sm text-pirate-muted">Henüz izleme geçmişiniz yok</p>
              <Link href="/arcs" className="btn-ghost text-sm">
                İzlemeye Başla
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        </div>

        <div className="mt-16" />
      </main>
      <Footer />
    </>
  )
}
