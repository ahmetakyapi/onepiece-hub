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
  Swords,
  Zap,
} from 'lucide-react'
import { CHARACTERS } from '@/lib/constants/characters'
import { ARCS } from '@/lib/constants/arcs'
import { DEVIL_FRUITS } from '@/lib/constants/devil-fruits'
import { SITE_STATS } from '@/lib/constants/stats'

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
  { kind: 'page', label: 'Sagalar', sublabel: `${SITE_STATS.sagas} destansı saga showcase`, href: '/sagas', icon: BookOpen },
  { kind: 'page', label: 'Karakterler', sublabel: `${SITE_STATS.characters} karakter ansiklopedisi`, href: '/characters', icon: Users },
  { kind: 'page', label: "Arc'lar", sublabel: `${SITE_STATS.arcs} arc, ${SITE_STATS.episodes} filler'sız bölüm`, href: '/arcs', icon: Compass },
  { kind: 'page', label: 'Şeytan Meyveleri', sublabel: `${SITE_STATS.devilFruits} meyve ve güçleri`, href: '/devil-fruits', icon: Cherry },
  { kind: 'page', label: 'Dünya Haritası', sublabel: `${SITE_STATS.locations} lokasyon`, href: '/world', icon: Map },
  { kind: 'page', label: 'Haki Rehberi', sublabel: '3 Haki türü detayı', href: '/haki', icon: Shield },
  { kind: 'page', label: 'Güç Sıralaması', sublabel: 'Karakter stat leaderboard', href: '/power', icon: Swords },
  { kind: 'page', label: 'Teknikler', sublabel: 'Haki, meyve ve özel saldırılar', href: '/techniques', icon: Zap },
  { kind: 'page', label: 'Karşılaştır', sublabel: 'İki karakteri yan yana kıyasla', href: '/vs', icon: Swords },
  { kind: 'page', label: 'Ödül Sıralaması', sublabel: 'Bounty leaderboard', href: '/bounties', icon: Trophy },
  { kind: 'page', label: 'Zaman Çizelgesi', sublabel: 'Kronolojik olaylar', href: '/timeline', icon: Clock },
  { kind: 'page', label: 'Mürettebatlar', sublabel: `${SITE_STATS.crews} korsan mürettebatı`, href: '/crews', icon: Anchor },
  { kind: 'page', label: 'Efsanevi Savaşlar', sublabel: `${SITE_STATS.battles} ikonik dövüş`, href: '/battles', icon: BookOpen },
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
  fruit: 'text-fruit',
  page: 'text-pirate-muted',
}

/* Grup başlıklarının sabit sırası — sonuçlar hangi sırada gelirse gelsin
   paletin dikey düzeni değişmez, göz kas hafızası korunur. */
const KIND_ORDER: readonly ResultKind[] = ['page', 'character', 'arc', 'fruit'] as const

type ResultGroup = {
  kind: ResultKind
  /** Klavye gezinmesi düz liste üzerinden yürür — satırın global indeksi taşınır. */
  items: Array<{ result: Result; index: number }>
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
  const q = normalizeSearchText(query.trim())
  const t = normalizeSearchText(text)
  if (!q) return 0
  if (t === q) return 100
  if (t.startsWith(q)) return 80
  const wordStartMatch = new RegExp(`\\b${escapeRegExp(q)}`).test(t)
  if (wordStartMatch) return 60
  if (t.includes(q)) return 40
  return 0
}

function normalizeSearchText(value: string): string {
  return value
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
    .replace(/ş/g, 's')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
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

  const groups = useMemo<ResultGroup[]>(() => {
    // NOT: bu dosyada `Map` lucide ikonu olarak import edilmiş — sözlük için
    // Map yerine düz nesne kullanılıyor.
    const buckets: Record<ResultKind, Result[]> = {
      page: [],
      character: [],
      arc: [],
      fruit: [],
    }
    results.forEach((result) => {
      buckets[result.kind].push(result)
    })
    /* `index` GÖRSEL sıraya göre yeniden numaralanır (grup grup akarak),
       skor sırasına göre değil. Sonuçlar skora göre karışık geliyor ama
       ekranda page → character → arc → fruit diziliyor; ok tuşları düz
       `results` dizisini yürüseydi seçim ekranda ileri geri zıplardı. */
    let visualIndex = 0
    return KIND_ORDER.filter((kind) => buckets[kind].length > 0).map((kind) => ({
      kind,
      items: buckets[kind].map((result) => ({ result, index: visualIndex++ })),
    }))
  }, [results])

  /* Klavye gezinmesinin ve Enter'ın üzerinde yürüdüğü dizi — görsel sıra. */
  const ordered = useMemo(
    () => groups.flatMap((group) => group.items.map((item) => item.result)),
    [groups],
  )

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
      window.dispatchEvent(new Event('route-loading:start'))
      router.push(href)
    },
    [router],
  )

  const onInputKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => Math.min(i + 1, ordered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const selected = ordered[active]
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
            /* Modal karartması iki temada da KOYU kalır. `ocean-deep`
               kullanılamaz: light'ta parşömene döndüğü için karartma
               yerine açık bir yıkama oluyor ve beyaz panel zeminden
               ayrışmıyordu. */
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          <div className="pointer-events-none fixed inset-0 z-[101] flex items-center justify-center p-3 sm:p-4">
          <motion.div
            role="dialog"
            aria-label="Komut paleti"
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="surface pointer-events-auto flex max-h-[85vh] w-full flex-col overflow-hidden rounded-2xl sm:max-w-2xl"
          >
            <div className="flex items-center gap-3 border-b border-pirate-border/20 px-4 py-3.5 sm:px-5 sm:py-4">
              <Search className="h-4 w-4 flex-shrink-0 text-gold/70 sm:h-5 sm:w-5" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onInputKey}
                placeholder="Ara..."
                className="flex-1 bg-transparent text-sm text-pirate-text placeholder:text-pirate-muted/50 focus:outline-none sm:text-base"
                aria-label="Arama"
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Kapat"
                className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg border border-pirate-border/40 bg-ocean-surface/60 text-pirate-muted transition-colors hover:text-pirate-text sm:hidden"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
              <kbd className="hidden items-center gap-1 rounded border border-pirate-border/40 bg-ocean-surface/60 px-2 py-0.5 font-mono text-[10px] font-bold text-pirate-muted sm:inline-flex">
                ESC
              </kbd>
            </div>

            <div ref={listRef} className="flex-1 overflow-y-auto scrollbar-thin">
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
                  {groups.map((group) => (
                    <div key={group.kind} className="mb-1 last:mb-0">
                      <p className="eyebrow px-3 pb-1.5 pt-2 text-pirate-muted/60">
                        {KIND_LABELS[group.kind]}
                        <span className="ml-2 text-pirate-muted/35">{group.items.length}</span>
                      </p>
                      {group.items.map(({ result: r, index: i }) => {
                        const Icon = r.icon
                        const isActive = i === active
                        return (
                          <button
                            key={`${r.kind}-${r.href}`}
                            data-idx={i}
                            onMouseEnter={() => setActive(i)}
                            onClick={() => go(r.href)}
                            className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                              isActive
                                ? 'border border-gold/25 bg-gold/[0.08]'
                                : 'border border-transparent'
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
                              <p
                                className={`truncate text-sm font-semibold ${
                                  isActive ? 'text-gold' : 'text-pirate-text'
                                }`}
                              >
                                {r.label}
                              </p>
                              {r.sublabel && (
                                <p className="truncate text-[11px] text-pirate-muted/70">
                                  {r.sublabel}
                                </p>
                              )}
                            </div>
                            {/* Seçili satırın sağındaki ↵ göstergesi — Enter'ın nereye gideceğini söyler */}
                            <span
                              aria-hidden
                              className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md border transition-opacity ${
                                isActive
                                  ? 'border-gold/25 bg-gold/10 text-gold opacity-100'
                                  : 'border-transparent opacity-0'
                              }`}
                            >
                              <CornerDownLeft className="h-3 w-3" />
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  ))}
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
              <span className="font-mono">{results.length} sonuç</span>
            </div>
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
