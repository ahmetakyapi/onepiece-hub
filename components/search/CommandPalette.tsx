'use client'

import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  Search,
  Users,
  Compass,
  Cherry,
  Map,
  Shield,
  Trophy,
  Clock,
  Anchor,
  BookOpen,
  CornerDownLeft,
  ArrowUp,
  ArrowDown,
} from 'lucide-react'
import { CHARACTERS } from '@/lib/constants/characters'
import { ARCS } from '@/lib/constants/arcs'
import { DEVIL_FRUITS } from '@/lib/constants/devil-fruits'

type ResultKind = 'character' | 'arc' | 'fruit' | 'page'

type Result = {
  kind: ResultKind
  label: string
  sublabel?: string
  href: string
  icon: typeof Search
}

const PAGES: Result[] = [
  { kind: 'page', label: 'Keşfet', sublabel: 'Editoryal seçkiler & rastgele keşifler', href: '/explore', icon: Compass },
  { kind: 'page', label: 'Karakterler', sublabel: '61 karakter ansiklopedisi', href: '/characters', icon: Users },
  { kind: 'page', label: "Arc'lar", sublabel: 'Filler\'sız arc bazlı bölümler', href: '/arcs', icon: Compass },
  { kind: 'page', label: 'Şeytan Meyveleri', sublabel: 'Tüm meyveler ve güçleri', href: '/devil-fruits', icon: Cherry },
  { kind: 'page', label: 'Dünya Haritası', sublabel: '25+ lokasyon', href: '/world', icon: Map },
  { kind: 'page', label: 'Haki Rehberi', sublabel: '3 Haki türü detayı', href: '/haki', icon: Shield },
  { kind: 'page', label: 'Ödül Sıralaması', sublabel: 'Bounty leaderboard', href: '/bounties', icon: Trophy },
  { kind: 'page', label: 'Zaman Çizelgesi', sublabel: 'Kronolojik olaylar', href: '/timeline', icon: Clock },
  { kind: 'page', label: 'Mürettebatlar', sublabel: '12 korsan mürettebatı', href: '/crews', icon: Anchor },
  { kind: 'page', label: 'Efsanevi Savaşlar', sublabel: '12 ikonik dövüş', href: '/battles', icon: BookOpen },
  { kind: 'page', label: 'İzleme Rehberi', sublabel: 'Nereden başla?', href: '/guide', icon: Compass },
]

const KIND_LABELS: Record<ResultKind, string> = {
  character: 'Karakter',
  arc: 'Arc',
  fruit: 'Şeytan Meyvesi',
  page: 'Sayfa',
}

const KIND_COLORS: Record<ResultKind, string> = {
  character: 'text-sea-light',
  arc: 'text-gold',
  fruit: 'text-purple-400',
  page: 'text-pirate-muted',
}

const ALL_RESULTS: Result[] = [
  ...PAGES,
  ...CHARACTERS.map((c) => ({
    kind: 'character' as ResultKind,
    label: c.name,
    sublabel: c.epithet || c.role || c.description.slice(0, 60),
    href: `/characters/${c.slug}`,
    icon: Users,
  })),
  ...ARCS.map((a) => ({
    kind: 'arc' as ResultKind,
    label: a.name,
    sublabel: `${a.episodeCount} bölüm • ${a.saga ?? ''}`.trim(),
    href: `/arcs/${a.slug}`,
    icon: Compass,
  })),
  ...DEVIL_FRUITS.map((f) => ({
    kind: 'fruit' as ResultKind,
    label: f.name,
    sublabel: `${f.type} • ${f.user}`,
    href: `/devil-fruits/${f.slug}`,
    icon: Cherry,
  })),
]

function scoreMatch(query: string, text: string): number {
  if (!query) return 0
  const q = query.toLowerCase()
  const t = text.toLowerCase()
  if (t === q) return 100
  if (t.startsWith(q)) return 80
  const wordStartMatch = new RegExp(`\\b${q}`).test(t)
  if (wordStartMatch) return 60
  if (t.includes(q)) return 40
  return 0
}

function search(query: string): Result[] {
  if (!query.trim()) {
    return PAGES
  }
  const scored = ALL_RESULTS.map((r) => {
    const labelScore = scoreMatch(query, r.label)
    const subScore = r.sublabel ? scoreMatch(query, r.sublabel) * 0.4 : 0
    return { r, score: labelScore + subScore }
  })
  return scored
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 20)
    .map((x) => x.r)
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const results = useMemo(() => search(query), [query])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((v) => !v)
      } else if (e.key === 'Escape' && open) {
        setOpen(false)
      }
    }
    const onExternalOpen = () => setOpen(true)
    window.addEventListener('keydown', onKey)
    window.addEventListener('open-command-palette', onExternalOpen)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('open-command-palette', onExternalOpen)
    }
  }, [open])

  useEffect(() => {
    if (open) {
      setQuery('')
      setActive(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  useEffect(() => {
    setActive(0)
  }, [query])

  const go = useCallback(
    (href: string) => {
      setOpen(false)
      router.push(href)
    },
    [router],
  )

  const onInputKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const selected = results[active]
      if (selected) go(selected.href)
    }
  }

  useEffect(() => {
    if (!open || !listRef.current) return
    const activeEl = listRef.current.querySelector<HTMLElement>(`[data-idx="${active}"]`)
    activeEl?.scrollIntoView({ block: 'nearest' })
  }, [active, open])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[100] bg-ocean-deep/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          <motion.div
            role="dialog"
            aria-label="Komut paleti"
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="surface fixed left-1/2 top-24 z-[101] w-[92vw] max-w-2xl -translate-x-1/2 overflow-hidden rounded-2xl"
          >
            <div className="flex items-center gap-3 border-b border-pirate-border/20 px-5 py-4">
              <Search className="h-5 w-5 text-gold/70" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onInputKey}
                placeholder="Karakter, arc, şeytan meyvesi veya sayfa ara..."
                className="flex-1 bg-transparent text-sm text-pirate-text placeholder:text-pirate-muted/50 focus:outline-none sm:text-base"
                aria-label="Arama"
              />
              <kbd className="hidden items-center gap-1 rounded border border-pirate-border/40 bg-ocean-surface/60 px-2 py-0.5 text-[10px] font-bold text-pirate-muted sm:inline-flex">
                ESC
              </kbd>
            </div>

            <div ref={listRef} className="max-h-[50vh] overflow-y-auto scrollbar-thin">
              {results.length === 0 ? (
                <div className="px-5 py-10 text-center">
                  <Search className="mx-auto mb-3 h-10 w-10 text-pirate-muted/30" />
                  <p className="text-sm text-pirate-muted">
                    &ldquo;<span className="text-gold">{query}</span>&rdquo; için sonuç yok
                  </p>
                  <p className="mt-1 text-[11px] text-pirate-muted/50">
                    Farklı bir terim dene
                  </p>
                </div>
              ) : (
                <div className="p-2">
                  {results.map((r, i) => {
                    const Icon = r.icon
                    const isActive = i === active
                    return (
                      <button
                        key={`${r.kind}-${r.href}`}
                        data-idx={i}
                        onMouseEnter={() => setActive(i)}
                        onClick={() => go(r.href)}
                        className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                          isActive ? 'bg-gold/[0.06] border border-gold/15' : 'border border-transparent'
                        }`}
                      >
                        <div
                          className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${
                            isActive ? 'bg-gold/10' : 'bg-ocean-surface/60'
                          }`}
                        >
                          <Icon className={`h-4 w-4 ${isActive ? 'text-gold' : KIND_COLORS[r.kind]}`} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-pirate-text">
                            {r.label}
                          </p>
                          {r.sublabel && (
                            <p className="truncate text-[11px] text-pirate-muted/70">
                              {r.sublabel}
                            </p>
                          )}
                        </div>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                            isActive ? 'bg-gold/10 text-gold' : 'bg-ocean-surface/60 text-pirate-muted/60'
                          }`}
                        >
                          {KIND_LABELS[r.kind]}
                        </span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-pirate-border/20 px-5 py-2.5 text-[10px] text-pirate-muted/60">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="rounded border border-pirate-border/40 bg-ocean-surface/60 px-1.5 py-0.5 font-mono font-semibold">
                    <ArrowUp className="inline h-2.5 w-2.5" />
                    <ArrowDown className="inline h-2.5 w-2.5" />
                  </kbd>
                  Gezin
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="rounded border border-pirate-border/40 bg-ocean-surface/60 px-1.5 py-0.5 font-mono font-semibold">
                    <CornerDownLeft className="inline h-2.5 w-2.5" />
                  </kbd>
                  Git
                </span>
              </div>
              <span>{results.length} sonuç</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
