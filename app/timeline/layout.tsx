import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Zaman Çizelgesi',
  description: 'One Piece kronolojik zaman çizelgesi — Void Century, büyük savaşlar ve önemli olaylar.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
