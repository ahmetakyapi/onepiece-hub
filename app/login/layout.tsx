import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Giriş Yap',
  description: 'One Piece Hub hesabınıza giriş yapın — izleme takibi, quiz ve daha fazlası.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
