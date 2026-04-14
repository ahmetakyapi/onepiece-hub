import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'İzleme Rehberi',
  description: 'One Piece nereden izlenir? Filler-sız izleme sırası, Netflix yolu ve saga rehberi.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
