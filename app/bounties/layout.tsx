import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ödül Sıralaması',
  description: 'One Piece bounty sıralaması — korsanların ve suçluların ödül miktarları.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
