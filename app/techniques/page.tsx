import type { Metadata } from 'next'
import { CHARACTERS } from '@/lib/constants/characters'
import TechniqueGrid, { type TechniqueEntry } from '@/components/techniques/TechniqueGrid'

export const metadata: Metadata = {
  title: 'Teknikler & Yetenekler',
  description: 'Tüm karakterlerin kullandığı Haki, Şeytan Meyvesi, Kılıç ve özel savaş teknikleri.',
}

export default function TechniquesPage() {
  // Build-time aggregation — zero runtime cost
  const techniques: TechniqueEntry[] = []

  for (const char of CHARACTERS) {
    for (const ability of char.abilities) {
      techniques.push({
        name: ability.name,
        description: ability.description,
        category: ability.category || 'Özel',
        characterSlug: char.slug,
        characterName: char.name,
        characterImage: char.image,
      })
    }
  }

  // Sort alphabetically within category for consistency
  techniques.sort((a, b) => a.name.localeCompare(b.name, 'tr'))

  return (
    <main className="min-h-screen bg-ocean-deep">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-pirate-border/20 bg-gradient-to-b from-ocean-surface/60 via-ocean-deep to-ocean-deep px-6 py-20 sm:py-28">
        <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-purple-500/[0.08] blur-[100px]" />
        <div className="pointer-events-none absolute -left-32 -bottom-32 h-80 w-80 rounded-full bg-gold/[0.06] blur-[80px]" />

        <div className="relative mx-auto max-w-4xl text-center">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.25em] text-gold/70">
            Savaş Ansiklopedisi
          </p>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.7)] sm:text-5xl md:text-6xl">
            Teknikler & Yetenekler
          </h1>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-white/70 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] sm:text-base">
            Haki'den Şeytan Meyvesi güçlerine, kılıç ustalığından özel savaş tekniklerine kadar One Piece evrenindeki {techniques.length}+ yetenek.
          </p>
        </div>
      </section>

      {/* Grid Section */}
      <section className="relative px-6 py-12 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <TechniqueGrid techniques={techniques} />
        </div>
      </section>
    </main>
  )
}
