import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Haki Rehberi',
  description: 'Haki nedir? Kenbunshoku, Busoshoku ve Haoshoku Haki türleri, ileri formlar ve ustalar.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
