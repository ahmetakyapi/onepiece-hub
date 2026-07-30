import type { Metadata } from 'next'
import { SITE_STATS } from '@/lib/constants/stats'

export const metadata: Metadata = {
  title: 'Karakterler',
  description: `One Piece karakter ansiklopedisi — ${SITE_STATS.characters} karakter, mürettebat bilgileri ve yetenekler.`,
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
