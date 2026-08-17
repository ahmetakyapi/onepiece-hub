'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Compass } from 'lucide-react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'

const LONG_WAIT_DELAY = 260
const SAFETY_TIMEOUT = 12000

function isPlainLeftClick(e: MouseEvent) {
  return e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey
}

function shouldTrackAnchor(anchor: HTMLAnchorElement) {
  if (anchor.target && anchor.target !== '_self') return false
  if (anchor.hasAttribute('download')) return false

  const href = anchor.getAttribute('href')
  if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
    return false
  }

  const nextUrl = new URL(anchor.href, window.location.href)
  if (nextUrl.origin !== window.location.origin) return false

  const current = `${window.location.pathname}${window.location.search}`
  const next = `${nextUrl.pathname}${nextUrl.search}`
  return current !== next
}

export default function RouteLoadingIndicator() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const routeKey = `${pathname}?${searchParams.toString()}`
  const [active, setActive] = useState(false)
  const [showLabel, setShowLabel] = useState(false)
  const labelTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const safetyTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTimers = useCallback(() => {
    if (labelTimer.current) clearTimeout(labelTimer.current)
    if (safetyTimer.current) clearTimeout(safetyTimer.current)
    labelTimer.current = null
    safetyTimer.current = null
  }, [])

  const stop = useCallback(() => {
    clearTimers()
    setActive(false)
    setShowLabel(false)
  }, [clearTimers])

  const start = useCallback(() => {
    clearTimers()
    setActive(true)
    setShowLabel(false)
    labelTimer.current = setTimeout(() => setShowLabel(true), LONG_WAIT_DELAY)
    safetyTimer.current = setTimeout(stop, SAFETY_TIMEOUT)
  }, [clearTimers, stop])

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || !isPlainLeftClick(e)) return
      const target = e.target as HTMLElement | null
      const anchor = target?.closest<HTMLAnchorElement>('a[href]')
      if (!anchor || !shouldTrackAnchor(anchor)) return
      start()
    }

    const onManualStart = () => start()

    document.addEventListener('click', onClick)
    window.addEventListener('route-loading:start', onManualStart)
    return () => {
      document.removeEventListener('click', onClick)
      window.removeEventListener('route-loading:start', onManualStart)
      clearTimers()
    }
  }, [clearTimers, start])

  useEffect(() => {
    stop()
  }, [routeKey, stop])

  return (
    <AnimatePresence>
      {active && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-x-0 top-0 z-[120] h-[3px] overflow-hidden bg-ocean-surface/60"
            aria-hidden
          >
            <motion.div
              className="h-full w-1/3 rounded-full bg-gradient-to-r from-gold via-gold-bright to-sea-light shadow-[0_0_24px_rgb(var(--gold)/0.55)]"
              initial={{ x: '-120%' }}
              animate={{ x: '360%' }}
              transition={{ duration: 1.05, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>

          {showLabel && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              role="status"
              aria-live="polite"
              className="fixed right-4 top-5 z-[121] flex items-center gap-2 rounded-xl border border-gold/20 bg-ocean-deep/90 px-3.5 py-2 text-xs font-bold text-pirate-text shadow-[0_18px_48px_rgba(2,6,23,0.45)] backdrop-blur-xl sm:right-6 sm:top-6"
            >
              <Compass className="h-3.5 w-3.5 animate-spin text-gold" />
              Rota hazırlanıyor
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  )
}
