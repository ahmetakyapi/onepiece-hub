import type { Metadata } from 'next'
import PowerRankingClient from '@/components/power-ranking/PowerRankingClient'

export const metadata: Metadata = {
  title: 'Güç Sıralaması',
  description: 'One Piece karakterlerinin güç sıralaması ve detaylı stat karşılaştırması.',
}

export default function PowerRankingPage() {
  return <PowerRankingClient />
}
