import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dünya Haritası',
  description: 'One Piece dünya haritası — Grand Line, New World, denizler ve önemli lokasyonlar.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
