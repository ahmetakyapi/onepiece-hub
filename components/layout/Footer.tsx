'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Anchor, ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { FOOTER_SECTIONS } from '@/lib/constants/navigation'

const EASE = [0.16, 1, 0.3, 1] as const

export default function Footer() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <footer ref={ref} className="relative border-t border-pirate-border/20 overflow-hidden">
      {/* Top gradient line */}
      <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      <div className="absolute -top-[2px] left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold/10 to-transparent blur-sm" />

      {/* Decorative orbs */}
      <div className="pointer-events-none absolute bottom-0 left-[15%] h-64 w-64 rounded-full bg-gold/[0.02] blur-[100px]" />
      <div className="pointer-events-none absolute bottom-0 right-[15%] h-64 w-64 rounded-full bg-sea/[0.02] blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-6 py-16 sm:py-20">
        <div className="grid gap-12 md:grid-cols-5">
          {/* Logo + tagline — spans 2 cols */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE }}
            className="md:col-span-2 flex flex-col items-center md:items-start"
          >
            <Link href="/" className="group mb-4">
              <Image
                src="/logo.webp"
                alt="One Piece Hub"
                width={220}
                height={88}
                className="h-20 w-auto transition-all duration-500 group-hover:drop-shadow-[0_0_24px_rgba(244,163,0,0.2)] sm:h-24"
              />
            </Link>
            <p className="mb-2 text-sm text-pirate-muted text-center md:text-left">
              Denizlerin Kralı olmaya hazır mısın?
            </p>
            <p className="text-[11px] text-pirate-muted/40 text-center md:text-left">
              Kapsamlı One Piece wiki & izleme platformu
            </p>
          </motion.div>

          {/* Link sections */}
          {FOOTER_SECTIONS.map((section, sectionIdx) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: EASE, delay: 0.1 + sectionIdx * 0.08 }}
            >
              <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.12em] text-pirate-text/80">
                {section.title}
              </h3>
              <nav className="space-y-2.5">
                {section.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group flex items-center gap-2 text-[13px] text-pirate-muted/70 transition-all duration-300 hover:text-pirate-text"
                  >
                    <link.icon className="h-3.5 w-3.5 opacity-40 transition-all duration-300 group-hover:opacity-70 group-hover:text-gold" />
                    <span>{link.label}</span>
                    <ArrowUpRight className="h-3 w-3 opacity-0 -translate-y-0.5 translate-x-0 transition-all duration-300 group-hover:opacity-30 group-hover:translate-y-0" />
                  </Link>
                ))}
              </nav>
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        <div className="my-10 h-px bg-gradient-to-r from-transparent via-pirate-border/20 to-transparent" />

        {/* Bottom */}
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-[11px] text-pirate-muted/50" suppressHydrationWarning>
            &copy; {new Date().getFullYear()} One Piece Hub &mdash; Fan projesi. One Piece, Eiichiro Oda&apos;ya aittir.
          </p>
          <p className="flex items-center gap-1.5 text-[11px] text-pirate-muted/40">
            <Anchor className="h-3 w-3 text-gold/30" />
            Macera ruhuyla yapıldı
          </p>
        </div>
      </div>
    </footer>
  )
}
