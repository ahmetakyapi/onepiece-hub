'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { User, Lock, ArrowRight, Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { fadeUp, staggerContainer } from '@/lib/variants'
import { useAuth } from '@/hooks/useAuth'
import Header from '@/components/layout/Header'

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, register } = useAuth()
  const router = useRouter()

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
      router.push('/')
    }
  }

  return (
    <>
      <Header />
      <main className="relative flex min-h-screen items-center justify-center px-6">
        {/* Background accents */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-40 top-20 h-80 w-80 rounded-full bg-gold/5 blur-3xl" />
          <div className="absolute -right-40 bottom-20 h-96 w-96 rounded-full bg-sea/5 blur-3xl" />
        </div>

        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          animate="visible"
          className="relative w-full max-w-sm"
        >
          {/* Logo */}
          <motion.div variants={fadeUp} className="mb-8 text-center">
            <Image
              src="/logo.webp"
              alt="One Piece Hub"
              width={320}
              height={128}
              className="mx-auto mb-4 h-28 w-auto drop-shadow-2xl sm:h-32"
              priority
            />
            <h1 className="text-2xl font-extrabold text-pirate-text">
              {isRegister ? 'Mürettebata Katıl' : 'Maceraya Devam'}
            </h1>
            <p className="mt-2 text-sm text-pirate-muted">
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
          <motion.div variants={fadeUp} className="mt-6 text-center">
            <button
              onClick={() => { setIsRegister((v) => !v); setError('') }}
              className="text-xs text-pirate-muted transition-colors hover:text-gold"
            >
              {isRegister
                ? 'Zaten hesabın var mı? Giriş yap'
                : 'Hesabın yok mu? Kayıt ol'}
            </button>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-4 text-center">
            <Link href="/" className="text-xs text-sea hover:text-gold transition-colors">
              Ana sayfaya dön
            </Link>
          </motion.div>
        </motion.div>
      </main>
    </>
  )
}
