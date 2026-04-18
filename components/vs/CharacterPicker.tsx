'use client'

import { memo, useMemo, useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, UserPlus, ChevronDown } from 'lucide-react'
import { CHARACTERS } from '@/lib/constants/characters'
import { getCharacterImage } from '@/lib/constants/images'
import { EASE } from '@/lib/variants'
import type { Character } from '@/types'

interface Props {
  value: Character | null
  onSelect: (char: Character | null) => void
  accent: 'luffy' | 'sea'
  disabledSlug?: string
  label: string
}

function CharacterPicker({ value, onSelect, accent, disabledSlug, label }: Props) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handle = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [open])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    const list = q
      ? CHARACTERS.filter(c =>
          c.name.toLowerCase().includes(q) ||
          (c.epithet && c.epithet.toLowerCase().includes(q)) ||
          c.slug.includes(q)
        )
      : CHARACTERS
    return list.slice(0, 30)
  }, [search])

  const accentClasses = accent === 'luffy'
    ? { border: 'border-luffy/40', bg: 'bg-luffy/[0.04]', glow: 'shadow-[0_0_40px_rgba(231,76,60,0.15)]', text: 'text-luffy', focus: 'focus:border-luffy/60 focus:ring-luffy/20' }
    : { border: 'border-sea/40', bg: 'bg-sea/[0.04]', glow: 'shadow-[0_0_40px_rgba(30,144,255,0.15)]', text: 'text-sea', focus: 'focus:border-sea/60 focus:ring-sea/20' }

  return (
    <div ref={containerRef} className="relative">
      <p className={`mb-2 text-[10px] font-bold uppercase tracking-[0.25em] ${accentClasses.text}`}>
        {label}
      </p>

      {value ? (
        <button
          onClick={() => setOpen(!open)}
          className={`group relative w-full overflow-hidden rounded-2xl border-2 ${accentClasses.border} ${accentClasses.bg} ${accentClasses.glow} p-5 text-left transition-all hover:brightness-110`}
        >
          <div className="flex items-center gap-4">
            <div className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 ${accentClasses.border}`}>
              <Image
                src={getCharacterImage(value.slug)}
                alt={value.name}
                fill
                className="object-cover object-top"
                sizes="80px"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-lg font-extrabold text-pirate-text sm:text-xl">
                {value.name}
              </p>
              {value.epithet && (
                <p className={`mt-0.5 truncate text-xs font-semibold ${accentClasses.text}`}>
                  {value.epithet}
                </p>
              )}
              {value.bounty && (
                <p className="mt-1 text-xs text-pirate-muted">
                  <span className="font-bold text-gold stat-number">{value.bounty}</span> Berry
                </p>
              )}
            </div>
            <ChevronDown className="h-5 w-5 text-pirate-muted/60 transition-transform group-hover:text-pirate-text" />
          </div>

          <span
            role="button"
            tabIndex={0}
            onClick={(e) => { e.stopPropagation(); onSelect(null) }}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); onSelect(null) } }}
            className="absolute right-3 top-3 inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-ocean-deep/60 text-pirate-muted opacity-0 transition-all hover:bg-luffy/20 hover:text-luffy group-hover:opacity-100"
            aria-label="Değiştir"
          >
            <X className="h-3.5 w-3.5" />
          </span>
        </button>
      ) : (
        <button
          onClick={() => setOpen(!open)}
          className={`flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-dashed ${accentClasses.border} bg-ocean-surface/20 px-6 py-10 transition-all hover:bg-ocean-surface/40 hover:brightness-110`}
        >
          <div className={`flex h-12 w-12 items-center justify-center rounded-full ${accentClasses.bg} border ${accentClasses.border}`}>
            <UserPlus className={`h-5 w-5 ${accentClasses.text}`} />
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-pirate-text">Karakter Seç</p>
            <p className="text-xs text-pirate-muted">Tıkla ve ara</p>
          </div>
        </button>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: EASE }}
            className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-pirate-border/40 bg-ocean-elevated/95 backdrop-blur-xl shadow-2xl"
          >
            <div className="border-b border-pirate-border/20 p-3">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-pirate-muted/50" />
                <input
                  autoFocus
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Karakter ara..."
                  className={`w-full rounded-lg border border-pirate-border/30 bg-ocean-deep/50 px-9 py-2 text-sm text-pirate-text placeholder:text-pirate-muted/50 focus:outline-none focus:ring-2 transition-all ${accentClasses.focus}`}
                />
              </div>
            </div>

            <div className="max-h-72 overflow-y-auto scrollbar-thin p-1.5">
              {filtered.length > 0 ? (
                filtered.map((char) => {
                  const isDisabled = char.slug === disabledSlug
                  return (
                    <button
                      key={char.slug}
                      onClick={() => {
                        if (isDisabled) return
                        onSelect(char)
                        setOpen(false)
                        setSearch('')
                      }}
                      disabled={isDisabled}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
                        isDisabled
                          ? 'cursor-not-allowed opacity-30'
                          : `hover:${accentClasses.bg}`
                      }`}
                    >
                      <div className="relative h-9 w-9 flex-shrink-0 overflow-hidden rounded-lg border border-pirate-border/30">
                        <Image
                          src={getCharacterImage(char.slug)}
                          alt={char.name}
                          fill
                          className="object-cover object-top"
                          sizes="36px"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-pirate-text">{char.name}</p>
                        {char.epithet && (
                          <p className="truncate text-[11px] text-pirate-muted">{char.epithet}</p>
                        )}
                      </div>
                    </button>
                  )
                })
              ) : (
                <p className="py-6 text-center text-sm text-pirate-muted">Sonuç bulunamadı</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default memo(CharacterPicker)
