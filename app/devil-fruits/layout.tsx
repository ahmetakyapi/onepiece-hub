import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Şeytan Meyveleri',
  description: 'One Piece şeytan meyveleri rehberi — Paramecia, Zoan, Logia tipleri ve yetenekleri.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
