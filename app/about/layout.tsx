import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hakkında',
  description: 'One Piece Hub nedir? Platform özellikleri, istatistikler ve ekip hakkında bilgi.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
