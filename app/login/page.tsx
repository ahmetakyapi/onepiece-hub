'use client'

import { motion } from 'framer-motion'
import { Anchor, Chrome, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { fadeUp, staggerContainer } from '@/lib/variants'
import Header from '@/components/layout/Header'

export default function LoginPage() {
  return (
    <>
      <Header />
      <main className="relative flex min-h-screen items-center justify-center px-6">
        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          animate="visible"
          className="w-full max-w-sm"
        >
          {/* Logo */}
          <motion.div variants={fadeUp} className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-gold to-gold-bright shadow-lg shadow-gold/20">
              <Anchor className="h-7 w-7 text-ocean-deep" strokeWidth={2.5} />
            </div>
            <h1 className="text-2xl font-extrabold text-pirate-text">Maceraya Katıl</h1>
            <p className="mt-2 text-sm text-pirate-muted">
              Giriş yaparak izleme geçmişini takip et
            </p>
          </motion.div>

          {/* Auth buttons */}
          <motion.div variants={fadeUp} className="space-y-3">
            <button
              onClick={() => {
                // signIn('google') will be called when auth is set up
                window.location.href = '/api/auth/signin/google'
              }}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-pirate-border bg-ocean-surface/50 px-4 py-3 text-sm font-semibold text-pirate-text transition-all hover:border-gold/30 hover:bg-ocean-surface"
            >
              <Chrome className="h-5 w-5 text-sea" />
              Google ile Giriş Yap
            </button>

            <button
              onClick={() => {
                window.location.href = '/api/auth/signin/discord'
              }}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-pirate-border bg-ocean-surface/50 px-4 py-3 text-sm font-semibold text-pirate-text transition-all hover:border-gold/30 hover:bg-ocean-surface"
            >
              <MessageCircle className="h-5 w-5 text-[#5865F2]" />
              Discord ile Giriş Yap
            </button>
          </motion.div>

          {/* Bottom */}
          <motion.p variants={fadeUp} className="mt-8 text-center text-xs text-pirate-muted">
            Giriş yaparak{' '}
            <span className="text-pirate-text">kullanım koşullarını</span>{' '}
            kabul etmiş olursun.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-4 text-center">
            <Link href="/" className="text-xs text-sea hover:text-gold">
              Ana sayfaya dön
            </Link>
          </motion.div>
        </motion.div>
      </main>
    </>
  )
}
