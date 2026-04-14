import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mürettebatlar',
  description: 'One Piece mürettebat ve organizasyonları — Hasır Şapka, Yonko, Deniz Kuvvetleri ve daha fazlası.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
