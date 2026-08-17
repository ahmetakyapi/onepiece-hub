'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'

/* "Gece seferi" ⇄ "gündüz seferi" anahtarı.

   `mounted` guard: blocking script `data-theme`'i sunucudan gelen HTML'e
   göre değiştirebilir, o yüzden ikon hydrate olana kadar nötr kalır —
   yoksa React "sunucuda ay, istemcide güneş" uyumsuzluğu veriyor. */

type Props = {
  /** `bar` header'daki pill sırasına, `row` mobil çekmecedeki satıra oturur. */
  variant?: 'bar' | 'row'
  className?: string
}

export function ThemeToggle({ variant = 'bar', className }: Props) {
  const { theme, mounted, toggleTheme } = useTheme()

  const isLight = mounted && theme === 'light'
  const label = !mounted ? 'Temayı Değiştir' : isLight ? 'Gece Seferine Geç' : 'Gündüz Seferine Geç'

  if (variant === 'row') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 transition-colors hover:bg-ink/[0.04] ${className ?? ''}`}
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/[0.08]">
          {isLight ? <Moon className="h-4 w-4 text-gold" /> : <Sun className="h-4 w-4 text-gold" />}
        </span>
        <span className="text-sm font-semibold text-pirate-text">{label}</span>
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={label}
      aria-label={label}
      className={`flex h-9 w-9 items-center justify-center rounded-xl border border-pirate-border/40 bg-ocean-surface/40 text-pirate-muted transition-all duration-200 hover:border-gold/30 hover:bg-gold/[0.08] hover:text-gold ${className ?? ''}`}
    >
      {isLight ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
    </button>
  )
}
