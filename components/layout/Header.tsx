'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from 'framer-motion'
// motion used for dropdown/drawer animations, not header element itself
import {
  Menu, X, Compass, Users, BookOpen, LogOut, User,
  ChevronDown, Cherry, Shield, Globe, Anchor, Swords,
  Trophy, Clock, ArrowRight
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

const EASE = [0.16, 1, 0.3, 1] as const

const MAIN_LINKS = [
  { label: 'Arc\'lar', href: '/arcs', icon: Compass },
  { label: 'Karakterler', href: '/characters', icon: Users },
] as const

const WIKI_LINKS = [
  { label: 'Şeytan Meyveleri', href: '/devil-fruits', icon: Cherry, desc: 'Tüm meyveler ve güçleri' },
  { label: 'Haki Rehberi', href: '/haki', icon: Shield, desc: 'Üç Haki türü detaylı' },
  { label: 'Dünya Haritası', href: '/world', icon: Globe, desc: 'Denizler ve lokasyonlar' },
  { label: 'Organizasyonlar', href: '/crews', icon: Anchor, desc: 'Mürettebat ve gruplar' },
  { label: 'Efsanevi Savaşlar', href: '/battles', icon: Swords, desc: 'İkonik dövüşler' },
  { label: 'Ödül Sıralaması', href: '/bounties', icon: Trophy, desc: 'Bounty leaderboard' },
  { label: 'Zaman Çizelgesi', href: '/timeline', icon: Clock, desc: 'Kronolojik tarih' },
] as const

export default function Header() {
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [wikiOpen, setWikiOpen] = useState(false)
  const wikiRef = useRef<HTMLDivElement>(null)
  const { user, logout, loading } = useAuth()
  const { scrollY } = useScroll()

  useEffect(() => { setMounted(true) }, [])

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 20)
  })

  // Close wiki dropdown on outside click
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (wikiRef.current && !wikiRef.current.contains(e.target as Node)) {
        setWikiOpen(false)
      }
    }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  // Close mobile menu on route change (escape key)
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false)
        setWikiOpen(false)
      }
    }
    document.addEventListener('keydown', fn)
    return () => document.removeEventListener('keydown', fn)
  }, [])

  return (
    <>
      {/* ── Desktop Header ───────────────────────────────────────── */}
      <header
        className="fixed inset-x-0 top-0 z-50"
      >
        {/* Blur backdrop that grows on scroll */}
        <div
          className="absolute inset-0 transition-all duration-500"
          style={{
            backgroundColor: scrolled ? 'rgba(6,14,26,0.82)' : 'rgba(6,14,26,0)',
            backdropFilter: scrolled ? 'blur(20px) saturate(1.4)' : 'blur(0px)',
            WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(1.4)' : 'blur(0px)',
          }}
        />

        {/* Bottom border that fades in */}
        <div
          className="absolute inset-x-0 bottom-0 h-px transition-opacity duration-400"
          style={{
            opacity: scrolled ? 1 : 0,
            background: 'linear-gradient(90deg, transparent, rgba(30,144,255,0.12) 20%, rgba(244,163,0,0.12) 80%, transparent)',
          }}
        />

        <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:h-[4.5rem]">
          {/* Logo */}
          <Link href="/" className="relative flex items-center gap-2 group">
            <Image
              src="/logo.png"
              alt="One Piece Hub"
              width={180}
              height={72}
              className="h-12 w-auto drop-shadow-lg transition-all duration-500 ease-expo-out group-hover:drop-shadow-[0_0_20px_rgba(244,163,0,0.25)] sm:h-14"
              priority
            />
          </Link>

          {/* Desktop nav — floating pill style */}
          <nav className="hidden items-center md:flex">
            {/* Nav pill container */}
            <div className="flex items-center gap-0.5 rounded-full border border-white/[0.06] bg-white/[0.03] px-1 py-1 backdrop-blur-sm">
              {MAIN_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-semibold text-pirate-text/80 transition-all duration-300 hover:bg-white/[0.06] hover:text-white"
                >
                  <link.icon className="h-3.5 w-3.5 opacity-60 transition-all group-hover:opacity-100 group-hover:text-gold" />
                  {link.label}
                </Link>
              ))}

              {/* Wiki dropdown */}
              <div ref={wikiRef} className="relative">
                <button
                  onClick={() => setWikiOpen(!wikiOpen)}
                  className={`group flex items-center gap-1 rounded-full px-4 py-2 text-[13px] font-semibold transition-all duration-300 ${
                    wikiOpen
                      ? 'bg-white/[0.08] text-white'
                      : 'text-pirate-text/80 hover:bg-white/[0.06] hover:text-white'
                  }`}
                >
                  <BookOpen className="h-3.5 w-3.5 opacity-60 transition-all group-hover:opacity-100 group-hover:text-gold" />
                  Wiki
                  <ChevronDown className={`h-3 w-3 opacity-50 transition-transform duration-300 ${wikiOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {wikiOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.2, ease: EASE }}
                      className="glass-elevated absolute right-0 top-full mt-3 w-80 overflow-hidden rounded-2xl p-2"
                    >
                      {/* Header */}
                      <div className="mb-1 flex items-center justify-between px-3 py-2">
                        <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-pirate-muted">
                          Ansiklopedi
                        </span>
                        <span className="rounded-full bg-gold/10 px-2 py-0.5 text-[9px] font-bold text-gold">
                          7 bölüm
                        </span>
                      </div>

                      {WIKI_LINKS.map((link, i) => (
                        <motion.div
                          key={link.href}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.03, duration: 0.2 }}
                        >
                          <Link
                            href={link.href}
                            onClick={() => setWikiOpen(false)}
                            className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 hover:bg-white/[0.04]"
                          >
                            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gold/[0.06] transition-colors group-hover:bg-gold/[0.12]">
                              <link.icon className="h-3.5 w-3.5 text-gold/70 transition-colors group-hover:text-gold" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[13px] font-semibold text-pirate-text transition-colors group-hover:text-white">
                                {link.label}
                              </p>
                              <p className="text-[11px] text-pirate-muted/70">{link.desc}</p>
                            </div>
                            <ArrowRight className="h-3.5 w-3.5 text-pirate-muted/30 transition-all group-hover:translate-x-0.5 group-hover:text-gold/50" />
                          </Link>
                        </motion.div>
                      ))}

                      <div className="my-1.5 mx-3 h-px bg-gradient-to-r from-transparent via-pirate-border/30 to-transparent" />

                      <Link
                        href="/about"
                        onClick={() => setWikiOpen(false)}
                        className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 hover:bg-white/[0.04]"
                      >
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-sea/[0.06]">
                          <BookOpen className="h-3.5 w-3.5 text-sea/70 transition-colors group-hover:text-sea" />
                        </div>
                        <p className="text-[13px] font-semibold text-pirate-text transition-colors group-hover:text-white">
                          Hakkında
                        </p>
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </nav>

          {/* Right side — auth + mobile */}
          <div className="flex items-center gap-3">
            {!loading && (
              user ? (
                <div className="hidden items-center gap-2 sm:flex">
                  <Link
                    href="/profile"
                    className="group flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-[13px] font-semibold text-pirate-text transition-all duration-300 hover:border-gold/20 hover:bg-gold/[0.06] hover:text-gold"
                  >
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gold/15">
                      <User className="h-3 w-3 text-gold" />
                    </div>
                    {user.name || user.username}
                  </Link>
                  <button
                    onClick={logout}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-pirate-muted transition-all duration-200 hover:bg-luffy/10 hover:text-luffy"
                    title="Çıkış Yap"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="hidden items-center gap-2 rounded-full border border-gold/20 bg-gold/[0.06] px-4 py-2 text-[13px] font-semibold text-gold transition-all duration-300 hover:bg-gold/[0.12] hover:shadow-[0_0_20px_rgba(244,163,0,0.1)] sm:flex"
                >
                  <User className="h-3.5 w-3.5" />
                  Maceraya Katıl
                </Link>
              )
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Menu"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl text-pirate-text transition-colors hover:text-gold md:hidden"
            >
              {menuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile menu overlay + drawer ──────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-ocean-deep/60 backdrop-blur-sm md:hidden"
              onClick={() => setMenuOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ opacity: 0, y: -16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.98 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="glass-elevated fixed inset-x-4 top-20 z-40 max-h-[75vh] overflow-y-auto rounded-2xl p-3 md:hidden scrollbar-thin"
            >
              {/* Main links */}
              <div className="mb-2 space-y-0.5">
                {MAIN_LINKS.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3, ease: EASE }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="group flex items-center gap-3 rounded-xl px-4 py-3 transition-colors hover:bg-white/[0.04]"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sea/[0.08]">
                        <link.icon className="h-4 w-4 text-sea" />
                      </div>
                      <span className="text-sm font-semibold text-pirate-text">{link.label}</span>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Divider */}
              <div className="mx-4 my-2 h-px bg-gradient-to-r from-transparent via-pirate-border/30 to-transparent" />

              {/* Wiki section */}
              <div className="mb-2">
                <p className="px-4 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-pirate-muted">
                  Wiki & Ansiklopedi
                </p>
                <div className="space-y-0.5">
                  {WIKI_LINKS.map((link, i) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.03, duration: 0.3, ease: EASE }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
                        className="group flex items-center gap-3 rounded-xl px-4 py-2.5 transition-colors hover:bg-white/[0.04]"
                      >
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gold/[0.06]">
                          <link.icon className="h-3.5 w-3.5 text-gold/70" />
                        </div>
                        <div>
                          <p className="text-[13px] font-semibold text-pirate-text">{link.label}</p>
                          <p className="text-[10px] text-pirate-muted/60">{link.desc}</p>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="mx-4 my-2 h-px bg-gradient-to-r from-transparent via-pirate-border/30 to-transparent" />

              {/* About */}
              <Link
                href="/about"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-3 transition-colors hover:bg-white/[0.04]"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sea/[0.08]">
                  <BookOpen className="h-4 w-4 text-sea" />
                </div>
                <span className="text-sm font-semibold text-pirate-text">Hakkında</span>
              </Link>

              {/* Auth */}
              <div className="mx-4 my-2 h-px bg-gradient-to-r from-transparent via-pirate-border/30 to-transparent" />
              {user ? (
                <div className="space-y-0.5">
                  <Link
                    href="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-4 py-3"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/10">
                      <User className="h-4 w-4 text-gold" />
                    </div>
                    <span className="text-sm font-semibold text-gold">
                      {user.name || user.username}
                    </span>
                  </Link>
                  <button
                    onClick={() => { logout(); setMenuOpen(false) }}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 transition-colors hover:bg-luffy/[0.06]"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-luffy/[0.08]">
                      <LogOut className="h-4 w-4 text-luffy/70" />
                    </div>
                    <span className="text-sm font-medium text-pirate-muted">Çıkış Yap</span>
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-4 py-3"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/10">
                    <User className="h-4 w-4 text-gold" />
                  </div>
                  <span className="text-sm font-semibold text-gold">Maceraya Katıl</span>
                </Link>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
