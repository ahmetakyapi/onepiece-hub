'use client'

import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

type StartViewTransition = (cb: () => void | Promise<void>) => {
  finished: Promise<void>
  ready: Promise<void>
  updateCallbackDone: Promise<void>
  skipTransition: () => void
}

function isSupported(): boolean {
  return typeof document !== 'undefined' && 'startViewTransition' in document
}

export function useViewTransition() {
  const router = useRouter()

  const navigate = useCallback(
    (href: string) => {
      if (!isSupported()) {
        router.push(href)
        return
      }
      const start = (document as unknown as { startViewTransition: StartViewTransition }).startViewTransition
      start(() => {
        router.push(href)
        return new Promise<void>((resolve) => {
          requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
        })
      })
    },
    [router],
  )

  return navigate
}
