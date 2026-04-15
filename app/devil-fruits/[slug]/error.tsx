'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, Cherry, RotateCcw } from 'lucide-react'

export default function DevilFruitError({
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
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-purple-500/20 bg-purple-500/[0.06]">
          <AlertTriangle className="h-10 w-10 text-purple-400" />
        </div>

        <h1 className="text-2xl font-bold text-pirate-text mb-3">
          Şeytan Meyvesi bilgileri yüklenemedi!
        </h1>
        <p className="text-pirate-muted mb-8">
          Bu meyvenin sırları şu anda ulaşılamıyor. Belki de deniz taşı etkisi...
        </p>

        <div className="flex items-center justify-center gap-3">
          <button onClick={reset} className="btn-gold">
            <RotateCcw className="h-4 w-4" />
            Tekrar Dene
          </button>
          <Link href="/devil-fruits" className="btn-ghost">
            <Cherry className="h-4 w-4" />
            Tüm Meyveler
          </Link>
        </div>
      </div>
    </main>
  )
}
