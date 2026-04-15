'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, Home, RotateCcw } from 'lucide-react'

export default function Error({
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
      <div className="orb absolute w-[300px] h-[300px] rounded-full blur-[120px] opacity-20" style={{ background: 'rgba(231, 76, 60, 0.4)', top: '20%', left: '15%' }} />

      <div className="text-center max-w-md mx-auto relative z-10">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-luffy/20 bg-luffy/[0.06]">
          <AlertTriangle className="h-10 w-10 text-luffy" />
        </div>

        <h1 className="text-2xl font-bold text-pirate-text mb-3">
          Bir fırtına çıktı!
        </h1>
        <p className="text-pirate-muted mb-2">
          Beklenmedik bir hata oluştu. Gemi sallanıyor ama batmadık!
        </p>
        <p className="text-pirate-muted/50 text-sm mb-8 italic">
          &ldquo;Bir korsan asla pes etmez!&rdquo;
        </p>

        <div className="flex items-center justify-center gap-3">
          <button onClick={reset} className="btn-gold">
            <RotateCcw className="h-4 w-4" />
            Tekrar Dene
          </button>
          <Link href="/" className="btn-ghost">
            <Home className="h-4 w-4" />
            Ana Sayfa
          </Link>
        </div>
      </div>
    </main>
  )
}
