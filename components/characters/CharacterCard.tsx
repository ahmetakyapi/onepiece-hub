'use client'

import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion'
import Link from 'next/link'
import { Anchor, Skull, Sparkles, ArrowRight } from 'lucide-react'
import { memo, useRef, useCallback, useEffect, useState } from 'react'
import { fadeUp } from '@/lib/variants'
import CharacterAvatar from '@/components/ui/CharacterAvatar'
import { CREW_LABELS } from '@/lib/constants/characters'
import { CREW_COLORS, CREW_RGB } from '@/lib/constants/crew-styles'
import { parseBounty, formatBounty } from '@/lib/utils'
import { useViewTransition } from '@/hooks/useViewTransition'
import type { Character } from '@/types'

type Props = { character: Character }

function CharacterCard({ character }: Props) {
  const char = character
  const colors = CREW_COLORS[char.crew] || CREW_COLORS.other
  const bountyValue = parseBounty(char.bounty)
  const navigate = useViewTransition()

  const ref = useRef<HTMLDivElement>(null)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const rx = useSpring(useMotionValue(0), { stiffness: 220, damping: 22 })
  const ry = useSpring(useMotionValue(0), { stiffness: 220, damping: 22 })
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)
  const hoverProgress = useSpring(useMotionValue(0), { stiffness: 200, damping: 25 })

  const onMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current || reducedMotion) return
    const r = ref.current.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    rx.set(-(py - 0.5) * 6)
    ry.set((px - 0.5) * 6)
    mouseX.set(px)
    mouseY.set(py)
  }, [rx, ry, mouseX, mouseY, reducedMotion])

  const crewRgb = CREW_RGB[char.crew] || CREW_RGB.other

  const onEnter = useCallback((e: React.MouseEvent) => {
    if (!reducedMotion) hoverProgress.set(1)
    const layer = document.getElementById('crew-ambient')
    if (!layer) return
    layer.style.setProperty('--crew-rgb', crewRgb)
    layer.style.setProperty('--crew-x', `${e.clientX}px`)
    layer.style.setProperty('--crew-y', `${e.clientY}px`)
    layer.style.opacity = '1'
  }, [hoverProgress, reducedMotion, crewRgb])

  const onLeave = useCallback(() => {
    rx.set(0)
    ry.set(0)
    mouseX.set(0.5)
    mouseY.set(0.5)
    hoverProgress.set(0)
    const layer = document.getElementById('crew-ambient')
    if (layer) layer.style.opacity = '0'
  }, [rx, ry, mouseX, mouseY, hoverProgress])

  const spotX = useTransform(mouseX, [0, 1], ['0%', '100%'])
  const spotY = useTransform(mouseY, [0, 1], ['0%', '100%'])
  const spotlight = useMotionTemplate`radial-gradient(520px circle at ${spotX} ${spotY}, rgba(244,163,0,0.20), rgba(30,144,255,0.10) 30%, transparent 60%)`

  const imageScale = useTransform(hoverProgress, [0, 1], [1, 1.14])
  const ghostOpacity = useTransform(hoverProgress, [0, 0.5, 1], [0, 0.15, 0.28])
  const nameLift = useTransform(hoverProgress, [0, 1], [0, -6])

  return (
    <motion.div variants={fadeUp} style={{ perspective: '1100px' }}>
      <motion.div
        ref={ref}
        style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }}
        onMouseMove={onMove}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        className="h-full"
      >
        <Link
          href={`/characters/${char.slug}`}
          onClick={(e) => {
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
            e.preventDefault()
            navigate(`/characters/${char.slug}`)
          }}
          className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-pirate-border/20 bg-ocean-surface/30 backdrop-blur-sm transition-[border-color,box-shadow] duration-500 hover:border-pirate-border/40 hover:shadow-[0_24px_60px_rgba(2,6,23,0.55),0_0_0_1px_rgba(244,163,0,0.08)]"
        >
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{ background: spotlight }}
          />

          <div className="relative h-52 overflow-hidden">
            <motion.div
              aria-hidden
              className="absolute inset-x-[-8%] top-0 h-full"
              style={{ opacity: ghostOpacity, translateX: '-6%' }}
            >
              <CharacterAvatar
                slug={char.slug}
                name={char.name}
                crew={char.crew}
                className="h-full w-full blur-[2px] saturate-[1.4]"
                sizes="25vw"
              />
            </motion.div>
            <motion.div
              aria-hidden
              className="absolute inset-x-[-8%] top-0 h-full"
              style={{ opacity: ghostOpacity, translateX: '6%' }}
            >
              <CharacterAvatar
                slug={char.slug}
                name={char.name}
                crew={char.crew}
                className="h-full w-full blur-[2px] saturate-[1.4]"
                sizes="25vw"
              />
            </motion.div>

            <motion.div
              className="absolute inset-0 origin-center"
              style={{ scale: imageScale, viewTransitionName: `character-image-${char.slug}` }}
            >
              <CharacterAvatar
                slug={char.slug}
                name={char.name}
                crew={char.crew}
                className="h-full w-full"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            </motion.div>

            <div className="absolute inset-0 bg-gradient-to-t from-ocean-deep via-ocean-deep/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-ocean-deep/30" />

            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div
                className="absolute -left-full top-0 h-full w-2/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent transition-transform duration-[900ms] ease-out group-hover:translate-x-[260%]"
              />
            </div>

            {char.epithet && (
              <div className="absolute left-3 top-3 z-10">
                <span className={`inline-flex items-center gap-1 rounded-lg border ${colors.border} ${colors.bg} px-2 py-0.5 text-[10px] font-bold ${colors.text} backdrop-blur-md`}>
                  {char.epithet}
                </span>
              </div>
            )}

            {char.bounty && (
              <div className="absolute right-3 top-3 z-10">
                <span className="inline-flex items-center gap-1 rounded-lg border border-gold/20 bg-ocean-deep/60 px-2 py-0.5 text-[10px] font-bold text-gold backdrop-blur-md">
                  <Skull className="h-2.5 w-2.5" />
                  {formatBounty(bountyValue)}
                </span>
              </div>
            )}

            <motion.div
              className="absolute bottom-0 left-0 right-0 z-10 p-4"
              style={{ y: nameLift }}
            >
              <h3 className="text-base font-extrabold tracking-tight text-pirate-text transition-colors duration-300 group-hover:text-gold drop-shadow-[0_2px_12px_rgba(0,0,0,0.75)]">
                {char.name}
              </h3>
            </motion.div>
          </div>

          <div className="flex flex-1 flex-col p-4 pt-2">
            <div className="mb-2.5">
              <span
                className={`inline-flex items-center gap-1.5 rounded-md border ${colors.border} ${colors.bg} px-2 py-0.5 text-[10px] font-semibold ${colors.text}`}
              >
                <Anchor className="h-2.5 w-2.5" />
                {CREW_LABELS[char.crew]}
              </span>
            </div>

            <p className="line-clamp-2 text-[11px] leading-relaxed text-pirate-muted/70">
              {char.description}
            </p>

            {char.devilFruit && (
              <div className="mt-2 flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-purple-400/70" />
                <span className="truncate text-[10px] text-purple-400/70">
                  {char.devilFruit.name}
                </span>
              </div>
            )}

            <div className="mt-auto flex items-center justify-between border-t border-pirate-border/10 pt-3 mt-3">
              {char.bounty ? (
                <div className="flex items-baseline gap-1">
                  <span className="text-[10px] text-pirate-muted/40">Ödül</span>
                  <span className="text-xs font-bold text-gold tabular-nums">
                    {char.bounty}
                  </span>
                </div>
              ) : (
                <span className="text-[10px] text-pirate-muted/30">Ödül bilinmiyor</span>
              )}
              <div className="flex items-center gap-1 text-[10px] text-pirate-muted/30 transition-all duration-300 group-hover:text-gold/60">
                <span className="hidden sm:inline">Detay</span>
                <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  )
}

export default memo(CharacterCard)
