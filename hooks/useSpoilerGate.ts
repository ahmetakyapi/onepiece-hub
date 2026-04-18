'use client'

import { useCallback, useEffect, useState } from 'react'
import { ARCS } from '@/lib/constants/arcs'

const STORAGE_KEY = 'onepiece-spoiler-gate'

interface SpoilerGateState {
  enabled: boolean
  currentArcSlug: string | null
}

const DEFAULT_STATE: SpoilerGateState = {
  enabled: false,
  currentArcSlug: null,
}

export function useSpoilerGate() {
  const [state, setState] = useState<SpoilerGateState>(DEFAULT_STATE)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as SpoilerGateState
        setState({
          enabled: Boolean(parsed.enabled),
          currentArcSlug: typeof parsed.currentArcSlug === 'string' ? parsed.currentArcSlug : null,
        })
      }
    } catch {
      /* localStorage unavailable — keep defaults */
    }
  }, [])

  const persist = useCallback((next: SpoilerGateState) => {
    setState(next)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {}
  }, [])

  const setEnabled = useCallback((enabled: boolean) => {
    persist({ ...state, enabled })
  }, [state, persist])

  const setCurrentArc = useCallback((currentArcSlug: string | null) => {
    persist({ ...state, currentArcSlug })
  }, [state, persist])

  const currentArcIndex = state.currentArcSlug
    ? ARCS.findIndex(a => a.slug === state.currentArcSlug)
    : -1

  /**
   * Check if content from a specific arc should be hidden
   * Returns true if:
   * - gate is enabled
   * - user has set their current arc
   * - the target arc comes LATER than the user's current arc
   */
  const isSpoiler = useCallback((arcSlug: string | undefined) => {
    if (!mounted || !state.enabled || !arcSlug) return false
    const targetIndex = ARCS.findIndex(a => a.slug === arcSlug)
    if (targetIndex === -1 || currentArcIndex === -1) return false
    return targetIndex > currentArcIndex
  }, [mounted, state.enabled, currentArcIndex])

  return {
    enabled: state.enabled,
    currentArcSlug: state.currentArcSlug,
    currentArcIndex,
    mounted,
    setEnabled,
    setCurrentArc,
    isSpoiler,
  }
}
