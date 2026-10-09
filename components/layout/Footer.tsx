'use client'

import { ArrowRight, ArrowUpRight, Github } from 'lucide-react'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { BrandLockup } from '@/components/brand/CompassMark'
import { FOOTER_SECTIONS } from '@/lib/constants/navigation'
import { EASE_REVEAL } from '@/lib/motion'
import SplitText from '@/components/motion/SplitText'

const GIANT = 'ONE PIECE'.split('')

/* Dev wordmark — görünür olunca harfler sırayla alttan yükselir; her harf
   üstüne gelince altına döner. Dekoratif: ekran okuyucudan gizli.

   Görünürlük KAPSAYICIDA ölçülür, harf başına değil: harfler başlangıçta
   `overflow: hidden` kutunun dışında durduğu için IntersectionObserver
   onları tamamen kırpılmış sayar ve tek tek `whileInView` hiç tetiklenmez. */
const giantLetter = {
  hidden: { y: '100%' },
  visible: (i: number) => ({ y: '0%', transition: { duration: 1.1, ease: EASE_REVEAL, delay: i * 0.05 } }),
}

function GiantWordmark() {
  const reduced = useReducedMotion()
  return (
    <motion.div
      className="relative select-none overflow-hidden px-2"
      aria-hidden
      initial={reduced ? false : 'hidden'}
      whileInView="visible"
      viewport={{ once: true, margin: '0px 0px -5% 0px' }}
    >
      <div className="footer-giant flex justify-center whitespace-nowrap font-extrabold">
        {GIANT.map((ch, i) => (
          <motion.span
            key={i}
            custom={i}
            variants={giantLetter}
            className="inline-block text-pirate-text/[0.11] transition-colors duration-500 hover:text-gold/80"
          >
            {ch === ' ' ? '\u00a0' : ch}
          </motion.span>
        ))}
      </div>
    </motion.div>
  )
}

export default function Footer() {
  return (
    <footer className="relative border-t border-pirate-border/20 overflow-hidden">
      {/* Top wave ribbon */}
      <div className="pointer-events-none absolute inset-x-0 -top-1 h-8 overflow-hidden opacity-60">
        <svg
          className="absolute inset-x-0 top-0 w-[200%] animate-[ocean-drift_28s_linear_infinite]"
          viewBox="0 0 1440 30"
          preserveAspectRatio="none"
          style={{ height: 32 }}
          aria-hidden
        >
          <path
            d="M0,15 C240,5 480,25 720,15 C960,5 1200,25 1440,15 L1440,0 L0,0 Z"
            fill="rgb(var(--gold) / 0.06)"
          />
        </svg>
      </div>
      <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      {/* Decorative orbs */}
      <div className="pointer-events-none absolute bottom-0 left-[15%] h-64 w-64 rounded-full bg-gold/[0.02] blur-[100px]" />
      <div className="pointer-events-none absolute bottom-0 right-[15%] h-64 w-64 rounded-full bg-sea/[0.02] blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-6 py-16 sm:py-20">
        {/* Kapanış çağrısı — büyük, sakin, tek eylem */}
        <div className="mb-16 flex flex-col items-start justify-between gap-8 border-b border-pirate-border/20 pb-14 sm:mb-20 md:flex-row md:items-end">
          <div>
            <p className="eyebrow-lg mb-4 text-gold">Sıradaki durak</p>
            <SplitText
              as="p"
              className="text-4xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl"
              parts={[
                { text: 'Yolculuk', className: 'text-pirate-text' },
                { text: 'devam ediyor.', className: 'text-gold-gradient' },
              ]}
              breakAfter={[{ index: 0 }]}
            />
          </div>
          <Link
            href="/arcs"
            className="group relative flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gold/40 text-sm font-bold text-gold transition-colors duration-500 hover:text-ocean-deep sm:h-40 sm:w-40"
          >
            <span className="absolute inset-0 translate-y-full rounded-full bg-gold transition-transform duration-700 ease-expo-out group-hover:translate-y-0" />
            <span className="relative flex flex-col items-center gap-1.5">
              İzlemeye Başla
              <ArrowRight className="h-4 w-4 -rotate-45 transition-transform duration-500 group-hover:rotate-0" />
            </span>
          </Link>
        </div>

        <div className="grid gap-12 md:grid-cols-5">
          {/* Logo + tagline — spans 2 cols */}
          <div className="md:col-span-2 flex flex-col items-center md:items-start animate-fade-in-up">
            <Link href="/" aria-label="One Piece Hub ana sayfa" className="group mb-4">
              <BrandLockup
                markSize={32}
                size="md"
                className="transition-all duration-500 group-hover:drop-shadow-[0_0_24px_rgb(var(--gold)/0.25)]"
              />
            </Link>
            <p className="mb-2 text-sm text-pirate-muted text-center md:text-left">
              Denizlerin Kralı olmaya hazır mısın?
            </p>
            <p className="text-[11px] text-pirate-muted/40 text-center md:text-left">
              Kapsamlı One Piece wiki & izleme platformu
            </p>
          </div>

          {/* Link sections */}
          {FOOTER_SECTIONS.map((section, sectionIdx) => (
            <div
              key={section.title}
              className="animate-fade-in-up"
              style={{ animationDelay: `${0.1 + sectionIdx * 0.08}s` }}
            >
              <h3 className="eyebrow mb-4 text-pirate-text/80">
                {section.title}
              </h3>
              <nav className="space-y-2.5">
                {section.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    /* `py-1.5 -my-1.5`: dokunma alanını 20px'ten ~32px'e çıkarır ama
                       negatif margin ile görsel aralığı bozmaz. Mobilde footer
                       linkleri 20px yüksekliğindeydi, isabet ettirmek zordu. */
                    className="group -my-1.5 flex items-center gap-2 py-1.5 text-[13px] text-pirate-muted/70 transition-all duration-300 hover:text-pirate-text"
                  >
                    <link.icon className="h-3.5 w-3.5 opacity-40 transition-all duration-300 group-hover:opacity-70 group-hover:text-gold" />
                    <span>{link.label}</span>
                    <ArrowUpRight className="h-3 w-3 opacity-0 -translate-y-0.5 translate-x-0 transition-all duration-300 group-hover:opacity-30 group-hover:translate-y-0" />
                  </Link>
                ))}
              </nav>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="my-10 h-px bg-gradient-to-r from-transparent via-pirate-border/20 to-transparent" />

        {/* Bottom */}
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-[11px] text-pirate-muted/50" suppressHydrationWarning>
            &copy; {new Date().getFullYear()} One Piece Hub. Fan projesidir; One Piece, Eiichiro Oda&apos;ya aittir.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/ahmetakyapi"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg border border-pirate-border/20 bg-ocean-surface/30 px-3 py-1.5 text-[11px] font-medium text-pirate-muted/60 transition-all duration-300 hover:border-gold/20 hover:text-gold"
              aria-label="GitHub profili"
            >
              <Github className="h-3 w-3" />
              ahmetakyapi
            </a>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-1.5 rounded-lg border border-pirate-border/20 bg-ocean-surface/30 px-3 py-1.5 text-[11px] font-medium text-pirate-muted/60 transition-all duration-300 hover:border-gold/20 hover:text-gold"
              aria-label="Sayfanın başına dön"
            >
              <ArrowUpRight className="h-3 w-3 -rotate-45" />
              Başa Dön
            </button>
          </div>
        </div>
      </div>

      <GiantWordmark />
    </footer>
  )
}
