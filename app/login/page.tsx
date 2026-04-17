'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { User, Lock, ArrowRight, Loader2, Compass, Anchor } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { fadeUp, staggerContainer } from '@/lib/variants'
import { useAuth } from '@/hooks/useAuth'

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { user, loading: authLoading, login, register } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams.get('from') || '/'

  // Zaten giriş yapmışsa yönlendir
  useEffect(() => {
    if (!authLoading && user) {
      router.replace(from)
    }
  }, [authLoading, user, router, from])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = isRegister
      ? await register(username, password, name || undefined)
      : await login(username, password)

    setLoading(false)

    if (result.error) {
      setError(result.error)
    } else {
      router.push(from)
    }
  }

  if (authLoading) return null
  if (user) return null

  return (
      <main className="relative flex min-h-screen items-center justify-center px-4 sm:px-6">
        {/* Background accents */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="ocean-glow ocean-glow-gold" style={{ width: 500, height: 500, top: -150, left: -200 }} />
          <div className="ocean-glow ocean-glow-sea" style={{ width: 600, height: 600, bottom: -200, right: -200 }} />
        </div>

        <div className="relative flex w-full max-w-4xl overflow-hidden rounded-3xl border border-pirate-border/30 bg-ocean-surface/20 backdrop-blur-sm">
          {/* Left side — illustration panel (hidden on mobile) */}
          <div className="relative hidden w-1/2 overflow-hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-br from-sea/10 via-ocean-deep/80 to-gold/5" />
            <Image
              src="/hero.webp"
              alt="One Piece"
              fill
              className="object-cover opacity-40"
              sizes="50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ocean-deep via-ocean-deep/60 to-transparent" />

            {/* Animated wave layers — subtle motion */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 overflow-hidden">
              <svg
                className="absolute inset-x-0 bottom-0 w-[200%] animate-[ocean-drift_18s_linear_infinite]"
                viewBox="0 0 1440 120"
                preserveAspectRatio="none"
                style={{ height: 120 }}
              >
                <path
                  d="M0,60 C240,90 480,30 720,60 C960,90 1200,30 1440,60 L1440,120 L0,120 Z"
                  fill="rgba(30,144,255,0.08)"
                />
              </svg>
              <svg
                className="absolute inset-x-0 bottom-0 w-[200%] animate-[ocean-drift_26s_linear_infinite_reverse]"
                viewBox="0 0 1440 120"
                preserveAspectRatio="none"
                style={{ height: 80, opacity: 0.6 }}
              >
                <path
                  d="M0,80 C360,50 720,100 1080,70 C1260,55 1380,85 1440,80 L1440,120 L0,120 Z"
                  fill="rgba(244,163,0,0.05)"
                />
              </svg>
            </div>

            {/* Overlay content */}
            <div className="relative flex h-full flex-col items-center justify-center p-10 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Compass with dual rotating rings */}
                <div className="relative mx-auto mb-6 h-20 w-20">
                  <div className="absolute inset-0 rounded-full border border-gold/10 animate-[spin_16s_linear_infinite]" />
                  <div className="absolute inset-1 rounded-full border border-dashed border-sea/15 animate-[spin_12s_linear_infinite_reverse]" />
                  <div className="absolute inset-2 flex items-center justify-center rounded-2xl border border-gold/25 bg-gold/10 backdrop-blur-sm">
                    <Compass className="h-8 w-8 text-gold animate-[spin_8s_linear_infinite]" />
                  </div>
                  {/* Outer glow ring */}
                  <div className="absolute -inset-2 rounded-full bg-gold/[0.04] blur-xl animate-pulse" />
                </div>
                <h2 className="mb-3 text-2xl font-extrabold text-pirate-text">
                  Grand Line&apos;a
                  <br />
                  <span className="text-gold-gradient">Hoş Geldin</span>
                </h2>
                <p className="mx-auto max-w-xs text-sm leading-relaxed text-pirate-muted/70">
                  İzleme geçmişini kaydet, quiz&apos;lerde yarış, mürettebatına katıl.
                </p>
              </motion.div>

              {/* Decorative anchors */}
              <div className="pointer-events-none absolute bottom-8 left-8 opacity-10 animate-float-slow">
                <Anchor className="h-20 w-20 text-sea" />
              </div>
              <div className="pointer-events-none absolute right-8 top-8 opacity-10 animate-float-delayed">
                <Anchor className="h-12 w-12 rotate-45 text-gold" />
              </div>
            </div>
          </div>

          {/* Right side — form */}
          <div className="flex w-full flex-col justify-center p-8 sm:p-10 lg:w-1/2">
            <motion.div
              variants={staggerContainer(0.1)}
              initial="hidden"
              animate="visible"
            >
              {/* Logo */}
              <motion.div variants={fadeUp} className="mb-8 text-center lg:text-left">
                <Image
                  src="/logo.webp"
                  alt="One Piece Hub"
                  width={280}
                  height={112}
                  className="mx-auto mb-5 h-28 w-auto drop-shadow-2xl sm:h-32 lg:mx-0"
                  priority
                />
                <h1 className="text-xl font-extrabold text-pirate-text sm:text-2xl">
                  {isRegister ? 'Mürettebata Katıl' : 'Maceraya Devam'}
                </h1>
                <p className="mt-1.5 text-sm text-pirate-muted">
                  {isRegister
                    ? 'Hesap oluştur, izleme geçmişini kaydet'
                    : 'Giriş yap, kaldığın yerden devam et'}
                </p>
              </motion.div>

              {/* Form */}
              <motion.form variants={fadeUp} onSubmit={handleSubmit} className="space-y-4">
                {isRegister && (
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-pirate-muted">
                      Görünen İsim
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-pirate-muted/50" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Monkey D. Luffy"
                        className="w-full rounded-xl border border-pirate-border bg-ocean-surface/50 py-3 pl-10 pr-4 text-sm text-pirate-text placeholder:text-pirate-muted/40 transition-all focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-pirate-muted">
                    Kullanıcı Adı
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-pirate-muted/50" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="korsanreis"
                      required
                      minLength={3}
                      maxLength={20}
                      className="w-full rounded-xl border border-pirate-border bg-ocean-surface/50 py-3 pl-10 pr-4 text-sm text-pirate-text placeholder:text-pirate-muted/40 transition-all focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-pirate-muted">
                    Şifre
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-pirate-muted/50" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      minLength={6}
                      className="w-full rounded-xl border border-pirate-border bg-ocean-surface/50 py-3 pl-10 pr-4 text-sm text-pirate-text placeholder:text-pirate-muted/40 transition-all focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20"
                    />
                  </div>
                </div>

                {error && (
                  <p className="rounded-lg bg-luffy/10 px-3 py-2 text-xs font-medium text-luffy">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-gold w-full justify-center py-3 text-sm disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      {isRegister ? 'Hesap Oluştur' : 'Giriş Yap'}
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </motion.form>

              {/* Toggle */}
              <motion.div variants={fadeUp} className="mt-6 text-center lg:text-left">
                <button
                  onClick={() => { setIsRegister((v) => !v); setError('') }}
                  className="text-xs text-pirate-muted transition-colors hover:text-gold"
                >
                  {isRegister
                    ? 'Zaten hesabın var mı? Giriş yap'
                    : 'Hesabın yok mu? Kayıt ol'}
                </button>
              </motion.div>

              <motion.div variants={fadeUp} className="mt-4 text-center lg:text-left">
                <Link href="/" className="text-xs text-sea hover:text-gold transition-colors">
                  Ana sayfaya dön
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </main>
  )
}
