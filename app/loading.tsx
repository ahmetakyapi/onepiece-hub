/* Rota yükleniyor — saf CSS (server component, JS beklemez).
   Pusula halkası çizilir, iğne salınarak arar, altında ilerleyen ışık.
   Açılış sekansı ve rota perdesiyle aynı görsel dil. */
export default function Loading() {
  return (
    <main className="flex min-h-[80vh] items-center justify-center px-4" aria-busy="true">
      <div role="status" className="flex flex-col items-center gap-6">
        <svg viewBox="0 0 72 72" className="h-20 w-20" fill="none" aria-hidden>
          <circle className="loader-ring" cx="36" cy="36" r="32" stroke="rgb(var(--gold))" strokeWidth="2.5" pathLength={1} />
          <circle cx="36" cy="36" r="25" stroke="rgb(var(--sea-light) / 0.3)" strokeWidth="1" strokeDasharray="2 5" />
          <g className="loader-needle">
            <path d="M36 9 L42 36 L36 63 L30 36 Z" fill="rgb(var(--gold))" />
            <path d="M9 36 L36 31 L63 36 L36 41 Z" fill="rgb(var(--sea-light) / 0.9)" />
            <circle cx="36" cy="36" r="5.5" fill="rgb(var(--ocean-deep))" stroke="rgb(var(--gold))" strokeWidth="2.5" />
          </g>
        </svg>
        <p className="eyebrow text-gold">Rotayı hesaplıyor</p>
        <span className="relative block h-px w-40 overflow-hidden bg-pirate-border/40" aria-hidden>
          <span className="loader-sweep absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-gold to-transparent" />
        </span>
      </div>
    </main>
  )
}
