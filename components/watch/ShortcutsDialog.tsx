'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Keyboard, X } from 'lucide-react'
import { modalBackdrop, modalPanel } from '@/lib/variants'
import { PLAYER_SHORTCUTS } from '@/lib/player-config'

type Props = {
  onClose: () => void
}

export default function ShortcutsDialog({ onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeRef.current?.focus()
  }, [])

  return (
    <>
      <motion.div
        variants={modalBackdrop}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={onClose}
        className="fixed inset-0 z-[300] bg-ocean-deep/80 backdrop-blur-sm"
      />
      <div className="pointer-events-none fixed inset-0 z-[301] flex items-center justify-center p-4">
        <motion.div
          variants={modalPanel}
          initial="hidden"
          animate="visible"
          exit="exit"
          role="dialog"
          aria-modal="true"
          aria-labelledby="shortcuts-title"
          className="surface pointer-events-auto w-full max-w-md p-5"
        >
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-gold/20 bg-gold/[0.08]">
                <Keyboard className="h-4 w-4 text-gold" />
              </span>
              <div>
                <h2 id="shortcuts-title" className="text-sm font-bold text-pirate-text">
                  Klavye kısayolları
                </h2>
                <p className="text-[11px] text-pirate-muted">
                  Video alanı dışına tıkladığında aktif olur
                </p>
              </div>
            </div>
            <button
              ref={closeRef}
              onClick={onClose}
              aria-label="Kısayol yardımını kapat"
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-pirate-border/60 text-pirate-muted transition-colors hover:border-gold/30 hover:text-gold"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <ul className="space-y-1">
            {PLAYER_SHORTCUTS.map((shortcut) => (
              <li
                key={shortcut.label}
                className="flex items-center justify-between gap-4 rounded-lg px-2 py-2 odd:bg-white/[0.02]"
              >
                <span className="text-[13px] text-pirate-text">{shortcut.label}</span>
                <span className="flex flex-shrink-0 items-center gap-1">
                  {shortcut.keys.map((key) => (
                    <kbd
                      key={key}
                      className="min-w-[1.75rem] rounded border border-pirate-border/70 bg-ocean-deep/70 px-1.5 py-0.5 text-center font-mono text-[11px] font-bold text-gold/90"
                    >
                      {key}
                    </kbd>
                  ))}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </>
  )
}
