'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Compass, Users, Swords, BookOpen } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const NAV_LINKS = [
  { label: 'Arc\'lar',      href: '/arcs',       icon: Compass },
  { label: 'Karakterler',   href: '/characters', icon: Users },
  { label: 'Hakkında',      href: '/about',      icon: BookOpen },
] as const

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
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
            {NAV_LINKS.map((link) => (
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
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Login button */}
            <Link
              href="/login"
              className={`hidden items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-semibold transition-all sm:flex ${
                scrolled
                  ? 'border-gold/20 bg-gold/5 text-gold hover:border-gold/40 hover:bg-gold/10'
                  : 'border-white/25 bg-white/10 text-white backdrop-blur-sm hover:border-gold/40 hover:bg-gold/10 hover:text-gold'
              }`}
            >
              <Swords className="h-4 w-4" />
              Maceraya Katıl
            </Link>

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
            className="surface fixed inset-x-4 top-20 z-40 rounded-2xl p-4 md:hidden"
          >
            {NAV_LINKS.map((link) => (
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
            <div className="mt-2 border-t border-pirate-border pt-2">
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-gold"
              >
                <Swords className="h-4 w-4" />
                Maceraya Katıl
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
