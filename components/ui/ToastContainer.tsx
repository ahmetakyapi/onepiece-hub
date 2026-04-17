'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react'

type ToastKind = 'info' | 'success' | 'error'

type ToastItem = {
  id: number
  kind: ToastKind
  title: string
  message?: string
}

type ShowToastDetail = {
  kind?: ToastKind
  title: string
  message?: string
  duration?: number
}

const DEFAULT_DURATION = 4200
let nextId = 1

const ICONS: Record<ToastKind, typeof Info> = {
  info: Info,
  success: CheckCircle2,
  error: AlertTriangle,
}

const ICON_COLORS: Record<ToastKind, string> = {
  info: 'text-sea',
  success: 'text-emerald-400',
  error: 'text-luffy',
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const [exiting, setExiting] = useState<number[]>([])

  useEffect(() => {
    const onShow = (e: Event) => {
      const detail = (e as CustomEvent<ShowToastDetail>).detail
      if (!detail?.title) return
      const id = nextId++
      const toast: ToastItem = {
        id,
        kind: detail.kind ?? 'info',
        title: detail.title,
        message: detail.message,
      }
      setToasts((prev) => [...prev, toast])
      const duration = detail.duration ?? DEFAULT_DURATION
      window.setTimeout(() => dismiss(id), duration)
    }
    window.addEventListener('show-toast', onShow)
    return () => window.removeEventListener('show-toast', onShow)
  }, [])

  const dismiss = (id: number) => {
    setExiting((prev) => [...prev, id])
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
      setExiting((prev) => prev.filter((x) => x !== id))
    }, 250)
  }

  if (toasts.length === 0) return null

  return (
    <div className="toast-stack" role="region" aria-label="Bildirimler">
      {toasts.map((t) => {
        const Icon = ICONS[t.kind]
        const isExiting = exiting.includes(t.id)
        return (
          <div
            key={t.id}
            className={`toast-item toast-${t.kind} ${isExiting ? 'toast-exit' : ''}`}
            role="status"
          >
            <div className="mt-0.5 flex-shrink-0">
              <Icon className={`h-5 w-5 ${ICON_COLORS[t.kind]}`} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-pirate-text">{t.title}</p>
              {t.message && (
                <p className="mt-0.5 text-xs leading-relaxed text-pirate-muted">
                  {t.message}
                </p>
              )}
            </div>
            <button
              onClick={() => dismiss(t.id)}
              className="flex-shrink-0 rounded-full p-1 text-pirate-muted/60 transition-colors hover:bg-ocean-surface/60 hover:text-pirate-text"
              aria-label="Kapat"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
