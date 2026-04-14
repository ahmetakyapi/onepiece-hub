import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Karakterler',
  description: 'One Piece karakter ansiklopedisi — 65+ karakter, mürettebat bilgileri ve yetenekler.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
