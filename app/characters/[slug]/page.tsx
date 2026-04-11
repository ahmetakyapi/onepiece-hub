import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { CHARACTERS, getCharacterBySlug } from '@/lib/constants/characters'
import CharacterDetailClient from '@/components/characters/CharacterDetail'

type Props = {
  params: { slug: string }
}

export function generateStaticParams() {
  return CHARACTERS.map((c) => ({ slug: c.slug }))
}

export function generateMetadata({ params }: Props): Metadata {
  const char = getCharacterBySlug(params.slug)
  if (!char) return { title: 'Karakter Bulunamadı' }
  return {
    title: char.name,
    description: char.description,
  }
}

export default function CharacterDetailPage({ params }: Props) {
  const char = getCharacterBySlug(params.slug)
  if (!char) notFound()

  return <CharacterDetailClient character={char} />
}
