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
        <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-fruit-strong/[0.08] blur-[100px]" />
        <div className="pointer-events-none absolute -left-32 -bottom-32 h-80 w-80 rounded-full bg-gold/[0.06] blur-[80px]" />

        <div className="relative mx-auto max-w-4xl text-center">
          <p className="eyebrow-lg mb-3 text-gold/70">
            Savaş Ansiklopedisi
          </p>
          {/* `text-white` + siyah drop-shadow light temada parşömen zeminde
              okunmuyordu; başlık token metin renginde, gölge ocean-deep'e
              bağlı — light'ta kendiliğinden sönüyor. */}
          <h1 className="mb-4 text-4xl font-extrabold text-pirate-text drop-shadow-[0_4px_24px_rgb(var(--ocean-deep)/0.6)] sm:text-5xl md:text-6xl">
            Teknikler & Yetenekler
          </h1>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-pirate-text/70 drop-shadow-[0_2px_8px_rgb(var(--ocean-deep)/0.4)] sm:text-base">
            Haki&apos;den Şeytan Meyvesi güçlerine, kılıç ustalığından özel savaş tekniklerine kadar One Piece evrenindeki <span className="font-mono font-bold text-gold">{techniques.length}+</span> yetenek.
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
