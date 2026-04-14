import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Efsanevi Savaşlar',
  description: 'One Piece evrenindeki en ikonik savaşlar — Marineford, Enies Lobby ve daha fazlası.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
