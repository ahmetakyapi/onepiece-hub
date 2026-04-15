import type { Metadata } from 'next'
import WantedPosterCreator from '@/components/wanted-poster/WantedPosterCreator'

export const metadata: Metadata = {
  title: 'Wanted Poster Oluşturucu',
  description: 'Kendi One Piece wanted poster\'ını oluştur! Fotoğrafını yükle, ismini ve ödülünü belirle.',
}

export default function WantedPosterPage() {
  return <WantedPosterCreator />
}
