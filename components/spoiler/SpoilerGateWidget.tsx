'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, X, Check, Shield } from 'lucide-react'
import { ARCS } from '@/lib/constants/arcs'
import { SAGAS } from '@/lib/constants/sagas'
import { modalBackdrop, modalPanel, EASE } from '@/lib/variants'
import { useSpoilerGate } from '@/hooks/useSpoilerGate'

export default function SpoilerGateWidget() {
  const { enabled, currentArcSlug, currentArcIndex, mounted, setEnabled, setCurrentArc } = useSpoilerGate()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open])

  if (!mounted) return null

  const currentArc = currentArcSlug ? ARCS.find(a => a.slug === currentArcSlug) : null
  const totalArcs = ARCS.length

  // Group arcs by saga for the picker
  const groupedArcs = SAGAS.map(saga => ({
    saga,
    arcs: saga.arcs
      .map(slug => ARCS.find(a => a.slug === slug))
      .filter((a): a is NonNullable<typeof a> => Boolean(a)),
  }))

  return (
    <>
      {/* Floating pill — desktop shows text, mobile shows icon-only above bottom nav */}
      <motion.button
        initial={{ opacity: 0, y: 12, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: EASE, delay: 0.6 }}
        onClick={() => setOpen(true)}
        style={{ bottom: 'calc(max(env(safe-area-inset-bottom), 0px) + 88px)' }}
        className={`fixed right-4 z-40 inline-flex items-center gap-2 rounded-full border px-3 py-2.5 text-xs font-semibold backdrop-blur-md transition-all hover:-translate-y-0.5 hover:shadow-lg md:!bottom-6 md:left-6 md:right-auto md:px-4 ${
          enabled
            ? 'border-luffy/40 bg-luffy/[0.08] text-luffy hover:bg-luffy/[0.12]'
            : 'border-pirate-border/40 bg-ocean-deep/80 text-pirate-muted hover:text-pirate-text hover:border-gold/40'
        }`}
        aria-label="Spoiler ayarları"
      >
        {enabled ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
        <span className="hidden sm:inline">
          {enabled
            ? currentArc ? `Spoiler: ${currentArcIndex + 1}/${totalArcs}` : 'Spoiler Koru'
            : 'Spoiler Ayarı'}
        </span>
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              variants={modalBackdrop}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[60] bg-ocean-deep/80 backdrop-blur-md"
            />
            <motion.div
              variants={modalPanel}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="fixed inset-x-4 top-1/2 z-[70] mx-auto -translate-y-1/2 rounded-2xl border border-pirate-border/40 bg-ocean-elevated shadow-2xl sm:inset-auto sm:left-1/2 sm:-translate-x-1/2 sm:max-w-lg sm:w-[90vw]"
              style={{ top: '50%' }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="spoiler-gate-title"
            >
              {/* Header */}
              <div className="flex items-start gap-4 border-b border-pirate-border/20 p-5">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-gold/20 bg-gold/10">
                  <Shield className="h-5 w-5 text-gold" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 id="spoiler-gate-title" className="text-lg font-extrabold text-pirate-text">
                    Spoiler Koruması
                  </h2>
                  <p className="mt-0.5 text-xs text-pirate-muted sm:text-sm">
                    İzlediğin son arc&apos;ı seç; sonraki arc kartları bulanıklaştırılır.
                  </p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-pirate-muted hover:bg-ocean-surface hover:text-pirate-text transition-colors"
                  aria-label="Kapat"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Toggle */}
              <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-pirate-border/15">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-pirate-text">Spoiler Korumasını Aç</p>
                  <p className="text-[11px] text-pirate-muted mt-0.5">
                    Yalnızca arc listelerinde uygulanır
                  </p>
                </div>
                <button
                  onClick={() => setEnabled(!enabled)}
                  className={`relative h-7 w-12 flex-shrink-0 rounded-full transition-colors ${
                    enabled ? 'bg-luffy' : 'bg-ocean-surface border border-pirate-border/40'
                  }`}
                  role="switch"
                  aria-checked={enabled}
                >
                  <motion.span
                    animate={{ x: enabled ? 22 : 2 }}
                    transition={{ duration: 0.25, ease: EASE }}
                    className="absolute top-1 h-5 w-5 rounded-full bg-white shadow"
                  />
                </button>
              </div>

              {/* Arc picker (only when enabled) */}
              <div className={`transition-all ${enabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                <div className="px-5 pb-2 pt-4">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gold/70">
                    Son İzlediğin Arc
                  </p>
                  {currentArc && (
                    <div className="mb-3 inline-flex items-center gap-2 rounded-lg border border-gold/20 bg-gold/[0.06] px-3 py-1.5">
                      <Check className="h-3 w-3 text-gold" />
                      <span className="text-xs font-semibold text-gold">
                        {currentArc.name}
                      </span>
                    </div>
                  )}
                </div>
                <div className="max-h-72 overflow-y-auto scrollbar-thin px-5 pb-5 space-y-3">
                  {groupedArcs.map(({ saga, arcs }) => (
                    <div key={saga.slug}>
                      <p className="mb-1.5 text-[9px] font-bold uppercase tracking-wider text-pirate-muted/60">
                        {saga.name}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {arcs.map(arc => {
                          const isCurrent = arc.slug === currentArcSlug
                          return (
                            <button
                              key={arc.slug}
                              onClick={() => setCurrentArc(isCurrent ? null : arc.slug)}
                              className={`rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition-all ${
                                isCurrent
                                  ? 'border-gold/40 bg-gold/15 text-gold shadow-[0_0_16px_rgba(244,163,0,0.2)]'
                                  : 'border-pirate-border/30 bg-ocean-surface/40 text-pirate-muted hover:border-gold/30 hover:text-pirate-text'
                              }`}
                            >
                              {arc.name}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer actions */}
              <div className="flex items-center justify-between gap-3 border-t border-pirate-border/15 p-4">
                {currentArc ? (
                  <button
                    onClick={() => setCurrentArc(null)}
                    className="text-xs font-semibold text-pirate-muted hover:text-luffy transition-colors"
                  >
                    Sıfırla
                  </button>
                ) : (
                  <span className="text-xs text-pirate-muted/60">Bir arc seç</span>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="btn-gold !py-2 text-xs"
                >
                  Tamam
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
