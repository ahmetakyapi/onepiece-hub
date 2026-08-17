/* Marka işareti — pusula gülü.
   Server Component: saf SVG, hiçbir client API'si kullanmıyor.

   Renkler `currentColor` değil token: iğnenin altın kolu ile deniz kolu
   ayrı token'lardan besleniyor, böylece light temada ikisi de kendi koyu
   karşılığına dönüyor. `rgb(var(--x))` kullanımı bileşen içi tek istisna —
   SVG `fill`/`stroke` Tailwind sınıfıyla iki ayrı renk taşıyamıyor. */

type Props = {
  /** Kenar uzunluğu (px). Header 40, footer 32, giriş kartı 44. */
  size?: number
  /** Kesikli iç halka ve merkez göbeği — 24px altında okunmuyor, kapat. */
  detailed?: boolean
  className?: string
}

export function CompassMark({ size = 40, detailed = true, className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <circle cx="36" cy="36" r="32" fill="none" stroke="rgb(var(--gold))" strokeWidth={detailed ? 3 : 4} />
      {detailed && (
        <circle
          cx="36"
          cy="36"
          r="25"
          fill="none"
          stroke="rgb(var(--sea-light) / 0.35)"
          strokeWidth="1"
          strokeDasharray="2 5"
        />
      )}
      {/* Kuzey–güney kolu — altın */}
      <path d="M36 9 L42 36 L36 63 L30 36 Z" fill="rgb(var(--gold))" />
      {/* Doğu–batı kolu — deniz */}
      <path d="M9 36 L36 31 L63 36 L36 41 Z" fill="rgb(var(--sea-light) / 0.9)" />
      {detailed && (
        <circle cx="36" cy="36" r="5.5" fill="rgb(var(--ocean-deep))" stroke="rgb(var(--gold))" strokeWidth="2.5" />
      )}
    </svg>
  )
}

/* Wordmark — "ONE PIECE" (Cinzel) + "HUB" (Space Mono, geniş harf aralığı).
   `mr-[-0.4em]` hilesi: letter-spacing son harften sonra da boşluk bırakır,
   optik ortalama için o boşluk geri alınır. */
export function Wordmark({
  size = 'md',
  className,
}: {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  const scale = {
    sm: { name: 'text-[12px]', hub: 'text-[8px]', gap: 'gap-1' },
    md: { name: 'text-[15px]', hub: 'text-[9px]', gap: 'gap-1.5' },
    lg: { name: 'text-[22px]', hub: 'text-[11px]', gap: 'gap-2' },
  }[size]

  return (
    <span className={`inline-flex items-baseline ${scale.gap} ${className ?? ''}`}>
      <span className={`font-display font-bold tracking-[0.06em] text-pirate-text ${scale.name}`}>
        ONE PIECE
      </span>
      <span className={`font-mono font-bold tracking-[0.4em] text-gold mr-[-0.4em] ${scale.hub}`}>
        HUB
      </span>
    </span>
  )
}

/* İşaret + wordmark birlikte — header/footer/giriş kartı için tek parça. */
export function BrandLockup({
  markSize = 30,
  size = 'md',
  className,
}: {
  markSize?: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ''}`}>
      <CompassMark size={markSize} detailed={markSize >= 28} />
      <Wordmark size={size} />
    </span>
  )
}
