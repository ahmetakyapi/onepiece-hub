import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Arama',
  description: 'One Piece Hub içinde karakter, arc, savaş, şeytan meyvesi ve lokasyon arayın.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
