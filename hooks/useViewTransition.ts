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
      try {
        const doc = document as unknown as { startViewTransition: StartViewTransition }
        // Must invoke through `document` to preserve `this` binding — destructuring breaks Chrome
        doc.startViewTransition(() => {
          router.push(href)
          return new Promise<void>((resolve) => {
            requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
          })
        })
      } catch {
        // Guard: if View Transitions API throws (e.g., nested transition), fall back
        router.push(href)
      }
    },
    [router],
  )

  return navigate
}
