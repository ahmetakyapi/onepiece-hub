import type { Metadata } from 'next'
import PowerRankingClient from '@/components/power-ranking/PowerRankingClient'

/* Bkz. /power — bu sayfa radar chart'lı detaylı stat kırılımı, o tier listesi. */
export const metadata: Metadata = {
  title: 'Detaylı Stat Analizi',
  description:
    'One Piece karakterlerinin radar grafikli stat kırılımı — güç, hız, haki, meyve, zeka ve dayanıklılık karşılaştırması.',
}

export default function PowerRankingPage() {
  return <PowerRankingClient />
}
