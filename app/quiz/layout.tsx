import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Quiz Arena',
  description: 'One Piece bilgini test et! Arc bazlı quizler ile bilgini sına ve skorunu gör.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
