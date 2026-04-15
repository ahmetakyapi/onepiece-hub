'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, Compass, RotateCcw } from 'lucide-react'

export default function ArcError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="relative flex min-h-screen items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto relative z-10">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-luffy/20 bg-luffy/[0.06]">
          <AlertTriangle className="h-10 w-10 text-luffy" />
        </div>

        <h1 className="text-2xl font-bold text-pirate-text mb-3">
          Arc bilgileri yüklenemedi!
        </h1>
        <p className="text-pirate-muted mb-8">
          Bu arc sayfası şu anda ulaşılamıyor. Rotayı tekrar kontrol edelim.
        </p>

        <div className="flex items-center justify-center gap-3">
          <button onClick={reset} className="btn-gold">
            <RotateCcw className="h-4 w-4" />
            Tekrar Dene
          </button>
          <Link href="/arcs" className="btn-ghost">
            <Compass className="h-4 w-4" />
            Tüm Arc&apos;lar
          </Link>
        </div>
      </div>
    </main>
  )
}
