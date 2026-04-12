'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu, X, Compass, Users, BookOpen, LogOut, User,
  ChevronDown, Cherry, Shield, Globe, Anchor, Swords,
  Trophy, Clock, Crown
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

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
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [wikiOpen, setWikiOpen] = useState(false)
  const wikiRef = useRef<HTMLDivElement>(null)
  const { user, logout, loading } = useAuth()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

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

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled ? 'glass shadow-xl shadow-black/10 h-16' : 'bg-transparent h-20'
        }`}
      >
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link href="/" className="flex items-center gap-2 group">
              <Image
                src="/logo.png"
                alt="One Piece Hub"
                width={180}
                height={72}
                className="h-14 w-auto drop-shadow-lg transition-all group-hover:scale-105 sm:h-[4.5rem]"
                priority
              />
            </Link>
          </motion.div>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {MAIN_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`link-glow group flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition-colors hover:text-gold ${
                  scrolled ? 'text-pirate-text/80' : 'text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]'
                }`}
              >
                <link.icon className="h-4 w-4 transition-transform group-hover:scale-110" />
                {link.label}
              </Link>
            ))}

            {/* Wiki dropdown */}
            <div ref={wikiRef} className="relative">
              <button
                onClick={() => setWikiOpen(!wikiOpen)}
                className={`link-glow group flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold transition-colors hover:text-gold ${
                  scrolled ? 'text-pirate-text/80' : 'text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]'
                }`}
              >
                <BookOpen className="h-4 w-4 transition-transform group-hover:scale-110" />
                Wiki
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${wikiOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {wikiOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="surface absolute right-0 top-full mt-2 w-72 rounded-2xl p-3"
                  >
                    <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-pirate-muted">
                      Ansiklopedi
                    </p>
                    {WIKI_LINKS.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setWikiOpen(false)}
                        className="flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-sea/5"
                      >
                        <link.icon className="mt-0.5 h-4 w-4 text-gold" />
                        <div>
                          <p className="text-sm font-semibold text-pirate-text">{link.label}</p>
                          <p className="text-[11px] text-pirate-muted">{link.desc}</p>
                        </div>
                      </Link>
                    ))}
                    <div className="my-2 divider-glow" />
                    <Link
                      href="/about"
                      onClick={() => setWikiOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-sea/5"
                    >
                      <BookOpen className="h-4 w-4 text-sea" />
                      <p className="text-sm font-semibold text-pirate-text">Hakkında</p>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {!loading && (
              user ? (
                <div className="hidden items-center gap-2 sm:flex">
                  <Link
                    href="/profile"
                    className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-semibold transition-all ${
                      scrolled
                        ? 'border-gold/20 bg-gold/5 text-gold hover:border-gold/40 hover:bg-gold/10'
                        : 'border-white/25 bg-white/10 text-white backdrop-blur-sm hover:border-gold/40 hover:bg-gold/10 hover:text-gold'
                    }`}
                  >
                    <User className="h-4 w-4" />
                    {user.name || user.username}
                  </Link>
                  <button
                    onClick={logout}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-luffy ${
                      scrolled ? 'text-pirate-muted' : 'text-white/70'
                    }`}
                    title="Çıkış Yap"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className={`hidden items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-semibold transition-all sm:flex ${
                    scrolled
                      ? 'border-gold/20 bg-gold/5 text-gold hover:border-gold/40 hover:bg-gold/10'
                      : 'border-white/25 bg-white/10 text-white backdrop-blur-sm hover:border-gold/40 hover:bg-gold/10 hover:text-gold'
                  }`}
                >
                  <User className="h-4 w-4" />
                  Maceraya Katıl
                </Link>
              )
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Menu"
              className={`flex h-9 w-9 items-center justify-center rounded-xl transition-colors hover:text-gold md:hidden ${
                scrolled ? 'text-pirate-muted' : 'text-white'
              }`}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="surface fixed inset-x-4 top-20 z-40 max-h-[80vh] overflow-y-auto rounded-2xl p-4 md:hidden scrollbar-thin"
          >
            {/* Main links */}
            {MAIN_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-pirate-text transition-colors hover:bg-sea/5 hover:text-gold"
              >
                <link.icon className="h-4 w-4 text-sea" />
                {link.label}
              </Link>
            ))}

            {/* Wiki section */}
            <div className="mt-2 border-t border-pirate-border pt-2">
              <p className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-pirate-muted">
                Wiki & Ansiklopedi
              </p>
              {WIKI_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-pirate-text transition-colors hover:bg-sea/5 hover:text-gold"
                >
                  <link.icon className="h-4 w-4 text-gold" />
                  <div>
                    <p className="text-sm">{link.label}</p>
                    <p className="text-[10px] text-pirate-muted">{link.desc}</p>
                  </div>
                </Link>
              ))}
            </div>

            {/* About */}
            <div className="mt-2 border-t border-pirate-border pt-2">
              <Link
                href="/about"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-pirate-text transition-colors hover:bg-sea/5 hover:text-gold"
              >
                <BookOpen className="h-4 w-4 text-sea" />
                Hakkında
              </Link>
            </div>

            {/* Auth */}
            <div className="mt-2 border-t border-pirate-border pt-2">
              {user ? (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-gold"
                  >
                    <User className="h-4 w-4" />
                    {user.name || user.username}
                  </Link>
                  <button
                    onClick={() => { logout(); setMenuOpen(false) }}
                    className="flex w-full items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-pirate-muted hover:text-luffy"
                  >
                    <LogOut className="h-4 w-4" />
                    Çıkış Yap
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-gold"
                >
                  <User className="h-4 w-4" />
                  Maceraya Katıl
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
